// tests/e2e/flow.spec.ts
import { test, expect } from '@playwright/test'

test('submit content appears in queue', async ({ page, request }) => {
  // Pipe browser logs to CI output for easier debugging
  page.on('console', (msg) => console.log(`[browser:${msg.type()}]`, msg.text()))
  page.on('pageerror', (err) => console.error('[pageerror]', err?.message || err))

  // --- make data unique so we don't collide with prior runs ---
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2,6)}`
  const email = `u1-${suffix}@demo.dev`
  const txt = `spam clickbait ${suffix}`

  // Register a unique user and get a token
  const reg = await request.post('/api/auth/register', {
    data: { email, name: 'U1', password: 'password123' }
  }).then(r => r.json())
  const userToken = reg.token

  // Create the pending item via API with the UNIQUE text
  await request.post('/api/items', {
    headers: { Authorization: `Bearer ${userToken}` },
    data: { type: 'text', payload: { text: txt } }
  })

  // Become moderator (dev helper endpoint)
  const { token: modToken } = await request
    .get('/api/dev/loginAs?role=moderator')
    .then(r => r.json())

  // Visit queue as moderator
  await page.goto('/login')
  await page.evaluate(t => localStorage.setItem('token', t), modToken)
  await page.goto('/queue')
  await page.waitForLoadState('networkidle')
  await expect(page.getByText('Moderator Queue')).toBeVisible()

  // Find the exact row containing *this* unique text
  const rows = page.getByTestId('queue-item').filter({ hasText: txt })
  await expect(rows, 'newly submitted item should appear in pending queue')
    .toHaveCount(1, { timeout: 10000 })

  // Optional: assert the visible cell text matches exactly
  await expect(rows.first().getByTestId('queue-text')).toContainText(txt)
})

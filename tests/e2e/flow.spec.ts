// tests/e2e/flow.spec.ts
import { test, expect } from '@playwright/test'

test('submit content appears in queue', async ({ page, request }) => {
  // Capture browser console and page errors for CI diagnostics
  page.on('console', (msg) => {
    // Forward all console logs from the browser to the test output
    // eslint-disable-next-line no-console
    console.log(`[browser:${msg.type()}]`, msg.text())
  })
  page.on('pageerror', (err) => {
    // eslint-disable-next-line no-console
    console.error('[pageerror]', err?.message || err)
  })
  // Register or login a user
  const r = await request.post('/api/auth/register', {
    data: { email: 'u1@demo.dev', name: 'U1', password: 'password123' }
  })
  const reg = await r.json()
  const token = reg.token

  // Submit flagged content
  await request.post('/api/items', {
    headers: { Authorization: `Bearer ${token}` },
    data: { type: 'text', payload: { text: 'this is spam clickbait' } }
  })

  // Go to queue (requires moderator: use dev login endpoint to get a mod token if needed)
  const mod = await request.get('/api/dev/loginAs?role=moderator')
  const { token: modToken } = await mod.json()

  // Inject token into browser localStorage
  await page.goto('/login')
  await page.evaluate((t) => localStorage.setItem('token', t), modToken)

  await page.goto('/queue')
  // Give hydration/network a brief moment before asserting
  await page.waitForLoadState('networkidle')
  await expect(page.getByText('Moderator Queue')).toBeVisible()

  // Wait a moment and reload to see new item
  await page.waitForTimeout(800)
  await page.reload()
  await expect(page.getByText('spam clickbait')).toBeVisible()
})

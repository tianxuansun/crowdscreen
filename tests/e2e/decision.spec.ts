import { test, expect } from '@playwright/test'

test('moderator decision updates status & leaves pending list', async ({ page, request }) => {
  // Make everything unique for this test run
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2,6)}`
  const txt = `very spam clickbait ${suffix}`

  // Register a unique user so retries don’t collide
  const reg = await request.post('/api/auth/register', {
    data: { email: `u-${suffix}@demo.dev`, name: 'U', password: 'password123' }
  }).then(r => r.json())
  const token = reg.token

  // Create the pending item with unique text
  await request.post('/api/items', {
    headers: { Authorization: `Bearer ${token}` },
    data: { type: 'text', payload: { text: txt } }
  })

  // Become moderator
  const { token: modToken } = await request.get('/api/dev/loginAs?role=moderator').then(r => r.json())

  // Open queue as moderator
  await page.goto('/login')
  await page.evaluate(t => localStorage.setItem('token', t), modToken)
  await page.goto('/queue')
  await page.waitForLoadState('networkidle')

  // Find the exact row for *this* item
  const rows = page.getByTestId('queue-item').filter({ hasText: txt })
  await expect(rows, 'spam row should appear in pending queue').toHaveCount(1, { timeout: 10000 })
  const row = rows.first()

  // Approve within that row and wait for the API call
  const postDecision = page.waitForResponse(r =>
    r.url().includes('/api/decisions') && r.request().method() === 'POST'
  )
  await row.getByTestId('queue-approve').click()
  await postDecision

  // It should disappear from pending
  await expect(page.getByTestId('queue-item').filter({ hasText: txt })).toHaveCount(0)
})

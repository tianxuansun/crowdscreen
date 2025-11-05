import { test, expect } from '@playwright/test'

test('dev moderator sees queue updates', async ({ page }) => {
  // Dev helper: set a cookie to simulate moderator
  await page.request.post('/api/dev/loginAs?role=moderator')

  await page.goto('/queue')
  await expect(page.getByText('Moderator Queue')).toBeVisible()

  // Submit an item via API (simulate another user)
  const res = await page.request.post('/api/auth/register', {
    data: { email: 'u1@demo.dev', name: 'U1', password: 'password123' }
  })
  const { token } = await res.json()
  await page.request.post('/api/items', {
    headers: { Authorization: `Bearer ${token}` },
    data: { type: 'text', payload: { text: 'this is spam clickbait' } }
  })

  // Queue should show the item after socket/refresh (allow a moment)
  await page.waitForTimeout(1000)
  await page.reload()
  await expect(page.getByText('spam clickbait')).toBeVisible()
})

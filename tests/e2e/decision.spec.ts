import { test, expect } from '@playwright/test'

test('moderator decision updates status & leaves pending list', async ({ page, request }) => {
  const reg = await request.post('/api/auth/register', {
    data: { email: 'u2@demo.dev', name: 'U2', password: 'password123' }
  }).then(r => r.json())
  const token = reg.token

  await request.post('/api/items', {
    headers: { Authorization: `Bearer ${token}` },
    data: { type: 'text', payload: { text: 'very spam clickbait' } }
  })

  const mod = await request.get('/api/dev/loginAs?role=moderator')
  const { token: modToken } = await mod.json()

  await page.goto('/login')
  await page.evaluate(t => localStorage.setItem('token', t), modToken)
  await page.goto('/queue')
  await page.waitForLoadState('networkidle')

  await page.getByRole('button', { name: 'Approve' }).first().click()
  await page.reload()
  await expect(page.getByText('very spam clickbait')).toHaveCount(0)
})

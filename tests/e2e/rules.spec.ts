import { test, expect } from '@playwright/test'

test('moderator can create/toggle/delete a keyword rule', async ({ page, request }) => {
  // Get a moderator token via dev endpoint (allowed in CI/dev)
  const mod = await request.get('/api/dev/loginAs?role=moderator')
  const { token: modToken } = await mod.json()

  // Visit /rules with token
  await page.goto('/login')
  await page.evaluate((t) => localStorage.setItem('token', t), modToken)
  await page.goto('/rules')
  await expect(page.getByText('Existing Rules')).toBeVisible()

  // Add a rule
  await page.getByPlaceholder('Rule name *').fill('CI Keyword Rule')
  await page.getByRole('combobox').selectOption('keyword')
  await page.getByPlaceholder('Keywords (comma-separated)').fill('autotest')
  await page.getByRole('button', { name: 'Add Rule' }).click()

  // Check it appears
  await expect(page.getByText('CI Keyword Rule')).toBeVisible()

  // Toggle it
  const item = page.getByText('CI Keyword Rule').locator('..').locator('..')
  await item.getByRole('button', { name: /Disable|Enable/ }).click()

  // Delete it
  await item.getByRole('button', { name: 'Delete' }).click()
})

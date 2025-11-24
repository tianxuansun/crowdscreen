// tests/e2e/rules.spec.ts
import { test, expect } from '@playwright/test';

test('moderator can create/toggle/delete a keyword rule', async ({ page, request }) => {
  // Get a moderator token via dev endpoint (CI bypass already allowed)
  const res = await request.get('/api/dev/loginAs?role=moderator');
  const { token } = await res.json();

  // Inject token and open Rules
  await page.goto('/login');
  await page.evaluate((t) => localStorage.setItem('token', t), token);
  await page.goto('/rules');
  await page.waitForLoadState('networkidle');

  // Create the rule
  await page.getByPlaceholder('Rule name *').fill('CI Keyword Rule');
  await page.getByRole('combobox').selectOption('keyword');
  await page.getByPlaceholder('Keywords (comma-separated)').fill('ci, robot');
  await page.getByRole('button', { name: 'Add Rule' }).click();

  // Find just the card that contains our new rule by text
  const item = page.getByTestId('rule-item').filter({ hasText: 'CI Keyword Rule' });
  await expect(item).toHaveCount(1);

  // Toggle it (scoped to that one card)
  await item.getByTestId('rule-toggle').click();

  // Delete it (still scoped)
  await item.getByTestId('rule-delete').click();

  // Verify it’s gone
  await expect(page.getByText('CI Keyword Rule')).toHaveCount(0);
});

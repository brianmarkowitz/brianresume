import { expect, test } from '@playwright/test'

test('loads architecture view and opens node details', async ({ page }) => {
  await page.goto('/?mode=architecture&node=system-idpcc')

  await expect(page.getByRole('heading', { name: /principal data architect and functional manager/i })).toBeVisible()
  await expect(page.getByRole('tab', { name: /architecture view/i })).toHaveAttribute('aria-selected', 'true')

  await expect(page.getByRole('heading', { name: /iDPCC \/ CEIRR Platform/i }).first()).toBeVisible()
  await expect(page.getByRole('heading', { name: /impact metrics/i }).first()).toBeVisible()

  await page.getByRole('tab', { name: /impact view/i }).click()
  await expect(page).toHaveURL(/mode=impact/)
})

import { expect, test } from '@playwright/test'

test('ERD browser loads selected table and supports relationship navigation', async ({ page }) => {
  await page.goto('/?table=employee')

  await expect(page.getByRole('navigation', { name: /primary/i })).toBeVisible()
  await expect(page.getByRole('tab', { name: 'Standard Resume' })).toBeVisible()
  await expect(page.getByText('Control Mode')).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'employee' })).toBeVisible()
  await expect(page.getByText('Primary profile record for the resume owner.')).toBeVisible()

  await page.getByTestId('rf__edge-employee-projects').dispatchEvent('click')

  await expect(page).toHaveURL(/table=projects/)
  await expect(page.getByRole('heading', { level: 2, name: 'projects' })).toBeVisible()

  await page.locator('.erd-chip-button', { hasText: 'employee' }).first().click()

  await expect(page).toHaveURL(/table=employee/)
  await expect(page.getByRole('heading', { level: 2, name: 'employee' })).toBeVisible()

  await page.getByRole('tab', { name: 'Standard Resume' }).click()

  await expect(page).toHaveURL(/view=resume/)
  await expect(page.getByRole('heading', { level: 1, name: 'Brian Markowitz' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: 'Experience' })).toBeVisible()
})

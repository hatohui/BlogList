const { test, expect, beforeEach, describe } = require('@playwright/test')

const URL = 'http://localhost:3001'

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'test',
        username: 'admin',
        password: 'test'
      }
    })

    await page.goto(URL)
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('Login to application')
    await expect(locator).toBeVisible()
  })
})

describe('Login', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'test',
        username: 'admin',
        password: 'test'
      }
    })

    await page.goto(URL)
  })

  test('succeeds with correct credentials', async ({ page }) => {
    await page.getByRole('textbox').first().fill('admin')
    await page.getByRole('textbox').last().fill('test')
    await page.getByRole('button').click()

    await expect(page.getByText('Log out')).toBeVisible()
  })

  test('fails with wrong credentials', async ({ page }) => {
    await page.getByRole('textbox').first().fill('root')
    await page.getByRole('textbox').last().fill('pword')
    await page.getByRole('button').click()

    await expect(page.getByText('invalid username or password')).toBeVisible()
  })
})

describe('When logged in', () => {

})
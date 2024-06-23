const { test, expect, beforeEach, describe } = require('@playwright/test')
const {loginWith, createBlog} = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'test',
        username: 'admin',
        password: 'test'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('Login to application')
    await expect(locator).toBeVisible()
  })
})

describe('Login', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'test',
        username: 'admin',
        password: 'test'
      }
    })

    await page.goto('/')
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
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'test',
        username: 'admin',
        password: 'test'
      }
    })

    await page.goto('/')
    await loginWith(page, 'admin', 'test')
  })

  test('logged in as soon as test start', async ({page}) => {
    await expect(page.getByText('Log out')).toBeVisible()
  })

  test('can create a new blog', async ({page}) => {
    await createBlog(page, "Stuupid Zarachy", "ColonDHappyFace", "onlyfan.next")
    await expect(page.getByText("Stuupid Zarachy ColonDHappyFace")).toBeVisible()
  })
})
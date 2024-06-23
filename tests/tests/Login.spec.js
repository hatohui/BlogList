const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')
const { lookupService } = require('dns')
const { title } = require('process')

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

    await request.post('/api/users', {
      data: {
        name: 'test2',
        username: 'admin2',
        password: 'test'
      }
    })

    await page.goto('/')
    await loginWith(page, 'admin', 'test')
  })

  test('logged in as soon as test start', async ({ page }) => {
    await expect(page.getByText('Log out')).toBeVisible()
  })

  test('can create a new blog', async ({ page }) => {
    await createBlog(page, "Stuupid Zarachy", "ColonDHappyFace", "onlyfan.next")
    await expect(page.getByText("Stuupid Zarachy ColonDHappyFace")).toBeVisible()
  })

  test('a blog can be liked', async ({ page }) => {
    await createBlog(page, "Stuupid Zarachy", "ColonDHappyFace", "onlyfan.next")
    await page.getByText('View').click()
    await page.getByTestId('like').click()
    await expect(page.getByText('Likes 1')).toBeVisible()
  })

  test('user with valid permission can delete', async({page}) => {
    await createBlog(page, "Stuupid Zarachy", "ColonDHappyFace", "onlyfan.next")
    await page.getByText('View').click()
    page.on('dialog',async dialog => await dialog.accept());
    await page.getByTestId('delete').click()
    const stuff = page.getByText("Stuupid Zarachy")
    await expect(stuff).not.toHaveText("Stuupid Zarachy")
  })

  test('only user created the blog can see the delete button', async({page}) => {
    await createBlog(page, "Stuupid Zarachy", "ColonDHappyFace", "onlyfan.next")
    await page.getByText('Log out').click()
    await loginWith(page, 'admin2', 'test')
    await page.getByText('View').click()
    expect(page.getByTestId('delete')).not.toBeVisible()
  })

  test.only('blogs are sorted by likes', async({page}) => {
    await createBlog(page, "Second", "ColonDHappyFace", "onlyfan.next")
    await createBlog(page, "Third", "ColonDHappyFace", "onlyfan.next")
    await createBlog(page, "First", "ColonDHappyFace", "onlyfan.next")
    const viewButtons = await page.getByRole('button', {name: 'View'}).all()
    await viewButtons[0].click()
    await page.getByText('Title: Second').waitFor()
    await viewButtons[1].click()
    await page.getByText('Title: First').waitFor()
    await page.getByText('View').click()
    await page.getByText('Title: Third').waitFor()
    const likeButtons = await page.getByTestId('like').all()
    await likeButtons[0].click()
    await expect(page.getByText('Likes 1')).toBeVisible()
    await likeButtons[2].click({delay: 500, clickCount: 2})
    await likeButtons[2].click({delay: 500, clickCount: 2})
    await expect(page.getByText('Likes 2')).toBeVisible()
    await page.getByText('Most Liked').click()
    const titles = await page.getByText("Title: ").allTextContents()
    expect(titles).toStrictEqual(['Title: First', 'Title: Second', 'Title: Third'])
  })
})
const loginWith = async(page, username, password) => {
    await page.getByRole('textbox').first().fill(username)
    await page.getByRole('textbox').last().fill(password)
    await page.getByRole('button').click()

    await page.getByText('Log out').waitFor()
}

const createBlog = async (page, title, author, url) => {
    await page.getByText('Create new blog').click()
    await page.getByTestId('title').fill(title)
    await page.getByTestId('author').fill(author)
    await page.getByTestId('url').fill(url)
    await page.getByTestId('submit').click()

    await page.getByText(`${title} ${author}`).waitFor()
}

export {loginWith, createBlog}
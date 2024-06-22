import {render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../components/Blog'
import BlogCreation from '../components/BlogCreation'

//testing render
test('render Blogs with only title and author by default', () => {
    const user = {
        "username": "test"
    }

    const blog = {
        "title": "test blog la",
        "author": "hatohui",
        "url": "google.com",
        "likes": 123,
        "user": {
            "username": "test"
        }
    }

    render(<Blog blog={blog} user={user}/>)

    const element = screen.getByText("test blog la hatohui")
    expect(element).toBeDefined()
})

//test URL
test('Click button view shows all details', async () => {
    const user = {
        "username": "test"
    }

    const blog = {
        "title": "test blog la",
        "author": "hatohui",
        "url": "google.com",
        "likes": 123,
        "user": {
            "username": "test"
        }
    }

    //render
    render(<Blog blog={blog} user={user}/>)

    //handle logic
    const event = userEvent.setup()
    const button = screen.getByText('View')
    await event.click(button)

    screen.getByText('Link: google.com')
    screen.getByText('Likes 123')
})

//test like button
test('Clicking likes 2 times call the function 2 times', async () => {
    const user = {
        "username": "test"
    }

    const blog = {
        "title": "test blog la",
        "author": "hatohui",
        "url": "google.com",
        "likes": 123,
        "user": {
            "username": "test"
        }
    }

    const mockHandler = vi.fn()

    //render
    render(<Blog blog={blog} user={user} handleLike={mockHandler} />)

    const event = userEvent.setup()
    const viewButton = screen.getByText('View')
    await event.click(viewButton)

    const likeButton = screen.getByText('Like')
    await event.click(likeButton)
    await event.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
})

//test form

test('submitting form call the prop with correct details', async () => {
    const mock = vi.fn()
    const user = userEvent.setup()
    const {container} = render(<BlogCreation handleBlogCreation={mock}/>)

    const title = container.querySelector('#title')
    const author = container.querySelector('#author')
    const url = container.querySelector('#url')
    const button = screen.getByText('BLOG')

    await user.type(title, "testTitle")
    await user.type(author, 'testAuthor')
    await user.type(url, 'testLink')

    await user.click(button)
    
    expect(mock.mock.calls).toHaveLength(1)
    console.log(mock.mock.calls)
    expect(mock.mock.calls[0][0].title).toBe('testTitle')
    expect(mock.mock.calls[0][0].author).toBe('testAuthor')
    expect(mock.mock.calls[0][0].url).toBe('testLink')
})

import Blog from '../components/Blog'
import { useState, useEffect } from 'react'
import blogService from '../services/blogs'
import Notification from '../components/Notification'
import Button from '../components/Button'

const errorMessage = message => {
    const newMessage = message.split(',')
    const newList = newMessage.map(each => {
        const str = each.split(':')
        return str.length === 3 ? str[2].trim() : str[1].trim()
    })
    return newList.join('\n')
}

const BlogCreation = ({ setMessage, blogs, setBlogs, setCreateView }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handleBlogCreation = async (event) => {
        event.preventDefault()

        const newBlog = {
            "title": title,
            "author": author,
            "url": url
        }
        try {
            const response = await blogService.create(newBlog)
            setBlogs(blogs.concat(response))

            setTitle("")
            setAuthor('')
            setUrl('')
            setCreateView(false)

            setMessage(`New blog titled ${response.title} by ${response.author} has been added!`)
            setTimeout(() => {
                setMessage(null)
            }, 5000)

        } catch (error) {
            setMessage(errorMessage(error.response.data.error))
            setTimeout(() => {
                setMessage(null)
            }, 5000)
        }
    }

    return <form onSubmit={handleBlogCreation}>
        <h3>Create a new blog</h3>
        <p>Title  <input type='text' value={title} onChange={({ target }) => setTitle(target.value)}></input></p>
        <p>Author <input type='text' value={author} onChange={({ target }) => setAuthor(target.value)}></input></p>
        <p>Link  <input type='text' value={url} onChange={({ target }) => setUrl(target.value)}></input></p>
        <button type='submit' > BLOG </button>
    </form>
}

const BlogList = ({ blogs, handleDelete }) => {
    if (!blogs.length) return null
    return <div>
        {blogs.map(blog =>
            <Blog key={blog.id} value={blog.id} blog={blog} handleDelete={handleDelete} />
        )}
    </div>
}

const BlogDisplay = ({ user, setUser }) => {
    const [blogs, setBlogs] = useState([])
    const [createView, setCreateView] = useState(false)
    const [message, setMessage] = useState(null)
    const message1 = 'Create new Blog'
    const message2 = 'Hide new blog Creation'

    useEffect(() => {
        blogService.getAll()
            .then(data => {
                setBlogs(data)
            })
    }, [])

    const handleLogOut = (event) => {
        setUser(null)
        blogService.setToken(null)
        window.localStorage.removeItem('loggedInUser')
    }

    const handleDelete = async (event) => {
        const id = event.target.value
        const blog = await blogService.getById(id)

        if (!window.confirm(`Do you want to delete blog titled ${blog.title}?`))
            return

        try {
            const response = await blogService.remove(event.target.value)
            setBlogs(blogs.filter(each => each.id != response.id))
            setMessage('Successfully removed blog!')
            setTimeout(() => {
                setMessage(null)
            }, 5000)
        } catch (error) {
            setMessage(error.response.data.error)
            setTimeout(() => {
                setMessage(null)
            }, 5000)
        }
    }

    return (
        <div>
            <h2>Blogs</h2>
            <Notification message={message} />
            <p>Logged in as {user.name} <button onClick={handleLogOut}> Log out</button></p>
            <Button view={createView} setView={setCreateView}
                message1={message2}
                message2={message1} />
            {createView ? <BlogCreation setMessage={setMessage} blogs={blogs} setBlogs={setBlogs}
                setCreateView={setCreateView} />
                : null}
            <p>Contents</p>
            <BlogList blogs={blogs} handleDelete={handleDelete} />
        </div>
    )
}

export default BlogDisplay
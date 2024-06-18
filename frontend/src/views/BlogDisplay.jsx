import BlogList from '../components/BlogList'
import { useState, useEffect, useRef } from 'react'
import blogService from '../services/blogs'
import Notification from '../components/Notification'
import Togglable from '../components/Togglable'
import BlogCreation from '../components/BlogCreation'

const BlogDisplay = ({ user, setUser }) => {
    const [blogs, setBlogs] = useState([])
    const [message, setMessage] = useState(null)

    const viewRef = useRef()

    useEffect(() => {
        blogService.getAll()
            .then(data => {
                setBlogs(data)
            })
    }, [])

    const handleLogOut = () => {
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
            <Togglable label="Create new blog" ref={viewRef}>
                <BlogCreation setMessage={setMessage}
                    blogs={blogs} setBlogs={setBlogs} viewRef={viewRef}
                />
            </Togglable>
            <p>Contents</p>
            <BlogList blogs={blogs} user={user} setMessage={setMessage} handleDelete={handleDelete}/>
        </div>
    )
}

export default BlogDisplay
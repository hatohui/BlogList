import { useState } from "react"
import blogService from '../services/blogs'

const errorMessage = message => {
    const newMessage = message.split(',')
    const newList = newMessage.map(each => {
        const str = each.split(':')
        return str.length === 3 ? str[2].trim() : str[1].trim()
    })
    return newList.join('\n')
}

const BlogCreation = ({ setMessage, blogs, setBlogs, viewRef}) => {
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
            viewRef.current.toggleVisibility()

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

export default BlogCreation
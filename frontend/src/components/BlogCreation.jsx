import { useState } from "react"

const BlogCreation = ({ handleBlogCreation, viewRef }) => {
    const [blogToCreate, setBlogToCreate] = useState({
        title: '',
        author: '',
        url: ''
    })

    const handleChange = (event) => {
        setBlogToCreate({
            ...blogToCreate,
            [event.target.id]: event.target.value
        })
    }

    const createBlog = (event) => {
        event.preventDefault()
        handleBlogCreation(blogToCreate)
        setBlogToCreate({
            title: '',
            author: '',
            url: ''
        })
    }

    return <form onSubmit={createBlog}>
        <h3>Create a new blog</h3>
        <p>Title  <input id='title' type='text' value={blogToCreate.title} onChange={handleChange}></input></p>
        <p>Author <input id='author' type='text' value={blogToCreate.author} onChange={handleChange}></input></p>
        <p>Link   <input id='url' type='text' value={blogToCreate.url} onChange={handleChange}></input></p>
        <button type='submit' > BLOG </button>
    </form>
}

export default BlogCreation
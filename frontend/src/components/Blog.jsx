import { useState } from "react"
import blogService from '../services/blogs'

const buttonStyle = {
  maxHeight: '2em',
  color: 'white',
  border: '0.5px blue solid',
  background: 'purple',
  display: 'inline-flex',
}

const blogStyle = {
  border: '1px black solid',
  justifyContent: 'center',
  padding: 5,
  maxWidth: 700,
  margin: 'auto auto',
  marginBottom: 10,
  textAlign: 'center',
  gap: 10
}

const FullView = ({ blog, handleDelete, user }) => {
  const currentUser = user.username
  const currentBlogUser = blog.user.username

  const [like, setLike] = useState(blog.likes)

  const handleLike = async (event) => {
    const id = event.target.value

    const toAdjust = {
      "title": blog.title,
      "url": blog.url,
      "author": blog.author,
      "likes": like + 1,
    }

    try {
      const response = await blogService.update(id, toAdjust)
      setLike(response.likes)
    } catch (error) {
      console.log(error.response.data)
    }
  }

  return <div>
    <p>Title: {blog.title}</p>
    <p>Link: {blog.url}</p>
    <p>Likes {like}  <button onClick={handleLike} value={blog.id}> Likes </button></p>
    <p>By {blog.author}</p>
    {currentUser === currentBlogUser ? <button style={buttonStyle}
      value={blog.id} onClick={handleDelete}> Delete
    </button> : null}
  </div>
}

const Blog = ({ blog, setMessage, handleDelete, user }) => {
  const [view, setView] = useState(true)

  return <div style={blogStyle}>
    {view ? `${blog.title} ${blog.author}    `
      : <FullView user={user} blog={blog} setMessage={setMessage} handleDelete={handleDelete} />}
    <button style={buttonStyle} value={view} onClick={() => setView(!view)}>
      {view ? 'View' : 'Hide'}
    </button>
  </div>
}

export default Blog
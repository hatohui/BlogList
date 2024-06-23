import { useState } from "react"

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

const Blog = ({ blog, handleDelete, handleLike, user }) => {
  const [view, setView] = useState(true)
  const currentUser = user.username
  const currentBlogUser = blog.user.username

  return <div style={blogStyle}>
    {
      view ? `${blog.title} ${blog.author}`
        : <div>
          <p>Title: {blog.title}</p>
          <p>Link: {blog.url}</p>
          <p>Likes {blog.likes}  <button data-testId='like' onClick={handleLike} value={blog.id}> Like </button></p>
          <p>By {blog.author}</p>
          {currentUser === currentBlogUser ? <button data-testId='delete' style={buttonStyle} value={blog.id} onClick={handleDelete}> Delete </button>
            : null}
        </div>
    }
    <div />
    <button style={buttonStyle} value={view} onClick={() => setView(!view)}>
      {view ? 'View' : 'Hide'}
    </button>
  </div>
}

export default Blog
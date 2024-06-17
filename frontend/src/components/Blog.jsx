const Blog = ({ blog, value, handleDelete}) => {
  return <div>
    {blog.title} {blog.author} <button value={value} onClick={handleDelete}> Delete</button>
  </div>  
}

export default Blog
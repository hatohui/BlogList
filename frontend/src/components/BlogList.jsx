import Blog from './Blog'
import { useState } from 'react'

const BlogList = ({ blogs, handleDelete, user}) => {
    if (!blogs.length) return null
    const [sortByLikes, setSortByLikes] = useState(false)
    
    const toShow = sortByLikes ? JSON.parse(JSON.stringify(blogs))
                                .sort((first, second)=>second.likes - first.likes)
                                : blogs
    
    return <div>
        <div>
            <button onClick={() => setSortByLikes(!sortByLikes)}> Most Liked</button>
        </div>
        {toShow.map(blog =>
            <Blog handleDelete={handleDelete} key={blog.id} blog={blog} user={user} />
        )}
    </div>
}

export default BlogList
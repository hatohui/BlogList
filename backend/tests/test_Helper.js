const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        "title": "Test 1",
        "author": "Test 1",
        "url": "Test 1",
        "likes": 1234
    },
    {
        "title": "Test 2",
        "author": "Test 2",
        "url": "Test 2",
        "likes": 1234
    }
]

const initialUser = {
    "username": "root",
    "name": "root",
    "password": "$2b$10$IVIltwFHkYiAIVd/3mb2DudOUPT3.awln58ensneb3DJO8akNRFDi"
}

const nonExistingId = async () => {
    const blog = new Blog({title: "for removal"})
    await blog.save()
    await blog.deleteOne()
    return blog._id.toString()
}

const usersInDB = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

const blogsinDB = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialUser,
    initialBlogs,
    nonExistingId,
    blogsinDB,
    usersInDB
}
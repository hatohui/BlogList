const Blog = require('../models/blog')
const User = require('../models/user')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)

const initialBlogs = [
    {
        "title": "Test 1",
        "author": "Test 1",
        "url": "Test 1",
        "likes": 1234
    }
]

const initialUser = {
    "username": "root",
    "name": "root",
    "password": "password"
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

const getToken = async () => {
    const response = await api.post('/api/login')
                        .send(userLogin)
    return "Bearer " + response.body.token;
}

const userLogin = {
    "username": initialUser.username,
    "password": initialUser.password
}

const getUserId = async () => {
    const response = await User.find({})
    return response[0].id
}

module.exports = {
    getUserId,
    getToken,
    userLogin,
    initialUser,
    initialBlogs,
    nonExistingId,
    blogsinDB,
    usersInDB
}
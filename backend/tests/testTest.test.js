const { test, describe, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_Helper')
const assert = require('node:assert')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const api = supertest(app)

beforeEach( async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
})

test('An user is created!', async() => {
    const usersBefore = await helper.usersInDB()

    await api.post('/api/users')
            .send(helper.initialUser)
            .expect(201)

    const usersAfter = await helper.usersInDB()
    assert.strictEqual(usersBefore.length + 1, usersAfter.length)
})

test('User can login and a token is returned', async () => {
    await api.post('/api/users')
        .send(helper.initialUser)
        .expect(201)
    
    const userLogin = {
        "username": helper.initialUser.username,
        "password": helper.initialUser.password
    }
    
    const result = await api.post('/api/login')
                            .send(userLogin)

    assert(result.body.token)
})

test('Authorized users can create new blogs', async () => {
    await api.post('/api/users')
        .send(helper.initialUser)
        .expect(201)

    const blogsBefore = await Blog.find({})
    
    const userLogin = {
        "username": helper.initialUser.username,
        "password": helper.initialUser.password
    }
    
    const result = await api.post('/api/login')
                            .send(userLogin)

    const token = "Bearer " + result.body.token;
    
    const user = await api.get('/api/users')
    const toSend = {
        "title": helper.initialBlogs[0].title,
        "author": helper.initialBlogs[0].author,
        "url": helper.initialBlogs[0].url,
        "user": user.body[0]._id
    }

    await api.post('/api/blogs')
            .send(toSend)
            .set('Authorization', token)
            .expect(201)

    const blogsAfter = await Blog.find({})
    
    assert.strictEqual(blogsBefore.length, blogsAfter.length - 1)
})

after(async () => {
    await mongoose.connection.close()
})
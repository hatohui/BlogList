const { test, describe, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_Helper')
const assert = require('node:assert')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)

//handle data returned
describe('data returned correctly', () => {
    //initializes before each
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })

    //json test
    test('blog are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-type', /application\/json/)
    })

    //all blogs are returned
    test('all blogs are returned', async () => {
        const returned = await api.get('/api/blogs')
        assert.strictEqual(returned.body.length, helper.initialBlogs.length)
    })

    //amount of data in the database
    test(`there are only two blogs in the database`, async () => {
        const returned = await api.get('/api/blogs')
        assert.strictEqual(returned.body.length, helper.initialBlogs.length)
    })

    //contain ID and is converted to string instead of object
    test('blogs are identified by "id" and is string', async () => {
        const returned = await api.get('/api/blogs')
        const contents = returned.body
        if (!contents.length) return
        assert(contents[0].hasOwnProperty("id"))
    })
})


//handle POST requests
describe('POST verifications', () => {
    //initializes before each
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })

    //POST with invalid blog
    test('Invalid blogs are not posted', async () => {
        const newBlog = {
            "title": "TestBlog",
            "likes": 1245
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    
        const returned = await helper.blogsinDB()
        assert.strictEqual(helper.initialBlogs.length, returned.length)
    })

    //POST with valid blog
    test('POST successfully with a valid blog.', async () => {
        const newBlog = {
            "title": "TestBlog",
            "author": "Hi ITS' ME",
            "url": "walaoeh",
            "likes": 1245
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const blogsAtEnd = await helper.blogsinDB()
        assert.deepStrictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    })
    
    //new POST data correctly
    test('POST data is saved correctly.', async () => {
        const newBlog = {
            "title": "TestBlog",
            "author": "Hi ITS' ME",
            "url": "walaoeh",
            "likes": 1245
        }
    
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const blogsAtEnd = await helper.blogsinDB()
        const lastBlog = blogsAtEnd[blogsAtEnd.length - 1]
        delete lastBlog.id
        assert.deepStrictEqual(newBlog, lastBlog)
    })
})

//checking that stuffs with missing properties won't get processed
describe('Missing properties', () => {
    //initializes
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })

    //likes automatically set to 0
    test('Missing likes property automatically set to 0', async () => {
        const newBlog = {
            "title": "TestBlog",
            "author": "Hello",
            "url": "hiya"
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsinDB()
        const lastBlog = blogsAtEnd[blogsAtEnd.length - 1]
        assert.strictEqual(lastBlog.likes, 0)
    })

    //missing title
    test('Missing title blogs will not be posted with errorCode 400', async () => {
        const newBlog = {
            "author": "Hello",
            "url": "Weeeee"
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsinDB()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    //missing url
    test('missing url blogs will not be posted with errorCode 400', async () => {
        const newBlog = {
            "title": "Hello",
            "author": "weee",
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsinDB()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
})

//check DELETE requests
describe('deleting from database', () => {
    //initializes
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })

    //test deletion
    test('DELETE request remove an object', async () => {
        const blogsAtStart = await helper.blogsinDB()
        const toDetele = blogsAtStart[0].id

        await api  
            .delete(`/api/blogs/${toDetele}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsinDB()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })

    //test correctly deleted
    test('DETELE request remove the correct object', async () => {
        const blogsAtStart = await helper.blogsinDB()
        const toDelete = blogsAtStart[0].id

        await api
            .delete(`/api/blogs/${toDelete}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsinDB()
        const ids = blogsAtEnd.map(each => each.id)
        assert(!ids.includes(toDelete))
    })
})


//checking POST methods
describe('POST requests to adjust information', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })

    //check adjustment
    test('Accurately adjusting with given ID', async () => {
        const blogsAtStart = await helper.blogsinDB()
        const toAdjust = blogsAtStart[0].id
        
        const newBlog = {
            "title": "Heroes",
            "author": "Hello",
            "url": "weeee",
            "likes": 1245
        }

        await api
            .put(`/api/blogs/${toAdjust}`)
            .send(newBlog)
            .expect(200)
        
        const blogsAtEnd = await helper.blogsinDB()
        const blogToCheck = blogsAtEnd[0]

        assert.strictEqual(blogToCheck.id, toAdjust)
        assert.strictEqual(blogsAtEnd[0].title, newBlog.title)
    })
})

after(async () => {
    await mongoose.connection.close()
})
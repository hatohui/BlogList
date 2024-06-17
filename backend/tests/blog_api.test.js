const { test, describe, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_Helper')
const assert = require('node:assert')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const api = supertest(app)

//handle data returned
describe('data returned correctly', () => {
    //initializes before each
    beforeEach(async () => {
        await User.deleteMany({})
        await Blog.deleteMany({})
        await api.post('/api/users').send(helper.initialUser)
        const token = await helper.getToken()
        const user = await api.get('/api/users')
        const toSend = {
            "title": helper.initialBlogs[0].title,
            "author": helper.initialBlogs[0].author,
            "url": helper.initialBlogs[0].url,
            "user": user.body[0]._id
        }
        await api.post('/api/blogs').send(toSend).set('Authorization', token)
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

//handle user creation
describe('User creation', () => {
    //initializes
    beforeEach(async () => {
        await User.deleteMany({})
        await Blog.deleteMany({})
        await api.post('/api/users').send(helper.initialUser)
        const token = await helper.getToken()
        const user = await api.get('/api/users')
        const toSend = {
            "title": helper.initialBlogs[0].title,
            "author": helper.initialBlogs[0].author,
            "url": helper.initialBlogs[0].url,
            "user": user.body[0]._id
        }
        await api.post('/api/blogs').send(toSend).set('Authorization', token)
    })

    //Invalid username cannot be created
    test('Invalid username cannot be posted with proper status code', async () => {
        const userBefore = await helper.usersInDB()

        const newUser = {
            "username": "hi",
            "password": "wee"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const userAfter = await helper.usersInDB()
        assert.strictEqual(userBefore.length, userAfter.length)
    })

    //not long enough password
    test('Invalid password cannot be posted with proper status code', async () => {
        const userBefore = await helper.usersInDB()

        const r = {
            "username": "hi123",
            "password": "hi"
        }

        await api
            .post('/api/users')
            .send(r)
            .expect(400)

        const userAfter = await helper.usersInDB()
        assert.strictEqual(userBefore.length, userAfter.length)
    })

    //Existed user cannot be added
    test('User with existing nickname cannot be posted', async () => {
        const userBefore = await helper.usersInDB()
        
        await api
            .post('/api/users')
            .send(helper.initialUser)
            .expect(400)
        
        const usersAfter = await helper.usersInDB()
        assert.strictEqual(userBefore.length, usersAfter.length)
    })

    //return proper error code and message
    test('Invalid User return proper message', async () =>{ 
        const invalidUsername = {
            "username": "hi",
            "password": "password"
        }
        const invalidPassword = {
            "username": "hi123",
            "password": "we"
        }
        const response_one = await api
            .post('/api/users')
            .send(helper.initialUser)

        const response_two = await api
            .post('/api/users')
            .send(invalidUsername)
        
        const response_three = await api
            .post('/api/users')
            .send(invalidPassword)

        assert.strictEqual(response_one.body.error, 'expected `username` to be unique')
        assert.strictEqual(response_two.body.error, 'Invalid name or password.')
        assert.strictEqual(response_three.body.error, 'Invalid name or password.')
    })
})

//handle user verification
describe('User verification', () => {
    //initializes
    beforeEach(async () => {
        await User.deleteMany({})
        await Blog.deleteMany({})
        await api.post('/api/users').send(helper.initialUser)
        const token = await helper.getToken()
        const user = await api.get('/api/users')
        const toSend = {
            "title": helper.initialBlogs[0].title,
            "author": helper.initialBlogs[0].author,
            "url": helper.initialBlogs[0].url,
            "user": user.body[0]._id
        }
        await api.post('/api/blogs').send(toSend).set('Authorization', token)
    })

    //user can login with correct password
    test('User can log-in with valid password and token is received', async () => {
        const user = {
            "username": "root",
            "password": "password"
        }

        const response = await api
            .post('/api/login')
            .send(user)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert(response.body.hasOwnProperty('token'))
    })

    //user cannot login with invalid password
    test('Invalid password cannot login and valid message is returned', async () => {
        const user = {
            "username": "root",
            "password": "thisisawrongpassword"
        }

        const response = await api
            .post('/api/login')
            .send(user)
            .expect(401)
            
        assert.deepStrictEqual(response.body.error,
            'invalid username or password' 
        )
    })

    //user cannot login with invalid username
    test('Invalid username cannot login and valid message is returned', async () => {
        const user = {
            "username": "asdg",
            "password": "password"
        }

        const response = await api
            .post('/api/login')
            .send(user)
            .expect(401)

        assert.deepStrictEqual(response.body.error,
            'invalid username or password' 
        )
    })
})

//handle POST requests
describe('POST verifications', () => {
    //initializes before each
    beforeEach(async () => {
        await User.deleteMany({})
        await Blog.deleteMany({})
        await api.post('/api/users').send(helper.initialUser)
        const token = await helper.getToken()
        const user = await api.get('/api/users')
        const toSend = {
            "title": helper.initialBlogs[0].title,
            "author": helper.initialBlogs[0].author,
            "url": helper.initialBlogs[0].url,
            "user": user.body[0]._id
        }
        await api.post('/api/blogs').send(toSend).set('Authorization', token)
    })

    //POST with invalid blog
    test('Invalid blogs are not posted with valid message', async () => {
        const blogsBefore = await helper.blogsinDB()
        const users = await User.find({})
        const user = users[0].id

        const newBlog = {
            "title": "TestBlog",
            "likes": 1245,
            "user": user
        }

        const token = await helper.getToken()

        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', token)
            .expect(400)
                    
        const returned = await helper.blogsinDB()
        assert.strictEqual(blogsBefore.length, returned.length)
        assert(response.body.error.includes('Blog validation failed'))
    })

    //post with a blog w invalid token
    test('Invalid token cannot post', async () => {

        const blogsBefore = await helper.blogsinDB()
        
        const token = "Bearer askldjalnjgosjfoiasdjfosaidjg"

        const newBlog = {
            "title": "TestBlog",
            "author": "Hi ITS' ME",
            "url": "walaoeh",
            "likes": 1245
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', token)
            .expect(401)

        const blogsAfter = await helper.blogsinDB()
        
        assert.strictEqual(blogsBefore.length, blogsAfter.length)
    })

    //POST with valid blog
    test('POST successfully with a valid blog.', async () => {
        const blogsBefore = await helper.blogsinDB()
        const token = await helper.getToken()
        const user = await User.find({})
        const id = user[0].id
        
        const newBlog = {
            "title": "TestBlog",
            "author": "Hi ITS' ME",
            "url": "walaoeh",
            "likes": 1245,
            "user": id
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', token)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsinDB()
        assert.deepStrictEqual(blogsAtEnd.length, blogsBefore.length + 1)
    })

    //new POST data correctly
    test('POST data is saved correctly.', async () => {
        const user = await User.find({})
        const userid = user[0].id

        const newBlog = {
            "title": "TestBlog",
            "author": "Hi ITS' ME",
            "url": "walaoeh",
            "likes": 1245,
            'user': userid
        }
        const token = await helper.getToken()

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', token)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsinDB()
        const lastBlog = blogsAtEnd[blogsAtEnd.length - 1]
        delete lastBlog.id
        lastBlog['user'] = userid.toString()

        assert.deepStrictEqual(newBlog, lastBlog)
    })
})

//checking that stuffs with missing properties won't get processed
describe('Missing properties', () => {
    //initializes
    beforeEach(async () => {
        await User.deleteMany({})
        await Blog.deleteMany({})
        await api.post('/api/users').send(helper.initialUser)
        const token = await helper.getToken()
        const user = await api.get('/api/users')
        const toSend = {
            "title": helper.initialBlogs[0].title,
            "author": helper.initialBlogs[0].author,
            "url": helper.initialBlogs[0].url,
            "user": user.body[0]._id
        }
        await api.post('/api/blogs').send(toSend).set('Authorization', token)
    })
    
    //likes automatically set to 0
    test('Missing likes property automatically set to 0', async () => {
        const id = await helper.getUserId()
        const token = await helper.getToken()

        const newBlog = {
            "title": "TestBlog",
            "author": "Hello",
            "url": "hiya",
            "user": id
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', token)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsinDB()
        const lastBlog = blogsAtEnd[blogsAtEnd.length - 1]
        assert.strictEqual(lastBlog.likes, 0)
    })

    //missing title
    test('Missing title blogs will not be posted with errorCode 400', async () => {
        const id = await helper.getUserId()
        const token = await helper.getToken()
        const blogsAtStart = await helper.blogsinDB()

        const newBlog = {
            "author": "Hello",
            "url": "Weeeee",
            "user": id
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', token)
            .expect(400)

        const blogsAtEnd = await helper.blogsinDB()
        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })

    //missing url
    test('missing url blogs will not be posted with errorCode 400', async () => {
        const token = await helper.getToken()
        const id = await helper.getUserId()

        const blogsAtStart = await helper.blogsinDB()

        const newBlog = {
            "title": "Hello",
            "author": "weee",
            "user": id
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', token)
            .expect(400)

        const blogsAtEnd = await helper.blogsinDB()
        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })
})

//check DELETE requests
describe('deleting from database', () => {
    //initializes
    beforeEach(async () => {
        await User.deleteMany({})
        await Blog.deleteMany({})
        await api.post('/api/users').send(helper.initialUser)
        const token = await helper.getToken()
        const user = await api.get('/api/users')
        const toSend = {
            "title": helper.initialBlogs[0].title,
            "author": helper.initialBlogs[0].author,
            "url": helper.initialBlogs[0].url,
            "user": user.body[0]._id
        }
        await api.post('/api/blogs').send(toSend).set('Authorization', token)
    })

    //test deletion
    test('DELETE request remove an object', async () => {
        const blogsAtStart = await helper.blogsinDB()
        const toDetele = blogsAtStart[0].id
        const token = await helper.getToken()

        await api
            .delete(`/api/blogs/${toDetele}`)
            .set('Authorization', token)
            .expect(204)

        const blogsAtEnd = await helper.blogsinDB()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })

    //test correctly deleted
    test('DETELE request remove the correct object', async () => {
        const blogsAtStart = await helper.blogsinDB()
        const toDelete = blogsAtStart[0].id
        const token = await helper.getToken()

        await api
            .delete(`/api/blogs/${toDelete}`)
            .set('Authorization', token)
            .expect(204)

        const blogsAtEnd = await helper.blogsinDB()
        const ids = blogsAtEnd.map(each => each.id)
        assert(!ids.includes(toDelete))
    })
})


//checking POST methods
describe('POST requests to adjust information', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        await Blog.deleteMany({})
        await api.post('/api/users').send(helper.initialUser)
        const token = await helper.getToken()
        const user = await api.get('/api/users')
        const toSend = {
            "title": helper.initialBlogs[0].title,
            "author": helper.initialBlogs[0].author,
            "url": helper.initialBlogs[0].url,
            "user": user.body[0]._id
        }
        await api.post('/api/blogs').send(toSend).set('Authorization', token)
    })

    //check adjustment
    test('Accurately adjusting with given ID', async () => {
        const blogsAtStart = await helper.blogsinDB()
        const toAdjust = blogsAtStart[0].id
        const token = await helper.getToken()
        const userId = await helper.getUserId()

        const newBlog = {
            "title": "Heroes",
            "author": "Hello",
            "url": "weeee",
            "likes": 1245,
            "user": userId
        }

        await api
            .put(`/api/blogs/${toAdjust}`)
            .send(newBlog)
            .set('Authorization', token)
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
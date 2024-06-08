const {test, describe, after, beforeEach} = require('node:test')
const bcrypt = require('bcrypt')
const User = require ('../models/user')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_Helper')
//init
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('when there is one user in db', () => {

    //load one user in before using
    beforeEach(async () => {
        await User.deleteMany()

        const password = await bcrypt.hash('secret', 10)
        const user = new User({username: 'root' ,
            name: "wala",
            password})

        await user.save()
    })

    //test user creation
    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDB()

        const newUser = {
            username: "Zahy",
            name: "Dinh Gia Huy",
            password: "meomeomeo"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDB()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(user => user.username)
        assert(usernames.includes(newUser.username))
    })

    //test username is not unique
    test('creation fails with proper statusCode and message if username is taken', async () => {
        const usersAtStart = await helper.usersInDB()
        
        const newUser = {
            username: 'root',
            name: 'ZahyMeoMeo',
            password: 'walaoeh'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const userAtEnd = await helper.usersInDB()
        assert(result.body.error.includes('expected `username` to be unique'))
        assert.strictEqual(userAtEnd.length, usersAtStart.length)
    })
})
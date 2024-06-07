const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
    const {username, name , password} = request.body

    const salt = 10
    const passwordHashed = await bcrypt.hash(password, salt)

    const user = new User({
        username: username,
        name: name,
        password: passwordHashed
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

usersRouter.get('/', async(request, response) => {
    const result = await User.find({})
    response.json(result)
})

module.exports = usersRouter
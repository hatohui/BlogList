const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

//to adjust an user
usersRouter.post('/', async (request, response) => {
    const {username, name , password} = request.body

    const salt = 10
    const passwordHashed = await bcrypt.hash(password, salt)

    const user = new User({
        username: username,
        name: name,
        password: passwordHashed,
        blogs: []
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

//to get an user with id
usersRouter.get('/:id', async (request, response) => {
    const id = request.params.id;
    const userFound = await User.findById(id)
    response.json(userFound)
})

//to get all user api
usersRouter.get('/', async(request, response) => {
    const result = await User.find({})
            .populate('blogs',
                {
                    title: 1,
                    author: 1,
                    url: 1,
                    likes: 1
                }
            )
    response.json(result)
})

module.exports = usersRouter
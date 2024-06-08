//initializes app
const express = require("express")
const app = express()
const cors = require('cors') 
const mongoose = require('mongoose') 
require('express-async-errors')

//initializes utils
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

//importing routers
const blogRouter = require('./controllers/blogger')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

//connecting to database
logger.info('connecting to', config.DB_URL);

mongoose.set('strictQuery', false)

mongoose.connect(config.DB_URL)
    .then(() => {
        logger.info('connected to Database.')
    })
    .catch((error) => {
        logger.error("can't connect to the database: ", error.message)
    })

//loading app
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

//loading routers
app.use('/api/blogs', blogRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

//loading errorHandlers
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
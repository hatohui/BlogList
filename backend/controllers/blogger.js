//initializes
const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const jwt = require('jsonwebtoken')
const User = require('../models/user');

const getTokenFrom = request => {
  const authorization = request.get('authorization')

  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', "")
  }

  return null
}

//get response from server
blogRouter.get('/', async (request, response) => {
  const result = await Blog.find({})
        .populate('user', {username: 1, name: 1})
  response.json(result)
})

//add a blog to server
blogRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({error: 'token invalid'})
  }  

  const user = await User.findById(body.user)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  })
  
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog);
})

//get by id
blogRouter.get('/:id', async (request, response) => {
  const id = request.params.id;
  const toReturn = await Blog.findById(id);
  response.json(toReturn)
})

//adjust with id
blogRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const adjustment = request.body;

  const adjustedblog = {
    title: adjustment.title,
    author: adjustment.author,
    url: adjustment.url,
    likes: adjustment.likes
  }

  const result = await Blog.findByIdAndUpdate(id, adjustedblog)
  response.status(200).json(result)
})

//delete
blogRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  const result = await Blog.findByIdAndDelete(id)
  response.status(204).json(result)
})

module.exports = blogRouter
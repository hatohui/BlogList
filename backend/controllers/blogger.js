//initializes
const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const middleware = require('../utils/middleware')

//get response from server
blogRouter.get('/', async (request, response) => {
  const result = await Blog.find({})
        .populate('user', {username: 1, name: 1})
  response.json(result)
})

//add a blog to server
blogRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;

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
  if (toReturn === null) response.status(404).json({
    error: 'ID not found'
  })
  response.json(toReturn)
})

//adjust with id
blogRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const id = request.params.id
  const adjustment = request.body;
  const user = request.user;

  const adjustedblog = {
    title: adjustment.title,
    author: adjustment.author,
    url: adjustment.url,
    likes: adjustment.likes,
    user: user.id
  }

  const result = await Blog.findByIdAndUpdate(id, adjustedblog)
  response.status(200).json(result)
})

//delete
blogRouter.delete('/:id', middleware.userExtractor, async (request, response) => {

  const id = request.params.id
  const user = request.user;

  const result = await Blog.findByIdAndDelete(id)
  user.blogs = user.blogs.filter(blogId => blogId.toString() !== id)
  
  await user.save()
  response.status(204).json(result)
})

module.exports = blogRouter
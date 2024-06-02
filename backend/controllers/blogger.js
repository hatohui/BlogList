//initializes
const blogRouter = require('express').Router();
const Blog = require('../models/blog');

//get response from server
blogRouter.get('/', async (request, response) => {
  const result = await Blog.find({})
  response.json(result)
})

//add a blog to server
blogRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
})

module.exports = blogRouter
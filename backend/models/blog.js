const mongoose = require('mongoose')

//set schema
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5
    },
    author: {
        type: String,
        required: true,
        minlength: 3
    },
    url:{ 
        type: String,
        required: true,
        minlength: 3
    },
    likes: {
        type: Number,
        minlength: 3,
        default: 0
    }
  })

//turn ID into string and remove the __v
blogSchema.set('toJSON', {
    transform: (document, returned) => {
        returned.id = returned._id.toString()
        delete returned._id
        delete returned.__v
    }
})

module.exports = mongoose.model('Blog', blogSchema)
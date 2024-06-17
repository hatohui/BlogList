const mongoose = require('mongoose')

//set schema
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title field is required.\n"],
        minlength: [3, 'Title too short! Input a longer title.\n']
    },
    author: {
        type: String,
        required: [true, `Author field is required\n`],
        minlength: [3, `Author's field's not long enough!\n`]
    },
    url:{ 
        type: String,
        required: [true, 'URL field is required'],
        minlength: [3, 'URL too short! \n']
    },
    likes: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
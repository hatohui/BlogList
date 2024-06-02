const dummy = (blogs) => {
    return 1
}

//testing total_likes
const totalLikes = (blogs) => {
    let sum = 0;

    //handle empty array
    if (!blogs.length) {
        return sum
    }

    //rest
    blogs.forEach(blog => {
        sum += blog.likes
    });

    return sum
}

//find top blog
const favouriteBlog = (blogs) => {
    if (!blogs.length) return null

    let mostLike = blogs[0]

    //find mostLiked
    blogs.forEach(blog => {
        if (blog.likes > mostLike.likes)
            mostLike = blog
    })

    return {
        title: mostLike.title,
        author: mostLike.author,
        likes: mostLike.likes
    }
}

//most blogs
const mostBlogs = (blogs) => {

    //handle empty array
    if (!blogs.length) return null

    if (blogs.length === 1) return {
        author: blogs[0].author,
        blogs: 1
    }

    const names = blogs.map(blog => blog.author)
    const values = new Map()

    let mostPost = 1
    let mostPostAuthor = null
    
    names.forEach(name => {
        if (values.has(name)) {
            var amount = values.get(name)
            if (amount > mostPost) {
                mostPost = amount + 1
                mostPostAuthor = name
            }
            values.set(name, amount + 1)
        } else {
            values.set(name, 1)
        }
    })

    return {
        author: mostPostAuthor,
        blogs: mostPost
    }
}

//mostLiked
const mostLikes = (blogs) => {
    //handle empty array
    if (!blogs.length) return null
    
    if (blogs.length === 1) return {
        author: blogs[0].author,
        likes: blogs[0].likes
    }

    //handle others
    let values = new Map()
    let foundName = null
    let mostLikes = 0

    //handler
    blogs.forEach(blog => {
        if (values.has(blog.author)) {
            var total = values.get(blog.author)
            if (total > mostLikes) {
                foundName = blog.author
                mostLikes = total + blog.likes
            }
            values.set(blog.author, total + blog.likes)
        } else {
            values.set(blog.author, blog.likes)
        }
    })

    return {
        author: foundName,
        likes: mostLikes
    }
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}
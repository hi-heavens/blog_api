const Article = require('../models/articleModel');
const User = require('../models/userModel');

exports.getAllBlogs = async (req, res) => {
    try {
        let query = await Article.find().select('-__v').populate('author', {first_name: 1, last_name: 1});
        // query = query.select('-__v');
        const blogs = await query;
        // console.log(typeof(blogs));
        // let query = await Article.updateMany({state: 'published'}, { $inc: {read_count: 1}});
        // query = 
        // query = query.forEach(el => console.log(el[author]));
        // query = await query.find({author: 'Abdullah Numan'}).exec();
        // console.log(query[0]['body']);
        // const blog = await query;
        // console.log(blog);
        // query.forEach((el) => {
        //     console.log(el['read_count']);
        // })
        // console.log(query[0].read_count);

        // const article = await query;
        res.status(200).json({
            status: 'success',
            // token,
            data: {
                blogs
            }
        })
    } catch (err) {
        res.status(401).json({
            status: 'fail',
            message: err
        })
    }
}

exports.createBlog = async (req, res) => {
    try {
        const { title, description, author_id, state, tags, body } = req.body;
        const author = await User.findById(author_id)

        const blog = new Article({
            title,
            description,
            state,
            tags,
            body,
            author: author._id
        })
        const savedBlog = await blog.save();
        console.log(author);
        author.articles = author.articles.concat(savedBlog._id);
        await author.save();

        res.status(201).json({
            status: 'success',
            // token,
            data: {
                user: savedBlog
            }
        })
    } catch (err) {
        res.status(401).json({
            status: 'fail',
            message: err
        })
    }
}
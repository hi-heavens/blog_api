const Article = require('../models/articleModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError')

exports.getAllBlogs = catchAsync(async (req, res, next) => {
        let query = await Article.find({state: 'published'}).select('-__v').populate('author', {first_name: 1, last_name: 1});
        
        // If no details returned in the query, the below error is encountered
        if (query.length === 0) return next(new AppError('No result returned', 404));

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
            length: blogs.length,
            // token,
            data: {
                blogs
            }
        });
    });

exports.createBlog = catchAsync(async (req, res, next) => {
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
            data: {
                user: savedBlog
            }
        })
    });

exports.getBlog = catchAsync(async (req, res, next) => {
    const blogID = req.query.id;
    let query = await Article.findOne({blogID}).select('-__v').populate('author', {first_name: 1, last_name: 1});
        
    // If no details returned in the query, the below error is encountered
    if (query.length === 0) return next(new AppError('No result returned', 404));

    const blog = await query;
    res.status(201).json({
        status: 'success',
        data: {
            user: blog
        }
    })
});
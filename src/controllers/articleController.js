const Article = require('../models/articleModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const service = require('../services/userServices');

exports.getAllBlogs = catchAsync(async (req, res, next) => {
    let query = Article.find({state: 'published'})//.exec();
    const queryObj = {...req.query};

    const excludedFields = ['page', 'sort', 'limit'];
    excludedFields.forEach(el => delete queryObj[el]);

    query = query.find(queryObj);

    if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join('');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-timestamp') // default sorting
    }

    // For pagination
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const skip = (page - 1) * limit;

    if (req.query.page) {
        const collectionCount = await Article.countDocuments();
        if(skip >= collectionCount) return next(new AppError('This page does not exist', 404));
    }

    query = query.skip(skip).limit(limit);

    query = query.select('-__v').populate('author', {first_name: 1, last_name: 1});

    const blogs = await query;

    // If no details returned in the query, the below error is encountered
    if (blogs.length === 0) return next(new AppError('No result returned', 404));

    res.status(200).json({
        status: 'success',
        length: blogs.length,
        data: {
            blogs
        }
    });
});

exports.createBlog = catchAsync(async (req, res, next) => {
        const { title, description, state, tags, body } = req.body;

        // Extract author/user id from the token received
        const author_id = (await service.decodeToken(req.headers.authorization)).id;

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
    const blogID = req.params.id;

    let query = Article.findOneAndUpdate({state: { $ne: 'draft' }, _id: blogID}, {$inc: {read_count: 1}}, {new: true})//.exec();
    
    const blog = await query;

    // If no details returned in the query, the below error is encountered
    if (!blog) return next(new AppError('No result returned', 404));

    res.status(200).json({
        status: 'success',
        data: {
            blog
        }
    })
});

exports.getUserBlogs = catchAsync(async (req, res, next) => {
    const author = req.user['_id'].toString();

    const queryObj = {...req.query};
    const excludedFields = ['page', 'sort', 'limit'];
    excludedFields.forEach(el => delete queryObj[el]);

    let query = Article.find({author});

    query = query.find(queryObj);
    
    if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join('');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-timestamp') // default sorting
    }

    // For pagination
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const skip = (page - 1) * limit;

    if (req.query.page) {
        const collectionCount = await query.countDocuments();
        if(skip >= collectionCount) return next(new AppError('This page does not exist', 404));
    }

    query = query.skip(skip).limit(limit);

    query = query.select('-__v').populate('author', {first_name: 1, last_name: 1});

    const blogs = await query;

    // If no details returned in the query, the below error is encountered
    if (!blogs) return next(new AppError('No result returned', 404));

    res.status(200).json({
        status: 'success',
        length: blogs.length,
        data: {
            blogs
        }
    });
});


exports.updateBlog = catchAsync(async (req, res, next) => {
    const userID = req.user['_id'].toString();
    const blogID = req.params.id;
    const blogState = req.body.state;

    const reqBody = req.body;
    const excludedFields = ['read_count', 'author', '_id'];
    excludedFields.forEach(el => delete reqBody[el]);

    const author = await Article.findById(blogID);
    
    if (userID !== author.author.toString()) {
        return next(new AppError('Only creator of blog can update. Please verify login details', 401));
    }

    if(blogState){
        if (blogState !== "draft" && blogState !== "published") {
            return next(new AppError(`Blog state can either be 'published' or 'draft'`, 401));
        }
    }

    const updatedArticle = await Article.findByIdAndUpdate(blogID, reqBody, {new: true});

    res.status(200).json({
        status: 'success',
        data: {
            updatedArticle
        }
    });
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
    const userID = req.user['_id'].toString();
    const blogID = req.params.id;

    const author = await Article.findById(blogID);
    if(!author) return next(new AppError('The requested blog does not exist', 404));

    if (userID !== author.author.toString()) {
        return next(new AppError('Blog can only be deleted by owner. Please log in to continue', 401));
    }

    await Article.deleteOne({_id: blogID});

    res.status(200).json({
        status: 'success',
        data: {
            blogID
        }
    });
});

const Article = require('../models/articleModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError')
const service = require('../services/userServices');

exports.getAllBlogs = catchAsync(async (req, res, next) => {
    // query = Article.find({state: 'published'}).exec()
    // let query = Article.find({state: 'published'}).exec()//.select('-__v').populate('author', {first_name: 1, last_name: 1});
    let query = Article.find({state: { $ne: 'draft' }})//.exec();
    const queryObj = {...req.query};
    const excludedFields = ['page', 'sort', 'limit'];
    excludedFields.forEach(el => delete queryObj[el]);

    // query = Article.find();

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

    // If no details returned in the query, the below error is encountered
    if (query.length === 0) return next(new AppError('No result returned', 404));

    const blogs = await query;

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
    // let query = Article.findById(blogID);
    // let query = Article.findOne({blogID, state: 'published'}).exec();
    let query = Article.findOneAndUpdate({state: { $ne: 'draft' }, _id: blogID}, {$inc: {read_count: 1}}, {new: true})//.exec();
    // query = Article.findByIdAndUpdate(blogID, {$inc: {read_count: 1}}, {new: true});
    
    const blog = await query;

    // If no details returned in the query, the below error is encountered
    if (!blog) return next(new AppError('No result returned', 404));

    res.status(201).json({
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
    
    if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join('');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-timestamp') // default sorting
    }

    // For pagination
    const page = req.query.page || 1;
    const limit = req.query.limit || 2;
    const skip = (page - 1) * limit;

    if (req.query.page) {
        const collectionCount = await Article.countDocuments();
        if(skip >= collectionCount) return next(new AppError('This page does not exist', 404));
    }

    query = query.skip(skip).limit(limit);

    query = query.select('-__v').populate('author', {first_name: 1, last_name: 1});

    // If no details returned in the query, the below error is encountered
    if (query.length === 0) return next(new AppError('No result returned', 404));

    const blogs = await query;

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

    if (!(blogState !== 'draft') || !(blogState === 'published')) {
        return next(new AppError(`Blog state can either be 'published' or 'draft'`, 401));
    }

    const author = await Article.findById(blogID);

    if (userID !== author.author.toString()) {
        return next(new AppError('Only creator of blog can update. Please verify login details', 401));
    }

    const updatedArticle = await Article.findByIdAndUpdate(blogID, req.body, {new: true});

    res.status(201).json({
        status: 'success',
        data: {
            updatedArticle
        }
    });
});

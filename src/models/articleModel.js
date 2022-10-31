const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a blog title'],
        unique: true,
    },
    description: String,
    author: String,
    state: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft',
    },
    read_count: {
        type: Number,
        default: 0,
    },
    reading_time: Number,
    tags: [String],
    body: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now() 
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const getReadingTime = (body) => {
    const wordsPerMinute = 225;
    const numberOfWords = body.trim().split(/\s/g).length;
    const readingTime = Math.ceil(numberOfWords / wordsPerMinute);
    return readingTime;
};

// const readCount = () => this.read_count + 1;

articleSchema.pre('save', function(next) {
    this.reading_time = getReadingTime(this.body);
    this.read_count + 1;
    next();
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
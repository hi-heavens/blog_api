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
    reading_time: String,
    tags: [String],
    body: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: new Date().toISOString(),
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
    return `${readingTime} min(s) read`;
};

articleSchema.pre('save', function(next) {
    this.reading_time = getReadingTime(this.body);
    this.read_count + 1;
    next();
});

articleSchema.pre('deleteOne', function (next) {
    const articleId = this.getQuery()["_id"];
    mongoose.model("User").updateOne({ $pullAll: {articles: [articleId]}}, function (err, result) {
      if (err) next(err);
      else next();
    });
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
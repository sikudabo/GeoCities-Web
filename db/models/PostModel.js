const mongoose = require('mongoose');
const { postSchema } = require('../schemas');

const PostModel = mongoose.model('PostModel', postSchema);

module.exports = PostModel;
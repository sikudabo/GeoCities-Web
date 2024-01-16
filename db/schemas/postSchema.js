const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    authorId: { required: true, type: String },
    userName: { required: true, type: String },
    postOriginType: { required: true, type: String },
    createdAt: { required: true, type: Date },
    postType: { required: true, type: String },
    communityName: String,
    caption: String,
    likes: [String],
    postMediaId: String,
    hashTags: [String],
    comments: [
        mongoose.Schema({
            author: { required: true, type: String },
            userName: { required: true, type: String },
            createdAt: { required: true, type: Date },
            caption: { required: true, type: String },
            postAuthorId: { required: true, type: String },
            hashTags: [String],
        })
    ],
}, {
    collection: 'posts',
});

module.exports = postSchema;
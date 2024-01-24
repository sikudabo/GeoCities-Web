const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    authorId: { required: true, type: String },
    userName: { required: true, type: String },
    postOriginType: { required: true, type: String },
    createdAt: { required: true, type: Number },
    postType: { required: true, type: String },
    communityName: String,
    caption: String,
    likes: { default: [], type: [String]},
    postMediaId: String,
    link: String,
    hashTags: { default: [], type: [String] },
    comments: [
        mongoose.Schema({
            authorId: { required: true, type: String },
            commentType: { required: true, type: String },
            userName: { required: true, type: String },
            createdAt: { required: true, type: Number },
            caption: { required: true, type: String },
            postAuthorId: { required: true, type: String },
            postId: { required: true, type: String },
            hashTags: { default: [], type: [String] },
            likes: { default: [], type: [String] },
            postMediaId: String,
            link: String,
        })
    ],
}, {
    collection: 'posts',
});

module.exports = postSchema;
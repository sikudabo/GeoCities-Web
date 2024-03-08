const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    createdAt: { required: true, type: Number },
    groupName: { required: true, type: String, unique: true },
    description: { required: true, type: String },
    topic: { required: true, type: String },
    creator: { required: true, type: String },
    moderators: { default: [], type: [String] },
    avatar: { required: true, type: String },
    members: { default: [], type: [String] },
    blockList: { default: [], type: [String] },
    rules: { default: [], type: [String] },
}, {
    collection: 'groups',
});

module.exports = groupSchema;
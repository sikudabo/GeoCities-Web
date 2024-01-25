const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: { required: true, type: String },
    lastName: { required: true, type: String },
    email: { required: true, type: String },
    password: { required: true, type: String },
    dob: { required: true, type: Date },
    createdOn: { default: Date.now, required: true, type: Date },
    avatar: { required: true, type: String },
    geoScore: { default: 0, required: true, type: Number },
    communities: [String],
    locationCity: { required: true, type: String },
    locationState: { required: true, type: String },
    followers: [String],
    following: [String],
    blockedList: [String],
    groupsBlockList: { default: [], type: [String ] },
    fbId: { required: true, type: String, unique: true },
    blockedFrom: { default: [], type: [String] },
    groups: { default: [], type: [String] },
}, {
    collection: 'users',
});

module.exports = userSchema;
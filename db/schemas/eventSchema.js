const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    attendees: { default: [], type: [String] },
    authorId: { required: true, type: String },
    avatar: { required: true, type: String },
    createdAt: { required: true, type: Number },
    description: { required: true, type: String },
    eventCity: { required: true, type: String },
    eventDate: { required: true, type: Number },
    eventState: { required: true, type: String },
    title: { required: true, type: String },
    userName: { required: true, type: String },
}, 
{
    collection: 'events',
});

module.exports = eventSchema;
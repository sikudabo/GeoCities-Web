const mongoose = require('mongoose');
const { eventSchema } = require('../schema');

const EventModel = mongoose.model('EventModel', eventSchema);

module.exports = EventModel;
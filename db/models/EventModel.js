const mongoose = require('mongoose');
const { eventSchema } = require('../schemas');

const EventModel = mongoose.model('EventModel', eventSchema);

module.exports = EventModel;
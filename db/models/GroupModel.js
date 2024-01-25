const mongoose = require('mongoose');
const { groupSchema } = require('../schema');

const GroupModel = mongoose.model('GroupModel', groupSchema);

module.exports = GroupModel;
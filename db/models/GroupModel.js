const mongoose = require('mongoose');
const { groupSchema } = require('../schemas');

const GroupModel = mongoose.model('GroupModel', groupSchema);

module.exports = GroupModel;
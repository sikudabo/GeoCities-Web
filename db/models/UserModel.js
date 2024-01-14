const mongoose = require('mongoose');
const { userSchema } = require('../schemas');

const UserModel = mongoose.model('UserModel', userSchema);

module.exports = UserModel;
const mongoose = require('mongoose');
const { userSchema } = require('../schemas');

console.log('Reset');
const UserModel = mongoose.model('UserModel', userSchema);

module.exports = UserModel;
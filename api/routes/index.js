const GetPhoto = require('./getPhoto')
const GetPhotoByUserId = require('./getPhotoByUserId');
const GetUser = require('./getUser');
const UploadBinaryPost = require('./uploadBinaryPost');
const UploadNonBinaryPost = require('./uploadNonBinaryPost');
const UserLogin = require('./userLogin');
const UserSignUp = require('./userSignUp');

module.exports = {
    GetPhoto,
    GetPhotoByUserId,
    GetUser,
    UploadBinaryPost,
    UploadNonBinaryPost,
    UserLogin,
    UserSignUp,
};
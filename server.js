const express = require('express');
const app = express();
const http = require('http');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const cors = require('cors');
const { startDb } = require('./db');
const {
    AddOrRemoveGroupUser,
    AddSubtractCommentLike,
    AddSubtractLike,
    CreateGroup,
    DeleteBinaryComment,
    DeleteBinaryPost,
    DeleteNonBinaryComment,
    DeleteNonBinaryPost,
    FollowUnfollowUser,
    GetAllGroups,
    GetAllUsers,
    GetAvatarByGroupName,
    GetBlockedUsers,
    GetFeedPosts,
    GetFollowers,
    GetFollowing,
    GetGroup,
    GetGroupPosts,
    GetGroups,
    GetPhoto,
    GetPhotoByUserId,
    GetPost,
    GetProfilePosts,
    GetUser,
    GetVideo,
    JoinGroup,
    UploadBinaryComment,
    UploadBinaryPost,
    UpdateGroup,
    UpdateGroupAvatar,
    UploadNonBinaryComment,
    UploadNonBinaryPost,
    UserLogin,
    UserSignUp
} = require('./api/routes');

app.set('port', process.env.PORT || 2000);
app.set('appName', 'GeoCities');

app.use(cookieParser());
app.use(logger('dev'));
app.use(errorHandler());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Routes 
app.use(AddOrRemoveGroupUser);
app.use(AddSubtractCommentLike);
app.use(AddSubtractLike);
app.use(CreateGroup);
app.use(DeleteBinaryComment);
app.use(DeleteBinaryPost);
app.use(DeleteNonBinaryComment);
app.use(DeleteNonBinaryPost);
app.use(FollowUnfollowUser);
app.use(GetAllUsers);
app.use(GetBlockedUsers);
app.use(GetFeedPosts);
app.use(GetFollowers);
app.use(GetFollowing);
app.use(GetAllGroups);
app.use(GetAvatarByGroupName);
app.use(GetGroup);
app.use(GetGroupPosts);
app.use(GetGroups);
app.use(GetPhoto);
app.use(GetPhotoByUserId);
app.use(GetPost);
app.use(GetProfilePosts);
app.use(GetUser);
app.use(GetVideo);
app.use(JoinGroup);
app.use(UploadBinaryComment);
app.use(UploadBinaryPost);
app.use(UploadNonBinaryComment);
app.use(UploadNonBinaryPost);
app.use(UpdateGroup);
app.use(UpdateGroupAvatar);
app.use(UserLogin);
app.use(UserSignUp);

// Create database connection
startDb();

// Create the server 
const server = http.createServer(app);

// Server Listening
server.listen(app.get('port'), () => {
    console.log(`GeoCities server listening on port ${app.get('port')}.`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (e) => {
    console.log(`GeoCities server uncaught exception: ${e.message}`);
});
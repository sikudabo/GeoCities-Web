const express = require('express');
const app = express();
const http = require('http');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const cors = require('cors');
const path = require('path');
const serveStatic = require('serve-static');
const history = require('connect-history-api-fallback');
const sslRedirect = require('heroku-ssl-redirect');
const { startDb } = require('./db');
const {
    AddOrRemoveGroupUser,
    AddSubtractCommentLike,
    AddSubtractLike,
    AttendEvent,
    CreateEvent,
    CreateGroup,
    DeleteBinaryComment,
    DeleteBinaryPost,
    DeleteEvent,
    DeleteNonBinaryComment,
    DeleteNonBinaryPost,
    FetchEventAttendingUsers,
    FollowUnfollowUser,
    GetAllEvents,
    GetAllGroups,
    GetAllUsers,
    GetAvatarByGroupName,
    GetAvatarByUserId,
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
    GetPostsByHashtag,
    GetProfilePosts,
    GetUser,
    GetUserEvents,
    GetVideo,
    JoinGroup,
    UploadBinaryComment,
    UploadBinaryPost,
    UpdateGroup,
    UpdateGroupAvatar,
    UpdateUser,
    UpdateUserAvatar,
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
app.use(sslRedirect.default());
app.use(history({
    rewrites: [
        {
            from: /^\/api\/.*$/,
            to: function(context) {
                return context.parsedUrl.path;
            }
        }
    ]
}));

// Routes 
app.use(AddOrRemoveGroupUser);
app.use(AddSubtractCommentLike);
app.use(AddSubtractLike);
app.use(AttendEvent);
app.use(CreateEvent);
app.use(CreateGroup);
app.use(DeleteBinaryComment);
app.use(DeleteBinaryPost);
app.use(DeleteEvent);
app.use(DeleteNonBinaryComment);
app.use(DeleteNonBinaryPost);
app.use(FetchEventAttendingUsers);
app.use(FollowUnfollowUser);
app.use(GetAllEvents);
app.use(GetAllUsers);
app.use(GetAvatarByUserId);
app.use(GetBlockedUsers);
app.use(GetFeedPosts);
app.use(GetFollowers);
app.use(GetFollowing);
app.use(GetAllGroups);
app.use(GetAvatarByGroupName);
app.use(GetGroup);
app.use(GetGroupPosts);
app.use(GetPostsByHashtag);
app.use(GetGroups);
app.use(GetPhoto);
app.use(GetPhotoByUserId);
app.use(GetPost);
app.use(GetProfilePosts);
app.use(GetUser);
app.use(GetUserEvents);
app.use(GetVideo);
app.use(JoinGroup);
app.use(UploadBinaryComment);
app.use(UploadBinaryPost);
app.use(UploadNonBinaryComment);
app.use(UploadNonBinaryPost);
app.use(UpdateGroup);
app.use(UpdateGroupAvatar);
app.use(UpdateUser);
app.use(UpdateUserAvatar);
app.use(UserLogin);
app.use(UserSignUp);

app.use(serveStatic(path.join(__dirname, 'build')));

// Create database connection
startDb();

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

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
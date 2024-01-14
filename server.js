const express = require('express');
const app = express();
const http = require('http');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const cors = require('cors');

app.set('port', process.env.PORT || 2000);
app.set('appName', 'GeoCities');

app.use(cookieParser());
app.use(logger('dev'));
app.use(errorHandler());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

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
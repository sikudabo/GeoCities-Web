const express = require('express');
const router = express.Router();
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const dbUri = process.env.DB_URI;

var conn = mongoose.createConnection(dbUri, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(dbUri, {useNewUrlParser: true, useUnifiedTopology: true});

let gfs;
let gridfsBucket;

conn.once('open', () => {
    // Init Stream
    gfs = Grid(conn.db, mongoose.mongo);
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'uploads',
    });
    gfs.collection('uploads');
    return 'done';
});

router.route('/api/get-video/:video').get(async (req, res) => {
    const video = req.params.video;
    const file = await gfs.files.findOne({ filename: video });
    
    if (!file || file.length === 0) {
        console.log('Could not find audio file');
        return res.status(404).json({
            err: 'Could not find the audio file!',
        });
    }

    if (req.headers['range']) {
        let parts = req.headers['range'].replace(/bytes=/, "").split("-");
        let partialstart = parts[0];
        let partialend = parts[1];

        let start = parseInt(partialstart, 10);
        let end = partialend ? parseInt(partialend, 10) : file.length - 1;
        let chunksize = (end - start) + 1;

        res.writeHead(206, {
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Range': 'bytes ' + start + '-' + end + '/' + file.length,
            'Content-Type': file.contentType
        });
        gfs.createReadStream({
            _id: file._id,
            range: {
                startPos: start,
                endPos: end
            }
        }).pipe(res);
    }
    else {
        res.header('Content-Length', file.length);
        res.header('Content-Type', file.contentType);

        gfs.createReadStream({
            _id: file._id
        }).pipe(res);
    }
});

module.exports = router;
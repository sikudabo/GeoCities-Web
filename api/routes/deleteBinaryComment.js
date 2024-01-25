const express = require('express');
const router = express.Router();
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const { PostModel } = require('../../db/models');
const dotenv = require('dotenv').config();

const dbUri = dotenv.parsed.DB_URI;


var conn = mongoose.createConnection(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });

let gfs;

let gridfsBucket

conn.once('open', async () => {
    // Init Stream
    gfs = await Grid(conn.db, mongoose.mongo);
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'uploads',
    });
    gfs.collection('uploads');
    return 'done';
});

router.route('/api/delete-binary-comment').delete(async (req, res) => {
    const { commentId, fileId, postId } = req.body;

    try {
        await PostModel.updateOne({ _id: postId }, { $pull: { comments: { _id: commentId }}});
        const { _id: id } = await gfs.files.findOne({ filename: fileId });
        await gridfsBucket.delete(id);
        res.status(200).json({ isError: false, message: 'Successfully deleted that comment.' });
        return;
    } catch(e) {
        console.log(`There was an error deleting a binary comment: ${e.message}`);
        res.status(500).json({ isError: true, message: 'There was an error deleting that comment. Please try again!' });
        return;
    }
});

module.exports = router;
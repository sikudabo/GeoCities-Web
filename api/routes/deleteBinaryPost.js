const express = require('express');
const router = express.Router();
const Grid = require('gridfs-stream');
const GridFsStorage = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
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

const storage = new GridFsStorage({
    url: dbUri,
    file: async (req, file) => {
      return await new Promise((resolve) => {
          const filename = Date.now() + "-" + file.fieldname + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
    }
});

router.route('/api/delete-binary-post').delete(async (req, res) => {
    const { fileId, postId } = req.body;

    try {
        await PostModel.deleteOne({ _id: postId });
        const { _id: id } = await gfs.files.findOne({ filename: fileId });
        await gridfsBucket.delete(id);
        res.status(200).json({ isError: false, message: 'Successfully deleted that post.' });
        return;
    } catch(e) {
        console.log(`There was an error deleting a binary post: ${e.message}`);
        res.status(500).json({ isError: true, message: 'There was an error deleting that post. Please try again!' });
        return;
    }
});

module.exports = router;
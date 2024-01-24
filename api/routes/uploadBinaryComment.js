const express = require('express');
const router = express.Router();
const Grid = require('gridfs-stream');
const GridFsStorage = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv').config();
const { PostModel } = require('../../db/models');

const dbUri = dotenv.parsed.DB_URI;
var conn = mongoose.createConnection(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });

let gfs;

conn.once('open', async () => {
    // Init Stream
    gfs = await Grid(conn.db, mongoose.mongo);
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

const uploads = multer({ storage });

router.route('/api/upload-video-photo-comment').put(uploads.single('postMedia'), async (req, res) => {
    const { authorId, caption, commentType, createdAt, link, postAuthorId, postId, userName } = req.body;
    const postMediaId = req.file.filename;
    let hashTags = [];

    if (caption) {
        const splitCaption = caption.split(' ');
        splitCaption.forEach((caption) => {
            console.log('The caption is:', caption);
            if (caption.startsWith('#')) {
                let currentCaption = caption;
                hashTags.push(currentCaption.replace(/[^A-Za-z0-9]/g, ''));
            }
        });
    }

    try {
        const newComment = {
            authorId,
            caption,
            commentType,
            createdAt: Number(createdAt),
            hashTags,
            link,
            postAuthorId,
            postId,
            postMediaId,
            userName,
        }

        await PostModel.updateOne({ _id: postId }, { $push: { comments: newComment }});
        res.status(200).json({ isError: false, message: 'Successfully uploaded comment!' });
        return;

    } catch (e) {
        console.log(`There was an error uploading a comment: ${e.message}`);
        res.status(500).json({ isError: true, message: 'There was an error uploading that comment. Please try again!' });
    }
});

module.exports = router;
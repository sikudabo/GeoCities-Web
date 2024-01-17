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

router.route('/api/upload-video-photo').put(uploads.single('postMedia'), async (req, res) => {
    const { authorId, caption, communityName, createdAt, link, postType, postOriginType, userName } = req.body;
    const postMediaId = req.file.filename;
    let hashtags = [];

    if (caption) {
        const splitCaption = caption.split(' ');
        splitCaption.forEach((caption) => {
            if (caption.startsWith('#')) {
                hashtags.push(caption);
            }
        });
    }

    try {
        if (postOriginType === 'profile') {
            const newPost = new PostModel({
                authorId,
                caption,
                createdAt: Number(createdAt),
                hashtags,
                postType,
                postMediaId,
                postOriginType,
                userName,
            });

            await newPost.save();
            res.status(200).json({ isError: false, message: 'Successfully uploaded post!' });
            return;
        }

        const newPost = new PostModel({
            authorId,
            caption,
            createdAt,
            communityName,
            hashtags,
            link,
            postType,
            postMediaId,
            postOriginType,
            userName,
        });
        await newPost.save();
        res.status(200).json({ isError: false, message: 'Successfully uploaded post!' });
        return;
    } catch (e) {
        console.log(`There was an error uploading a ${postOriginType} ${postType} post: ${e.message}`);
        res.status(500).json({ isError: true, message: 'There was an error uploading that post. Please try again!' });
    }
});

module.exports = router;
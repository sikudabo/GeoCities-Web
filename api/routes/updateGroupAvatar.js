const express = require('express');
const router = express.Router();
const Grid = require('gridfs-stream');
const GridFsStorage = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const { GroupModel } = require('../../db/models');

const dbUri = process.env.DB_URI;

var conn = mongoose.createConnection(dbUri, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(dbUri, {useNewUrlParser: true, useUnifiedTopology: true});

let gfs;

conn.once('open', async () => {
    // Init Stream
    gfs = await Grid(conn.db, mongoose.mongo);
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'uploads',
    });
    await gfs.collection('uploads');
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

router.route('/api/change-group-avatar/:groupName/:avatarId').post(uploads.single('avatar'), async (req, res) => {
    const { groupName, avatarId } = req.params;
    const filename = req.file.filename;

    try {
        await GroupModel.updateOne({ groupName }, { $set: { avatar: filename}});

        if (avatarId) {
            const { _id } = await gfs.files.findOne({ filename: avatarId });
            await gridfsBucket.delete(_id);
            res.status(200).json({ isError: false, message: 'Successfully updated group avatar.' });
        }
    } catch(err) {
        console.log(`There was an error updating a group avatar: ${err.message}`);
        res.status(500).json({ isError: true, message: 'There was an error updating the group avatar. Please try again!' });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Grid = require('gridfs-stream');
const GridFsStorage = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv').config();
const { GroupModel, UserModel } = require('../../db/models');

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

router.route('/api/create-group').put(uploads.single('avatar'), async (req, res) => {
    const { createdAt, creator, description, groupName, topic } = req.body;
    const avatar = req.file.filename;

    try {

        const groupExists = await GroupModel.findOne({ groupName });

        if (groupExists) {
            res.status(200).json({ isError: true, message: 'That group name already exists! Please select another.' });
            return;
        }

        const newGroup = new GroupModel({
            avatar,
            createdAt,
            creator,
            description,
            groupName,
            topic,
            members: [creator],
            moderators: [creator],
        });

        const group = await newGroup.save();
        const { _id } = group;
        await UserModel.updateOne({ _id: creator }, { $push: { groups: _id } });
        res.status(200).json({ isError: false, message: "New group created!", group });
    } catch (e) {
        console.log(`There was an error creating a new group: ${e.message}`);
        res.status(500).json({ isError: true, message: 'There was an error creating a new group!' });
    }
});

module.exports = router;
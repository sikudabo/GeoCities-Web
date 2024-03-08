const express = require('express');
const router = express.Router();
const Grid = require('gridfs-stream');
const GridFsStorage = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv').config();
const { EventModel, UserModel } = require('../../db/models');

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

router.route('/api/create-event').put(uploads.single('avatar'), async (req, res) => {
    const {
        authorId,
        createdAt,
        description,
        eventAddress,
        eventCity,
        eventDate,
        eventState,
        title,
        userName,
    } = req.body;

    const avatar = req.file.filename;

    try {
        const newEvent = new EventModel({
            authorId,
            attendees: [authorId],
            avatar,
            createdAt: Number(createdAt),
            description,
            eventAddress,
            eventCity,
            eventDate: Number(eventDate),
            eventState,
            title,
            userName,
        });

        const event = await newEvent.save();
        const { _id } = event;
        await UserModel.updateOne({ _id: authorId }, { $push: { events: _id }});
        const updatedUser = await UserModel.findOne({ _id: authorId });
        res.status(200).json({ isError: false, message: 'Successfully created event', updatedUser });
        return;
    } catch (err) {
        console.log(`There was an error creating an event: ${err.message}`);
        res.status(500).json({ isError: true, message: 'There was an error creating an event. Please try again!' });
        return;
    }
});

module.exports = router;
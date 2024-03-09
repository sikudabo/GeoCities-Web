const express = require('express');
const router = express.Router();
const Grid = require('gridfs-stream');
const GridFsStorage = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const { EventModel, UserModel  } = require('../../db/models');
const dotenv = require('dotenv').config();

const dbUri = process.env.DB_URI;


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

router.route('/api/delete-event').delete(async (req, res) => {
    const { attendees, avatar, eventId, userId } = req.body;
    
    try {
        await EventModel.deleteOne({ _id: eventId });
        const { _id: id } = await gfs.files.findOne({ filename: avatar });
        await gridfsBucket.delete(id);
        await UserModel.updateOne({ _id: userId }, { $pull: { events: eventId } });
        await UserModel.updateMany({ _id: { $in: attendees }}, { $pull: { eventsAttending: eventId }});
        res.status(200).json({ isError: false, message: 'Successfully deleted that event.' });
        return;
    } catch(err) {
        console.log(`There was an error deleting an event: ${err.message}`);
        res.status(500).json({ isError: true, message: 'There was an error deleting that event. Please try again!' });
        return;
    }
});

module.exports = router;
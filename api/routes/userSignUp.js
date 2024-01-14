const express = require('express');
const router = express.Router();
const Grid = require('gridfs-stream');
const GridFsStorage = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const { UserModel } = require('../../db/models');
const dotenv = require('dotenv').config();

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

router.route('/api/user-signup').post(uploads.single('avatar'), async (req, res) => {
    const {
        firstName, 
        lastName,
        email, 
        password,
        dob,
        locationCity,
        locationState,
    } = req.body;
    const avatar = req.file.filename;

    try {
        const emailExists = await UserModel.findOne({ email });

        if (emailExists) {
            res.status(403).json({ isEmailTaken: true, message: 'That email is already taken! Please select another.' });
            return;
        }

        const newUser = new UserModel({
            firstName,
            lastName,
            email,
            password,
            dob,
            avatar,
            locationCity,
            locationState,
        });

        await newUser.save();
        res.status(200).json({ isError: false, message: 'Your profile has been created! Thanks for signing up to GeoCities', user: newUser });
    } catch (e) {
        console.log(`There was an error signing up a new user: ${e.message}`);
        res.status(500).json({ isError: true, message: 'There was an error signing you up. Please try again!' });
        return;
    }
});

module.exports = router;
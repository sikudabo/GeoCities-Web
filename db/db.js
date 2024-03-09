const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const dbUri = process.env.DB_URI;

function startDb() {
    mongoose.connect(dbUri);
}

module.exports = () => startDb();
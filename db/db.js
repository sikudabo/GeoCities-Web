const mongoose = require('mongoose');

const dbUri = process.env.DB_URI;

function startDb() {
    mongoose.connect(dbUri);
}

module.exports = () => startDb();
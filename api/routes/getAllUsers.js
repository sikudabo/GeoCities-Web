const express = require('express');
const router = express.Router();
const { UserModel } = require('../../db/models');

router.route('/api/get-all-users').get(async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.status(200).send({ isError: false, users });
    } catch(err) {
        console.log(`There was an error fetching all of the users: ${err.message}`);
        res.status(500).json({ isError: true, message: 'There was an error fetching all of the users.' });
    }
});

module.exports = router;
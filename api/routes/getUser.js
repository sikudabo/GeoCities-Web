const express = require('express');
const router = express.Router();
const { UserModel } = require('../../db/models');

router.route('/api/get-user/:_id').get(async (req, res) => {
    const { _id } = req.params;

    try {
        const fetchedUser = await UserModel.findOne({ _id });
        if (!fetchedUser) {
            res.status(200).json({ isError: true, message: 'User not found!' });
            return;
        }

        res.status(200).json({ isError: false, message: 'Successfully found your profile!', user: fetchedUser });
    } catch (err) {
        console.log('There was an error fetching a user profile in a GET request');
        res.status(500).json({ isError: true, message: 'There was an error fetching a user profile. Please try again!' });
    }
});

module.exports = router;
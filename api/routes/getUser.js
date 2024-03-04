const express = require('express');
const router = express.Router();
const { GroupModel, UserModel } = require('../../db/models');

router.route('/api/get-user/:_id').get(async (req, res) => {
    const { _id } = req.params;
    console.log('The user id is:', _id);

    try {
        const fetchedUser = await UserModel.findOne({ _id });
        if (!fetchedUser) {
            res.status(200).json({ isError: true, message: 'User not found!' });
            return;
        }

        const userGroups = await GroupModel.find({ _id: { $in: fetchedUser.groups }});
        fetchedUser.userGroups = userGroups;

        res.status(200).json({ isError: false, message: 'Successfully found your profile!', userGroups, user: fetchedUser });
    } catch (err) {
        console.log('There was an error fetching a user profile in a GET request');
        res.status(500).json({ isError: true, message: 'There was an error fetching a user profile. Please try again!' });
    }
});

module.exports = router;
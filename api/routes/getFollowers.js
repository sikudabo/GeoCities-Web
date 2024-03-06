const express = require('express');
const router = express.Router();
const { UserModel } = require('../../db/models');

router.route('/api/get-followers/:_id').get(async (req, res) => {
    const { _id } = req.params;

    try {
        const { followers } = await UserModel.findOne({ _id });
        const usersFollowed = await UserModel.find({ _id: { $in: followers }}, { avatar: 1, firstName: 1, followers: 1, _id: 1, lastName: 1 });
        res.status(200).json({ users: usersFollowed, isError: false, message: 'Successfully retrieved followers.' });
        return;
    } catch(err) {
        console.log(`There was an error retrieving the users that follow a user: ${err.message}`);
        res.status(500).json({ isError: true, message: `There was an error retrieving the users ${isFollowers ? 'following' : 'followed by'} a user.` });
        return;
    }
});

module.exports = router;
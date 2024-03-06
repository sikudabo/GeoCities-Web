const express = require('express');
const router = express.Router();
const { UserModel } = require('../../db/models');

router.route('/api/get-followers-following/:_id/:isFollowers').get(async (req, res) => {
    const { _id, isFollowers } = req.params;

    try {
        if (isFollowers) {
            const { followers } = await UserModel.findONe({ _id });
            const usersFollowed = await UserModel.find({ _id: { $in: followers }}, { avatar: 1, firstName: 1, followers: 1, _id: 1, lastName: 1 });
            return res.status(200).json({ users: usersFollowed, isError: false, message: 'Successfully retrieved followers.' });
        }

        const { following } = await UserModel.findONe({ _id });
        const usersFollowing = await UserModel.find({ _id: { $in: following }}, { avatar: 1, firstName: 1, followers: 1, _id: 1, lastName: 1 });
        return res.status(200).json({ users: usersFollowing, isError: false, message: 'Successfully retrieved users followed.' });
    } catch(err) {
        console.log(`There was an error retrieving the users ${isFollowers ? 'following' : 'followed by'} a user: ${err.message}`);
        return res.status(500).json({ isError: true, message: `There was an error retrieving the users ${isFollowers ? 'following' : 'followed by'} a user.` });
    }
});

module.exports = router;
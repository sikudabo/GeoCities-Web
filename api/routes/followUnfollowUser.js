const express = require('express');
const router = express.Router();
const { UserModel } = require('../../db/models');

router.route('/api/follow-unfollow-user').post(async (req, res) => {
    const { _id, followerId, isFollow } = req.params; 

    try {
        if (isFollow) {
            await UserModel.updateOne({ _id }, { $push: { followers: followerId }});
            return res.status(200).json({ isError: false, message: 'Successfully followed user.' });
        }

        await UserModel.updateOne({ _id }, { $pull: { followers: followerId }});
        return res.status(200).json({ isError: false, message: 'Successfully unfollowed user.' });
    } catch (err) {
        console.log(`There was an error ${isFollow ? 'following' : 'unfollowing'} a user: ${err.message}`);
        return res.status(500).json({ isError: true, message: `There was an error ${isFollow ? 'following' : 'unfollowing'} that user. Please try again!`});
    }
});

module.exports = router;
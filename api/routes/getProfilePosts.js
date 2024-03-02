const express = require('express');
const router = express.Router();
const { PostModel } = require('../../db/models');

router.route('/api/get-profile-posts/:_id').get(async (req, res) => {
    const { _id } = req.params;

    try {
        const userPosts = await PostModel.find({ authorId: _id, groupName: { $exists: 0 } }).sort({ createdAt: -1 });
        res.status(200).json({ isSuccess: true, message: 'Successfully fetched posts', posts: userPosts });
    } catch(err) {
        console.log(`There was an error fetching posts for a users profile: ${err.message}`);
        res.status(500).json({ isError: true, message: 'There was an error fetching the profile posts.' });
    }
});

module.exports = router;
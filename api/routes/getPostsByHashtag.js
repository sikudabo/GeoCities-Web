const express = require('express');
const router = express.Router();
const { PostModel, UserModel } = require('../../db/models');

router.route('/api/get-hashtag-posts/:userId/:hashtag').get(async (req, res) => {
    const { userId, hashtag } = req.params;

    try {
        const { blockedFrom, groupsBlockedFrom } = await UserModel.findOne({ _id: userId }, { _id: 0, blockedFrom: 1, groupsBlockedFrom: 1 });
        const posts = await PostModel.find({ hashTags: hashtag, authorId: { $nin: blockedFrom }, groupName: { $nin: groupsBlockedFrom }}).sort({ createdAt: -1 })// Will later only be posts from users they follow, themselves, and groups they have joined.
        res.status(200).json({ isError: false, posts });
    } catch(err) {
        console.log(`There was an error fetching posts based on a hashtag: ${err.message}`);
        res.status(500).json({ isError: true, message: 'There was an error fetching posts based on a hashtag.' });
    }
});

module.exports = router;
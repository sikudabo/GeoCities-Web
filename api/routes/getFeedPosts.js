const express = require('express');
const router = express.Router();
const { PostModel, UserModel } = require('../../db/models');

router.route('/api/get-feed-posts/:_id').get(async (req, res) => {
    const { _id } = req.params;

    try {
        const { blockedFrom } = await UserModel.findOne({ _id }, { _id: 0, blockedFrom: 1 });
        const posts = await PostModel.find({ authorId: { $nin: blockedFrom }}).sort({ createdAt: -1 })// Will later only be posts from users they follow, themselves, and groups they have joined. 
        res.status(200).json({ isError: false, posts });
    } catch(err) {
        console.log(`There was an error fetching posts for the feed!: ${err.message}`);
        res.status(500).json({ isError: true, message: 'There was an error fetching posts from the feed'});
    }

});

module.exports = router;
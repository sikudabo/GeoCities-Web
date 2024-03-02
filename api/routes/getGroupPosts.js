const express = require('express');
const router = express.Router();
const { PostModel } = require('../../db/models');

router.route('/api/fetch-group-posts/:groupName').get(async (req, res) => {
    const { groupName } = req.params;

    try {
        const posts = await PostModel.find({ groupName });
        res.status(200).json({ isError: false, message: 'Successfully fetched group posts.', posts });
    } catch(err) {
        console.log(`There was an error fetching group posts: ${err.message}`);
        res.status(500).json({ isError: true, message: 'There was an error fetching group posts' });
    }
});

module.exports = router;
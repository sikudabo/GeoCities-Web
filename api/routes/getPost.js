const express = require('express');
const router = express.Router();
const { PostModel } = require('../../db/models');

router.route('/api/get-post/:_id').get(async (req, res) => {
    const { _id } = req.params;

    try {
        const post = await PostModel.findOne({ _id });

        if (!post) {
            res.status(200).json({ isError: false, isPostDeleted: true, message: 'This post has been deleted' });
            return;
        }

        res.status(200).json({ isError: false, post });
        return;
    } catch(err) {
        console.log(`There was an error retrieving post: ${_id}: ${err.message}`);
        res.status(500).json({ isError: true, message: 'There was an error retrieving that post!' });
        return;
    }
});

module.exports = router;
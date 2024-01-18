const express = require('express');
const router = express.Router();
const { PostModel } = require('../../db/models');

router.route('/api/delete-nonbinary-post').delete(async (req, res) => {
    const { postId } = req.body;

    try {
        await PostModel.deleteOne({ _id: postId });
        res.status(200).json({ isError: false, message: 'Successfully deleted post' });
        return;
    } catch (err) {
        console.log(`There was an error deleting non-binary post ${postId}: ${err.message}`);
        res.status(500).json({ isError: true, message: 'There was an error deleting that post.' });
        return;
    }
});

module.exports = router;
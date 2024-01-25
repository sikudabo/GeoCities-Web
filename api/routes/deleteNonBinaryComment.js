const express = require('express');
const router = express.Router();
const { PostModel } = require('../../db/models');

router.route('/api/delete-nonbinary-comment').delete(async (req, res) => {
    const { commentId, postId } = req.body;

    try {
        await PostModel.updateOne({ _id: postId }, { $pull: { comments: { _id: commentId }}});
        res.status(200).json({ isError: false, message: 'Successfully deleted comment' });
        return;
    } catch (err) {
        console.log(`There was an error deleting non-binary comment in post ${postId}: ${err.message}`);
        res.status(500).json({ isError: true, message: 'There was an error deleting that comment.' });
        return;
    }
});

module.exports = router;
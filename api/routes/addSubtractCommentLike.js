const express = require('express');
const router = express.Router();
const { PostModel, UserModel } = require('../../db/models');

router.route('/api/add-subtract-like-comment').post(async (req, res) => {
    const { actionType, authorId, commentId, likerId, postId } = req.body;

    try {
        if (actionType === 'like') {
            await PostModel.updateOne({ _id: postId, 'comments._id': commentId }, { $push: { 'comments.$.likes': likerId }});

            if (authorId !== likerId) {
                await UserModel.updateOne({ _id: authorId }, { $inc: { geoScore: 1 }});
                res.status(200).json({ isError: false, message: 'Successfully liked comment.' });
                return;
            }
            res.status(200).json({ isError: false, message: 'Successfully liked comment.' });
            return;
        } else {
            await PostModel.updateOne({ _id: postId, 'comments._id': commentId }, { $pull: { 'comments.$.likes': likerId }});

            if (authorId !== likerId) {
                await UserModel.updateOne({ _id: authorId }, { $inc: { geoScore : -1 }});
                res.status(200).json({ isError: false, message: 'Successfully unliked comment.' });
                return;
            }

            res.status(200).json({ isError: false, message: 'Successfully unliked comment.' });
            return;
        }
    } catch(e) {
        console.log(`There was an error ${actionType} a comment: ${e.message}`);
        res.status(500).json({ isError: true, message: `There was an error ${actionType === 'like' ? 'liking' : 'unliking'} a comment.`});
        return;
    }
});

module.exports = router;
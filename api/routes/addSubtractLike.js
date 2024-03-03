const express = require('express');
const router = express.Router();
const { PostModel, UserModel } = require('../../db/models');

router.route('/api/add-subtract-like').post(async (req, res) => {
    const { actionType, authorId, likerId, postId } = req.body;

    try {
        if (actionType === 'like') {
            await PostModel.updateOne({ _id: postId }, { $push: { likes: likerId }})

            if (authorId !== likerId) {
                await UserModel.updateOne({ _id: authorId }, { $inc: { geoScore: 1 }});
                res.status(200).json({ isError: false, message: 'Successfully liked post' });
                return;
            }
            res.status(200).json({ isError: false, message: 'Successfully liked post' });
            return;
        } else {
            await PostModel.updateOne({ _id: postId }, { $pull: { likes: likerId }});

            if (authorId !== likerId) {
                await UserModel.updateOne({ _id: authorId }, { $inc: { geoScore : -1 }});
                res.status(200).json({ isError: false, message: 'Successfully unliked post.' });
                return;
            }

            res.status(200).json({ isError: false, message: 'Successfully unliked post' });
            return;
        }
    } catch(e) {
        console.log(`There was an error ${actionType} a post: ${e.message}`);
        res.status(500).json({ isError: true, message: `There was an error ${actionType === 'like' ? 'liking' : 'unliking'} a post.`});
        return;
    }
});

module.exports = router;
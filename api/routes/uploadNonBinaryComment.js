const express = require('express');
const router = express.Router();
const { PostModel } = require('../../db/models');

router.route('/api/upload-link-text-comment').put(async (req, res) => {
    const { authorId, caption, commentType, createdAt, link, postAuthorId, postId, userName } = req.body;
    let hashTags = [];

    if (caption) {
        const splitCaption = caption.split(' ');
        splitCaption.forEach((caption) => {
            if (caption.startsWith('#')) {
                let currentCaption = caption;
                hashTags.push(currentCaption.replace(/[^A-Za-z0-9]/g, ''));
            }
        });
    }

    try {
        const newComment = {
            authorId,
            caption,
            commentType,
            createdAt: Number(createdAt),
            hashTags,
            link,
            postAuthorId,
            postId,
            userName,
        };

        await PostModel.updateOne({ _id: postId }, { $push: { comments: newComment }});
        res.status(200).json({ isError: false, message: 'Successfully uploaded comment!' });
        
    } catch (e) {
        console.log(`There was an error saving a new comment: ${e.message}`);
        res.status(500).json({ isError: true, message: 'There was an error saving that comment. Please try again!' });
    }
});

module.exports = router;
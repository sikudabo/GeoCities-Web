const express = require('express');
const router = express.Router();
const { PostModel } = require('../../db/models');

router.route('/api/upload-link-text').put(async (req, res) => {
    const { authorId, caption, communityName, createdAt, link, postType, postOriginType, userName, } = req.body;

    try {
        if (postType === 'text' && postOriginType === 'profile') {
            const newPost = new PostModel({
                authorId,
                caption,
                createdAt,
                postType,
                postOriginType,
                userName,
            });

            await newPost.save();
            res.status(200).json({ isError: false, message: 'Successfully uploaded post!' });
        } else if (postType === 'text' && postOriginType === 'community') {
            const newPost = new PostModel({
                authorId,
                caption,
                communityName,
                createdAt,
                postType,
                postOriginType,
                userName,
            });
            await newPost.save();
            res.status(200).json({ isError: false, message: 'Successfully uploaded post!' });
        } else if (postType === 'link' && postOriginType === 'profile') {
            const newPost = new PostModel({
                authorId,
                caption,
                createdAt,
                link,
                postType,
                postOriginType,
                userName,
            });
            await newPost.save();
            res.status(200).json({ isError: false, message: 'Successfully uploaded post!' });
        } else {
            const newPost = new PostModel({
                authorId,
                caption,
                communityName,
                createdAt,
                link,
                postType,
                postOriginType,
                userName,
            });
            await newPost.save();
            res.status(200).json({ isError: false, message: 'Successfully uploaded post!' });
        }
    } catch (e) {
        console.log(`There was an error saving a new ${postOriginType} ${postType} post: ${e.message}`);
        res.status(500).json({ isError: true, message: 'There was an error saving that post. Please try again!' });
    }
});

module.exports = router;
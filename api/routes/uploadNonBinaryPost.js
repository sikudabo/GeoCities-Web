const express = require('express');
const router = express.Router();
const { PostModel } = require('../../db/models');

router.route('/api/upload-link-text').put(async (req, res) => {
    const { authorId, caption, communityName, createdAt, link, postType, postOriginType, userName } = req.body;
    let hashTags = [];

    if (caption) {
        const splitCaption = caption.split(' ');
        splitCaption.forEach((caption) => {
            console.log('The caption is:', caption);
            if (caption.startsWith('#')) {
                let currentCaption = caption;
                hashTags.push(currentCaption.replace(/[^A-Za-z0-9]/g, ''));
            }
        });
    }

    try {
        if (postType === 'text' && postOriginType === 'profile') {
            const newPost = new PostModel({
                authorId,
                caption,
                createdAt: Number(createdAt),
                hashTags,
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
                hashtags,
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
                hashtags,
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
                hashtags,
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
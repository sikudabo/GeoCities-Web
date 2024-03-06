const express = require('express');
const router = express.Router();
const { UserModel } = require('../../db/models');

router.route('/api/update-user').post(async (req, res) => {
    const { _id, blockList, email, isBlocking, isUnblocking, locationCity, locationState, userId } = req.body;

    try {
        const emailTaken = await UserModel.findOne({ _id: { $ne: _id }, email });
        if (emailTaken) {
            res.status(200).json({ isError: true, message: 'That email is taken. Please select another!' });
            return;
        }
        await UserModel.updateOne({ _id }, { blockList, email, locationCity, locationState });
        if (isBlocking) {
            await UserModel.updateOne({ _id: userId }, { $push: { blockedFrom: _id }});
        } else if (isUnblocking) {
            await UserModel.updateOne({ _id: userId }, { $pull: { blockedFrom: _id }});
        }
        const updatedUser = await UserModel.findOne({ _id });
        res.status(200).json({ isError: false, message: 'Successfully updated profile.', updatedUser });
        return;
    } catch (err) {
        console.log(`There was an error updating a users' profile: ${err.message}`);
        res.status(500).json({ isError: true, message: 'There was an error updating your profile. Please try again' });
        return;
    }
});

module.exports = router;
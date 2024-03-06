const express = require('express');
const router = express.Router();
const { UserModel } = require('../../db/models');

router.route('/api/get-blocked-users/:_id').get(async (req, res) => {
    const { _id } = req.params;
    
    try {
        const { blockedList } = await UserModel.findOne({ _id });
        const blockedUsers = await UserModel.find({ _id: { $in: blockedList }}, { _id: 1, avatar: 1, firstName: 1, lastName: 1 });
        res.status(200).json({ isError: false, message: 'Fetched blocked users', blockedUsers });
        return;
    } catch(err) {
        console.log(`There was an error fetching the blocked users for a user: ${err.message}`);
        res.status(500).json({ isError: true, message: 'There was an error fetching the blocked users for a user.' });
        return;
    }
});

module.exports = router;
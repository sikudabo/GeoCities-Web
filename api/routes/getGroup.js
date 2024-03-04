const express = require('express');
const router = express.Router();
const { GroupModel, UserModel } = require('../../db/models');

router.route('/api/get-group/:groupName').get(async (req, res) => {
    const { groupName } = req.params;

    try {
        const group = await GroupModel.findOne({ groupName });
        const { blockList } = group;
        const blockedUsers = await UserModel.find({ _id: { $in: blockList } }, { _id: 1, avatar: 1, firstName: 1, lastName: 1});
        res.status(200).json({ isSuccess: true, blockedUsers, group });
    }

    catch(err) {
        console.log(`There was an error fetching a group: ${err.message}`);
        res.status(500).json({ isSuccess: false, message: 'There was an error fetching a group!' });
    }
});

module.exports = router;
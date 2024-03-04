const express = require('express');
const router = express.Router();
const { GroupModel, UserModel } = require('../../db/models');

router.route('/api/join-group').post(async (req, res) => {
    const { groupName, _id } = req.params;

    try {
        await GroupModel.updateOne({ groupName }, { $push: { members: _id }});
        const { _id: groupId } = await GroupModel.findOne({ groupName });
        await UserModel.updateOne({ _id }, { $push: { groups: groupId }});
        res.status(200).json({ isError: false, message: `Successfully joined ${groupName}.` });
        return;
    } catch(err) {
        console.log(`There was an error when a user tried to join the ${groupName} group: ${err.message}`);
        res.status(500).json({ isError: true, message: `There was an error joining the ${groupName} group. Please try again!` });
        return;
    }
});

module.exports = router;
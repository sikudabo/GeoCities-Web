const express = require('express');
const router = express.Router();
const { GroupModel } = require('../../db/models');

router.route('/api/update-group').post(async (req, res) => {
    const { blockList, description, groupName, rules, topic, } = req.body;

    try {
        await GroupModel.updateOne({ groupName }, { $set: { blockList, description, rules, topic }});
        res.status(200).json({ isSuccess: true, message: 'Successfully updated group.' });
    } catch(err) {
        console.log(`There was an error updating a group: ${err.message}`);
        res.status(500).json({ isError: true, message: 'There was an error updating a group. Please try again!' });
    }
});

module.exports = router;
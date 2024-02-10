const express = require('express');
const router = express.Router();
const { GroupModel } = require('../../db/models');

router.route('/api/add-or-remove-group-user').post(async (req, res) => {
    const { groupId, isAdd, userId } = req.body;

    try {
        if (isAdd) {
            await GroupModel.updateOne({ _id: groupId }, { $push: { members: userId }});
            res.status(200).json({ isError: 'false', message: 'Successfully joined group.' });
            return;
        }

        await GroupModel.updateOne({ _id: groupId }, { $pull: { members: userId }});
        res.status(200).json({ isError: false, message: 'Successfully left group.' });
        return;
    }
    catch(err) {
        console.log(`There was an error ${isAdd ? 'joining' : 'leaving'} a group: ${err.message}`);
        res.status(500).json({ isError: true, message: `There was an error ${isAdd ? 'joining' : 'leaving'} that group.`});
        return;
    }
});

module.exports = router;
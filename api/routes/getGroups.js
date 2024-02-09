const express = require('express');
const router = express.Router();
const { GroupModel, UserModel } = require('../../db/models');

router.route('/api/get-groups/:user_id').get(async (req, res) => {
    const { user_id } = req.params;

    try {
        const { groups: userGroups } = await UserModel.findOne({ _id: user_id });
        const groups = await GroupModel.find({ _id: { $in: userGroups }});
        res.status(200).json({ isError: false, groups });
    } 
    catch(err) {
        console.log(`There was an error fetching a users' groups: ${err.message}`);
        res.status(500).json({ isError: true, message: 'There was an error fetching the groups for this user.' });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { GroupModel } = require('../../db/models');

router.route('/api/get-all-groups').get(async (req, res) => {
    try {
        const groups = await GroupModel.find({});
        res.status(200).json({ isError: false, groups });
        return;
    } catch (err) {
        console.log(`There was an error fetching all of the GeoGroups groups: ${err.message}`);
        res.status(500).json({ isError: true, message: 'There was an error fetching all of the GeoGroups groups.' });
        return;
    }
});

module.exports = router;
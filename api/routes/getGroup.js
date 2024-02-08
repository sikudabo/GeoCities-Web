const express = require('express');
const router = express.Router();
const { GroupModel } = require('../../db/models');

router.route('/api/get-group/:_id').get(async (req, res) => {
    const { _id } = req.params;

    try {
        const group = await GroupModel.findOne({ _id });
        res.status(200).json({ isSuccess: true, group });
    }

    catch(err) {
        console.log(`There was an error fetching a group: ${err.message}`);
        res.status(500).json({ isSuccess: false, message: 'There was an error fetching a group!' });
    }
});

module.exports = router;
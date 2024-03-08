const express = require('express');
const router = express.Router();
const { EventModel, UserModel } = require('../../db/models');

router.route('/api/get-all-events/:_id').get(async (req, res) => {
    const { _id } = req.params;

    try {
        const { blockedFrom } = await UserModel.findOne({ _id });
        const events = await EventModel.find({ authorId: { $nin: blockedFrom }}).sort({ eventDate: 1 });
        res.status(200).json({ isError: false, message: 'Successfully fetched events.', events });
        return;
    } catch (err) {
        console.log(`There was an error fetching events: ${err.message}`);
        res.status(500).json({ isError: true, message: 'There was an error fetching events.' });
        return;
    }
});

module.exports = router;
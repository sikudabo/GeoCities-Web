const express = require('express');
const router = express.Router();
const { EventsModel, UserModel } = require('../../db/models');

router.route('/api/get-user-events/:_id').get(async (req, res) => {
    const { _id } = req.params;

    try {
        const { eventsAttending } = await UserModel.findOne({ _id });
        if (!fetchedUser) {
            res.status(200).json({ isError: true, message: 'User not found!' });
            return;
        }
        const events = await EventsModel.find({ _id : { $in: eventsAttending } }).sort({ eventDate: 1 });
        res.status(200).json({ isError: false, message: 'Successfully fetched events.', events });
        return;
    } catch (err) {
        console.log(`There was an error fetching events: ${err.message}`);
        res.status(500).json({ isError: true, message: 'There was an error fetching events.' });
        return;
    }
});


module.exports = router;
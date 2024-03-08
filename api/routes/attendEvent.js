const express = require('express');
const router = express.Router();
const { EventModel, UserModel } = require('../../db/models');

router.route('/api/attend-event').post(async (req, res) => {
    const { eventId, isAttending, userId } = req.body;

    try {
        if (isAttending) {
            await EventModel.updateOne({ _id: eventId }, { $push: { attendees: userId }});
            await UserModel.updateOne({ _id: userId }, { $push: { eventsAttending: eventId }});
            res.status(200).json({ isError: false, message:'You are now attending this event!'});
        } else {
            await EventModel.updateOne({ _id: eventId }, { $pull: { attendees: userId }});
            await UserModel.updateOne({ _id: userId }, { $pull: { eventsAttending: eventId }});
            res.status(200).json({ isError: false, message:'You are no longer attending this event!'});
        }
        res.status(200).json({ isSuccess: true, message: 'Successfully updated event.' });
    } catch (err) {
        console.log(`There was an error updating letting a user ${isAttending ? 'attend' : 'unattend'} an event: ${err.message}`);
        res.status(500).json({ isError: true, message: `There was an error letting a user ${isAttending ? 'attend' : 'unattend'} an event. Please try again!` });
        return;
    }
});

module.exports = router;
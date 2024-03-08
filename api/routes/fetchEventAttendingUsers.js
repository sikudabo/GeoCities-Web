const express = require('express');
const router = express.Router();
const { EventModel, UserModel } = require('../../db/models');

router.route('/api/fetch-event-attending-users/:eventId').get(async (req, res) => {
    const { eventId: _id } = req.params;
    
    try {
        const { attendees } = await EventModel.findOne({ _id });
        const usersAttending = await UserModel.find({ _id: { $in: attendees }}, { avatar: 1, dob: 1, firstName: 1, followers: 1, _id: 1, lastName: 1, locationCity: 1, locationState: 1, });
        res.status(200).json({ users: usersAttending, isError: false, message: 'Successfully retrieved attendees.' });
        return;
    } catch (err) {
        console.log(`There was an error retrieving the users that attend an event: ${err.message}`);
        res.status(500).json({ isError: true, message: 'There was an error retrieving the users that attend an event.' });
        return;
    }
});

module.exports = router;
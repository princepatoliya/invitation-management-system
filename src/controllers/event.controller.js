const Event = require("../models/event.model");
const eventServices = require("../services/event.services");
const mongoose = require("mongoose");

exports.createEvent = async (req, res) => {
    try {
        let { title, description, event_time, participants_list } = { ...req.body };
        const titleExist = await eventServices.doesTitleExist(title);

        if (titleExist) {
            return res.status(400).json({ errorFound: 1, message: "Title already exist" });
        }

        const eventId = new mongoose.Types.ObjectId();
        const organizer = req.user._id;

        participants_list = participants_list.map((id) => {
            return { participant: id };
        });

        const event = await Event.create({
            _id: eventId,
            title: title,
            description: description,
            event_time: event_time,
            organizer: organizer,
            participants_list: participants_list,
        });

        const emailResponse = await eventServices.sendEventInvitation(eventId, event, req.user);
        if (emailResponse instanceof Error) res.status(500).json({ errorFound: 1, message: emailResponse });

        res.status(200).json({ errorFound: 0, message: event });
    } catch (e) {
        res.status(400).json({ errorFound: 1, message: e.toString() });
    }
};

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

exports.updateEvent = async (req, res) => {
    try {
        const paramsKeys = Object.keys(req.body);
        const params = { ...req.body };

        const allowedParams = ["title", "description", "event_time", "participants_list"];
        const isValidParams = paramsKeys.every((val) => allowedParams.includes(val));

        if (!isValidParams) return res.status(400).json({ errorFound: 1, message: "Invalid Parameter" });

        const eventObj = await Event.findByIdAndUpdate(req.params.id);

        const updatedEvent = await eventServices.updateEventData(paramsKeys, params, eventObj);

        res.status(200).json({ errorFound: 0, message: updatedEvent });
    } catch (e) {
        res.status(400).json({ errorFound: 1, message: e.toString() });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const params = { ...req.params };
        const event = await Event.findByIdAndRemove(params.id);

        res.status(200).json({ errorFound: 0, message: event });
    } catch (e) {
        res.status(400).json({ errorFound: 1, message: e.toString() });
    }
};

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const eventSchema = new Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
        },

        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            unique: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        event_time: {
            type: Date,
            required: true,
            trim: true,
        },

        organizer: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },

        participants_list: [
            {
                participant: {
                    type: Schema.Types.ObjectId,
                    ref: "users",
                    required: true,
                },
                accepted: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Event = mongoose.model("events", eventSchema);

module.exports = Event;

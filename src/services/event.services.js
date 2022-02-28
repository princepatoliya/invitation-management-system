const Event = require("../models/event.model");
const emailClient = require("@sendgrid/mail");

exports.doesTitleExist = async (title) => {
    const event = await Event.findOne({ title: title });
    if (event) return true;
    return false;
};

exports.sendEventInvitation = async (eventId, event, user, updated = 0, deleted = 0) => {
    const emails = await Event.findById({ _id: eventId }).populate("participants_list.participant");

    // console.log(emails.participants_list);
    // console.log(typeof emails.participants_list);
    const structured_list = [...emails.participants_list];
    const participants_email = structured_list.map((val) => val.participant.email);

    let startTime = new Date(event.event_time);
    startTime = new Date(startTime.getTime() + startTime.getTimezoneOffset() * 60000);

    try {
        emailClient.setApiKey(process.env.SENDGRID_API_KEY);
        let helper = "Event Details";
        if (updated) {
            helper = "Updated Event Details";
        }

        const emailDetails = {
            to: participants_email,
            from: process.env.sender_email_address, // Use the email address or domain you verified above
            subject: `Event Invitaion from ${user.name}`,
            content: [
                {
                    type: "text/html",
                    value: `
                    <div>
    	                <h3 style="text-align:center;">Yeah! you got Event Invitation from ${user.name} ✉️</h3>
                        <h3>${helper}</h3>
                        <div style="width: 700px;">
                            <p><b>Event Title:</b> ${event.title}</p>
                            <p><b>Event Description: </b>${event.description}</p>
                            <p><b>Time: </b>${startTime}</p>
                        </div>
                    </div>
                    `,
                },
            ],
        };

        const emailResponse = await emailClient.send(emailDetails);
        if (emailResponse[0].statusCode === 202) {
            console.log("Event Invitation sent Successfully via Email");
            return true;
        }

        return false;
    } catch (e) {
        throw new Error("Email sending Failed");
    }
};

exports.updateEventData = async (paramsKeys, params, eventObj) => {
    try {
        // params.participants_list = params.participants_list.map((id) => {
        //     return { participant: id };
        // });

        const old_participants_list = eventObj.participants_list.map((obj) => {
            return obj.participant.toString();
        });

        console.log(params.participants_list);
        console.log(old_participants_list);

        if (params.participants_list === old_participants_list) {
            console.log("SAME................................");
            delete params.participants_list;
            paramsKeys = paramsKeys.filter((val) => val !== "participants_list");
        } else {
            console.log("NOT SAME................................");
            const list = old_participants_list.concat(params.participants_list);
            params.participants_list = [...new Set(list.map((item) => item.participant))];
        }

        // console.log("params", params);
        // console.log("params Keys", paramsKeys);
        paramsKeys.forEach((val) => (eventObj[val] = params[val]));
        updatedEvent = await eventObj.save();
        return updatedEvent;
    } catch (e) {
        return e.toString();
    }

    // paramsKeys.forEach((val) => (eventObj[val] = params[val]));
    // updatedEvent = await eventObj.save();

    // const emailResponse = await eventServices.sendEventInvitation(updatedEvent._id, updatedEvent, req.user, 1);
    // if (emailResponse instanceof Error) res.status(500).json({ errorFound: 1, message: emailResponse });
};

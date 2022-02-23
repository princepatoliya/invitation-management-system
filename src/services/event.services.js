const Event = require("../models/event.model");
const emailClient = require("@sendgrid/mail");

exports.doesTitleExist = async (title) => {
    const event = await Event.findOne({ title: title });
    if (event) return true;
    return false;
};

exports.sendEventInvitation = async (eventId, event, user) => {
    const emails = await Event.findById({ _id: eventId }).populate("participants_list.participant");

    // console.log(emails.participants_list);
    // console.log(typeof emails.participants_list);
    const structured_list = [...emails.participants_list];
    const participants_email = structured_list.map((val) => val.participant.email);

    let startTime = new Date(event.event_time);
    startTime = new Date(startTime.getTime() + startTime.getTimezoneOffset() * 60000);

    try {
        emailClient.setApiKey(process.env.SENDGRID_API_KEY);

        const emailDetails = {
            to: participants_email,
            from: process.env.sender_email_address, // Use the email address or domain you verified above
            subject: "Event Invitaion ",
            content: [
                {
                    type: "text/html",
                    value: `
                    <div>
    	                <h3 style="text-align:center;">Yeah! you got Event Invitation from ${user.name} ✉️</h3>
        
                        <div style="width: 700px;">
                            <p>Event Title: <b>${event.title}</b></p>
                            <p>Event Description: <b>${event.description}</b></p>
                            <p>Time: <b>${startTime}</b> </p>
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

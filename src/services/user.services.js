const User = require("../models/user.model");

exports.doesEmailOrContactExist = async (email, contact) => {
    try {
        const userEmail = await User.findOne({ email: email });
        const userContact = await User.findOne({ contact: contact });
        // console.log(user);
        if (userEmail || userContact) {
            return true;
        }
        return false;
    } catch (e) {
        console.log("Error: ", e);
        return false;
    }
};

const User = require("../models/user.model");

exports.doesEmailExist = async (email) => {
    try {
        const user = await User.findOne({ email: email });
        console.log(user);
        if (user) {
            return true;
        }
        return false;
    } catch (e) {
        console.log("Error: ", e);
        return false;
    }
};

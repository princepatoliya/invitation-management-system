const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

exports.authTokenValidation = async (req, res, next) => {
    try {
        // console.log("Auth Trigger");
        const token = req.header("Authorization").replace("Bearer", "").trim();
        const decode = jwt.verify(token, "burgerkingfallstoday");
        const user = await User.findOne({ _id: decode._id, "tokens.token": token });

        if (!user) throw new Error("Invalid token");

        req.user = user;
        req.token = token;
        next();
    } catch (e) {
        res.status(401).json({ errorFound: 1, message: e.toString() });
    }
};

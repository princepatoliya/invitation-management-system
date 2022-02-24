const User = require("../models/user.model");

exports.removeUserRecord = async (req, res) => {
    try {
        // const user = await User.findByIdAndRemove(req.user._id);
        await req.user.remove();
        res.status(200).json({ errorFound: 0, message: `${req.user.name} deleted successfully.` });
    } catch (e) {
        res.status(400).json({ errorFound: 1, message: e.toString() });
    }
};

exports.updateUserRecord = async (req, res) => {
    const params = Object.keys(req.body);

    if (params.length === 0) return res.status(400).json({ errorFound: 1, message: "Empty body" });

    const allowedParams = ["name", "email", "password", "contact", "age"];
    const isValidParams = params.every((val) => allowedParams.includes(val));

    if (!isValidParams) return res.status(400).json({ errorFound: 1, message: "Invalid Parameter" });

    params.forEach((key) => (req.user[key] = req.body[key]));
    await req.user.save();

    req.res.status(200).json({ errorFound: 1, message: req.user });
};

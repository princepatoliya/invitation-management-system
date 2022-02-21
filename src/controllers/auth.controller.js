const User = require("../models/user.model");
const mongoose = require("mongoose");
const userServices = require("../services/user.services");

exports.register = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId();
        const params = { _id: userId, ...req.body };

        const emailExist = await userServices.doesEmailExist(params.email);

        if (emailExist) {
            return res.status(400).json({ errorFound: 1, message: "Email already exist" });
        }

        const user = await User.create(params);

        res.status(200).json({ errorFound: 0, user });
    } catch (e) {
        res.status(400).json({ errorFound: 1, message: e.toString() });
    }
};

exports.login = async (req, res) => {
    try {
        const params = { ...req.body };

        const user = await User.findByCredentials(params.email, params.password);
        if (user instanceof Error) {
            throw new Error("Invalid Credentials");
        }
        const userToken = await user.generateAuthToken();

        res.status(200).json({ errorFound: 0, user, token: userToken });
    } catch (e) {
        res.status(400).json({ errorFound: 1, message: e.toString() });
    }
};

exports.logoutUser = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((obj) => {
            return obj.token !== req.token;
        });

        await req.user.save();

        res.status(200).json({ errorFound: 0, message: "Logged Out" });
    } catch (e) {
        res.status(400).json({ errorFound: 1, message: e.toString() });
    }
};

exports.logoutAllUser = async (req, res) => {
    try {
        req.user.tokens = [];

        await req.user.save();

        res.status(200).json({ errorFound: 0, message: "Logged Out All Users" });
    } catch (e) {
        res.status(400).json({ errorFound: 1, message: e.toString() });
    }
};

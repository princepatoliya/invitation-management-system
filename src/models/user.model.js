const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Event = require("./event.model");

const userSchema = new Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            validate(val) {
                if (!validator.isEmail(val)) {
                    throw new Error("Invalid Email");
                }
            },
        },

        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 6,
            validate(val) {
                if (val.toLowerCase().includes("password")) {
                    throw new Error("Password can not contain password word");
                }
            },
        },
        contact: {
            type: String,
            required: true,
            unique: true,
            validate(val) {
                if (val.length !== 10) {
                    throw new Error("Contact should be 10 digit number");
                }
            },
        },

        age: {
            type: Number,
            required: true,
            validate(val) {
                if (val > 0 && val < 18) {
                    throw new Error("Age must be greater then 18.");
                }
            },
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        return (this.password = await bcrypt.hash(this.password, 12));
    }
});

userSchema.statics.findByCredentials = async function (email, password) {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("Email not exist");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid Password");
        }
        return user;
    } catch (e) {
        return e;
    }
};

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, "burgerkingfallstoday");

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
};

userSchema.pre("remove", async function (next) {
    console.log("Pre remove triggered");
    console.log(this._id);
    const event = await Event.remove({ organizer: this._id });
    console.log(event);
    next();
});

const User = mongoose.model("users", userSchema);
module.exports = User;

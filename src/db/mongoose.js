const mongoose = require("mongoose");

main();

async function main() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/invitation-management");
        console.log("->MongoDB connected");
    } catch (e) {
        console.log(e);
    }
}

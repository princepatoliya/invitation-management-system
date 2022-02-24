const authRoutes = require("./auth.routes");
const middleware = require("../middleware/auth");
const eventRoutes = require("./event.routes");
const userRoutes = require("./user.routes");

module.exports = function (app) {
    app.use("/auth", authRoutes);
    app.use("/user/profile", middleware.authTokenValidation, userRoutes);
    app.use("/user/event", middleware.authTokenValidation, eventRoutes);
};

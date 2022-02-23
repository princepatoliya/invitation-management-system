const authRoutes = require("./auth.routes");
const eventRoutes = require("./event.routes");
const middleware = require("../middleware/auth");

module.exports = function (app) {
    app.use("/auth", authRoutes);
    app.use("/event", middleware.authTokenValidation, eventRoutes);
};

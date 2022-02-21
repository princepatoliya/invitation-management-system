const authRoutes = require("./auth.routes");

module.exports = function (app) {
    app.use("/auth", authRoutes);
};

const express = require("express");
require("./db/mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
require("./routes")(app);

app.listen(PORT, () => {
    console.log(`server up on ${PORT} Port`);
});

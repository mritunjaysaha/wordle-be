require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// ROUTES
const wordRoutesV1 = require("./routes/v1/words.routes");

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json({ extend: false }));

app.get("/", (req, res) => {
    res.send("server up and running");
});

app.use("/api/v1/words", wordRoutesV1);

module.exports = { app };

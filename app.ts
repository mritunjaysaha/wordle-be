require("dotenv").config();

import express from "express";

import cors from "cors";
import cookieParser from "cookie-parser";

// ROUTES
import wordRoutesV1 from "./routes/v1/words.routes";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("server up and running");
});

app.use("/api/v1/words", wordRoutesV1);

export { app };

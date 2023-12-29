require("dotenv").config();

import express from "express";

import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.config";

// ROUTES
import wordRoutesV1 from "./routes/v1/words.routes";
import authRoutesV1 from "./routes/v1/auth.routes";
import userRoutesV1 from "./routes/v1/user.routes";

// INITIALIZE APP
const app = express();

// CONNECT DB
connectDB();

// INITIALIZE MIDDLEWARE
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("server up and running");
});

app.use("/api/v1/words", wordRoutesV1);
app.use("/api/v1/auth", authRoutesV1);
app.use("/api/v1/users", userRoutesV1);

export { app };

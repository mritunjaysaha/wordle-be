require("dotenv").config();

import express from "express";

import cors from "cors";
import cookieParser from "cookie-parser";

// ROUTES
import wordRoutesV1 from "./routes/v1/words.routes";
import authRoutesV1 from "./routes/v1/auth.routes";
import { connectDB } from "./config/db.config";

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

export { app };

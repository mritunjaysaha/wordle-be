require("dotenv").config();

import express from "express";

import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import passport from "passport";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { connectDB } from "./config/db.config";

// ROUTES
import { UserModel } from "./models/user.model";
import authRoutesV1 from "./routes/v1/auth.routes";
import userRoutesV1 from "./routes/v1/user.routes";
import wordRoutesV1 from "./routes/v1/words.routes";

// INITIALIZE APP
const app = express();

// CONNECT DB
connectDB();

// INITIALIZE MIDDLEWARE
app.use(cors({ origin: true }));
app.use(cookieParser());
app.use(express.json());
app.use(
    session({
        secret: process.env.SECRET, //secret used to sign the session ID cookie
        resave: true, //save session on every request
        saveUninitialized: true, //save uninitialized sessions (new and not modified)
    })
);

app.use(passport.initialize()); //initialize Passport authentication
app.use(passport.session()); //use Passport for session authentication

//Google Strateg
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
        },

        async (accessToken, refreshToken, profile, cb) => {
            console.log({ profile });

            const user = await UserModel.findOne({ googleId: profile.id });

            if (!user) {
                const newUser = new UserModel({
                    googleId: profile.id,
                    username: profile.username,
                });

                await newUser.save();

                cb(null, newUser);
            }

            cb(null, user);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get(
    "/api/v1/oauth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
    "/api/v1/oauth/google/callback",
    passport.authenticate("google", {
        successRedirect: `${process.env.CLIENT_URL}/`,
        failureRedirect: `${process.env.CLIENT_URL}/auth/login`,
    }),
    (req, res) => {
        //successful authentication, redirect home
        console.log({ req });
        res.redirect(process.env.CLIENT_URL);
    }
);

app.get("/getuser", (req, res) => {
    res.send(req.user);
});

app.get("/api/v1/oauth/login/success", async (req, res) => {
    if (req.user) {
        res.status(200).json({ message: "user Login", user: req.user });
    } else {
        res.status(400).json({ message: "Not Authorized" });
    }
});

app.get("/api/v1/oauth/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("http://localhost:3001");
    });
});

app.get("/", (req, res) => {
    res.send("server up and running");
});

app.use("/api/v1/words", wordRoutesV1);
app.use("/api/v1/auth", authRoutesV1);
app.use("/api/v1/users", userRoutesV1);

export { app };

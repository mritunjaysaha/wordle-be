require("dotenv").config();

import express from "express";

import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import passport from "passport";

import googleStrategy from "passport-google-oauth20";

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
        cookie: {
            sameSite: "none", //allow cross-site requests from different origin
            secure: true, //requires HTTPS. For local environment you may skip this.
            maxAge: 1000 * 60 * 60 * 24 * 7, // One Week
        },
    })
);

app.use(passport.initialize()); //initialize Passport authentication
app.use(passport.session()); //use Passport for session authentication

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    UserModel.findById(id, (err, doc) => {
        done(null, doc);
    });
});

//Google Strateg
passport.use(
    new googleStrategy(
        {
            clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
        },

        function (accessToken, refreshToken, profile, cb) {
            UserModel.findOne({ googleId: profile.id }, async (err, user) => {
                if (err) return cb(err, null);
                if (!user) {
                    const newUser = new UserModel({
                        googleId: profile.id,
                        username: profile.displayName,
                    });
                    await newUser.save();
                    cb(null, newUser);
                }
                cb(null, user);
            });
        }
    )
);

app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile"] })
);

app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        //successful authentication, redirect home
        console.log({ req });
        res.redirect(process.env.CLIENT_URL);
    }
);

app.get("/getuser", (req, res) => {
    res.send(req.user);
});

app.get("/auth/logout", function (req, res, next) {
    req.logout(function (err) {
        console.log("logged out");
        if (err) {
            return next(err);
        }
        res.send("done");
    });
});

app.get("/", (req, res) => {
    res.send("server up and running");
});

app.use("/api/v1/words", wordRoutesV1);
app.use("/api/v1/auth", authRoutesV1);
app.use("/api/v1/users", userRoutesV1);

export { app };

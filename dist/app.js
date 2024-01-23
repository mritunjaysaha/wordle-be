"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const db_config_1 = require("./config/db.config");
// ROUTES
const user_model_1 = require("./models/user.model");
const auth_routes_1 = __importDefault(require("./routes/v1/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/v1/user.routes"));
const words_routes_1 = __importDefault(require("./routes/v1/words.routes"));
// INITIALIZE APP
const app = (0, express_1.default)();
exports.app = app;
// CONNECT DB
(0, db_config_1.connectDB)();
// INITIALIZE MIDDLEWARE
app.use((0, cors_1.default)({ origin: true }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: process.env.SECRET, //secret used to sign the session ID cookie
    resave: true, //save session on every request
    saveUninitialized: true, //save uninitialized sessions (new and not modified)
    cookie: {
        sameSite: "none", //allow cross-site requests from different origin
        secure: true, //requires HTTPS. For local environment you may skip this.
        maxAge: 1000 * 60 * 60 * 24 * 7, // One Week
    },
}));
app.use(passport_1.default.initialize()); //initialize Passport authentication
app.use(passport_1.default.session()); //use Passport for session authentication
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser((id, done) => {
    user_model_1.UserModel.findById(id, (err, doc) => {
        done(null, doc);
    });
});
//Google Strateg
passport_1.default.use(new passport_google_oauth20_1.default({
    clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
}, function (accessToken, refreshToken, profile, cb) {
    user_model_1.UserModel.findOne({ googleId: profile.id }, (err, user) => __awaiter(this, void 0, void 0, function* () {
        if (err)
            return cb(err, null);
        if (!user) {
            const newUser = new User({
                googleId: profile.id,
                username: profile.displayName,
            });
            yield newUser.save();
            cb(null, newUser);
        }
        cb(null, user);
    }));
}));
app.get("/auth/google", passport_1.default.authenticate("google", { scope: ["profile"] }));
app.get("/auth/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
    //successful authentication, redirect home
    res.redirect(process.env.CLIENT_URL);
});
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
app.use("/api/v1/words", words_routes_1.default);
app.use("/api/v1/auth", auth_routes_1.default);
app.use("/api/v1/users", user_routes_1.default);
//# sourceMappingURL=app.js.map
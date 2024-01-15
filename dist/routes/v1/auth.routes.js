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
const axios_1 = __importDefault(require("axios"));
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_controller_1 = require("../../controllers/auth.controller");
const user_controller_1 = require("../../controllers/user.controller");
const router = (0, express_1.Router)();
router.param("userId", user_controller_1.getUserById);
/**
 * @method POST
 * @route /api/v1/auth/signup
 */
router.post("/signup", [
    (0, express_validator_1.check)("email", "E-mail is required").isEmail(),
    (0, express_validator_1.check)("password", "Password should have at least 3 characters").isLength({ min: 3 }),
], auth_controller_1.signUp);
/**
 * @method POST
 * @route /api/v1/auth/login
 */
router.post("/login", [
    (0, express_validator_1.check)("email", "E-mail is required").isEmail(),
    (0, express_validator_1.check)("password", "Password is require").isLength({ min: 1 }),
], auth_controller_1.signIn);
/**
 * @method GET
 * @route /api/v1/auth/logout
 */
router.delete("/logout", auth_controller_1.isSignedIn, auth_controller_1.signOut);
/**
 * @method GET
 * @route /api/v1/auth/is-signed-in
 */
router.get("/is-signed-in", auth_controller_1.isSignedIn, (req, res) => {
    // @ts-ignore
    res.json(req.auth);
});
router.get("/google", (req, res) => {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_OAUTH_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_OAUTH_REDIRECT_URL}&response_type=code&scope=profile email`;
    res.redirect(url);
});
router.get("/google/callback", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.query;
    console.log({ code });
    try {
        const { data } = yield axios_1.default.post("<https://oauth2.googleapis.com/token>", {
            client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
            client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
            code,
            redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
            grant_type: "authorization_code",
        });
        const { access_token, id_token } = data;
        console.log({ access_token, id_token });
        const { data: profile } = yield axios_1.default.get("<https://www.googleapis.com/oauth2/v1/userinfo>", {
            headers: { Authorization: `Bearer ${access_token}` },
        });
        console.log({ profile });
        res.redirect("/");
    }
    catch (error) {
        console.error("Error:", error.response.data.error);
        res.redirect("/login");
    }
}));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map
import axios from "axios";
import { Router } from "express";
import { check } from "express-validator";
import {
    isSignedIn,
    signIn,
    signOut,
    signUp,
} from "../../controllers/auth.controller";
import { getUserById } from "../../controllers/user.controller";

const router = Router();

router.param("userId", getUserById);

/**
 * @method POST
 * @route /api/v1/auth/signup
 */
router.post(
    "/signup",
    [
        check("email", "E-mail is required").isEmail(),
        check(
            "password",
            "Password should have at least 3 characters"
        ).isLength({ min: 3 }),
    ],
    signUp
);

/**
 * @method POST
 * @route /api/v1/auth/login
 */
router.post(
    "/login",
    [
        check("email", "E-mail is required").isEmail(),
        check("password", "Password is require").isLength({ min: 1 }),
    ],
    signIn
);

/**
 * @method GET
 * @route /api/v1/auth/logout
 */
router.delete("/logout", isSignedIn, signOut);

/**
 * @method GET
 * @route /api/v1/auth/is-signed-in
 */
router.get("/is-signed-in", isSignedIn, (req, res) => {
    // @ts-ignore
    res.json(req.auth);
});

router.get("/google", (req, res) => {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_OAUTH_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_OAUTH_REDIRECT_URL}&response_type=code&scope=profile email`;

    res.redirect(url);
});

router.get("/google/callback", async (req, res) => {
    const { code } = req.query;

    console.log({ code });

    try {
        const { data } = await axios.post(
            "<https://oauth2.googleapis.com/token>",
            {
                client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
                client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
                code,
                redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
                grant_type: "authorization_code",
            }
        );

        const { access_token, id_token } = data;

        console.log({ access_token, id_token });

        const { data: profile } = await axios.get(
            "<https://www.googleapis.com/oauth2/v1/userinfo>",
            {
                headers: { Authorization: `Bearer ${access_token}` },
            }
        );

        console.log({ profile });

        res.redirect("/");
    } catch (error) {
        console.error("Error:", error.response.data.error);
        res.redirect("/login");
    }
});

export default router;

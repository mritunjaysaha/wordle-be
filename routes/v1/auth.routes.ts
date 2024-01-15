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
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_OAUTH_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=profile email`;

    res.redirect(url);
});

export default router;

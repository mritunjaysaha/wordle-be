import { Router, Request, Response } from "express";
import { check } from "express-validator";
import {
    signOut,
    isSignedIn,
    signUp,
    signIn,
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
        check(
            "firstName",
            "First name should be at least 1 character"
        ).isLength({ min: 1 }),
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
router.get("/logout", signOut);

/**
 * @method GET
 * @route /api/v1/auth/is-signed-in
 */
router.get("/is-signed-in", isSignedIn, (req, res) => {
    // @ts-ignore
    res.json(req.auth);
});

export default router;

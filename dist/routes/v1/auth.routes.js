"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    (0, express_validator_1.check)("firstName", "First name should be at least 1 character").isLength({ min: 1 }),
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
router.get("/logout", auth_controller_1.signOut);
/**
 * @method GET
 * @route /api/v1/auth/is-signed-in
 */
router.get("/is-signed-in", auth_controller_1.isSignedIn, (req, res) => {
    // @ts-ignore
    res.json(req.auth);
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map
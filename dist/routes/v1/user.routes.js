"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("../../controllers/auth.controller");
const auth_controller_2 = require("../../controllers/auth.controller");
const user_controller_1 = require("../../controllers/user.controller");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.param("userId", user_controller_1.getUserById);
router.get("/:userId", auth_controller_2.isSignedIn, auth_controller_1.isAuthenticated, user_controller_1.getUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map
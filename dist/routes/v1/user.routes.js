"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../../controllers/auth.controller");
const user_controller_1 = require("../../controllers/user.controller");
const router = (0, express_1.Router)();
router.param("userId", user_controller_1.getUserById);
router.get("/:userId", auth_controller_1.isSignedIn, auth_controller_1.isAuthenticated, user_controller_1.getUser);
router.get("/:userId/leaderboard", auth_controller_1.isSignedIn, auth_controller_1.isAuthenticated, user_controller_1.getLeaderBoard);
exports.default = router;
//# sourceMappingURL=user.routes.js.map
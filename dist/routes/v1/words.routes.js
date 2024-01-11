"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../../controllers/auth.controller");
const user_controller_1 = require("../../controllers/user.controller");
const word_controller_1 = require("../../controllers/word.controller");
const router = (0, express_1.Router)();
router.param("userId", user_controller_1.getUserById);
/**
 * @method GET
 * @route /api/v1/words
 * @params userId
 */
router.get("/", word_controller_1.getWord);
/**
 * @method GET
 * @route /api/v1/words/:uerId
 * @params userId
 */
router.get("/:userId", auth_controller_1.isSignedIn, auth_controller_1.isAuthenticated, word_controller_1.getWordSignedInUser);
/**
 * @method POST
 * @route /api/v1/words/:uerId
 * @params userId
 */
router.post("/:userId", auth_controller_1.isSignedIn, auth_controller_1.isAuthenticated, word_controller_1.addWordInUser);
exports.default = router;
//# sourceMappingURL=words.routes.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const word_controller_1 = require("../../controllers/word.controller");
const user_controller_1 = require("../../controllers/user.controller");
const router = (0, express_1.Router)();
router.param("userId", user_controller_1.getUserById);
/**
 * @method GET
 * @route /api/v1/auth/words
 */
router.get("/", word_controller_1.getWord);
/**
 * @method GET
 * @route /api/v1/auth/words/:uerId
 * @params userId
 */
router.get("/:userId", word_controller_1.getWord);
exports.default = router;
//# sourceMappingURL=words.routes.js.map
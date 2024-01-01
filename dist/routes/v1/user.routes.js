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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../../controllers/auth.controller");
const user_controller_1 = require("../../controllers/user.controller");
const user_model_1 = require("../../models/user.model");
const router = (0, express_1.Router)();
router.param("userId", user_controller_1.getUserById);
router.get("/:userId", auth_controller_1.isSignedIn, auth_controller_1.isAuthenticated, user_controller_1.getUser);
router.get("/:userId/leaderboard", auth_controller_1.isSignedIn, auth_controller_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.UserModel.find({ solvedWordsCount: { $gt: 0 } }, { _id: 0, solvedWordsCount: 1, email: 1 }).sort({ solvedWordsCount: -1 });
    console.log({ users });
    return res.json({ users });
}));
exports.default = router;
//# sourceMappingURL=user.routes.js.map
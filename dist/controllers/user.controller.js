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
exports.getUser = exports.getUserById = void 0;
const user_model_1 = require("../models/user.model");
const getUserById = (req, res, next, id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("[getUserById]", { id });
    const user = yield user_model_1.UserModel.findOne({ email: id });
    if (!user) {
        return res.status(401).json({ error: "email not found" });
    }
    req.profile = user;
    next();
});
exports.getUserById = getUserById;
const getUser = (req, res) => {
    req.profile.solvedWordsCount = req.profile.solvedWords.length;
    const { email, firstName, lastName, solvedWordsCount } = req.profile;
    return res.json({
        success: true,
        message: "User info fetched",
        user: {
            email,
            lastName,
            firstName,
            solvedWordsCount,
        },
    });
};
exports.getUser = getUser;
//# sourceMappingURL=user.controller.js.map
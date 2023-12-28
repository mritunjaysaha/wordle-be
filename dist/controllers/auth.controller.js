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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSignedIn = exports.signOut = exports.signIn = exports.signUp = void 0;
const user_model_1 = require("../models/user.model");
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_jwt_1 = require("express-jwt");
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array() });
        }
        const user = new user_model_1.UserModel(req.body);
        const savedUser = yield user.save();
        const { firstName, lastName, email } = savedUser;
        return res.json({ firstName, lastName, email });
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty) {
            return res.status(400).json({ error: errors.array() });
        }
        const { email, password } = req.body;
        // @ts-ignore
        user_model_1.UserModel.findOne({ email }, (err, user) => {
            if (err) {
                return res.status(422).json({ error: err });
            }
            if (!user) {
                return res.status(400).json({ error: "Email doesn't exists" });
            }
            if (!user.authenticate(password)) {
                return res.status(401).json({
                    error: "Email and password fo not match",
                });
            }
            const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.SECRET);
            res.cookie("token", token, {
                expires: new Date(Date.now() + 9999),
            });
            const { email, firstName, lastName } = user;
            return res.json({ token, user: { email, firstName, lastName } });
        });
    }
    catch (err) { }
});
exports.signIn = signIn;
const signOut = (req, res) => {
    res.clearCookie("token");
    return res.json({ message: "signed out" });
};
exports.signOut = signOut;
exports.isSignedIn = (0, express_jwt_1.expressjwt)({
    secret: process.env.SECRET,
    userProperty: "auth",
    algorithms: ["sha256", "RS256", "HS256"],
});
//# sourceMappingURL=auth.controller.js.map
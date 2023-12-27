import { UserModel } from "../models/user.model";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import { expressjwt } from "express-jwt";

export const signup = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.errors[0].msg });
    }

    const user = new UserModel(req.body);

    user.save((err, user) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        return res.json({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            id: user._id,
        });
    });
};

export const login = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors });
    }

    const { email, password } = req.body;

    UserModel.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "Email doesn't exists",
                message: err.message,
            });
        }

        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password do not match",
            });
        }

        const token = jwt.sign({ _id: user._id }, process.env.SECRET);

        res.cookie("token", token, { expire: new Date() + 9999 });

        // send response to frontend
        const { email, firstName, lastName } = user;

        return res.json({
            token,
            user: { email, firstName, lastName },
        });
    });
};

export const signOut = (req, res) => {
    res.clearCookie("token");

    return res.json({ message: "signed out" });
};

export const isSignedIn = expressjwt({
    secret: process.env.SECRET,
    userProperty: "auth",
    algorithms: ["sha256", "RS256", "HS256"],
});

export const isAuthenticated = (req, onse, next) => {
    const { profile, auth } = req;

    const checker = profile && auth && profile._id.toString() === auth._id;

    if (!checker) {
        return res.status(401).json({ error: "[ACCESS DENIED]" });
    }

    next();
};

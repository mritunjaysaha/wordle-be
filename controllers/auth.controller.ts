import { UserModel } from "../models/user.model";
import { validationResult } from "express-validator";

import jwt from "jsonwebtoken";

import { NextFunction, Request, Response } from "express";
import type { Error } from "mongoose";
import { expressjwt } from "express-jwt";

export const signUp = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array() });
        }

        const user = new UserModel(req.body);
        const savedUser = await user.save();

        const { firstName, lastName, email } = savedUser;

        return res.json({ firstName, lastName, email });
    } catch (err: any) {
        return res.status(400).json({ error: err.message });
    }
};

export const signIn = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty) {
            return res.status(400).json({ error: errors.array() });
        }

        const { email, password } = req.body;

        // @ts-ignore
        // UserModel.findOne({ email }, (err: Error, user) => {
        //     if (err) {
        //         return res.status(422).json({ error: err });
        //     }

        //     if (!user) {
        //         return res.status(400).json({ error: "Email doesn't exists" });
        //     }

        //     if (!user.authenticate(password)) {
        //         return res.status(401).json({
        //             error: "Email and password fo not match",
        //         });
        //     }

        //     const token = jwt.sign({ _id: user._id }, process.env.SECRET);

        //     res.cookie("token", token, {
        //         expires: new Date(Date.now() + 9999),
        //     });

        //     const { email, firstName, lastName } = user;

        //     return res.json({ token, user: { email, firstName, lastName } });
        // });

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "Email doesn't exists" });
        }

        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password fo not match",
            });
        }

        const token = jwt.sign({ _id: user._id }, process.env.SECRET);

        res.cookie("token", token, {
            expires: new Date(Date.now() + 9999),
        });

        const { firstName, lastName } = user;

        return res.json({ token, user: { email, firstName, lastName } });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

export const signOut = (req: Request, res: Response) => {
    res.clearCookie("token");

    return res.json({ message: "signed out" });
};

export const isSignedIn = expressjwt({
    secret: process.env.SECRET,
    userProperty: "auth",
    // @ts-ignore
    algorithms: ["sha256", "RS256", "HS256"],
});

export const isAuthenticated = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // @ts-ignore
    const { profile, auth } = req;

    const checker = profile && auth && profile._id.toString() === auth._id;

    if (!checker) {
        return res.status(401).json({ error: "ACCESS DENIED" });
    }

    next();
};

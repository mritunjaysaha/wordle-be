import { validationResult } from "express-validator";
import { UserModel } from "../models/user.model";

import jwt from "jsonwebtoken";

import { NextFunction, Request, Response } from "express";
import { expressjwt } from "express-jwt";

export const signUp = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array() });
        }

        const user = new UserModel(req.body);
        const savedUser = await user.save();

        if (savedUser) {
            return res.json({
                success: true,
                message: "Sign up successful",
            });
        } else {
            return res.json({
                success: true,
                message: "Sign up failed. Failed to save user",
            });
        }
    } catch (err: any) {
        return res
            .status(400)
            .json({ error: err.message, message: "Sign up failed" });
    }
};

export const signIn = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty) {
            return res.status(400).json({ error: errors.array() });
        }

        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "Email doesn't exists" });
        }

        // @ts-expect-error
        if (!user.authenticate(password)) {
            return res.status(401).json({
                success: false,
                error: "Email and password fo not match",
            });
        }

        const token = jwt.sign({ email }, process.env.SECRET, {
            expiresIn: "7d",
        });

        res.cookie("token", token, {
            expires: new Date(Date.now() + 9999),
        });

        return res.json({
            success: true,
            message: "Login successfully",
            token,
        });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};

export const signOut = (req: Request, res: Response) => {
    res.clearCookie("token");

    return res.json({ success: true, message: "signed out" });
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

    const checker = profile && auth && profile.email === auth.email;

    if (!checker) {
        return res.status(401).json({ error: "ACCESS DENIED" });
    }

    next();
};

import { UserModel } from "../models/user.model";
import { validationResult } from "express-validator";

import jwt from "jsonwebtoken";

import { Request, Response } from "express";
import type { Error } from "mongoose";

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
        UserModel.findOne({ email }, (err: Error, user) => {
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

            const token = jwt.sign({ _id: user._id }, process.env.SECRET);

            res.cookie("token", token, {
                expires: new Date(Date.now() + 9999),
            });

            const { email, firstName, lastName } = user;

            return res.json({ token, user: { email, firstName, lastName } });
        });
    } catch (err) {}
};

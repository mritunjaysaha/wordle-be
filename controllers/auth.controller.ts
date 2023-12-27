import { UserModel } from "../models/user.model";
import { validationResult } from "express-validator";

import { Request, Response } from "express";

export const signup = async (req: Request, res: Response) => {
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

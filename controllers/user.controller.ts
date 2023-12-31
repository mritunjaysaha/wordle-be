import { NextFunction, Response } from "express";
import { UserModel } from "../models/user.model";
import { RequestWithProfile } from "../types/RequestWithProfile";

export const getUserById = async (
    req: RequestWithProfile,
    res: Response,
    next: NextFunction,
    id: string
) => {
    console.log("[getUserById]", { id });

    const user = await UserModel.findOne({ email: id });

    if (!user) {
        return res.status(401).json({ error: "email not found" });
    }

    req.profile = user;

    next();
};

export const getUser = (req: RequestWithProfile, res: Response) => {
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

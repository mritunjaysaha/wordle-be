import { NextFunction, Request, Response } from "express";
import { UserModel } from "../models/user.model";
import type { IUser } from "../models/user.model";

type RequestWithProfile = Request & {
    profile: IUser;
};

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

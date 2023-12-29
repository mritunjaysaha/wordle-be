import { Request } from "express";
import { IUser } from "../models/user.model";

export type RequestWithProfile = Request & {
    profile: IUser;
};

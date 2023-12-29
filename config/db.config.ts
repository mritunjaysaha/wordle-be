// @ts-nocheck

import mongoose from "mongoose";

const db: string = process.env.MONGO_URI;

export const connectDB = async () => {
    try {
        await mongoose.connect(db);
        console.log("Database connection established");
    } catch (err: any) {
        console.error(err.message);
        process.exit(1);
    }
};

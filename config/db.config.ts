import mongoose from "mongoose";

const db: string = process.env.MONGO_URI;

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
};

export const connectDB = async () => {
    try {
        await mongoose.connect(db, options as any);
        console.log("Database connection established");
    } catch (err: any) {
        console.error(err.message);
        process.exit(1);
    }
};

const mongoose = require("mongoose");

const db = process.env.MONGO_URI;

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
};

export const connectDB = async () => {
    try {
        await mongoose.connect(db, options);
        console.log("Database connection established");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

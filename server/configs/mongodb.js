import mongoose from "mongoose";
import dotenv from "dotenv";

<<<<<<< HEAD
dotenv.config();
const connectDB = async () => {
    mongoose.connection.on('connected', () => console.log('Database Connected'));

    await mongoose.connect(`${process.env.MONGODB_URI}/build`);
=======
const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/build`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("Database Connected");
    } catch (error) {
        console.error("Database Connection Error:", error);
        process.exit(1);
    }
>>>>>>> 3a9f4401c0f6c7dcdfdef05bfe65ea86bc94f353
};

export default connectDB;

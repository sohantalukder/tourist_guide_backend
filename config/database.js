import dotenv from "dotenv";
import mongoose from "mongoose";
mongoose.set("strictQuery", true);
dotenv.config();

const URI = process.env.DB_URI;
const connectDatabase = async () => {
    try {
        const conn = await mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDatabase;

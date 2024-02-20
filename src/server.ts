import http from "http";
import app from "./api.js";
import cloudinary from "cloudinary";
import { config } from "./configs/config.js";
import dbConnection from "./models/index.js";

console.log("Hello Typescript Express API!!");
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
});

cloudinary.v2.config(config.cloudinary);

const server = http.createServer(app);
dbConnection
    .sync()
    .then(() => {
        console.log("Database synced successfully");
    })
    .catch((err: Error) => {
        console.log("Err", err);
    });
server.listen(config.port, () => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err: Error) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);

    server.close(() => {
        process.exit(1);
    });
});

// const express import 'express');
import express from "express";
import cors from "cors";
const app = express();
import path from "path";
// middleware
app.use(cors());
app.use(express.json());
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";

// import errorMiddleware from "./middleware/error";

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
// Route Imports
import settingsRoute from "./routes/Settings/generalSettingRoutes.js";
import admin from "./routes/userRoute.js";
app.use("/api/v1", settingsRoute);
app.use("/api/v1", admin);
app.use(express.static(path.join("http://localhost:3000/")));
app.get("*", (req, res) => {
    res.sendFile(path.resolve("http://localhost:3000/"));
});
// Middleware for Errors
// app.use(errorMiddleware);

export default app;

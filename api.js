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
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
// Route Imports
import userRoutes from "./routes/Auth/userRoute.js";
import adminRoutes from "./routes/Admin/adminRoutes.js";
import eventRoutes from "./routes/Events/eventRoutes.js";
import preferenceRoutes from "./routes/Preferences/preferencesRoute.js";

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/v1/preference", preferenceRoutes);
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/event", eventRoutes);
app.use(express.static(path.join("http://localhost:3000/")));
app.get("*", (req, res) => {
    res.sendFile(path.resolve("http://localhost:3000/"));
});
// Middleware for Errors
app.use(notFound);
app.use(errorHandler);

export default app;

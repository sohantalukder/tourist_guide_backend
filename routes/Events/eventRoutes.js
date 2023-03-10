import express from "express";
import { createEvent } from "../../controllers/Events/eventsController.js";
import { protect, verifiedEmail } from "../../middleware/authMiddleware.js";
import { singleUpload } from "../../middleware/multer.js";
const router = express.Router();

router
    .route("/createEvent")
    .post(protect, verifiedEmail, singleUpload, createEvent);

export default router;

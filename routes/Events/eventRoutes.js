import express from "express";
import {
    createEvent,
    deleteEvent,
    eventDetails,
    updateEventInfo,
} from "../../controllers/Events/eventsController.js";
import { protect, verifiedEmail } from "../../middleware/authMiddleware.js";
import { singleUpload } from "../../middleware/multer.js";
const router = express.Router();

router
    .route("/createEvent")
    .post(protect, verifiedEmail, singleUpload, createEvent);
router
    .route("/updateEvent/:id")
    .put(protect, verifiedEmail, singleUpload, updateEventInfo);
router.route("/:id").get(protect, verifiedEmail, eventDetails);
router.route("/:id").delete(protect, verifiedEmail, deleteEvent);

export default router;

import express from "express";
import {
    allEvents,
    createEvent,
    deleteEvent,
    eventDetails,
    updateEventInfo,
} from "../../controllers/Events/eventsController.js";
import { protect, verifiedEmail } from "../../middleware/authMiddleware.js";
import { upload } from "../../middleware/multer.js";
const router = express.Router();

router.route("/create").post(protect, verifiedEmail, upload, createEvent);
router
    .route("/update/:id")
    .put(protect, verifiedEmail, upload, updateEventInfo);
router.route("/:id").get(eventDetails);
router.route("/:id").delete(protect, verifiedEmail, deleteEvent);
router.route("").get(allEvents);

export default router;

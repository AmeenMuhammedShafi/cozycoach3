import express from "express";
import AdminController from "../controllers/AdminController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/delay", adminAuth, AdminController.updateDelay);
router.post("/draw", adminAuth, AdminController.drawWinner);

export default router;
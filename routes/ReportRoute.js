import express from "express";
import ReportController from "../controllers/ReportController.js";
import deviceAuth from "../middleware/deviceAuth.js";

const router = express.Router();

router.post('/', deviceAuth, ReportController.submitReport);
router.get('/status', deviceAuth, ReportController.getReportStatus);

export default router;
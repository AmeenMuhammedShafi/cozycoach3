import express from "express";
import ReportController from "../controllers/ReportController.js";

const router = express.Router();

router.post('/', ReportController.submitReport);
router.get('/status', ReportController.getReportStatus);

export default router;
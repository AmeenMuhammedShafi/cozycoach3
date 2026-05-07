import express from "express";
import AdminController from "../controllers/AdminController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/delay", adminAuth, AdminController.updateDelay);
router.post("/draw", adminAuth, AdminController.drawWinner);

router.post("/station", adminAuth, AdminController.addStation);
router.get("/stations", adminAuth, AdminController.listStations);

router.post("/train", adminAuth, AdminController.addTrain);
router.get("/trains", adminAuth, AdminController.listTrains);
router.post("/train/status", adminAuth, AdminController.updateTrainStatus);
router.post("/train/stop", adminAuth, AdminController.addTrainStop);

router.post("/delay-manual", adminAuth, AdminController.addDelayManual);
router.get("/delays", adminAuth, AdminController.listDelays);

router.post("/quiz", adminAuth, AdminController.addQuiz);
router.get("/quizzes", adminAuth, AdminController.listQuiz);

router.get("/stats", adminAuth, AdminController.getStats);

export default router;
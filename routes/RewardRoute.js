import express from "express";
import RewardController from "../controllers/RewardController.js";
import adminAuth from "../middleware/adminAuth.js";
import deviceAuth from "../middleware/deviceAuth.js";

const router = express.Router();

router.get('/win', deviceAuth, RewardController.getUserWin);
router.post('/submitupi', deviceAuth, RewardController.submitUpi);
router.post('/convert', deviceAuth, RewardController.convertXpToTicket);
router.get('/tickets', deviceAuth, RewardController.getUserTickets);
router.post('/draw', adminAuth, RewardController.drawWinner);

export default router;
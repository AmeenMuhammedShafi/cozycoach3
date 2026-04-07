import express from "express";
import RewardController from "../controllers/RewardController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.get('/win', RewardController.getUserWin);
router.post('/submitupi', RewardController.submitUpi);
router.post('/convert', RewardController.convertXpToTicket);
router.get('/tickets', RewardController.getUserTickets);
router.post('/draw', adminAuth,RewardController.drawWinner);

export default router;
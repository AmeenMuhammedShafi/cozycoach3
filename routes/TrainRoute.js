import express from "express";
import TrainController from "../controllers/TrainController.js";
import deviceAuth from "../middleware/deviceAuth.js";
const router = express.Router();

router.get('/search', deviceAuth, TrainController.search);
router.get('/:trainId', deviceAuth, TrainController.getById);

export default router;

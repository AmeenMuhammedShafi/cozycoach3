import express from "express";
import TrainController from "../controllers/TrainController.js";
const router = express.Router();

router.get('/search',TrainController.search);

export default router;

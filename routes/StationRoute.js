import StationController from "../controllers/StationController.js";
import deviceAuth from "../middleware/deviceAuth.js";
import express from "express";

const router = express.Router();

router.get('/search', deviceAuth, StationController.search);

export default router;

import StationController from "../controllers/StationController.js";

import express from "express";

const router = express.Router();

router.get('/search',StationController.search);

export default router;

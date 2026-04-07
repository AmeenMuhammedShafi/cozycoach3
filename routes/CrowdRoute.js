import express from "express";
import CrowdController from "../controllers/CrowdController.js";
import deviceAuth from "../middleware/deviceAuth.js";

const router = express.Router();

router.get('/', deviceAuth, CrowdController.getCrowd);

export default router;
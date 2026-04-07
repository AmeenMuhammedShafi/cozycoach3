import express from "express";
import CrowdController from "../controllers/CrowdController.js";

const router = express.Router();

router.get('/', CrowdController.getCrowd);

export default router;
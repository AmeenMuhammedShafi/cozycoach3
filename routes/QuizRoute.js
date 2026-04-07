import express from "express";
import QuizController from "../controllers/QuizController.js";
import deviceAuth from "../middleware/deviceAuth.js";

const router = express.Router();

router.get('/', deviceAuth, QuizController.getQuestion);
router.post('/answer', deviceAuth, QuizController.checkAnswer);

export default router;
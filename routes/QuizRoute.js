import express from "express";
import QuizController from "../controllers/QuizController.js";

const router = express.Router();

router.get('/', QuizController.getQuestion);
router.post('/answer', QuizController.checkAnswer);

export default router;
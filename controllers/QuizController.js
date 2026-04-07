import QuizService from "../services/QuizService.js";

class QuizController {
	static async getQuestion(req, res) {
		try{
			const { deviceid } = req.query;
			if (!deviceid) {
				return res.status(400).json({ error: "deviceid is required" });
			}
			const question = await QuizService.getQuestion(deviceid);
			if (!question) {
				return res.status(404).json({ error: "No quiz available or already taken today" });
			}
			res.json({ question });
		}
		catch(err){
			res.status(500).json({ error: err.message });
		}
	}
	static async checkAnswer(req, res) {
		try{
			const { deviceid,ans } = req.body;
			if (!deviceid || !ans) {
				return res.status(400).json({ error: "deviceid and ans are required" });
			}
			const result = await QuizService.checkAnswer(deviceid, ans);
			res.json(result);
		}
		catch(err){
			res.status(500).json({ error: err.message });
		}
	}
}

export default QuizController;
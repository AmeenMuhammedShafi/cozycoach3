import TrainService from "../services/TrainService.js";
import RewardService from "../services/RewardService.js";

class AdminController {

    static async updateDelay(req, res) {
        try {
            const { trainno, stoporder, delay } = req.body;
            if (!trainno || stoporder === undefined || delay === undefined) {
                return res.status(400).json({ error: "trainno, stoporder and delay are required" });
            }
            const result = await TrainService.updateDelay(trainno, stoporder, delay);
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async drawWinner(req, res) {
        try {
            const winner = await RewardService.drawWinner();
            if (!winner) {
                return res.status(404).json({ error: "No tickets found" });
            }
            res.json({ winner });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

}

export default AdminController;
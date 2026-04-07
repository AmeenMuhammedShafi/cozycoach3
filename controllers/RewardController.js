import RewardService from "../services/RewardService.js";
import UserService from "../services/UserService.js";

class RewardController {

    static async submitUpi(req, res) {
        try {
            const { deviceid, upiid } = req.body;
            if (!deviceid || !upiid) {
                return res.status(400).json({ error: "deviceid and upiid are required" });
            }
            const user = await UserService.findByDeviceId(deviceid);
            if (!user) return res.status(404).json({ error: "User not found" });
            const winner = await RewardService.submitUpi(user, upiid);
            res.json({ winner });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async getUserWin(req, res) {
        try {
            const { deviceid } = req.query;
            if (!deviceid) {
                return res.status(400).json({ error: "deviceid is required" });
            }
            const user = await UserService.findByDeviceId(deviceid);
            if (!user) return res.status(404).json({ error: "User not found" });
            const win = await RewardService.getUserWin(user);
            if (!win) {
                return res.status(404).json({ error: "No wins found" });
            }
            res.json({ win });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async convertXpToTicket(req, res) {
        try {
            const { deviceid } = req.body;
            if (!deviceid) {
                return res.status(400).json({ error: "deviceid is required" });
            }
            const user = await UserService.findByDeviceId(deviceid);
            if (!user) return res.status(404).json({ error: "User not found" });
            const ticket = await RewardService.convertXpToTicket(user);
            res.json({ ticket });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async getUserTickets(req, res) {
        try {
            const { deviceid } = req.query;
            if (!deviceid) {
                return res.status(400).json({ error: "deviceid is required" });
            }
            const user = await UserService.findByDeviceId(deviceid);
            if (!user) return res.status(404).json({ error: "User not found" });
            const tickets = await RewardService.getUserTickets(user);
            res.json({ tickets });
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

export default RewardController;
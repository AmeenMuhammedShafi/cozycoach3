import TrainService from "../services/TrainService.js";
import RewardService from "../services/RewardService.js";
import Trains from "../models/Trains.js";
import Stations from "../models/Stations.js";
import Quiz from "../models/Quiz.js";
import Delay from "../models/Delay.js";
import Users from "../models/Users.js";

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

    static async addStation(req, res) {
        try {
            const { name, code } = req.body;
            if (!name || !code) return res.status(400).json({ error: "Name and code required" });
            
            const station = await Stations.create({ name, code: code.toUpperCase() });
            res.json({ success: true, station });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async listStations(req, res) {
        try {
            const stations = await Stations.find();
            res.json(stations);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async addTrain(req, res) {
        try {
            const { name, number, status } = req.body;
            if (!name || !number) return res.status(400).json({ error: "Name and number required" });
            
            const train = await Trains.create({
                name,
                number,
                status: status || "scheduled",
                stops: [],
                currentstationid: null,
                nextstationid: null
            });
            res.json({ success: true, train });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async listTrains(req, res) {
        try {
            const trains = await Trains.find().populate('stops.station');
            res.json(trains);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async updateTrainStatus(req, res) {
        try {
            const { trainId, status } = req.body;
            if (!trainId || !status) return res.status(400).json({ error: "trainId and status required" });
            
            const train = await Trains.findByIdAndUpdate(trainId, { status }, { new: true });
            res.json({ success: true, train });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async addTrainStop(req, res) {
        try {
            const { trainId, stationId, order, arrival, departure } = req.body;
            if (!trainId || !stationId) return res.status(400).json({ error: "trainId and stationId required" });
            
            const train = await Trains.findById(trainId);
            train.stops.push({
                station: stationId,
                order: order || train.stops.length + 1,
                arrival: arrival || "00:00",
                departure: departure || "00:00"
            });
            await train.save();
            
            res.json({ success: true, train });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async addDelayManual(req, res) {
        try {
            const { trainId, stationId, minutes, reason } = req.body;
            if (!trainId || !minutes) return res.status(400).json({ error: "trainId and minutes required" });
            
            const delay = await Delay.create({
                train: trainId,
                station: stationId || null,
                delayminutes: minutes,
                reason: reason || "Not specified"
            });
            
            res.json({ success: true, delay });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async listDelays(req, res) {
        try {
            const delays = await Delay.find().populate('train station');
            res.json(delays);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async addQuiz(req, res) {
        try {
            const { question, opt1, opt2, opt3, answer } = req.body;
            if (!question || !opt1 || !opt2 || !opt3 || !answer) {
                return res.status(400).json({ error: "All fields required" });
            }
            
            const quiz = await Quiz.create({
                qn: question,
                opt1, opt2, opt3,
                ans: answer,
                usedcount: 0
            });
            
            res.json({ success: true, quiz });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async listQuiz(req, res) {
        try {
            const quizzes = await Quiz.find();
            res.json(quizzes);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async getStats(req, res) {
        try {
            const totalUsers = await Users.countDocuments();
            const totalTrains = await Trains.countDocuments();
            const totalStations = await Stations.countDocuments();
            const totalDelays = await Delay.countDocuments();
            
            res.json({
                totalUsers,
                totalTrains,
                totalStations,
                totalDelays
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

}

export default AdminController;
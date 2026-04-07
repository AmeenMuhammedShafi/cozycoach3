import CrowdService from "../services/CrowdService.js";
import Stations from "../models/Stations.js";
import UserInputs from "../models/UserInputs.js";
import moment from "moment-timezone";
import TrainService from "../services/TrainService.js";

class CrowdController{
	static async getCrowd(req,res){
		try{
			const {trainId} = req.query;
			if (!trainId ){
				return res.status(400).json({error:"TrainId is required"});
			}
			const crowd = await CrowdService.getCrowd(trainId);
			res.json(crowd);
		}
		catch(err){
			res.status(500).json({error:err.message});
		}
	}

	static async updateCrowd(req,res){
		try{
			const {trainId,stationId} = req.body;
			if (!trainId || !stationId){
				return res.status(400).json({error:"TrainId and stationId are required"});
			}
			const stn = await Stations.findById(stationId);
			if (!stn) {
				return res.status(404).json({ error: "Station not found" });
			}
			const train = await TrainService.findById(trainId);
			if (!train){
				return res.status(404).json({error:"Train not found"});
			}
			const stop = train.stops.find(s => s.station.toString() === stationId);
			if (!stop){
				return res.status(400).json({error:"Train does not stop at the given station"});
			}
			const currentorder = stop.order;
			const reports = await UserInputs.find({
                train: trainId,
                fromOrder: {$lte: currentorder},
				toOrder: {$gt: currentorder},
                date: moment().tz("Asia/Kolkata").format("YYYY-MM-DD"),
				active: true
            });
			const skeleton = stn.skeleton;
			const updatedCrowd = await CrowdService.updateCrowd(trainId, reports, skeleton);
			res.json({
				crowd:updatedCrowd.crowd
			});
		}
		catch(err){
			res.status(500).json({error:err.message});
		}
	}
}

export default CrowdController;
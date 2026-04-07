import TrainService from "../services/TrainService.js";

class TrainController{
	static async search(req,res){
		try{
			const {from,to} = req.query;
			if (!from || !to){
				return res.status(400).json({error:"From and to are required"});
			}
			const trains = await TrainService.searchByRoute(from,to);
			res.json(trains);
		}
		catch(err){
			res.status(500).json({error:err.message});
		}
	}

	static async getById(req,res){
		try{
			const {trainId} = req.params;
			if (!trainId){
				return res.status(400).json({error:"Train ID is required"});
			}
			const train = await TrainService.findById(trainId);
			if (!train){
				return res.status(404).json({error:"Train not found"});
			}
			res.json(train);
		}
		catch(err){
			res.status(500).json({error:err.message});
		}
	}

}

export default TrainController;
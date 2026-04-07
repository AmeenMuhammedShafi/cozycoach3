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


}

export default TrainController;
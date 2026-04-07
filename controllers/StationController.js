import StationService from "../services/StationsService.js";

class StationController{
	static async search(req,res){
		try{
			const {q} = req.query;
			if (!q){
				return res.json([]);
			}
			const stations = await StationService.search(q);
			res.json(stations);	
		}
		catch(err){
			res.status(500).json({error:err.message});
		}
	}
}

export default StationController;

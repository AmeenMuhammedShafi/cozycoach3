import ReportService from "../services/ReportService.js";

class ReportController{
	static async submitReport(req,res){
		try{
			const {deviceid,trainId,from,to,position} = req.body;	
			if (!deviceid || !trainId || !from || !to || !position){
				return res.status(400).json({error:"All fields are required"});
			}	
			const p = position.toLowerCase();
			if (!["f","m","r"].includes(p)){
				return res.status(400).json({error:"Invalid crowd position"});
			}
			const result = await ReportService.report(deviceid,trainId,from,to,p);
			res.json(result);
		}
		catch(err){
			res.status(500).json({error:err.message});
		}
	}

    static async getReportStatus(req, res) {
        try {
            const { deviceid, trainId } = req.query;
            if (!deviceid || !trainId) {
                return res.status(400).json({ error: "deviceid and trainId are required" });
            }
            const result = await ReportService.getReportStatus(deviceid, trainId);
            res.json(result);
        }
		catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

export default ReportController;
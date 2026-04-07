import ReportService from "../services/ReportService.js";

class ReportController{
	static async submitReport(req,res){
		console.log("📝 POST /api/report called");
		console.log(`   body:`, JSON.stringify(req.body));
		try{
			const {deviceid,trainId,from,to,position} = req.body;	
			console.log(`   parsed: deviceid=${deviceid}, trainId=${trainId}, from=${from}, to=${to}, pos=${position}`);
			if (!deviceid || !trainId || !from || !to || !position){
				console.log("   ❌ Missing required fields");
				return res.status(400).json({error:"All fields are required"});
			}	
			const p = position.toLowerCase();
			if (!["f","m","r"].includes(p)){
				console.log(`   ❌ Invalid position: ${p}`);
				return res.status(400).json({error:"Invalid crowd position"});
			}
			console.log("   ✅ Validation passed, calling ReportService...");
			const result = await ReportService.report(deviceid,trainId,from,to,p);
			console.log(`   ✅ Report successful: ${JSON.stringify(result)}`);
			res.json(result);
		}
		catch(err){
			console.error("❌ Report error:", err.message, err.stack);
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
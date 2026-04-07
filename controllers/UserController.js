import UserService from "../services/UserService.js";

class UserController {
	static async initUser(req,res){
		try{
			const {deviceid,ref} = req.body;
			if (!deviceid){
				return res.status(400).json({error:"Device ID is required"});
			}
			await UserService.initUser(deviceid,ref);
			const user = await UserService.findByDeviceId(deviceid);
			res.json({
				xp: user.xp,
				streak: user.streak,
				quizno: user.quizno,
				referralcode: user.referralcode
			});
		}
		catch(err){
			res.status(500).json({error:err.message});
		}
	}
}

export default UserController;
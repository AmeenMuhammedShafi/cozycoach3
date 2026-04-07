import Users from "../models/Users.js";
import Winners from "../models/Winners.js";

function generateReferralCode(){
	return Math.random().toString(36).substring(2,8).toUpperCase();
}

class UserService {

	static async findByDeviceId(deviceid){
		return Users.findOne({ deviceid });
	}

	static async initUser(deviceid, ref){

		let user = await Users.findOne({ deviceid });
		if(user){
			return user;
		}

		let saved = false;

		while(!saved){
			try{

				const referralcode = generateReferralCode();

				user = new Users({
					deviceid,
					referralcode
				});

				if(ref){
					const referrer = await Users.findOne({ referralcode: ref });

					if(referrer){
						user.referredby = referrer._id;

						referrer.xp += 30;
						user.xp += 10;

						await referrer.save();

						const winner = await Winners.findOne({ user: referrer._id, status: "locked" });
						if(winner){
							winner.referralcount += 1;
							if(winner.referralcount >= 5){
								winner.status = "unlocked";
							}
							await winner.save();
						}
					}
				}

				await user.save();
				saved = true;

			}catch(err){

				if(err.code !== 11000){
					throw err;
				}
			}
		}

		return user;
	}

	static async addXp(user, amount){
		await Users.findByIdAndUpdate(
			user._id,
			{ $inc: { xp: amount } }
		);
	}

	static async subtractXp(user, amount){
		await Users.findByIdAndUpdate(
			user._id,
			{ $inc: { xp: -amount } }
		);
	}

	static async updateStreak(user, newStreak){
		await Users.findByIdAndUpdate(
			user._id,
			{
				$set: {
					streak: newStreak,
					lastactive: new Date()
				}
			}
		);
	}

	static async incrementQuizNo(user){
		await Users.findByIdAndUpdate(
			user._id,
			{ $inc: { quizno: 1 } }
		);
	}
}

export default UserService;
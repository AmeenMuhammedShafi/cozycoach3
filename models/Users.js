import mongoose from "mongoose";

const usersschema = new mongoose.Schema({
	name: {
		type: String
	},
	deviceid: {
		type: String,
		required: true,
		unique: true
	},
	phone: {
		type: String
	},

	xp: {
		type: Number,
		default: 0
	},

	streak: {
		type: Number,
		default: 0
	},

	lastactive: {
		type: Date,
		default: null
	},

	lastreportedat: {
		type: Date,
		default: null
	},

	quizno: {
		type: Number,
		default: 1
	},

	lastquiztakenat:{
		type:Date,
		default:null
	},

	referralcode: {
		type: String,
		unique: true,
		sparse: true
	},

	referredby: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Users",
		default: null
	},

	referralprocessed: {
		type: Boolean,
		default: false
	},

	rewardstatus: {
		type: String,
		enum: ['none', 'locked', 'unlocked', 'claimed'],
		default: 'none'
	},

	createdAt:{
		type:Date,
		default:Date.now
	}

});

usersschema.index({ lastactive: 1 });

export default mongoose.model("Users", usersschema);

import mongoose from "mongoose";

const crowdstatusschema = new mongoose.Schema({
    train: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trains',
        required: true
    },
    date: {
        type: String,
        required: true
    },
    crowd: {
        f: { type: Number, default: 0.33 },
        m: { type: Number, default: 0.34 },
        r: { type: Number, default: 0.33 } 
    }
}, {
    timestamps: true
});

crowdstatusschema.index({ train: 1, date: 1 }, { unique: true });
crowdstatusschema.index({ train: 1});

export default mongoose.model("CrowdStatus", crowdstatusschema);
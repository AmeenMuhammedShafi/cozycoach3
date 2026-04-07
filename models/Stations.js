import mongoose from "mongoose";

const stationsschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    skeleton: {
        f: { type: Number, default: 0.33 },
        m: { type: Number, default: 0.34 },
        r: { type: Number, default: 0.33 }
    }
});

export default mongoose.model("Stations", stationsschema);
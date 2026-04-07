import mongoose from "mongoose";

const trainschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    number: {
        type: Number,
        required: true,
        unique: true
    },
    stops: [{
        station: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Stations'
        },
        order: { type: Number },
        arrival: { type: String },
        departure: { type: String }
    }],
    status: {
        type: String,
        enum: ['scheduled', 'at_station', 'enroute', 'completed'],
        default: 'scheduled'
    },
    currentstationid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stations',
        default: null
    },
    nextstationid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stations',
        default: null
    },
    lastprocessedstation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stations',
        default: null
    }
});

trainschema.index({ status: 1 });
trainschema.index({ "stops.station": 1 });

export default mongoose.model("Trains", trainschema);
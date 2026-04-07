import mongoose from "mongoose";

const userinputschema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    train: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trains",
        required: true
    },

    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stations",
        required: true
    },

    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stations",
        required: true
    },

    fromOrder: {
        type: Number,
        required: true
    },

    toOrder: {
        type: Number,
        required: true
    },

    date: {
        type: String,
        required: true
    },

    active: {
        type: Boolean,
        default: true
    },

    crowd: {
        f: { type: Number, required: true },
        m: { type: Number, required: true },
        r: { type: Number, required: true }
    }

});

userinputschema.index({ train: 1, date: 1 });

userinputschema.index(
    { user: 1, train: 1, date: 1 },
    { unique: true }
);

userinputschema.index({ train: 1, date: 1, active: 1 });

export default mongoose.model("UserInputs", userinputschema);

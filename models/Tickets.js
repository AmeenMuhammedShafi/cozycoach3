import mongoose from "mongoose";

const ticketschema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    purchasedate: {
        type: Date,
        default: Date.now
    },
    cost:{
        type: Number,
        required: true,
        default: 50
    }
});

ticketschema.index({ user: 1 });

export default mongoose.model("Tickets", ticketschema);
import mongoose from "mongoose";

const winnerschema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['locked', 'unlocked', 'claimed'],
        default: 'locked'
    },
    referralcount: {
        type: Number,
        default: 0    
    },
    upiid: {
        type: String  
    },
    drawdate: {
        type: Date,
        default: Date.now
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tickets'
    }
});

winnerschema.index({ user: 1 });
winnerschema.index({ drawdate: 1 });

export default mongoose.model("Winners", winnerschema);
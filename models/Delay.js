import mongoose from "mongoose";

const delaySchema = new mongoose.Schema({

   train: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trains",
      required: true
   },

   station: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stations",
      required: true
   },

   delay: {
      type: Number,
      default: 0
   },

   updatedAt: {
      type: Date,
      default: Date.now
   }

});

delaySchema.index({ train: 1, station: 1 }, { unique: true });
delaySchema.index({ train: 1 });

export default mongoose.model("Delay", delaySchema);

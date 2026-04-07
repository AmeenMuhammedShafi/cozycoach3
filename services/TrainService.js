import Trains from "../models/Trains.js";
import Stations from "../models/Stations.js";
import DelayService from "./DelayService.js";

class TrainService {

   static async findById(id){
      return Trains.findById(id);
   }

   static async searchByRoute(from,to){
      const fromstn = await Stations.findOne({
         $or:[
            {code:from.toUpperCase()},
            {name:new RegExp(`^${from}$`,'i')}
         ]
      });
      const tostn = await Stations.findOne({
         $or:[
            {code:to.toUpperCase()},
            {name:new RegExp(`^${to}$`,'i')}
         ]
      });
      if(!fromstn || !tostn){
         throw new Error("Stations not found");
      }
      const trains = await Trains.find({
         "stops.station":{
            $all:[fromstn._id,tostn._id]
         }
      }).populate('stops.station','name code');
      return trains.filter(train => {
         const fromindex =
            train.stops.findIndex(
               s => s.station._id.equals(fromstn._id)
            );
         const toindex =
            train.stops.findIndex(
               s => s.station._id.equals(tostn._id)
            );
         return fromindex !== -1 &&
                toindex !== -1 &&
                fromindex < toindex;
      });
   }

   static async updateDelay(trainno,stoporder,delay){
      const train = await Trains.findOne({number:trainno});
      if(!train){
         throw new Error("Train not found");
      }
      await DelayService.updateDelay(
         train._id,
         stoporder,
         delay
      );
      return {success:true};
   }

   static async getStatus(trainno) {
    const train = await Trains
        .findOne({ number: trainno })
        .populate("currentstationid", "name code")
        .populate("lastprocessedstation", "name code")
        .populate("stops.station", "name code");

    if (!train) {
        throw new Error("Train not found");
    }

    const updatedStops = [];

    for (const stop of train.stops) {
        const effectiveArrival =
            await DelayService.getEffectiveArrival(
                train._id,
                stop
            );

        updatedStops.push({
            ...stop.toObject(),
            effectiveArrival:
                effectiveArrival.format("HH:mm")
        });
    }

    return {
        ...train.toObject(),
        stops: updatedStops
    };
   }

}

export default TrainService;

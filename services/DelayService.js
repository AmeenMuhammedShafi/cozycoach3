import Delay from "../models/Delay.js";
import Trains from "../models/Trains.js";
import moment from "moment-timezone";

class DelayService {

    static async updateDelay(trainId, stationOrder, delay) {
        const train = await Trains.findById(trainId);

        if (!train) {
            throw new Error("Train not found");
        }

        await Delay.deleteMany({ train: trainId });

        const delays = train.stops
            .filter(s => s.order >= stationOrder)
            .map(s => ({
                train: trainId,
                station: s.station,
                delay
            }));

        if (delays.length > 0) {
            await Delay.insertMany(delays);
        }

        return true;
    }

    static async getDelayForStation(trainId, stationId) {
        const delayDoc = await Delay.findOne({
            train: trainId,
            station: stationId
        });

        return delayDoc ? delayDoc.delay : 0;
    }

    static async getEffectiveArrival(trainId, stop) {
        const stationId = stop.station._id
            ? stop.station._id
            : stop.station;

        const delay = await this.getDelayForStation(
            trainId,
            stationId
        );

        return moment(stop.arrival, "HH:mm")
            .add(delay, "minutes");
    }
}

export default DelayService;
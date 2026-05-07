import moment from "moment-timezone";
import Trains from "../models/Trains.js";
import CrowdService from "./CrowdService.js";
import UserInputs from "../models/UserInputs.js";
import DelayService from "./DelayService.js";

class AutoUpdateService {

	static async runCronUpdate() {
		const now = moment();
		const today = now.format("YYYY-MM-DD");

		const trains = await Trains.find().populate("stops.station");

		for (const train of trains) {
			const stops = [...train.stops].sort((a, b) => a.order - b.order);
			let updated = false;
			const firstStop = stops[0];
            const firstArrival = await DelayService.getEffectiveArrival(train._id, firstStop);
            if (now.isBefore(firstArrival)) {
	            train.status = 'scheduled';
	            train.currentstationid = null;
	            train.nextstationid = firstStop.station._id;
	            await train.save();
	            continue;
            }
			for (let i = 0; i < stops.length; i++) {
				const stop = stops[i];			const nextStop = stops[i + 1];				const arrivalTime = await DelayService.getEffectiveArrival(train._id, stop);
				const departureTime = stop.departure
				? await DelayService.getEffectiveArrival(train._id, stop)
				: arrivalTime.clone().add(2, 'minutes');
				const nextArrival = nextStop
					? await DelayService.getEffectiveArrival(train._id, nextStop)
					: null;

				if (now.isBetween(arrivalTime, departureTime, null, '[)')) {
					train.status = 'at_station';
					train.currentstationid = stop.station._id;
					train.nextstationid = nextStop ? nextStop.station._id : null;
					train.lastprocessedstation = stop.station._id;

					await UserInputs.updateMany(
						{ train: train._id, date: today, active: true, toOrder: { $lte: stop.order } },
						{ $set: { active: false } }
					);

					const reports = await UserInputs.find({
						train: train._id,
						fromOrder: { $lte: stop.order },
						toOrder: { $gt: stop.order },
						date: today,
						active: true
					});

					await CrowdService.updateCrowd(train._id, reports, stop.station.skeleton);

					updated = true;
					break;
				}

				if (nextArrival && now.isBetween(departureTime, nextArrival, null, '[)')) {
					train.status = 'enroute';
					train.currentstationid = null;
					train.nextstationid = nextStop.station._id;
					train.lastprocessedstation = stop.station._id;
					updated = true;
					break;
				}
			}

			if (!updated) {
				const lastStop = stops[stops.length - 1];
				const lastArrival = await DelayService.getEffectiveArrival(train._id, lastStop);

				if (now.isAfter(lastArrival)) {
					train.status = 'completed';
					train.currentstationid = lastStop.station._id;
					train.nextstationid = null;
					train.lastprocessedstation = lastStop.station._id;
					await UserInputs.updateMany(
						{ train: train._id, date: today, active: true },
						{ $set: { active: false } }
					);
				}
			}

			await train.save();
		}
	}
}

export default AutoUpdateService;
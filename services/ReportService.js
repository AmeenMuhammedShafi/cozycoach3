// services/ReportService.js
import moment from "moment-timezone";
import UserInputs from "../models/UserInputs.js";
import CrowdService from "./CrowdService.js";
import UserService from "./UserService.js";
import Trains from "../models/Trains.js";

const ZONES = ["f", "m", "r"];

const adjacent = {
    f: ["m"],
    m: ["f", "r"],
    r: ["m"]
};

class ReportService {

    static async report(deviceid, trainId, from, to, position) {
        const user = await UserService.findByDeviceId(deviceid);
        if (!user) throw new Error("User not found");

        const today = moment()
            .tz("Asia/Kolkata")
            .format("YYYY-MM-DD");

        const alreadyReported = await UserInputs.findOne({
            user: user._id,
            train: trainId,
            date: today
        });
        if (alreadyReported) {
            return { alreadyReported: true };
        }

        const train = await Trains
            .findById(trainId)
            .populate("stops.station");
        if (!train) throw new Error("Train not found");

        const fromStop = train.stops.find(
            s => s.station._id.toString() === from
        );
        const toStop = train.stops.find(
            s => s.station._id.toString() === to
        );
        if (!fromStop || !toStop) {
            throw new Error("Invalid stations");
        }
        if (fromStop.order >= toStop.order) {
            throw new Error("Invalid route");
        }

        const currentCrowd = await CrowdService.getCrowd(trainId);
        const crowd = currentCrowd.crowd;
        const leastCrowded = ZONES.reduce((a, b) =>
            crowd[a] < crowd[b] ? a : b
        );
        const isAdjacent = adjacent[position].includes(leastCrowded);
        let crowdVector = { f: 0, m: 0, r: 0 };

        if (position === leastCrowded) {
            crowdVector[position] = 0.8;
            ZONES.filter(z => z !== position).forEach(z => {
                crowdVector[z] = adjacent[position].includes(z) ? 0.15 : 0.05;
            });
        } else if (isAdjacent) {
            crowdVector[leastCrowded] = 0.5;
            crowdVector[position] = 0.4;
            const far = ZONES.find(z => z !== position && z !== leastCrowded);
            crowdVector[far] = 0.1;
        } else {
            crowdVector[position] = 0.6;
            const adjacentZones = adjacent[position];
            const adjacentShare = 0.4 / adjacentZones.length;
            const farZone = ZONES.find(z => z !== position && !adjacentZones.includes(z));
            if (farZone) {
                adjacentZones.forEach(z => { crowdVector[z] = 0.3; });
                crowdVector[farZone] = 0.1;
            } else {
                adjacentZones.forEach(z => { crowdVector[z] = adjacentShare; });
            }
        }

        await UserInputs.create({
            user: user._id,
            train: trainId,
            from: fromStop.station._id,
            to: toStop.station._id,
            fromOrder: fromStop.order,
            toOrder: toStop.order,
            date: today,
            crowd: crowdVector,
            active: true
        });

        await UserService.addXp(user, 10);

        const yesterday = moment()
            .tz("Asia/Kolkata")
            .subtract(1, "day")
            .format("YYYY-MM-DD");
        const lastActiveStr = user.lastactive
            ? moment(user.lastactive).tz("Asia/Kolkata").format("YYYY-MM-DD")
            : null;
        const newStreak = lastActiveStr === yesterday ? user.streak + 1 : 1;
        await UserService.updateStreak(user, newStreak);

        user.lastreportedat = new Date();
        await user.save();

        const freshUser = await UserService.findByDeviceId(deviceid);

        return {
            success: true,
            xp: freshUser.xp,
            streak: newStreak,
            crowdVector
        };
    }

	static async getReportStatus(deviceid, trainId) {
        const user = await UserService.findByDeviceId(deviceid);
        if (!user) throw new Error("User not found");
        const today = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");
        const report = await UserInputs.findOne({
            user: user._id,
            train: trainId,
            date: today
        });
        return { alreadyReported: !!report };
    }
}

export default ReportService;
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
        console.log(`📝 Report: device=${deviceid}, train=${trainId}, from=${from}, to=${to}, pos=${position}`);
        
        const user = await UserService.findByDeviceId(deviceid);
        if (!user) throw new Error("User not found");

        // Validate station IDs
        if (!from || !to) {
            throw new Error("Invalid stations: from and to are required");
        }

        const today = moment()
            .tz("Asia/Kolkata")
            .format("YYYY-MM-DD");

        const alreadyReported = await UserInputs.findOne({
            user: user._id,
            train: trainId,
            date: today
        });
        if (alreadyReported) {
            console.log(`ℹ️ Already reported today`);
            return { alreadyReported: true };
        }

        const train = await Trains
            .findById(trainId)
            .populate("stops.station");
        if (!train) throw new Error("Train not found");
        if (!train.stops || train.stops.length === 0) {
            throw new Error("Train has no stops");
        }

        console.log(`🚂 Train: ${train.name}, stops: ${train.stops.length}`);

        // Convert from/to to strings for comparison
        const fromStr = from.toString();
        const toStr = to.toString();

        // More robust stop finding
        const fromStop = train.stops.find(s => {
            if (!s.station) return false;
            const stationId = s.station._id ? s.station._id.toString() : s.station.toString();
            return stationId === fromStr;
        });
        
        const toStop = train.stops.find(s => {
            if (!s.station) return false;
            const stationId = s.station._id ? s.station._id.toString() : s.station.toString();
            return stationId === toStr;
        });

        console.log(`🔍 From stop: ${!!fromStop}, To stop: ${!!toStop}`);
        if (!fromStop || !toStop) {
            console.log(`❌ Stop search failed. Train has ${train.stops.length} stops:`);
            train.stops.forEach((s, i) => {
                const stnId = s.station?._id?.toString() || s.station?.toString() || 'null';
                console.log(`   [${i}] Stop order=${s.order}, station=${stnId}, name=${s.station?.name}`);
            });
            throw new Error(`Invalid stations: fromStop=${!!fromStop}, toStop=${!!toStop}`);
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

        console.log(`💾 Creating UserInput: user=${user._id}, crowd=${JSON.stringify(crowdVector)}`);
        console.log(`   from station: ${fromStop.station?._id}, to station: ${toStop.station?._id}`);
        
        if (!fromStop.station || !toStop.station) {
            console.log("   ❌ Station objects are null!");
            console.log(`      fromStop.station: ${fromStop.station}`);
            console.log(`      toStop.station: ${toStop.station}`);
            throw new Error(`Station data missing: from=${!!fromStop.station}, to=${!!toStop.station}`);
        }

        if (!fromStop.station._id || !toStop.station._id) {
            console.log("   ❌ Station IDs are null!");
            throw new Error(`Station IDs missing`);
        }
        
        const userInput = await UserInputs.create({
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
        
        console.log(`✅ UserInput created: ${userInput._id}`);

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
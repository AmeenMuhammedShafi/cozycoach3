import CrowdStatus from "../models/CrowdStatus.js";
import Stations from "../models/Stations.js";
import Trains from "../models/Trains.js";
import moment from "moment-timezone";

class CrowdService {

    static async getCrowd(train) {
        const today = moment()
            .tz("Asia/Kolkata")
            .format("YYYY-MM-DD");
        let crowd = await CrowdStatus.findOne({
            train,
            date: today
        });
        
        // If no crowd data exists, create default
        if (!crowd) {
            crowd = new CrowdStatus({
                train,
                date: today,
                crowd: { f: 0.33, m: 0.34, r: 0.33 }
            });
            await crowd.save();
        }
        
        return {
            crowd: crowd.crowd
        };
    }

    static async updateCrowd(train, reports, skeleton) {
        const today = moment()
            .tz("Asia/Kolkata")
            .format("YYYY-MM-DD");
        let consensus = { f: 0, m: 0, r: 0 };
        if (reports.length > 0) {
            let sumF = 0;
            let sumM = 0;
            let sumR = 0;
            reports.forEach(r => {
                sumF += r.crowd.f;
                sumM += r.crowd.m;
                sumR += r.crowd.r;
            });
            consensus = {
                f: sumF / reports.length,
                m: sumM / reports.length,
                r: sumR / reports.length
            };
        }
        const n = reports.length;
        const k = 0;
        let finalCrowd;
        if (n === 0) {
            finalCrowd = skeleton;
        } else {
            finalCrowd = {
                f: (k * skeleton.f + n * consensus.f) / (k + n),
                m: (k * skeleton.m + n * consensus.m) / (k + n),
                r: (k * skeleton.r + n * consensus.r) / (k + n)
            };
        }
        return CrowdStatus.findOneAndUpdate(
            { train, date: today },
            { crowd: finalCrowd },
            { upsert: true, new: true }
        );
    }

}

export default CrowdService;
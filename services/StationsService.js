// services/StationsService.js
import Stations from "../models/Stations.js";

class StationService {

    static async search(query) {
        if (query.length < 2) {
            return [];
        }
        const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        const stations = await Stations.find({
            $or: [
                { name: { $regex: escaped, $options: "i" } },
                { code: { $regex: escaped, $options: "i" } }
            ]
        })
        .sort({ name: 1 })
        .limit(8)
        .select("name code")
        .lean();

        return stations;
    }
}

export default StationService;
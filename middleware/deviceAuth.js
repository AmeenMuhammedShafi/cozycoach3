import Users from "../models/Users.js";

export default async function deviceAuth(req, res, next) {
    try {
        const deviceid = req.body?.deviceid || req.query.deviceid;

        if (!deviceid) {
            return res.status(400).json({ error: "Device ID is required" });
        }

        if (typeof deviceid !== "string" || deviceid.trim().length === 0) {
            return res.status(400).json({ error: "Invalid Device ID format" });
        }

        const user = await Users.findOne({ deviceid });

        if (!user) {
            const allUsers = await Users.countDocuments();
            return res.status(401).json({ error: "User not found. Please initialize first." });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

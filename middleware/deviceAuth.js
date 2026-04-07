import Users from "../models/Users.js";

export default async function deviceAuth(req, res, next) {
    try {
        console.log("🔐 deviceAuth: checking device ID");
        const deviceid = req.body?.deviceid || req.query.deviceid;
        console.log(`   deviceid = ${deviceid}`);

        if (!deviceid) {
            console.log("   ❌ No device ID provided");
            return res.status(400).json({ error: "Device ID is required" });
        }

        if (typeof deviceid !== "string" || deviceid.trim().length === 0) {
            console.log("   ❌ Invalid device ID format");
            return res.status(400).json({ error: "Invalid Device ID format" });
        }

        const user = await Users.findOne({ deviceid });

        if (!user) {
            console.log("   ❌ User not found");
            return res.status(401).json({ error: "User not found. Please initialize first." });
        }

        console.log(`   ✅ User authenticated: ${user._id}`);
        req.user = user;
        next();
    } catch (err) {
        console.error("   💥 deviceAuth error:", err.message);
        res.status(500).json({ error: err.message });
    }
}

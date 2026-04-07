import mongoose from "mongoose";
import dotenv from "dotenv";
import Stations from "./models/Stations.js";
import Trains from "./models/Trains.js";

dotenv.config();

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Stations.deleteMany({});
    await Trains.deleteMany({});
    console.log("🧹 Cleared existing data");

    // 1️⃣ CREATE STATIONS
    const stations = await Stations.create([
      { name: "Kozhikode", code: "CLT".toUpperCase() },
      { name: "Kannur", code: "CAN".toUpperCase() },
      { name: "Thalassery", code: "TLY".toUpperCase() },
      { name: "Mumbai", code: "MMCT".toUpperCase() },
      { name: "Delhi", code: "NDLS".toUpperCase() }
    ]);
    console.log("✅ Created " + stations.length + " stations");
    stations.forEach((s, i) => console.log(`  ${i+1}. ${s.name} (${s.code}) - ID: ${s._id}`));

    // 2️⃣ CREATE TRAINS with real station IDs
    const trains = await Trains.create([
      {
        name: "Kerala Express",
        number: 2671,
        status: "scheduled",
        stops: [
          { station: stations[0]._id, order: 1, arrival: "16:05", departure: "16:15" },
          { station: stations[1]._id, order: 2, arrival: "17:45", departure: "17:55" },
          { station: stations[2]._id, order: 3, arrival: "19:30", departure: "19:40" }
        ],
        currentstationid: null,
        nextstationid: stations[0]._id,
        lastprocessedstation: null
      },
      {
        name: "Rajdhani Express",
        number: 2951,
        status: "enroute",
        stops: [
          { station: stations[3]._id, order: 1, arrival: "16:05", departure: "16:15" },
          { station: stations[4]._id, order: 2, arrival: "00:30", departure: "00:45" }
        ],
        currentstationid: stations[3]._id,
        nextstationid: stations[4]._id,
        lastprocessedstation: null
      }
    ]);
    console.log("\n✅ Created " + trains.length + " trains");
    trains.forEach((t, i) => console.log(`  ${i+1}. ${t.name} (#${t.number}) - ID: ${t._id}`));

    console.log("\n🎯 TEST DATA READY!");
    console.log("\nTo test from the frontend:");
    console.log("  From station: Kozhikode (CLT)");
    console.log("  To station: Thalassery (TLY)");
    console.log("\nOr:");
    console.log("  From station: Mumbai (MMCT)");
    console.log("  To station: Delhi (NDLS)");

    await mongoose.connection.close();
    console.log("\n✅ Done!");

  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

seedData();

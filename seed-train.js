import mongoose from "mongoose";
import dotenv from "dotenv";
import Trains from "./models/Trains.js";

dotenv.config();

async function seedTrain() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Create a train passing through CLT -> CAN -> TLY (starting 00:15)
    const train = {
      name: "Kerala Express",
      number: 2671,
      status: "scheduled",
      stops: [
        {
          station: "69c7a9f1128e2106f41dea72", // Kozhikode (CLT)
          order: 1,
          arrival: "00:15",
          departure: "00:25"
        },
        {
          station: "69c7a9f1128e2106f41dea73", // Kannur (CAN)
          order: 2,
          arrival: "01:45",
          departure: "01:55"
        },
        {
          station: "69c7a9f1128e2106f41dea74", // Thalassery (TLY)
          order: 3,
          arrival: "03:30",
          departure: "03:40"
        }
      ],
      currentstationid: null,
      nextstationid: "69c7a9f1128e2106f41dea72",
      lastprocessedstation: null
    };

    const result = await Trains.create(train);
    console.log("✅ Train created successfully!");
    console.log("Train ID:", result._id);
    console.log("Name:", result.name);
    console.log("Number:", result.number);
    console.log("Stops:", result.stops.length);

    await mongoose.connection.close();
    console.log("✅ Done!");

  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

seedTrain();

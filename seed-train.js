import mongoose from "mongoose";
import dotenv from "dotenv";
import Stations from "./models/Stations.js";
import Trains from "./models/Trains.js";
import Users from "./models/Users.js";
import UserInputs from "./models/UserInputs.js";
import CrowdStatus from "./models/CrowdStatus.js";
import Quiz from "./models/Quiz.js";
import moment from "moment-timezone";

dotenv.config();

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Stations.deleteMany({});
    await Trains.deleteMany({});
    await Users.deleteMany({});
    await UserInputs.deleteMany({});
    await CrowdStatus.deleteMany({});
    await Quiz.deleteMany({});
    console.log("🧹 Cleared existing data");

    const stations = await Stations.create([
      { name: "Kozhikode", code: "CLT", skeleton: { f: 0.35, m: 0.35, r: 0.30 } },
      { name: "Kannur", code: "CAN", skeleton: { f: 0.33, m: 0.34, r: 0.33 } },
      { name: "Thalassery", code: "TLY", skeleton: { f: 0.32, m: 0.36, r: 0.32 } },
      { name: "Bangalore", code: "SBC", skeleton: { f: 0.30, m: 0.40, r: 0.30 } },
      { name: "Mumbai", code: "MMCT", skeleton: { f: 0.33, m: 0.34, r: 0.33 } },
      { name: "Delhi", code: "NDLS", skeleton: { f: 0.30, m: 0.35, r: 0.35 } }
    ]);
    console.log("\n✅ Created " + stations.length + " stations");
    stations.forEach((s, i) => console.log(`  ${i+1}. ${s.name} (${s.code})`));

    const now = moment();
    const today = now.format("YYYY-MM-DD");
    
    const t1_arr = now.clone().subtract(30, 'minutes').format("HH:mm");
    const t1_dep = now.clone().subtract(25, 'minutes').format("HH:mm");
    const t1_arr2 = now.clone().add(20, 'minutes').format("HH:mm");
    const t1_dep2 = now.clone().add(25, 'minutes').format("HH:mm");
    const t1_arr3 = now.clone().add(50, 'minutes').format("HH:mm");
    const t1_dep3 = now.clone().add(55, 'minutes').format("HH:mm");
    const t1_arr4 = now.clone().add(100, 'minutes').format("HH:mm");

    const t2_arr = now.clone().subtract(40, 'minutes').format("HH:mm");
    const t2_dep = now.clone().subtract(35, 'minutes').format("HH:mm");
    const t2_arr2 = now.clone().add(30, 'minutes').format("HH:mm");
    const t2_dep2 = now.clone().add(35, 'minutes').format("HH:mm");
    const t2_arr3 = now.clone().add(150, 'minutes').format("HH:mm");

    const trains = await Trains.create([
      {
        name: "Kerala Express",
        number: 2671,
        status: "enroute",
        stops: [
          { station: stations[0]._id, order: 1, arrival: t1_arr, departure: t1_dep },
          { station: stations[1]._id, order: 2, arrival: t1_arr2, departure: t1_dep2 },
          { station: stations[2]._id, order: 3, arrival: t1_arr3, departure: t1_dep3 },
          { station: stations[3]._id, order: 4, arrival: t1_arr4, departure: t1_arr4 }
        ],
        currentstationid: null,
        nextstationid: stations[1]._id,
        lastprocessedstation: stations[0]._id
      },
      {
        name: "Rajdhani Express",
        number: 2951,
        status: "enroute",
        stops: [
          { station: stations[4]._id, order: 1, arrival: t2_arr, departure: t2_dep },
          { station: stations[3]._id, order: 2, arrival: t2_arr2, departure: t2_dep2 },
          { station: stations[5]._id, order: 3, arrival: t2_arr3, departure: t2_arr3 }
        ],
        currentstationid: null,
        nextstationid: stations[3]._id,
        lastprocessedstation: stations[4]._id
      }
    ]);
    console.log("\n✅ Created " + trains.length + " trains");
    trains.forEach((t, i) => console.log(`  ${i+1}. ${t.name} (#${t.number})`));

    const users = await Users.create([
      { deviceid: "device_001", xp: 150, streak: 5, quizno: 3, referralcode: "REF001" },
      { deviceid: "device_002", xp: 200, streak: 8, quizno: 4, referralcode: "REF002" },
      { deviceid: "device_003", xp: 75, streak: 2, quizno: 2, referralcode: "REF003" },
      { deviceid: "device_004", xp: 180, streak: 6, quizno: 3, referralcode: "REF004" },
      { deviceid: "device_005", xp: 120, streak: 3, quizno: 2, referralcode: "REF005" }
    ]);
    console.log("\n✅ Created " + users.length + " users");

    const userInputs = await UserInputs.create([
      {
        user: users[0]._id,
        train: trains[0]._id,
        from: stations[0]._id,
        to: stations[2]._id,
        fromOrder: 1,
        toOrder: 3,
        date: today,
        crowd: { f: 0.70, m: 0.20, r: 0.10 },
        active: true
      },
      {
        user: users[1]._id,
        train: trains[0]._id,
        from: stations[0]._id,
        to: stations[3]._id,
        fromOrder: 1,
        toOrder: 4,
        date: today,
        crowd: { f: 0.15, m: 0.70, r: 0.15 },
        active: true
      },
      {
        user: users[2]._id,
        train: trains[0]._id,
        from: stations[1]._id,
        to: stations[3]._id,
        fromOrder: 2,
        toOrder: 4,
        date: today,
        crowd: { f: 0.20, m: 0.60, r: 0.20 },
        active: true
      },
      {
        user: users[3]._id,
        train: trains[1]._id,
        from: stations[4]._id,
        to: stations[5]._id,
        fromOrder: 1,
        toOrder: 3,
        date: today,
        crowd: { f: 0.30, m: 0.40, r: 0.30 },
        active: true
      },
      {
        user: users[4]._id,
        train: trains[1]._id,
        from: stations[4]._id,
        to: stations[3]._id,
        fromOrder: 1,
        toOrder: 2,
        date: today,
        crowd: { f: 0.25, m: 0.50, r: 0.25 },
        active: true
      }
    ]);
    console.log("\n✅ Created " + userInputs.length + " user inputs with crowd data");

    const crowdStatuses = await CrowdStatus.create([
      {
        train: trains[0]._id,
        date: today,
        crowd: { f: 0.43, m: 0.38, r: 0.19 }
      },
      {
        train: trains[1]._id,
        date: today,
        crowd: { f: 0.30, m: 0.42, r: 0.28 }
      }
    ]);
    console.log("✅ Created " + crowdStatuses.length + " aggregated crowd statuses");

    const quizzes = await Quiz.create([
      {
        quizno: 1,
        question: "Which Indian city has the most railway stations?",
        option1: "Mumbai",
        option2: "Delhi",
        option3: "Kolkata",
        answer: 1,
        subject: "Railways"
      },
      {
        quizno: 2,
        question: "What is the safest zone in a crowded train?",
        option1: "Near the door",
        option2: "Middle section",
        option3: "Window side",
        answer: 2,
        subject: "Safety"
      },
      {
        quizno: 3,
        question: "How many XP equals 1 lottery ticket?",
        option1: "25 XP",
        option2: "50 XP",
        option3: "75 XP",
        answer: 2,
        subject: "CozyCoach"
      }
    ]);
    console.log("✅ Created " + quizzes.length + " quiz questions");

    console.log("\n✅ Seed Complete!");
    console.log("\n📊 Data Created:");
    console.log("  🚂 2 Trains - BOTH ENROUTE (ready to report on)");
    console.log("  🏙️ 6 Stations");
    console.log("  👥 5 Users (all initialized)");
    console.log("  📊 5 User Reports (with aggregated crowd data)");
    console.log("  ❓ 3 Quiz Questions");
    console.log("\n✨ TRAINS ARE LIVE - You can now search, report, and view crowd data!");

    await mongoose.connection.close();
    console.log("\n✅ Seed completed successfully!");

  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

seedData();

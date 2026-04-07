import Users from "../models/Users.js";
import Tickets from "../models/Tickets.js";
import Winners from "../models/Winners.js";

class RewardService {

    static async convertXpToTicket(user) {
        const cost = 50;
        if (user.xp < cost) {
            throw new Error("Not enough XP");
        }
        await Users.findByIdAndUpdate(user._id, { $inc: { xp: -cost } });
        user.xp -= cost;
        const ticket = await Tickets.create({
            user: user._id
        });
        return ticket;
    }

    static async getUserTickets(user) {
        return Tickets.find({ user: user._id });
    }

    static async drawWinner() {
        const tickets = await Tickets.find();
        if (tickets.length === 0) {
            return null;
        }
        const randomIndex = Math.floor(Math.random() * tickets.length);
        const winningTicket = tickets[randomIndex];
        const winner = await Winners.create({
            user: winningTicket.user,
            ticket: winningTicket._id,
            status: "locked",
            amount: 100
        });
        await Tickets.deleteMany({});

        return winner;
    }

    static async submitUpi(user, upiid) {
        const winner = await Winners.findOne({
            user: user._id,
            status: "locked"
        });
        if (!winner) {
            throw new Error("Winner not found");
        }
        winner.upiid = upiid;
        winner.status = "unlocked";
        await winner.save();
        return winner;
    }

    static async getUserWin(user) {
        return Winners.findOne({ user: user._id }).sort({ drawdate: -1 });
    }
}

export default RewardService;
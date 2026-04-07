import moment from "moment-timezone";
import Quiz from "../models/Quiz.js";
import UserService from "./UserService.js";

class QuizService {

    static async getQuestion(deviceid) {
        const user = await UserService.findByDeviceId(deviceid);
        const today = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");

        if (user.lastquiztakenat) {
            const lasttakenat = moment(user.lastquiztakenat).tz("Asia/Kolkata").format("YYYY-MM-DD");
            if (lasttakenat === today) {
                return null;
            }
        }

        const todaysqn = await Quiz.findOne({ quizno: user.quizno });
        if (!todaysqn) {
            return null;
        }
        return {
            qn: todaysqn.question,
            opt1: todaysqn.option1,
            opt2: todaysqn.option2,
            opt3: todaysqn.option3
        };
    }

    static async checkAnswer(deviceid, ans) {
        const user = await UserService.findByDeviceId(deviceid);
        const today = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");
        const todaysqn = await Quiz.findOne({ quizno: user.quizno });
        if (!todaysqn) {
            throw new Error("Quiz not available");
        }
        if (todaysqn.answer == ans) {
            await UserService.addXp(user, 10);
            await UserService.incrementQuizNo(user);
            user.lastquiztakenat = new Date();
            await user.save();
            return { correct: true };
        }
        return { correct: false };
    }
}

export default QuizService;
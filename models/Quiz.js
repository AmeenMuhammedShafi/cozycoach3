import mongoose from "mongoose";

const quizschema = new mongoose.Schema({
    quizno: {
        type: Number,
        required: true,
        unique: true
    },
    question: {
        type: String,
        required: true
    },
    option1: {
        type: String,
        required: true
    },
    option2: {
        type: String,
        required: true
    },
    option3: {
        type: String,
        required: true
    },
    answer: {
        type: Number,
        required: true  
    },
    subject: {
        type: String    
    }
});

export default mongoose.model("Quiz", quizschema);
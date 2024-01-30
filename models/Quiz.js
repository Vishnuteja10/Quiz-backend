const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [String],
  answer: {
    type: String,
  },
  optionsCount: [Number],
  optionType: {
    type: String,
  },
  countAttempted: {
    type: Number,
  },
  correctlyAnswered: {
    type: Number,
  },
  wronglyAnswered: {
    type: Number,
  },
});

const QuizSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  quizName: {
    type: String,
    required: true,
  },
  questions: [questionSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  impressions: {
    type: Number,
    default: 0,
  },
  quizType: {
    type: String,
    required: true,
  },
  timer: {
    type: String,
  },
});

module.exports = mongoose.model("Quiz", QuizSchema);

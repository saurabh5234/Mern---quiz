// models/quiz.model.js
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  correctAnswerIndex: {
    type: Number,
    required: true,
  },
  explanation: {
    type: String,
  },
  questionImages: {
    type: [String],
    default: [],
  },
  explanationImages: {
    type: [String],
    default: [],
  },
  marks: {
    type: Number,
    required: true,
    default: 1, // Default marks for each question
  },
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    questions: [questionSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    timeLimit: {
      type: Number, // Time limit in minutes, optional
    },
    attempts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attempt",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Quiz = mongoose.model("Quiz", quizSchema);

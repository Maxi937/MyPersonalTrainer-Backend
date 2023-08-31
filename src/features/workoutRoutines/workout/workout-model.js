import Mongoose from "mongoose";
import logger from "../../../utility/logger.js";

export const workoutSchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    exercises: [
      {
        type: Mongoose.SchemaTypes.ObjectId,
        ref: "Exercise",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export const Workout = Mongoose.model("Workout", workoutSchema);

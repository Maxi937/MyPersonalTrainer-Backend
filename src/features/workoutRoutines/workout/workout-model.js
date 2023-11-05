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
      },
    ],
    createdBy: {
      type: Mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: false,
    },
  },

  { timestamps: true }
);

workoutSchema.statics.getWorkoutsByUser = async function (userId) {
  try {
    return await this.find({ createdBy: userId }).populate("exercises").lean()
  } catch (err) {
    logger.error(err);
    return err;
  }
};

workoutSchema.statics.deleteAll = async function () {
  try {
    await this.deleteMany({});
    return true;
  } catch (err) {
    console.log(err);
    return err;
  }
};

workoutSchema.statics.deleteOne = async function (id) {
  try {
    await this.findOneAndDelete({ _id: id });
    return true;
  } catch (err) {
    console.log(err);
    return err;
  }
};

workoutSchema.query.getById = async function (id) {
  try {
    return await this.findOne({ _id: id });
  } catch (err) {
    logger.error(err);
    return null;
  }
};

export const Workout = Mongoose.model("Workout", workoutSchema);

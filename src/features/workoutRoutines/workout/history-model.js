import Mongoose from "mongoose";
import logger from "../../../utility/logger.js";

export const historySchema = new Mongoose.Schema(
  {
    exercises: [
      {
        type: Mongoose.SchemaTypes.ObjectId,
        ref: "Exercise",
        required: true,
        autopopulate: true
      },
    ],
    createdBy: {
      type: Mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
      autopopulate:true
    },
  },

  { timestamps: true }
);

historySchema.statics.getWorkoutHistoryByUser = async function (userId) {
  try {
    return await this.find({ createdBy: userId })
      .populate("exercises")
      .lean();
  } catch (err) {
    logger.error(err);
    return err;
  }
};

historySchema.statics.deleteAll = async function () {
  try {
    await this.deleteMany({});
    return true;
  } catch (err) {
    console.log(err);
    return err;
  }
};

historySchema.statics.deleteOne = async function (id) {
  try {
    await this.findOneAndDelete({ _id: id });
    return true;
  } catch (err) {
    console.log(err);
    return err;
  }
};

historySchema.query.getById = async function (id) {
  try {
    return await this.findOne({ _id: id });
  } catch (err) {
    logger.error(err);
    return null;
  }
};

export const History = Mongoose.model("History", historySchema);

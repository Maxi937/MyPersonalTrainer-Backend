import Mongoose from "mongoose";
import logger from "../../utility/logger.js";

// TODO: REFINE EXERCISE PROPERTIES

export const exerciseSchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    meta: {
      type: Object,
      required: false,
    },
    createdBy: {
      type: Mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);


exerciseSchema.statics.deleteAll = async function () {
  try {
    await this.deleteMany({});
    return true;
  } catch (err) {
    console.log(err);
    return err;
  }
};

exerciseSchema.statics.deleteOne = async function (id) {
  try {
    await this.findOneAndDelete({ _id: id });
    return true;
  } catch (err) {
    console.log(err);
    return err;
  }
};

exerciseSchema.query.getById = async function (id) {
  try {
    return await this.findOne({ _id: id });
  } catch (err) {
    logger.error(err);
    return null;
  }
};

export const Exercise = Mongoose.model("Exercise", exerciseSchema);

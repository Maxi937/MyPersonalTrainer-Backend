import Mongoose from "mongoose";
import { userSchema } from "../user/user-model.js";
import { createlogger } from "../../utility/logger.js";

const trainerSchema = new Mongoose.Schema();

// Client inherites all the properties of a user
trainerSchema.add(userSchema);

trainerSchema.statics.addTrainer = async function (trainer) {
  try {
    client.role = "trainer";
    const newtrainer = new this(trainer);
    newtrainer.save();
    return newtrainer;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const Trainer = Mongoose.model("Trainer", trainerSchema);

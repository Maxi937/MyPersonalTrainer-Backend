import Mongoose from "mongoose";
import { userSchema } from "../user/user-model.js";
import logger from "../../utility/logger.js";

const trainerSchema = new Mongoose.Schema();

// Trainer inherites all the properties of a user
trainerSchema.add(userSchema);

trainerSchema.add({
  displayName: {
    type: String,
    required: false,
  },
  clients: [{
    type: Mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: false,
  }],
})


trainerSchema.methods.addClient = async function (clientId) {
  try {
    await this.clients.addToSet(clientId)
    await this.save();
    return this.clients
  } catch (err) {
    console.log(err);
    return this.clients;
  }
};

export const Trainer = Mongoose.model("Trainer", trainerSchema);

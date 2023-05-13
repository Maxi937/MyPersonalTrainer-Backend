// This is an example model from the Deed-Box webApp

import Mongoose from "mongoose";
import { createlogger } from "../../../config/logger.js";

const logger = createlogger()

const likeSchema = new Mongoose.Schema(
  {
    review: {
        type: Mongoose.SchemaTypes.ObjectId,
        ref: "Review",
        required: true,
    },
    user: {
        type: Mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true,
    },
  },
  { timestamps: true }
);


export const Like = Mongoose.model("Like", likeSchema);




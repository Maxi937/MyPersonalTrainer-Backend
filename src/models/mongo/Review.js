// This is an example model from the Deed-Box webApp

import Mongoose from "mongoose";
import { createlogger } from "../../../config/logger.js";

const logger = createlogger()

const reviewSchema = new Mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    user: {
      type: Mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    place: {
      type: Mongoose.SchemaTypes.ObjectId,
      ref: "Place",
      required: true,
    },
  },
  { timestamps: true }
);

reviewSchema.methods.addReview = function () {
  try {
    this.save();
    logger.info("Review added Successfully");
    logger.info(this);
  } catch (err) {
    logger.error(err);
  }
};


reviewSchema.statics.findAll = function() {
  try {
    return this.find({}).lean() 
  } catch (err) {
    logger.error(err);
    return None
  }
}

reviewSchema.statics.byReviewId = function(reviewId) {
  try {
    return this.find({placeId}).lean() 
  } catch (err) {
    logger.error(err);
    return None
  }
}

export const Review = Mongoose.model("Review", reviewSchema);




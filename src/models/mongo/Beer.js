// This is an example model from the Deed-Box webApp

import Mongoose from "mongoose";
import createlogger from "../../../config/logger.js";

const logger = createlogger()

// TODO: Add Validators for inputs

const beerSchema = new Mongoose.Schema(
  {
    beerName: {
      type: String,
      required: true,
    },
    beerType: {
      type: String,
      required: true,
    },
    beerAvgPrice: {
      type: Number,
      required: false,
    },
    beerImage: {
        data: Buffer, 
        contentType: String,
    },
  },
  { timestamps: true }
);

beerSchema.methods.addBeer = function () {
  try {
    this.save();
    logger.info("Beer added Successfully");
  } catch (err) {
    logger.error(err);
  }
};

beerSchema.methods.deleteBeer = function (beer) {
    try {
      this.delete();
      logger.info("Beer added Successfully");
    } catch (err) {
      logger.error(err);
    }
  };

beerSchema.statics.findAll = function() {
  try {
    return this.find({}).lean() 
  } catch (err) {
    logger.error(err);
    return None
  }
}

beerSchema.statics.getById = function(beerId) {
  try {
    return this.find({beerId}).lean() 
  } catch (err) {
    logger.error(err);
    return None
  }
}

export const Beer = Mongoose.model("Beer", beerSchema);




const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const logger = require("../config/logger");

const deedBoxSchema = new Schema({
  client: {
    type: mongoose.SchemaTypes.ObjectId,
    required: false
  },
  securities: [mongoose.SchemaTypes.ObjectId],
  locations:[{}]
}, { timestamps: true })

// .statics can be called directly on the DeedBox model
deedBoxSchema.statics.findAll = function() {
  try {
    return this.find({}).lean() 
  } catch (err) {
    logger.error(err);
  }
}

// .methods must be called on a deedBox object
deedBoxSchema.methods.addDeedBox = function () {
  try {
    this.save();
    logger.info("DeedBox added Successfully");
    logger.info(this);
  } catch (err) {
    logger.error(err);
  }
};

const DeedBox = mongoose.model('DeedBox', deedBoxSchema);

module.exports = DeedBox;
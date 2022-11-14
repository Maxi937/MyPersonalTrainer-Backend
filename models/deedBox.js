const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deedBoxSchema = new Schema({
  securities: {
    type: Array,
    required: false
  },
  locations:{
    type: Array,
    required: false
  }
}, { timestamps: true })

deedBoxSchema.statics.findAll = function() {
  try {
    logger.info(this.find({}).lean() )
    return this.find({}).lean() 
  } catch (err) {
    logger.error(err);
  }
}

const DeedBox = mongoose.model('DeedBox', deedBoxSchema);

module.exports = DeedBox;
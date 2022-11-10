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

const DeedBox = mongoose.model('DeedBox', deedBoxSchema);

module.exports = DeedBox;
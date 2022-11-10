const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const securitySchema = new Schema({
  address1: {
    type: String,
    required: true
  },
  address2: {
    type: String,
    required: true
  },
  address3: {
    type: String,
    required: true
  },
  eircode: {
    type: String,
    required: true
  },
  county: {
    type: String,
    required: true
  },
}, { timestamps: true })

const security = mongoose.model('security', securitySchema);

module.exports = security;
"use strict"

const _ = require("lodash");
const logger = require("../utils/logger");
const DeedBox = require("./deedBox");


const deedStore = {

  getAllDeedBoxes(){
    const filter = {};
    return DeedBox.find(filter).lean()
  },

  addDeedBoxTest(security, location) {
    const deedBox = new DeedBox({
      securities: [
        security
      ],
      locations: [
        location
      ],
    });
  
    deedBox.save()
      .then((result) => {
        logger.info('DeedBox added Successfully');
      })
      .catch((err) => {
        logger.error(err);
      });
  }
}

module.exports = deedStore;

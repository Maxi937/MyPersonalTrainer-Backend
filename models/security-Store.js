"use strict"

const _ = require("lodash");
const logger = require("../config/logger");
const Security = require("./Security");


const securityStore = {

  addSecuritiesTest(securityToAdd) {
    const security = new Security({
      security: [
        securityToAdd
      ]
    });
  
    security.save()
      .then((result) => {
        logger.info('Security added Successfully');
      })
      .catch((err) => {
        logger.error(err);
      });
  }
}

module.exports = securityStore;

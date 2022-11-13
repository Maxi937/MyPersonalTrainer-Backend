"use strict"

const _ = require("lodash");
const logger = require("../config/logger");
const Security = require("../models/security");


const securitiesStore = {

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

module.exports = securitiesStore;

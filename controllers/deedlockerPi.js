"use strict";

const logger = require("../config/logger");

const deedlockerPi = {
  test(request, response) {
    logger.info("Test Called");

    const responseData = {
      code: 200,
      message: "Hello here is some data",
      data: "49 is the meaning of life"
    };
    response.status(200).json(responseData);
  },
};

module.exports = deedlockerPi;

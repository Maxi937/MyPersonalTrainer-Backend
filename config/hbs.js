"use strict"

// Handlebars Helpers

// This helper will allow front end formatting of dates
const moment = require('moment');

module.exports = {
  formatDate: function (date, format) {
    return moment(date).format(format)
  }
}
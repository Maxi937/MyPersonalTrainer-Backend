"use strict"

const { createLogger, format, transports } = require("winston");
const { combine, label, printf, timestamp, colorize} = format;

const myFormat = printf( ({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message} `
});

const logger = createLogger({
  format: combine(
    colorize({level: true}),
    timestamp({format: 'MMM D, YYYY HH:mm'}),
    myFormat
  ),
  transports: [new transports.Console()],
});

module.exports = logger;
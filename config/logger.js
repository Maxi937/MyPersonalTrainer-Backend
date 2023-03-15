import winston, { format } from "winston";

const { combine, label, printf, timestamp, colorize} = format;

const myFormat = printf( ({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message} `
});

export default function createlogger() {
  const logger = winston.createLogger({
    format: combine(
      colorize({level: true}),
      timestamp({format: 'MMM D, YYYY HH:mm'}),
      myFormat
    ),
    transports: [new winston.transports.Console()],
  });
  return logger
}

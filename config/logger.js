import winston, { format } from "winston";

const { combine, label, printf, timestamp, colorize} = format;
const myFormat = printf( ({ level, message, timestamp }) => `${timestamp} [${level}]: ${message} `);

export function createlogger() {
  const logger = winston.createLogger({
    format: combine(
      colorize({level: true}),
      timestamp({format: "MMM D, YYYY HH:mm"}),
      myFormat
    ),
    transports: [new winston.transports.Console()],
  });
  return logger
}

export function validationError(request, h, error) {
  const logger = createlogger()
  console.log(error)
  //logger.error(error.message);
  return error
}

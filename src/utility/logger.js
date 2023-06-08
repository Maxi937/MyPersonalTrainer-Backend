import winston, { format } from "winston";

const { combine, label, printf, timestamp, colorize } = format;
// eslint-disable-next-line no-shadow
const myFormat = printf(({ level, message, timestamp }) => `${timestamp} [${level}]: ${message} `);

export function createlogger() {
  let logger = {}

  if (process.env.NODE_ENV === "development") {
    logger = winston.createLogger({
      format: combine(
        colorize({ level: true }),
        timestamp({ format: "MMM D, YYYY HH:mm" }),
        myFormat
      ),
      transports: new winston.transports.Console(),
    });
  }
  else {
    logger = winston.createLogger({
      format: combine(
        timestamp({ format: "MMM D, YYYY HH:mm" }),
        myFormat
      ),
      transports: new winston.transports.File({
        filename: "logs/serverLog.txt"
      }),
    });
  }
  return logger
}

export async function validationError(request, h, error) {
  const logger = createlogger()

  console.log( await request.payload)
  console.log( await typeof(request.payload))
  logger.warn(`JOI Validation error: ${error.message}`);


  return error
}

import winston, { format } from "winston";

const myLevels = {
  levels: {
    notice: 0,
    info: 1,
    warn: 2,
    error: 3
  },
  colors: {
    notice: "blue",
    info: "green",
    warn: "yellow",
    error: "red"
  }
}


export function createlogger() {
  const { combine, label, printf, timestamp, colorize } = format;
  const myFormat = printf((msg) => `${msg.timestamp} [${msg.level}]: ${msg.message} `);

  let logger = {}

  if (process.env.NODE_ENV === "development") {
    logger = winston.createLogger({
      levels: myLevels.levels,
      format: combine(
        colorize(),
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

export function createTestLogger() {
  const { combine, printf } = format;
  const myFormat = printf(({ level, message }) => `[${level}]: ${message}`);
  
  const logger = winston.createLogger({
      format: combine(
        myFormat
      ),
      transports: new winston.transports.Console(),
    });
  return logger
}


export async function validationError(request, h, error) {
  const logger = createlogger()

  console.log( await request.payload)
  console.log( await typeof(request.payload))
  logger.warn(`JOI Validation error: ${error.message}`);


  return error
}

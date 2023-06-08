import winston, { format } from "winston";

const myLevels = {
  levels: {
    notice: 0,
    info: 1,
    http: 1,
    warn: 2,
    error: 3,
  },
  colors: {
    notice: "bold cyan",
    info: "bold blue",
    http: "bold magenta",
    warn: "bold yellow",
    error: "bold red",
    timestamp: "gray"
  }
}

winston.addColors(myLevels.colors);

const colorizer = winston.format.colorize();
const myFormat = format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "MMM D, YYYY HH:mm" }),
  winston.format.printf(msg => 
    `${colorizer.colorize("timestamp", msg.timestamp)} [${msg.level}]: ${msg.message}`)
  )

const myTestFormat = format.combine(
    winston.format.timestamp({ format: "MMM D, YYYY HH:mm" }),
    winston.format.printf(msg => 
      `[${msg.level}]: ${msg.message}`)
    )

export function createlogger() {
  let logger = {}

  if (process.env.NODE_ENV === "development") {
    logger = winston.createLogger({
      levels: myLevels.levels,
      format: myFormat,
      transports: new winston.transports.Console({level:"error"}),
    });
  }
  else {
    logger = winston.createLogger({
      format: myFormat,
      transports: new winston.transports.File({
        filename: "logs/serverLog.txt"
      }),
    });
  }
  return logger
}

export function createTestLogger() {
  const logger = winston.createLogger({
      format: myTestFormat,
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

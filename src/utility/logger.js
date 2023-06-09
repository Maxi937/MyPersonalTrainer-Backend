import winston, { format } from "winston";

const myLevels = {
  levels: {
    notice: 0,
    info: 1,
    http: 2,
    warn: 3,
    error: 4,
  },
  colors: {
    notice: "bold cyan",
    info: "bold blue",
    http: "bold magenta",
    warn: "bold yellow",
    error: "bold red",
    timestamp: "gray",
    GET: "green",
    POST: "blue",
    DELETE: "red",
  },
};

winston.addColors(myLevels.colors);

const colorizer = winston.format.colorize();

function formatHttpRequest(msg) {
  const method = String(msg.metadata.request.method).toUpperCase();

  if (process.env.NODE_ENV === "development") {
    return `${colorizer.colorize("timestamp", msg.timestamp)} [${msg.level}]: ${colorizer.colorize(method, method)}: ${msg.metadata.request.path} - ${
      msg.metadata.request.response.headers["x-response-time"]
    }ms`;
  }
  return `${msg.timestamp} [${msg.level}]: ${method}: ${msg.metadata.request.path} - ${msg.metadata.request.response.headers["x-response-time"]}ms`;
}

const myLoggerFormats = {
  standard: winston.format.combine(
    winston.format.colorize(),
    winston.format.metadata(),
    winston.format.timestamp({ format: "MMM D, YYYY HH:mm" }),
    winston.format.printf((msg) => {
      if (msg.level.includes("http")) {
        return formatHttpRequest(msg);
      }
      return `${colorizer.colorize("timestamp", msg.timestamp)} [${msg.level}]: ${msg.message}`;
    })
  ),
  serverLog: winston.format.combine(
    winston.format.metadata(),
    winston.format.timestamp({ format: "MMM D, YYYY HH:mm" }),
    winston.format.printf((msg) => {
      if (msg.level.includes("http")) {
        return formatHttpRequest(msg);
      }
      return `${msg.timestamp} [${msg.level}]: ${msg.message}`;
    }),
  )
  ,
  testing: format.combine(
    winston.format.timestamp({ format: "MMM D, YYYY HH:mm" }),
    winston.format.printf((msg) => `[${msg.level}]: ${msg.message}`)
  ),
};

export function createlogger() {
  let myTransport;
  let myFormat;

  if (process.env.NODE_ENV === "development") {
    myFormat = myLoggerFormats.standard;
    myTransport = new winston.transports.Console({ level: "error" });
  } else {
    myFormat = myLoggerFormats.serverLog;
    myTransport = new winston.transports.File({
      level: "error",
      filename: "logs/serverLog.txt",
    });
  }

  const logger = winston.createLogger({
    levels: myLevels.levels,
    format: myFormat,
    transports: myTransport,
  });

  return logger;
}

export function createTestLogger() {
  const logger = winston.createLogger({
    levels: myLevels.levels,
    format: myLoggerFormats.testing,
    transports: new winston.transports.Console({level: "error"}),
  });
  return logger;
}

export async function validationError(request, h, error) {
  const logger = createlogger();
  console.log(await request.payload);
  console.log(await typeof request.payload);
  logger.warn(`JOI Validation error: ${error.message}`);
  return error;
}

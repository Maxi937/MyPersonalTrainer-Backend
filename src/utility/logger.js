import winston, { format } from "winston";
import { formatStripAnsi } from "./formatutils.js";

const colorizer = winston.format.colorize();

const myLevels = {
  levels: {
    notice: 0,
    info: 1,
    http: 2,
    warn: 3,
    error: 4,
    httpinfo: 5,
  },
  colors: {
    notice: "bold cyan",
    info: "bold blue",
    http: "bold magenta",
    httpinfo: "bold magenta",
    warn: "bold yellow",
    error: "bold red",
    timestamp: "gray",
    GET: "green",
    POST: "blue",
    DELETE: "red",
  },
};

winston.addColors(myLevels.colors);

function formatHttpRequest(msg, colorize) {
  const method = String(msg.metadata.request.method).toUpperCase();

  return `${colorizer.colorize("timestamp", msg.timestamp)} [${msg.level}]: ${colorizer.colorize(method, method)}: ${msg.metadata.request.path} - ${
    msg.metadata.request.response.headers["x-response-time"]
  }ms`;
}

function formatHttpInfo(msg) {
  const { infoPacket } = msg.metadata;
  const info = { [infoPacket.remoteAddress]: infoPacket };
  return `[${msg.level}]: ${JSON.stringify(info, null, 2)}`;
}

function loggerOutput(msg) {
  if (formatStripAnsi(msg.level) === "http") {
    return formatHttpRequest(msg);
  }
  if (formatStripAnsi(msg.level) === "httpinfo") {
    return formatHttpInfo(msg);
  }
  return `${colorizer.colorize("timestamp", msg.timestamp)} [${msg.level}]: ${msg.message}`;
}

const consoleLog = (logLevel = "error") => ({
  levels: myLevels.levels,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.metadata(),
    winston.format.timestamp({ format: "MMM D, YYYY HH:mm" }),
    winston.format.printf((msg) => loggerOutput(msg))
  ),
  transports: new winston.transports.Console({ level: logLevel }),
});

const serverLog = {
  levels: myLevels.levels,
  format: winston.format.combine(
    winston.format.metadata(),
    winston.format.timestamp({ format: "MMM D, YYYY HH:mm" }),
    winston.format.printf((msg) => formatStripAnsi(loggerOutput(msg)))
  ),
  transports: new winston.transports.File({
    level: "httpinfo",
    filename: "logs/serverLog.txt",
  }),
};

const logger = () => {
  if (process.env.NODE_ENV === "development") {
    return winston.createLogger(consoleLog());
  }
  return winston.createLogger(serverLog);
};

export default logger();

// const myLoggerFormats = {
//   standard: winston.format.combine(
//     winston.format.colorize(),
//     winston.format.metadata(),
//     winston.format.timestamp({ format: "MMM D, YYYY HH:mm" }),
//     winston.format.printf((msg) => loggerOutput(msg, true))
//   ),

//   serverLog: winston.format.combine(
//     winston.format.metadata(),
//     winston.format.timestamp({ format: "MMM D, YYYY HH:mm" }),
//     winston.format.printf((msg) => loggerOutput(msg, true))
//   ),

//   testing: format.combine(
//     winston.format.timestamp({ format: "MMM D, YYYY HH:mm" }),
//     winston.format.printf((msg) => `[${msg.level}]: ${msg.message}`)
//   ),
// };

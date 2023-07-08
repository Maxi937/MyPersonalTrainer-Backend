import os from "os";
import { createlogger } from "../utility/logger.js";


const logger = createlogger();


export async function responseTimes(server) {
  server.ext("onRequest", (request, h) => {
    request.headers["x-req-start"] = new Date().getTime();
    return h.continue;
  });

  server.ext("onPreResponse", (request, h) => {
    const start = parseInt(request.headers["x-req-start"], 10);
    const end = new Date().getTime();
    if (!request.response.isBoom) {
      request.response
        .header("x-req-start", start)
        .header("x-res-end", end)
        .header("x-response-time", end - start)
        .header("Server", os.hostname());

      logger.http("", { request });
    }
    return h.continue;
  });
}

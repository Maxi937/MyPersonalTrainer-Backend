import logger from "../utility/logger.js";

// Extend Server to get log detailed request Info
export function requestInfo(server) {
  server.ext("onRequest", (request, h) => {
    const {info} = request

    const infoPacket = {
        timestamp: new Date(info.received),
        host: info.host,
        id: info.id,
        remotePort: info.remotePort,
        remoteAddress: info.remoteAddress,
        requestMethod: request.method.toUpperCase(),
        requestPath: request.path,
        cors: info.cors
    }
    logger.httpinfo("", { infoPacket })
    return h.continue;
  });
}
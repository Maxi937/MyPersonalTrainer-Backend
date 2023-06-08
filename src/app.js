import { start } from "./server.js"
import { createlogger } from "./utility/logger.js";
import { createAdmin } from "./utility/serverutils.js";

const logger = createlogger()

try {
    const server = await start()
    logger.info(`Server running on <${server.info.uri}>`);
    logger.info(`Server started: ${new Date()}`);
    await createAdmin();
} catch (err) {
    logger.error(err.message)
}

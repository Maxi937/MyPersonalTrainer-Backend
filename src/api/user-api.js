import Boom from "@hapi/boom";
import createlogger from "../../config/logger";
import { db } from "../models/db.js"

const logger = createlogger()


export const userApi = {
    find: {
        auth: false,
        handler:async function (request, h) {
            try {
                const users = await db.User.find()
                console.log(users)
            } 
            catch (err){
                logger.error(err)
            }
        }
    }
}
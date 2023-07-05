import { createlogger } from "../../utility/logger.js";

const logger = createlogger();

export const testApi = {
  test1: {
    method: "GET",
    path: "/test1",
    options: {
      auth: false,
    },
    handler: async function (request, h) {
      console.log("test1");
      return h.response("test1");
    },
  },

  test2: {
    method: "GET",
    path: "/test2",
    options: {
      auth: false,
    },
    handler: async function (request, h) {
      console.log("test1");
      return h.response("test2");
    },
  }
};

export default function Routes() {
  return testApi
}



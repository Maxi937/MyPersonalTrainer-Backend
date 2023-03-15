import { User } from "../models/mongo/User.js";



export const dashboardController = {
    index: {
      handler: async function (request, h) {
        const users = await User.find().lean()

        console.log(users)

        const viewData = {
          users
        }
        return h.view("main", viewData);
      },
    },
  };
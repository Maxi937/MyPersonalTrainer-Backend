

export const dashboardController = {
    index: {
      handler: async function (request, h) {
        const location = getLocationToAddress()

        const viewData = {
        }
        return h.view("user/user-dashboard", viewData);
      },
    },
  };
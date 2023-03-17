

export const dashboardController = {
    index: {
      handler: async function (request, h) {
        const viewData = {
        }
        return h.view("user/user-dashboard", viewData);
      },
    },
  };
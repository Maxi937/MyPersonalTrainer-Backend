import { dashboardController } from "./controllers/dashboard-controller.js";
import { aboutController } from "./controllers/about-controller.js";
import { adminController } from "./controllers/admin-controller.js";
import { accountsController } from "./controllers/accounts-controller.js";

export const webRoutes = [
    { method: "GET", path: "/about", config: aboutController.index },
    
    // Accounts
    { method: "GET", path: "/", config: accountsController.index },
    { method: "GET", path: "/signup", config: accountsController.showSignup },
    { method: "GET", path: "/login", config: accountsController.showLogin },
    { method: "GET", path: "/logout", config: accountsController.logout },
    { method: "POST", path: "/register", config: accountsController.signup },
    { method: "POST", path: "/authenticate", config: accountsController.login },

    // Dashboard
    { method: "GET", path: "/dashboard", config: dashboardController.index },
    { method: "POST", path: "/dashboard/review", config: dashboardController.review },

    // Admin
    { method: "GET", path: "/admin", config: adminController.index },
    { method: "GET", path: "/admin/users", config: adminController.users },
    { method: "GET", path: "/admin/forms/newUser", config: adminController.openUserForm },
    { method: "POST", path: "/admin/newuser", config: adminController.createNewUser }, 
    { method: "GET", path: "/admin/users/delete/{id}", config: adminController.deleteUser },

    { method: "GET", path: "/admin/places", config: adminController.places },
    { method: "GET", path: "/admin/forms/new-place", config: adminController.openPlaceForm },
    { method: "POST", path: "/admin/new-place", config: adminController.createNewPlace },
    { method: "GET", path: "/admin/places/delete/{id}", config: adminController.deletePlace },

    { method: "GET", path: "/admin/beers", config: adminController.beers },
    { method: "GET", path: "/admin/forms/new-beer", config: adminController.openBeerForm },
    { method: "POST", path: "/admin/new-beer", config: adminController.createNewBeer },
    { method: "GET", path: "/admin/beers/delete/{id}", config: adminController.deleteBeer },
    { method: "GET", path: "/admin/beers/{id}", config: adminController.beer },
    { method: "POST", path: "/admin/beers/{id}", config: adminController.updateBeer },

    { method: "GET", path: "/admin/reviews", config: adminController.reviews },
    { method: "GET", path: "/admin/reviews/delete/{id}", config: adminController.deleteReview },

    { method: "GET", path: "/{param*}", handler: { directory: { path: "./public" } }, options: { auth: false } }
];

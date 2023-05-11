import { dashboardController } from "./controllers/dashboard-controller.js";
import { aboutController } from "./controllers/about-controller.js";
import { adminController } from "./controllers/admin-controller.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { profileController } from "./controllers/profile-controller.js";

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

    // Profile
    { method: "GET", path: "/profile", config: profileController.index },
    { method: "POST", path: "/profile/{id}", config: profileController.updateProfile},
    { method: "GET", path: "/reviews/delete/{id}", config: profileController.deleteReview },
    

    { method: "GET", path: "/{param*}", handler: { directory: { path: "./public" } }, options: { auth: false } }
];

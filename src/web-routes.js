import { dashboardController } from "./controllers/dashboard-controller.js";
import { aboutController } from "./controllers/about-controller.js";
import { adminController } from "./controllers/admin-controller.js";
import { accountsController } from "./controllers/accounts-controller.js";

export const webRoutes = [
    { method: "GET", path: "/about", config: aboutController.index },
    // User
    { method: "GET", path: "/", config: accountsController.index },
    { method: "GET", path: "/login", config: accountsController.showLogin },
    { method: "GET", path: "/logout", config: accountsController.logout },
    { method: "POST", path: "/register", config: accountsController.signup },
    { method: "POST", path: "/authenticate", config: accountsController.login },
    { method: "GET", path: "/dashboard", config: dashboardController.index },

    // Admin
    { method: "GET", path: "/admin", config: adminController.index },
    { method: "GET", path: "/admin/users", config: adminController.users },
    { method: "GET", path: "/admin/forms/newUser", config: adminController.openUserForm },
    { method: "POST", path: "/admin/newuser", config: adminController.createNewUser }, 
    { method: "GET", path: "/admin/places", config: adminController.places },
    { method: "GET", path: "/admin/forms/new-place", config: adminController.openPlaceForm },
    { method: "POST", path: "/admin/new-place", config: adminController.createNewPlace },
];

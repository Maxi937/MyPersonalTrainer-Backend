import { dashboardController } from "./controllers/dashboard-controller.js";
import { aboutController } from "./controllers/about-controller.js";
import { adminController } from "./controllers/admin-controller.js"

export const webRoutes = [
    { method: "GET", path: "/", config: dashboardController.index },
    { method: "GET", path: "/about", config: aboutController.index },
    { method: "GET", path: "/admin", config: adminController.index },
    { method: "GET", path: "/admin/users", config: adminController.users },
    { method: "GET", path: "/admin/forms/newUser", config: adminController.openUserForm },
    { method: "POST", path: "/admin/newuser", config: adminController.createNewUser },  
];

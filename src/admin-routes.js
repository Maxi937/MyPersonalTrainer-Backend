import { adminController } from "./controllers/admin-controller.js";


export const adminRoutes = [
    // User
    { method: "GET", path: "/admin", config: adminController.index },
    { method: "GET", path: "/admin/users/{id}", config: adminController.user },
    { method: "GET", path: "/admin/users", config: adminController.users },
    { method: "POST", path: "/admin/users/{id}", config: adminController.updateUser },
    { method: "GET", path: "/admin/forms/new-user", config: adminController.openUserForm },
    { method: "POST", path: "/admin/newuser", config: adminController.createNewUser },
    { method: "GET", path: "/admin/users/delete/{id}", config: adminController.deleteUser },
    
    // DB
];


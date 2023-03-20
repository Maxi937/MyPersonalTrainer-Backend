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
    // Places
    { method: "GET", path: "/admin/places", config: adminController.places },
    { method: "GET", path: "/admin/forms/new-place", config: adminController.openPlaceForm },
    { method: "POST", path: "/admin/new-place", config: adminController.createNewPlace },
    { method: "GET", path: "/admin/places/delete/{id}", config: adminController.deletePlace },
    // Beers
    { method: "GET", path: "/admin/beers", config: adminController.beers },
    { method: "GET", path: "/admin/forms/new-beer", config: adminController.openBeerForm },
    { method: "POST", path: "/admin/new-beer", config: adminController.createNewBeer },
    { method: "GET", path: "/admin/beers/delete/{id}", config: adminController.deleteBeer },
    { method: "GET", path: "/admin/beers/{id}", config: adminController.beer },
    { method: "POST", path: "/admin/beers/{id}", config: adminController.updateBeer },
    // Reviews
    { method: "GET", path: "/admin/reviews", config: adminController.reviews },
    { method: "GET", path: "/admin/reviews/delete/{id}", config: adminController.deleteReview },
    // DB
    { method: "GET", path: "/admin/dropdb", config: adminController.dropDB },

];


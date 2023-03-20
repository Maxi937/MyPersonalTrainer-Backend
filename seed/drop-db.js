import { pintAccountantService } from "../test/api/pintaccountant-service.js";

await pintAccountantService.deleteAllReviews();
await pintAccountantService.deleteAllUsers();
await pintAccountantService.deleteAllPlaces();
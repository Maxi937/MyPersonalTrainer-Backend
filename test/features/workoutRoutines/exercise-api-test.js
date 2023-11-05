// import { assert } from "chai";
// import { assertSubset, createMockFormData } from "../../test-utils.js";
// import { myPersonalTrainerService } from "../mypersonaltrainer-service.js";
// import { kiki, maggie, adminUser, testUsers, testTrainers } from "../../fixtures/fixtures.js";
// import { lateralRaise, testExercises } from "../../fixtures/exercise-fixtures.js";

// suite("Exercise API tests", () => {
//   setup(async () => {
//     await myPersonalTrainerService.clearAuth();
//     await myPersonalTrainerService.authenticate(adminUser);
//     await myPersonalTrainerService.deleteAllExercises();
//   });

//   suiteTeardown(async () => {
//     await myPersonalTrainerService.deleteAllExercises();
//     await myPersonalTrainerService.clearAuth();
//   });

//   test("Create Exercise", async () => {
//     const { exercise } = await myPersonalTrainerService.createExercise(lateralRaise);
//     assertSubset(lateralRaise, exercise);
//     assert.isDefined(exercise._id);
//   });

//   test("Get All Exercises", async () => {
//     await Promise.all(
//       testExercises.map(async (newexercise) => {
//         await myPersonalTrainerService.createExercise(newexercise);
//       })
//     );

//     const { exercises } = await myPersonalTrainerService.getExercises();
//     assert.equal(exercises.length, testExercises.length);
//   });

//   test("Get Exercise - Body Part", async () => {
//     await Promise.all(
//       testExercises.map(async (newexercise) => {
//         await myPersonalTrainerService.createExercise(newexercise);
//       })
//     );

//     const { exercise } = await myPersonalTrainerService.getExercises({ bodyPart: "Chest" });
//     assert.equal(exercise.name, "Bench Press");
//   });

//   test("Delete Exercise", async () => {
//     await Promise.all(
//       testExercises.map(async (newexercise) => {
//         await myPersonalTrainerService.createExercise(newexercise);
//       })
//     );

//     const { exercise } = await myPersonalTrainerService.getExercises({ bodyPart: "Chest" });

//     const response = await myPersonalTrainerService.deleteExercise(exercise._id);
//     assert.equal(response.status, "success");

//     const { exercises } = await myPersonalTrainerService.getExercises();
//     assert.equal(exercises.length, testExercises.length - 1);
//   });
// });

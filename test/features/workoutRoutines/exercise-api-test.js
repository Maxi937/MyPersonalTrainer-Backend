import { assert } from "chai";
import { assertSubset, createMockFormData } from "../../test-utils.js";
import { myPersonalTrainerService } from "../mypersonaltrainer-service.js";
import { kiki, maggie, adminUser, testUsers, testTrainers } from "../../fixtures/fixtures.js";
import { lateralRaise, testExercises } from "../../fixtures/exercise-fixtures.js";

suite("Exercise API tests", () => {
  setup(async () => {
    await myPersonalTrainerService.clearAuth();
    await myPersonalTrainerService.authenticate(adminUser);
    await myPersonalTrainerService.deleteAllExercises();
    await myPersonalTrainerService.deleteAllWorkouts();
    await myPersonalTrainerService.deleteAllUsers();
  });

  suiteTeardown(async () => {
    await myPersonalTrainerService.authenticate(adminUser);
    await myPersonalTrainerService.deleteAllWorkouts();
    await myPersonalTrainerService.deleteAllExercises();
    await myPersonalTrainerService.deleteAllUsers();
    await myPersonalTrainerService.clearAuth();
  });

  test("Create Exercise", async () => {
    await myPersonalTrainerService.createUser(maggie);
    await myPersonalTrainerService.authenticate(maggie);
    const { exercise } = await myPersonalTrainerService.createExercise(lateralRaise);
    assertSubset(lateralRaise, exercise);
    assert.isDefined(exercise._id);
  });

  test("Get All Exercises", async () => {
    await myPersonalTrainerService.createUser(maggie);
    await myPersonalTrainerService.authenticate(maggie);

    await Promise.all(
      testExercises.map(async (newexercise) => {
        await myPersonalTrainerService.createExercise(newexercise);
      })
    );

    const { exercises } = await myPersonalTrainerService.getExercises();
    assert.equal(exercises.length, testExercises.length);
  });

  test("Get All Exercises - User has no Exercises", async () => {
    await myPersonalTrainerService.createUser(maggie);
    await myPersonalTrainerService.authenticate(maggie);

    await Promise.all(
      testExercises.map(async (newexercise) => {
        await myPersonalTrainerService.createExercise(newexercise);
      })
    );

    const response = await myPersonalTrainerService.getExercises();
    assert.equal(response.exercises.length, testExercises.length);

    await myPersonalTrainerService.createUser(testUsers[0]);
    await myPersonalTrainerService.authenticate(testUsers[0]);

    const { exercises } = await myPersonalTrainerService.getExercises();
    
    assert.equal(exercises.length, 0);
  });



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
});

import { assert } from "chai";
import { myPersonalTrainerService } from "../mypersonaltrainer-service.js";
import { createMockFormData, assertSubset } from "../../test-utils.js";
import { maggie, adminUser } from "../../fixtures/fixtures.js";
import { testWorkouts } from "../../fixtures/workouts-fixtures.js";
import { testExercises } from "../../fixtures/exercise-fixtures.js";

suite("Profile API tests", async () => {
  setup(async () => {
    await myPersonalTrainerService.clearAuth();
    await myPersonalTrainerService.authenticate(adminUser);
    await myPersonalTrainerService.deleteAllExercises();
    await myPersonalTrainerService.deleteAllWorkouts();
    await myPersonalTrainerService.deleteAllUsers();
  });

  suiteTeardown(async () => {
    await myPersonalTrainerService.clearAuth();
    await myPersonalTrainerService.authenticate(adminUser);
    await myPersonalTrainerService.deleteAllExercises();
    await myPersonalTrainerService.deleteAllWorkouts();
    await myPersonalTrainerService.deleteAllUsers();
  });

  test("Profile - Get User Profile", async () => {
    await myPersonalTrainerService.createUser(maggie);
    await myPersonalTrainerService.authenticate(maggie);

    await Promise.all(
      testExercises.map(async (newexercise) => {
        await myPersonalTrainerService.createExercise(newexercise);
      })
    );

    const { exercises } = await myPersonalTrainerService.getExercises();
    assert.equal(exercises.length, testExercises.length);
    console.log(exercises)

    await Promise.all(
      testWorkouts.map(async (newworkout) => {
        await myPersonalTrainerService.createWorkout(newworkout);
      })
    );

    const { workouts } = await myPersonalTrainerService.getWorkouts();
    console.log(workouts)
    assert.equal(workouts.length, testWorkouts.length);

    const { profile } = await myPersonalTrainerService.getProfile()
    console.log(await myPersonalTrainerService.getProfile())
  });

  // test("Profile - Add User Image", async () => {
  //   const returnedUser = await myPersonalTrainerService.createUser(maggie);
  //   await myPersonalTrainerService.authenticate(maggie);
  //   const form = createMockFormData("./public/images/guiness.jpg");
  //   const response = await myPersonalTrainerService.addUserImage(form);
  //   assert(response.success);
  //   assert.isDefined(response.data.path);
  // });

  // test("Profile - Get All User Images", async () => {
  //   const returnedUser = await myPersonalTrainerService.createUser(maggie);
  //   await myPersonalTrainerService.authenticate(maggie);
  //   const form = createMockFormData("./public/images/guiness.jpg");
  //   await myPersonalTrainerService.addUserImage(form);
  //   const response = await myPersonalTrainerService.getUserImages();
  //   assert.equal(response.length, 1);
  // });
});

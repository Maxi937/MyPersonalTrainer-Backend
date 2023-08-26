import { assert } from "chai";
import { assertSubset, createMockFormData } from "../../test-utils.js";
import { myPersonalTrainerService } from "../mypersonaltrainer-service.js";
import { kiki, maggie, adminUser, testUsers, testTrainers } from "../../fixtures.js";
import { lateralRaise } from "./workouts-fixtures.js";

suite("Workout API tests", () => {
  setup(async () => {
    await myPersonalTrainerService.clearAuth();
    await myPersonalTrainerService.authenticate(adminUser);
    await myPersonalTrainerService.deleteAllTrainers();
    await myPersonalTrainerService.deleteAllUsers();
  });

  suiteTeardown(async () => {
    await myPersonalTrainerService.deleteAllTrainers();
    await myPersonalTrainerService.clearAuth();
  });

  test("Create Exercise", async () => {
    const { exercise } = await myPersonalTrainerService.createExercise(lateralRaise);
    assertSubset(lateralRaise, exercise);
    assert.isDefined(exercise._id);
  });

});

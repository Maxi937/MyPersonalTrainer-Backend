import { assert } from "chai";
import { assertSubset, createMockFormData } from "../../test-utils.js";
import { myPersonalTrainerService } from "../mypersonaltrainer-service.js";
import { kiki, maggie, adminUser, testUsers, testTrainers } from "../../fixtures/fixtures.js";
import { workoutDay1, testWorkouts } from "../../fixtures/workouts-fixtures.js";

suite("Workout API tests", () => {
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

  test("Create Workout", async () => {
    await myPersonalTrainerService.createUser(maggie);
    await myPersonalTrainerService.authenticate(maggie);
    const { workout } = await myPersonalTrainerService.createWorkout(workoutDay1);
    assertSubset(workout, workoutDay1);
    assert.isDefined(workout._id);
  });


  test("Get All Workouts", async () => {
    await myPersonalTrainerService.createUser(maggie);
    await myPersonalTrainerService.authenticate(maggie);

    await Promise.all(
      testWorkouts.map(async (newworkout) => {
        await myPersonalTrainerService.createWorkout(newworkout);
      })
    );

    const { workouts } = await myPersonalTrainerService.getWorkouts();
    assert.equal(workouts.length, testWorkouts.length);
  });

  test("Get All Workouts - User has no workouts", async () => {
    await myPersonalTrainerService.createUser(maggie);
    await myPersonalTrainerService.authenticate(maggie);

    await Promise.all(
      testWorkouts.map(async (newworkout) => {
        await myPersonalTrainerService.createWorkout(newworkout);
      })
    );

    const response = await myPersonalTrainerService.getWorkouts();
    console.log(response)
    assert.equal(response.workouts.length, testWorkouts.length);

    await myPersonalTrainerService.createUser(testUsers[0]);
    await myPersonalTrainerService.authenticate(testUsers[0]);

    const { workouts } = await myPersonalTrainerService.getWorkouts();
    
    assert.equal(workouts.length, 0);
  });

  // test("Get All Exercises", async () => {
  //   await Promise.all(
  //     testExercises.map(async (newexercise) => {
  //       await myPersonalTrainerService.createExercise(newexercise);
  //     })
  //   );

  //   const { exercises } = await myPersonalTrainerService.getExercises();
  //   assert.equal(exercises.length, testExercises.length);
  // });

  // test("Get Exercise - Body Part", async () => {
  //   await Promise.all(
  //     testExercises.map(async (newexercise) => {
  //       await myPersonalTrainerService.createExercise(newexercise);
  //     })
  //   );

  //   const { exercise } = await myPersonalTrainerService.getExercises({ bodyPart: "Chest" });
  //   assert.equal(exercise.name, "Bench Press");
  // });

  // test("Delete Exercise", async () => {
  //   await Promise.all(
  //     testExercises.map(async (newexercise) => {
  //       await myPersonalTrainerService.createExercise(newexercise);
  //     })
  //   );

  //   const { exercise } = await myPersonalTrainerService.getExercises({ bodyPart: "Chest" });

  //   const response = await myPersonalTrainerService.deleteExercise(exercise._id);
  //   assert.equal(response.status, "success");

  //   const { exercises } = await myPersonalTrainerService.getExercises();
  //   assert.equal(exercises.length, testExercises.length - 1);
  // });
});

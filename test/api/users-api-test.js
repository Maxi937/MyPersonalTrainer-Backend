import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { myPersonalTrainerService } from "./mypersonaltrainer-service.js";
import { maggie, maggieCredentials, testUsers } from "../fixtures.js";

const users = new Array(testUsers.length);

suite("User API tests", () => {
  setup(async () => {
    myPersonalTrainerService.clearAuth();
    await myPersonalTrainerService.createUser(maggie);
    await myPersonalTrainerService.authenticate(maggieCredentials);
    await myPersonalTrainerService.deleteAllUsers();

    for (let i = 0; i < testUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      users[0] = await myPersonalTrainerService.createUser(testUsers[i]); 
    }
    await myPersonalTrainerService.createUser(maggie);
    await myPersonalTrainerService.authenticate(maggie);
  });
  teardown(async () => { });

  test("create a user", async () => {
    const newUser = await myPersonalTrainerService.createUser(maggie);
    assertSubset(maggie, newUser);
    assert.isDefined(newUser._id);
  });

  test("delete all user", async () => {
    let returnedUsers = await myPersonalTrainerService.getAllUsers();
    assert.equal(returnedUsers.length, 4);
    await myPersonalTrainerService.deleteAllUsers();
    await myPersonalTrainerService.createUser(maggie);
    await myPersonalTrainerService.authenticate(maggie);
    returnedUsers = await myPersonalTrainerService.getAllUsers();
    assert.equal(returnedUsers.length, 1);
  });

  test("get a user", async () => {
    const returnedUser = await myPersonalTrainerService.getUser(users[0]._id);
    assert.deepEqual(users[0].email, returnedUser.email);
  });

  test("get a user - bad id", async () => {
    try {
      const returnedUser = await myPersonalTrainerService.getUser("1234");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No User with this id");
      // assert.equal(error.response.data.statusCode, 503);
    }
  });

  test("get a user - deleted user", async () => {
    await myPersonalTrainerService.deleteAllUsers();
    try {
      const returnedUser = await myPersonalTrainerService.getUser(testUsers[0]._id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No User with this id");
      assert.equal(error.response.data.statusCode, 503);
    }
  });
});

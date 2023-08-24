import { assert } from "chai";
import { assertSubset, createMockFormData } from "../../test-utils.js";
import { myPersonalTrainerService } from "../mypersonaltrainer-service.js";
import { maggie, adminUser, testUsers } from "../../fixtures.js";

const mockUsers = new Array(testUsers.length);

suite("User API tests", () => {
  setup(async () => {
    await myPersonalTrainerService.clearAuth();
    await myPersonalTrainerService.authenticate(adminUser);
    await myPersonalTrainerService.deleteAllUsers();

    for (let i = 0; i < mockUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const { user } = await myPersonalTrainerService.createUser(testUsers[i]);
      mockUsers[i] = user;
    }
  });

  suiteTeardown(async () => {
    await myPersonalTrainerService.deleteAllUsers();
    await myPersonalTrainerService.clearAuth();
  });

  test("User Management - Create User", async () => {
    const { user } = await myPersonalTrainerService.createUser(maggie);
    assertSubset(maggie, user);
    assert.isDefined(user._id);
  });

  test("User Management - Create User - Duplicate Email", async () => {
    const newUser = await myPersonalTrainerService.createUser(maggie);
    const response = await myPersonalTrainerService.createUser(maggie);
    assert.equal(response.status, "fail");
  });

  test("User Management - Get User", async () => {
    const response = await myPersonalTrainerService.getUser(mockUsers[0]._id);
    assert.equal(response.status, "success");
    assert.deepEqual(mockUsers[0].email, response.user.email);
  });

  test("User Management - Get User - Bad Id", async () => {
    const response = await myPersonalTrainerService.getUser("1234");
    const { user } = response;
    assert.isUndefined(user);
    assert.equal(response.status, "fail");
    assert.equal(response.statusCode, 404);
  });

  test("User Management - Get User - Deleted User", async () => {
    await myPersonalTrainerService.deleteAllUsers();
    const response = await myPersonalTrainerService.getUser(mockUsers[0]._id);
    const { user } = response;
    assert.isUndefined(user);
    assert.equal(response.status, "fail");
    assert.equal(response.statusCode, 404);
  });

  test("User Management - Delete User", async () => {
    await myPersonalTrainerService.deleteAllUsers();
    const { user } = await myPersonalTrainerService.createUser(maggie);
    const response = await myPersonalTrainerService.deleteUser(user._id);
    assert.isDefined(response);
    assert.deepEqual(response.status, "success");
    const { users } = await myPersonalTrainerService.getAllUsers();
    assert.deepEqual(users.length, 0);
  });

  test("User Management - Delete All Users", async () => {
    let { users } = await myPersonalTrainerService.getAllUsers();
    assert.equal(users.length, 3);
    await myPersonalTrainerService.deleteAllUsers();
    ({ users } = await myPersonalTrainerService.getAllUsers());
    assert.equal(users.length, 0);
  });
});

import { assert } from "chai";
import { myPersonalTrainerService } from "./mypersonaltrainer-service.js";
import { decodeToken } from "../../src/api/jwt-utils.js";
import { maggie } from "../fixtures.js";

suite("Authentication API tests", async () => {
  setup(async () => {
    myPersonalTrainerService.clearAuth();
    await myPersonalTrainerService.createUser(maggie);
    await myPersonalTrainerService.authenticate(maggie);
    await myPersonalTrainerService.deleteAllUsers();
  });

  test("authenticate", async () => {
    const returnedUser = await myPersonalTrainerService.createUser(maggie);
    const response = await myPersonalTrainerService.authenticate(maggie);
    assert(response.success);
    assert.isDefined(response.token);
  });

  test("verify Token", async () => {
    const returnedUser = await myPersonalTrainerService.createUser(maggie);
    const response = await myPersonalTrainerService.authenticate(maggie);

    const userInfo = decodeToken(response.token);
    assert.equal(userInfo.email, returnedUser.email);
    assert.equal(userInfo.userId, returnedUser._id);
  });

  test("check Unauthorized", async () => {
    myPersonalTrainerService.clearAuth();
    try {
      await myPersonalTrainerService.deleteAllUsers();
      assert.fail("Route not protected");
    } catch (error) {
      assert.equal(error.response.data.statusCode, 401);
    }
  });
});

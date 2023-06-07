import { assert } from "chai";
import { myPersonalTrainerService } from "./mypersonaltrainer-service.js";
import { decodeToken } from "../../src/api/jwt-utils.js";
import { maggie, adminUser } from "../fixtures.js";


suite("Authentication API tests", async () => {
  setup(async () => {
    myPersonalTrainerService.clearAuth();
    await myPersonalTrainerService.authenticate(adminUser)
    await myPersonalTrainerService.deleteAllUsers();
  });

  test("authenticate - Administrator", async () => {
    const response = await myPersonalTrainerService.authenticate(adminUser);
    assert(response.success);
    assert.isDefined(response.token);
  });

  test("authenticate - User", async () => {
    const returnedUser = await myPersonalTrainerService.createUser(maggie);
    const response = await myPersonalTrainerService.authenticate(maggie);
    assert(response.success);
    assert.isDefined(response.token);
  });

  test("verify Token", async () => {
    myPersonalTrainerService.clearAuth();
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

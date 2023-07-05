import { assert } from "chai";
import { myPersonalTrainerService } from "./mypersonaltrainer-service.js";
import { createMockFormData, assertSubset } from "../test-utils.js";
import { maggie, adminUser } from "../fixtures.js";


suite("Profile API tests", async () => {
  setup(async () => {
    await myPersonalTrainerService.clearAuth();
    await myPersonalTrainerService.authenticate(adminUser);
    await myPersonalTrainerService.deleteAllImages();
    await myPersonalTrainerService.deleteAllUsers();
  });

  suiteTeardown(async () => {
    await myPersonalTrainerService.clearAuth();
    await myPersonalTrainerService.authenticate(adminUser);
    await myPersonalTrainerService.deleteAllImages();
    await myPersonalTrainerService.deleteAllUsers();
  });

  test("Profile - Add User Image", async () => {
    const returnedUser = await myPersonalTrainerService.createUser(maggie);
    await myPersonalTrainerService.authenticate(maggie);
    const form = createMockFormData("./public/images/guiness.jpg");
    const response = await myPersonalTrainerService.addUserImage(form);
    assert(response.success);
    assert.isDefined(response.data.path);
  });

  test("Profile - Get All User Images", async () => {
    const returnedUser = await myPersonalTrainerService.createUser(maggie);
    await myPersonalTrainerService.authenticate(maggie);
    const form = createMockFormData("./public/images/guiness.jpg");
    await myPersonalTrainerService.addUserImage(form);
    const response = await myPersonalTrainerService.getUserImages();
    assert.equal(response.length, 1);
  });
});

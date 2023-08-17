import { assert } from "chai";
import { assertSubset, createMockFormData } from "../../test-utils.js";
import { myPersonalTrainerService } from "../mypersonaltrainer-service.js";
import { kiki, maggie, adminUser, testUsers } from "../../fixtures.js";

suite("Trainer API tests", () => {
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

  test("Create Trainer", async () => {
    const newUser = await myPersonalTrainerService.createTrainer(kiki);
    assertSubset(kiki, newUser);
    assert.isDefined(newUser._id);
  });

  test("Management - Assign Client to Trainer", async () => {
    const client = await myPersonalTrainerService.createUser(maggie);
    const trainer = await myPersonalTrainerService.createTrainer(kiki);
    const response = await myPersonalTrainerService.addClientToTrainer(trainer._id, client._id);

    assert.deepEqual(client._id, response[0]);
  });

  test("Management - Assign Multiple Clients to Trainer", async () => {
    const trainer = await myPersonalTrainerService.createTrainer(kiki);

    const newUsers = await Promise.all(testUsers.map(async (user) => myPersonalTrainerService.createUser(user)));
    await Promise.all(newUsers.map(async (user) => myPersonalTrainerService.addClientToTrainer(trainer._id, user._id)));

    const response = await myPersonalTrainerService.getClients(trainer._id);

    newUsers.map((user, index) => {
        assert.deepEqual(newUsers.length, response.length, "Expected the number of new Clients (3) to match the number of new Users (3)")
        return assert.isOk(response.includes(user._id), `Expected to find ${user._id} in response:\t${JSON.stringify(response)}\nError Type`)
    });
  });
});

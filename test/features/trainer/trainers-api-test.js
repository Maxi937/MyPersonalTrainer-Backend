import { assert } from "chai";
import { assertSubset, createMockFormData } from "../../test-utils.js";
import { myPersonalTrainerService } from "../mypersonaltrainer-service.js";
import { kiki, maggie, adminUser, testUsers, testTrainers } from "../../fixtures.js";

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
    const { trainer } = await myPersonalTrainerService.createTrainer(kiki);
    assertSubset(kiki, trainer);
    assert.isDefined(trainer._id);
  });

  test("Delete Trainer", async () => {
    const { trainer } = await myPersonalTrainerService.createTrainer(kiki);
    assertSubset(kiki, trainer);
    assert.isDefined(trainer._id);

    await myPersonalTrainerService.deleteTrainer(trainer._id);
    const { trainers } = await myPersonalTrainerService.getTrainers();

    assert.equal(trainers.length, 0);
  });

  test("Get Trainers", async () => {
    const testTrainerEmails = [];
    for (let i = 0; i < testTrainers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await myPersonalTrainerService.createTrainer(testTrainers[i]);
      testTrainerEmails.push(testTrainers[i].email.toLowerCase());
    }

    const { trainers } = await myPersonalTrainerService.getTrainers();
    assert.isDefined(trainers);
    assert.deepEqual(trainers.length, testTrainers.length, "Expected the number of Trainers (3) to match the number of testTrainers (3)");

    trainers.map((trainer) => assert.isOk(testTrainerEmails.includes(trainer.email), `Expected to find ${trainer.email} in response:\t${JSON.stringify(trainers)}\nError Type`));
  });

  test("Get A Trainer - Id", async () => {
    const response = await myPersonalTrainerService.createTrainer(kiki);
    const id = response.trainer._id
    const { trainer } = await myPersonalTrainerService.getTrainers({ _id: id });
    assert.isDefined(trainer);
    assert.equal(trainer._id, id);
  });

  test("Get A Trainer - Email", async () => {
    await myPersonalTrainerService.createTrainer(kiki);
    const { trainer } = await myPersonalTrainerService.getTrainers({ email: kiki.email });
    assert.isDefined(trainer);
    assert.equal(trainer.email, kiki.email.toLowerCase());
  });

  test("Client Management - Assign Client to Trainer", async () => {
    const client = await myPersonalTrainerService.createUser(maggie);
    const { trainer } = await myPersonalTrainerService.createTrainer(kiki);
    const response = await myPersonalTrainerService.addClientToTrainer(trainer._id, client._id);

    assert.deepEqual(client._id, response[0]);
  });

  test("Client Management - Assign Multiple Clients to Trainer", async () => {
    const { trainer } = await myPersonalTrainerService.createTrainer(kiki);

    const newUsers = await Promise.all(
      testUsers.map(async (newuser) => {
        const { user } = await myPersonalTrainerService.createUser(newuser);
        return user;
      })
    );

    await Promise.all(newUsers.map(async (user) => myPersonalTrainerService.addClientToTrainer(trainer._id, user._id)));

    const {
      trainer: { clients },
    } = await myPersonalTrainerService.getTrainers({ _id: trainer._id });

    assert.deepEqual(newUsers.length, clients.length, "Expected the number of new Clients (3) to match the number of new Users (3)");

    newUsers.map((user) => assert.isOk(clients.includes(user._id), `Expected to find ${user._id} in response:\t${JSON.stringify(clients)}\nError Type`));
  });

  test("Client Management - Assign Client to Trainer - Client does not exist", async () => {
    const { trainer } = await myPersonalTrainerService.createTrainer(kiki);
    const { user } = await myPersonalTrainerService.createUser(maggie);
    const id = user._id;
    await myPersonalTrainerService.deleteUser(id);

    const response = await myPersonalTrainerService.addClientToTrainer(trainer._id, user._id);
    assert.deepEqual(response.status, "fail");

    const {
      trainer: { clients },
    } = await myPersonalTrainerService.getTrainers({ _id: trainer._id });
    assert.deepEqual(clients.length, 0);
  });

  test("Client Management - Remove a Client from a Trainer", async () => {
    const { user } = await myPersonalTrainerService.createUser(maggie);
    const { trainer } = await myPersonalTrainerService.createTrainer(kiki);

    await myPersonalTrainerService.addClientToTrainer(trainer._id, user._id);

    const response = await myPersonalTrainerService.deleteClient(trainer._id, user._id);
    assert.deepEqual(response.status, "success");
    assert.equal(response.trainer.clients.length, 0);
  });
});

import { assert } from "chai";
import { myPersonalTrainerService } from "../mypersonaltrainer-service.js";
import { decodeToken } from "../../../src/utility/jwt-utils.js";
import { maggie, adminUser } from "../../fixtures.js";

suite("Authentication API tests", async () => {
  setup(async () => {
    await myPersonalTrainerService.clearAuth();
    await myPersonalTrainerService.authenticate(adminUser);
    await myPersonalTrainerService.deleteAllUsers();
    await myPersonalTrainerService.clearAuth();
  });

  test("Authentication - Administrator", async () => {
    const response = await myPersonalTrainerService.authenticate(adminUser);
    assert.equal(response.status, "success");
    assert.isDefined(response.token);
  });

  test("Authentication - User", async () => {
    const returnedUser = await myPersonalTrainerService.createUser(maggie);
    const response = await myPersonalTrainerService.authenticate(maggie);
    assert.equal(response.status, "success");
    assert.isDefined(response.token);
  });

  test("Authentication - Verify Token", async () => {
    myPersonalTrainerService.clearAuth();
    const { user } = await myPersonalTrainerService.createUser(maggie);
    const response = await myPersonalTrainerService.authenticate(maggie);

    const userInfo = decodeToken(response.token);
    assert.equal(userInfo.email, user.email);
    assert.equal(userInfo.userId, user._id);
  });

  test("Authentication - Access Route - Unauthorized", async () => {
    await myPersonalTrainerService.clearAuth();
    const response = await myPersonalTrainerService.deleteAllUsers();
    assert.equal(response.status, "fail")
  });
});

// TODO: Add test to check that JWT is on the right routes - in some manner
/*
Example code for gettings the jwt routes from the server.

Requires the server object - originally ran in the preResponse extension  in serverutils.

There is a guide on Hapi for adding init() and start() functions to the server instead automatically starting
it open for HTTP requests. I am thinking the server should be setup this way and the tests should initialise
server in this manner:
  - Means seperate process for the server does not have to be started locally.
  - Means I can access the server object and run the below from test suite.


    const {routes} = server._core.router
    const jwtRoutes = []

    routes.forEach((map, method) => {
      map.routes.forEach((route) => {
        if (route.route.public.settings.auth) {
          const authstrategies = route.route.public.settings.auth.strategies
          jwtRoutes.push({
            "method": method,
            "route": route.path,
            "strategy": authstrategies[0]
          })
        }
      })
    })

    console.log(jwtRoutes)
  */

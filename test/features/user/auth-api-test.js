import { assert } from "chai";
import { myPersonalTrainerService } from "../mypersonaltrainer-service.js";
import { decodeToken } from "../../../src/utility/jwt-utils.js";
import { maggie, adminUser } from "../../fixtures.js";


suite("Authentication API tests", async () => {
  setup(async () => {
    await myPersonalTrainerService.clearAuth();
    await myPersonalTrainerService.authenticate(adminUser)
    await myPersonalTrainerService.deleteAllUsers();
    await myPersonalTrainerService.clearAuth();
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
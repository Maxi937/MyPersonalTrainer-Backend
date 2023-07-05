import { assert } from "chai";
import { myPersonalTrainerService } from "./mypersonaltrainer-service.js";
import { createMockFormData , assertSubset } from "../test-utils.js";
import { maggie, adminUser } from "../fixtures.js";

suite("Photo API tests", async () => {
  setup(async () => {
    await myPersonalTrainerService.deleteAllImages();
  });

  suiteTeardown(async () => {
    await myPersonalTrainerService.deleteAllImages();
  });

  test("Upload - Local File", async () => {
    const form = createMockFormData("./public/images/guiness.jpg")
    const response = await myPersonalTrainerService.addLocalImage(form);
    assert(response.success);
    assert.isDefined(response.data.path);
  });
});


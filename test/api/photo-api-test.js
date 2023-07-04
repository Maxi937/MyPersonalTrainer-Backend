import { assert } from "chai";
import fs from "fs"
import path from "path"
import { myPersonalTrainerService } from "./mypersonaltrainer-service.js";
import { assertSubset } from "../test-utils.js";



suite("Photo API tests", async () => {
  setup(async () => {

  });

  test("Upload - Local File", async () => {
    const filePath = "./public/images/guiness.jpg"
    const fileName = path.basename(filePath)
    const fileData = fs.readFileSync("./public/images/guiness.jpg");
    const byteArray = new Uint8Array(fileData);
    const file = new File([byteArray], fileName, { type: "image/jpg" });

    const response = await myPersonalTrainerService.addImage(file);
    console.log(response)
    assert(response.success);
  });
});

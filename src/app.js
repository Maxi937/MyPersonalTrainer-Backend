import * as dotenv from "dotenv";
import fs from "fs";
import { start } from "./server.js";
import { createlogger } from "./utility/logger.js";
import { createAdmin } from "./utility/serverutils.js";
import SupabaseStorage from "./models/supabase/supabaseStorage.js";

const logger = createlogger();

// Load Config File
const enviroment = process.env.NODE_ENV;

function loadconfig() {
  let config = "";

  switch (enviroment) {
    case "production":
      config = dotenv.config({ path: "production.env" });
      break;
    case "devprod":
      config = dotenv.config({ path: "./config/production.env" });
      break;
    default:
      config = dotenv.config({ path: "./config/dev.env" });
  }

  if (config.error || config === "") {
    console.log("Config Error");
    process.exit(1);
  }
}

async function startApp() {
  logger.notice("Initilising Server");
  const server = await start();
  await createAdmin();
}

// startApp()
loadconfig();
// startApp()


async function testUpload() {
  const bucketName = "testBucket"
  const fileData = fs.readFileSync("./public/images/guiness.jpg");
  const byteArray = new Uint8Array(fileData);
  const blob = new Blob([byteArray], { type: "image/jpg" });

  const supabase = new SupabaseStorage();
  supabase.createBucket(bucketName);
  supabase.uploadFileToBucket(blob, bucketName, "public", "test.jpg");
}

async function testBucket() {
  const bucketName = "testBucket"
  const supabase = new SupabaseStorage();
  const bucket = await supabase.getBucket(bucketName);

  let files = await bucket.getFiles("public")
  console.log(files)

  bucket.emptyBucket()
  files = await bucket.getFiles("public")
  console.log(files)
}

// testUpload()
// testBucket()

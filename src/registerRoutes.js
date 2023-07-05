import fs from "fs";
import path from "path";
import { testApi } from "./features/testroutes/test-api.js";


export function getImportList() {
  const importList = [];
  const featuresPath = "./src/features";
  const features = fs.readdirSync(featuresPath);

  features.forEach((feature) => {
    const files = fs.readdirSync(path.join(featuresPath, feature));
    files.forEach((file) => {
      const filePath = path.join("features", feature, file);
      importList.push(`./${filePath}`);
    });
  });
  return importList;
}

function importFeatures() {
  const routesList = []
  const importList = getImportList();

  importList.forEach(async (im) => {
    const i = await import(im);
    if (i.default) {
      if (i.default.name === "Routes") {
        routesList.push(i.default());
      }
    }
  });
  return routesList
}

export async function registerRoutes() {
  const featureRoutes = importFeatures();
  const routes = [];
  Object.keys(testApi).forEach((key) => routes.push(testApi[key]));
  return routes;
}



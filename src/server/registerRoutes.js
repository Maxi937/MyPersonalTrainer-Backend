import fs from "fs";
import path from "path";
import _ from "lodash";

// Each Feature is imported if its in the "features" folder. 
// The default export of each Feature is an array of Objects with one key.
// The route is the value of this object key.
// Each route is parsed for the Method, Path and the rest of the properties are put into an "options" object for Hapi's server.route() function

export function getImportList() {
  const importList = [];
  const featuresPath = "./src/features";
  const features = fs.readdirSync(featuresPath);

  features.forEach((feature) => {
    const files = fs.readdirSync(path.join(featuresPath, feature));
    files.forEach((file) => {
      const filePath = path.join("features", feature, file);
      importList.push(`../${filePath}`);
    });
  });
  return importList;
}

async function importFeatures() {
  const routesList = [];
  const importList = getImportList();

  // eslint-disable-next-line no-restricted-syntax
  for (const im of importList) {
    // eslint-disable-next-line no-await-in-loop
    const i = await import(im);
    if (i.default) {
      routesList.push(i.default);
    }
  }
  return routesList;
}

function parseRoutes(routes) {
  const routeArray = [];
  routes.forEach((r) => {
    Object.keys(r).forEach((key) => {
      const result = {
        method: r[key].method,
        path: r[key].path,
        options: _.omit(r[key], ["method", "path"]),
      };
      routeArray.push(result);
    });
  });
  return routeArray;
}

export async function registerRoutes() {
  getImportList()
  const featureRoutes = await importFeatures();
  const routes = parseRoutes(featureRoutes);
  return routes;
}

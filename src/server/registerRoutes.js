import fs, { fstat } from "fs";
import path from "path";
import _ from "lodash";

// Each Feature is imported if its in the "features" folder.
// The default export of each Feature is an array of Objects with one key.
// The route is the value of this object key.
// Each route is parsed for the Method, Path and the rest of the properties are put into an "options" object for Hapi's server.route() function

/**
 * Builds an array of file paths in a directory and any sub-directories.
 * @param {string} directoryPath - The Absolute Path to a Directory.
 */
function traceFilePaths(directoryPath) {
  const files = fs.readdirSync(directoryPath);
  const filePaths = [];

  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);

    if (fs.lstatSync(filePath).isDirectory()) {
      filePaths.push(...traceFilePaths(path.resolve(filePath)));
    } else {
      filePaths.push(filePath);
    }
  });
  return filePaths;
}

/**
 * Parses each given filepath for a default export - which will be an object containing each route & rearranges the properties to be Hapi compatible
 * @param {Array<string>} importList - A list of filepaths to parse.
 * @returns {Array<object>} A list of route objects compatible with Hapi.
 */
async function getRoutes(importList) {
  const routesList = [];

  await Promise.all(
    importList.map(async (im) => {
      const i = await import(im);
      if (i.default) {
        Object.keys(i.default).forEach((key) => {
          const result = {
            method: i.default[key].method,
            path: i.default[key].path,
            options: _.omit(i.default[key], ["method", "path"]),
          };
          routesList.push(result);
        });
      }
    })
  );
  return routesList;
}

export async function registerRoutes() {
  const featuresPath = "./src/features";
  const features = fs.readdirSync(featuresPath);
  const importList = [];

  features.forEach((feature) => {
    importList.push(...traceFilePaths(path.resolve(featuresPath, feature)));
  });

  const featureRoutes = getRoutes(importList);
  return featureRoutes;
}

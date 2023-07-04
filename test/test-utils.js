import winston, { format } from "winston";
import path from "path"
import fs from "fs"
import {Blob} from "buffer";

export function createMockFormData(pathToALocalFile) {
  const filePath = pathToALocalFile;
  const fileName = path.basename(filePath);
  const fileData = fs.readFileSync("./public/images/guiness.jpg");
  const byteArray = new Uint8Array(fileData);
  const blob = new Blob([byteArray], { type: "image/jpg" });
  const form = new FormData();
  form.append("photouploadform", blob, fileName);
  return form
}

export function assertSubset(subset, superset) {
  if (typeof superset !== "object" || superset === null || typeof subset !== "object" || subset === null) return false;

  if (superset instanceof Date || subset instanceof Date) return superset.valueOf() === subset.valueOf();

  return Object.keys(subset).every((key) => {
    // eslint-disable-next-line no-prototype-builtins
    if (!superset.propertyIsEnumerable(key)) return false;
    const subsetItem = subset[key];
    const supersetItem = superset[key];
    if (typeof subsetItem === "object" && subsetItem !== null ? !assertSubset(supersetItem, subsetItem) : supersetItem !== subsetItem) return false;

    return true;
  });
}

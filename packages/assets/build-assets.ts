import { createComponentInfoObjects } from "../doenetml-worker/src/utils/componentInfoObjects";
import { getSchema } from "./src/schema";
import * as fs from "fs";

let componentInfoObjects = createComponentInfoObjects();
fs.writeFileSync(
    "assets/componentInfoObjects.json",
    JSON.stringify(componentInfoObjects),
);

console.log(componentInfoObjects, JSON.stringify(componentInfoObjects));

let elements = getSchema(componentInfoObjects);
fs.writeFileSync("assets/doenetSchema.json", JSON.stringify(elements));

import * as fs from "node:fs/promises";
import { getSchema, reportHelpCoverage } from "./get-schema";

const destUrl = new URL("../src/generated/doenet-schema.json", import.meta.url);

const schema = getSchema();
reportHelpCoverage(schema.elements);
console.log(
    "Writing",
    Object.keys(schema.elements).length,
    "schema items to",
    destUrl.pathname,
);
await fs.writeFile(destUrl.pathname, JSON.stringify(schema, null, 4));

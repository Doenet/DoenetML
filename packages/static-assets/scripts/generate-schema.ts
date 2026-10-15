import * as fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { getSchema } from "./get-schema";

const destUrl = new URL("../src/generated/doenet-schema.json", import.meta.url);

const schema = getSchema();
console.log(
    "Writing",
    schema.elements.length,
    "schema items to",
    fileURLToPath(destUrl),
);
await fs.writeFile(destUrl, JSON.stringify(schema, null, 4) + "\n");

import * as fs from "node:fs/promises";
import { getSchema } from "./get-schema";

const destUrl = new URL("../dist/doenet-schema.json", import.meta.url);

const schema = getSchema();
console.log(
    "Writing",
    Object.keys(schema.elements).length,
    "schema items to",
    destUrl.pathname,
);
await fs.writeFile(destUrl.pathname, JSON.stringify(schema, null, 4));

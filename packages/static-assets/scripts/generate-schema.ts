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

// Each tag's attribute names alone, aliases included, for the parser's
// correction of an attribute written in another case (D51,
// `attribute-name-case.ts` in `@doenet/parser`). It runs in the viewer's
// main thread, where the whole schema (descriptions and all) would add
// hundreds of kB to the bundle every embed loads. Each name is stored once,
// and each tag lists indices into the names.
const attributeNamesUrl = new URL(
    "../src/generated/attribute-names.json",
    import.meta.url,
);
const tagEntries: [string, string[]][] = [
    ...schema.elements.map(
        (element) =>
            [element.name, element.attributes.map((attr) => attr.name)] as [
                string,
                string[],
            ],
    ),
    ...Object.entries(schema.aliasedElements ?? {}).map(
        ([alias, element]) =>
            [alias, element.attributes.map((attr) => attr.name)] as [
                string,
                string[],
            ],
    ),
];
const attributeNames: string[] = [];
const indexOfName = new Map<string, number>();
const tags: Record<string, number[]> = {};
for (const [tag, names] of tagEntries) {
    tags[tag] = names.map((name) => {
        let index = indexOfName.get(name);
        if (index === undefined) {
            index = attributeNames.length;
            attributeNames.push(name);
            indexOfName.set(name, index);
        }
        return index;
    });
}
await fs.writeFile(
    attributeNamesUrl,
    JSON.stringify({ names: attributeNames, tags }) + "\n",
);

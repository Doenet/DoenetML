import * as fs from "node:fs/promises";
import { getSchema } from "./get-schema";
import type {
    RelaxNgAttribute,
    SchemaProperty,
    RelaxNgSchema,
} from "../src/index";

type GeneratedSchema = {
    elements: {
        name: string;
        children: string[];
        attributes: { name: string; values?: string[] }[];
        properties: SchemaProperty[];
        top: boolean;
        acceptsStringChildren: boolean;
    }[];
};

const destUrl = new URL(
    "../src/generated/doenet-relaxng-schema.json",
    import.meta.url,
);

const schema = getSchema() as GeneratedSchema;
const relaxngSchema = schemaToRelaxNgSchema(schema);

console.log(
    "Writing",
    Object.keys(relaxngSchema.refs).length,
    "relaxng schema items to",
    destUrl.pathname,
);
await fs.writeFile(destUrl.pathname, JSON.stringify(relaxngSchema, null, 4));

/**
 * Convert a schema that has been dumped by `getSchema` to a RelaxNG-style schema.
 */
function schemaToRelaxNgSchema(schema: GeneratedSchema): RelaxNgSchema {
    // Every doenet tag name is unique so we can use the element names themselves as the keys.
    const startType = schema.elements
        .filter((element) => element.top)
        .map((element) => element.name);
    const refs = Object.fromEntries(
        schema.elements.map((item) => [
            item.name,
            {
                type: "element",
                name: item.name,
                attributes: Object.fromEntries(
                    item.attributes.map(({ name, values }) => [
                        name,
                        { optional: true, type: values ?? ["string"] },
                    ]),
                ),
                children: item.children.map((child) => ({ ref: child })),
                textChildrenAllowed: item.acceptsStringChildren,
                properties: item.properties,
            } satisfies RelaxNgAttribute,
        ]),
    );

    return {
        startType,
        refs,
    };
}

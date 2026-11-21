import { Plugin } from "unified";
import { doenetSchema } from "@doenet/static-assets/schema";
import type { DastAttribute, DastElement, DastError, DastRoot } from "../types";
import { visitIncludingPathIndices } from "../pretty-printer/normalize/utils/visit";
import { isDastElement } from "../types-util";
import { codedDastError } from "../coded-dast-error";

/**
 * Attribute names are case-sensitive (NAME-0, D51), but for one release an
 * attribute written in another case than its component's (`<graph xmin>` for
 * `xMin`, `SIMPLIFY`, `Extend`, `Name`) is still applied: it is renamed to the
 * component's spelling here, with a warning that it will be an error
 * (`doenet-w0197`). This is the migration D51 allows. The scan for wrong-case
 * names found `xmin`, `xmax`, `ymin` and `ymax` on most of the documentation's
 * graphs, so authors have copied them widely.
 *
 * It runs first among the plugins that read attributes, so that everything
 * after it matches attribute names exactly: the checks of names
 * (`enforce-valid-names.ts`), the sugar, the reference resolver (`name`,
 * `extend`, `copy`, `copyWithState`, a repeat's `for`, `valueName` and
 * `indexName`) and the JavaScript core. It knows only what the schema lists:
 * an attribute the schema hides (`<subsetOfRealsInput xmin>`), and any
 * attribute of a tag it hides (`<h Hide>`), is renamed, with the same warning,
 * by the JavaScript core (`correctAttributeNameCase` in
 * `convertNormalizedDast.ts`), before it reads attributes; there, `name`,
 * `extend`, `copy` and `copyWithState` are not, as the resolver has read them
 * already. Making it an error in a later release is a change in these two
 * places: without the rename, the attribute is one the component doesn't
 * have (`doenet-e0004`, which suggests the spelling).
 *
 * An attribute is the component's when the schema lists it, or it is one every
 * tag takes (`extend`, `copy`, `copyWithState`), or, on a tag written with one
 * of those, one of the copy's own (`asList`, `removeEmptyArrayEntries`). A tag
 * that is not a component type as written (an error, `doenet-e0002`) and a
 * namespaced attribute (`xmlns:…`) are left alone. On a `<module>`, only its
 * own attributes are corrected (`Copy`, `Name`, `Hide`): one its definition
 * declares (`<moduleAttributes>`) is not in the schema, so it is left as
 * written, and a declared one that differs only in case from the module's own
 * is not used as one anyway (`doenet-w0075`). An attribute also written in the
 * component's spelling (`xMin="1" xmin="2"`) is left as written, an unknown
 * attribute, as a misspelling is.
 */
export const pluginCorrectAttributeNameCase: Plugin<
    [],
    DastRoot,
    DastRoot
> = () => {
    return (tree) => {
        const warnings: DastError[] = [];

        visitIncludingPathIndices(tree, (node) => {
            if (!isDastElement(node)) {
                return;
            }
            correctAttributes(node, warnings);
        });

        if (warnings.length > 0) {
            const documentElement = tree.children.find(
                (child): child is DastElement =>
                    isDastElement(child) && child.name === "document",
            );
            if (documentElement) {
                documentElement.children.push(...warnings);
            }
        }
    };
};

/** Attributes every tag takes, which no component declares. */
const ATTRIBUTES_OF_EVERY_TAG = ["extend", "copy", "copyWithState"];

/** The attributes of the copy a tag with `extend` or `copy` is made into. */
const ATTRIBUTES_OF_A_COPY = ["asList", "removeEmptyArrayEntries"];

type SchemaElementLike = { name: string; attributes: { name: string }[] };

let attributesByTag: Map<string, string[]> | undefined;

/** The attributes the schema lists for each tag, aliases included. */
function attributesOf(tag: string): string[] | undefined {
    if (!attributesByTag) {
        attributesByTag = new Map();
        const elements = doenetSchema.elements as readonly SchemaElementLike[];
        for (const element of elements) {
            attributesByTag.set(
                element.name,
                element.attributes.map((attr) => attr.name),
            );
        }
        const aliased = (doenetSchema.aliasedElements ?? {}) as Record<
            string,
            SchemaElementLike
        >;
        for (const [alias, element] of Object.entries(aliased)) {
            attributesByTag.set(
                alias,
                element.attributes.map((attr) => attr.name),
            );
        }
    }
    return attributesByTag.get(tag);
}

function correctAttributes(node: DastElement, warnings: DastError[]) {
    const declared = attributesOf(node.name);
    if (!declared) {
        return;
    }
    const written = Object.keys(node.attributes);
    const madeFromAnother = ATTRIBUTES_OF_EVERY_TAG.some((name) =>
        written.some((w) => w.toLowerCase() === name.toLowerCase()),
    );
    const known = [
        ...declared,
        ...ATTRIBUTES_OF_EVERY_TAG,
        ...(madeFromAnother ? ATTRIBUTES_OF_A_COPY : []),
    ];
    const knownSet = new Set(known);
    const byLowerCase = new Map<string, string | null>();
    for (const name of known) {
        const lower = name.toLowerCase();
        const existing = byLowerCase.get(lower);
        // Two that differ only in case match neither.
        byLowerCase.set(
            lower,
            existing === undefined || existing === name ? name : null,
        );
    }

    const present = new Set(written);
    let renamed = false;
    const newAttributes: Record<string, DastAttribute> = {};
    for (const name of written) {
        const attribute = node.attributes[name];
        const corrected =
            knownSet.has(name) || name.includes(":")
                ? undefined
                : byLowerCase.get(name.toLowerCase());
        if (!corrected || present.has(corrected)) {
            newAttributes[name] = attribute;
            continue;
        }
        present.add(corrected);
        renamed = true;
        newAttributes[corrected] = { ...attribute, name: corrected };
        warnings.push(
            codedDastError({
                code: "doenet-w0197",
                message: `Attribute names are case-sensitive: write \`${corrected}\`, not \`${name}\`, on a \`<${node.name}>\`. It is applied for now, but will be an error in a later release.`,
                args: {
                    attribute: name,
                    suggestion: corrected,
                    componentType: node.name,
                },
                error_type: "warning",
                position: attribute.position ?? node.position,
                source_doc: attribute.source_doc ?? node.source_doc,
            }),
        );
    }
    if (renamed) {
        node.attributes = newAttributes;
    }
}

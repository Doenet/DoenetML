import { Plugin } from "unified";
// Each tag's attribute names only: the whole schema would add hundreds of kB
// to the viewer's eagerly loaded bundle, where this runs.
import { attributeNamesOfTag } from "@doenet/static-assets/attribute-names";
import type { DastAttribute, DastElement, DastError, DastRoot } from "../types";
import { visitIncludingPathIndices } from "../pretty-printer/normalize/utils/visit";
import { isDastElement } from "../types-util";
import { codedDastError } from "../coded-dast-error";
import {
    ATTRIBUTES_OF_A_COPY,
    ATTRIBUTES_OF_EVERY_TAG,
    attributeNameCaseCorrections,
} from "../attribute-name-case";

/**
 * Attribute names are case-sensitive (NAME-0, D51), but for one release an
 * attribute written in another case than its component's (`<graph xmin>` for
 * `xMin`, `SIMPLIFY`, `Extend`, `Name`) is still applied: it is renamed to the
 * component's spelling here, with a warning that it will be an error
 * (`doenet-w0197`). This is the migration D51 allows. The scan for wrong-case
 * names found `xmin`, `xmax`, `ymin` and `ymax` on every one of the
 * documentation's graphs that set its extents, so authors have copied them
 * widely.
 *
 * It runs first among the plugins that read attributes, so that everything
 * after it matches attribute names exactly: the checks of names
 * (`enforce-valid-names.ts`), the sugar, the reference resolver (`name`,
 * `extend`, `copy`, `copyWithState`, a repeat's `for`, `valueName` and
 * `indexName`) and the JavaScript core. It knows only what the schema lists,
 * so on a tag the schema doesn't list (`<h>`, `<panel>`, `<embed>`) it
 * corrects only `name`, `extend`, `copy` and `copyWithState`, which every tag
 * has and the resolver reads; any other attribute the schema hides
 * (`<subsetOfRealsInput xmin>`, `<h Hide>`) is renamed, with the same warning,
 * by the JavaScript core (`correctAttributeNameCase` in
 * `convertNormalizedDast.ts`), before it reads attributes. Not knowing which
 * unlisted tags are component types, it corrects those four on any tag; on
 * one that is not (`<foo Extend="$m"/>`, an error, `doenet-e0002`), the core
 * drops the warning, as nothing is applied. Making it an error in a later
 * release is a change in these two places: without the rename, the attribute
 * is one the component doesn't have (`doenet-e0004`, which suggests the
 * spelling).
 *
 * On a tag the schema lists, an attribute is the component's when the schema
 * lists it, or it is one every tag takes (`extend`, `copy`, `copyWithState`),
 * or, on a tag written with one of those, one of the copy's own (`asList`,
 * `removeEmptyArrayEntries`). A namespaced attribute (`xmlns:…`) is left
 * alone. On a `<module>`, only its
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

/** The attributes the schema lists for a tag, aliases included. */
function attributesOf(tag: string): string[] | undefined {
    return attributeNamesOfTag(tag);
}

/**
 * The component type of `node` as the core reads it: a `<division>`'s is its
 * `type` (`getComponentType` in the core's `convertNormalizedDast.ts`). So
 * `<division type="section">` is corrected as a `<section>`, and its warning
 * is kept by the core, which drops one on a tag that is no component type.
 */
function componentTypeOf(node: DastElement): string {
    const type = node.attributes.type?.children;
    if (
        node.name === "division" &&
        type?.length === 1 &&
        type[0].type === "text"
    ) {
        return type[0].value;
    }
    return node.name;
}

/**
 * Give each attribute of `node` written in another case than its
 * component's the component's spelling, pushing a `doenet-w0197` warning
 * for each onto `warnings`. Also run on an external reference's element
 * and the element it is merged into (`expand-external-references.ts`),
 * before their attributes are merged, which happens before this plugin runs.
 */
export function correctAttributes(node: DastElement, warnings: DastError[]) {
    const componentType = componentTypeOf(node);
    const declared = attributesOf(componentType);
    const written = Object.keys(node.attributes);
    const madeFromAnother = ATTRIBUTES_OF_EVERY_TAG.some((name) =>
        written.some((w) => w.toLowerCase() === name.toLowerCase()),
    );
    // On a tag the schema doesn't list, only the attributes every tag has,
    // which the resolver reads before the core could correct them.
    const known = declared
        ? [
              ...declared,
              ...ATTRIBUTES_OF_EVERY_TAG,
              ...(madeFromAnother ? ATTRIBUTES_OF_A_COPY : []),
          ]
        : ["name", ...ATTRIBUTES_OF_EVERY_TAG];
    const corrections = new Map(
        attributeNameCaseCorrections({ written, known }).map(
            ({ written, corrected }) => [written, corrected],
        ),
    );
    if (corrections.size === 0) {
        return;
    }
    const newAttributes: Record<string, DastAttribute> = {};
    for (const name of written) {
        const attribute = node.attributes[name];
        const corrected = corrections.get(name);
        if (corrected === undefined) {
            newAttributes[name] = attribute;
            continue;
        }
        newAttributes[corrected] = { ...attribute, name: corrected };
        warnings.push(
            codedDastError({
                code: "doenet-w0197",
                message: `Attribute names are case-sensitive: write \`${corrected}\`, not \`${name}\`, on a \`<${componentType}>\`. It is applied for now, but will be an error in a later release.`,
                args: {
                    attribute: name,
                    suggestion: corrected,
                    componentType,
                },
                error_type: "warning",
                position: attribute.position ?? node.position,
                source_doc: attribute.source_doc ?? node.source_doc,
            }),
        );
    }
    node.attributes = newAttributes;
}

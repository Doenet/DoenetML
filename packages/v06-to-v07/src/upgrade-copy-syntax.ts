import { Plugin, unified } from "unified";
import {
    DastAttribute,
    DastElement,
    DastElementContent,
    DastMacro,
    DastMacroPathPart,
    DastRoot,
    DastRootContent,
    EXIT,
    isDastElement,
    toXml,
    visit,
} from "@doenet/parser";
import { renameAttrInPlace } from "./rename-attr-in-place";
import { reparseAttribute } from "./reparse-attribute";
import { createCoreForLookup } from "./core-info/core";
import { determinePropType } from "./core-info/determine-prop-type";

/**
 * Upgrade the type-less `<copy>` tag to have the same type as its referent.
 * ```xml
 *    <math name="m">5</math><copy source="m" name="k" />
 * ```
 * becomes
 * ```xml
 *   <math name="m">5</math><math extend="$m" name="k" />
 * ```
 */
export const upgradeCopySyntax: Plugin<[], DastRoot, DastRoot> = () => {
    return async (tree, file) => {
        // Shortcut if `copy` does not appear at all
        let skip = true;
        visit(tree, (node) => {
            if (!isDastElement(node)) {
                return;
            }
            if (node.name === "copy") {
                skip = false;
                // We can stop visiting, we found what we need
                return EXIT;
            }
        });
        if (skip) {
            // No `copy` elements, nothing to do
            return;
        }

        const core = await createCoreForLookup({ dast: tree });

        let referenced: {
            node: DastElement;
            referentType: Promise<string>;
            referentName: string;
        }[] = [];

        visit(tree, (node) => {
            if (!isDastElement(node) || node.name !== "copy") {
                return;
            }
            let referentName = toXml(node.attributes["source"]?.children);
            if (!referentName) {
                // No source, nothing to do
                return;
            }
            // There may be a `prop` attribute which specifies which prop from `source` to copy.
            // In the new syntax, this is always accessed with a `.<prop name>` suffix.
            if (node.attributes["prop"]) {
                const propName = toXml(node.attributes["prop"].children).trim();
                if (propName) {
                    referentName += `.${propName}`;
                }
                // Remove the `prop` attribute, as it is no longer needed
                delete node.attributes["prop"];
            }

            // If there is an `assignNames` attribute and no `name` attribute,
            // then `assignNames` becomes `name`.
            if (node.attributes["assignNames"]) {
                if (node.attributes["name"]) {
                    file.message(
                        `The <copy> tag with source="${referentName}" has both "name" and "assignNames" attributes. "name" will be ignored.`,
                        node.position?.start,
                    );
                    delete node.attributes["name"];
                }
                renameAttrInPlace(node, "assignNames", "name");
            }

            referenced.push({
                node,
                referentType: findReferentType(core, referentName),
                referentName,
            });
        });

        // Go through everything we've found and match the references up to their referent type
        for (let {
            node,
            referentType: referentPromise,
            referentName,
        } of referenced) {
            try {
                const referentType = await referentPromise;

                const targetTag =
                    toXml(
                        node.attributes["link"]?.children || [],
                    ).toLowerCase() === "false"
                        ? "copy"
                        : "extend";
                // If there is a `link` attribute, delete it as it is no longer needed
                if (node.attributes["link"]) {
                    delete node.attributes["link"];
                }

                // Rename the `copy` tag to the same type as the referent
                renameAttrInPlace(node, "source", targetTag);
                // Make sure that the `extend` attribute is prefixed with `$`
                if (!referentName.startsWith("$")) {
                    referentName = `$${referentName}`;
                }
                node.attributes[targetTag].children =
                    reparseAttribute(referentName);
                node.name = referentType;
            } catch (e) {
                file.message(
                    `Could not resolve referent type for <copy> tag with source="${referentName}": ${e}`,
                    node.position?.start,
                );
                continue;
            }
        }
    };
};

/**
 * Find the type of the referent for a given path.
 * This function rejects the promise if the referent type cannot be determined.
 */
async function findReferentType(
    core: Awaited<ReturnType<typeof createCoreForLookup>>,
    referentName: string,
): Promise<string> {
    // We need to parse `referentName` as a macro so we can pick apart its path.
    if (!referentName.startsWith("$")) {
        referentName = `$${referentName}`;
    }
    const reparsed = reparseAttribute(referentName);
    const path = reparsed[0]?.type === "macro" ? reparsed[0].path : null;
    if (!path) {
        throw new Error(`Could not parse referent name "${referentName}"`);
    }

    // We search from the longest path to the shortest path
    // looking for something that matches.
    let unresolvedIndex: DastMacroPathPart["index"] = [];
    let unresolvedProps: DastMacroPathPart[] = [];
    let referentType: string | undefined = undefined;
    for (let i = path.length; i > 0; i--) {
        const pathParts = path.slice(0, i);
        const pathStr = printPathWithoutIndices(pathParts);
        const referentIdx = await core.resolvePathToNodeIdx(pathStr);
        if (referentIdx !== -1) {
            referentType =
                core.core.core?.components?.[referentIdx]?.componentType;
            if (referentType) {
                unresolvedIndex = pathParts[pathParts.length - 1].index;
                unresolvedProps = path.slice(i);
                break;
            }
        }
    }

    if (unresolvedIndex.length !== 0) {
        // We access an index, but we don't know how to handle this case
        throw new Error(
            `Could not resolve referent type for "${referentName}" because it has unresolved indices.`,
        );
    }
    // Now we delve into the properties, one by one.
    for (const part of unresolvedProps) {
        const nIndices = part.index.length;
        if (!referentType) {
            // We could not find a referent type, so we throw an error.
            throw new Error(
                `Could not find referent type for "${referentName}"`,
            );
        }
        referentType = determinePropType(referentType, part.name, nIndices);
    }

    if (referentType) {
        return referentType;
    }

    throw new Error(`Could not find referent type for "${referentName}"`);
}

/**
 * Print a sequence of path parts, but don't include any indices.
 * E.g. `$foo.bar[3][4][baz]` becomes `$foo.bar.baz`.
 */
function printPathWithoutIndices(pathParts: DastMacroPathPart[]): string {
    return pathParts
        .map((part) => {
            return part.name;
        })
        .join(".");
}

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
import { VFile } from "vfile";
import { renameAttrInPlace } from "./rename-attr-in-place";
import { reparseAttribute } from "./reparse-attribute";
import { parseReferencePath } from "./assign-names/apply-renames";
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

        let core: Awaited<ReturnType<typeof createCoreForLookup>>;
        try {
            core = await createCoreForLookup({ dast: tree });
        } catch (e) {
            // Resolving `<copy>` means loading the document for real, which fails on a
            // document that is already broken (a circular reference, say). Everything
            // else about the conversion is still worth keeping, so report it and leave
            // the `<copy>` tags for the author rather than losing the whole document.
            file.message(
                `Could not load the document to work out what the <copy> tags refer to, so they were left as they are: ${e}`,
                {
                    ruleId: "copy/could-not-load-document",
                    source: "v06-to-v07",
                },
            );
            return;
        }
        try {
            await resolveCopyTags(core, tree, file);
        } finally {
            await core.dispose();
        }
    };
};

/**
 * Rename every `<copy source="...">` to the component type of its referent.
 */
async function resolveCopyTags(
    core: Awaited<ReturnType<typeof createCoreForLookup>>,
    tree: DastRoot,
    file: VFile,
) {
    const referenced: {
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

        // `assignNames` has already become a `name` in `upgradeCopyElements`, which runs
        // early enough to register the renames this pass would be too late for.

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
                toXml(node.attributes["link"]?.children || []).toLowerCase() ===
                "false"
                    ? "copy"
                    : "extend";
            // If there is a `link` attribute, delete it as it is no longer needed
            if (node.attributes["link"]) {
                delete node.attributes["link"];
            }

            // Rename the `copy` tag to the same type as the referent
            renameAttrInPlace(node, "source", targetTag);
            // Build the reference from its parsed path rather than from the string, so
            // that a name needing `$(...)` — a hyphenated one — is printed that way.
            const bareName = referentName.startsWith("$")
                ? referentName.slice(1)
                : referentName;
            node.attributes[targetTag].children = [
                {
                    type: "macro",
                    path: parseReferencePath(bareName),
                    attributes: {},
                },
            ];
            node.name = referentType;
        } catch (e) {
            file.message(
                `Could not resolve referent type for <copy> tag with source="${referentName}": ${e}`,
                node.position?.start,
            );
            continue;
        }
    }
}

/**
 * Find the type of the referent for a given path.
 * This function rejects the promise if the referent type cannot be determined.
 */
async function findReferentType(
    core: Awaited<ReturnType<typeof createCoreForLookup>>,
    referentName: string,
): Promise<string> {
    // We need to parse `referentName` as a macro so we can pick apart its path. A
    // hyphenated name only parses inside `$(...)`, which `parseReferencePath` handles.
    const bare = referentName.startsWith("$")
        ? referentName.slice(1)
        : referentName;
    let path: DastMacroPathPart[];
    try {
        path = parseReferencePath(bare);
    } catch (e) {
        throw new Error(`Could not parse referent name "${referentName}"`);
    }

    // We search from the longest path to the shortest path
    // looking for something that matches.
    let unresolvedIndex: DastMacroPathPart["index"] = [];
    let unresolvedProps: DastMacroPathPart[] = [];
    let referentType: string | undefined = undefined;
    search: for (let i = path.length; i > 0; i--) {
        const pathParts = path.slice(0, i);
        // Try the path with its indices first. `$s[1]` names one replacement of the
        // composite `s`, and that replacement's type is the one we want; without the
        // index we would only learn that `s` is a `<select>`. (Indices whose value is
        // itself a macro cannot be resolved statically, so those fall through to the
        // index-less attempt, which then reports them as unresolved.)
        for (const keepIndices of [true, false]) {
            if (keepIndices && !hasOnlyLiteralIndices(pathParts)) {
                continue;
            }
            const pathStr = keepIndices
                ? printPath(pathParts)
                : printPathWithoutIndices(pathParts);
            const referentIdx = await core.resolvePathToNodeIdx(pathStr);
            if (referentIdx === -1) {
                continue;
            }
            const foundType =
                core.core.core?.components?.[referentIdx]?.componentType;
            // A leading underscore marks a component the author cannot write — `_error`
            // above all, which is what a referent inside a broken part of the document
            // resolves to. Emitting it as an element name would be worse than leaving
            // the `<copy>` for a human.
            if (!foundType || foundType.startsWith("_")) {
                continue;
            }
            referentType = foundType;
            unresolvedIndex = keepIndices
                ? []
                : pathParts[pathParts.length - 1].index;
            unresolvedProps = path.slice(i);
            break search;
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
 * Whether every index in `pathParts` is a plain number, so the path can be resolved
 * without evaluating anything.
 */
function hasOnlyLiteralIndices(pathParts: DastMacroPathPart[]): boolean {
    return pathParts.every((part) =>
        part.index.every(
            (index) =>
                index.value.length === 1 &&
                index.value[0].type === "text" &&
                /^\d+$/.test(index.value[0].value.trim()),
        ),
    );
}

/**
 * Print a sequence of path parts including their (literal) indices.
 * E.g. `foo.bar[3]`.
 */
function printPath(pathParts: DastMacroPathPart[]): string {
    return pathParts
        .map(
            (part) =>
                part.name +
                part.index
                    .map((index) => `[${toXml(index.value).trim()}]`)
                    .join(""),
        )
        .join(".");
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

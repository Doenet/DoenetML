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
import { isV06True } from "./utils";
import { reparseAttribute } from "./reparse-attribute";
import { parseReferencePath } from "./assign-names/apply-renames";
import { createCoreForLookup } from "./core-info/core";
import { AssignNamesContext } from "./assign-names/context";
import { inlineMapSourceGroups } from "./upgrade-map-element";
import {
    describeProp,
    isComponentType,
    isModuleComponentType,
} from "./core-info/determine-prop-type";

type ReferentInfo = {
    /** The component type of what the reference copies (of each piece, if several). */
    componentType: string;
    /** Whether the reference copies to several components, like `$poly.vertices`. */
    isMultiple: boolean;
};

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
export const upgradeCopySyntax: Plugin<
    [AssignNamesContext],
    DastRoot,
    DastRoot
> = (context) => {
    return async (tree, file) => {
        await resolveAllCopyTags(tree, file, context);
        // A document with no `<copy>` skips the lookup entirely, but a `<map>` whose
        // sources were references to begin with still folds them into its `for`.
        inlineMapSourceGroups(tree, context);
    };
};

/**
 * Resolve every `<copy>` in `tree`, folding `<map>` sources into their `<repeat>` along
 * the way.
 */
async function resolveAllCopyTags(
    tree: DastRoot,
    file: VFile,
    context: AssignNamesContext,
) {
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
        // A `<map>`'s sources go first so they can be folded into the `for` of its
        // `<repeat>`. That `for` is what says the type of the repeat's `valueName`,
        // which the copies in the rest of the document may need.
        const inSourceGroup = (parents: DastElement[]) =>
            context.mapSourceGroups.some(({ group }) =>
                parents.includes(group),
            );
        await resolveCopyTags(core, tree, file, inSourceGroup);
        inlineMapSourceGroups(tree, context);
        await resolveCopyTags(
            core,
            tree,
            file,
            (parents) => !inSourceGroup(parents),
        );
    } finally {
        await core.dispose();
    }
}

/**
 * Rename every `<copy source="...">` to the component type of its referent.
 */
async function resolveCopyTags(
    core: Awaited<ReturnType<typeof createCoreForLookup>>,
    tree: DastRoot,
    file: VFile,
    /** Which `<copy>` tags to resolve in this pass, by their ancestors. */
    include: (parents: DastElement[]) => boolean,
) {
    const referenced: {
        node: DastElement;
        parent: DastElement | DastRoot;
        referentType: Promise<ReferentInfo>;
        referentName: string;
        /** The `prop` attribute to drop, but only once the referent has resolved. */
        propKey?: string;
    }[] = [];

    visit(tree, (node, info) => {
        if (!isDastElement(node) || node.name !== "copy") {
            return;
        }
        const parents = info.parents as DastElement[];
        if (!include(parents)) {
            return;
        }
        // A `uri` still on a `<copy>` means `upgradeCopyElements` declined to convert it
        // and reported why. Its target is another document, so resolving a `source`
        // against *this* one would rename the element and leave the `uri` behind on
        // something the diagnostics say was left alone.
        if (
            Object.keys(node.attributes).some(
                (key) => key.toLowerCase() === "uri",
            )
        ) {
            return;
        }
        let referentName = toXml(node.attributes["source"]?.children).trim();
        if (!referentName) {
            // No source, nothing to do
            return;
        }
        // There may be a `prop` attribute which specifies which prop from `source` to copy.
        // In the new syntax, this is always accessed with a `.<prop name>` suffix.
        // v0.6 attribute names were case-insensitive and nothing normalizes `prop`, so
        // find it however it was written.
        const propKey = Object.keys(node.attributes).find(
            (key) => key.toLowerCase() === "prop",
        );
        if (propKey) {
            const propName = toXml(node.attributes[propKey].children).trim();
            if (propName) {
                referentName += `.${propName}`;
            }
            // The attribute is noted but not removed yet: if the referent cannot be
            // resolved the `<copy>` is left as it was, and dropping `prop` there would
            // quietly widen what it copies while the diagnostic claims the tag was
            // untouched.
        }

        // `assignNames` has already become a `name` in `upgradeCopyElements`, which runs
        // early enough to register the renames this pass would be too late for.

        referenced.push({
            node,
            parent: parents[0] ?? tree,
            referentType: findReferentType(core, referentName, parents),
            referentName,
            propKey,
        });
    });

    // Go through everything we've found and match the references up to their referent type
    for (let {
        node,
        parent,
        referentType: referentPromise,
        referentName,
        propKey,
    } of referenced) {
        try {
            const { componentType: referentType, isMultiple } =
                await referentPromise;

            // v0.7 has no `link`: an `extend` attribute is always linked and a `copy`
            // attribute never is, so the choice between them says it instead.
            //
            // With no `link` at all, v0.6 did not always link. Its default was "linked,
            // unless this is a copy by cid/uri or the target is a module" (the `link`
            // state variable in v0.6's `Copy.js`), and the referent type is what says
            // whether the second case applies.
            const linkKey = Object.keys(node.attributes).find(
                (key) => key.toLowerCase() === "link",
            );
            const targetTag = linkKey
                ? isV06True(node.attributes[linkKey])
                    ? "extend"
                    : "copy"
                : isModuleComponentType(referentType)
                  ? "copy"
                  : "extend";

            // Build the reference from its parsed path rather than from the string, so
            // that a name needing `$(...)` — a hyphenated one — is printed that way.
            const bareName = referentName.startsWith("$")
                ? referentName.slice(1)
                : referentName;

            // A reference such as `$poly.vertices` copies to several components, and
            // an element can only stand for one: `<point extend="$poly.vertices" />`
            // is a single point. Left bare, the reference still gives every piece, as
            // the v0.6 `<copy>` did. With anything more to say — a name, `link="false"`,
            // `displayDigits` — it becomes the matching list instead.
            let elementType = referentType;
            if (isMultiple) {
                const hasOtherAttributes = Object.keys(node.attributes).some(
                    (key) =>
                        key !== "source" && key !== propKey && key !== linkKey,
                );
                if (!hasOtherAttributes && targetTag === "extend") {
                    const macro: DastMacro = {
                        type: "macro",
                        path: parseReferencePath(bareName),
                        attributes: {},
                    };
                    parent.children.splice(
                        parent.children.indexOf(node),
                        1,
                        macro,
                    );
                    continue;
                }
                elementType = `${referentType}List`;
                if (!isComponentType(elementType)) {
                    // Thrown before anything is changed, so the `<copy>` is left
                    // exactly as the author wrote it.
                    throw new Error(
                        `"${referentName}" copies to several <${referentType}> components, and there is no <${elementType}> to hold them together with this copy's other attributes`,
                    );
                }
            }

            // Now that the conversion is going through, `prop` is carried by the
            // reference itself and the attribute is redundant.
            if (propKey) {
                delete node.attributes[propKey];
            }
            // If there is a `link` attribute, delete it as it is no longer needed
            if (linkKey) {
                delete node.attributes[linkKey];
            }

            // Rename the `copy` tag to the same type as the referent
            renameAttrInPlace(node, "source", targetTag);
            node.attributes[targetTag].children = [
                {
                    type: "macro",
                    path: parseReferencePath(bareName),
                    attributes: {},
                },
            ];
            node.name = elementType;
        } catch (e) {
            file.message(
                `Could not resolve referent type for <copy> tag with source="${referentName}": ${e}`,
                {
                    place: node.position,
                    ruleId: "copy/unresolved-referent",
                    source: "v06-to-v07",
                },
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
    /** The ancestors of the reference, nearest first, for finding repeat aliases. */
    parents: DastElement[],
): Promise<ReferentInfo> {
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

    // A repeat's `valueName` or `indexName` hides any other component of that name
    // inside the repeat, and it is not something the lookup core can find by name: it
    // only exists inside an iteration. What the repeat iterates over says its type.
    const alias = await findAliasType(core, path[0].name, parents);
    if (alias) {
        referentType = alias;
        unresolvedIndex = path[0].index;
        unresolvedProps = path.slice(1);
    }

    search: for (let i = alias ? 0 : path.length; i > 0; i--) {
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
            // `printPathWithoutIndices` drops the indices from *every* part, not just
            // the last, so all of them are unaccounted for. A dynamic index on an
            // earlier segment (`g[$i].m`) has to count too: `g.m` may well resolve, but
            // to a different component than the one the author indexed into.
            unresolvedIndex = keepIndices
                ? []
                : pathParts.flatMap((part) => part.index);
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
    let isMultiple = false;
    for (const part of unresolvedProps) {
        const nIndices = part.index.length;
        if (!referentType) {
            // We could not find a referent type, so we throw an error.
            throw new Error(
                `Could not find referent type for "${referentName}"`,
            );
        }
        ({ componentType: referentType, isMultiple } = describeProp(
            referentType,
            part.name,
            nIndices,
        ));
    }

    if (referentType) {
        return { componentType: referentType, isMultiple };
    }

    throw new Error(`Could not find referent type for "${referentName}"`);
}

/**
 * The component type of `name` if it is the `valueName` or `indexName` of a repeat the
 * reference is inside; `undefined` if it is neither, or its type cannot be told.
 */
async function findAliasType(
    core: Awaited<ReturnType<typeof createCoreForLookup>>,
    name: string,
    parents: DastElement[],
): Promise<string | undefined> {
    for (const [i, parent] of parents.entries()) {
        if (
            !isDastElement(parent) ||
            (parent.name !== "repeat" && parent.name !== "repeatForSequence")
        ) {
            continue;
        }
        if (literalAttribute(parent, "indexName") === name) {
            return "number";
        }
        if (literalAttribute(parent, "valueName") !== name) {
            continue;
        }

        if (parent.name === "repeatForSequence") {
            const type = (literalAttribute(parent, "type") ?? "").toLowerCase();
            return type === "math"
                ? "math"
                : type === "letters"
                  ? "text"
                  : "number";
        }

        // `for="$poly.vertices"` iterates over points, `for="$l"` over the items of a
        // list. A `for` of anything else — several references, literal strings, a
        // group — could hold a mix of types, so it is left unresolved.
        const forChildren = (parent.attributes["for"]?.children ?? []).filter(
            (child) => !(child.type === "text" && child.value.trim() === ""),
        );
        if (forChildren.length !== 1 || forChildren[0].type !== "macro") {
            return undefined;
        }
        let iterated: ReferentInfo;
        try {
            // `for` is evaluated outside the repeat, so its own aliases don't apply.
            iterated = await findReferentType(
                core,
                toXml(forChildren[0]),
                parents.slice(i + 1),
            );
        } catch (e) {
            return undefined;
        }
        if (iterated.isMultiple) {
            return iterated.componentType;
        }
        const itemType = iterated.componentType.replace(/List$/, "");
        if (itemType !== iterated.componentType && isComponentType(itemType)) {
            return itemType;
        }
        return undefined;
    }
    return undefined;
}

/**
 * The value of attribute `name` when it is plain text, trimmed; otherwise `undefined`.
 */
function literalAttribute(node: DastElement, name: string): string | undefined {
    const children = node.attributes[name]?.children;
    if (!children || !children.every((child) => child.type === "text")) {
        return undefined;
    }
    return toXml(children).trim();
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

import { Plugin } from "unified";
import {
    DastElementContent,
    DastFunctionMacro,
    DastAttributeV6,
    DastFunctionMacroV6,
    DastMacro,
    DastMacroPathPart,
    DastMacroV6,
    DastNodesV6,
    DastRoot,
    DastRootV6,
    isDastElement,
    toXml,
    visit,
} from "@doenet/parser";
import { parseMacrosV06, v06macroToString } from "@doenet/parser/v06";
import { markAsPropAccess } from "./assign-names/prop-access-parts";

/**
 * Upgrade namespace path syntax.
 * ```xml
 *   $(foo/bar.baz)
 * ```
 * becomes
 * ```xml
 *   $foo.bar.baz
 * ```
 */
export const upgradePathSlashesToDots: Plugin<
    [],
    DastRootV6,
    DastRoot
> = () => {
    return (tree, file) => {
        visit(
            tree,
            // @ts-ignore
            (node: DastNodesV6, info) => {
                // We need to search both usually-traversed children and the contents of attributes
                // for macros that need to be upgraded.
                const macros: (DastMacroV6 | DastFunctionMacroV6)[] = [];
                if (isV06MacroOrFunctionMacro(node)) {
                    macros.push(node);
                }
                if (isDastElement(node)) {
                    for (const attr of Object.values(node.attributes)) {
                        collectV06Macros(attr.children, macros);
                    }
                }
                for (const node of macros) {
                    const macro =
                        node.type === "macro"
                            ? v06MacroToV07Macro(node)
                            : v06FunctionMacroToV07FunctionMacro(node);
                    // We mutate in place. Clear the node of its old properties
                    // and splice in the new values.
                    Object.keys(node).forEach((key) => {
                        // @ts-ignore
                        delete node[key];
                    });
                    macro.path = collapseParentPathParts(macro.path, () =>
                        file.message(
                            `There is no equivalent to the $(../x) syntax; a best-guess was made when converting ${v06macroToString(
                                macro as any,
                            )}`,
                            {
                                start: node.position?.start,
                                end: node.position?.end,
                            },
                        ),
                    );

                    Object.assign(node, macro);
                }
            },
        );

        // There may be slashes in a macro path that hasn't been parsed as a macro in the `source` attribute of
        // a copy tag. E.g. `<copy source="foo/bar" />`.
        visit(tree, (node) => {
            if (!isDastElement(node)) {
                return;
            }
            if (!ELEMENTS_WITH_REFERENCE_SOURCE.has(node.name.toLowerCase())) {
                // On everything else (`<image>`, `<video>`, ...) `source` is a URL, and
                // the slashes in it are not namespace separators.
                return;
            }
            const sourceAttr = node.attributes["source"];
            if (!sourceAttr) {
                return;
            }
            const sourceName = toXml(sourceAttr.children).trim();
            if (!sourceName.includes("/")) {
                return; // No slashes, nothing to do
            }
            // We need to reparse the source name as a macro to remove the slashes.
            const reparsedSource = parseMacrosV06(`$(${sourceName})`);
            if (
                reparsedSource.length !== 1 ||
                reparsedSource[0].type !== "macro"
            ) {
                file.message(
                    `Could not reparse "source" attribute that contains a slash: "${sourceName}".`,
                    { place: node.position },
                );
                return;
            }
            const upgradedSource = v06MacroToV07Macro(reparsedSource[0]);
            upgradedSource.path = collapseParentPathParts(
                upgradedSource.path,
                () =>
                    file.message(
                        `There is no equivalent to the ../x syntax; a best-guess was made when converting source="${sourceName}"`,
                        { place: node.position },
                    ),
            );
            // Source attributes are not parsed as macros, so we turn back into a string and remove the dollar sign.
            const newSourceName = toXml(upgradedSource.path);
            sourceAttr.children = [
                {
                    type: "text",
                    value: newSourceName,
                    position: upgradedSource.position,
                },
            ];
        });
    };
};

/**
 * Gather the v0.6 macros in `nodes`, descending into the arguments of a function macro.
 *
 * The usual traversal never enters an attribute, so this is how macros inside one are
 * found. It has to recurse: `$$f($$(g/h)(2))` is a function macro whose argument is
 * another function macro, and converting the outer one leaves the inner one alone (see
 * the note in `v06FunctionMacroToV07FunctionMacro`). Collecting outermost-first matches
 * what the ordinary traversal does for macros outside an attribute.
 */
function collectV06Macros(
    nodes: readonly unknown[],
    macros: (DastMacroV6 | DastFunctionMacroV6)[],
) {
    for (const node of nodes) {
        if (!isV06MacroOrFunctionMacro(node)) {
            continue;
        }
        macros.push(node);
        collectNestedV06Macros(node, macros);
    }
}

/**
 * The places a v0.6 macro can hold another one: a function macro's arguments, the macro
 * its path indices are written with, its `{...}` attributes, and — for a function macro —
 * the macro it wraps.
 */
function collectNestedV06Macros(
    node: DastMacroV6 | DastFunctionMacroV6,
    macros: (DastMacroV6 | DastFunctionMacroV6)[],
) {
    if (node.type === "function") {
        for (const argument of node.input || []) {
            collectV06Macros(argument, macros);
        }
        if (node.macro) {
            collectNestedV06Macros(node.macro, macros);
        }
        return;
    }
    for (const part of node.path || []) {
        for (const index of part.index || []) {
            collectV06Macros(index.value, macros);
        }
    }
    const attributes: DastAttributeV6[] = Array.isArray(node.attributes)
        ? node.attributes
        : Object.values(node.attributes ?? {});
    for (const attribute of attributes) {
        collectV06Macros(attribute.children, macros);
    }
    if (node.accessedProp) {
        collectNestedV06Macros(node.accessedProp, macros);
    }
}

/**
 * The elements whose `source` attribute names another component rather than a URL.
 */
const ELEMENTS_WITH_REFERENCE_SOURCE = new Set(["copy", "collect", "extract"]);

/**
 * Resolve the v0.6 `..` parent-path syntax, which v0.7 has no equivalent for, by dropping
 * the part before it. `warn` is called once if any `..` was actually applied.
 */
function collapseParentPathParts(
    path: DastMacroPathPart[],
    warn: () => void,
): DastMacroPathPart[] {
    if (!path.some((part) => part.name === "..")) {
        return path;
    }
    const newPath: DastMacroPathPart[] = [];
    let warned = false;
    for (const part of path) {
        if (part.name === "..") {
            if (newPath.length > 0) {
                newPath.pop();
                if (!warned) {
                    warned = true;
                    warn();
                }
            }
            continue;
        }
        newPath.push(part);
    }
    return newPath;
}

/**
 * Convert a v0.6 macro to a v0.7 macro.
 * This conversion changes all `$(foo/bar)` into `$foo.bar`
 */
function v06MacroToV07Macro(macro: DastMacroV6): DastMacro {
    const path: DastMacro["path"] = flattenedAccessedProps(macro);

    const { accessedProp, version, attributes, ...rest } = macro;
    return {
        ...rest,
        attributes: v06AttributeToV07Attribute(mergeAttributes(macro)),
        path,
    };
}

function mergeAttributes(macro: DastMacroV6): DastMacroV6["attributes"] {
    const ret: DastMacroV6["attributes"] = [];
    // The types might be lying to us...
    const attrs: DastMacroV6["attributes"] = Array.isArray(macro.attributes)
        ? macro.attributes
        : Object.values(macro.attributes);
    ret.push(...attrs);
    let curr = macro.accessedProp;
    while (curr) {
        const currAttrs: DastMacroV6["attributes"] = Array.isArray(
            curr.attributes,
        )
            ? curr.attributes
            : Object.values(curr.attributes);
        ret.push(...currAttrs);
        curr = curr.accessedProp;
    }

    return ret;
}

/**
 * Convert a v0.6 function macro to a v0.7 function macro.
 */
function v06FunctionMacroToV07FunctionMacro(
    funcMacro: DastFunctionMacroV6,
): DastFunctionMacro {
    // A function macro is a macro with an input.
    const macro = v06MacroToV07Macro(funcMacro.macro);

    return {
        type: "function",
        path: macro.path,
        // This cast may be incorrect, but we will leave it to the other processors to upgrade the
        // the syntax of function arguments.
        input: funcMacro.input as DastElementContent[][] | null,
        position: funcMacro.position,
    };
}

function v06IndexToV07Index(
    index: DastMacroV6["path"][number]["index"],
): DastMacro["path"][number]["index"] {
    return index.map((ind) => ({
        ...ind,
        value: ind.value.map((v) =>
            v.type === "macro" ? v06MacroToV07Macro(v) : v,
        ),
    }));
}

function v06AttributeToV07Attribute(
    attrs: DastMacroV6["attributes"],
): DastMacro["attributes"] {
    const ret: DastMacro["attributes"] = {};
    // The types might be lying to us...
    attrs = Array.isArray(attrs) ? attrs : Object.values(attrs);
    for (const attr of attrs) {
        const children: DastMacro["attributes"][string]["children"] =
            attr.children.map((c) => {
                if (c.type === "macro") {
                    return v06MacroToV07Macro(c);
                }
                if (c.type === "function") {
                    return v06FunctionMacroToV07FunctionMacro(c);
                }
                return c;
            });
        ret[attr.name] = {
            ...attr,
            children,
        };
    }
    return ret;
}
/**
 * Flatten the `accessedProps` of a macro from the v0.6 into a v0.7 path.
 */
function flattenedAccessedProps(macro: DastMacroV6): DastMacro["path"] {
    const path = macro.path.map((p) => {
        return {
            ...p,
            index: v06IndexToV07Index(p.index),
        };
    });
    if (macro.accessedProp) {
        // Everything the `accessedProp` chain contributes was written after a `.`, so it
        // names a prop rather than a component. Nothing downstream can tell once the two
        // are in one flat path, so record it now; see `assign-names/prop-access-parts.ts`.
        const propParts = flattenedAccessedProps(macro.accessedProp);
        propParts.forEach(markAsPropAccess);
        return [...path, ...propParts];
    }

    return path;
}

function isV06MacroOrFunctionMacro(
    node: any,
): node is DastMacroV6 | DastFunctionMacroV6 {
    return (
        (node.type === "macro" || node.type === "function") &&
        node.version === "0.6"
    );
}

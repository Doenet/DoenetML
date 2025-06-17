import { Plugin } from "unified";
import {
    DastFunctionMacro,
    DastFunctionMacroV6,
    DastMacro,
    DastMacroV6,
    DastNodesV6,
    DastRoot,
    DastRootV6,
} from "../types";
import { visit } from "../pretty-printer/normalize/utils/visit";
import { isDastElement } from "../types-util";

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
    return (tree) => {
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
                        for (const child of attr.children) {
                            if (isV06MacroOrFunctionMacro(child)) {
                                macros.push(child);
                            }
                        }
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
                    Object.assign(node, macro);
                }
            },
        );
        // Macros can also appear in attributes
    };
};

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
    macro: DastFunctionMacroV6,
): DastFunctionMacro {
    throw new Error("todo: v06FunctionMacroToV07FunctionMacro");
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
        return [...path, ...flattenedAccessedProps(macro.accessedProp)];
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

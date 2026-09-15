import { Plugin } from "unified";
import {
    DastElement,
    DastMacroPathPart,
    DastRoot,
    isDastElement,
    toXml,
} from "@doenet/parser";
import { visitAll, visitAllMacros } from "./assign-names/visit-all";
import { parseReferencePath } from "./assign-names/apply-renames";
import {
    isPropAccess,
    markAsPropAccess,
    restoreRawPropPositions,
} from "./assign-names/prop-access-parts";

/**
 * v0.6 reached the contents of a list component through a prop: `$myMathList.maths` for
 * all of them and `$myMathList.math2` for one. v0.7 indexes the list itself, so the
 * "all" props are dropped and the numbered ones become indices:
 *
 * ```
 *   $equilibria.maths   ->  $equilibria
 *   $equilibria.math2   ->  $equilibria[2]
 * ```
 */
const ALL_ITEMS_PROPS = new Set(["maths", "texts", "numbers", "booleans"]);
const NUMBERED_ITEM_PROP = /^(math|text|number|boolean)(\d+)$/;

/**
 * Elements whose `prop` attribute names a prop of what their `source` points at.
 */
const ELEMENTS_WITH_PROP = new Set(["copy", "collect", "extract"]);

export const upgradeListProps: Plugin<[], DastRoot, DastRoot> = () => {
    return (tree) => {
        visitAllMacros(tree, (node) => {
            node.path = rewritePath(node.path);
        });

        visitAll(tree, (node) => {
            if (
                !isDastElement(node) ||
                !ELEMENTS_WITH_PROP.has(node.name.toLowerCase())
            ) {
                return;
            }
            rewritePropAttribute(node);
            rewriteRawSourceAttribute(node);
        });
    };
};

/**
 * Elements whose `source` is still plain text at this point, so the list prop in it is
 * not a macro path that the pass above would reach. `slash-to-dot.ts` writes them this
 * way on purpose; see `RAW_REFERENCE_ATTRS` in `apply-renames.ts`.
 */
const ELEMENTS_WITH_RAW_SOURCE = new Set(["copy", "extract"]);

/**
 * The same rewrite again for `<copy source="eq.math2" />`, where the list prop is written
 * into the reference rather than as a separate `prop` attribute.
 */
function rewriteRawSourceAttribute(node: DastElement) {
    if (!ELEMENTS_WITH_RAW_SOURCE.has(node.name.toLowerCase())) {
        return;
    }
    const sourceKey = findKey(node, "source");
    if (!sourceKey) {
        return;
    }
    const attr = node.attributes[sourceKey];
    if (attr.children.length !== 1 || attr.children[0].type !== "text") {
        return;
    }
    const child = attr.children[0];
    const value = child.value.trim();
    // Only a dotted path can hold one of these props, and the `$` form is a macro that
    // the pass above already handled.
    if (!value || value.startsWith("$") || !value.includes(".")) {
        return;
    }
    let path: DastMacroPathPart[];
    try {
        path = parseReferencePath(value);
    } catch {
        return;
    }
    // Parsing text cannot tell a prop from a namespace segment, and `rewritePath` acts
    // only on props — so put back what `slash-to-dot` recorded before serializing.
    restoreRawPropPositions(node, sourceKey, path);
    const rewritten = rewritePath(path);
    if (rewritten === path) {
        return;
    }
    child.value = toXml(rewritten);
}

/**
 * Drop a list-item prop from a path, folding what it selected into an index on the part
 * before it. A leading part is left alone, since there would be nothing to index.
 */
function rewritePath(path: DastMacroPathPart[]): DastMacroPathPart[] {
    if (path.length < 2) {
        return path;
    }
    const result: DastMacroPathPart[] = [path[0]];
    for (const part of path.slice(1)) {
        const previous = result[result.length - 1];
        if (!isPropAccess(part)) {
            // A v0.6 namespace segment can be called `maths` too — `$(g/maths)` names a
            // component, not a list's contents — and rewriting one would change what the
            // reference points at.
            result.push(part);
            continue;
        }
        if (ALL_ITEMS_PROPS.has(part.name)) {
            previous.index = [...previous.index, ...part.index];
            continue;
        }
        const numbered = NUMBERED_ITEM_PROP.exec(part.name);
        if (numbered) {
            previous.index = [
                ...previous.index,
                {
                    type: "index",
                    value: [{ type: "text", value: numbered[2] }],
                },
                ...part.index,
            ];
            continue;
        }
        result.push(part);
    }
    return result;
}

/**
 * The same rewrite for `<copy prop="maths" source="x" />`, whose `source` is still plain
 * text at this point in the pipeline.
 */
function rewritePropAttribute(node: DastElement) {
    const propKey = findKey(node, "prop");
    if (!propKey) {
        return;
    }
    const prop = toXml(node.attributes[propKey].children).trim();
    const numbered = NUMBERED_ITEM_PROP.exec(prop);
    if (!ALL_ITEMS_PROPS.has(prop) && !numbered) {
        return;
    }

    // Whatever the prop says, dropping it only makes sense on a copy this converter is
    // actually converting. One with no usable `source` is being left as it is — an
    // external `<copy uri="doenet:...">` that kept its `prop` because it narrows what it
    // copies, above all — and taking the prop off it would silently widen a tag the
    // diagnostics say was untouched.
    const sourceKey = findKey(node, "source");
    if (!sourceKey) {
        return;
    }
    const sourceAttr = node.attributes[sourceKey];
    const source = toXml(sourceAttr.children).trim();
    if (!source) {
        return;
    }

    if (!numbered) {
        // An "all items" prop is the list itself, so there is nothing to move.
        delete node.attributes[propKey];
        return;
    }

    // A numbered prop becomes an index on the source, so the prop may only be dropped
    // once that has actually happened — otherwise the copy silently widens from one item
    // to the whole list.
    const hadDollar = source.startsWith("$");
    let path: DastMacroPathPart[];
    try {
        path = parseReferencePath(hadDollar ? source.slice(1) : source);
    } catch (e) {
        return;
    }
    const last = path[path.length - 1];
    last.index = [
        ...last.index,
        { type: "index", value: [{ type: "text", value: numbered[2] }] },
    ];
    // When the value carried a `$` it is a reference, so print it as one and let the
    // serializer add whatever parentheses the name needs.
    sourceAttr.children = hadDollar
        ? [{ type: "macro", path, attributes: {} }]
        : [{ type: "text", value: toXml(path) }];
    delete node.attributes[propKey];
}

function findKey(node: DastElement, attrName: string): string | undefined {
    return Object.keys(node.attributes).find(
        (key) => key.toLowerCase() === attrName.toLowerCase(),
    );
}

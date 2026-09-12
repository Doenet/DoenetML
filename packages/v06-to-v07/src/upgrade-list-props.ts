import { Plugin } from "unified";
import {
    DastElement,
    DastMacroPathPart,
    DastRoot,
    isDastElement,
    toXml,
} from "@doenet/parser";
import { visitAll, visitAllMacros } from "./assign-names/visit-all";
import { reparseAttribute } from "./reparse-attribute";

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
        });
    };
};

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
    delete node.attributes[propKey];
    if (!numbered) {
        return;
    }
    const sourceKey = findKey(node, "source");
    if (!sourceKey) {
        return;
    }
    const sourceAttr = node.attributes[sourceKey];
    const source = toXml(sourceAttr.children).trim();
    if (!source) {
        return;
    }
    const hadDollar = source.startsWith("$");
    const reparsed = reparseAttribute(hadDollar ? source : `$${source}`);
    if (reparsed.length !== 1 || reparsed[0].type !== "macro") {
        return;
    }
    const path = reparsed[0].path;
    const last = path[path.length - 1];
    last.index = [
        ...last.index,
        { type: "index", value: [{ type: "text", value: numbered[2] }] },
    ];
    const printed = toXml(path);
    sourceAttr.children = [
        { type: "text", value: hadDollar ? `$${printed}` : printed },
    ];
}

function findKey(node: DastElement, attrName: string): string | undefined {
    return Object.keys(node.attributes).find(
        (key) => key.toLowerCase() === attrName.toLowerCase(),
    );
}

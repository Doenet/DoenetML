import { DastRoot, isDastElement, visit } from "@doenet/parser";
import { Plugin, unified } from "unified";

/**
 * Preprocess normalized DAST for PreTeXt export.
 * Currently, this marks all <graph> elements with renderer="prefigure".
 */
const addPrefigureRendererToGraphs: Plugin<[], DastRoot, DastRoot> = () => {
    return (tree) => {
        visit(tree, (node) => {
            if (!isDastElement(node) || node.name !== "graph") {
                return;
            }

            node.attributes.renderer = {
                type: "attribute",
                name: "renderer",
                children: [{ type: "text", value: "prefigure" }],
            };
        });
    };
};

/**
 * Add the `revealAll` attribute to all `cascade` elements so they render with everything visible.
 */
const addCascadeRevealAll: Plugin<[], DastRoot, DastRoot> = () => {
    return (tree) => {
        visit(tree, (node) => {
            if (!isDastElement(node) || node.name !== "cascade") {
                return;
            }

            node.attributes.revealAll = {
                type: "attribute",
                name: "revealAll",
                children: [{ type: "text", value: "true" }],
            };
        });
    };
};

export function preprocessDastForPretext(dast: DastRoot): DastRoot {
    return unified()
        .use(addPrefigureRendererToGraphs)
        .use(addCascadeRevealAll)
        .runSync(dast) as DastRoot;
}

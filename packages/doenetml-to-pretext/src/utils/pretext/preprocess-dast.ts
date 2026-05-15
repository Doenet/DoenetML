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

export function preprocessDastForPretext(dast: DastRoot): DastRoot {
    return unified()
        .use(addPrefigureRendererToGraphs)
        .runSync(dast) as DastRoot;
}

import { Plugin, unified } from "unified";
import { DastRoot } from "../../types";
import { expandCdataPlugin } from "./plugin-expand-cdata";
import { mergeAdjacentTextPlugin } from "./plugin-merge-adjacent-text";
import { mergeWhitespacePlugin } from "./plugin-merge-whitespace";
import { removeEmptyTextNodesPlugin } from "./plugin-remove-empty-text-nodes";
import { removeInternodeWhitespacePlugin } from "./plugin-remove-internode-whitespace";
import { trimWhitespacePlugin } from "./plugin-trim-whitespace";

/**
 * Unifiedjs plugin that removes normalizes a DoenetML document. E.g.,
 * all whitespace is removed where it doesn't belong, cdata is expanded into text, etc..
 */
export const normalizeDoenetMlPlugin: Plugin<void[], DastRoot, DastRoot> =
    function () {
        const processor = unified()
            .use(expandCdataPlugin)
            .use(mergeAdjacentTextPlugin)
            .use(mergeWhitespacePlugin)
            .use(removeInternodeWhitespacePlugin)
            .use(trimWhitespacePlugin)
            .use(removeEmptyTextNodesPlugin);

        return (root: DastRoot, file) => {
            const processed = processor.runSync(root, file);
            return processed;
        };
    };

/**
 * Normalize a `DastRoot` AST.
 */
export function normalize(root: DastRoot) {
    const processor = unified().use(normalizeDoenetMlPlugin);
    return processor.runSync(root);
}

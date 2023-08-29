import { lezerNodeToDastNode } from "./lezer-to-dast";
import { parser } from "../generated-assets/lezer-doenet";
import { Nodes } from "xast";

/**
 * Parse the xml string `source` into a DAST ast via the lezer parser.
 * If you have already parsed via lezer and you wish to convert lezer's `Tree`
 * into a DAST format, use `lezerNodeToDastNode` instead.
 */
export function lezerToDast(source: string) {
    const tree = parser.parse(source);
    const topNode = tree.topNode;
    return lezerNodeToDastNode(topNode, source) as Nodes;
}

export { lezerNodeToDastNode };

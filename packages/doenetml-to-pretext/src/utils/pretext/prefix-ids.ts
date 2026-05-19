import * as Xast from "xast";
import { visit } from "unist-util-visit";

/**
 * Prefix all xml:id attributes in an Xast tree with the given prefix.
 * Also updates any xref ref attributes that point to these ids.
 * This modifies the tree in-place.
 *
 * @param prefix The prefix to add to all xml:id attributes
 * @param root The Xast tree to modify
 */
export function prefixIds(prefix: string, root: Xast.Root): void {
    // First pass: collect all xml:ids and create a mapping of old id -> new prefixed id
    const idMapping: Record<string, string> = {};
    visit(root, "element", (node) => {
        if (node.attributes && typeof node.attributes["xml:id"] === "string") {
            const oldId = node.attributes["xml:id"];
            const newId = `${prefix}${oldId}`;
            idMapping[oldId] = newId;
            node.attributes["xml:id"] = newId;
        }
    });

    // Second pass: update xref ref attributes to point to prefixed ids
    visit(root, "element", (node) => {
        if (node.name === "xref" && node.attributes && typeof node.attributes.ref === "string") {
            const oldRef = node.attributes.ref;
            if (oldRef in idMapping) {
                node.attributes.ref = idMapping[oldRef];
            }
        }
    });
}

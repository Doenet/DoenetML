import * as Xast from "xast";
import { visit } from "unist-util-visit";
import { toXml } from "xast-util-to-xml";

/**
 * Extract the inlined content of any images and replace them with `<image>` tags.
 */
export function extractImages(root: Xast.Root): Record<string, string> {
    const ret: Record<string, string> = {};
    const images: Record<string, string> = {};
    visit(root, "element", (node) => {
        if (node.name === "graph") {
            const imageName = `graph-${Object.keys(images).length + 1}.svg`;
            const svg = node.attributes.svgSource;
            if (!svg) {
                throw new Error(
                    "Could not find svgSource attribute on <graph> element",
                );
            }
            images[imageName] = svg;

            // Totally override the node and its attributes
            node.name = "image";
            node.attributes = { source: imageName };
        }
    });

    ret["main.ptx"] = toXml(root, { closeEmptyElements: true });
    Object.assign(ret, images);

    return ret;
}

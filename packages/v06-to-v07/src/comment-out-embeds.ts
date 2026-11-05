import { Plugin } from "unified";
import { DastRoot, isDastElement, replaceNode, toXml } from "@doenet/parser";

/**
 * v0.6 used `<embed>` to show GeoGebra applets. GeoGebra support is being removed from
 * DoenetML — v0.7 still has an `<embed>` component, but leaves it out of the schema — and
 * the applets are to be rebuilt as DoenetML widgets. Until then the element is commented
 * out with a TODO, so the applet stays in the source for whoever rebuilds it.
 */
export const commentOutEmbeds: Plugin<[], DastRoot, DastRoot> = () => {
    return (tree, file) => {
        replaceNode(tree, (node) => {
            if (!isDastElement(node) || node.name !== "embed") {
                return;
            }
            const name = node.attributes["name"]
                ? toXml(node.attributes["name"].children).trim()
                : "";
            file.message(
                `Commented out an <embed>${name ? ` named "${name}"` : ""}: GeoGebra applets are being removed from DoenetML, so the applet has to be rebuilt as a DoenetML widget.${name ? ` References to $${name} now find nothing.` : ""}`,
                {
                    place: node.position,
                    ruleId: "no-v07-equivalent/embed-geogebra",
                    source: "v06-to-v07",
                },
            );
            // A comment cannot contain `--`.
            const original = toXml(node).replace(/--/g, "- -");
            return {
                type: "comment",
                value: ` TODO: GeoGebra applets are being removed from DoenetML. Rebuild this one as a DoenetML widget. The v0.6 element was:\n${original}\n`,
            };
        });
    };
};

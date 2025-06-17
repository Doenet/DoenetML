import { Plugin, unified } from "unified";
import {
    DastAttribute,
    DastElement,
    DastElementContent,
    DastMacro,
    DastMacroPathPart,
    DastRoot,
    DastRootContent,
} from "../types";
import { EXIT, visit } from "../pretty-printer/normalize/utils/visit";
import { isDastElement } from "../types-util";
import { renameAttrInPlace } from "./rename-attr-in-place";
import { toXml } from "../dast-to-xml/dast-util-to-xml";
import { reparseAttribute } from "./reparse-attribute";
import { Path } from "../macros/types";
import { createCoreForLookup } from "./core";

/**
 * Upgrade the type-less `<copy>` tag to have the same type as its referent.
 * ```xml
 *    <math name="m">5</math><copy source="m" name="k" />
 * ```
 * becomes
 * ```xml
 *   <math name="m">5</math><math extend="$m" name="k" />
 * ```
 */
export const upgradeCopySyntax: Plugin<[], DastRoot, DastRoot> = () => {
    return async (tree, file) => {
        // Shortcut if `copy` does not appear at all
        let skip = true;
        visit(tree, (node) => {
            if (!isDastElement(node)) {
                return;
            }
            if (node.name === "copy") {
                skip = false;
                // We can stop visiting, we found what we need
                return EXIT;
            }
        });
        if (skip) {
            // No `copy` elements, nothing to do
            return;
        }

        const core = await createCoreForLookup({ dast: tree });
        let referenced: [DastElement, Promise<number>, string][] = [];

        visit(tree, (node) => {
            if (!isDastElement(node)) {
                return;
            }
            if (node.name !== "copy") {
                // No affected attributes, nothing to do
                return;
            }
            const referentName = toXml(node.attributes["source"]?.children);
            if (!referentName) {
                // No source, nothing to do
                return;
            }
            referenced.push([
                node,
                core.resolvePathToNodeIdx(referentName),
                referentName,
            ]);
        });

        // Go through everything we've found and match the references up to their referent type
        for (const [node, referentPromise, referentName] of referenced) {
            const referentIdx = await referentPromise;
            if (referentIdx === -1) {
                // No referent found, nothing to do
                continue;
            }
            const referentType =
                core.core.core?.components?.[referentIdx]?.componentType;
            if (!referentType) {
                // No referent type, nothing to do
                file.message(
                    `Could not find referent type for <copy> tag with source="${referentName}"    ${toXml(node)}"`,
                    node.position?.start,
                );
                continue;
            }

            // Rename the `copy` tag to the same type as the referent
            renameAttrInPlace(node, "source", "extend");
            // Make sure that the `extend` attribute is prefixed with `$`
            const extendName = toXml(
                node.attributes["extend"]?.children,
            ).trim();
            if (!extendName.startsWith("$")) {
                node.attributes["extend"].children = reparseAttribute(
                    `$${extendName}`,
                );
            }
            node.name = referentType;
        }
    };
};

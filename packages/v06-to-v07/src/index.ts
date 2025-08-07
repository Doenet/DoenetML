import { Plugin, unified } from "unified";
import { VFile } from "vfile";
import { DastRoot, DastRootV6 } from "@doenet/parser";
import { visit } from "@doenet/parser";
import { isDastElement } from "@doenet/parser";
import { toXml } from "@doenet/parser";
import { reparseAttribute } from "./reparse-attribute";
import {
    correctAttributeCapitalization,
    correctElementCapitalization,
} from "./normalize-capitalization";
import { upgradeCollectElement } from "./upgrade-collect-element";
import { upgradePathSlashesToDots } from "./slash-to-dot";
import { lezerToDastV6 } from "@doenet/parser/v06";
import { upgradeCopySyntax } from "./upgrade-copy-syntax";
import { upgradeAttributeSyntax } from "./upgrade-attribute-syntax";
import { upgradeMapElement } from "./upgrade-map-element";
import { upgradeModuleElement } from "./upgrade-module-element";
import { renameAttrInPlace } from "./rename-attr-in-place";

export type Options = {
    doNotUpgradeCopyTags?: boolean;
    doNotUpgradeAttributeSyntax?: boolean;
};

/**
 * Auto-updates syntax from DoenetML v0.6 to v0.7. This includes removing `namespace` attributes,
 * etc.
 *
 * See https://github.com/Doenet/DoenetML/issues/474
 *
 * Any warnings are stored on the VFile object.
 */
export async function updateSyntaxFromV06toV07_root(
    dast: DastRootV6,
    options: Options,
) {
    let processor = unified()
        .use(upgradePathSlashesToDots)
        .use(correctElementCapitalization)
        .use(correctAttributeCapitalization)
        .use(removeNewNamespaceAttribute)
        .use(upgradeRefElement)
        .use(ensureDollarBeforeNamesOnSpecificAttributes)
        .use(copySourceToExtendOrCopy)
        .use(upgradeCollectElement)
        .use(upgradeMapElement)
        .use(upgradeModuleElement);
    if (!options.doNotUpgradeAttributeSyntax) {
        processor = processor.use(upgradeAttributeSyntax);
    }
    if (!options.doNotUpgradeCopyTags) {
        processor = processor.use(upgradeCopySyntax);
    }

    // Error messages are stored in a VFile
    const vfile = new VFile();
    return { dast: await processor.run(dast, vfile), vfile };
}

/**
 * Auto-updates syntax from DoenetML v0.6 to v0.7. This includes removing `namespace` attributes,
 * etc.
 *
 * See https://github.com/Doenet/DoenetML/issues/474
 */
export async function updateSyntaxFromV06toV07(
    dastStr: string,
    options?: Options,
) {
    const parsed = lezerToDastV6(dastStr);
    const result = await updateSyntaxFromV06toV07_root(parsed, options || {});
    return { ...result, xml: toXml(result.dast) };
}

/**
 * Remove all comment/instruction/docstring nodes from the DAST tree.
 */
const ensureDollarBeforeNamesOnSpecificAttributes: Plugin<
    [],
    DastRoot,
    DastRoot
> = () => {
    const ATTRIBUTES_NEEDING_DOLLAR = new Set([
        "target",
        "triggerWith",
        "triggerWhenObjectsClicked",
        "triggerWhenObjectsFocused",
        "referencesAreFunctionSymbols",
        "updateWith",
        "forObject",
        "paginator",
    ]);

    return (tree) => {
        visit(tree, (node) => {
            if (!isDastElement(node)) {
                return;
            }
            // Check the attributes to see if they need dollar sings
            for (const [name, attr] of Object.entries(node.attributes)) {
                if (
                    attr.type === "attribute" &&
                    ATTRIBUTES_NEEDING_DOLLAR.has(name) &&
                    !toXml(attr.children).trim().startsWith("$")
                ) {
                    const attrValue = "$" + toXml(attr.children).trim();
                    attr.children = reparseAttribute(attrValue);
                }
            }
        });
    };
};

/**
 * Change `copySource` attributes to `extend` attributes.
 * If `link="false"` is set, `copy` is used instead of `extend`.
 * If `assignNames` is set, the assigned name is added on via a `.` onto the extend attribute.
 */
const copySourceToExtendOrCopy: Plugin<[], DastRoot, DastRoot> = () => {
    return (tree) => {
        visit(tree, (node) => {
            if (!isDastElement(node)) {
                return;
            }
            const copySourceAttr = node.attributes["copySource"];
            const linkAttr = node.attributes["link"];
            const assignNamesAttr = node.attributes["assignNames"];
            const copyPropAttr = node.attributes["copyProp"];

            if (!copySourceAttr) {
                return;
            }
            const targetTag =
                toXml(linkAttr?.children || []).toLowerCase() === "false"
                    ? "copy"
                    : "extend";

            let extendValue = `$${toXml(copySourceAttr.children).trim()}`;
            copySourceAttr.name = targetTag;
            // If there is a `copyProp` attribute, then add it after a `.` to the `extend` attribute
            if (copyPropAttr) {
                extendValue += `.${toXml(copyPropAttr.children).trim()}`;
                delete node.attributes["copyProp"];
            }
            copySourceAttr.children = reparseAttribute(extendValue);

            // If `assignNames` has only one name (i.e. no spaces are present),
            // it becomes the name of the component
            if (
                assignNamesAttr &&
                toXml(assignNamesAttr.children).trim().indexOf(" ") === -1
            ) {
                assignNamesAttr.name = "name";
            }

            // If there is a `link` attribute, remove it
            if (linkAttr) {
                delete node.attributes["link"];
            }
        });
    };
};

/**
 * Remove the `newNamespace` attribute. It doesn't do anything anymore.
 */
const removeNewNamespaceAttribute: Plugin<[], DastRoot, DastRoot> = () => {
    return (tree) => {
        visit(tree, (node) => {
            if (!isDastElement(node)) {
                return;
            }
            // Remove the `newNamespace` attribute if it exists
            if (node.attributes["newNamespace"]) {
                delete node.attributes["newNamespace"];
            }
        });
    };
};

/**
 * Upgrade `<ref>`. In particular, rename the `target` attribute to `to`.
 */
const upgradeRefElement: Plugin<[], DastRoot, DastRoot> = () => {
    return (tree) => {
        visit(tree, (node) => {
            if (!isDastElement(node) || node.name !== "ref") {
                return;
            }
            renameAttrInPlace(node, "target", "to");
        });
    };
};

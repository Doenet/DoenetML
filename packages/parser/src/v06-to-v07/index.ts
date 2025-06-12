import { Plugin, unified } from "unified";
import {
    DastAttribute,
    DastElement,
    DastElementContent,
    DastRoot,
    DastRootContent,
} from "../types";
import { visit } from "../pretty-printer/normalize/utils/visit";
import { isDastElement } from "../types-util";
import { toXml } from "../dast-to-xml/dast-util-to-xml";
import { reparseAttribute } from "./reparse-attribute";
import {
    correctAttributeCapitalization,
    correctElementCapitalization,
} from "./normalize-capitalization";

/**
 * Auto-updates syntax from DoenetML v0.6 to v0.7. This includes removing `namespace` attributes,
 * etc.
 *
 * See https://github.com/Doenet/DoenetML/issues/474
 */
export function updateSyntaxFromV06toV07(dast: DastRoot) {
    let processor = unified()
        .use(correctElementCapitalization)
        .use(correctAttributeCapitalization)
        .use(removeNewNamespaceAttribute)
        .use(ensureDollarBeforeNamesOnSpecificAttributes)
        .use(copySourceToExtendOrCopy);

    return processor.runSync(dast);
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

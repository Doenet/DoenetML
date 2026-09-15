import { Plugin, unified } from "unified";
import { VFile } from "vfile";
import { DastElementV6, DastRoot, DastRootV6 } from "@doenet/parser";
import { visit } from "@doenet/parser";
import { isDastElement } from "@doenet/parser";
import { toXml } from "@doenet/parser";
import { reparseAttribute, reparseAttributeV6 } from "./reparse-attribute";
import {
    correctAttributeCapitalization,
    correctComponentTypesAttributeCapitalization,
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
import { removeConstraintsElement } from "./remove-constraints-element";
import { removeDefinitionsElement } from "./remove-definitions-element";
import { upgradeDeprecatedAttributes } from "./upgrade-deprecated-attributes";
import { upgradeCopyElements } from "./upgrade-copy-elements";
import { upgradeListProps } from "./upgrade-list-props";
import { upgradeAssignNames } from "./upgrade-assign-names";
import { applyAssignNameRenames } from "./apply-assign-name-renames";
import {
    AssignNamesContext,
    createAssignNamesContext,
} from "./assign-names/context";
import { markAsPropAccess } from "./assign-names/prop-access-parts";
import { convertAssignNames } from "./upgrade-copy-elements";
import { namespaceChainOf } from "./assign-names/context";
import { isModuleComponentType } from "./core-info/determine-prop-type";
import { isV06True } from "./utils";

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
    // Every plugin that consumes `assignNames` registers its renames in one shared
    // context, and `applyAssignNameRenames` rewrites all the references in a single pass
    // afterwards. That way a reference is rewritten exactly once, no matter which plugin
    // claimed the name it used.
    const assignNamesContext = createAssignNamesContext(dast);

    let processor = unified()
        .use(correctElementCapitalization)
        .use(correctAttributeCapitalization)
        .use(correctComponentTypesAttributeCapitalization)
        .use(upgradeDeprecatedAttributes)
        .use(ensureDollarBeforeNamesOnSpecificAttributes)
        .use(upgradePathSlashesToDots)
        .use(removeNewNamespaceAttribute)
        .use(upgradeRefElement)
        .use(copySourceToExtendOrCopy, assignNamesContext)
        .use(upgradeCollectElement, assignNamesContext)
        .use(upgradeMapElement, assignNamesContext)
        .use(upgradeAssignNames, assignNamesContext)
        .use(upgradeCopyElements, assignNamesContext)
        .use(applyAssignNameRenames, assignNamesContext)
        .use(upgradeListProps)
        .use(upgradeModuleElement)
        .use(removeConstraintsElement)
        .use(removeDefinitionsElement);
    if (!options.doNotUpgradeAttributeSyntax) {
        processor = processor.use(upgradeAttributeSyntax, assignNamesContext);
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
    DastRootV6,
    DastRootV6
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
        "copySource",
    ]);

    return (tree) => {
        visit(tree, (node) => {
            if (!isDastElement(node)) {
                return;
            }
            const _node = node as DastElementV6;
            // Check the attributes to see if they need dollar sings
            for (const [name, attr] of Object.entries(_node.attributes)) {
                const attrValue = toXml(attr.children).trim();
                if (
                    attr.type === "attribute" &&
                    ATTRIBUTES_NEEDING_DOLLAR.has(name) &&
                    !attrValue.startsWith("$")
                ) {
                    const newAttrValue = attrValue.startsWith("(")
                        ? `$${attrValue}`
                        : `$(${attrValue})`;
                    attr.children = reparseAttributeV6(newAttrValue);
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
const copySourceToExtendOrCopy: Plugin<
    [AssignNamesContext],
    DastRoot,
    DastRoot
> = (context) => {
    return (tree, file) => {
        visit(tree, (node, info) => {
            if (!isDastElement(node)) {
                return;
            }
            const copySourceAttr = node.attributes["copySource"];
            const linkAttr = node.attributes["link"];
            const copyPropAttr = node.attributes["copyProp"];

            if (!copySourceAttr) {
                return;
            }
            // v0.7 has no `link`: `extend` is always linked and `copy` never is, so the
            // choice between them says it instead. With no `link` at all, v0.6 linked
            // everything except a copy by cid/uri and a copy of a module (the `link`
            // state variable in v0.6's `Copy.js`); here the element's own name is the
            // type of what is being copied, so it answers the module question.
            const targetTag = linkAttr
                ? isV06True(linkAttr)
                    ? "extend"
                    : "copy"
                : isModuleComponentType(node.name)
                  ? "copy"
                  : "extend";

            const baseValue = toXml(copySourceAttr.children).trim();
            let extendValue = baseValue.startsWith("$")
                ? baseValue
                : `$${baseValue}`;
            copySourceAttr.name = targetTag;
            // If there is a `copyProp` attribute, then add it after a `.` to the `extend` attribute
            let appendedPropName: string | undefined;
            if (copyPropAttr) {
                appendedPropName = toXml(copyPropAttr.children).trim();
                extendValue += `.${appendedPropName}`;
                delete node.attributes["copyProp"];
            }
            copySourceAttr.children = reparseAttribute(extendValue);
            if (appendedPropName) {
                // `copyProp` names a prop, so record that for the passes that need to
                // tell a prop apart from a namespace segment.
                const macro = copySourceAttr.children[0];
                if (macro?.type === "macro") {
                    const last = macro.path[macro.path.length - 1];
                    if (last) {
                        markAsPropAccess(last);
                    }
                }
            }

            // This element is the copy, so its single assigned name is simply its
            // `name`. It goes through the shared converter rather than being renamed
            // here so that the name is claimed from the same pool every other pass draws
            // from — otherwise a later `assignNames="a"` elsewhere would happily take it
            // too and the document would carry two components called `a`.
            convertAssignNames(
                node,
                namespaceChainOf(info.parents, context),
                context,
                file,
            );

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
            renameAttrInPlace(node, "uri", "to");
        });
    };
};

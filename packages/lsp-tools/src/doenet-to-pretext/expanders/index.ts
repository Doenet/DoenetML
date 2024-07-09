import type {
    Root as XastRoot,
    RootContent as XastRootContent,
    ElementContent as XastElementContent,
} from "xast";
import type {
    FlatDastRoot,
    FlatDastElementContent,
} from "@doenet/doenetml-worker-rust";
import { visit } from "unist-util-visit";
import { FlatDastElementWithProps } from "../types";
import { _recursiveToPretext } from "..";

type AllDoenetTagNames = FlatDastElementWithProps["name"];

/**
 * Expand all DoenetML-specific tags to their PreTeXt equivalents.
 */
export function expandDoenetElementsToPretext(
    xastRoot: XastRoot | XastRootContent,
    doenetElements: FlatDastRoot["elements"],
) {
    visit(xastRoot, "element", (element, index, parent) => {
        const doenetElement = doenetElements[
            (element.data as any)?.doenetId || -1
        ] as FlatDastElementWithProps;
        if (!doenetElement) {
            // We cannot do anything if we don't have access to the props of the element.
            return;
        }
        const tagName = doenetElement.name;
        switch (tagName) {
            case "boolean": {
                break;
            }
            case "division": {
                const divisionType = doenetElement.data.props.divisionType;
                const titleId = doenetElement.data.props.title;
                if (titleId != null) {
                    const titleElement = _recursiveToPretext(
                        { id: titleId, annotation: "original" },
                        doenetElements,
                    );
                    expandDoenetElementsToPretext(titleElement, doenetElements);
                    element.children.unshift(titleElement);
                }
                Object.assign(element, { name: divisionType });
                break;
            }
            case "document": {
                break;
            }
            case "li": {
                break;
            }
            case "math": {
                break;
            }
            case "ol": {
                break;
            }
            case "p": {
                break;
            }
            case "textInput": {
                // `<textInput>` becomes `<em>$textInput.immediateValue</em>`
                Object.assign(element, {
                    type: "element",
                    name: "em",
                    children: [
                        {
                            type: "text",
                            value: doenetElement.data.props.immediateValue,
                        },
                    ],
                });
                // It cannot be further referenced, so its `name` attribute is removed.
                delete element.attributes.name;
                break;
            }
            case "text": {
                Object.assign(element, {
                    type: "text",
                    value: doenetElement.data.props.value,
                });
                break;
            }
            case "title": {
                break;
            }
            case "ul": {
                break;
            }
            case "xref": {
                break;
            }
            default:
                const _unreachable: never = tagName;
        }
    });
}

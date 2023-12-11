import {
    DastRoot,
    DastElement,
    DastElementContent,
    extractDastErrors,
    isDastElement,
    isDastElementContent,
    lezerToDast,
} from "@doenet/parser";
import { DoenetMLFlags } from "../doenet-applet";

/**
 * Normalize the DAST tree so that it is contained in a single `<document>` element.
 */
export function normalizeDocumentDast(dast: DastRoot) {
    // TODO: for now, ignoring docType children. Should we do something with them?
    let elementContentChildren = dast.children.filter(isDastElementContent);

    elementContentChildren = removeOuterBlankTexts(elementContentChildren);

    let serializedDocument: DastElement;

    if (
        elementContentChildren.length === 1 &&
        isDastElement(elementContentChildren[0]) &&
        elementContentChildren[0].name.toLowerCase() === "document"
    ) {
        serializedDocument = elementContentChildren[0];
    } else {
        serializedDocument = {
            type: "element",
            name: "document",
            children: elementContentChildren,
            attributes: {},
        };
    }

    dast.children = [serializedDocument];

    return dast;
}

function removeOuterBlankTexts(serializedComponents: DastElementContent[]) {
    let firstNonBlankInd: number | undefined,
        lastNonBlankInd: number | undefined;

    // find any beginning or ending blank texts
    for (let ind = 0; ind < serializedComponents.length; ind++) {
        let comp = serializedComponents[ind];
        if (comp.type !== "text" || /\S/.test(comp.value)) {
            if (firstNonBlankInd === undefined) {
                firstNonBlankInd = ind;
            }
            lastNonBlankInd = ind;
        }
    }

    if (lastNonBlankInd !== undefined) {
        serializedComponents = serializedComponents.slice(
            firstNonBlankInd,
            lastNonBlankInd + 1,
        );
    }

    return serializedComponents;
}

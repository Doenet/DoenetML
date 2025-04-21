import { ComponentInfoObjects } from "./componentInfoObjects";
import {
    RecursiveStringArray,
    SerializedComponent,
    WarningRecord,
} from "./dast/types";

/**
 * Match the base-level components of `components` with the entries of `assignNames`.
 * If the `assignNames` entry is a string, then give the component that name.
 * If the `assignNames` entry is an array and the component assigns names to replacements,
 * then set the component's assignNames attribute to be that entry.
 */
export function assignNamesToComponents({
    assignNames,
    serializedComponents,
    indOffset = 0,
    componentInfoObjects,
}: {
    assignNames: RecursiveStringArray;
    serializedComponents: (SerializedComponent | string)[];
    indOffset?: number;
    componentInfoObjects: ComponentInfoObjects;
}) {
    console.log("assignNamesToComponents", {
        assignNames,
        serializedComponents,
    });
    let warnings: WarningRecord[] = [];

    let processedComponents: (SerializedComponent | string)[] = [];

    let numPrimitivesSkipped = 0;

    for (const [ind, component] of serializedComponents.entries()) {
        let indForNames = ind + indOffset;

        let component = serializedComponents[ind];

        if (typeof component === "string") {
            // Blank strings do not take up one of the names from assignNames.
            // All other primitives do use up a name, but they are not actually named
            if (component.trim() === "") {
                numPrimitivesSkipped++;
            }
            processedComponents.push(component);
            continue;
        }

        let nameOrArray = assignNames[indForNames - numPrimitivesSkipped];

        if (nameOrArray) {
            let numToSkip = 0;
            const assignNamesSkip = component.attributes.assignNamesSkip;
            if (
                assignNamesSkip?.type === "primitive" &&
                assignNamesSkip.primitive.type === "number"
            ) {
                // if component is a composite that itself assigns names to composites,
                // it could have an assignNamesSkip attribute, which says that we should
                // recurse to its replacements (possibly multiple times if assignNamesSkip > 1)
                // before continuing the assign names process
                numToSkip += assignNamesSkip.primitive.value;
            }
            // We don't name copy/extracts, so add a skip
            if (
                component.componentType === "copy" ||
                component.componentType === "extract"
            ) {
                numToSkip += 1;
            }
            if (numToSkip > 0) {
                for (let i = 0; i < numToSkip; i++) {
                    nameOrArray = [nameOrArray];
                }
            }

            // If the name is actually an array rather than a name,
            // then it indicates we should use it for assignNames instead,
            // assuming the component actually assigns names to replacement
            if (Array.isArray(nameOrArray)) {
                if (
                    componentInfoObjects.allComponentClasses[
                        component.componentType
                    ].assignNamesToReplacements
                ) {
                    // Make the array "nameOrArray" be the assignNames
                    component = { ...component };
                    component.attributes = {
                        ...component.attributes,
                    };
                    component.attributes.assignNames = {
                        name: "assignNames",
                        type: "primitive",
                        primitive: {
                            type: "recursiveStringArray",
                            value: nameOrArray,
                        },
                    };
                } else {
                    // If a component doesn't assign names, we can't handle a "name" that is an array
                    // so we just ignore the name
                    warnings.push({
                        message: `Cannot assign names recursively to <${component.componentType}>`,
                        level: 1,
                    });
                }
            } else {
                component = { ...component };
                component.attributes = {
                    ...component.attributes,
                };
                component.attributes.name = {
                    type: "primitive",
                    name: "name",
                    primitive: { type: "string", value: nameOrArray },
                };
            }
        }

        processedComponents.push(component);
    }

    return { components: processedComponents, warnings };
}

/**
 * Break a string of space separated words into an array of those words,
 * except if there is a substring in parentheses, then recurse on that substring and the result ot the array.
 *
 * For example "a1 (b21 b22 (c231 c232) b24) a3" becomes
 * ["a1", ["b21", "b22", ["c231", "c232"], "b24"], "a3"].
 *
 * Used for parsing assignNames.
 */
export function breakStringInPiecesBySpacesOrParens(
    string: string,
): { success: false } | { success: true; pieces: RecursiveStringArray } {
    if (typeof string !== "string") {
        return { success: false };
    }

    let nParens = 0;
    const pieces: RecursiveStringArray = [];

    string = string.trim();
    let beginInd = 0;

    for (let ind = 0; ind < string.length; ind++) {
        const char = string[ind];
        if (char === "(") {
            if (nParens === 0) {
                // beginning new parens piece
                // what have so far is a new piece
                const newPiece = string.substring(beginInd, ind).trim();
                if (newPiece.length > 0) {
                    pieces.push(newPiece);
                }
                beginInd = ind;
            }

            nParens++;
        } else if (char === ")") {
            if (nParens === 0) {
                // parens didn't match, so return failure
                return { success: false };
            }
            if (nParens === 1) {
                // found end of piece in parens
                const newPiece = string.substring(beginInd + 1, ind).trim();
                if (newPiece.length > 0) {
                    // try to break further
                    const result =
                        breakStringInPiecesBySpacesOrParens(newPiece);
                    if (result.success === true) {
                        pieces.push(result.pieces);
                    } else {
                        pieces.push(newPiece);
                    }
                }
                beginInd = ind + 1;
            }
            nParens--;
        } else if (nParens === 0 && char.match(/\s/)) {
            // not in parens and found a space so potentially have a new piece
            const newPiece = string.substring(beginInd, ind).trim();
            if (newPiece.length > 0) {
                pieces.push(newPiece);
            }
            beginInd = ind;
        }
    }

    // parens didn't match, so return failure
    if (nParens !== 0) {
        return { success: false };
    }

    const newPiece = string.substring(beginInd, string.length).trim();
    if (newPiece.length > 0) {
        pieces.push(newPiece);
    }

    return {
        success: true,
        pieces,
    };
}

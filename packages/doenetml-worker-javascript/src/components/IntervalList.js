import AuthoredValueList from "./abstract/AuthoredValueList";
import { parseMathText } from "./MathList";

/**
 * A list of intervals. An interval is a math value, so its entries are maths
 * read as intervals, as an `<interval>` reads them.
 */
export default class IntervalList extends AuthoredValueList {
    static componentType = "intervalList";

    static componentDocs = {
        summary: "A list of intervals",
    };

    static listEntryComponentType = "interval";

    static allowInSchemaAsComponent = ["interval"];

    // Include children that can be added due to sugar
    static additionalSchemaChildren = ["math", "string"];

    static listChildGroups = [
        {
            group: "intervals",
            componentTypes: ["interval"],
        },
    ];

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.unordered = {
            createComponentOfType: "boolean",
            createStateVariable: "unorderedPrelim",
            defaultValue: false,
            description:
                "Whether the order of intervals in this list should be treated as unordered (e.g. for matching).",
        };

        return attributes;
    }

    // The pieces are the intervals, each in parentheses or brackets. A piece
    // that is only text stays text, for the list to read
    // (`splitTextIntoPieces`); one that holds a reference is an
    // `<interval>`.
    static returnSugarInstructions() {
        let sugarInstructions = [];

        let createIntervalList = function ({
            matchedChildren,
            nComponents,
            stateIdInfo,
        }) {
            let results = breakEmbeddedStringsIntoIntervalPieces({
                componentList: matchedChildren,
            });

            if (results.success !== true) {
                return { success: false };
            }

            let newChildren = [];
            for (let piece of results.pieces) {
                if (piece.length === 1 && typeof piece[0] === "string") {
                    const last = newChildren[newChildren.length - 1];
                    if (typeof last === "string") {
                        newChildren[newChildren.length - 1] =
                            `${last} ${piece[0]}`;
                    } else {
                        newChildren.push(piece[0]);
                    }
                } else if (piece.length > 1) {
                    newChildren.push({
                        type: "serialized",
                        componentType: "interval",
                        componentIdx: nComponents++,
                        stateId: stateIdInfo
                            ? `${stateIdInfo.prefix}${stateIdInfo.num++}`
                            : undefined,
                        attributes: {},
                        doenetAttributes: {},
                        state: {},
                        children: piece,
                    });
                } else {
                    newChildren.push(piece[0]);
                }
            }

            return { success: true, newChildren, nComponents };
        };

        sugarInstructions.push({
            replacementFunction: createIntervalList,
        });

        return sugarInstructions;
    }

    static splitTextIntoPieces(text) {
        const results = breakEmbeddedStringsIntoIntervalPieces({
            componentList: [text],
        });
        if (results.success !== true) {
            return null;
        }
        return results.pieces.map((piece) => piece.join(""));
    }

    static parseTextPiece(text) {
        return parseMathText(text, {}, { createIntervals: true });
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.numIntervals = {
            isAlias: true,
            targetVariableName: "numComponents",
            description: "The number of intervals in the list.",
        };

        return stateVariableDefinitions;
    }
}

function breakEmbeddedStringsIntoIntervalPieces({ componentList }) {
    let Nparens = 0;
    let pieces = [];
    let currentPiece = [];

    for (let component of componentList) {
        if (typeof component !== "string") {
            if (Nparens === 0) {
                // if not in a parenthesis, isn't an interval
                return { success: false };
            } else {
                currentPiece.push(component);
            }
            continue;
        }

        let s = component.trim();

        let beginInd = 0;

        for (let ind = 0; ind < s.length; ind++) {
            let char = s[ind];

            if (char === "(" || (Nparens === 0 && char === "[")) {
                Nparens++;
            } else if (char === ")" || (Nparens === 1 && char === "]")) {
                if (Nparens === 0) {
                    // parens didn't match, so return failure
                    return { success: false };
                }
                if (Nparens === 1) {
                    // found end of piece in parens
                    if (ind + 1 > beginInd) {
                        let lastInd = ind + 1;
                        let newString = s.substring(beginInd, lastInd).trim();
                        if (newString.length > 0) {
                            currentPiece.push(newString);
                        }
                    }

                    pieces.push(currentPiece);
                    currentPiece = [];
                    beginInd = ind + 1;
                }
                Nparens--;
            } else if (Nparens === 0 && !char.match(/\s/)) {
                // starting a new piece
                // each piece must begin with parens
                return { success: false };
            }
        }

        if (s.length > beginInd) {
            let newString = s.substring(beginInd, s.length).trim();
            currentPiece.push(newString);
        }
    }

    // parens didn't match, so return failure
    if (Nparens !== 0) {
        return { success: false };
    }

    if (currentPiece.length > 0) {
        // didn't have intervals
        return { success: false };
    }

    return {
        success: true,
        pieces: pieces,
    };
}

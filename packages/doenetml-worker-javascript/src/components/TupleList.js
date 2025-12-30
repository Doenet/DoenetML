import MathList from "./MathList";
import { breakEmbeddedStringsIntoParensPieces } from "./commonsugar/breakstrings";

export default class TupleList extends MathList {
    static componentType = "tupleList";

    static includeBlankStringChildren = false;

    static returnSugarInstructions() {
        let sugarInstructions = [];

        let createTupleList = function ({
            matchedChildren,
            nComponents,
            stateIdInfo,
        }) {
            let results = breakEmbeddedStringsIntoParensPieces({
                componentList: matchedChildren,
            });

            if (results.success !== true) {
                return { success: false };
            }

            return {
                success: true,
                newChildren: results.pieces.map(function (piece) {
                    if (piece.length > 1 || typeof piece[0] === "string") {
                        return {
                            type: "serialized",
                            componentType: "math",
                            componentIdx: nComponents++,
                            stateId: stateIdInfo
                                ? `${stateIdInfo.prefix}${stateIdInfo.num++}`
                                : undefined,
                            children: piece,
                            attributes: {},
                            doenetAttributes: {},
                            state: {},
                        };
                    } else {
                        return piece[0];
                    }
                }),
                nComponents,
            };
        };

        sugarInstructions.push({
            replacementFunction: createTupleList,
        });

        return sugarInstructions;
    }
}

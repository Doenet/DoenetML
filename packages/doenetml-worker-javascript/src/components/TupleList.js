import MathList from "./MathList";
import { breakIntoBracketedListEntries } from "./commonsugar/lists";
import { codedDiagnostic } from "../utils/diagnostics";

export default class TupleList extends MathList {
    static componentType = "tupleList";

    static componentDocs = {
        summary:
            "A list of math tuples, parsed from parenthesized comma-separated pieces",
    };

    static includeBlankStringChildren = false;

    static returnSugarInstructions() {
        let sugarInstructions = [];

        let createTupleList = function ({
            matchedChildren,
            nComponents,
            stateIdInfo,
            isAttributeComponent,
            parentComponentType,
        }) {
            let results = breakIntoBracketedListEntries({
                componentList: matchedChildren,
            });

            if (results.success !== true) {
                // The list reads its text itself, by the rule for lists, so
                // brackets that don't balance are ignored there: explain it,
                // as the sugar of the other lists does.
                return {
                    success: false,
                    diagnostics: results.unmatchedBrackets
                        ? [
                              codedDiagnostic({
                                  type: "info",
                                  code: "doenet-i0058",
                                  args: {
                                      componentType: isAttributeComponent
                                          ? parentComponentType
                                          : "tupleList",
                                  },
                              }),
                          ]
                        : [],
                };
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

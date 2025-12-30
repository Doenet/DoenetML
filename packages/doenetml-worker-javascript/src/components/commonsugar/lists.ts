import { ComponentInfoObjects } from "../../utils/componentInfoObjects";
import { SerializedComponent } from "../../utils/dast/types";

export function returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens({
    componentType,
    forceComponentType = false,
    includeNonMacros = false,
}: {
    componentType: string;
    forceComponentType?: boolean;
    includeNonMacros?: boolean;
}) {
    return function ({
        matchedChildren,
        componentInfoObjects,
        nComponents,
        stateIdInfo,
    }: {
        matchedChildren: (string | SerializedComponent)[];
        componentInfoObjects: ComponentInfoObjects;
        nComponents: number;
        stateIdInfo?: { prefix: string; num: number };
    }) {
        // Split strings and interleaving children by spaces in the strings that are outside parens.
        // The resulting groups are wrapped by a componentType unless the group is either
        // - a single non-string component (when forceComponentType is false), or
        // - a single component with a matching componentType (when forceComponentType is true)
        // If includeNonMacros is false
        // then non-string, non-macros components are always their own group of one component
        // and reset the parens count

        let newChildren: (SerializedComponent | string)[] = [];
        let pieces: (SerializedComponent | string)[] = [];

        function createNewChild() {
            let addedSingleMatch = false;
            if (pieces.length === 1) {
                let comp = pieces[0];
                if (typeof comp !== "string") {
                    if (forceComponentType) {
                        // if have a component of the matching componentType
                        // then add that component directly
                        if (
                            componentInfoObjects.componentIsSpecifiedType(
                                comp,
                                componentType,
                            )
                        ) {
                            newChildren.push(comp);
                            addedSingleMatch = true;
                        }
                    } else {
                        // forceComponentType is false so add any single non-string directly
                        newChildren.push(comp);
                        addedSingleMatch = true;
                    }
                }
            }

            if (!addedSingleMatch && pieces.length > 0) {
                // wrap anything else in componentType
                newChildren.push({
                    type: "serialized",
                    componentType,
                    children: pieces,
                    componentIdx: nComponents++,
                    stateId: stateIdInfo
                        ? `${stateIdInfo.prefix}${stateIdInfo.num++}`
                        : undefined,
                    attributes: {},
                    state: {},
                    doenetAttributes: {},
                });
            }

            pieces = [];
        }

        let nParens = 0;

        for (let child of matchedChildren) {
            if (typeof child !== "string") {
                if (
                    !(
                        includeNonMacros ||
                        (child.extending && "Ref" in child.extending)
                    )
                ) {
                    createNewChild();
                    pieces.push(child);
                    createNewChild();
                    nParens = 0;
                } else {
                    pieces.push(child);
                }
            } else {
                let s = child;

                let beginInd = 0;

                for (let ind = 0; ind < s.length; ind++) {
                    let char = s[ind];

                    if (char === "(") {
                        nParens++;
                    } else if (char === ")") {
                        if (nParens === 0) {
                            // parens didn't match, so just make a child out of what have so far
                            createNewChild();
                        } else {
                            nParens--;
                        }
                    } else if (nParens === 0 && char.match(/\s/)) {
                        // found a space outside parens

                        if (ind > beginInd) {
                            pieces.push(s.substring(beginInd, ind));
                        }

                        createNewChild();

                        beginInd = ind + 1;
                    }
                }

                if (s.length > beginInd) {
                    pieces.push(s.substring(beginInd, s.length));
                }
            }
        }

        createNewChild();

        return {
            success: true,
            newChildren,
            nComponents,
        };
    };
}

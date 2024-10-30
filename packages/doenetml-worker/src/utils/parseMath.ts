type CompositeReplacementRange = {
    firstInd: number;
    lastInd: number;
    asList: boolean;
    hidden: boolean;
    potentialListComponents: boolean[];
};

// concatenate strings with a numbered code for each non-string child
// (that will be parsed to form express}ion with codes)
// Add commas between the components that are all from one composite,
// if that composite has asList set to true.
// Put parens around that list in some cases, as described below.
export function createInputStringFromChildren({
    children,
    codePre,
    format,
    createInternalLists = false,
    parser,
}: {
    children: any;
    codePre: string;
    format: "latex" | "text";
    createInternalLists?: boolean;
    parser: (arg0: string) => any;
}) {
    let nonStringInd = 0;
    let nonStringIndByChild: (null | number)[] = [];
    for (let child of children) {
        if (typeof child === "string") {
            nonStringIndByChild.push(null);
        } else {
            nonStringIndByChild.push(nonStringInd);
            nonStringInd++;
        }
    }

    let result = createInputStringFromChildrenSub({
        compositeReplacementRange: children.compositeReplacementRange,
        children,
        startInd: 0,
        endInd: children.length - 1,
        nonStringIndByChild,
        format,
        codePre,
        createInternalLists,
        nextInternalListInd: nonStringInd,
        parser,
    });

    return {
        string: result.newChildren.join(""),
        internalLists: result.internalLists,
    };
}

function createInputStringFromChildrenSub({
    compositeReplacementRange,
    children,
    startInd,
    endInd,
    nonStringIndByChild,
    format,
    codePre,
    potentialListComponents,
    createInternalLists,
    nextInternalListInd,
    parser,
}: {
    compositeReplacementRange: CompositeReplacementRange[] | undefined;
    children: any;
    startInd: number;
    endInd: number;
    nonStringIndByChild: (null | number)[];
    format: "latex" | "text";
    codePre: string;
    potentialListComponents?: boolean[];
    createInternalLists: boolean;
    nextInternalListInd: number;
    parser: (arg0: string) => any;
}): {
    newChildren: string[];
    newPotentialListComponents: boolean[];
    internalLists: Record<string, any>;
} {
    let newChildren: string[] = [];
    let newPotentialListComponents: boolean[] = [];
    let lastChildInd = startInd - 1;
    let internalLists: Record<string, any> = {};

    let leftDelimiters = ["{", "[", "(", "|", ","];
    let rightDelimiters = ["}", "]", ")", "|", ","];

    if (compositeReplacementRange) {
        for (
            let rangeInd = 0;
            rangeInd < compositeReplacementRange.length;
            rangeInd++
        ) {
            let range = compositeReplacementRange[rangeInd];

            let rangeFirstInd = range.firstInd;
            let rangeLastInd = range.lastInd;

            if (rangeFirstInd > lastChildInd && rangeLastInd <= endInd) {
                if (lastChildInd + 1 < rangeFirstInd) {
                    for (
                        let ind = lastChildInd + 1;
                        ind < rangeFirstInd;
                        ind++
                    ) {
                        // we are not grouping these children
                        // but we are separately turning each one into a string
                        // (turning the non-string children into a code based on codePre and its nonStringInd)
                        newChildren.push(
                            baseStringFromChildren({
                                children,
                                startInd: ind,
                                endInd: ind,
                                nonStringIndByChild,
                                format,
                                codePre,
                            }),
                        );
                    }
                    if (potentialListComponents) {
                        // Since we didn't change the components,
                        // their status of being a potential list component is not changed
                        newPotentialListComponents.push(
                            ...potentialListComponents.slice(
                                lastChildInd - startInd + 1,
                                rangeFirstInd - startInd,
                            ),
                        );
                    }
                }

                // If a composite produced composites that produced children,
                // then this outer composite is first in the array of replacement ranges.
                // We first process the children corresponding to any of these replacement composites,
                // which will concatenate the replacements of each composite into a single text,
                // which may be be turned into a list according to the settings of that composite.

                // We remove the replacement range of the current composite (any all earlier ones)
                let subReplacementRange = compositeReplacementRange.slice(
                    rangeInd + 1,
                );

                let {
                    newChildren: childrenInRange,
                    newPotentialListComponents: potentialListComponentsInRange,
                    internalLists: newInternalLists,
                } = createInputStringFromChildrenSub({
                    compositeReplacementRange: subReplacementRange,
                    children,
                    startInd: rangeFirstInd,
                    endInd: rangeLastInd,
                    nonStringIndByChild,
                    format,
                    codePre,
                    potentialListComponents: range.potentialListComponents,
                    createInternalLists,
                    nextInternalListInd,
                    parser,
                });

                Object.assign(internalLists, newInternalLists);
                nextInternalListInd += Object.keys(newInternalLists).length;

                let allAreListComponents = potentialListComponentsInRange.every(
                    (x) => x,
                );

                if (
                    range.asList &&
                    allAreListComponents &&
                    childrenInRange.length > 1
                ) {
                    // add commas between all children from a single composite
                    let listString = childrenInRange
                        .filter((v) => v.trim() !== "")
                        .map((v, i, a) =>
                            i === a.length - 1 ? v : v.trimEnd(),
                        )
                        .join(", ");

                    // The following implements the logic to determine if this comma-separated list
                    // should be wrapped by parens.
                    // Wrap with parens if the lists is surrounded by a non-delimiter on either side.
                    // The parens will generally turn the list into a tuple (or to arguments of a function)
                    // when it is parsed into a math-expression.

                    let wrap = false;

                    // First check if there is a non-delimiter to the left
                    if (rangeFirstInd > 0) {
                        let prevInd = rangeFirstInd - 1;
                        while (prevInd >= 0) {
                            let prevChild = children[prevInd];
                            if (typeof prevChild === "string") {
                                prevChild = prevChild.trim();
                                if (prevChild.length > 0) {
                                    if (
                                        !leftDelimiters.includes(
                                            prevChild[prevChild.length - 1],
                                        )
                                    ) {
                                        // The string to the left did not contain one of the delimiters,
                                        // so we must wrap the list.
                                        wrap = true;
                                    }
                                    break;
                                }
                            } else {
                                // There is a non-string child to the left,
                                // so we must wrap the list
                                wrap = true;
                            }
                        }
                    }

                    if (!wrap) {
                        // Since we didn't have a non-delimiter to the left,
                        // check if there is a non-delimiter to the right.
                        if (rangeLastInd < children.length - 1) {
                            let nextInd = rangeLastInd + 1;
                            while (nextInd <= children.length - 1) {
                                let nextChild = children[nextInd];
                                if (typeof nextChild === "string") {
                                    nextChild = nextChild.trim();
                                    if (nextChild.length > 0) {
                                        let nextChar = nextChild[0];
                                        // If the format is latex,
                                        // the delimiter could be escaped by a \
                                        if (
                                            format === "latex" &&
                                            nextChar === "\\" &&
                                            nextChild.length > 1
                                        ) {
                                            nextChar = nextChild[1];
                                        }
                                        if (
                                            !rightDelimiters.includes(nextChar)
                                        ) {
                                            // The string to the right did not contain one of the delimiters,
                                            // so we must wrap the list.
                                            wrap = true;
                                        }
                                        break;
                                    }
                                } else {
                                    // There is a non-string child to the right,
                                    // so we must wrap the list
                                    wrap = true;
                                }
                            }
                        }
                    }

                    if (wrap) {
                        if (createInternalLists) {
                            // if `createInternalLists` is set, rather than wrapping in parens,
                            // we will put a list into the ast at this point
                            // (even though one wouldn't be able to get that by parsing a string into math)
                            let code = codePre + nextInternalListInd;
                            internalLists[code] = parser(listString);
                            nextInternalListInd++;
                            listString = returnStringForCode(format, code);
                        } else {
                            listString = "(" + listString + ")";
                        }
                    }

                    newChildren.push(listString);
                } else {
                    // We are not turning the children in a list,
                    // so just concatenate the strings
                    newChildren.push(childrenInRange.join(""));
                }

                if (potentialListComponents) {
                    // record whether the result from the composite (a single string now)
                    // should be considered a list component for any outer composite
                    newPotentialListComponents.push(allAreListComponents);
                }
                lastChildInd = rangeLastInd;
            }
        }
    }

    if (lastChildInd < endInd) {
        for (let ind = lastChildInd + 1; ind <= endInd; ind++) {
            // we are not grouping these children
            // but we are separately turning each one into a string
            // (turning the non-string children into a code based on codePre and its nonStringInd)
            newChildren.push(
                baseStringFromChildren({
                    children,
                    startInd: ind,
                    endInd: ind,
                    nonStringIndByChild,
                    format,
                    codePre,
                }),
            );
        }

        if (potentialListComponents) {
            // Since we didn't change the components,
            // their status of being a potential list component is not changed
            newPotentialListComponents.push(
                ...potentialListComponents.slice(
                    lastChildInd - startInd + 1,
                    endInd - startInd + 1,
                ),
            );
        }
    }

    return {
        newChildren,
        newPotentialListComponents,
        internalLists,
    };
}

// concatenate string children and codes from non-string children
// into a single string to be parsed into a math expression
function baseStringFromChildren({
    children,
    startInd,
    endInd,
    nonStringIndByChild,
    format,
    codePre,
}: {
    children: any[];
    startInd: number;
    endInd: number;
    nonStringIndByChild: (null | number)[];
    format: "latex" | "text";
    codePre: string;
}) {
    let str = "";

    for (let ind = startInd; ind <= endInd; ind++) {
        let child = children[ind];
        if (typeof child === "string") {
            str += " " + child + " ";
        } else {
            // a non-string
            let code = codePre + nonStringIndByChild[ind];

            let nextString = returnStringForCode(format, code);

            str += nextString;
        }
    }

    return str;
}
function returnStringForCode(format: string, code: string) {
    let nextString;
    if (format === "latex") {
        // for latex, must explicitly denote that code
        // is a multicharacter variable
        nextString = "\\operatorname{" + code + "}";
    } else {
        // for text, just make sure code is surrounded by spaces
        // (the presence of numbers inside code will ensure that
        // it is parsed as a multicharacter variable)
        nextString = " " + code + " ";
    }
    return nextString;
}

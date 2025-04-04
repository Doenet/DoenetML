export function textFromComponent(component: any): string {
    if (typeof component !== "object") {
        return component.toString();
    } else if (component.stateValues.hidden) {
        return "";
    } else if (typeof component.stateValues.text === "string") {
        return component.stateValues.text;
    } else {
        return " ";
    }
}

// Concatenate the text from children into one string.
// Add commas between the components that are all from one composite
// if that composite has asList set to true
export function textFromChildren(
    children: any,
    textFromComponentConverter = textFromComponent,
) {
    let result = textFromChildrenSub({
        compositeReplacementRange: children.compositeReplacementRange,
        children,
        startInd: 0,
        endInd: children.length - 1,
        textFromComponentConverter,
    });

    return result.newChildren.map(textFromComponentConverter).join("");
}

function textFromChildrenSub({
    compositeReplacementRange,
    children,
    startInd,
    endInd,
    textFromComponentConverter,
    potentialListComponents,
}: {
    compositeReplacementRange: {
        firstInd: number;
        lastInd: number;
        asList: boolean;
        hidden: boolean;
        potentialListComponents: boolean[];
    }[];
    children: any;
    startInd: number;
    endInd: number;
    textFromComponentConverter: (
        value: any,
        index: number,
        array: any[],
    ) => string;
    potentialListComponents?: boolean[];
}) {
    let newChildren: any[] = [];
    let newPotentialListComponents: boolean[] = [];
    let lastChildInd = startInd - 1;

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
                // don't process these children, so just add them back to newChildren
                newChildren.push(
                    ...children.slice(lastChildInd + 1, rangeFirstInd),
                );
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

            if (!range.hidden) {
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
                } = textFromChildrenSub({
                    compositeReplacementRange: subReplacementRange,
                    children,
                    startInd: rangeFirstInd,
                    endInd: rangeLastInd,
                    textFromComponentConverter,
                    potentialListComponents: range.potentialListComponents,
                });

                let allAreListComponents = potentialListComponentsInRange.every(
                    (x) => x,
                );

                if (
                    range.asList &&
                    allAreListComponents &&
                    childrenInRange.length > 1
                ) {
                    // add commas between all children from a single composite
                    // (after converting them into strings)
                    // trimming any white space to the right of all but the last child
                    // so that there is not a space before each comma
                    newChildren.push(
                        childrenInRange
                            .map(textFromComponentConverter)
                            .filter((v) => v !== "")
                            .map((v, i, a) =>
                                i === a.length - 1 ? v : v.trimEnd(),
                            )
                            .join(", "),
                    );
                } else {
                    // We are not turning the children in a list,
                    // so just convert the children into strings and concatentate
                    newChildren.push(
                        childrenInRange
                            .map(textFromComponentConverter)
                            .join(""),
                    );
                }

                if (potentialListComponents) {
                    // record whether the result from the composite (a single string now)
                    // should be considered a list component for any outer composite
                    newPotentialListComponents.push(allAreListComponents);
                }
            }
            lastChildInd = rangeLastInd;
        }
    }

    if (lastChildInd < endInd) {
        // don't process these children, so just add them back to newChildren
        newChildren.push(...children.slice(lastChildInd + 1, endInd + 1));
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

    return { newChildren, newPotentialListComponents };
}

export function returnTextPieceStateVariableDefinitions() {
    let stateVariableDefinitions: any = {};

    stateVariableDefinitions.numWords = {
        public: true,
        shadowingInstructions: {
            createComponentOfType: "integer",
        },
        returnDependencies: () => ({
            value: {
                dependencyType: "stateVariable",
                variableName: "value",
            },
        }),
        definition({
            dependencyValues,
        }: {
            dependencyValues: { value: string };
        }) {
            return {
                setValue: {
                    numWords: dependencyValues.value.trim().split(/\s+/).length,
                },
            };
        },
    };

    stateVariableDefinitions.words = {
        public: true,
        shadowingInstructions: {
            createComponentOfType: "text",
        },
        isArray: true,
        entryPrefixes: ["word"],
        returnArraySizeDependencies: () => ({
            numWords: {
                dependencyType: "stateVariable",
                variableName: "numWords",
            },
        }),
        returnArraySize({
            dependencyValues,
        }: {
            dependencyValues: { numWords: number };
        }) {
            return [dependencyValues.numWords];
        },
        returnArrayDependenciesByKey() {
            let globalDependencies = {
                value: {
                    dependencyType: "stateVariable",
                    variableName: "value",
                },
            };

            return { globalDependencies };
        },
        arrayDefinitionByKey({
            globalDependencyValues,
        }: {
            globalDependencyValues: { value: string };
        }) {
            return {
                setValue: {
                    words: globalDependencyValues.value.trim().split(/\s+/),
                },
            };
        },
    };

    stateVariableDefinitions.numCharacters = {
        public: true,
        shadowingInstructions: {
            createComponentOfType: "integer",
        },
        returnDependencies: () => ({
            value: {
                dependencyType: "stateVariable",
                variableName: "value",
            },
        }),
        definition({
            dependencyValues,
        }: {
            dependencyValues: { value: string };
        }) {
            // @ts-ignore
            const itr = new Intl.Segmenter("en", {
                granularity: "grapheme",
            }).segment(dependencyValues.value);
            return {
                setValue: { numCharacters: [...itr].length },
            };
        },
    };

    stateVariableDefinitions.characters = {
        public: true,
        shadowingInstructions: {
            createComponentOfType: "text",
        },
        isArray: true,
        entryPrefixes: ["character"],
        returnArraySizeDependencies: () => ({
            numCharacters: {
                dependencyType: "stateVariable",
                variableName: "numCharacters",
            },
        }),
        returnArraySize({
            dependencyValues,
        }: {
            dependencyValues: { numCharacters: number };
        }) {
            return [dependencyValues.numCharacters];
        },
        returnArrayDependenciesByKey() {
            let globalDependencies = {
                value: {
                    dependencyType: "stateVariable",
                    variableName: "value",
                },
            };

            return { globalDependencies };
        },
        arrayDefinitionByKey({
            globalDependencyValues,
        }: {
            globalDependencyValues: { value: string };
        }) {
            // @ts-ignore
            const itr = new Intl.Segmenter("en", {
                granularity: "grapheme",
            }).segment(globalDependencyValues.value);

            return {
                setValue: {
                    characters: Array.from(itr, ({ segment }) => segment),
                },
            };
        },
    };

    stateVariableDefinitions.numListItems = {
        public: true,
        shadowingInstructions: {
            createComponentOfType: "integer",
        },
        returnDependencies: () => ({
            value: {
                dependencyType: "stateVariable",
                variableName: "value",
            },
        }),
        definition({
            dependencyValues,
        }: {
            dependencyValues: { value: string };
        }) {
            return {
                setValue: {
                    numListItems: dependencyValues.value.trim().split(",")
                        .length,
                },
            };
        },
    };

    stateVariableDefinitions.list = {
        public: true,
        shadowingInstructions: {
            createComponentOfType: "text",
        },
        isArray: true,
        entryPrefixes: ["listItem"],
        returnArraySizeDependencies: () => ({
            numListItems: {
                dependencyType: "stateVariable",
                variableName: "numListItems",
            },
        }),
        returnArraySize({
            dependencyValues,
        }: {
            dependencyValues: { numListItems: number };
        }) {
            return [dependencyValues.numListItems];
        },
        returnArrayDependenciesByKey() {
            let globalDependencies = {
                value: {
                    dependencyType: "stateVariable",
                    variableName: "value",
                },
            };

            return { globalDependencies };
        },
        arrayDefinitionByKey({
            globalDependencyValues,
        }: {
            globalDependencyValues: { value: string };
        }) {
            return {
                setValue: {
                    list: globalDependencyValues.value
                        .trim()
                        .split(",")
                        .map((s) => s.trim()),
                },
            };
        },
    };

    return stateVariableDefinitions;
}

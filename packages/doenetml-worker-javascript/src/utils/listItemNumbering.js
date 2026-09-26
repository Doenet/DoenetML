/**
 * List-item numbering that sees through `<cascade>`.
 *
 * A section numbered as a list item — a `<problem>` in a `<problems>`, a
 * `<part>` in a `<problem>` — used to take its number from its position among
 * its own sibling sections. A `<cascade>` is not a section, so the problems
 * inside one were numbered among themselves and the problems after it skipped
 * over it: `<problems><cascade><problem/><problem/></cascade><problem/></problems>`
 * numbered 1, 2, 1.
 *
 * Instead, the parent numbers its children. `listItemNumbersOfChildren` walks
 * the parent's children in order with one counter: a section takes the next
 * number, and a cascade is recorded at the counter's current value — the number
 * of items before it — and then advances it by the items it holds
 * (`numListItems`). A cascade numbers its own children the same way, starting
 * from the value its parent recorded for it (`listItemOffset`), so nested
 * cascades continue one sequence.
 *
 * The count is the one the sibling count made — every sectioning child counts,
 * whether or not it is itself a list item — so the numbering of a list that has
 * no cascade in it is unchanged.
 *
 * Counts flow up (`numListItems` reads only children) and offsets flow down
 * (`listItemOffset` reads only the parent), so there is no cycle. None of it
 * reads visibility or credit: which steps a cascade has revealed does not move a
 * number, and answering a question recomputes none of this.
 */

/**
 * Whether `componentType` is a `<cascade>`, whose items are counted through it.
 */
function isCascade(componentType, componentInfoObjects) {
    return componentInfoObjects.isInheritedComponentType({
        inheritedComponentType: componentType,
        baseComponentType: "cascade",
    });
}

/**
 * Whether `componentType` is a sectioning component, which is one item.
 */
function isSection(componentType, componentInfoObjects) {
    return componentInfoObjects.isInheritedComponentType({
        inheritedComponentType: componentType,
        baseComponentType: "_sectioningComponent",
    });
}

/**
 * `listItemNumbersOfChildren`: an object mapping the component index of each
 * sectioning child to its list-item number, and of each cascade child to the
 * number of items before it.
 *
 * @param {object} params
 * @param {boolean} params.hasOffset - whether the component has a
 *   `listItemOffset` to start counting from (a cascade); otherwise counting
 *   starts at zero.
 */
export function returnListItemNumbersOfChildrenDefinition({
    hasOffset = false,
} = {}) {
    return {
        returnDependencies: () => ({
            children: {
                dependencyType: "child",
                includeAllChildren: true,
                variableNames: ["numListItems"],
                variablesOptional: true,
            },
            ...(hasOffset
                ? {
                      listItemOffset: {
                          dependencyType: "stateVariable",
                          variableName: "listItemOffset",
                      },
                  }
                : {}),
        }),
        definition({ dependencyValues, componentInfoObjects }) {
            let counter = dependencyValues.listItemOffset ?? 0;
            const listItemNumbersOfChildren = {};

            for (const child of dependencyValues.children) {
                if (typeof child !== "object") {
                    continue;
                }
                if (isCascade(child.componentType, componentInfoObjects)) {
                    listItemNumbersOfChildren[child.componentIdx] = counter;
                    counter += child.stateValues.numListItems ?? 0;
                } else if (
                    isSection(child.componentType, componentInfoObjects)
                ) {
                    counter++;
                    listItemNumbersOfChildren[child.componentIdx] = counter;
                }
            }

            return { setValue: { listItemNumbersOfChildren } };
        },
    };
}

/**
 * A cascade's `numListItems`, the number of items it adds to the list around
 * it, and `listItemOffset`, the number of items before it.
 */
export function returnCascadeListItemCountDefinitions() {
    return {
        numListItems: {
            returnDependencies: () => ({
                children: {
                    dependencyType: "child",
                    includeAllChildren: true,
                    variableNames: ["numListItems"],
                    variablesOptional: true,
                },
            }),
            definition({ dependencyValues, componentInfoObjects }) {
                let numListItems = 0;
                for (const child of dependencyValues.children) {
                    if (typeof child !== "object") {
                        continue;
                    }
                    if (isCascade(child.componentType, componentInfoObjects)) {
                        numListItems += child.stateValues.numListItems ?? 0;
                    } else if (
                        isSection(child.componentType, componentInfoObjects)
                    ) {
                        numListItems++;
                    }
                }
                return { setValue: { numListItems } };
            },
        },
        listItemOffset: {
            returnDependencies: () => ({
                parentListItemNumbers: {
                    dependencyType: "parentStateVariable",
                    variableName: "listItemNumbersOfChildren",
                },
            }),
            definition({ dependencyValues, componentIdx }) {
                return {
                    setValue: {
                        listItemOffset:
                            dependencyValues.parentListItemNumbers?.[
                                componentIdx
                            ] ?? 0,
                    },
                };
            },
        },
    };
}

/**
 * The list-item number a section's parent gave it, falling back to its count
 * among its sibling sections when the parent numbers no children (a parent
 * that is neither a section nor a cascade).
 */
export function listItemNumberFromParent({
    parentListItemNumbers,
    componentIdx,
    countAmongSiblings,
}) {
    return parentListItemNumbers?.[componentIdx] ?? countAmongSiblings;
}

/**
 * The dependencies a list-item section numbers itself from: the numbers its
 * parent gave its children, and its count among its sibling sections as the
 * fallback. Requested only while the section is a list item, so a parent with
 * no list items never works its numbering out.
 */
export function listItemNumberDependencies() {
    return {
        parentListItemNumbers: {
            dependencyType: "parentStateVariable",
            variableName: "listItemNumbersOfChildren",
        },
        countAmongSiblingsForListItem: {
            dependencyType: "countAmongSiblings",
            componentType: "_sectioningComponent",
            includeInheritedComponentTypes: true,
        },
    };
}

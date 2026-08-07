/**
 * Whether a child puts anything on the screen: a non-blank string always does,
 * a component only if its class declares a `rendererType`.
 *
 * A list item delegates its inline first-line rendering, and the alignment of
 * its hanging number (or, for a real `<li>`, its native marker), to its first
 * visible child, so a child that renders nothing must never be picked as that
 * child — doing so strands the child that actually renders first, which then
 * keeps its top margin and never gets to report the alignment it needs.
 * `<setup>` and `<variantControl>` are the common offenders and are typically
 * already excluded as configuration children; this covers the rest
 * (`<animateFromSequence>`, `<solveEquations>`, …).
 *
 * Composites are not a loophole even though none of them declares a
 * `rendererType`: a composite is replaced by its replacements in
 * `activeChildren` unless the parent names its component type in a child group
 * (see `findChildGroup()`), and `<setup>` — which really does render nothing —
 * is the only composite typically named this way.
 */
export function childRendersSomething(
    child: any,
    componentInfoObjects: any,
): boolean {
    if (typeof child !== "object") {
        return child.trim() !== "";
    }

    return Boolean(
        componentInfoObjects.allComponentClasses[child.componentType]
            ?.rendererType,
    );
}

/**
 * Adds list-item inline-rendering state variables for components that may suppress
 * their top margin when they are the first visible child in a list item.
 */
export function returnListItemChildStateVariableDefinitions({
    checkInlineVariable = false,
    listItemInlineAlignment = "baseline",
} = {}) {
    return {
        renderInlineForListItem: {
            forRenderer: true,
            additionalStateVariablesDefined: [
                { variableName: "listItemInlineAlignment", forRenderer: true },
            ],
            returnDependencies: () => {
                const dependencies: Record<string, any> = {
                    parentChildrenToRenderInlineForListItem: {
                        dependencyType: "parentStateVariable",
                        variableName: "childrenToRenderInlineForListItem",
                    },
                };

                if (checkInlineVariable) {
                    dependencies.inline = {
                        dependencyType: "stateVariable",
                        variableName: "inline",
                    };
                }

                return dependencies;
            },
            definition({
                dependencyValues,
                componentIdx,
            }: {
                dependencyValues: Record<string, any>;
                componentIdx: number;
            }) {
                const shouldRenderInline = returnShouldRenderInline({
                    dependencyValues,
                    componentIdx,
                });

                return {
                    setValue: {
                        renderInlineForListItem: shouldRenderInline,
                        listItemInlineAlignment: shouldRenderInline
                            ? listItemInlineAlignment
                            : "none",
                    },
                };
            },
        },
    };
}

/**
 * Adds pass-through list-item state variables for wrapper components.
 *
 * Wrappers forward list-item inline rendering to the first non-blank,
 * non-label child component so nested block components can adjust spacing
 * and alignment.
 */
export function returnPassThroughListItemChildStateVariableDefinitions() {
    const stateVariableDefinitions: Record<string, any> = {};
    stateVariableDefinitions.renderInlineForListItem = {
        forRenderer: true,
        returnDependencies: () => ({
            parentChildrenToRenderInlineForListItem: {
                dependencyType: "parentStateVariable",
                variableName: "childrenToRenderInlineForListItem",
            },
        }),
        definition({
            dependencyValues,
            componentIdx,
        }: {
            dependencyValues: Record<string, any>;
            componentIdx: number;
        }) {
            const shouldRenderInline = returnShouldRenderInline({
                dependencyValues,
                componentIdx,
            });

            return {
                setValue: {
                    renderInlineForListItem: shouldRenderInline,
                },
            };
        },
    };

    stateVariableDefinitions.childrenToRenderInlineForListItem = {
        returnDependencies: () => ({
            parentChildrenToRenderInlineForListItem: {
                dependencyType: "parentStateVariable",
                variableName: "childrenToRenderInlineForListItem",
            },
            allChildren: {
                dependencyType: "child",
                includeAllChildren: true,
            },
        }),
        definition({
            dependencyValues,
            componentIdx,
        }: {
            dependencyValues: Record<string, any>;
            componentIdx: number;
        }) {
            let childrenToRenderInlineForListItem: any[] = [];
            const shouldRenderInline = returnShouldRenderInline({
                dependencyValues,
                componentIdx,
            });

            // If component is in the list of children to render inline,
            // then set its childrenToRenderInlineForListItem to be its first non-blank child

            if (shouldRenderInline) {
                const firstNonBlankNonLabelChild =
                    dependencyValues.allChildren.find((child: any) => {
                        if (typeof child === "object") {
                            return child.componentType !== "label";
                        }
                        if (typeof child === "string") {
                            return child.trim() !== "";
                        }
                        return false;
                    });

                if (
                    firstNonBlankNonLabelChild &&
                    typeof firstNonBlankNonLabelChild === "object"
                ) {
                    childrenToRenderInlineForListItem = [
                        firstNonBlankNonLabelChild,
                    ];
                }
            }

            return {
                setValue: {
                    childrenToRenderInlineForListItem,
                },
            };
        },
    };

    stateVariableDefinitions.listItemInlineAlignment = {
        forRenderer: true,
        stateVariablesDeterminingDependencies: [
            "childrenToRenderInlineForListItem",
        ],
        returnDependencies: ({
            stateValues,
        }: {
            stateValues: Record<string, any>;
        }) => {
            const dependencies: Record<string, any> = {
                parentChildrenToRenderInlineForListItem: {
                    dependencyType: "parentStateVariable",
                    variableName: "childrenToRenderInlineForListItem",
                },
            };

            const child = stateValues.childrenToRenderInlineForListItem?.[0];
            if (child && typeof child === "object") {
                dependencies[`childListItemInlineAlignment`] = {
                    dependencyType: "stateVariable",
                    componentIdx: child.componentIdx,
                    variableName: "listItemInlineAlignment",
                    variablesOptional: true,
                };
            }

            return dependencies;
        },
        definition({
            dependencyValues,
            componentIdx,
        }: {
            dependencyValues: Record<string, any>;
            componentIdx: number;
        }) {
            const shouldRenderInline = returnShouldRenderInline({
                dependencyValues,
                componentIdx,
            });

            if (!shouldRenderInline) {
                return {
                    setValue: { listItemInlineAlignment: "none" },
                };
            }

            const childAlignment =
                dependencyValues[`childListItemInlineAlignment`];
            if (
                childAlignment === "baseline" ||
                childAlignment === "flex-start"
            ) {
                return {
                    setValue: {
                        listItemInlineAlignment: childAlignment,
                    },
                };
            }

            return {
                setValue: {
                    listItemInlineAlignment: "none",
                },
            };
        },
    };

    return stateVariableDefinitions;
}

/**
 * Determines if this component is selected by its parent to render inline for list-item layout.
 */
function returnShouldRenderInline({
    dependencyValues,
    componentIdx,
}: {
    dependencyValues: Record<string, any>;
    componentIdx: number;
}) {
    const parentChildrenToRenderInlineForListItem =
        dependencyValues.parentChildrenToRenderInlineForListItem;
    return Boolean(
        !dependencyValues.inline &&
        parentChildrenToRenderInlineForListItem
            ?.map((c: { componentIdx: number }) => c.componentIdx)
            .includes(componentIdx),
    );
}

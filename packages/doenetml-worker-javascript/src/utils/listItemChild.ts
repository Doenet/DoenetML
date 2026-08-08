/**
 * The `variableNames` a caller must request on its children so that
 * {@link childRendersSomething} can tell a child that hid itself from one that
 * renders.
 *
 * `hiddenIgnoreParent`, not `hidden`: the question here is whether *this* child
 * took itself off the screen, not whether an ancestor took the whole subtree
 * off it. If a list item is hidden, nothing in it renders and which child leads
 * it stops mattering; whereas asking `hidden` would be both wrong and unusable.
 * Wrong because `<cascade>` hides its unrevealed children through
 * `childrenToHide`, so the lead of a not-yet-revealed section would change as
 * the cascade advances. Unusable because `hidden` depends on the parent's
 * `childrenToHide` (`BaseComponent`) while a section's
 * `childIndicesToRender`/`firstVisibleChild` and its `childrenToHide` are fed by
 * one shared dependency helper — asking `hidden` there makes `childrenToHide`
 * depend on the `hidden` it feeds, and the core refuses to load a
 * `<problem><task>` document at all, reporting a circular dependency between
 * them. `hiddenIgnoreParent` depends on neither, so it cycles nowhere. See
 * `BaseComponent`'s `hiddenIgnoreParent` and its use by `<choice>`'s `text`.
 */
export const LIST_ITEM_CHILD_VARIABLE_NAMES = ["hiddenIgnoreParent"];

/**
 * Whether a child puts anything on the screen: a non-blank string always does,
 * a component only if its class declares a `rendererType` and it has not hidden
 * itself.
 *
 * A list item delegates its top-margin suppression, and the alignment of its
 * hanging number (or, for a real `<li>`, its native marker), to its first
 * visible child, so a child that renders nothing must never be picked as that
 * child — doing so strands the child that actually renders first, which then
 * keeps its top margin and never gets to report the alignment it needs.
 * `<setup>` and `<variantControl>` are the common offenders (a section also
 * excludes both as configuration children); the `rendererType` test covers the
 * rest (`<animateFromSequence>`, `<solveEquations>`, …), and the
 * `hiddenIgnoreParent` test covers a child of a rendering kind that is
 * nonetheless not on the screen, such as a `<p hide>`.
 *
 * Composites are not a loophole even though none of them declares a
 * `rendererType`: naming the base type `_base`, as both `<li>` and sections do
 * for their catch-all child group, deliberately does not match a composite (see
 * `findChildGroupNoAdapters()`), so composites always expand to their
 * replacements in `activeChildren`.
 *
 * The caller must request {@link LIST_ITEM_CHILD_VARIABLE_NAMES} (with
 * `variablesOptional: true`) on the child dependency it passes children from. A
 * child arriving without `stateValues` — from a dependency that asked for no
 * variables — is treated as not hidden, which is the pre-#1668 behavior rather
 * than a silent misjudgment.
 */
export function childRendersSomething(
    child: any,
    componentInfoObjects: any,
): boolean {
    if (typeof child !== "object") {
        return child.trim() !== "";
    }

    if (child.stateValues?.hiddenIgnoreParent) {
        return false;
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

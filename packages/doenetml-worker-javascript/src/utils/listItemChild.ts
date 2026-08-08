/**
 * Whether a child's *kind* can put anything on the screen: a non-blank string
 * always can, a component only if its class declares a `rendererType`.
 *
 * A list item delegates its top-margin suppression, and the alignment of its
 * hanging number (or, for a real `<li>`, its native marker), to its first
 * visible child, so a child that renders nothing must never be picked as that
 * child — doing so strands the child that actually renders first, which then
 * keeps its top margin and never gets to report the alignment it needs.
 * `<setup>` and `<variantControl>` are the common offenders (a section also
 * excludes both as configuration children); this covers the rest
 * (`<animateFromSequence>`, `<solveEquations>`, …).
 *
 * Composites are not a loophole even though none of them declares a
 * `rendererType`: naming the base type `_base`, as both `<li>` and sections do
 * for their catch-all child group, deliberately does not match a composite (see
 * `findChildGroupNoAdapters()`), so composites always expand to their
 * replacements in `activeChildren`.
 *
 * Known limitation: this asks what a child's component type *could* render, not
 * whether this particular child is actually rendered, because it does not
 * consult the child's own `hidden`. So a `<p hide>` still wins the lead of its
 * list item even though the renderer drops it, stranding the child after it.
 * The limitation is pre-existing and shared with the section path
 * (`SectioningComponent`'s `firstVisibleChild`, which honors only the
 * section-wide `hideChildren` broadcast); `lists.test.ts` pins the current
 * behavior down for both. Fixing it means giving both call sites a `hidden`
 * dependency on their children, deliberately not done here so `<li>` and
 * `<task>` keep behaving identically.
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
 * A state variable definition that relays "the list-item context I sit in draws a
 * native browser `::marker`" down from the parent.
 *
 * `renderInlineForListItem` cannot answer that question: it is shared by a real
 * `<ol>/<ul>` `<li>` and by a `<problem asList>` section, which draws its own
 * number with a `::before`/grid column (see `section.tsx`) and needs no help
 * beyond the top-margin suppression that signal already buys it. Only `<li>`
 * defines `listItemHasNativeMarker` as `true` (see `Lists.js`); everything that
 * forwards `childrenToRenderInlineForListItem` must forward this alongside it
 * (`<answer>`, `<sideBySide>`, and every pass-through wrapper), or the chain
 * stops there and a nested `<choiceInput>` reports `false`. Anything else — a
 * section, or any unrelated parent — has no such state variable, and
 * `parentStateVariable` dependencies are optional, so the value comes back
 * `null` and reads as `false`.
 *
 * The value is deliberately *not* gated on this component being the child the
 * list item selected for inline alignment, so it means exactly one thing:
 * "a native marker exists somewhere up my list-item chain". Consumers that act
 * on it combine it with their own `renderInlineForListItem` — see the
 * `<legend>`/`<div>` choice in `choiceInput.tsx`, the one place that needs the
 * distinction.
 */
export function returnListItemHasNativeMarkerDefinition({
    forRenderer = false,
}: { forRenderer?: boolean } = {}) {
    return {
        forRenderer,
        returnDependencies: () => ({
            parentListItemHasNativeMarker: {
                dependencyType: "parentStateVariable",
                variableName: "listItemHasNativeMarker",
            },
        }),
        definition({
            dependencyValues,
        }: {
            dependencyValues: Record<string, any>;
        }) {
            return {
                setValue: {
                    listItemHasNativeMarker: Boolean(
                        dependencyValues.parentListItemHasNativeMarker,
                    ),
                },
            };
        },
    };
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
 *
 * `listItemHasNativeMarker` is relayed too, so a `<choiceInput>` nested a wrapper
 * deep (`<li><div><choiceInput>`, `<li><blockQuote><answer><choiceInput>`, …) still
 * learns that a native `::marker` is at stake.
 */
export function returnPassThroughListItemChildStateVariableDefinitions() {
    const stateVariableDefinitions: Record<string, any> = {};
    stateVariableDefinitions.listItemHasNativeMarker =
        returnListItemHasNativeMarkerDefinition();
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

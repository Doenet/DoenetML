/**
 * Whether a child's *kind* can put anything on the screen: a non-blank string
 * always can, a component only if its class declares a `rendererType`.
 *
 * A list item delegates its inline first-line rendering, and the alignment of
 * its hanging number (or, for a real `<li>`, its native marker), to its first
 * visible child, so a child that renders nothing must never be picked as that
 * child — doing so strands the child that actually renders first, which then
 * keeps its top margin and never gets to report the alignment it needs.
 * `<setup>` and `<variantControl>` are the common offenders. A section excludes
 * both as configuration children; an `<li>` names neither in a child group, but
 * reaches the same answer anyway — `<setup>` is a composite that expands to zero
 * replacements, and `<variantControl>` has no `rendererType`. This check covers
 * the rest (`<animateFromSequence>`, `<solveEquations>`, …).
 *
 * Composites are not a loophole even though none of them declares a
 * `rendererType`: a composite is replaced by its replacements in
 * `activeChildren` unless the parent names its component type in a child group
 * — and naming the base type `_base`, as both `<li>` and sections do for their
 * catch-all group, deliberately does not match a composite (see
 * `findChildGroupNoAdapters()`), so composites always expand.
 *
 * Known limitation: this asks what a child's component type *could* render, not
 * whether this particular child is actually rendered, because it does not
 * consult the child's own `hidden`. So a `<p hide>` still wins the lead of its
 * list item even though the renderer drops it, which strands the child after it
 * exactly as described above. The renderer half of the machinery does not share
 * the blind spot — `markLeadingParagraphOfListItem()` in `list.tsx` skips the
 * `null` the core sends for an unrendered child — so the two disagree for a
 * hidden lead child. This is pre-existing and shared with the `<task>`/section
 * path (`SectioningComponent`'s `firstVisibleChild`, which honors only the
 * section-wide `hideChildren` broadcast), and `lists.test.ts` pins the current
 * behavior down. Fixing it means giving both call sites a `hidden` dependency on
 * their children; it is deliberately not done here so that `<li>` and `<task>`
 * keep behaving identically.
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
 * beyond the top-margin suppression the signal already buys it. Only `<li>`
 * defines `listItemHasNativeMarker` as `true` (see `Lists.js`); everything else
 * either relays it or, having no such parent state variable, reports `false` —
 * `parentStateVariable` dependencies are always optional, so an unrelated parent
 * simply yields `null`.
 *
 * The value is deliberately *not* gated on this component being the child the
 * list item selected for inline alignment, so it means exactly one thing:
 * "a native marker exists somewhere up my list-item chain". Consumers that act
 * on it combine it with their own `renderInlineForListItem` — see the
 * `<legend>`/`<div>` choice in `choiceInput.tsx`, the one place that needs the
 * distinction.
 */
function returnListItemHasNativeMarkerDefinition({
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
 *
 * Pass `includeHasNativeMarker` to also define `listItemHasNativeMarker` — see
 * {@link returnListItemHasNativeMarkerDefinition}. Only `<choiceInput>` needs it,
 * so it is opt-in rather than given to all ten consumers of this mixin.
 */
export function returnListItemChildStateVariableDefinitions({
    checkInlineVariable = false,
    listItemInlineAlignment = "baseline",
    includeHasNativeMarker = false,
} = {}) {
    return {
        ...(includeHasNativeMarker
            ? {
                  listItemHasNativeMarker:
                      returnListItemHasNativeMarkerDefinition({
                          forRenderer: true,
                      }),
              }
            : {}),
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
 * learns that a native `::marker` is at stake. Without the relay the chain stops
 * at the wrapper and reports `false`, which leaves the `<legend>` in place and the
 * marker misaligned in exactly the way this machinery exists to prevent.
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

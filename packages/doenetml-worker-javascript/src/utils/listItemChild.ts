/**
 * The fields to spread into a `child` dependency whose children are handed to
 * {@link childRendersSomething}. Pass any other variables the same dependency
 * needs; callers go through this rather than naming `hiddenIgnoreParent`
 * themselves, so that all of them ask the same question of the same variable and
 * none of them can leave `variablesOptional` off.
 *
 * `hiddenIgnoreParent`, not `hidden`: the question is whether *this* child took
 * itself off the screen, not whether an ancestor took the whole subtree off it.
 * Nothing in a hidden list item renders, so which child leads it does not matter
 * while it is hidden — but the lead it shows once revealed must not depend on
 * having been hidden, and `hidden` would move it: `<ol hide>`, a hidden section,
 * and a `<cascade>` step held back until earlier ones are done all set their
 * descendants' `hidden` while leaving `hiddenIgnoreParent` alone. The
 * hidden-container tests in `lists.test.ts` and `sectioning.test.ts` are what
 * fails if this becomes `hidden`. It is not a cycle argument: with the request
 * confined to state variables `childrenToHide` cannot reach, `hidden` loads every
 * document fine and simply fails those two tests. See `BaseComponent`'s
 * `hiddenIgnoreParent` and its use by `<choice>`'s `text`.
 *
 * `variablesOptional` reads a class that does not define `hiddenIgnoreParent` as
 * "not hidden" rather than failing the document — no class does today, since
 * `BaseComponent` defines it for all of them — and it leaves "component child
 * with no `stateValues` at all" meaning exactly one thing; see
 * {@link childRendersSomething}.
 */
export function listItemChildVisibilityDependency(...alsoRequest: string[]): {
    variableNames: string[];
    variablesOptional: true;
} {
    return {
        variableNames: [...alsoRequest, "hiddenIgnoreParent"],
        variablesOptional: true,
    };
}

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
 * The `rendererType` test covers a child whose kind draws nothing at all
 * (`<animateFromSequence>`, `<solveEquations>`, …), and the `hiddenIgnoreParent`
 * test covers a child of a rendering kind that is nonetheless not on the screen,
 * such as a `<p hide>`. A `<setup>` reaches neither test and never could: a
 * section takes it out as a configuration child, and inside an `<li>` or a
 * wrapper it is not an active child at all.
 *
 * Composites are not a loophole even though none of them declares a
 * `rendererType`: naming the base type `_base`, as both `<li>` and sections do
 * for their catch-all child group, deliberately does not match a composite (see
 * `findChildGroupNoAdapters()`), so composites always expand to their
 * replacements in `activeChildren`. A composite hidden with `hide` is caught on
 * those replacements, which inherit `hiddenIgnoreParent` from their source
 * composite.
 *
 * Every caller must spread {@link listItemChildVisibilityDependency} into the
 * child dependency it passes children from. The call sites are the links of one
 * chain — an `<li>` or a section picks its lead, and a wrapper, an `<answer>`, or
 * a `<sideBySide>` that wins that lead forwards it to a child of its own — so a
 * link that skipped the test would leave the chain's end on something not on the
 * screen. All five, one row of the lead-selection matrix in `lists.test.ts`
 * each. The first three find their lead with this test; the last two pick their
 * target by a rule of their own and use this only to filter what that rule may
 * pick:
 *
 *   - `Li`'s `childrenToRenderInlineForListItem`
 *   - `SectioningComponent`'s `firstVisibleChild`
 *   - the wrapper pass-through in
 *     {@link returnPassThroughListItemChildStateVariableDefinitions}
 *   - `<answer>`'s `renderInlineForListItem`, which forwards to the first block
 *     `<choiceInput>` among its inputs
 *   - `<sideBySide>`'s `listItemInlineAlignment`, which reads the alignment off
 *     its leading panel
 *
 * A component child arriving without `stateValues` means a call site that did
 * not spread it, and throws rather than defaulting to "not hidden" — which would
 * silently restore the pre-fix answer, leaving the next call site looking correct
 * and being wrong. The throw aborts the document, but it is unreachable from a
 * correct call site, since a `child` dependency requesting any variable gives
 * every component child a `stateValues` object, empty at worst
 * (`Dependency.getValueNoProxy()`). So only a mistake in this file's own callers
 * reaches it, and the first test that renders a list item does.
 */
export function childRendersSomething(
    child: any,
    componentInfoObjects: any,
): boolean {
    if (typeof child !== "object") {
        return child.trim() !== "";
    }

    if (child.stateValues === undefined) {
        throw Error(
            `childRendersSomething() received a <${child.componentType}> child with no stateValues: ` +
                "spread listItemChildVisibilityDependency() into the child dependency it came from.",
        );
    }

    if (child.stateValues.hiddenIgnoreParent) {
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
 * Wrappers forward list-item inline rendering to their first visible non-label
 * child component so nested block components can adjust spacing and alignment.
 *
 * "Visible" is {@link childRendersSomething}, the same test the `<li>` and
 * section paths use to pick their own lead, so the chain reaches the same child
 * at every level. A wrapper that forwarded to a child rendering nothing — a
 * `<p hide>`, an `<animateFromSequence>` — would strand the child that renders
 * first one level down: in
 * `<li><div><p hide/><answer><choiceInput/></answer></div></li>` the
 * `<choiceInput>` would keep the `<legend>` #1668 removed and the marker would
 * drop to the first choice's row.
 *
 * `<label>` is excluded on top of that test: a label does render, but it is the
 * wrapper's own naming, not the content the item's number lines up with.
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
                ...listItemChildVisibilityDependency(),
            },
        }),
        definition({
            dependencyValues,
            componentIdx,
            componentInfoObjects,
        }: {
            dependencyValues: Record<string, any>;
            componentIdx: number;
            componentInfoObjects: any;
        }) {
            let childrenToRenderInlineForListItem: any[] = [];
            const shouldRenderInline = returnShouldRenderInline({
                dependencyValues,
                componentIdx,
            });

            // If component is in the list of children to render inline, forward
            // the signal to its first visible non-label child.

            if (shouldRenderInline) {
                const firstVisibleNonLabelChild =
                    dependencyValues.allChildren.find(
                        (child: any) =>
                            !(
                                typeof child === "object" &&
                                child.componentType === "label"
                            ) &&
                            childRendersSomething(child, componentInfoObjects),
                    );

                if (
                    firstVisibleNonLabelChild &&
                    typeof firstVisibleNonLabelChild === "object"
                ) {
                    childrenToRenderInlineForListItem = [
                        firstVisibleNonLabelChild,
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

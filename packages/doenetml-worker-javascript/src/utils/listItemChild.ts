/**
 * The fields to spread into the `child` dependency whose children are handed to
 * {@link childRendersSomething}, so that it can tell a child that hid itself
 * from one that renders. Callers spread this rather than naming the variable
 * themselves, so that all of them ask the same question of the same variable.
 *
 * `variablesOptional` is what lets {@link childRendersSomething} tell its two
 * failure modes apart. `hiddenIgnoreParent` is defined on `BaseComponent`, so
 * every component child has it today; if some class ever stopped defining it,
 * this flag degrades that child to "not hidden" (`stateValues` present,
 * `hiddenIgnoreParent` `undefined`) instead of failing the whole document on a
 * missing state variable. A child arriving with no `stateValues` at all then
 * means only one thing — a call site that did not spread this — which is why
 * that case throws. Without the flag the two would be indistinguishable core
 * errors. String children are unaffected either way: a `child` dependency
 * resolves them as primitives and never looks a variable up on them.
 *
 * `hiddenIgnoreParent`, not `hidden`: the question here is whether *this* child
 * took itself off the screen, not whether an ancestor took the whole subtree off
 * it. If a list item is hidden, nothing in it renders and which child leads it
 * stops mattering — but the lead it will show when it is revealed must not
 * depend on having been hidden. `hidden` would move it: `<ol hide>`, a hidden
 * section, and a `<cascade>` step whose children stay hidden until it is
 * revealed all set their descendants' `hidden` while leaving
 * `hiddenIgnoreParent` alone, so revealing the container would shift a number
 * that had settled. The `<cascade>` and hidden-container tests in
 * `cascade.test.ts`, `lists.test.ts` and `sectioning.test.ts` fail if this
 * becomes `hidden`, which is the guard on that reasoning.
 *
 * `hidden` also drags in a dependency this has no use for. It reads its parent's
 * `childrenToHide` (`BaseComponent`), which for a section's child is the very
 * section asking the question, so a caller has to keep the two apart to stay
 * acyclic — see `returnSectionChildDependencies()`, where asking for *any*
 * visibility variable from `childrenToHide` closes a cycle. Measured, for the
 * record: with that request confined to `childIndicesToRender`, switching this to
 * `hidden` does not cycle, it just fails the tests above. The cycle and the
 * semantics are separate arguments, and the semantics is the one that decides it.
 * See `BaseComponent`'s `hiddenIgnoreParent` and its use by `<choice>`'s `text`.
 */
export const LIST_ITEM_CHILD_VISIBILITY_DEPENDENCY = {
    variableNames: ["hiddenIgnoreParent"],
    variablesOptional: true,
};

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
 * replacements in `activeChildren`. A composite hidden with `hide` is caught on
 * those replacements, which inherit `hiddenIgnoreParent` from their source
 * composite.
 *
 * Every caller must spread {@link LIST_ITEM_CHILD_VISIBILITY_DEPENDENCY} into
 * the child dependency it passes children from — today `Li`'s
 * `childrenToRenderInlineForListItem`, `SectioningComponent`'s
 * `childIndicesToRender`/`firstVisibleChild`, and the wrapper pass-through in
 * {@link returnPassThroughListItemChildStateVariableDefinitions}. The three link
 * into one chain (an `<li>` leads with a wrapper, which leads with a child of
 * its own), so a link that skipped the test would put the chain's end on
 * something not on the screen.
 *
 * A component child that arrives without `stateValues` is a call site that did
 * not spread it, and throws rather than falling back to "not hidden": the
 * fallback would hand back the pre-fix answer — exactly the misjudgment this
 * test exists to prevent — and would do it silently, so a fourth call site added
 * later would look correct and be wrong. It cannot fire for a call site that did
 * spread it: a `child` dependency that requests any variable gives every
 * component child a `stateValues` object (`Dependency.getValueNoProxy()`), empty
 * at worst.
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
                "spread LIST_ITEM_CHILD_VISIBILITY_DEPENDENCY into the child dependency it came from.",
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
 * `<p hide>`, a `<setup>` — would strand the child that actually renders first
 * one level down and undo the whole delegation: in
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
                ...LIST_ITEM_CHILD_VISIBILITY_DEPENDENCY,
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

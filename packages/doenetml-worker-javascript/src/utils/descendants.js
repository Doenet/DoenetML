export function gatherDescendants({
    ancestor,
    descendantTypes,
    recurseToMatchedChildren = true,
    useReplacementsForComposites = false,
    includeNonActiveChildren = false,
    skipOverAdapters = false,
    ignoreReplacementsOfMatchedComposites = false,
    ignoreReplacementsOfEncounteredComposites = false,
    init = true,
    componentInfoObjects,
}) {
    // Note: ignoreReplacementsOfEncounteredComposites means ignore replacements
    // of all composites except copies of external content

    let matchChildToTypes = (child) =>
        descendantTypes.some((ct) =>
            componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: child.componentType,
                baseComponentType: ct,
            }),
        );

    let childrenToCheck = [];

    if (
        useReplacementsForComposites &&
        componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: ancestor.componentType,
            baseComponentType: "_composite",
        })
    ) {
        if (init) {
            // if not init, parent will also be checked.
            // Since replacements will be children of parent,
            // don't need to gather them here
            childrenToCheck.push(
                ...replacementsForComposites({
                    composite: ancestor,
                    componentInfoObjects,
                    includeComposites: includeNonActiveChildren,
                }).filter((x) => typeof x === "object"),
            );
        }
    } else {
        // add children in the order of allChildren ordered
        for (let childIdx of ancestor.allChildrenOrdered) {
            let childObj = ancestor.allChildren[childIdx];
            let child;
            let childIsActive = false;
            let childIsAdapter = false;
            if (childObj) {
                child = childObj.component;
                if (child.adaptedFrom) {
                    childIsAdapter = true;
                }
                if (ancestor.activeChildren.includes(child)) {
                    childIsActive = true;
                }
            } else {
                // must have a placeholder
                // look in activeChildren
                // include the placeholders adapted into the activeChildren
                for (let aChild of ancestor.activeChildren) {
                    if (aChild.placeholderInd === childIdx) {
                        child = aChild;
                        childIsActive = true;
                        if (
                            typeof childIdx === "string" &&
                            childIdx.substring(
                                childIdx.length - 5,
                                childIdx.length,
                            ) === "adapt"
                        ) {
                            childIsAdapter = true;
                        }
                        break;
                    } else if (
                        aChild.adaptedFrom &&
                        aChild.adaptedFrom.placeholderInd === childIdx
                    ) {
                        child = aChild.adaptedFrom;
                        break;
                    }
                }
            }

            if (child) {
                if (childIsAdapter && skipOverAdapters) {
                    if (!childrenToCheck.includes(child.adaptedFrom)) {
                        childrenToCheck.push(child.adaptedFrom);
                    }
                } else if (childIsActive || includeNonActiveChildren) {
                    childrenToCheck.push(child);
                }
            }
        }
    }

    if (
        ignoreReplacementsOfMatchedComposites ||
        ignoreReplacementsOfEncounteredComposites
    ) {
        // first check if have matched any composites, so can ignore their replacements
        let namesToIgnore = [];
        for (let child of childrenToCheck) {
            let checkChildForReplacements = matchChildToTypes(child);
            if (
                ignoreReplacementsOfEncounteredComposites &&
                !checkChildForReplacements
            ) {
                // we explicitly will not ignore replacements of copies of external content
                checkChildForReplacements = !(
                    child.componentType === "_copy" &&
                    child.doenetAttributes.copiedURI
                );
            }
            if (
                checkChildForReplacements &&
                componentInfoObjects.isInheritedComponentType({
                    inheritedComponentType: child.componentType,
                    baseComponentType: "_composite",
                })
            ) {
                namesToIgnore = [
                    ...namesToIgnore,
                    ...replacementsForComposites({
                        composite: child,
                        componentInfoObjects,
                        includeComposites: true,
                    })
                        .filter((x) => typeof x === "object")
                        .map((x) =>
                            x.componentIdx ? x.componentIdx : x.placeholderInd,
                        ),
                ];
            }
        }

        if (namesToIgnore.length > 0) {
            childrenToCheck = childrenToCheck.filter(
                (x) =>
                    !(
                        namesToIgnore.includes(x.componentIdx) ||
                        namesToIgnore.includes(x.placeholderInd)
                    ),
            );
        }
    }

    let descendants = [];

    for (let child of childrenToCheck) {
        let matchedChild = matchChildToTypes(child);
        if (matchedChild) {
            descendants.push({
                componentIdx: child.componentIdx
                    ? child.componentIdx
                    : child.placeholderInd,
                componentType: child.componentType,
            });
        }

        if (
            (!matchedChild || recurseToMatchedChildren) &&
            child.placeholderInd === undefined
        ) {
            // recurse
            let additionalDescendants = gatherDescendants({
                ancestor: child,
                descendantTypes,
                recurseToMatchedChildren,
                useReplacementsForComposites,
                includeNonActiveChildren,
                skipOverAdapters,
                ignoreReplacementsOfMatchedComposites,
                ignoreReplacementsOfEncounteredComposites,
                init: false,
                componentInfoObjects,
            });
            descendants.push(...additionalDescendants);
        }
    }

    return descendants;
}

function replacementsForComposites({
    composite,
    includeComposites = false,
    componentInfoObjects,
}) {
    let replacements = [];

    if (composite.replacements) {
        let originalReplacements;
        if (composite.replacementsToWithhold) {
            let numReplacements =
                composite.replacements.length -
                composite.replacementsToWithhold;
            originalReplacements = composite.replacements.slice(
                0,
                numReplacements,
            );
        } else {
            originalReplacements = composite.replacements;
        }

        for (let replacement of originalReplacements) {
            if (
                componentInfoObjects.isInheritedComponentType({
                    inheritedComponentType: replacement.componentType,
                    baseComponentType: "_composite",
                })
            ) {
                if (includeComposites) {
                    replacements.push(replacement);
                }
                replacements.push(
                    ...replacementsForComposites({
                        composite: replacement,
                        componentInfoObjects,
                        includeComposites,
                    }),
                );
            } else {
                replacements.push(replacement);
            }
        }
    }

    return replacements;
}

/**
 * Return the component indices of all ancestors of `comp`, following both the
 * parent chain and, for a replacement, the chain of the composite that created
 * it.
 */
export function ancestorsIncludingComposites(comp, components) {
    return ancestorsIncludingCompositesMemoized(comp, components, new Map());
}

/**
 * The recursion behind `ancestorsIncludingComposites`, with `memo` mapping a
 * component index to the ancestors already computed for it in this call.
 *
 * The two chains we follow converge: a composite's replacements are placed
 * under the composite's own parent, so `comp` and `comp.replacementOf`
 * typically share ancestors. Without `memo`, a component sitting under `k`
 * nested composites would walk the shared upper chain `2^k` times. The
 * component graph does not change while we recurse, so a repeat visit can
 * reuse the earlier answer.
 *
 * A memoized array can be handed back to more than one caller within the
 * recursion, so it must not be mutated. `memo` is created fresh per top-level
 * call and discarded with it, so the array that reaches the outside caller is
 * unaliased.
 */
function ancestorsIncludingCompositesMemoized(comp, components, memo) {
    if (comp.ancestors === undefined || comp.ancestors.length === 0) {
        return [];
    }

    const memoized = memo.get(comp.componentIdx);
    if (memoized) {
        return memoized;
    }

    let comps = [comp.ancestors[0].componentIdx];

    let parent = components[comp.ancestors[0].componentIdx];
    if (parent) {
        comps.push(
            ...ancestorsIncludingCompositesMemoized(parent, components, memo),
        );
    }

    if (comp.replacementOf) {
        comps.push(comp.replacementOf.componentIdx);
        let replacementAs = ancestorsIncludingCompositesMemoized(
            comp.replacementOf,
            components,
            memo,
        );
        for (let a of replacementAs) {
            if (!comps.includes(a)) {
                comps.push(a);
            }
        }
    }

    memo.set(comp.componentIdx, comps);

    return comps;
}

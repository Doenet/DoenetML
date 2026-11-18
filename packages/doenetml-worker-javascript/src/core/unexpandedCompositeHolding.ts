import type Core from "../Core";

/**
 * Which composite, not yet expanded, holds each component written inside it
 * in the DoenetML, by component index, as found when `core` had
 * `numComponents` components. Kept per core, and found again when the
 * composite recorded for a component has expanded since, which may have made
 * a composite inside it that holds the component now, or, for a component
 * none held, once components have been added since. A composite made by an
 * expansion can take an index below `numComponents`, as the indices of what
 * is written in the DoenetML are given out when it loads, so the count alone
 * does not show that it was made.
 */
const holdersByCore = new WeakMap<
    Core,
    { numComponents: number; holders: Map<number, any> }
>();

/**
 * The composite, not yet expanded, whose content written in the DoenetML
 * holds the component `componentIdx`, which doesn't exist yet: the
 * `<group>` `g` of `<group name="g"><number name="n">2</number></group>`
 * holds `n` until it expands. `undefined` when there is none, or when it is
 * being expanded already (a cycle, which is reported where it is found).
 *
 * A composite inside another is made only when that one expands, so the
 * outer one is found first, and the inner one once the outer has expanded.
 * A composite that shadows another holds no content of its own, so it isn't
 * searched.
 */
export function unexpandedCompositeHolding(
    core: Core,
    componentIdx: number,
): any {
    let found = holdersByCore.get(core);
    let holder = found?.holders.get(componentIdx);
    if (
        found === undefined ||
        (!isUnexpanded(holder) &&
            (holder !== undefined ||
                found.numComponents !== core._components.length))
    ) {
        found = {
            numComponents: core._components.length,
            holders: findHolders(core),
        };
        holdersByCore.set(core, found);
        holder = found.holders.get(componentIdx);
    }
    if (
        !isUnexpanded(holder) ||
        core.updateInfo.compositesBeingExpanded.includes(holder.componentIdx)
    ) {
        return undefined;
    }
    return holder;
}

/** Whether `component` is a composite that hasn't expanded. */
function isUnexpanded(component: any): boolean {
    return (
        component != null &&
        !component.isExpanded &&
        component.replacementsWorkspace !== undefined &&
        !component.shadows &&
        "readyToExpandWhenResolved" in component.state
    );
}

/**
 * The composites of `core` not yet expanded, by the index of each component
 * written inside one of them.
 */
function findHolders(core: Core): Map<number, any> {
    const holders = new Map<number, any>();
    for (const component of core._components as any[]) {
        if (isUnexpanded(component)) {
            recordHeld(component.serializedChildren, component, holders);
        }
    }
    return holders;
}

/**
 * Record `holder` for each component of the serialized components
 * `serialized`, their descendants and what their attributes hold.
 */
function recordHeld(serialized: any, holder: any, holders: Map<number, any>) {
    if (!Array.isArray(serialized)) {
        return;
    }
    for (const component of serialized) {
        if (typeof component !== "object" || component === null) {
            continue;
        }
        if (typeof component.componentIdx === "number") {
            holders.set(component.componentIdx, holder);
        }
        recordHeld(component.children, holder, holders);
        for (const attribute of Object.values(
            component.attributes ?? {},
        ) as any[]) {
            if (attribute?.component) {
                recordHeld([attribute.component], holder, holders);
            }
            recordHeld(attribute?.children, holder, holders);
            recordHeld(attribute?.references, holder, holders);
        }
    }
}

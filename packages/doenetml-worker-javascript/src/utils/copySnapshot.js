import { deepClone, serializedComponentsReplacer } from "@doenet/utils";

/**
 * What an unlinked copy (`copy=`) made of its source when it was made, for
 * each component among its serialized replacements: its essential state and
 * its primitive (string) children, with its `stateId` and `componentType`.
 * The primitive children are held because a write to a value defined by
 * one, such as dragging `<point>(1,2)</point>`, changes the child itself
 * rather than any essential state.
 *
 * A copy present when a document loads is made again on every load, from
 * its source as it is then: after a reader has changed the source and
 * reloaded, as they are restored. So that it keeps what it showed, a save
 * holds its snapshot when a copy made then would not show the same
 * (`snapshotStillMade`, `StatePersistence.recordCopySnapshots`), and a copy
 * made again on load takes the saved one (`applyCopySnapshot`).
 */
export function copySnapshotOf(serializedComponents) {
    const snapshot = [];
    function visit(component) {
        if (typeof component !== "object" || component === null) {
            return;
        }
        if (component.stateId !== undefined) {
            const primitiveChildren = {};
            (component.children ?? []).forEach((child, ind) => {
                if (typeof child !== "object" || child === null) {
                    primitiveChildren[ind] = child;
                }
            });
            snapshot.push({
                stateId: component.stateId,
                componentType: component.componentType,
                state: deepClone(component.state ?? {}),
                ...(Object.keys(primitiveChildren).length > 0
                    ? { primitiveChildren }
                    : {}),
            });
        }
        for (const child of component.children ?? []) {
            visit(child);
        }
        for (const attribute of Object.values(component.attributes ?? {})) {
            visit(attribute?.component);
        }
    }
    for (const component of serializedComponents) {
        visit(component);
    }
    return snapshot;
}

/**
 * Give the serialized replacements of an unlinked copy the essential state
 * and primitive children that `snapshot` holds for their `stateId` and
 * `componentType`, and return the entries of `snapshot` that no replacement
 * took.
 *
 * Only state and primitive children are held, not the replacements' shape.
 * A copy made again need not make the components it made before: a copy of
 * a `<conditionalContent>` is made from whichever case is active then, so
 * its replacements can be fewer, or others, and a component of another type
 * can have a `stateId` an earlier one had. An entry therefore applies only
 * to a replacement of its own `componentType` (an entry without one, from
 * before it was held, applies to none), and none applies within a
 * replacement that has an entry for its `stateId` of another type: that
 * replacement and what it contains were made from other DoenetML. An entry
 * that no replacement takes is returned for the copy to keep holding (a
 * later load may make that component again), not restored now.
 */
export function applyCopySnapshot(serializedComponents, snapshot) {
    const byStateId = new Map();
    for (const entry of snapshot) {
        if (!byStateId.has(entry.stateId)) {
            byStateId.set(entry.stateId, []);
        }
        byStateId.get(entry.stateId).push(entry);
    }
    const applied = new Set();
    function visit(component) {
        if (typeof component !== "object" || component === null) {
            return;
        }
        const entries = byStateId.get(component.stateId) ?? [];
        const entry = entries.find(
            (entry) =>
                !applied.has(entry) &&
                entry.componentType === component.componentType,
        );
        if (entries.length > 0 && !entry) {
            // made from other DoenetML than what was held
            return;
        }
        if (entry) {
            applied.add(entry);
            component.state = deepClone(entry.state);
            for (const [ind, child] of Object.entries(
                entry.primitiveChildren ?? {},
            )) {
                const current = component.children?.[ind];
                if (
                    current !== undefined &&
                    (typeof current !== "object" || current === null)
                ) {
                    component.children[ind] = child;
                }
            }
        }
        for (const child of component.children ?? []) {
            visit(child);
        }
        for (const attribute of Object.values(component.attributes ?? {})) {
            visit(attribute?.component);
        }
    }
    for (const component of serializedComponents) {
        visit(component);
    }
    return snapshot.filter((entry) => !applied.has(entry));
}

function isEmpty(value) {
    return (
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.every((entry) => entry == null)) ||
        (typeof value === "object" &&
            value.constructor === Object &&
            Object.keys(value).length === 0)
    );
}

function same(a, b) {
    return (
        JSON.stringify(a, serializedComponentsReplacer) ===
        JSON.stringify(b, serializedComponentsReplacer)
    );
}

/**
 * Whether a copy made now (`fresh`, a `copySnapshotOf` its replacements)
 * would show what the copy made with `snapshot` shows. A value `fresh`
 * holds that `snapshot` does not was not yet computed on its source when
 * the copy was made, and a copy made again would compute it as the copy
 * has: it matches when the copy's component (`componentOfStateId`) has that
 * value now.
 */
export async function snapshotStillMade(fresh, snapshot, componentOfStateId) {
    if (fresh.length !== snapshot.length) {
        return false;
    }
    for (let ind = 0; ind < fresh.length; ind++) {
        const now = fresh[ind];
        const then = snapshot[ind];
        if (
            now.stateId !== then.stateId ||
            now.componentType !== then.componentType ||
            !same(now.primitiveChildren, then.primitiveChildren)
        ) {
            return false;
        }
        for (const name of new Set([
            ...Object.keys(now.state),
            ...Object.keys(then.state),
        ])) {
            if (name in then.state) {
                if (!same(now.state[name], then.state[name])) {
                    return false;
                }
                continue;
            }
            // an essential value holding nothing (no writes to a list's
            // entries) holds nothing a copy could lose
            if (isEmpty(now.state[name])) {
                continue;
            }
            const component = componentOfStateId(now.stateId);
            if (
                !component?.state?.[name] ||
                !same(await component.stateValues[name], now.state[name])
            ) {
                return false;
            }
        }
    }
    return true;
}

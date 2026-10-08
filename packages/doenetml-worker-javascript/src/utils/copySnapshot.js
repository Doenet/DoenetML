import { deepClone, serializedComponentsReplacer } from "@doenet/utils";

/**
 * What an unlinked copy (`copy=`) made of its source when it was made, for
 * each component among its serialized replacements: its essential state, its
 * primitive (string) children, and what it holds of its source's `fixed` and
 * `fixLocation` (`copySourceContext`), with its `stateId`. The primitive
 * children are held because a write to a value defined by one, such as
 * dragging `<point>(1,2)</point>`, changes the child itself rather than any
 * essential state.
 *
 * A copy present when a document loads is made again on every load, from
 * its source as it is then: after a reader has changed the source and
 * reloaded, as they are restored. So that it keeps what it showed, a save
 * holds its snapshot when a copy made now would differ
 * (`StatePersistence.recordCopySnapshots`), and a copy made again on load
 * takes the saved one (`applyCopySnapshot`).
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
                state: deepClone(component.state ?? {}),
                ...(Object.keys(primitiveChildren).length > 0
                    ? { primitiveChildren }
                    : {}),
                copySourceContext:
                    component.doenetAttributes?.copySourceContext ?? null,
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
 * Whether two snapshots (`copySnapshotOf`) hold the same.
 */
export function copySnapshotsMatch(a, b) {
    return (
        JSON.stringify(a, serializedComponentsReplacer) ===
        JSON.stringify(b, serializedComponentsReplacer)
    );
}

/**
 * Give the serialized replacements of an unlinked copy the essential state,
 * primitive children and `copySourceContext` that `snapshot` holds for their
 * `stateId`s.
 */
export function applyCopySnapshot(serializedComponents, snapshot) {
    const byStateId = new Map(snapshot.map((entry) => [entry.stateId, entry]));
    function visit(component) {
        if (typeof component !== "object" || component === null) {
            return;
        }
        const entry = byStateId.get(component.stateId);
        if (entry) {
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
            if (entry.copySourceContext) {
                component.doenetAttributes ??= {};
                component.doenetAttributes.copySourceContext =
                    entry.copySourceContext;
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
}

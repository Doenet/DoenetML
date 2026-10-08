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
            !same(now.primitiveChildren, then.primitiveChildren) ||
            !same(now.copySourceContext, then.copySourceContext)
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

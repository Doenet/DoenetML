import { deepClone, serializedComponentsReplacer } from "@doenet/utils";

/**
 * What an unlinked copy (`copy=`) made of its source when it was made, for
 * each component among its serialized replacements: its essential state,
 * its primitive (string) children, its literal attributes
 * (`literalAttribute.ts`) and the text written to its expression attributes
 * (`expressionAttribute.js`), with its `stateId` and `componentType`. The
 * primitive children are held because a write to a value defined by one,
 * such as dragging `<point>(1,2)</point>`, changes the child itself rather
 * than any essential state, and the literals because a reader's write to
 * one (a toggled `hide="false"`) is copied in the literal.
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
            const literals = {};
            const expressionWrites = {};
            for (const [name, attribute] of Object.entries(
                component.attributes ?? {},
            )) {
                if (attribute?.type === "literal") {
                    // its value, not where it was written, which the copy
                    // made again has (`applyCopySnapshot`)
                    const { position, ...literal } = attribute;
                    literals[name] = deepClone(literal);
                } else if (attribute?.type === "expression") {
                    // the text written to it (`expressionAttribute.js`); its
                    // references are the copy made again's
                    expressionWrites[name] = deepClone(attribute.writes ?? {});
                }
            }
            snapshot.push({
                stateId: component.stateId,
                componentType: component.componentType,
                state: deepClone(component.state ?? {}),
                ...(Object.keys(primitiveChildren).length > 0
                    ? { primitiveChildren }
                    : {}),
                ...(Object.keys(literals).length > 0 ? { literals } : {}),
                ...(Object.keys(expressionWrites).length > 0
                    ? { expressionWrites }
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
 * Give the serialized replacements of an unlinked copy the essential state,
 * primitive children and literal attributes that `snapshot` holds for their
 * `stateId` and `componentType`.
 *
 * Only state, primitive children and literals are held, not the
 * replacements' shape. A copy made again need not make the components it
 * made before: a copy of
 * a `<conditionalContent>` is made from whichever case is active then, so
 * its replacements can be fewer, or others, and a component of another type
 * can have a `stateId` an earlier one had (`stateId`s are positional). An
 * entry therefore applies only to a replacement of its own `componentType`
 * (an entry without one, from before it was held, applies to none), and
 * none applies within a replacement whose `stateId` has an entry only of
 * another type: that replacement and what it contains were made from other
 * DoenetML. A copy made again with a different shape is thus made from its
 * source as restored, and keeps nothing it cannot apply: the copy then
 * holds only the snapshot of what it made.
 */
export function applyCopySnapshot(serializedComponents, snapshot) {
    const byStateId = new Map(snapshot.map((entry) => [entry.stateId, entry]));
    function visit(component) {
        if (typeof component !== "object" || component === null) {
            return;
        }
        const entry = byStateId.get(component.stateId);
        if (entry) {
            if (entry.componentType !== component.componentType) {
                // made from other DoenetML than what was held
                return;
            }
            component.state = deepClone(entry.state);
            for (const [name, literal] of Object.entries(
                entry.literals ?? {},
            )) {
                if (component.attributes?.[name]?.type === "literal") {
                    const { position } = component.attributes[name];
                    component.attributes[name] = {
                        ...deepClone(literal),
                        ...(position ? { position } : {}),
                    };
                }
            }
            for (const [name, writes] of Object.entries(
                entry.expressionWrites ?? {},
            )) {
                if (component.attributes?.[name]?.type === "expression") {
                    component.attributes[name] = {
                        ...component.attributes[name],
                        writes: deepClone(writes),
                    };
                }
            }
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
            !same(now.primitiveChildren, then.primitiveChildren) ||
            !same(now.literals, then.literals) ||
            !same(now.expressionWrites, then.expressionWrites)
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

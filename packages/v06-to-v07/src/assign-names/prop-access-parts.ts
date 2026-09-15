import { DastElement, DastMacroPathPart } from "@doenet/parser";

/**
 * The path parts an author wrote as a *prop access* (`$a.b`) rather than as a namespace
 * path segment (`$(a/b)`).
 *
 * v0.6 kept the two apart in the DAST: slashes became `path` parts, dots became a chain of
 * `accessedProp` macros. `upgradePathSlashesToDots` flattens both into one v0.7 path, and
 * after that nothing in the tree distinguishes them — but the distinction matters here. A
 * namespace segment can name a component that `assignNames` created, so rewriting it is
 * right; a prop access never can, because v0.6 dot notation reached public state
 * variables and nothing else. `applyRefRenames` therefore leaves a prop access alone —
 * rewriting one would turn `$p.y`, the point's y-coordinate, into `$p.x[2]` whenever `x`
 * and `y` happened to be assigned somewhere else in the document.
 *
 * Held in a `WeakSet` keyed on the part itself, so there is nothing to clear between
 * documents and no converter-only field on a shared `@doenet/parser` type.
 */
const propAccessParts = new WeakSet<DastMacroPathPart>();

/** Record that `part` was written after a `.`, so it names a prop and not a component. */
export function markAsPropAccess(part: DastMacroPathPart) {
    propAccessParts.add(part);
}

/** Whether `part` was written after a `.`. See {@link markAsPropAccess}. */
export function isPropAccess(part: DastMacroPathPart): boolean {
    return propAccessParts.has(part);
}

/**
 * The same distinction, for a reference attribute whose value is written back as plain
 * text rather than kept as a macro.
 *
 * `slash-to-dot.ts` serializes `<copy source="...">` so that the later passes can still
 * parse it, and serializing throws away the marks above: `p/y` and `p.y` both come out as
 * the text `p.y`. Recording which *positions* in that path were props lets the pass that
 * reparses the value put the marks back.
 *
 * Keyed by element and attribute name, since the text node itself is replaced.
 */
const rawPropPositions = new WeakMap<DastElement, Map<string, number[]>>();

/**
 * Record that the parts at `positions` in this attribute's path were written after a `.`.
 */
export function markRawPropPositions(
    node: DastElement,
    attrName: string,
    positions: number[],
) {
    let byAttr = rawPropPositions.get(node);
    if (!byAttr) {
        byAttr = new Map();
        rawPropPositions.set(node, byAttr);
    }
    byAttr.set(attrName.toLowerCase(), positions);
}

/**
 * Put the marks recorded by {@link markRawPropPositions} back on a freshly parsed path.
 */
export function restoreRawPropPositions(
    node: DastElement,
    attrName: string,
    path: DastMacroPathPart[],
) {
    const positions = rawPropPositions.get(node)?.get(attrName.toLowerCase());
    if (!positions) {
        return;
    }
    for (const position of positions) {
        const part = path[position];
        if (part) {
            markAsPropAccess(part);
        }
    }
}

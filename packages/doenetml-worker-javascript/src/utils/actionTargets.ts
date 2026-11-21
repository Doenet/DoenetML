/**
 * What an action's `target` (`<updateValue>`, `<animateFromSequence>`)
 * reaches when it is a composite or a wrapper (COLL-2, COLL-3; #2598 items 1
 * and 2):
 * - a wrapper holding one component stands for it, at any depth: `$g` of a
 *   `<group>` holding one input, `$r[1]` of an iteration holding one
 *   `<number>`, `$s` of a `<select>` picking one option holding one math;
 * - a name after a collection reaches each item's component of that name
 *   (`$r.mi`), and what is left of the path is read from each
 *   (`$r.mi.value`);
 * - a property after a collection applies to each item, then through the
 *   wrapper (`$r.value` of iterations holding one `<number>` each);
 * - a wrapper holding several components is only a container (COLL-3): it
 *   is kept as the target, which has no value (`doenet-w0044`, or
 *   `doenet-w0195` at load when it is written as the target);
 * - a property the composite has of its own (`$g.hide`, `$r.numItems`) is
 *   the composite's.
 *
 * A bare `<repeat>` or `<repeatForSequence>` (`target="$r"`) is a container
 * of iterations, which `doenet-w0195` reports at load: its iterations are
 * the targets, as before, and are not passed through, so it does nothing.
 */
import { COLLECTIONS_OF_NAMED_ITEMS } from "./wrappers";

/** The tags that make an item for each iteration. */
const REPEATS = new Set(["repeat", "repeatForSequence"]);

/**
 * The dependency giving the targets of an action whose `target` resolved to
 * `targetComponent`, with the path `unresolvedPath` left after it, when the
 * target is a composite, including a wrapper (a `<group>`, or the group a
 * repeat, select or conditional makes for an item). `undefined` otherwise.
 */
export function compositeTargetsDependency({
    targetComponent,
    unresolvedPath,
    componentInfoObjects,
}: {
    targetComponent: { componentIdx: number; componentType: string };
    unresolvedPath: any[] | null | undefined;
    componentInfoObjects: any;
}) {
    const componentType = targetComponent.componentType;
    if (
        !componentInfoObjects.isCompositeComponent({
            componentType,
            includeNonStandard: true,
        })
    ) {
        return undefined;
    }
    let firstName: string | null = unresolvedPath?.[0]?.name ?? null;
    if (firstName === "") {
        firstName = null;
    }
    if (!unresolvedPath && REPEATS.has(componentType)) {
        return {
            dependencyType: "replacement",
            compositeIdx: targetComponent.componentIdx,
            recursive: true,
        };
    }
    return {
        dependencyType: "replacement",
        compositeIdx: targetComponent.componentIdx,
        recursive: true,
        // through the wrappers an item is made in, and groups of one
        recurseNonStandardComposites: true,
        // a wrapper of several is a container, kept whole (COLL-3)
        stopAtWrappersOfSeveral: true,
        // a property of the composite's own (`$g.hide`)
        stopIfHaveProp: firstName,
        // a name in each item (`$r.mi`, COLL-2), as a reference reads it
        // (`Copy.js`); the resolver leaves it unresolved (`names_per_item`)
        namePerItem:
            firstName &&
            (COLLECTIONS_OF_NAMED_ITEMS.has(componentType) ||
                componentType === "group")
                ? unresolvedPath
                : undefined,
    };
}

/**
 * The targets among `identities`, the components a
 * {@link compositeTargetsDependency} gives: not the text written among
 * them (a string, blank or not), nor the `<setup>` a repeat adds to an
 * iteration for its names, neither of which is something an author targets.
 * A wrapper holding only text so has no target (`doenet-w0043`), as an
 * empty one; a `<text>` component it holds is a target like any other.
 */
export function targetsAmongReplacements(identities: any[]) {
    return identities.filter(
        (identity) =>
            typeof identity === "object" &&
            identity !== null &&
            identity.componentType !== "setup",
    );
}

/**
 * The path to read from the target `target`: what is left of `unresolvedPath`
 * once a name was resolved in its item (`remainingPath`, `$r.mi.value` gives
 * `.value` of each `mi`), or else `unresolvedPath` itself. `null` when
 * nothing is left, so that the target's value is changed.
 */
export function pathOfTarget(
    target: { remainingPath?: any[] | null },
    unresolvedPath: any[] | null | undefined,
) {
    const path =
        target.remainingPath !== undefined
            ? target.remainingPath
            : unresolvedPath;
    return path && path.length > 0 ? path : null;
}

/**
 * The property the first part of a target's path names, with its indices as
 * written after it (`styleDescription[1]`, `foo[2][3]`), for `doenet-w0044`.
 * An index read from a reference (`[$n]`) is resolved by the time the path
 * is left over, so its value is written; anything else in an index is
 * written as `…`.
 */
export function propertyWithIndices(pathPart: {
    name: string;
    index?: { value?: unknown[] }[];
}): string {
    let property = pathPart.name;
    for (const index of pathPart.index ?? []) {
        const text = (index.value ?? [])
            .map((item) =>
                typeof item === "string" || typeof item === "number"
                    ? String(item)
                    : "…",
            )
            .join("")
            .trim();
        property += `[${text}]`;
    }
    return property;
}

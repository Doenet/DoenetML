import type { PublicDoenetMLCore } from "../../CoreWorker";
import type { ResolvePathToNodeIdx } from "./test-core";

/**
 * The index of the component at `position` (from 1) of what the iteration,
 * pick, shown case or `<group>` that `path` names holds, counting what a
 * composite in it made in its place and not counting blank strings or the
 * `<setup>` a repeat adds. An index does not select such a component (D27),
 * so a test reaches one that has no name this way. `-1` if there is none.
 */
export async function childOfInstance(
    core: PublicDoenetMLCore,
    resolvePathToNodeIdx: ResolvePathToNodeIdx,
    path: string,
    position: number,
): Promise<number> {
    return childOfInstanceAt(core, await resolvePathToNodeIdx(path), position);
}

/**
 * The index of the `position`th (from 1) instance the composite `path` names
 * made: an iteration of a repeat, a pick of a `<select>`, or the case a
 * `<conditionalContent>` shows (`position` 1). An index after a
 * `<conditionalContent>` or a one-pick `<select>` reaches into what it shows
 * (D72), so no reference names the case or the pick itself; a test reaches
 * one this way. `-1` if there is none.
 */
export async function instanceOf(
    core: PublicDoenetMLCore,
    resolvePathToNodeIdx: ResolvePathToNodeIdx,
    path: string,
    position = 1,
): Promise<number> {
    const components = (core as any).core._components;
    const composite = components[await resolvePathToNodeIdx(path)];
    const replacements = composite?.replacements ?? [];
    const numWithheld = composite?.replacementsToWithhold ?? 0;
    const shown = replacements
        .slice(0, replacements.length - numWithheld)
        .filter((replacement: any) => typeof replacement !== "string");
    return shown[position - 1]?.componentIdx ?? -1;
}

/**
 * As `childOfInstance`, of the iteration, pick, shown case or `<group>` whose
 * index is `groupIdx`.
 */
export function childOfInstanceAt(
    core: PublicDoenetMLCore,
    groupIdx: number,
    position: number,
): number {
    const components = (core as any).core._components;
    const group = components[groupIdx];
    if (!group) {
        return -1;
    }

    const held: any[] = [];
    function gather(replacements: any[]) {
        for (const replacement of replacements ?? []) {
            if (typeof replacement === "string") {
                if (replacement.trim() !== "") {
                    held.push(replacement);
                }
                continue;
            }
            const component = components[replacement.componentIdx];
            if (
                component?.componentType === "setup" &&
                component.doenetAttributes?.iterationAliases
            ) {
                continue;
            }
            if (component?.componentType === "_copy" && component.isExpanded) {
                gather(component.replacements);
                continue;
            }
            held.push(component);
        }
    }
    gather(group.replacements);

    const component = held[position - 1];
    return typeof component === "object" && component
        ? component.componentIdx
        : -1;
}

/**
 * The index of the component `path` names, or, when `path` ends with an index
 * that names nothing because it comes after an iteration, a pick, a shown
 * case or a `<group>` (D27), of the component at that position of what it
 * holds (`childOfInstance`). Tests use it to reach a component with no name
 * that `path` reached when an index selected a child.
 */
export async function componentAtPath(
    core: PublicDoenetMLCore,
    resolvePathToNodeIdx: ResolvePathToNodeIdx,
    path: string,
): Promise<number> {
    const idx = await resolvePathToNodeIdx(path);
    if (idx !== -1) {
        return idx;
    }
    const match = /^(.*)\[(\d+)\]$/.exec(path);
    if (!match) {
        return -1;
    }
    return childOfInstance(
        core,
        resolvePathToNodeIdx,
        match[1],
        Number(match[2]),
    );
}

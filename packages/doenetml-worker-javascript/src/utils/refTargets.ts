/**
 * One resolution that an `attributeRefResolutions` dependency gives, as far
 * as a consumer that needs a target reads it.
 */
export type TargetRefResolution = {
    componentIdx?: number;
    unresolvedPath?: unknown;
    listEntry?: { componentIdx: number; listIdx: number; entryIndex: number };
};

/**
 * The target that a reference from an attribute names, for a feature that
 * needs a component as a target (a chained action, a legend's label, a
 * PreFigure annotation, a `<ref>`, a `<callAction>`): the component it
 * resolved to, when no path is left; for one entry of a list component
 * (`$pl[2]`), which has no component, the renderer index reserved for the
 * entry (`listEntryTargets.ts`); and otherwise `null`.
 */
export function targetIdxOfRefResolution(
    resolution: TargetRefResolution | undefined,
): number | null {
    if (!resolution) {
        return null;
    }
    if (resolution.unresolvedPath === null) {
        return resolution.componentIdx ?? null;
    }
    return resolution.listEntry?.componentIdx ?? null;
}

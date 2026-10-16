/**
 * An entry of a list component as the target of a reference
 * (Doenet/DoenetML#2181).
 *
 * A list component (`listEntryComponentType`; Doenet/DoenetML#2157) holds its
 * entries in arrays and has no component per entry, so a reference to one
 * entry (`$pl[2]`, or `$pl[$i]`) resolves to the list with that index left
 * over in its `unresolvedPath`. The features that need a component as a
 * target (chained actions, a legend's labels, a PreFigure annotation, a
 * `<ref>`, a `<callAction>`) take only a reference with no path left, so
 * they would find nothing for an entry.
 *
 * Such a reference is given the entry's identity instead: the renderer index
 * reserved for the entry (`RendererInstructionBuilder.rendererIdxForListEntry`),
 * which is what the entry's renderer is keyed by, what its actions go to
 * (`UpdateExecutor.performAction`), and what a graph's descendants give for
 * it (`presentListsAsEntries`). It is reserved when the reference resolves,
 * so it is the same whether the entry is drawn before or after.
 */
import type Core from "../Core";

/** The entry of a list component that a reference names. */
export type ListEntryTarget = {
    /** The renderer index reserved for the entry. */
    componentIdx: number;
    /** The list component. */
    listIdx: number;
    /** The entry's index, from 0. */
    entryIndex: number;
};

/**
 * The entry that a resolved reference names, when it resolved to a list
 * component with exactly one index left over (`$pl[2]`), the literal index
 * the resolver was given (an index from `$i` has been read into one by
 * then). `undefined` otherwise, including when more path is left after the
 * index (`$pl[2].x`), which names a property of the entry and not the entry.
 *
 * The entry need not exist yet: a reference to entry 5 of a list of 3 names
 * the entry the list will have when it grows to 5.
 */
export function listEntryTargetOfResolution(
    core: Core,
    {
        componentIdx,
        unresolvedPath,
    }: { componentIdx: number; unresolvedPath: any },
): ListEntryTarget | undefined {
    if (!Array.isArray(unresolvedPath) || unresolvedPath.length !== 1) {
        return undefined;
    }
    const [pathPart] = unresolvedPath;
    if (pathPart.name !== "" || pathPart.index?.length !== 1) {
        return undefined;
    }
    const value = pathPart.index[0].value;
    if (
        !Array.isArray(value) ||
        value.length !== 1 ||
        typeof value[0] !== "string" ||
        !/^\s*\d+\s*$/.test(value[0])
    ) {
        return undefined;
    }
    const entryIndex = Number(value[0]) - 1;
    if (!Number.isSafeInteger(entryIndex) || entryIndex < 0) {
        return undefined;
    }

    const list = core._components[componentIdx];
    if (list?.constructor?.listEntryComponentType === undefined) {
        return undefined;
    }

    return {
        componentIdx: core.rendererInstructionBuilder.rendererIdxForListEntry(
            list,
            entryIndex,
        ),
        listIdx: componentIdx,
        entryIndex,
    };
}

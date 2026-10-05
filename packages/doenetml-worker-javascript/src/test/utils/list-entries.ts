import { PublicDoenetMLCore } from "../../CoreWorker";
import { ResolvePathToNodeIdx } from "./test-core";

/**
 * Reading the entries of a list component (`listEntryComponentType`;
 * Doenet/DoenetML#2157) in a test as one reads a component.
 *
 * A list holds its entries in arrays and has no component per entry, so
 * neither `resolvePathToNodeIdx("s[2]")` nor a parent's `activeChildren`
 * reaches one. A parent reads each entry as a child of the entries' type,
 * whose variables are the list's (`listEntryStateVariables`), one value of
 * an array for those that hold a value per entry (`listPerEntryVariables`).
 * These helpers give an entry as the record `returnAllStateVariables` gives a
 * component, with those variables as its `stateValues`.
 */

type StateVariables = Record<string, any>;

/**
 * The record of entry `entryIndex` (from 0) of the list component
 * `listIdx`, or `undefined` when `listIdx` is not a list component or has no
 * such entry.
 */
export function listEntryRecord(
    core: PublicDoenetMLCore,
    stateVariables: StateVariables,
    listIdx: number,
    entryIndex: number,
) {
    const listClass = (core as any).core?._components?.[listIdx]
        ?.constructor as any;
    const listRecord = stateVariables[listIdx];
    if (listClass?.listEntryComponentType === undefined || !listRecord) {
        return undefined;
    }
    const numEntries = listRecord.stateValues[listClass.listEntryCountVariable];
    if (!(entryIndex >= 0 && entryIndex < numEntries)) {
        return undefined;
    }
    const stateValues: Record<string, any> = {};
    for (const [entryVariable, listVariable] of Object.entries(
        listClass.listEntryStateVariables as Record<string, string>,
    )) {
        if (!(listVariable in listRecord.stateValues)) {
            continue;
        }
        const value = listRecord.stateValues[listVariable];
        stateValues[entryVariable] = listClass.listPerEntryVariables.includes(
            listVariable,
        )
            ? value?.[entryIndex]
            : value;
    }
    return {
        componentIdx: listIdx,
        listEntryIndex: entryIndex,
        componentType: listClass.listEntryComponentType,
        stateValues,
        activeChildren: [],
    };
}

/**
 * The record of the component `name` resolves to, or, when `name` ends with
 * an index into a list component (`s[2]`, `rep[1].s[3]`), of that entry.
 */
export async function componentOrListEntry(
    core: PublicDoenetMLCore,
    stateVariables: StateVariables,
    resolvePathToNodeIdx: ResolvePathToNodeIdx,
    name: string,
) {
    const idx = await resolvePathToNodeIdx(name);
    if (idx !== -1) {
        return stateVariables[idx];
    }
    const match = /^(.*)\[(\d+)\]$/.exec(name);
    if (!match) {
        return undefined;
    }
    const listIdx = await resolvePathToNodeIdx(match[1]);
    if (listIdx === -1) {
        return undefined;
    }
    return listEntryRecord(core, stateVariables, listIdx, Number(match[2]) - 1);
}

/**
 * The records of the active children of `parentIdx`, as the parent reads
 * them: a list component among them is its entries.
 */
export function childrenAsPresented(
    core: PublicDoenetMLCore,
    stateVariables: StateVariables,
    parentIdx: number,
) {
    const children: any[] = [];
    for (const child of stateVariables[parentIdx].activeChildren) {
        if (typeof child !== "object") {
            children.push(child);
            continue;
        }
        const listClass = (core as any).core?._components?.[child.componentIdx]
            ?.constructor as any;
        if (listClass?.listEntryComponentType === undefined) {
            children.push(stateVariables[child.componentIdx]);
            continue;
        }
        const numEntries =
            stateVariables[child.componentIdx].stateValues[
                listClass.listEntryCountVariable
            ];
        for (let entryIndex = 0; entryIndex < numEntries; entryIndex++) {
            children.push(
                listEntryRecord(
                    core,
                    stateVariables,
                    child.componentIdx,
                    entryIndex,
                ),
            );
        }
    }
    return children;
}

/**
 * The records of what `idx` stands for among a parent's children: the
 * entries of a list component, or the replacements of a composite that it
 * does not withhold.
 */
export function entriesOrReplacements(
    core: PublicDoenetMLCore,
    stateVariables: StateVariables,
    idx: number,
) {
    const listClass = (core as any).core?._components?.[idx]
        ?.constructor as any;
    const record = stateVariables[idx];
    if (listClass?.listEntryComponentType === undefined) {
        const replacements = record?.replacements ?? [];
        return replacements
            .slice(
                0,
                replacements.length - (record?.replacementsToWithhold ?? 0),
            )
            .map((replacement: any) =>
                typeof replacement === "object"
                    ? stateVariables[replacement.componentIdx]
                    : replacement,
            );
    }
    const numEntries = record?.stateValues[listClass.listEntryCountVariable];
    return Array.from({ length: numEntries ?? 0 }, (_, entryIndex) =>
        listEntryRecord(core, stateVariables, idx, entryIndex),
    );
}

/**
 * The type the component `idx` stands for among its parent's children: its
 * own, or, for a value reference (`_ref`), the type it presents as (`$mi` in
 * a `<p>` is drawn as a math).
 */
export function typeAsPresented(
    core: PublicDoenetMLCore,
    stateVariables: StateVariables,
    idx: number,
): string {
    return (
        (core as any).core?._components?.[idx]?.presentedComponentType ??
        stateVariables[idx].componentType
    );
}

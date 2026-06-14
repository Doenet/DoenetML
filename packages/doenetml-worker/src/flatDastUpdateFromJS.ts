import type { FlatDastElement, FlatDastElementContent } from "./CoreWorker";
import {
    applyElementJsToRustFixups,
    childInstructionToContent,
    type ComponentInstruction,
    type UpdateInstruction,
} from "./flatDastFromJS";

/**
 * An update to a single FlatDast element produced from the JS core, mirroring
 * the rust core's `FlatDastElementUpdate` (the value type of an
 * `ActionResponse["payload"]` entry). `doenetml-prototype`'s
 * `processElementUpdates` reducer merges `changedState` into `data.props` and
 * replaces `children` with `newChildren` when present.
 */
export type FlatDastElementUpdateFromJS = {
    changedState?: Record<string, any>;
    newChildren?: FlatDastElementContent[];
};

/**
 * Walk the child instructions in a set of `updateInstructions` and record, for every component child, its `componentType` (keyed by
 * `componentIdx`) and its JS string id (keyed into `doenetIdToComponentIdx`).
 *
 * `CoreWorker` calls this on the initial render and on every subsequent set of
 * update instructions so the maps that `flatDastUpdateFromJS` needs — the
 * element-type lookup for the JS->Rust converters and the `ref` referent
 * lookup — stay current as new components appear. The maps are mutated in place
 * and also returned for convenience.
 */
export function collectInstructionMaps(
    updateInstructions: UpdateInstruction[],
    componentIdxToName: Record<number, string> = {},
    doenetIdToComponentIdx: Record<string, number> = {},
): {
    componentIdxToName: Record<number, string>;
    doenetIdToComponentIdx: Record<string, number>;
} {
    for (const instruction of updateInstructions) {
        for (const rendererState of instruction.rendererStatesToUpdate) {
            for (const childInstruction of rendererState.childrenInstructions ??
                []) {
                if (
                    childInstruction != null &&
                    typeof childInstruction !== "string"
                ) {
                    componentIdxToName[childInstruction.componentIdx] =
                        childInstruction.componentType;
                    doenetIdToComponentIdx[childInstruction.id] =
                        childInstruction.componentIdx;
                }
            }
        }
    }
    return { componentIdxToName, doenetIdToComponentIdx };
}

/**
 * Seed the retained lookup maps for the update path from the initial render.
 *
 * `CoreWorker` (and the integration test that mirrors it) keep a
 * `componentIdx -> name` map and a `doenetId -> componentIdx` map alive for the
 * core's lifetime so `flatDastUpdateFromJS` can resolve element types and `ref`
 * referents. This builds those maps from the document root plus the initial
 * render's `updateInstructions`, matching the seeding `flatDastFromJS` performs
 * internally.
 */
export function seedInstructionMaps(
    documentToRender: ComponentInstruction,
    updateInstructions: UpdateInstruction[],
): {
    componentIdxToName: Record<number, string>;
    doenetIdToComponentIdx: Record<string, number>;
} {
    const componentIdxToName: Record<number, string> = {
        [documentToRender.componentIdx]: documentToRender.componentType,
    };
    const doenetIdToComponentIdx: Record<string, number> = {
        [documentToRender.id]: documentToRender.componentIdx,
    };
    collectInstructionMaps(
        updateInstructions,
        componentIdxToName,
        doenetIdToComponentIdx,
    );
    return { componentIdxToName, doenetIdToComponentIdx };
}

/**
 * Pure converter that turns the JS core's pushed `updateInstructions` into the
 * per-`componentIdx` update map expected by `doenetml-prototype`'s
 * `processElementUpdates` reducer. This is the update-path analogue of
 * `flatDastFromJS` and mirrors the rust core's
 * `DocumentRenderer::get_flat_dast_updates`.
 *
 * For each renderer state to update:
 * - `changedState` <- `stateValues`, after running the same per-component
 *   JS->Rust prop converters used by `flatDastFromJS` (selected by the
 *   element's `name`, looked up from `componentIdxToName`).
 * - `newChildren` <- the converted `childrenInstructions`, included only when
 *   `childrenInstructions` is present.
 *
 * To reuse the exact converters from the initial path (including those that
 * read or mutate an element's children, e.g. `section`), each renderer state is
 * assembled into a synthetic `FlatDastElement` that the shared converter
 * operates on; the resulting props and children are then read back out.
 *
 * When several update instructions touch the same `componentIdx`, the later one
 * wins: `changedState` objects are merged (`Object.assign`) and `newChildren`
 * is replaced.
 *
 * A state-only update carries no `childrenInstructions`, so the synthetic
 * element is given an empty `children` array. The only converter that consults
 * children, `sectionJsToRust`, still produces the correct `changedState`
 * without them: it clears `xrefLabel.label` based on `titleChildName` alone. It
 * also skips splicing the title child out of `element.children`, which is
 * harmless because an update without `childrenInstructions` does not replace
 * the consumer's children.
 *
 * @param updateInstructions The batches pushed by the JS core's
 *   `updateRenderersCallback`.
 * @param componentIdxToName Map from `componentIdx` to the JS component
 *   type/name, used to select the JS->Rust converter. Built by `CoreWorker`
 *   during the initial render.
 * @param doenetIdToComponentIdx Map from JS string id to `componentIdx`,
 *   required by the `ref` converter. Defaults to an empty map and is extended in
 *   place as component children are encountered.
 */
export function flatDastUpdateFromJS(
    updateInstructions: UpdateInstruction[],
    componentIdxToName: Record<number, string>,
    doenetIdToComponentIdx: Record<string, number> = {},
): Record<number, FlatDastElementUpdateFromJS> {
    const updates: Record<number, FlatDastElementUpdateFromJS> = {};

    for (const instruction of updateInstructions) {
        for (const rendererState of instruction.rendererStatesToUpdate) {
            const { componentIdx, stateValues, childrenInstructions } =
                rendererState;

            const children: FlatDastElementContent[] = [];
            if (childrenInstructions) {
                for (const childInstruction of childrenInstructions) {
                    if (childInstruction == null) {
                        continue;
                    }
                    children.push(
                        childInstructionToContent(
                            childInstruction,
                            doenetIdToComponentIdx,
                        ),
                    );
                }
            }

            // Assemble a synthetic element so the shared JS->Rust converter
            // (which may read or mutate children, e.g. `section`) can be reused
            // verbatim.
            const element: FlatDastElement = {
                type: "element",
                name: componentIdxToName[componentIdx] ?? "",
                attributes: {},
                children,
                data: { id: componentIdx, props: { ...stateValues } },
            };

            applyElementJsToRustFixups(element, doenetIdToComponentIdx);

            const update: FlatDastElementUpdateFromJS = {
                changedState: element.data.props,
            };
            // Only report children when the batch carried child instructions;
            // otherwise leave the consumer's existing children untouched.
            if (childrenInstructions) {
                update.newChildren = element.children;
            }

            const existing = updates[componentIdx];
            if (existing) {
                existing.changedState = {
                    ...existing.changedState,
                    ...update.changedState,
                };
                if (update.newChildren) {
                    existing.newChildren = update.newChildren;
                }
            } else {
                updates[componentIdx] = update;
            }
        }
    }

    return updates;
}

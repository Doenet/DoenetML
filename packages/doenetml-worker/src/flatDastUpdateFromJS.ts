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
 * Walk the child instructions of a set of `updateInstructions` batches and
 * record, for every component child, its `componentType` (keyed by
 * `componentIdx`) and its JS string id (keyed into `doenetIdToComponentIdx`).
 *
 * `CoreWorker` calls this on the initial render and on every subsequent update
 * batch so the maps that `flatDastUpdateFromJS` needs — the element-type lookup
 * for fixups and the `ref` referent lookup — stay current as new components
 * appear. The maps are mutated in place and also returned for convenience.
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
 * Pure converter that turns the JS core's pushed `updateInstructions` batches
 * into the per-`componentIdx` update map expected by `doenetml-prototype`'s
 * `processElementUpdates` reducer. This is the update-path analogue of
 * `flatDastFromJS` and mirrors the rust core's
 * `DocumentRenderer::get_flat_dast_updates`.
 *
 * For each renderer state to update:
 * - `changedState` <- `stateValues`, after running the same per-component
 *   JS->Rust prop fixups used by `flatDastFromJS` (selected by the element's
 *   `name`, looked up from `componentIdxToName`).
 * - `newChildren` <- the converted `childrenInstructions`, included only when
 *   `childrenInstructions` is present.
 *
 * To reuse the exact fixups from the initial path (including those that read or
 * mutate an element's children, e.g. `section`), each renderer state is
 * assembled into a synthetic `FlatDastElement` that the shared fixup helper
 * operates on; the resulting props and children are then read back out.
 *
 * When several batches touch the same `componentIdx`, later batches win:
 * `changedState` objects are merged (`Object.assign`) and `newChildren` is
 * replaced.
 *
 * Known limitation: when a batch omits `childrenInstructions` (common when only
 * state changed), the synthetic element is given an empty `children` array. A
 * fixup that consults children (currently only `sectionJsToRust`, which removes
 * a `titleChild` and clears `xrefLabel.label`) can therefore compute a slightly
 * wrong `changedState` for such an update. This does not affect the components
 * this milestone drives (e.g. `textInput`); a correct fix needs the last-known
 * children retained per component, which belongs with the deferred prototype
 * update wiring where `section` updates are actually exercised.
 *
 * @param updateInstructions The batches pushed by the JS core's
 *   `updateRenderersCallback`.
 * @param componentIdxToName Map from `componentIdx` to the JS component
 *   type/name, used to select the JS->Rust fixup. Built by `CoreWorker` during
 *   the initial render.
 * @param doenetIdToComponentIdx Map from JS string id to `componentIdx`,
 *   required by the `ref` fixup. Defaults to an empty map and is extended in
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

            // Assemble a synthetic element so the shared fixup helper (which may
            // read or mutate children, e.g. `section`) can be reused verbatim.
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

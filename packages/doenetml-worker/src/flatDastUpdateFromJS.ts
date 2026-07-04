import type { FlatDastElement, FlatDastElementContent } from "./CoreWorker";
import {
    applyCompositeListWrapping,
    type ChildContent,
    type CompositeReplacementRange,
} from "./compositeListWrapping";
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
 *
 * `newFlatDastElement` is a JS-bridge-only extension: when a children update
 * introduces a synthetic `<asList>`/`<_fragment>` wrapper (see
 * `applyCompositeListWrapping`), the wrapper element does not exist in the
 * consumer's `elements` array, so the bridge ships the whole element for the
 * reducer to upsert. The rust core never sets this.
 */
export type FlatDastElementUpdateFromJS = {
    changedState?: Record<string, any>;
    newChildren?: FlatDastElementContent[];
    newFlatDastElement?: FlatDastElement;
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
 * without them: it derives the heading from `titlePrefix`/`title` and the title
 * pointer from `titleChildName`. It only skips splicing the title child out of
 * `element.children`, which is harmless because an update without
 * `childrenInstructions` does not replace the consumer's children.
 *
 * @param updateInstructions The update instructions pushed by the JS core's
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

    function mergeUpdate(idx: number, update: FlatDastElementUpdateFromJS) {
        const existing = updates[idx];
        if (existing) {
            existing.changedState = {
                ...existing.changedState,
                ...update.changedState,
            };
            if (update.newChildren) {
                existing.newChildren = update.newChildren;
            }
            if (update.newFlatDastElement) {
                existing.newFlatDastElement = update.newFlatDastElement;
            }
        } else {
            updates[idx] = update;
        }
    }

    for (const instruction of updateInstructions) {
        for (const rendererState of instruction.rendererStatesToUpdate) {
            const { componentIdx, stateValues, childrenInstructions } =
                rendererState;

            // Keep child slots aligned with the child-instruction index space
            // (null placeholders included) so the
            // `_compositeReplacementActiveRange` indices line up.
            const childContents: ChildContent[] = [];
            if (childrenInstructions) {
                for (const childInstruction of childrenInstructions) {
                    if (childInstruction == null) {
                        childContents.push(null);
                        continue;
                    }
                    childContents.push(
                        childInstructionToContent(
                            childInstruction,
                            doenetIdToComponentIdx,
                        ),
                    );
                }
            }

            // Wrap composite replacement ranges in synthetic `<asList>` (and,
            // where nesting requires grouping, `<_fragment>`) parents, exactly
            // as `flatDastFromJS` does for the initial render. Wrapping happens
            // before the JS->Rust fixups so the range indices still line up with
            // the children (e.g. before `section` splices its title child out).
            const { children: wrappedChildren, wrapperElements } =
                applyCompositeListWrapping(
                    childContents,
                    stateValues?._compositeReplacementActiveRange as
                        CompositeReplacementRange[] | undefined,
                );

            // Assemble a synthetic element so the shared JS->Rust converter
            // (which may read or mutate children, e.g. `section`) can be reused
            // verbatim.
            const element: FlatDastElement = {
                type: "element",
                name: componentIdxToName[componentIdx] ?? "",
                attributes: {},
                children: wrappedChildren,
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

            mergeUpdate(componentIdx, update);

            // Ship each synthetic wrapper as a full element so the prototype's
            // `processElementUpdates` reducer can upsert it (the wrapper has no
            // pre-existing slot in the consumer's `elements` array).
            for (const wrapper of wrapperElements) {
                mergeUpdate(wrapper.data.id, { newFlatDastElement: wrapper });
            }
        }
    }

    return updates;
}

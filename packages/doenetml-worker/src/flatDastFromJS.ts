import type {
    DastError,
    FlatDastElement,
    FlatDastElementContent,
    FlatDastRootWithErrors,
} from "./CoreWorker";
import {
    applyCompositeListWrapping,
    type ChildContent,
    type CompositeReplacementRange,
} from "./compositeListWrapping";
import { pointJsToRust } from "./jsRustConversions/point";
import { refJsToRust } from "./jsRustConversions/ref";
import { sectionJsToRust } from "./jsRustConversions/section";
import { textJsToRust } from "./jsRustConversions/text";

declare module "./CoreWorker" {
    interface ElementData {
        props?: Record<string, any>;
    }
}

// types for the output of the JS core
export type ComponentInstruction = {
    actions: Record<string, { actionName: string; componentIdx: number }>;
    componentIdx: number;
    componentType: string;
    effectiveIdx: number;
    id: string;
    rendererType: string;
};

export type UpdateInstruction = {
    // The JS core emits `"updateRendererStates"` for every batch, including the
    // initial render. Consumers ignore this field and read
    // `rendererStatesToUpdate` directly.
    instructionType: "updateRendererStates";
    rendererStatesToUpdate: RendererStateToUpdate[];
};

export type RendererStateToUpdate = {
    componentIdx: number;
    // The renderer type of the component. The JS core includes this on every
    // renderer-state entry, but the converters select fixups by
    // `componentIdx -> name` and never read it, so it is optional here.
    rendererType?: string;
    // The JS core pushes `null` placeholders for children that are absent
    // (e.g. an unrendered conditional branch), so entries may be `null`.
    childrenInstructions?: (ComponentInstruction | string | null)[];
    stateValues: Record<string, any>;
};

/**
 * Convert a single child instruction from the JS core into the
 * `FlatDastElementContent` form expected by the rust core / `doenetml-prototype`.
 *
 * Component children become `{ id, annotation: "original" }`; text children are
 * passed through as raw strings. As a side effect, any component child's string
 * id is recorded in `doenetIdToComponentIdx` so that later fixups (e.g. `ref`)
 * can map a JS string id back to its `componentIdx`.
 *
 * Shared by both the initial converter (`flatDastFromJS`) and the update
 * converter (`flatDastUpdateFromJS`) so the two paths cannot drift.
 */
export function childInstructionToContent(
    childInstruction: ComponentInstruction | string,
    doenetIdToComponentIdx: Record<string, number>,
): FlatDastElementContent {
    if (typeof childInstruction === "string") {
        return childInstruction;
    }
    doenetIdToComponentIdx[childInstruction.id] = childInstruction.componentIdx;
    return {
        id: childInstruction.componentIdx,
        annotation: "original",
    };
}

/**
 * Apply the per-component JS->Rust prop fixups to a single element, mutating
 * `element` (and its `data.props`) in place.
 *
 * The fixup is selected by the element's `name`. Factored out of
 * `flatDastFromJS` so the initial render and the update path
 * (`flatDastUpdateFromJS`) apply identical transformations and cannot drift.
 */
export function applyElementJsToRustFixups(
    element: DastError | FlatDastElement,
    doenetIdToComponentIdx: Record<string, number>,
) {
    if (element?.type !== "element" || !element.data.props) {
        return;
    }

    switch (element.name) {
        case "text":
            textJsToRust(element.data.props);
            break;
        case "section":
            sectionJsToRust(element.data.props, element);
            break;
        case "point":
            pointJsToRust(element.data.props);
            break;
        case "ref":
            refJsToRust(element.data.props, doenetIdToComponentIdx);
            break;
        case "coords":
            element.name = "math";
            break;
    }
}

/**
 * Transform the initial output from the JS core, i.e., `documentToRender` and `updateInstructions`
 * into the `FlatDastRoot` structure produced by the rust core and expected by `doenetml-prototype`.
 */
export function flatDastFromJS(
    documentToRender: ComponentInstruction,
    updateInstructions: UpdateInstruction[],
): FlatDastRootWithErrors {
    const rendererStates = updateInstructions[0].rendererStatesToUpdate;

    const elements: (DastError | FlatDastElement)[] = [];

    // XXX: what if effectiveIdx differs from componentIdx?
    // For now, just using `componentIdx` everywhere,
    // which may be OK as long as we don't care about root names

    // DAST uses componentIdx as the id for components. Doenet's JS core
    // creates strings (sometimes based on the `name` attribute given to the component)
    // We need a way to find the componentIdx from a given string id.
    const doenetIdToComponentIdx: Record<string, number> = {
        [documentToRender.id]: documentToRender.componentIdx,
    };

    elements[documentToRender.componentIdx] = {
        type: "element",
        name: documentToRender.componentType,
        attributes: {},
        children: [],
        data: {
            id: documentToRender.componentIdx,
            action_names: Object.keys(documentToRender.actions),
        },
    };

    for (const rendererState of rendererStates) {
        let element = elements[rendererState.componentIdx];

        if (!element) {
            element = elements[rendererState.componentIdx] = {
                type: "element",
                name: "",
                attributes: {},
                children: [],
                data: {
                    id: rendererState.componentIdx,
                },
            };
        }

        // XXX handle error
        if (element.type === "element") {
            element.data.props = rendererState.stateValues;

            if (rendererState.childrenInstructions) {
                // Keep child slots aligned with the child-instruction index
                // space (null placeholders included) so the
                // `_compositeReplacementActiveRange` indices line up.
                const childContents: ChildContent[] = [];

                for (const childInstruction of rendererState.childrenInstructions) {
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

                    if (typeof childInstruction === "string") {
                        continue;
                    }

                    const child = elements[childInstruction.componentIdx];

                    if (!child) {
                        elements[childInstruction.componentIdx] = {
                            type: "element",
                            name: childInstruction.componentType,
                            attributes: {},
                            children: [],
                            data: {
                                id: childInstruction.componentIdx,
                                action_names: Object.keys(
                                    childInstruction.actions,
                                ),
                            },
                        };
                    } else if (child.type === "element") {
                        // XXX: handle DastError
                        child.name = childInstruction.componentType;
                        child.data.id = childInstruction.componentIdx;
                        child.data.action_names = Object.keys(
                            childInstruction.actions,
                        );
                    }
                }

                // Wrap composite replacement ranges in synthetic `<asList>`
                // (and, where nesting requires grouping, `<_fragment>`) parents
                // so the prototype renderers reproduce the commas the doenetml
                // renderers add via `addCommasForCompositeRanges`.
                const { children, wrapperElements } =
                    applyCompositeListWrapping(
                        childContents,
                        rendererState.stateValues
                            ?._compositeReplacementActiveRange as
                            | CompositeReplacementRange[]
                            | undefined,
                    );
                element.children = children;
                for (const wrapper of wrapperElements) {
                    elements[wrapper.data.id] = wrapper;
                }
            }
        }
    }

    // Make transformations for JS data to rust data specific to particular elements
    for (const element of elements) {
        applyElementJsToRustFixups(element, doenetIdToComponentIdx);
    }

    const flat_root: FlatDastRootWithErrors = {
        type: "root",
        children: [
            { id: documentToRender.componentIdx, annotation: "original" },
        ],
        elements,
        warnings: [],
    };

    return flat_root;
}

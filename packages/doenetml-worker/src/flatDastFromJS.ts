import type {
    DastError,
    FlatDastElement,
    FlatDastRootWithErrors,
} from "./CoreWorker";
import { pointJsToRust } from "./jsRustConversions/point";
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
    instructionType: "updateRendererState";
    rendererStatesToUpdate: RendererStateToUpdate[];
};

export type RendererStateToUpdate = {
    componentIdx: number;
    childrenInstructions?: (ComponentInstruction | string)[];
    stateValues: Record<string, any>;
};

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
                for (const childInstruction of rendererState.childrenInstructions) {
                    if (typeof childInstruction === "string") {
                        element.children.push(childInstruction);
                    } else {
                        element.children.push({
                            id: childInstruction.componentIdx,
                            annotation: "original",
                        });

                        let child = elements[childInstruction.componentIdx];

                        if (!child) {
                            child = {
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
                        } else {
                            // XXX: handle DastError
                            if (child.type === "element") {
                                child.name = childInstruction.componentType;
                                child.data.id = childInstruction.componentIdx;
                                child.data.action_names = Object.keys(
                                    childInstruction.actions,
                                );
                            }
                        }
                    }
                }
            }
        }
    }

    // Make transformations for JS data to rust data specific to particular elements
    for (const element of elements) {
        if (element?.type !== "element" || !element.data.props) {
            continue;
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
            case "coords":
                element.name = "math";
                break;
        }
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

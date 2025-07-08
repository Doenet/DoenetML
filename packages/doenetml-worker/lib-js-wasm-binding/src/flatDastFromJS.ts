import {
    DastError,
    FlatDastElement,
    FlatDastRootWithErrors,
} from "./CoreWorker";

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
        if (element?.type === "element") {
            if (element.name === "text") {
                element.data.props.value = element.data.props.text;
            } else if (element.name === "section") {
                element.data.props.divisionType = element.name;
                element.data.props.divisionDepth = element.data.props.level;
                element.name = "division";

                let title = element.data.props.title;
                element.data.props.title = null;

                // Hack to try to get `xrefLabel` info from JS state variables
                let label = title;
                let codeNumber = "";
                let ident = "1";

                const match = label.match(/^(.*)\s+(\d+)$/);

                if (match) {
                    label = match[1];
                    codeNumber = match[2];
                    ident = codeNumber;
                }

                element.data.props.xrefLabel = {
                    label,
                    global_ident: ident,
                    local_ident: ident,
                    preferred_form: "Global",
                };
                element.data.props.codeNumber = codeNumber;

                if (element.data.props.titleChildName) {
                    const titleChildIdx = Number(
                        element.data.props.titleChildName,
                    );
                    if (Number.isInteger(titleChildIdx)) {
                        element.data.props.title = titleChildIdx;

                        const titleChild = element.children.findIndex(
                            (child) =>
                                typeof child !== "string" &&
                                child.id === titleChildIdx,
                        );
                        if (titleChild !== -1) {
                            element.children.splice(titleChild, 1);
                            element.data.props.xrefLabel.label = "";
                        }
                    }
                }
            } else if (element.name === "point") {
                const numericalXs = element.data.props.numericalXs;

                element.data.props.x = {
                    math_object: numericalXs[0].toString(),
                };

                if (numericalXs.length >= 2) {
                    element.data.props.y = {
                        math_object: numericalXs[1].toString(),
                    };
                }
                if (numericalXs.length >= 3) {
                    element.data.props.z = {
                        math_object: numericalXs[2].toString(),
                    };
                }
                element.data.props.coordsLatex = element.data.props.latex;
            } else if (element.name === "coords") {
                element.name = "math";
            }
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

    console.log({ flat_root });

    return flat_root;
}

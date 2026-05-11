import me from "math-expressions";

export function returnAnchorAttributes() {
    return {
        anchor: {
            createComponentOfType: "point",
            description:
                "Coordinates of the anchor point used to position this component on a graph.",
        },
        positionFromAnchor: {
            createComponentOfType: "text",
            createStateVariable: "positionFromAnchor",
            defaultValue: "center",
            public: true,
            forRenderer: true,
            toLowerCase: true,
            isLocation: true,
            validValues: [
                {
                    value: "upperRight",
                    description:
                        "Place the component above and to the right of the anchor point.",
                },
                {
                    value: "upperLeft",
                    description:
                        "Place the component above and to the left of the anchor point.",
                },
                {
                    value: "lowerRight",
                    description:
                        "Place the component below and to the right of the anchor point.",
                },
                {
                    value: "lowerLeft",
                    description:
                        "Place the component below and to the left of the anchor point.",
                },
                {
                    value: "top",
                    description:
                        "Place the component directly above the anchor point.",
                },
                {
                    value: "bottom",
                    description:
                        "Place the component directly below the anchor point.",
                },
                {
                    value: "left",
                    description:
                        "Place the component directly to the left of the anchor point.",
                },
                {
                    value: "right",
                    description:
                        "Place the component directly to the right of the anchor point.",
                },
                {
                    value: "center",
                    description: "Center the component on the anchor point.",
                },
            ],
            description:
                "Where this component sits relative to its anchor point.",
        },
    };
}

/**
 * Shared control ordering attribute for graph-control-capable components.
 *
 * `controlOrder` uses 1-indexed slot semantics: the renderer fills slots 1, 2, 3, ...
 * with controls in order preference. A value of `0` (default) means no explicit slot
 * request: such controls are used to fill gaps between positive-order controls, and
 * their relative position may change based on what other controls request. Do not rely
 * on `controlOrder=0` to preserve authored position relative to controls with positive
 * orders; use matching positive orders to fix relative positions.
 */
export function returnGraphControlOrderAttribute() {
    return {
        createComponentOfType: "integer",
        createStateVariable: "controlOrder",
        defaultValue: 0,
        clamp: [0, Infinity],
        public: true,
        forRenderer: true,
        description:
            "Slot order for graph controls (1-indexed; 0 means no explicit slot request).",
    };
}

export function returnAnchorStateVariableDefinition() {
    return {
        anchor: {
            description:
                "The coordinates where this component is anchored on the graph.",
            defaultValue: me.fromText("(0,0)").tuples_to_vectors(),
            public: true,
            forRenderer: true,
            hasEssential: true,
            isLocation: true,
            shadowingInstructions: {
                createComponentOfType: "point",
            },
            returnDependencies: () => ({
                anchorAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "anchor",
                    variableNames: ["coords"],
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.anchorAttr) {
                    return {
                        setValue: {
                            anchor: dependencyValues.anchorAttr.stateValues
                                .coords,
                        },
                    };
                } else {
                    return { useEssentialOrDefaultValue: { anchor: true } };
                }
            },
            async inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
                stateValues,
                initialChange,
            }) {
                // if not draggable, then disallow initial change
                if (initialChange && !(await stateValues.draggable)) {
                    return { success: false };
                }

                if (dependencyValues.anchorAttr) {
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "anchorAttr",
                                desiredValue: desiredStateVariableValues.anchor,
                                variableIndex: 0,
                            },
                        ],
                    };
                } else {
                    return {
                        success: true,
                        instructions: [
                            {
                                setEssentialValue: "anchor",
                                value: desiredStateVariableValues.anchor,
                            },
                        ],
                    };
                }
            },
        },
    };
}

export async function moveGraphicalObjectWithAnchorAction({
    x,
    y,
    z,
    transient,
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
    componentIdx,
    componentType,
    coreFunctions,
}) {
    let components = ["vector"];
    if (x !== undefined) {
        components[1] = x;
    }
    if (y !== undefined) {
        components[2] = y;
    }
    if (z !== undefined) {
        components[3] = z;
    }
    if (transient) {
        return await coreFunctions.performUpdate({
            updateInstructions: [
                {
                    updateType: "updateValue",
                    componentIdx,
                    stateVariable: "anchor",
                    value: me.fromAst(components),
                },
            ],
            transient,
            actionId,
            sourceInformation,
            skipRendererUpdate,
        });
    } else {
        return await coreFunctions.performUpdate({
            updateInstructions: [
                {
                    updateType: "updateValue",
                    componentIdx,
                    stateVariable: "anchor",
                    value: me.fromAst(components),
                },
            ],
            actionId,
            sourceInformation,
            skipRendererUpdate,
            event: {
                verb: "interacted",
                object: {
                    componentIdx,
                    componentType,
                },
                result: {
                    x,
                    y,
                    z,
                },
            },
        });
    }
}

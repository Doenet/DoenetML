import me from "math-expressions";

export function returnAnchorAttributes() {
    return {
        anchor: {
            createComponentOfType: "point",
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
                "upperright",
                "upperleft",
                "lowerright",
                "lowerleft",
                "top",
                "bottom",
                "left",
                "right",
                "center",
            ],
        },
    };
}

export function returnAnchorStateVariableDefinition() {
    return {
        anchor: {
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
    componentName,
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
                    componentName,
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
                    componentName,
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
                    componentName,
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

/**
 * The `<xLabel>` / `<yLabel>` child wiring shared by framed components with
 * axes — `<graph>` and `<barChart>`.
 *
 * The two axes' definitions are identical apart from the axis letter, and were
 * written out twice in `Graph.js`; parameterizing them means an axis label
 * behaves the same on both axes of both components by construction.
 *
 * The label is essential when no child supplies it, so it survives being set
 * from outside, and `inverseDefinition` writes back either to the last label
 * child or to that essential value.
 */

/** The child group an `<xLabel>` / `<yLabel>` child lands in. */
export function returnAxisLabelChildGroup({ axis }) {
    return {
        group: `${axis}Labels`,
        componentTypes: [`${axis}Label`],
    };
}

/**
 * `<axis>Label` and its companion `<axis>LabelHasLatex`, read from the last
 * `<xLabel>` / `<yLabel>` child if there is one.
 */
export function returnAxisLabelStateVariableDefinitions({ axis }) {
    const labelVar = `${axis}Label`;
    const hasLatexVar = `${axis}LabelHasLatex`;
    const childGroup = `${axis}Labels`;

    return {
        [labelVar]: {
            description: `The ${axis}-axis label text.`,
            forRenderer: true,
            public: true,
            shadowingInstructions: {
                createComponentOfType: "label",
                addStateVariablesShadowingStateVariables: {
                    hasLatex: {
                        stateVariableToShadow: hasLatexVar,
                    },
                },
            },
            hasEssential: true,
            defaultValue: "",
            additionalStateVariablesDefined: [
                {
                    variableName: hasLatexVar,
                    forRenderer: true,
                },
            ],
            returnDependencies: () => ({
                labelChild: {
                    dependencyType: "child",
                    childGroups: [childGroup],
                    variableNames: ["value", "hasLatex"],
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.labelChild.length > 0) {
                    const labelChild =
                        dependencyValues.labelChild[
                            dependencyValues.labelChild.length - 1
                        ];
                    return {
                        setValue: {
                            [labelVar]: labelChild.stateValues.value,
                            [hasLatexVar]: labelChild.stateValues.hasLatex,
                        },
                    };
                } else {
                    return {
                        useEssentialOrDefaultValue: { [labelVar]: true },
                        setValue: { [hasLatexVar]: false },
                    };
                }
            },
            inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                if (typeof desiredStateVariableValues[labelVar] !== "string") {
                    return { success: false };
                }

                if (dependencyValues.labelChild.length > 0) {
                    const lastLabelInd = dependencyValues.labelChild.length - 1;
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "labelChild",
                                desiredValue:
                                    desiredStateVariableValues[labelVar],
                                childIndex: lastLabelInd,
                                variableIndex: 0,
                            },
                        ],
                    };
                } else {
                    return {
                        success: true,
                        instructions: [
                            {
                                setEssentialValue: labelVar,
                                value: desiredStateVariableValues[labelVar],
                            },
                        ],
                    };
                }
            },
        },
    };
}

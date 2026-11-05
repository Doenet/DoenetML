import BooleanComponent from "../Boolean";

export default class BooleanOperator extends BooleanComponent {
    static componentType = "_booleanOperator";
    static rendererType = "boolean";

    static descendantCompositesMustHaveAReplacement = false;

    // Include children that can be added due to sugar
    static additionalSchemaChildren = ["string"];

    static returnSugarInstructions() {
        let sugarInstructions = super.returnSugarInstructions();

        let breakStringsIntoBooleansBySpaces = function ({
            matchedChildren,
            nComponents,
            stateIdInfo,
        }) {
            // break any string by white space and wrap pieces with boolean

            let newChildren = matchedChildren.reduce(function (a, c) {
                if (typeof c === "string") {
                    return [
                        ...a,
                        ...c
                            .split(/\s+/)
                            .filter((s) => s)
                            .map((s) => ({
                                type: "serialized",
                                componentType: "boolean",
                                componentIdx: nComponents++,
                                stateId: stateIdInfo
                                    ? `${stateIdInfo.prefix}${stateIdInfo.num++}`
                                    : undefined,
                                attributes: {},
                                doenetAttributes: {},
                                state: {},
                                children: [s],
                            })),
                    ];
                } else {
                    return [...a, c];
                }
            }, []);

            return {
                success: true,
                newChildren: newChildren,
                nComponents,
            };
        };

        sugarInstructions.push({
            replacementFunction: breakStringsIntoBooleansBySpaces,
        });

        return sugarInstructions;
    }

    static returnChildGroups() {
        return [
            {
                group: "booleans",
                // `_missing`: a bare reference to one thing that names
                // nothing (`$nothing`), a blank operand (D37), as
                // `<boolean extend="$nothing"/>` is
                componentTypes: ["boolean", "_missing"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        delete stateVariableDefinitions.parsedExpression;
        delete stateVariableDefinitions.mathChildrenByCode;

        let constructor = this;

        stateVariableDefinitions.value = {
            description:
                "The boolean result of applying this operator to its child boolean values.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            forRenderer: true,
            returnDependencies: () => ({
                booleanChildren: {
                    dependencyType: "child",
                    childGroups: ["booleans"],
                    variableNames: ["value", "valueMissing"],
                    variablesOptional: true,
                },
            }),
            definition: function ({ dependencyValues }) {
                // A missing operand (`valueMissing`: a value reference with
                // nothing to read, such as `$bl[$i]` with `$i` past the end
                // of the list, or a missing component) is a blank (D37),
                // which is not true, as `<boolean>＿</boolean>` is not:
                // `<and>$bl[$i] true</and>` is false while the entry is
                // missing, and `<or>$bl[$i] true</or>` true.
                return {
                    setValue: {
                        value: constructor.applyBooleanOperator(
                            dependencyValues.booleanChildren.map((x) =>
                                x.stateValues.valueMissing
                                    ? false
                                    : x.stateValues.value,
                            ),
                        ),
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }
}

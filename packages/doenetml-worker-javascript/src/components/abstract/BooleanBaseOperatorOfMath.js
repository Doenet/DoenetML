import BooleanComponent from "../Boolean";

export default class BooleanBaseOperatorOfMath extends BooleanComponent {
    static componentType = "_booleanOperatorOfMath";
    static rendererType = "boolean";

    // Include children that can be added due to sugar
    static additionalSchemaChildren = ["string"];

    static returnSugarInstructions() {
        let sugarInstructions = [];

        let wrapStringsAndMacros = function ({
            matchedChildren,
            nComponents,
            stateIdInfo,
        }) {
            // only apply if all children are strings or macros
            if (
                !matchedChildren.every(
                    (child) =>
                        typeof child === "string" ||
                        (child.extending && "Ref" in child.extending),
                )
            ) {
                return { success: false };
            }

            // don't apply to a single macro
            if (
                matchedChildren.length === 1 &&
                typeof matchedChildren[0] !== "string"
            ) {
                return { success: false };
            }

            return {
                success: true,
                newChildren: [
                    {
                        type: "serialized",
                        componentType: "math",
                        componentIdx: nComponents++,
                        stateId: stateIdInfo
                            ? `${stateIdInfo.prefix}${stateIdInfo.num++}`
                            : undefined,
                        attributes: {},
                        doenetAttributes: {},
                        state: {},
                        children: matchedChildren,
                    },
                ],
                nComponents,
            };
        };

        sugarInstructions.push({
            replacementFunction: wrapStringsAndMacros,
        });

        return sugarInstructions;
    }

    static returnChildGroups() {
        return [
            {
                group: "maths",
                componentTypes: ["math"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        delete stateVariableDefinitions.parsedExpression;
        delete stateVariableDefinitions.mathChildrenByCode;

        stateVariableDefinitions.booleanOperator = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { booleanOperator: (x) => false } }),
        };

        let constructor = this;

        stateVariableDefinitions.value = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            forRenderer: true,
            returnDependencies: () => ({
                mathChildren: {
                    dependencyType: "child",
                    childGroups: ["maths"],
                    variableNames: ["value"],
                },
                booleanOperator: {
                    dependencyType: "stateVariable",
                    variableName: "booleanOperator",
                },
            }),
            definition: function ({ dependencyValues }) {
                return {
                    setValue: {
                        value: dependencyValues.booleanOperator(
                            dependencyValues.mathChildren.map(
                                (x) => x.stateValues.value,
                            ),
                        ),
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }
}

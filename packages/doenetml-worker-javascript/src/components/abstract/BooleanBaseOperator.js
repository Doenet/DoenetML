import BooleanComponent from "../Boolean";
import { returnGroupIntoListEntriesOfComponentType } from "../commonsugar/lists";

export default class BooleanOperator extends BooleanComponent {
    static componentType = "_booleanOperator";
    static rendererType = "boolean";

    static descendantCompositesMustHaveAReplacement = false;

    // Include children that can be added due to sugar
    static additionalSchemaChildren = ["string"];

    static returnSugarInstructions() {
        let sugarInstructions = super.returnSugarInstructions();

        // Break the children into the entries of a list by the one rule for
        // lists (Doenet/DoenetML#2492) and wrap each in a boolean:
        // `<and>true false</and>`, or `<and>x > 1, y < 2</and>`. A reference
        // is an operand of its own, wherever it is written.
        const groupIntoListEntries = returnGroupIntoListEntriesOfComponentType({
            componentType: "boolean",
            componentsAreEntries: true,
        });

        let breakStringsIntoBooleansBySpaces = function ({
            matchedChildren,
            componentInfoObjects,
            nComponents,
            stateIdInfo,
            parentComponentType,
        }) {
            return groupIntoListEntries({
                matchedChildren,
                componentInfoObjects,
                nComponents,
                stateIdInfo,
                parentComponentType,
            });
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

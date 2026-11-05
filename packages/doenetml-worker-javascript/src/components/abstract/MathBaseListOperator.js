import ValueListComponent from "./ValueListComponent";
import me from "math-expressions";
import {
    mathOperatorInputsFromChildren,
    returnBreakStringsIntoMathsBySpacesSugarInstruction,
} from "../../utils/mathOperatorChildren";

/**
 * Base class for math operators that map a list of values to another list of
 * values, rather than reducing a list to a single value.
 *
 * `MathBaseOperator` covers the reduce case (`<sum>`, `<min>`, `<mean>`, …).
 * This covers the scan case (`<cumulativeSum>`, `<differences>`, …), where the
 * result is itself a list. The results are a list component of maths
 * (`ValueListComponent`), which a parent sees as one `<math>` per result, so
 * `$cum[2]`, `<sum>$cum</sum>` and `<numberList>$cum</numberList>` all work on
 * the result.
 *
 * Subclasses supply `numericListOperator` (numbers in, numbers out) and
 * `listOperator` (math-expressions in, math-expressions out). Which one runs is
 * decided by `isNumericOperator`, exactly as in `MathBaseOperator`: numeric
 * unless a math child is not a number, overridable with `forceSymbolic` /
 * `forceNumeric`.
 */
export default class MathBaseListOperator extends ValueListComponent {
    static componentType = "_mathListOperator";

    static listEntryComponentType = "math";

    static listEntryValuesVariable = "operatorResults";

    // Since the operator treats each child as a separate argument,
    // composites with no replacement should be ignored.
    static descendantCompositesMustHaveAReplacement = false;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.forceSymbolic = {
            createComponentOfType: "boolean",
            createStateVariable: "forceSymbolic",
            defaultValue: false,
            public: true,
            highlighted: true,
            description:
                "Whether to force the operator to evaluate symbolically rather than numerically.",
        };
        attributes.forceNumeric = {
            createComponentOfType: "boolean",
            createStateVariable: "forceNumeric",
            defaultValue: false,
            public: true,
            highlighted: true,
            description:
                "Whether to force the operator to evaluate numerically rather than symbolically.",
        };

        return attributes;
    }

    // Include children that can be added due to sugar
    static additionalSchemaChildren = ["string"];

    static returnSugarInstructions() {
        let sugarInstructions = super.returnSugarInstructions();

        sugarInstructions.push(
            returnBreakStringsIntoMathsBySpacesSugarInstruction(),
        );

        return sugarInstructions;
    }

    static returnChildGroups() {
        return [
            {
                group: "maths",
                componentTypes: ["math"],
            },
            {
                group: "numbers",
                componentTypes: ["number"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.isNumericOperator = {
            returnDependencies: () => ({
                forceNumeric: {
                    dependencyType: "stateVariable",
                    variableName: "forceNumeric",
                },
                forceSymbolic: {
                    dependencyType: "stateVariable",
                    variableName: "forceSymbolic",
                },
                mathChildren: {
                    dependencyType: "child",
                    childGroups: ["maths"],
                    variableNames: ["isNumber"],
                    variablesOptional: true,
                },
            }),
            definition({ dependencyValues }) {
                let isNumericOperator;
                if (dependencyValues.forceNumeric) {
                    isNumericOperator = true;
                } else if (dependencyValues.forceSymbolic) {
                    isNumericOperator = false;
                } else if (dependencyValues.mathChildren.length === 0) {
                    // A reference to the whole operator reads its results
                    // from the operator it references, so how a childless
                    // copy would compute does not arise.
                    isNumericOperator = true;
                } else {
                    // Have math children and aren't forced to be numeric or symbolic,
                    // so will be numeric only if all math children are numbers.
                    isNumericOperator = dependencyValues.mathChildren.every(
                        (x) => x.stateValues.isNumber,
                    );
                }

                return { setValue: { isNumericOperator } };
            },
        };

        // Overridden by subclasses. Takes an array of numbers, returns an array
        // of numbers.
        stateVariableDefinitions.numericListOperator = {
            returnDependencies: () => ({}),
            definition: () => ({
                setValue: { numericListOperator: (inputs) => inputs },
            }),
        };

        // Overridden by subclasses. Takes an array of math-expressions, returns
        // an array of math-expressions.
        stateVariableDefinitions.listOperator = {
            returnDependencies: () => ({}),
            definition: () => ({
                setValue: { listOperator: (inputs) => inputs },
            }),
        };

        stateVariableDefinitions.operatorResults = {
            returnDependencies: () => ({
                mathNumberChildren: {
                    dependencyType: "child",
                    childGroups: ["maths", "numbers"],
                    variableNames: ["value"],
                },
                isNumericOperator: {
                    dependencyType: "stateVariable",
                    variableName: "isNumericOperator",
                },
                numericListOperator: {
                    dependencyType: "stateVariable",
                    variableName: "numericListOperator",
                },
                listOperator: {
                    dependencyType: "stateVariable",
                    variableName: "listOperator",
                },
            }),
            definition({ dependencyValues, componentInfoObjects }) {
                if (dependencyValues.mathNumberChildren.length === 0) {
                    return { setValue: { operatorResults: [] } };
                }

                let inputs = mathOperatorInputsFromChildren({
                    children: dependencyValues.mathNumberChildren,
                    isNumeric: dependencyValues.isNumericOperator,
                    componentInfoObjects,
                });

                if (dependencyValues.isNumericOperator) {
                    // The numeric operators work in plain numbers, so their
                    // results have to be lifted back into math-expressions.
                    let results =
                        dependencyValues.numericListOperator(inputs) ?? [];

                    return {
                        setValue: {
                            operatorResults: results.map((x) => me.fromAst(x)),
                        },
                    };
                }

                return {
                    setValue: {
                        operatorResults:
                            dependencyValues.listOperator(inputs) ?? [],
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }
}

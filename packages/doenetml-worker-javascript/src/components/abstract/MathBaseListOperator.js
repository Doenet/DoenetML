import CompositeComponent from "./CompositeComponent";
import me from "math-expressions";
import {
    addReplacementRendererType,
    calculateValueListReplacementChanges,
    createValueListReplacements,
    returnPassThroughAttributeDeclarations,
    returnPassThroughAttributes,
} from "../../utils/valueListReplacements";
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
 * result is itself a list. That difference forces a different shape: the result
 * has to become several components, so these are composites that create fresh
 * `<math>` replacements, in the manner of `<sequence>`. (`<sort>` is a composite
 * too, but it *copies* its children; here the values are newly computed and
 * there is nothing to copy.)
 *
 * Being a composite is what makes `$cum[2]`, `<sum>$cum</sum>` and
 * `<numberList>$cum</numberList>` all work on the result.
 *
 * Subclasses supply `numericListOperator` (numbers in, numbers out) and
 * `listOperator` (math-expressions in, math-expressions out). Which one runs is
 * decided by `isNumericOperator`, exactly as in `MathBaseOperator`: numeric
 * unless a math child is not a number, overridable with `forceSymbolic` /
 * `forceNumeric`.
 */
export default class MathBaseListOperator extends CompositeComponent {
    static componentType = "_mathListOperator";

    static takesIndex = true;

    static stateVariableToEvaluateAfterReplacements =
        "readyToExpandWhenResolved";

    static allowInSchemaAsComponent = ["math"];

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
            description:
                "Whether to force the operator to evaluate symbolically rather than numerically.",
        };
        attributes.forceNumeric = {
            createComponentOfType: "boolean",
            createStateVariable: "forceNumeric",
            defaultValue: false,
            public: true,
            description:
                "Whether to force the operator to evaluate numerically rather than symbolically.",
        };

        // `fixed` and the rounding settings are not used by the composite
        // itself; they are passed through to each of the <math> components it
        // creates.
        Object.assign(attributes, returnPassThroughAttributeDeclarations());

        attributes.asList = {
            createPrimitiveOfType: "boolean",
            createStateVariable: "asList",
            defaultValue: true,
            description:
                "Whether to render the items separated by commas (true) or with no separator (false).",
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
                    // Unlike `MathBaseOperator`, there is no shadow source to
                    // fall back on: extending one of these composites copies
                    // its children too, so a childless copy of a symbolic
                    // operator cannot arise.
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

        stateVariableDefinitions.readyToExpandWhenResolved = {
            returnDependencies: () => ({
                operatorResults: {
                    dependencyType: "stateVariable",
                    variableName: "operatorResults",
                },
            }),
            // When this state variable is marked stale it indicates we should
            // update replacements. For this to work, we must get its value in
            // the replacement functions so that the variable is marked fresh.
            markStale: () => ({ updateReplacements: true }),
            definition: function () {
                return { setValue: { readyToExpandWhenResolved: true } };
            },
        };

        return stateVariableDefinitions;
    }

    static async createSerializedReplacements({
        component,
        componentInfoObjects,
        workspace,
        nComponents,
    }) {
        return createValueListReplacements({
            component,
            values: await component.stateValues.operatorResults,
            componentType: "math",
            attributesToConvert: returnPassThroughAttributes(component),
            componentInfoObjects,
            workspace,
            nComponents,
        });
    }

    static async calculateReplacementChanges({
        component,
        componentInfoObjects,
        workspace,
        nComponents,
    }) {
        return calculateValueListReplacementChanges({
            component,
            values: await component.stateValues.operatorResults,
            componentType: "math",
            attributesToConvert: returnPassThroughAttributes(component),
            componentInfoObjects,
            workspace,
            nComponents,
        });
    }

    addOwnPotentialRendererTypes(rendererTypes, visited) {
        super.addOwnPotentialRendererTypes(rendererTypes, visited);

        // The replacements are `<math>` components whatever the children are.
        addReplacementRendererType({
            component: this,
            componentType: "math",
            rendererTypes,
        });
    }
}

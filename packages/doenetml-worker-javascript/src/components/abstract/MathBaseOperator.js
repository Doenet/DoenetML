import { returnNumberDisplayStateVariableDefinitions } from "../../utils/numberDisplay";
import MathComponent from "../Math";
import me from "math-expressions";
import {
    mathOperatorInputsFromChildren,
    returnBreakStringsIntoMathsBySpacesSugarInstruction,
} from "../../utils/mathOperatorChildren";
import { isNumericConstant } from "../../utils/math";
import { holdsNaN, isMissingInput } from "../../utils/missing";

/**
 * The children an operator takes as operands, each with its index among
 * `children` (which a write through the operator addresses). A missing
 * operand (`valueMissing`: a value reference with nothing to read, such as
 * `$l[$i]` with `$i` past the end of the list, or a missing component) is a
 * blank, as it is in a `<math>` (D37): `<sum>$l[$i] 5</sum>` is `＿ + 5`,
 * not 5, and `<count>$l[$i] 5</count>` is 2.
 */
function operandChildren(children) {
    return children.map((child, childIndex) => ({
        child: child.stateValues.valueMissing ? blankOperand(child) : child,
        childIndex,
    }));
}

/**
 * The missing operand `child` as a blank math, which cannot be written
 * through.
 */
function blankOperand(child) {
    return {
        ...child,
        componentType: "math",
        stateValues: {
            ...child.stateValues,
            value: me.fromAst("\uff3f"),
            isNumber: false,
            canBeModified: false,
            unordered: false,
        },
    };
}

export default class MathOperator extends MathComponent {
    static componentType = "_mathOperator";
    static rendererType = "math";

    // since math operator treats each child a separate argument
    // composites with no replacement should be ignored.
    // turn off this flag set in math
    static descendantCompositesMustHaveAReplacement = false;

    /**
     * Whether the operator counts its operands rather than computing from
     * their values (`<count>`), so a missing operand is counted (VAL-5)
     * rather than making the result missing (D40).
     */
    static countsMissingOperands = false;

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
        return attributes;
    }

    // Include children that can be added due to sugar
    static additionalSchemaChildren = ["string"];

    static returnSugarInstructions() {
        let sugarInstructions = super.returnSugarInstructions();

        sugarInstructions.push(
            returnBreakStringsIntoMathsBySpacesSugarInstruction(
                this.componentType,
            ),
        );

        return sugarInstructions;
    }

    static returnChildGroups() {
        return [
            {
                group: "maths",
                // `_missing`: a bare reference to one thing that names
                // nothing (`$nothing`), a blank operand (`operandChildren`,
                // D37), as `<math extend="$nothing"/>` is
                componentTypes: ["math", "_missing"],
            },
            {
                group: "numbers",
                componentTypes: ["number"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();
        const countsMissingOperands = this.countsMissingOperands;

        let roundingDefinitions = returnNumberDisplayStateVariableDefinitions({
            childGroupsIfSingleMatch: ["maths", "numbers"],
            skipChildrenWithNothingToRead: true,
        });
        Object.assign(stateVariableDefinitions, roundingDefinitions);

        // `unordered` (`Math.js`): whether every math child is unordered,
        // taken over the operands alone, so that a missing one does not make
        // `<sum><math unordered>(1,2)</math> $ml[$i]</sum>` ordered
        const unorderedDefinition = stateVariableDefinitions.unordered;
        stateVariableDefinitions.unordered = {
            ...unorderedDefinition,
            returnDependencies(args) {
                const dependencies =
                    unorderedDefinition.returnDependencies.call(this, args);
                return {
                    ...dependencies,
                    mathChildren: {
                        ...dependencies.mathChildren,
                        variableNames: [
                            ...dependencies.mathChildren.variableNames,
                            "valueMissing",
                        ],
                        variablesOptional: true,
                    },
                };
            },
            definition(args) {
                return unorderedDefinition.definition.call(this, {
                    ...args,
                    dependencyValues: {
                        ...args.dependencyValues,
                        mathChildren: operandChildren(
                            args.dependencyValues.mathChildren,
                        ).map(({ child }) => child),
                    },
                });
            },
        };

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
                    variableNames: ["isNumber", "valueMissing"],
                    variablesOptional: true,
                },
                numberChildren: {
                    dependencyType: "child",
                    childGroups: ["numbers"],
                    variableNames: ["valueMissing"],
                    variablesOptional: true,
                },
                shadowSource: {
                    dependencyType: "shadowSource",
                    variableNames: ["isNumericOperator"],
                },
            }),
            definition({ dependencyValues }) {
                const mathChildren = operandChildren(
                    dependencyValues.mathChildren,
                ).map(({ child }) => child);
                let isNumericOperator;
                if (dependencyValues.forceNumeric) {
                    isNumericOperator = true;
                } else if (dependencyValues.forceSymbolic) {
                    isNumericOperator = false;
                } else if (mathChildren.length === 0) {
                    isNumericOperator =
                        dependencyValues.shadowSource?.stateValues
                            .isNumericOperator;
                    if (isNumericOperator === undefined) {
                        isNumericOperator = true;
                    }
                } else {
                    // have math children and aren't forced to be numeric or symbolic
                    // will be numeric only if have all math children are numbers
                    isNumericOperator = mathChildren.every(
                        (x) => x.stateValues.isNumber,
                    );
                }

                return { setValue: { isNumericOperator } };
            },
        };

        delete stateVariableDefinitions.codePre;
        delete stateVariableDefinitions.expressionWithCodes;
        delete stateVariableDefinitions.mathChildrenFunctionSymbols;
        delete stateVariableDefinitions.codesAdjacentToStrings;
        delete stateVariableDefinitions.mathChildrenByVectorComponent;

        stateVariableDefinitions.mathOperator = {
            returnDependencies: () => ({}),
            definition: () => ({
                setValue: { mathOperator: (x) => me.fromAst("\uff3f") },
            }),
        };

        stateVariableDefinitions.numericOperator = {
            returnDependencies: () => ({}),
            definition: () => ({
                setValue: { numericOperator: (x) => me.fromAst("\uff3f") },
            }),
        };

        stateVariableDefinitions.inverseMathOperator = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { inverseMathOperator: null } }),
        };

        stateVariableDefinitions.inverseNumericOperator = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { inverseNumericOperator: null } }),
        };

        stateVariableDefinitions.unnormalizedValue = {
            returnDependencies: () => ({
                mathNumberChildren: {
                    dependencyType: "child",
                    childGroups: ["maths", "numbers"],
                    variableNames: [
                        "value",
                        "canBeModified",
                        "valueMissing",
                        "isNumber",
                    ],
                    variablesOptional: true,
                },
                isNumericOperator: {
                    dependencyType: "stateVariable",
                    variableName: "isNumericOperator",
                },
                mathOperator: {
                    dependencyType: "stateVariable",
                    variableName: "mathOperator",
                },
                numericOperator: {
                    dependencyType: "stateVariable",
                    variableName: "numericOperator",
                },
                inverseMathOperator: {
                    dependencyType: "stateVariable",
                    variableName: "inverseMathOperator",
                },
                inverseNumericOperator: {
                    dependencyType: "stateVariable",
                    variableName: "inverseNumericOperator",
                },
            }),
            definition: function ({ dependencyValues, componentInfoObjects }) {
                const operands = operandChildren(
                    dependencyValues.mathNumberChildren,
                );
                if (operands.length === 0) {
                    return {
                        setValue: { unnormalizedValue: me.fromAst("\uff3f") },
                    };
                }

                const blank = {
                    setValue: { unnormalizedValue: me.fromAst("\uff3f") },
                };
                const isNumberChild = (child) =>
                    componentInfoObjects.isInheritedComponentType({
                        inheritedComponentType: child.componentType,
                        baseComponentType: "number",
                    });
                const children = dependencyValues.mathNumberChildren;

                // A numeric operator computes a number, which can't hold a
                // blank, so a missing number operand makes it missing (D40,
                // VAL-5, #2460): `<sum>` or `<mean>` of `<numberList>1
                // $nothing 3</numberList>` is `＿`, not `NaN`, while every
                // other operand is a number too. An operator forced symbolic,
                // or one with a symbolic operand, holds the blank (`<sum>$nothing
                // x</sum>` is `＿ + x`), as a `<math>` does, and so does one
                // whose missing operand has no type (`<sum>$nothing 3</sum>` is
                // `＿ + 3`).
                if (
                    dependencyValues.isNumericOperator &&
                    !countsMissingOperands &&
                    children.some(
                        (child) =>
                            child.stateValues.valueMissing &&
                            isNumberChild(child),
                    ) &&
                    children.every(
                        (child) =>
                            isNumberChild(child) ||
                            (!child.stateValues.valueMissing &&
                                child.stateValues.isNumber),
                    )
                ) {
                    return blank;
                }

                let inputs = mathOperatorInputsFromChildren({
                    children: operands.map(({ child }) => child),
                    isNumeric: dependencyValues.isNumericOperator,
                    componentInfoObjects,
                });

                let unnormalizedValue;
                if (dependencyValues.isNumericOperator) {
                    unnormalizedValue = me.fromAst(
                        dependencyValues.numericOperator(inputs),
                    );
                } else {
                    unnormalizedValue = dependencyValues.mathOperator(inputs);
                }

                // A `NaN` caused by a missing or blank operand is missing
                // (D40, #2460): `<median><math>＿</math></median>`. A `NaN`
                // from present operands (`<median>1 2 x</median>`) stays. An
                // operator of one input does the same
                // (`MathBaseOperatorOneInput`).
                if (
                    !countsMissingOperands &&
                    children.some(isMissingInput) &&
                    holdsNaN(unnormalizedValue)
                ) {
                    return blank;
                }

                return { setValue: { unnormalizedValue } };
            },
            inverseDefinition: function ({
                desiredStateVariableValues,
                dependencyValues,
                componentInfoObjects,
            }) {
                const operands = operandChildren(
                    dependencyValues.mathNumberChildren,
                );
                if (operands.length === 0) {
                    return { success: false };
                } else if (dependencyValues.isNumericOperator) {
                    if (dependencyValues.inverseNumericOperator) {
                        let inputs = [];
                        let canBeModified = [];
                        let inputToChildIndex = [];
                        for (const {
                            child,
                            childIndex: childInd,
                        } of operands) {
                            if (
                                componentInfoObjects.isInheritedComponentType({
                                    inheritedComponentType: child.componentType,
                                    baseComponentType: "number",
                                })
                            ) {
                                inputs.push(child.stateValues.value);
                                canBeModified.push(
                                    child.stateValues.canBeModified,
                                );
                                inputToChildIndex.push(childInd);
                            } else {
                                // math — `NaN` for anything with no numeric
                                // reading, the same coercion
                                // `mathOperatorInputsFromChildren` applies to
                                // the forward definition's inputs and for the
                                // same reason. No `inverseNumericOperator`
                                // reads `inputs` today (`<min>` and `<max>`,
                                // the only two, decide from `canBeModified`
                                // alone), so this states the contract rather
                                // than repairing a defect; a `Complex` here
                                // would be a string concatenation to the first
                                // one that did read it.
                                const value =
                                    child.stateValues.value.evaluate_to_constant();
                                inputs.push(
                                    isNumericConstant(value) ? value : NaN,
                                );
                                canBeModified.push(
                                    child.stateValues.canBeModified,
                                );
                                inputToChildIndex.push(childInd);
                            }
                        }
                        let results = dependencyValues.inverseNumericOperator({
                            desiredValue:
                                desiredStateVariableValues.unnormalizedValue.evaluate_to_constant(),
                            inputs,
                            canBeModified,
                            desiredMathValue:
                                desiredStateVariableValues.unnormalizedValue,
                        });

                        if (results.success) {
                            let childIndex =
                                inputToChildIndex[results.inputNumber];
                            if (Number.isFinite(childIndex)) {
                                let desiredValue = results.inputValue;

                                return {
                                    success: true,
                                    instructions: [
                                        {
                                            setDependency: "mathNumberChildren",
                                            desiredValue,
                                            childIndex,
                                            variableIndex: 0,
                                        },
                                    ],
                                };
                            } else {
                                return { success: false };
                            }
                        } else {
                            return { success: false };
                        }
                    } else {
                        return { success: false };
                    }
                } else if (dependencyValues.inverseMathOperator) {
                    let inputs = [];
                    let canBeModified = [];
                    let inputToChildIndex = [];
                    for (const { child, childIndex: childInd } of operands) {
                        if (
                            componentInfoObjects.isInheritedComponentType({
                                inheritedComponentType: child.componentType,
                                baseComponentType: "number",
                            })
                        ) {
                            inputs.push(me.fromAst(child.stateValues.value));
                            canBeModified.push(child.stateValues.canBeModified);
                            inputToChildIndex.push(childInd);
                        } else {
                            // math
                            inputs.push(child.stateValues.value);
                            canBeModified.push(child.stateValues.canBeModified);
                            inputToChildIndex.push(childInd);
                        }
                    }

                    let results = dependencyValues.inverseMathOperator({
                        desiredValue:
                            desiredStateVariableValues.unnormalizedValue,
                        inputs,
                        canBeModified,
                    });

                    if (results.success) {
                        let childIndex = inputToChildIndex[results.inputNumber];
                        if (Number.isFinite(childIndex)) {
                            let desiredValue = results.inputValue;

                            return {
                                success: true,
                                instructions: [
                                    {
                                        setDependency: "mathNumberChildren",
                                        desiredValue,
                                        childIndex,
                                        variableIndex: 0,
                                    },
                                ],
                            };
                        } else {
                            return { success: false };
                        }
                    } else {
                        return { success: false };
                    }
                } else {
                    return { success: false };
                }
            },
        };

        // create new version on canBeModified that is true only if
        // there is just one child component that can be modified
        // and we have a inverseMathOperator/inverseNumberOperator
        stateVariableDefinitions.canBeModified = {
            returnDependencies: () => ({
                fixed: {
                    dependencyType: "stateVariable",
                    variableName: "fixed",
                },
                mathNumberChildren: {
                    dependencyType: "child",
                    childGroups: ["maths", "numbers"],
                    variableNames: ["canBeModified", "valueMissing"],
                    variablesOptional: true,
                },
                isNumericOperator: {
                    dependencyType: "stateVariable",
                    variableName: "isNumericOperator",
                },
                inverseMathOperator: {
                    dependencyType: "stateVariable",
                    variableName: "mathOperator",
                },
                inverseNumericOperator: {
                    dependencyType: "stateVariable",
                    variableName: "inverseNumericOperator",
                },
            }),
            definition: function ({ dependencyValues }) {
                let canBeModified =
                    !dependencyValues.fixed &&
                    Boolean(
                        dependencyValues.isNumericOperator
                            ? dependencyValues.inverseNumericOperator
                            : dependencyValues.inverseMathOperator,
                    );

                if (canBeModified) {
                    const operands = operandChildren(
                        dependencyValues.mathNumberChildren,
                    );
                    // TODO: if there are no children, canBeModified may be incorrectly set to true
                    // But, we include this exception so that canBeModified is not set to false
                    // in macros, where children aren't copied
                    if (operands.length > 0) {
                        let nModifiable = operands.filter(
                            ({ child }) => child.stateValues.canBeModified,
                        ).length;

                        if (nModifiable !== 1) {
                            canBeModified = false;
                        }
                    }
                }

                return { setValue: { canBeModified } };
            },
        };

        return stateVariableDefinitions;
    }
}

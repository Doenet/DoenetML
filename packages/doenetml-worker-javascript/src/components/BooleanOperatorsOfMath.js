import BooleanBaseOperatorOfMath from "./abstract/BooleanBaseOperatorOfMath";
import { evaluateNumericPredicate } from "../utils/math";

/**
 * The `booleanOperator` state variable shared by `<isNumber>` and
 * `<isInteger>`. Both take exactly one math child and apply the correspondingly
 * named check to it, honoring the inherited `allowUnits` attribute so that they
 * agree with the `isnumber(...)` / `isinteger(...)` functions written inside a
 * `<boolean>`.
 *
 * `componentName` is the class name used in the arity warning, matching how the
 * sibling operators in this file name themselves.
 */
function returnNumericPredicateOperator({ predicate, componentName }) {
    return {
        returnDependencies: () => ({
            allowUnits: {
                dependencyType: "stateVariable",
                variableName: "allowUnits",
            },
        }),
        definition: ({ dependencyValues }) => ({
            setValue: {
                booleanOperator: function (values) {
                    if (values.length === 0) {
                        return false;
                    }
                    if (values.length !== 1) {
                        console.warn(
                            `${componentName} requires exactly one math child`,
                        );
                        return null;
                    }

                    return evaluateNumericPredicate({
                        predicate,
                        expression: values[0],
                        allowUnits: dependencyValues.allowUnits,
                    });
                },
            },
        }),
    };
}

export class IsInteger extends BooleanBaseOperatorOfMath {
    static componentType = "isInteger";

    static componentDocs = {
        summary: "True when the math child evaluates to an integer",
    };
    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.booleanOperator =
            returnNumericPredicateOperator({
                predicate: "isinteger",
                componentName: "IsInteger",
            });

        return stateVariableDefinitions;
    }
}

export class IsNumber extends BooleanBaseOperatorOfMath {
    static componentType = "isNumber";

    static componentDocs = {
        summary: "True when the math child evaluates to a finite number",
    };
    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.booleanOperator =
            returnNumericPredicateOperator({
                predicate: "isnumber",
                componentName: "IsNumber",
            });

        return stateVariableDefinitions;
    }
}

export class IsBetween extends BooleanBaseOperatorOfMath {
    static componentType = "isBetween";

    static componentDocs = {
        summary: "True when a math value is between two given bounds",
    };
    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.limits = {
            createComponentOfType: "numberList",
            createStateVariable: "limits",
            defaultValue: [],
            public: true,
            description:
                "Numeric limits used by the boolean operator (e.g. bounds for isBetween).",
        };
        attributes.strict = {
            createComponentOfType: "boolean",
            createStateVariable: "strict",
            defaultValue: false,
            public: true,
            description:
                "Whether the comparison is strict (e.g. uses < instead of ≤).",
        };
        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.booleanOperator = {
            returnDependencies: () => ({
                limits: {
                    dependencyType: "stateVariable",
                    variableName: "limits",
                },
                strict: {
                    dependencyType: "stateVariable",
                    variableName: "strict",
                },
            }),
            definition({ dependencyValues }) {
                let upperLimit, lowerLimit;

                let lim1 = dependencyValues.limits[0];
                let lim2 = dependencyValues.limits[1];

                let strict = dependencyValues.strict;

                if (lim1 < lim2 || (!strict && lim1 === lim2)) {
                    lowerLimit = lim1;
                    upperLimit = lim2;
                } else if (lim2 < lim1) {
                    lowerLimit = lim2;
                    upperLimit = lim1;
                } else {
                    return { setValue: { booleanOperator: () => false } };
                }

                return {
                    setValue: {
                        booleanOperator: function (values) {
                            if (values.length === 0) {
                                return false;
                            }
                            if (values.length !== 1) {
                                console.warn(
                                    "IsBetween requires exactly one math child",
                                );
                                return null;
                            }
                            let numericValue = values[0].evaluate_to_constant();

                            if (strict) {
                                return (
                                    numericValue > lowerLimit &&
                                    numericValue < upperLimit
                                );
                            } else {
                                return (
                                    numericValue >= lowerLimit &&
                                    numericValue <= upperLimit
                                );
                            }
                        },
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }
}

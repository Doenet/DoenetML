import BooleanBaseOperatorOfMath from "./abstract/BooleanBaseOperatorOfMath";
import { evaluateNumericPredicate } from "../utils/math";

/**
 * Wrap `evaluate` in the arity check every operator in this file needs: a
 * `booleanOperator` receives the values of all math children, but each of these
 * operators is defined only on a single one.
 *
 * No children at all is the ordinary state of a half-typed document, so it
 * answers `false` quietly; two or more is an authoring mistake, so it warns and
 * answers `null`. `componentName` is the class name used in that warning.
 */
function returnSingleMathChildOperator(componentName, evaluate) {
    return function (values) {
        if (values.length === 0) {
            return false;
        }
        if (values.length !== 1) {
            console.warn(`${componentName} requires exactly one math child`);
            return null;
        }
        return evaluate(values[0]);
    };
}

/**
 * The `booleanOperator` state variable shared by `<isNumber>` and
 * `<isInteger>`. Both apply the correspondingly named check to their single
 * math child, honoring the `allowUnits` attribute they inherit from
 * `<boolean>` so that they treat a quantity written with a unit the same way
 * the `isnumber(...)` / `isinteger(...)` functions do.
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
                booleanOperator: returnSingleMathChildOperator(
                    componentName,
                    (expression) =>
                        evaluateNumericPredicate({
                            predicate,
                            expression,
                            allowUnits: dependencyValues.allowUnits,
                        }),
                ),
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
                        booleanOperator: returnSingleMathChildOperator(
                            "IsBetween",
                            (expression) => {
                                let numericValue =
                                    expression.evaluate_to_constant();

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
                        ),
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }
}

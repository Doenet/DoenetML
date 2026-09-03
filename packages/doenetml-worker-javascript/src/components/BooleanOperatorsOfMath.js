import BooleanBaseOperatorOfMath from "./abstract/BooleanBaseOperatorOfMath";
import { evaluateNumericPredicate } from "../utils/math";

/**
 * Wrap `evaluate` in the arity check every operator in this file needs: a
 * `booleanOperator` receives the values of all math children, but each of these
 * operators is defined only on a single one.
 *
 * No children at all is the ordinary state of a half-typed document, so it
 * answers `false` quietly; two or more is an authoring mistake, so it warns and
 * answers `null`. `componentType` is the tag name reported in that warning.
 */
function returnSingleMathChildOperator(componentType, evaluate) {
    return function (values) {
        if (values.length === 0) {
            return false;
        }
        if (values.length !== 1) {
            console.warn(`<${componentType}> requires exactly one math child`);
            return null;
        }
        return evaluate(values[0]);
    };
}

/**
 * Shared implementation of `<isNumber>` and `<isInteger>`, which differ only in
 * which check they name. Each applies its check to its single math child,
 * honoring the `allowUnits` attribute they inherit from `<boolean>` so that
 * they treat a quantity written with a unit the same way the `isnumber(...)` /
 * `isinteger(...)` functions do.
 *
 * These two tags also take a parent fall-back for `allowUnits` that `<boolean>`
 * deliberately does not have. The comparison settings `<boolean>` declares —
 * `symbolicEquality` and the rest — each govern a comparison the `<boolean>`
 * performs itself, so there is no second way to spell them and nothing to stay
 * consistent with. `allowUnits` is the exception: the same check is written
 * either as one of these tags or as the matching function, and the function is
 * evaluated by the enclosing `<when>` or `<award>`, which does fall back to its
 * parent. Without the fall-back, `<answer allowUnits="false">` would reach the
 * function spelling and not the tag.
 *
 * Each component consults only its immediate parent, and only when that
 * parent's value was set rather than defaulted (a parent without the state
 * variable resolves to null). A setting can still travel several levels,
 * because each link in an `<answer>` → `<award>` → `<when>` chain falls back in
 * turn; but a tag written outside such a chain keeps its own default.
 *
 * Must stay unexported: `ComponentTypes.js` registers every export of this file
 * as a component type, and this class declares no `componentType` of its own.
 */
class NumericPredicateOfMath extends BooleanBaseOperatorOfMath {
    /**
     * Which check to apply: `"isnumber"` or `"isinteger"`, the same names the
     * function spelling uses. Set by each subclass.
     */
    static predicate;

    static createAttributesObject() {
        const attributes = super.createAttributesObject();
        attributes.allowUnits.fallBackToParentStateVariable = "allowUnits";
        return attributes;
    }

    static returnStateVariableDefinitions() {
        const stateVariableDefinitions = super.returnStateVariableDefinitions();
        const { predicate, componentType } = this;

        stateVariableDefinitions.booleanOperator = {
            returnDependencies: () => ({
                allowUnits: {
                    dependencyType: "stateVariable",
                    variableName: "allowUnits",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    booleanOperator: returnSingleMathChildOperator(
                        componentType,
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

        return stateVariableDefinitions;
    }
}

export class IsInteger extends NumericPredicateOfMath {
    static componentType = "isInteger";
    static predicate = "isinteger";

    static componentDocs = {
        summary: "True when the math child evaluates to an integer",
    };
}

export class IsNumber extends NumericPredicateOfMath {
    static componentType = "isNumber";
    static predicate = "isnumber";

    static componentDocs = {
        summary: "True when the math child evaluates to a finite number",
    };
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
        const componentType = this.componentType;

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
                            componentType,
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

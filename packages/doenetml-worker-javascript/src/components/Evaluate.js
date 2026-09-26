import MathComponent from "./Math";
import me from "math-expressions";
import {
    returnNumericFunctionForEvaluate,
    returnSymbolicFunctionForEvaluate,
    vectorOperators,
    find_effective_domain,
} from "@doenet/utils";
import {
    returnNumberDisplayAttributeComponentShadowing,
    returnNumberDisplayStateVariableDefinitions,
} from "../utils/numberDisplay";

export default class Evaluate extends MathComponent {
    static componentType = "evaluate";

    static componentDocs = {
        summary: "Evaluates a function at a math value",
    };
    static rendererType = "math";

    // remove variableForImplicitProp so that an evaluate copied into a function
    // behaves like an evaluate (not just the value property) and can be reevaluated
    static variableForImplicitProp = undefined;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.forceSymbolic = {
            description: "Whether to force symbolic evaluation.",
            createComponentOfType: "boolean",
            createStateVariable: "forceSymbolic",
            defaultValue: false,
            public: true,
        };
        attributes.forceNumeric = {
            description: "Whether to force numeric evaluation.",
            createComponentOfType: "boolean",
            createStateVariable: "forceNumeric",
            defaultValue: false,
            public: true,
        };

        attributes.function = {
            createComponentOfType: "function",
            description: "The function to evaluate.",
        };

        attributes.input = {
            createComponentOfType: "mathList",
            description: "Input value(s) at which to evaluate the function.",
        };

        attributes.unordered = {
            description: "Whether to treat the inputs as unordered.",
            createComponentOfType: "boolean",
            createStateVariable: "unordered",
            defaultValue: false,
            public: true,
        };

        return attributes;
    }

    static returnChildGroups() {
        return [];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        delete stateVariableDefinitions.codePre;
        delete stateVariableDefinitions.expressionWithCodes;
        delete stateVariableDefinitions.mathChildrenFunctionSymbols;
        delete stateVariableDefinitions.codesAdjacentToStrings;
        delete stateVariableDefinitions.mathChildrenByVectorComponent;
        delete stateVariableDefinitions.mathChildrenWithCanBeModified;
        delete stateVariableDefinitions.unordered;

        stateVariableDefinitions.canBeModified = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { canBeModified: false } }),
        };

        let roundingDefinitions = returnNumberDisplayStateVariableDefinitions({
            additionalAttributeComponent: "function",
        });
        Object.assign(stateVariableDefinitions, roundingDefinitions);

        stateVariableDefinitions.inputMaths = {
            returnDependencies: () => ({
                inputAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "input",
                    variableNames: ["maths"],
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.inputAttr) {
                    return {
                        setValue: {
                            inputMaths:
                                dependencyValues.inputAttr.stateValues.maths,
                        },
                    };
                } else {
                    return { setValue: { inputMaths: [] } };
                }
            },
        };

        stateVariableDefinitions.unnormalizedValue = {
            returnDependencies() {
                return {
                    inputMaths: {
                        dependencyType: "stateVariable",
                        variableName: "inputMaths",
                    },
                    functionAttr: {
                        dependencyType: "attributeComponent",
                        attributeName: "function",
                        variableNames: [
                            "symbolicfs",
                            "numericalfs",
                            "symbolic",
                            "numInputs",
                        ],
                    },
                    forceSymbolic: {
                        dependencyType: "stateVariable",
                        variableName: "forceSymbolic",
                    },
                    forceNumeric: {
                        dependencyType: "stateVariable",
                        variableName: "forceNumeric",
                    },
                };
            },
            definition({ dependencyValues }) {
                let functionComp = dependencyValues.functionAttr;

                if (!functionComp) {
                    return {
                        setValue: {
                            unnormalizedValue: me.fromAst("\uFF3F"),
                        },
                    };
                }

                let f;
                if (
                    !dependencyValues.forceNumeric &&
                    (functionComp.stateValues.symbolic ||
                        dependencyValues.forceSymbolic)
                ) {
                    f = returnSymbolicFunctionForEvaluate({
                        numInputs: functionComp.stateValues.numInputs,
                        symbolicfs: functionComp.stateValues.symbolicfs,
                    });
                } else {
                    f = returnNumericFunctionForEvaluate({
                        numInputs: functionComp.stateValues.numInputs,
                        numericalfs: functionComp.stateValues.numericalfs,
                    });
                }

                let unnormalizedValue = f(dependencyValues.inputMaths);

                // console.log("unnormalizedValue")
                // console.log(unnormalizedValue)

                return {
                    setValue: { unnormalizedValue },
                };
            },
        };

        stateVariableDefinitions.formula = {
            description:
                "The function evaluated at the inputs as a math expression.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "math",
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
            },
            returnDependencies() {
                return {
                    inputMaths: {
                        dependencyType: "stateVariable",
                        variableName: "inputMaths",
                    },
                    functionAttr: {
                        dependencyType: "attributeComponent",
                        attributeName: "function",
                        variableNames: ["symbolicfs", "numInputs"],
                    },
                };
            },
            definition({ dependencyValues }) {
                let functionComp = dependencyValues.functionAttr;

                if (!functionComp) {
                    return {
                        setValue: {
                            formula: me.fromAst("\uFF3F"),
                        },
                    };
                }

                let f = returnSymbolicFunctionForEvaluate({
                    numInputs: functionComp.stateValues.numInputs,
                    symbolicfs: functionComp.stateValues.symbolicfs,
                });

                let formula = f(dependencyValues.inputMaths);

                return {
                    setValue: { formula },
                };
            },
        };

        stateVariableDefinitions.fReevaluate = {
            returnDependencies() {
                return {
                    functionAttr: {
                        dependencyType: "attributeComponent",
                        attributeName: "function",
                        variableNames: [
                            "symbolicfs",
                            "numericalfs",
                            "symbolic",
                            "numInputs",
                        ],
                    },
                    forceSymbolic: {
                        dependencyType: "stateVariable",
                        variableName: "forceSymbolic",
                    },
                    forceNumeric: {
                        dependencyType: "stateVariable",
                        variableName: "forceNumeric",
                    },
                };
            },
            definition({ dependencyValues }) {
                let functionComp = dependencyValues.functionAttr;

                if (!functionComp) {
                    return {
                        setValue: {
                            fReevaluate: (_) => me.fromAst("\uFF3F"),
                        },
                    };
                }

                let fReevaluate;

                if (
                    !dependencyValues.forceNumeric &&
                    (functionComp.stateValues.symbolic ||
                        dependencyValues.forceSymbolic)
                ) {
                    fReevaluate = returnSymbolicFunctionForEvaluate({
                        numInputs: functionComp.stateValues.numInputs,
                        symbolicfs: functionComp.stateValues.symbolicfs,
                    });
                    // A caller that wants a number, such as a `<function>`
                    // reevaluating this `<evaluate>` at each sample, gets the
                    // function's own numerical function. It gives the same
                    // value as evaluating the symbolic result, without building
                    // an expression per sample, and without the precision the
                    // symbolic route loses where the value is tiny.
                    fReevaluate.numeric ??= returnNumericFunctionForEvaluate({
                        numInputs: functionComp.stateValues.numInputs,
                        numericalfs: functionComp.stateValues.numericalfs,
                    }).numeric;
                } else {
                    fReevaluate = returnNumericFunctionForEvaluate({
                        numInputs: functionComp.stateValues.numInputs,
                        numericalfs: functionComp.stateValues.numericalfs,
                    });
                }

                return { setValue: { fReevaluate } };
            },
        };

        stateVariableDefinitions.substitutedFormula = {
            returnDependencies() {
                return {
                    inputMaths: {
                        dependencyType: "stateVariable",
                        variableName: "inputMaths",
                    },
                    functionAttr: {
                        dependencyType: "attributeComponent",
                        attributeName: "function",
                        variableNames: [
                            "fDefinitions",
                            "numInputs",
                            "numOutputs",
                        ],
                    },
                };
            },
            definition({ dependencyValues }) {
                let functionComp = dependencyValues.functionAttr;

                return {
                    setValue: {
                        substitutedFormula: functionComp
                            ? substituteInputsIntoFormula({
                                  fDefinition:
                                      functionComp.stateValues.fDefinitions[0],
                                  numInputs: functionComp.stateValues.numInputs,
                                  numOutputs:
                                      functionComp.stateValues.numOutputs,
                                  inputMaths: dependencyValues.inputMaths,
                              })
                            : null,
                    },
                };
            },
        };

        stateVariableDefinitions.fReevaluateDefinition = {
            returnDependencies() {
                return {
                    functionAttr: {
                        dependencyType: "attributeComponent",
                        attributeName: "function",
                        variableNames: [
                            "fDefinitions",
                            "symbolic",
                            "numInputs",
                        ],
                    },
                    forceSymbolic: {
                        dependencyType: "stateVariable",
                        variableName: "forceSymbolic",
                    },
                    forceNumeric: {
                        dependencyType: "stateVariable",
                        variableName: "forceNumeric",
                    },
                };
            },
            definition({ dependencyValues }) {
                let functionComp = dependencyValues.functionAttr;

                if (!functionComp) {
                    return {
                        setValue: {
                            fReevaluateDefinition: {},
                        },
                    };
                }

                let fReevaluateDefinition;

                if (
                    !dependencyValues.forceNumeric &&
                    (functionComp.stateValues.symbolic ||
                        dependencyValues.forceSymbolic)
                ) {
                    // TODO: fDefinitions only used for moving a function across the webworker barrier,
                    // i.e., to move it to a renderer.
                    // Currently, the only renderer using functions is graph, which just does numerical functions.
                    // Is there a reason to implement a "symbolicForEvaluate" functionType definition?
                    fReevaluateDefinition = {
                        functionType: "numericForEvaluate",
                        numInputs: functionComp.stateValues.numInputs,
                        fDefinitions: functionComp.stateValues.fDefinitions,
                    };
                } else {
                    fReevaluateDefinition = {
                        functionType: "numericForEvaluate",
                        numInputs: functionComp.stateValues.numInputs,
                        fDefinitions: functionComp.stateValues.fDefinitions,
                    };
                }

                return { setValue: { fReevaluateDefinition } };
            },
        };

        return stateVariableDefinitions;
    }
}

/**
 * The function's formula with `inputMaths` substituted for its variables, as a
 * single expression to be compiled once, or `null` when evaluating the function
 * numerically is not the same as evaluating that expression.
 *
 * A `<function>` whose formula evaluates another function at its own variable,
 * such as `$$g(x, 0, 1)`, uses this in place of calling `g` at every sample.
 *
 * It applies only when `g`'s numerical function is its compiled formula and
 * nothing more, which is what a `"formula"` definition records:
 * - a single output, and as many inputs as `g` has variables;
 * - no domain other than the whole real line for each input, since `g` would
 *   give no value outside it, and a substituted formula has no record of it;
 * - no symbol in the formula other than `g`'s variables, `e` and `pi`, since a
 *   free symbol that shares a name with the outer function's variable would be
 *   captured by it once substituted.
 */
function substituteInputsIntoFormula({
    fDefinition,
    numInputs,
    numOutputs,
    inputMaths,
}) {
    if (
        fDefinition?.functionType !== "formula" ||
        numOutputs !== 1 ||
        inputMaths.length !== numInputs ||
        !domainIsUnbounded(fDefinition.domain)
    ) {
        return null;
    }

    let formula = me.fromAst(fDefinition.formula).subscripts_to_strings();
    if (
        Array.isArray(formula.tree) &&
        vectorOperators.includes(formula.tree[0])
    ) {
        return null;
    }

    let variableNames = fDefinition.variables.map(
        (v) => me.fromAst(v).subscripts_to_strings().tree,
    );
    if (variableNames.some((name) => typeof name !== "string")) {
        return null;
    }

    let hasFreeSymbol = formula
        .variables()
        .some(
            (name) =>
                !variableNames.includes(name) && !["e", "pi"].includes(name),
        );
    if (hasFreeSymbol) {
        return null;
    }

    let substitutions = {};
    for (let [ind, name] of variableNames.entries()) {
        substitutions[name] = inputMaths[ind].subscripts_to_strings();
    }

    return formula.substitute(substitutions);
}

/**
 * Whether a function's domain, as a definition records it (one interval tree
 * per input, or `null`), is the whole real line in every input.
 */
function domainIsUnbounded(domain) {
    return (domain ?? []).every((interval) => {
        if (!interval) {
            return true;
        }
        let { minx, maxx } = find_effective_domain({
            domain: [me.fromAst(interval)],
        });
        return minx === -Infinity && maxx === Infinity;
    });
}

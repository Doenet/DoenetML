import BooleanComponent from "./Boolean";
import { numberToLetters } from "@doenet/utils";
import { codedDiagnostic } from "../utils/diagnostics";
import { isValidVariable } from "../utils/math";
import me from "math-expressions";

const BLANK = "\uff3f";

/**
 * A string key for `tree` when `tree` names a variable, and `undefined` when it
 * does not. Two trees get the same key exactly when they are the same variable.
 *
 * Both the parameter list and every node of the pattern are keyed this way, so
 * recognizing a parameter in the pattern is a map lookup. The test is
 * `isValidVariable`, the one `<_variableNameList>` already applied to the
 * `parameters` attribute, so a pattern node is measured against the rule that
 * decided which parameters were accepted.
 *
 * The `s`/`t` prefixes keep a subscripted parameter from colliding with a
 * symbol whose name happens to be that subtree's JSON.
 */
function parameterKey(tree) {
    if (!isValidVariable({ tree })) {
        return undefined;
    }
    return typeof tree === "string" ? "s" + tree : "t" + JSON.stringify(tree);
}

/**
 * Rebuild `tree` with every node that `placeholderFor` names replaced by the
 * placeholder it returns, leaving the nodes it returns `undefined` for as they
 * were.
 *
 * A node is offered before its children, so a parameter such as `x_1` is
 * replaced whole rather than through the `x` inside it. The head of an operator
 * node is left alone, since it names the operation rather than an operand — the
 * function of an `["apply", "f", "x"]` is its second entry, so a function name
 * is still reached.
 */
function replacePlaceholders(tree, placeholderFor) {
    let placeholder = placeholderFor(tree);
    if (placeholder !== undefined) {
        return placeholder;
    }
    if (Array.isArray(tree)) {
        return [
            tree[0],
            ...tree
                .slice(1)
                .map((subTree) => replacePlaceholders(subTree, placeholderFor)),
        ];
    }
    return tree;
}

export default class MatchesPattern extends BooleanComponent {
    static componentType = "matchesPattern";

    static componentDocs = {
        summary:
            "Boolean condition that tests whether input matches a math pattern",
    };
    static rendererType = "boolean";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.pattern = {
            createComponentOfType: "math",
            description: "Math expression pattern to match against.",
            highlighted: true,
        };
        attributes.parameters = {
            createComponentOfType: "_variableNameList",
            description:
                "Variables in the pattern that act as placeholders. Repeating one in the pattern requires the same subexpression at each occurrence. When specified, blanks in the pattern are matched literally.",
            highlighted: true,
        };
        attributes.allowImplicitIdentities = {
            description:
                "Whether to allow implicit identity transformations when matching.",
            createComponentOfType: "boolean",
            createStateVariable: "allowImplicitIdentities",
            defaultValue: false,
            public: true,
            highlighted: true,
        };
        attributes.allowPermutations = {
            description:
                "Whether to allow permutations of operands when matching.",
            createComponentOfType: "boolean",
            createStateVariable: "allowPermutations",
            defaultValue: true,
            public: true,
            highlighted: true,
        };
        attributes.requireNumericMatches = {
            description: "Whether numeric placeholders must match numbers.",
            createComponentOfType: "boolean",
            createStateVariable: "requireNumericMatches",
            defaultValue: false,
            public: true,
            highlighted: true,
        };
        attributes.requireVariableMatches = {
            description: "Whether variable placeholders must match variables.",
            createComponentOfType: "boolean",
            createStateVariable: "requireVariableMatches",
            defaultValue: false,
            public: true,
            highlighted: true,
        };
        attributes.excludeMatches = {
            description: "Patterns whose matches are excluded.",
            createComponentOfType: "mathList",
            createStateVariable: "excludeMatches",
            defaultValue: [],
            public: true,
            highlighted: true,
        };
        attributes.matchExpressionWithBlanks = {
            description: "Whether to allow expressions with blanks to match.",
            createComponentOfType: "boolean",
            createStateVariable: "matchExpressionWithBlanks",
            defaultValue: false,
            public: true,
            highlighted: true,
        };

        return attributes;
    }

    // Include children that can be added due to sugar
    static additionalSchemaChildren = ["string"];

    static returnSugarInstructions() {
        let sugarInstructions = [];

        let wrapNonMathWithMath = function ({
            matchedChildren,
            componentInfoObjects,
            nComponents,
            stateIdInfo,
        }) {
            // if have no children or a single math, don't do anything
            if (
                matchedChildren.length === 0 ||
                (matchedChildren.length === 1 &&
                    componentInfoObjects.componentIsSpecifiedType(
                        matchedChildren[0],
                        "math",
                    ))
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
                        children: matchedChildren,
                        attributes: {},
                        doenetAttributes: {},
                        state: {},
                    },
                ],
                nComponents,
            };
        };

        sugarInstructions.push({
            replacementFunction: wrapNonMathWithMath,
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

        stateVariableDefinitions.pattern = {
            additionalStateVariablesDefined: ["patternVariables"],
            returnDependencies: () => ({
                patternAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "pattern",
                    variableNames: ["value"],
                },
                parametersAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "parameters",
                    variableNames: ["variables"],
                },
            }),
            definition({ dependencyValues }) {
                let patternVariables = [];
                if (!dependencyValues.patternAttr) {
                    return {
                        setValue: { pattern: BLANK, patternVariables },
                    };
                }

                let patternExpression =
                    dependencyValues.patternAttr.stateValues.value;
                let originalVariablesInPattern = patternExpression.variables();

                let ind = 26 * 27 + 1; // starts with variable AAA

                // A placeholder is given a name the pattern does not already
                // use, so that a variable the pattern matches literally is
                // never mistaken for a placeholder.
                function nextPatternVariable() {
                    let newVar = numberToLetters(ind);
                    ind++;
                    while (originalVariablesInPattern.includes(newVar)) {
                        newVar = numberToLetters(ind);
                        ind++;
                    }
                    return newVar;
                }

                if (!dependencyValues.parametersAttr) {
                    // Without `parameters`, the blanks are the placeholders,
                    // and each one matches independently of the others.
                    let pattern = replacePlaceholders(
                        patternExpression.tree,
                        (node) => {
                            if (node !== BLANK) {
                                return undefined;
                            }
                            let placeholder = nextPatternVariable();
                            patternVariables.push(placeholder);
                            return placeholder;
                        },
                    );

                    return {
                        setValue: { pattern, patternVariables },
                    };
                }

                // With `parameters`, the named parameters are the
                // placeholders and blanks stay literal. An empty list still
                // counts as specified: it says the pattern has no
                // placeholders at all.
                let position =
                    dependencyValues.parametersAttr.position || undefined;
                let sendDiagnostics = [];

                let substitutions = new Map(); // parameter key -> placeholder
                let parametersByPlaceholder = new Map(); // placeholder -> text

                for (let parameter of dependencyValues.parametersAttr
                    .stateValues.variables) {
                    let key = parameterKey(parameter.tree);
                    if (key === undefined) {
                        // not a variable; `<_variableNameList>` said so
                        continue;
                    }
                    if (substitutions.has(key)) {
                        // the same parameter listed twice is one placeholder
                        continue;
                    }
                    let placeholder = nextPatternVariable();
                    substitutions.set(key, placeholder);
                    parametersByPlaceholder.set(
                        placeholder,
                        parameter.toString(),
                    );
                    patternVariables.push(placeholder);
                }

                let substituted = new Set();

                let pattern = replacePlaceholders(
                    patternExpression.tree,
                    (node) => {
                        let placeholder = substitutions.get(parameterKey(node));
                        if (placeholder !== undefined) {
                            substituted.add(placeholder);
                        }
                        return placeholder;
                    },
                );

                let absent = [...parametersByPlaceholder]
                    .filter(([placeholder]) => !substituted.has(placeholder))
                    .map(([_, text]) => text);

                if (absent.length > 0) {
                    sendDiagnostics.push(
                        codedDiagnostic({
                            type: "warning",
                            code: "doenet-w0117",
                            args: { parameters: absent },
                            position,
                        }),
                    );
                }

                return {
                    setValue: { pattern, patternVariables },
                    sendDiagnostics,
                };
            },
        };

        stateVariableDefinitions.value = {
            description: "Whether the input matches the pattern.",
            additionalStateVariablesDefined: [
                {
                    variableName: "allPatternMatches",
                },
            ],
            public: true,
            highlighted: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            forRenderer: true,
            returnDependencies: () => ({
                pattern: {
                    dependencyType: "stateVariable",
                    variableName: "pattern",
                },
                patternVariables: {
                    dependencyType: "stateVariable",
                    variableName: "patternVariables",
                },
                mathChildren: {
                    dependencyType: "child",
                    childGroups: ["maths"],
                    variableNames: ["value"],
                },
                allowImplicitIdentities: {
                    dependencyType: "stateVariable",
                    variableName: "allowImplicitIdentities",
                },
                allowPermutations: {
                    dependencyType: "stateVariable",
                    variableName: "allowPermutations",
                },
                requireNumericMatches: {
                    dependencyType: "stateVariable",
                    variableName: "requireNumericMatches",
                },
                requireVariableMatches: {
                    dependencyType: "stateVariable",
                    variableName: "requireVariableMatches",
                },
                excludeMatches: {
                    dependencyType: "stateVariable",
                    variableName: "excludeMatches",
                },
                matchExpressionWithBlanks: {
                    dependencyType: "stateVariable",
                    variableName: "matchExpressionWithBlanks",
                },
            }),
            definition: function ({ dependencyValues }) {
                if (dependencyValues.mathChildren.length === 0) {
                    return {
                        setValue: { value: false, allPatternMatches: [] },
                    };
                }

                let mathValue =
                    dependencyValues.mathChildren[0].stateValues.value;

                if (
                    mathValue.variables().includes(BLANK) &&
                    !dependencyValues.matchExpressionWithBlanks
                ) {
                    // don't match a math value with a blank
                    return {
                        setValue: { value: false, allPatternMatches: [] },
                    };
                }

                let variables = {};
                if (dependencyValues.requireNumericMatches) {
                    let isNumeric = (m) =>
                        !Number.isNaN(me.fromAst(m).evaluate_to_constant());
                    dependencyValues.patternVariables.forEach(
                        (v) => (variables[v] = isNumeric),
                    );
                } else if (dependencyValues.requireVariableMatches) {
                    let isString = (m) => typeof m === "string";
                    dependencyValues.patternVariables.forEach(
                        (v) => (variables[v] = isString),
                    );
                } else {
                    dependencyValues.patternVariables.forEach(
                        (v) => (variables[v] = true),
                    );
                }

                let params = {
                    variables,
                    allow_permutations: dependencyValues.allowPermutations,
                };

                if (dependencyValues.allowImplicitIdentities) {
                    params.allow_implicit_identities =
                        dependencyValues.patternVariables;
                }

                let matchResult = mathValue.match(
                    dependencyValues.pattern,
                    params,
                );

                let value = false,
                    allPatternMatches = [];
                if (matchResult) {
                    // check to make sure no matched values contain a variable that matches a value from excludeMatches
                    if (
                        !Object.values(matchResult)
                            .map((x) => me.fromAst(x))
                            .some((m) =>
                                dependencyValues.excludeMatches.some((em) =>
                                    m
                                        .variables()
                                        .some((v) =>
                                            em.equalsViaSyntax(me.fromAst(v)),
                                        ),
                                ),
                            )
                    ) {
                        value = true;
                        // A parameter that does not occur in the pattern is
                        // never bound. It keeps its place in the list so that
                        // `patternMatches` always lines up with the order the
                        // parameters were named in, and reports a blank. Only
                        // an absent binding becomes that blank:
                        // `allowImplicitIdentities` can bind a placeholder to
                        // `0`, which is a match like any other.
                        allPatternMatches =
                            dependencyValues.patternVariables.map((v) =>
                                me.fromAst(matchResult[v] ?? BLANK),
                            );
                    }
                }

                return {
                    setValue: {
                        value,
                        allPatternMatches,
                    },
                };
            },
        };

        stateVariableDefinitions.numMatches = {
            description: "The number of matches found.",
            public: true,
            highlighted: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnDependencies: () => ({
                allPatternMatches: {
                    dependencyType: "stateVariable",
                    variableName: "allPatternMatches",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        numMatches: dependencyValues.allPatternMatches.length,
                    },
                    checkForActualChange: { numMatches: true },
                };
            },
        };

        stateVariableDefinitions.patternMatches = {
            description: "The list of matched sub-expressions.",
            public: true,
            highlighted: true,
            shadowingInstructions: {
                createComponentOfType: "math",
            },
            isArray: true,
            numDimensions: 1,
            entryPrefixes: ["patternMatch"],
            returnArraySizeDependencies: () => ({
                numMatches: {
                    dependencyType: "stateVariable",
                    variableName: "numMatches",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.numMatches];
            },
            returnArrayDependenciesByKey() {
                let globalDependencies = {
                    allPatternMatches: {
                        dependencyType: "stateVariable",
                        variableName: "allPatternMatches",
                    },
                };

                return { globalDependencies };
            },
            arrayDefinitionByKey({ globalDependencyValues }) {
                let patternMatches = {};

                for (
                    let ind = 0;
                    ind < globalDependencyValues.__array_size[0];
                    ind++
                ) {
                    patternMatches[ind] =
                        globalDependencyValues.allPatternMatches[ind];
                }

                return { setValue: { patternMatches } };
            },
        };

        return stateVariableDefinitions;
    }
}

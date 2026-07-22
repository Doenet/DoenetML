import BooleanComponent from "./Boolean";

import { evaluateLogic } from "../utils/booleanLogic";

export default class When extends BooleanComponent {
    static componentType = "when";

    static componentDocs = {
        summary: "Defines logical conditions within an `<award>`",
    };
    static rendererType = undefined;

    static inSchemaOnlyInheritAs = [];

    static stateVariableToBeShadowed = "conditionSatisfied";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.matchPartial = {
            description:
                "Whether to match partial conditions for partial credit.",
            createComponentOfType: "boolean",
            createStateVariable: "matchPartial",
            defaultValue: false,
            public: true,
            fallBackToParentStateVariable: "matchPartial",
        };

        for (let attrName of [
            "symbolicEquality",
            "expandOnCompare",
            "simplifyOnCompare",
            "unorderedCompare",
            "matchByExactPositions",
            "allowedErrorInNumbers",
            "includeErrorInNumberExponents",
            "allowedErrorIsAbsolute",
            "numSignErrorsMatched",
            "numPeriodicSetMatchesRequired",
            "caseInsensitiveMatch",
            "matchBlanks",
        ]) {
            attributes[attrName].fallBackToParentStateVariable = attrName;
        }

        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        // condition satisfied is just an alias to value
        stateVariableDefinitions.value = {
            description: "Whether the condition is currently true.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            additionalStateVariablesDefined: [
                {
                    variableName: "fractionSatisfied",
                    public: true,
                    shadowingInstructions: {
                        createComponentOfType: "number",
                    },
                    description:
                        "Fraction of the boolean condition that is satisfied (0 to 1).",
                },
                {
                    variableName: "conditionSatisfied",
                    public: true,
                    shadowingInstructions: {
                        createComponentOfType: "boolean",
                    },
                    description:
                        "Whether the condition is currently satisfied; equivalent to value.",
                },
            ],
            returnDependencies: () => ({
                matchPartial: {
                    dependencyType: "stateVariable",
                    variableName: "matchPartial",
                },
                symbolicEquality: {
                    dependencyType: "stateVariable",
                    variableName: "symbolicEquality",
                },
                expandOnCompare: {
                    dependencyType: "stateVariable",
                    variableName: "expandOnCompare",
                },
                simplifyOnCompare: {
                    dependencyType: "stateVariable",
                    variableName: "simplifyOnCompare",
                },
                unorderedCompare: {
                    dependencyType: "stateVariable",
                    variableName: "unorderedCompare",
                },
                matchByExactPositions: {
                    dependencyType: "stateVariable",
                    variableName: "matchByExactPositions",
                },
                allowedErrorInNumbers: {
                    dependencyType: "stateVariable",
                    variableName: "allowedErrorInNumbers",
                },
                includeErrorInNumberExponents: {
                    dependencyType: "stateVariable",
                    variableName: "includeErrorInNumberExponents",
                },
                allowedErrorIsAbsolute: {
                    dependencyType: "stateVariable",
                    variableName: "allowedErrorIsAbsolute",
                },
                numSignErrorsMatched: {
                    dependencyType: "stateVariable",
                    variableName: "numSignErrorsMatched",
                },
                numPeriodicSetMatchesRequired: {
                    dependencyType: "stateVariable",
                    variableName: "numPeriodicSetMatchesRequired",
                },
                caseInsensitiveMatch: {
                    dependencyType: "stateVariable",
                    variableName: "caseInsensitiveMatch",
                },
                matchBlanks: {
                    dependencyType: "stateVariable",
                    variableName: "matchBlanks",
                },
                parsedExpression: {
                    dependencyType: "stateVariable",
                    variableName: "parsedExpression",
                },
                booleanChildrenByCode: {
                    dependencyType: "stateVariable",
                    variableName: "booleanChildrenByCode",
                },
                textChildrenByCode: {
                    dependencyType: "stateVariable",
                    variableName: "textChildrenByCode",
                },
                mathChildrenByCode: {
                    dependencyType: "stateVariable",
                    variableName: "mathChildrenByCode",
                },
                numberChildrenByCode: {
                    dependencyType: "stateVariable",
                    variableName: "numberChildrenByCode",
                },
                otherChildrenByCode: {
                    dependencyType: "stateVariable",
                    variableName: "otherChildrenByCode",
                },
            }),
            definition({ dependencyValues, usedDefault }) {
                // evaluate logic in parsedExpression and return fraction correct

                if (dependencyValues.parsedExpression === null) {
                    // if don't have parsed expression
                    // (which could occur if have no children or if have invalid form)
                    // return false
                    return {
                        setValue: {
                            conditionSatisfied: false,
                            value: false,
                            fractionSatisfied: 0,
                        },
                    };
                }

                let canOverrideUnorderedCompare = usedDefault.unorderedCompare;

                let fractionSatisfied = evaluateLogic({
                    logicTree: dependencyValues.parsedExpression.tree,
                    canOverrideUnorderedCompare,
                    dependencyValues,
                });

                let conditionSatisfied = fractionSatisfied === 1;

                return {
                    setValue: {
                        fractionSatisfied,
                        conditionSatisfied,
                        value: conditionSatisfied,
                    },
                };
            },
        };

        // Collect the component indices of all descendants so we can check each
        // for shadow-source info in referencedStateVars below.
        stateVariableDefinitions._descendantIdxs = {
            returnDependencies: () => ({
                allDescendants: {
                    dependencyType: "descendant",
                    componentTypes: ["_base"],
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        _descendantIdxs: (
                            dependencyValues.allDescendants ?? []
                        ).map((d) => d.componentIdx),
                    },
                };
            },
        };

        // For each descendant, check whether it is a shadow of an input's state
        // variable. Handles both direct references ($fi.numerator = 2) and
        // nested ones (<when><math>$fi.numerator</math>=2</when>).
        // Used by Award.referencedInputStateVars to build the per-input coloring
        // map for colorInputsSeparately.
        stateVariableDefinitions.referencedStateVars = {
            stateVariablesDeterminingDependencies: ["_descendantIdxs"],
            returnDependencies({ stateValues }) {
                const deps = {};
                for (const idx of stateValues._descendantIdxs ?? []) {
                    deps[`shadowInfo_${idx}`] = {
                        dependencyType: "shadowInfo",
                        componentIdx: idx,
                    };
                }
                return deps;
            },
            definition({ dependencyValues }) {
                const referencedStateVars = [];
                for (const [key, value] of Object.entries(dependencyValues)) {
                    if (key.startsWith("shadowInfo_") && value !== null) {
                        referencedStateVars.push(value);
                    }
                }
                return { setValue: { referencedStateVars } };
            },
        };

        return stateVariableDefinitions;
    }

    // "when" does not adapt to "text", even though boolean does
    static adapters = [];
}

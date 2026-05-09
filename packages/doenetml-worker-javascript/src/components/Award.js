import BaseComponent from "./abstract/BaseComponent";
import me from "math-expressions";
import {
    buildParsedExpression,
    evaluateLogic,
    returnChildrenByCodeStateVariableDefinitions,
} from "../utils/booleanLogic";
import { unwrapSource } from "../utils/dast/convertNormalizedDast";
import { comparePathsIgnorePosition } from "../utils/dast/path";
import { returnSimplifyExpandOnCompareWarning } from "../utils/answer";

export default class Award extends BaseComponent {
    static componentType = "award";

    static componentDocs = {
        summary:
            "An award rule within an `<answer>` that grants credit when matched.",
    };
    static rendererType = undefined;

    static includeBlankStringChildren = true;
    static removeBlankStringChildrenPostSugar = true;

    static variableForImplicitProp = "awarded";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.credit = {
            createComponentOfType: "number",
            createStateVariable: "credit",
            defaultValue: 1,
            public: true,
            attributesForCreatedComponent: { convertBoolean: "true" },
            description:
                "Fraction of credit (0 to 1) granted when this award matches.",
        };
        attributes.matchPartial = {
            createComponentOfType: "boolean",
            createStateVariable: "matchPartial",
            defaultValue: false,
            public: true,
            fallBackToParentStateVariable: "matchPartial",
            description:
                "Whether to award partial credit when the response is partially correct.",
        };
        attributes.symbolicEquality = {
            createComponentOfType: "boolean",
            createStateVariable: "symbolicEquality",
            defaultValue: false,
            public: true,
            fallBackToParentStateVariable: "symbolicEquality",
            description:
                "Whether comparison uses symbolic equality (rather than numeric evaluation).",
        };
        attributes.expandOnCompare = {
            createComponentOfType: "boolean",
            createStateVariable: "expandOnCompare",
            defaultValue: false,
            public: true,
            fallBackToParentStateVariable: "expandOnCompare",
            description:
                "Whether to expand math expressions before comparing them.",
        };
        attributes.simplifyOnCompare = {
            createComponentOfType: "text",
            createStateVariable: "simplifyOnCompare",
            defaultValue: "none",
            toLowerCase: true,
            valueForTrue: "full",
            valueForFalse: "none",
            validValues: [
                "none",
                "full",
                "numbers",
                "numbersPreserveOrder",
                "normalizeOrder",
            ],
            public: true,
            fallBackToParentStateVariable: "simplifyOnCompare",
            description:
                "Level of simplification applied to math expressions before comparing them.",
        };
        attributes.unorderedCompare = {
            createComponentOfType: "boolean",
            createStateVariable: "unorderedCompare",
            defaultValue: false,
            public: true,
            fallBackToParentStateVariable: "unorderedCompare",
            description:
                "Whether order is ignored when comparing list-like responses.",
        };
        attributes.matchByExactPositions = {
            createComponentOfType: "boolean",
            createStateVariable: "matchByExactPositions",
            defaultValue: false,
            public: true,
            fallBackToParentStateVariable: "matchByExactPositions",
            description:
                "Whether to match list responses by exact position rather than by content.",
        };
        attributes.allowedErrorInNumbers = {
            createComponentOfType: "number",
            createStateVariable: "allowedErrorInNumbers",
            defaultValue: 0,
            public: true,
            fallBackToParentStateVariable: "allowedErrorInNumbers",
            description:
                "Maximum allowed numeric error when comparing numbers (relative or absolute).",
        };
        attributes.includeErrorInNumberExponents = {
            createComponentOfType: "boolean",
            createStateVariable: "includeErrorInNumberExponents",
            defaultValue: false,
            public: true,
            fallBackToParentStateVariable: "includeErrorInNumberExponents",
            description:
                "Whether the allowed numeric error also applies to numbers in exponents.",
        };
        attributes.allowedErrorIsAbsolute = {
            createComponentOfType: "boolean",
            createStateVariable: "allowedErrorIsAbsolute",
            defaultValue: false,
            public: true,
            fallBackToParentStateVariable: "allowedErrorIsAbsolute",
            description:
                "Whether allowedErrorInNumbers is interpreted as an absolute (rather than relative) tolerance.",
        };
        attributes.numSignErrorsMatched = {
            createComponentOfType: "number",
            createStateVariable: "numSignErrorsMatched",
            defaultValue: 0,
            public: true,
            fallBackToParentStateVariable: "numSignErrorsMatched",
            description:
                "Maximum number of sign errors that still count as a match.",
        };
        attributes.numPeriodicSetMatchesRequired = {
            createComponentOfType: "integer",
            createStateVariable: "numPeriodicSetMatchesRequired",
            defaultValue: 3,
            public: true,
            fallBackToParentStateVariable: "numPeriodicSetMatchesRequired",
            description:
                "Number of consecutive elements of a periodic set required to count as a match.",
        };
        attributes.caseInsensitiveMatch = {
            createComponentOfType: "boolean",
            createStateVariable: "caseInsensitiveMatch",
            defaultValue: false,
            public: true,
            fallBackToParentStateVariable: "caseInsensitiveMatch",
            description: "Whether text comparisons ignore letter case.",
        };
        attributes.matchBlanks = {
            createComponentOfType: "boolean",
            createStateVariable: "matchBlanks",
            defaultValue: false,
            public: true,
            fallBackToParentStateVariable: "matchBlanks",
            description:
                "Whether unfilled blanks in a math expression count as a match.",
        };
        attributes.feedbackCodes = {
            createComponentOfType: "textList",
            createStateVariable: "feedbackCodes",
            defaultValue: [],
            public: true,
            description:
                "Codes that select reusable feedback messages when this award matches.",
        };
        attributes.feedbackText = {
            createComponentOfType: "text",
            createStateVariable: "feedbackText",
            defaultValue: null,
            public: true,
            description: "Custom feedback text shown when this award matches.",
        };

        attributes.referencesAreResponses = {
            createReferences: true,
            description:
                "References to components whose values should be treated as responses for this award.",
        };

        attributes.splitSymbols = {
            createComponentOfType: "boolean",
            createStateVariable: "splitSymbols",
            defaultValue: true,
            public: true,
            fallBackToParentStateVariable: "splitSymbols",
            description:
                "Whether multi-character symbols should be split into a product of single-character variables when parsing.",
        };

        attributes.parseScientificNotation = {
            createComponentOfType: "boolean",
            createStateVariable: "parseScientificNotation",
            defaultValue: false,
            public: true,
            fallBackToParentStateVariable: "parseScientificNotation",
            description:
                "Whether to parse expressions like 1e3 as scientific notation.",
        };

        return attributes;
    }

    static preprocessSerializedChildren({ serializedChildren, attributes }) {
        if (attributes.referencesAreResponses?.type === "references") {
            const references = attributes.referencesAreResponses.references
                .filter((child) => child.componentType === "_copy")
                .map((child) => child.extending.Ref);

            for (let reference of references) {
                addResponsesToDescendantsWithReference(
                    serializedChildren,
                    reference,
                );
            }
        }
    }

    // Include children that can be added due to sugar
    static additionalSchemaChildren = ["string"];

    static returnSugarInstructions() {
        let sugarInstructions = super.returnSugarInstructions();

        let wrapWithComponentTypeIfNeeded = function ({
            matchedChildren,
            parentAttributes,
            componentInfoObjects,
            nComponents,
            stateIdInfo,
        }) {
            // wrap with componentType if have more than one child or a single string

            // remove any blank string children from beginning or end of children
            while (
                typeof matchedChildren[0] === "string" &&
                matchedChildren[0].trim() === ""
            ) {
                matchedChildren = matchedChildren.slice(1);
            }
            let numChildren = matchedChildren.length;
            while (
                typeof matchedChildren[numChildren - 1] === "string" &&
                matchedChildren[numChildren - 1].trim() === ""
            ) {
                matchedChildren = matchedChildren.slice(0, numChildren - 1);
                numChildren = matchedChildren.length;
            }

            if (
                matchedChildren.length === 1 &&
                typeof matchedChildren[0] === "object"
            ) {
                return { success: false };
            }

            let componentIsSpecifiedType =
                componentInfoObjects.componentIsSpecifiedType;

            let foundMath = false,
                foundText = false,
                foundBoolean = false;

            for (let child of matchedChildren) {
                if (typeof child !== "object") {
                    continue;
                } else if (
                    componentIsSpecifiedType(child, "math") ||
                    componentIsSpecifiedType(child, "number") ||
                    componentIsSpecifiedType(child, "mathList") ||
                    componentIsSpecifiedType(child, "numberList")
                ) {
                    foundMath = true;
                } else if (
                    componentIsSpecifiedType(child, "text") ||
                    componentIsSpecifiedType(child, "textList")
                ) {
                    foundText = true;
                } else if (
                    componentIsSpecifiedType(child, "boolean") ||
                    componentIsSpecifiedType(child, "booleanList")
                ) {
                    foundBoolean = true;
                }
            }

            let type;
            if (parentAttributes.type) {
                type = parentAttributes.type.value;
                if (!["math", "text", "boolean"].includes(type)) {
                    // Note: no need to send warning here, as answer sends a warning
                    // (and is the location of the type attribute)
                    type = "math";
                }
            } else {
                if (foundMath) {
                    type = "math";
                } else if (foundText) {
                    type = "text";
                } else if (foundBoolean) {
                    // TODO: if have multiple booleans,
                    // it doesn't make sense to wrap in one big boolean.
                    // What is a better solution?
                    type = "boolean";
                } else {
                    type = "math";
                }
            }

            return {
                success: true,
                newChildren: [
                    {
                        type: "serialized",
                        componentType: type,
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
            replacementFunction: wrapWithComponentTypeIfNeeded,
        });

        return sugarInstructions;
    }

    static returnChildGroups() {
        return [
            {
                group: "whens",
                componentTypes: ["when"],
            },
            {
                group: "strings",
                componentTypes: ["string"],
            },
            {
                group: "comparableTypes",
                componentTypes: [
                    "math",
                    "number",
                    "text",
                    "boolean",
                    "orbitalDiagram",
                ],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        Object.assign(
            stateVariableDefinitions,
            returnSimplifyExpandOnCompareWarning(),
        );

        stateVariableDefinitions.parsedExpression = {
            additionalStateVariablesDefined: [
                "requireInputInAnswer",
                "codePre",
            ],
            returnDependencies: () => ({
                whenChild: {
                    dependencyType: "child",
                    childGroups: ["whens"],
                },
                // call it "allChildren" so that can use the buildParsedExpression function that Boolean uses
                allChildren: {
                    dependencyType: "child",
                    childGroups: ["strings", "comparableTypes"],
                },
                stringChildren: {
                    dependencyType: "child",
                    childGroups: ["strings"],
                    variableNames: ["value"],
                },
                answerType: {
                    dependencyType: "parentStateVariable",
                    parentComponentType: "answer",
                    variableName: "type",
                },
                splitSymbols: {
                    dependencyType: "stateVariable",
                    variableName: "splitSymbols",
                },
            }),
            definition: function ({ dependencyValues, componentInfoObjects }) {
                let parsedExpression = null;
                let requireInputInAnswer = false;
                let codePre = "";

                if (
                    dependencyValues.whenChild.length == 0 &&
                    dependencyValues.allChildren.length > 0
                ) {
                    requireInputInAnswer = true;

                    let doNotSplit =
                        dependencyValues.splitSymbols === false ||
                        (dependencyValues.answerType &&
                            !["number", "math"].includes(
                                dependencyValues.answerType,
                            ));

                    let { setValue } = buildParsedExpression({
                        dependencyValues,
                        componentInfoObjects,
                        doNotSplit,
                        splitAtInitialLevel: true,
                    });

                    codePre = setValue.codePre;

                    parsedExpression = me.fromAst([
                        "=",
                        codePre + "Input",
                        setValue.parsedExpression.tree,
                    ]);
                }

                return {
                    setValue: {
                        parsedExpression,
                        requireInputInAnswer,
                        codePre,
                    },
                };
            },
        };

        Object.assign(
            stateVariableDefinitions,
            returnChildrenByCodeStateVariableDefinitions(),
        );

        stateVariableDefinitions.creditAchievedIfSubmit = {
            description:
                "Credit (0 to 1) this award would grant if submitted with the current response.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            additionalStateVariablesDefined: [
                {
                    variableName: "fractionSatisfiedIfSubmit",
                    description:
                        "Fraction (0 to 1) by which this award's match condition is currently satisfied.",
                    public: true,
                    shadowingInstructions: {
                        createComponentOfType: "number",
                    },
                },
            ],
            returnDependencies: () => ({
                credit: {
                    dependencyType: "stateVariable",
                    variableName: "credit",
                },
                whenChild: {
                    dependencyType: "child",
                    childGroups: ["whens"],
                    variableNames: ["fractionSatisfied"],
                },
                answerInput: {
                    dependencyType: "parentStateVariable",
                    variableName: "inputChildWithValues",
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
                allChildren: {
                    dependencyType: "child",
                    childGroups: ["strings", "comparableTypes"],
                    variableNames: ["value"],
                    variablesOptional: true,
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
                matchPartial: {
                    dependencyType: "stateVariable",
                    variableName: "matchPartial",
                },
                codePre: {
                    dependencyType: "stateVariable",
                    variableName: "codePre",
                },
            }),
            definition: function ({ dependencyValues, usedDefault }) {
                let fractionSatisfiedIfSubmit;

                if (dependencyValues.whenChild.length > 0) {
                    fractionSatisfiedIfSubmit =
                        dependencyValues.whenChild[0].stateValues
                            .fractionSatisfied;
                } else {
                    if (
                        !dependencyValues.answerInput ||
                        !dependencyValues.parsedExpression
                    ) {
                        return {
                            setValue: {
                                creditAchievedIfSubmit: 0,
                                fractionSatisfiedIfSubmit: 0,
                            },
                        };
                    }

                    fractionSatisfiedIfSubmit =
                        evaluateLogicDirectlyFromChildren({
                            dependencyValues,
                            usedDefault,
                        });
                }

                fractionSatisfiedIfSubmit = Math.max(
                    0,
                    Math.min(1, fractionSatisfiedIfSubmit),
                );

                let creditAchievedIfSubmit = 0;
                if (Number.isFinite(dependencyValues.credit)) {
                    creditAchievedIfSubmit =
                        Math.max(0, Math.min(1, dependencyValues.credit)) *
                        fractionSatisfiedIfSubmit;
                }
                return {
                    setValue: {
                        fractionSatisfiedIfSubmit,
                        creditAchievedIfSubmit,
                    },
                };
            },
        };

        stateVariableDefinitions.fractionSatisfied = {
            description:
                "Fraction (0 to 1) by which this award's match condition was satisfied at last submission.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            defaultValue: 0,
            hasEssential: true,
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: {
                    fractionSatisfied: true,
                },
            }),
            inverseDefinition: function ({
                desiredStateVariableValues,
                initialChange,
            }) {
                if (!initialChange) {
                    return { success: false };
                }

                return {
                    success: true,
                    instructions: [
                        {
                            setEssentialValue: "fractionSatisfied",
                            value: desiredStateVariableValues.fractionSatisfied,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.creditAchieved = {
            description:
                "Credit (0 to 1) this award granted at the last submission.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            defaultValue: 0,
            hasEssential: true,
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: {
                    creditAchieved: true,
                },
            }),
            inverseDefinition: function ({
                desiredStateVariableValues,
                initialChange,
            }) {
                if (!initialChange) {
                    return { success: false };
                }

                return {
                    success: true,
                    instructions: [
                        {
                            setEssentialValue: "creditAchieved",
                            value: desiredStateVariableValues.creditAchieved,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.awarded = {
            description:
                "Whether this award was matched at the last submission.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            defaultValue: false,
            hasEssential: true,
            doNotShadowEssential: true,
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: {
                    awarded: true,
                },
            }),
            inverseDefinition: function ({
                desiredStateVariableValues,
                initialChange,
            }) {
                if (!initialChange) {
                    return { success: false };
                }

                return {
                    success: true,
                    instructions: [
                        {
                            setEssentialValue: "awarded",
                            value: desiredStateVariableValues.awarded,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.allFeedbacks = {
            returnDependencies: () => ({
                feedbackText: {
                    dependencyType: "stateVariable",
                    variableName: "feedbackText",
                },
                feedbackCodes: {
                    dependencyType: "stateVariable",
                    variableName: "feedbackCodes",
                },
                feedbackDefinitionAncestor: {
                    dependencyType: "ancestor",
                    variableNames: ["feedbackDefinitions"],
                },
                awarded: {
                    dependencyType: "stateVariable",
                    variableName: "awarded",
                },
            }),
            definition: function ({ dependencyValues }) {
                if (!dependencyValues.awarded) {
                    return { setValue: { allFeedbacks: [] } };
                }

                let allFeedbacks = [];

                let feedbackDefinitions =
                    dependencyValues.feedbackDefinitionAncestor.stateValues
                        .feedbackDefinitions;

                for (let feedbackCode of dependencyValues.feedbackCodes) {
                    let code = feedbackCode.toLowerCase();
                    let feedbackText = feedbackDefinitions[code];
                    if (feedbackText) {
                        allFeedbacks.push(feedbackText);
                    }
                }

                if (dependencyValues.feedbackText !== null) {
                    allFeedbacks.push(dependencyValues.feedbackText);
                }

                return { setValue: { allFeedbacks } };
            },
        };

        stateVariableDefinitions.numFeedbacks = {
            description:
                "The number of feedback messages associated with this award.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnDependencies: () => ({
                allFeedbacks: {
                    dependencyType: "stateVariable",
                    variableName: "allFeedbacks",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        numFeedbacks: dependencyValues.allFeedbacks.length,
                    },
                    checkForActualChange: { numFeedbacks: true },
                };
            },
        };

        stateVariableDefinitions.feedbacks = {
            description: "The feedback messages produced by this award.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "feedback",
            },
            isArray: true,
            entryPrefixes: ["feedback"],
            returnArraySizeDependencies: () => ({
                numFeedbacks: {
                    dependencyType: "stateVariable",
                    variableName: "numFeedbacks",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.numFeedbacks];
            },
            returnArrayDependenciesByKey() {
                let globalDependencies = {
                    allFeedbacks: {
                        dependencyType: "stateVariable",
                        variableName: "allFeedbacks",
                    },
                };

                return { globalDependencies };
            },
            arrayDefinitionByKey({ globalDependencyValues }) {
                // console.log(`array definition by key of function feedbacks`)
                // console.log(globalDependencyValues)

                let feedbacks = {};

                for (
                    let arrayKey = 0;
                    arrayKey < globalDependencyValues.__array_size;
                    arrayKey++
                ) {
                    feedbacks[arrayKey] =
                        globalDependencyValues.allFeedbacks[arrayKey];
                }

                return { setValue: { feedbacks } };
            },
        };

        stateVariableDefinitions.feedback = {
            isAlias: true,
            targetVariableName: "feedback1",
            description: "The first feedback message produced by this award.",
        };

        return stateVariableDefinitions;
    }

    static standardizedFeedback = {
        numericalerror: `Credit reduced because numbers in your answer weren't quite right.  Did you round too much?`,
        goodjob: `Good job!`,
        onesignerror: `Credit reduced because it appears that you made a sign error.`,
        twosignerrors: `Credit reduced because it appears that you made two sign errors.`,
    };
}

function evaluateLogicDirectlyFromChildren({ dependencyValues, usedDefault }) {
    let dependenciesForEvaluateLogic = {};

    Object.assign(dependenciesForEvaluateLogic, dependencyValues);

    let canOverrideUnorderedCompare = usedDefault.unorderedCompare;

    let answerValue = dependencyValues.answerInput.stateValues.immediateValue;
    if (answerValue === undefined) {
        answerValue = dependencyValues.answerInput.stateValues.value;
    }

    let answerChildForLogic = {
        stateValues: { value: answerValue },
    };

    let inputCode = dependencyValues.codePre + "Input";
    if (dependencyValues.answerInput.componentType === "textInput") {
        dependenciesForEvaluateLogic.textChildrenByCode[inputCode] =
            answerChildForLogic;
    } else if (dependencyValues.answerInput.componentType === "booleanInput") {
        dependenciesForEvaluateLogic.booleanChildrenByCode[inputCode] =
            answerChildForLogic;
    } else {
        dependenciesForEvaluateLogic.mathChildrenByCode[inputCode] =
            answerChildForLogic;
    }

    return evaluateLogic({
        logicTree: dependencyValues.parsedExpression.tree,
        canOverrideUnorderedCompare,
        dependencyValues: dependenciesForEvaluateLogic,
    });
}

function addResponsesToDescendantsWithReference(components, reference) {
    for (let component of components) {
        if (component.type === "serialized") {
            if (component.extending) {
                const refResolution = unwrapSource(component.extending);

                if (
                    refResolution.nodeIdx === reference.nodeIdx &&
                    comparePathsIgnorePosition(
                        refResolution.unresolvedPath,
                        reference.unresolvedPath,
                    )
                ) {
                    if (!component.attributes) {
                        component.attributes = {};
                    }
                    let foundIsResponse = Object.keys(component.attributes)
                        .map((x) => x.toLowerCase())
                        .includes("isresponse");
                    if (!foundIsResponse) {
                        // Make it an unresolved attribute
                        // as the composite don't have the attribute isResponse
                        // but pass it on to their replacements
                        component.attributes.isResponse = {
                            type: "unresolved",
                            name: "isResponse",
                            children: [],
                        };
                    }
                }
            }

            if (component.children) {
                addResponsesToDescendantsWithReference(
                    component.children,
                    reference,
                );
            }
        }
    }
}

import BaseComponent from "./abstract/BaseComponent";
import me from "math-expressions";
import {
    buildParsedExpression,
    evaluateLogic,
    returnChildrenByCodeStateVariableDefinitions,
} from "../utils/booleanLogic";
import { unwrapSource } from "../utils/dast/convertNormalizedDast";
import { comparePathsIgnorePosition } from "../utils/dast/path";
import {
    returnCreditAttributeAndStateVariableDefinition,
    returnSimplifyExpandOnCompareWarning,
} from "../utils/answer";
import { answerContentType } from "../utils/answerContentType";

export default class Award extends BaseComponent {
    static componentType = "award";

    static componentDocs = {
        summary: "Specifies conditions for awarding credit in an answer",
    };
    static rendererType = undefined;

    static includeBlankStringChildren = true;
    static removeBlankStringChildrenPostSugar = true;

    static variableForImplicitProp = "awarded";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.credit = returnCreditAttributeAndStateVariableDefinition({
            defaultValue: 1,
            componentDescription: "this award matches",
        }).attribute;
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
                {
                    value: "none",
                    description:
                        "No simplification is applied before comparing.",
                },
                {
                    value: "full",
                    description:
                        "Fully simplify both expressions before comparing.",
                },
                {
                    value: "numbers",
                    description:
                        "Simplify numeric subexpressions only, leaving symbolic structure intact.",
                },
                {
                    value: "numbersPreserveOrder",
                    description:
                        "Like `numbers`, but does not reorder commutative operands.",
                },
                {
                    value: "normalizeOrder",
                    description:
                        "Reorder commutative operands into a canonical form without simplifying values.",
                },
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

        // Set by the `<answer>` sugar, not by authors, on an `<award copy>`
        // in an answer with no response, so that the references its copied
        // children hold are potential responses, as those of the award
        // written out are (ANS-2, CPY-1, `Answer.js`).
        attributes._referencesArePotentialResponses = {
            createPrimitiveOfType: "boolean",
            excludeFromSchema: true,
        };

        // Set by `answerTypesAtLoad.ts`, not by authors: the type of the
        // `<answer>` this award belongs to, for an award that is not a child
        // of the answer as written (one held by a composite in the answer, or
        // an `<award copy>`), so that its plain text is read as the answer's
        // type, as that of an award written in the answer is (ANS-4, D55;
        // #1874, #2657 item 5). The answer's sugar also sets it on the awards
        // of an `<answer copy>`, written or made, whose own attributes may
        // not carry the type (#2657 item 9).
        attributes._answerType = {
            createPrimitiveOfType: "string",
            excludeFromSchema: true,
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
        retypeCopiedContent(
            serializedChildren,
            attributes._answerType?.primitive?.value,
        );
        if (attributes._referencesArePotentialResponses?.primitive?.value) {
            addPotentialResponsesToReferences(serializedChildren);
        }
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
            componentAttributes,
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
                }
                const contentType = answerContentType((tag) =>
                    componentIsSpecifiedType(child, tag),
                );
                if (contentType === "math") {
                    foundMath = true;
                } else if (contentType === "text") {
                    foundText = true;
                } else if (contentType !== undefined) {
                    // a boolean, a `<booleanList>` or a `<when>`
                    foundBoolean = true;
                }
            }

            // The answer's type, decided at load from its input or its
            // awards' typed content (D55, `answerTypesAtLoad.ts`), so that
            // plain text in every award is read as one type: written on the
            // answer, or on an award that isn't its child as written.
            let type;
            const answerType =
                componentAttributes._answerType ?? parentAttributes.type;
            if (answerType) {
                type = answerType.value;
                if (!["math", "text", "boolean"].includes(type)) {
                    // Note: no need to send warning here: a `type` that names
                    // no type is reported at load, at the answer's `type`
                    // attribute (`doenet-w0078`, `answerTypesAtLoad.ts`)
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

        stateVariableDefinitions.credit =
            returnCreditAttributeAndStateVariableDefinition({
                defaultValue: 1,
                componentDescription: "this award matches",
            }).stateVariableDefinition;

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

                // `credit` is already clamped to [0, 1].
                const creditAchievedIfSubmit =
                    dependencyValues.credit * fractionSatisfiedIfSubmit;
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

        // Identifies which answer-input state variables this award's condition
        // references, so the answer can compute per-input coloring.
        // Each entry is { componentIdx, propVariable } pointing to the source
        // component+variable that a code-child in the <when> expression shadows.
        // Only entries whose componentIdx is one of the answer's own inputs are included.
        stateVariableDefinitions.colorInputsSeparatelyFromAnswer = {
            returnDependencies: () => ({
                colorInputsSeparately: {
                    dependencyType: "parentStateVariable",
                    variableName: "colorInputsSeparately",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        colorInputsSeparatelyFromAnswer:
                            dependencyValues.colorInputsSeparately ?? false,
                    },
                };
            },
        };

        stateVariableDefinitions.referencedInputStateVars = {
            stateVariablesDeterminingDependencies: [
                "colorInputsSeparatelyFromAnswer",
            ],
            returnDependencies({ stateValues }) {
                const deps = {
                    colorInputsSeparatelyFromAnswer: {
                        dependencyType: "parentStateVariable",
                        variableName: "colorInputsSeparately",
                    },
                };
                // Only add the remaining deps when colorInputsSeparately is
                // active — avoids resolving When.referencedStateVars (which
                // traverses descendants) unnecessarily.
                if (stateValues.colorInputsSeparatelyFromAnswer) {
                    // Lightweight structural set — no live values so coloring
                    // doesn't go stale on every keystroke.
                    deps.allInputComponentIdxs = {
                        dependencyType: "parentStateVariable",
                        variableName: "allInputComponentIdxs",
                    };
                    deps.whenChild = {
                        dependencyType: "child",
                        childGroups: ["whens"],
                        variableNames: ["referencedStateVars"],
                    };
                }
                return deps;
            },
            definition({ dependencyValues }) {
                if (!dependencyValues.colorInputsSeparatelyFromAnswer) {
                    return { setValue: { referencedInputStateVars: [] } };
                }

                const allInputComponentIdxs =
                    dependencyValues.allInputComponentIdxs ?? new Set();

                const referencedStateVars =
                    dependencyValues.whenChild?.[0]?.stateValues
                        .referencedStateVars ?? [];
                return {
                    setValue: {
                        referencedInputStateVars: referencedStateVars.filter(
                            (ref) =>
                                allInputComponentIdxs.has(ref.componentIdx),
                        ),
                    },
                };
            },
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

/**
 * An `<award copy>` holds its source's content as the source's sugar read it:
 * plain text wrapped in the type of the source's answer, or a math outside
 * one. A copy in an answer of another type reads that plain text as its own
 * answer's type instead, as the award written out there would (CPY-1, ANS-4;
 * #2657 item 5). Only a wrapper the sugar made is changed, never a tag the
 * author wrote (which `doenet-w0205` reports).
 */
function retypeCopiedContent(serializedChildren, answerType) {
    if (!["math", "text", "boolean"].includes(answerType)) {
        return;
    }
    const nonBlank = serializedChildren.filter(
        (child) => typeof child !== "string" || child.trim() !== "",
    );
    const wrapper = nonBlank[0];
    if (
        nonBlank.length === 1 &&
        typeof wrapper === "object" &&
        wrapper.doenetAttributes?.createdFromSugar &&
        ["math", "text", "boolean"].includes(wrapper.componentType) &&
        wrapper.componentType !== answerType
    ) {
        wrapper.componentType = answerType;
    }
}

function addResponsesToDescendantsWithReference(components, reference) {
    if (reference.nodeIdx < 0) {
        // A reference that names nothing gets the placeholder resolution every
        // unresolvable reference shares. It is a blank, which equals nothing,
        // so it marks no reference as a response, not even another one that
        // names nothing (VAL-5, D37; #1853).
        return;
    }
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
                    let foundIsResponse = Object.hasOwn(
                        component.attributes,
                        "isResponse",
                    );
                    if (
                        !foundIsResponse &&
                        component.componentType === "_ref"
                    ) {
                        // A value reference resolves no attributes: it reads
                        // its mark as a primitive (`ValueRef.js`). The
                        // document makes one with the mark already
                        // (`utils/dast/valueReferences.ts`), so this one is in
                        // an award made by `copy`, or inside an extend of
                        // what holds it, copied from the source award's
                        // reference.
                        component.attributes.isResponse = {
                            type: "primitive",
                            name: "isResponse",
                            primitive: { type: "boolean", value: true },
                        };
                    } else if (!foundIsResponse) {
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

/**
 * Mark each reference among `components` that is not inside another reference
 * a potential response (`isPotentialResponse`), as the `<answer>` sugar marks
 * those of an award written out in an answer with no response
 * (`addPotentialResponsesToReferenceDescendants` in `Answer.js`). Here they
 * are those of an `<award copy>`, made from its source's.
 */
function addPotentialResponsesToReferences(components) {
    for (const component of components) {
        if (typeof component !== "object" || component === null) {
            continue;
        }
        if (component.componentType === "_ref") {
            // A value reference resolves no attributes: it reads its mark as
            // a primitive (`ValueRef.js`).
            component.attributes ??= {};
            component.attributes.isPotentialResponse = {
                type: "primitive",
                name: "isPotentialResponse",
                primitive: { type: "boolean", value: true },
            };
        } else if (component.componentType === "_copy") {
            component.attributes ??= {};
            component.attributes.isPotentialResponse = {
                type: "unresolved",
                name: "isPotentialResponse",
                children: ["true"],
            };
        } else if (component.children) {
            addPotentialResponsesToReferences(component.children);
        }
    }
}

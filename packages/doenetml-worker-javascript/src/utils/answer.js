import { serializedComponentsReplacer } from "@doenet/utils";
import sha1 from "crypto-js/sha1";
import Base64 from "crypto-js/enc-base64";
import stringify from "json-stringify-deterministic";
import { codedDiagnostic } from "./diagnostics";
import { returnLocalizedDefaultStateVariableDefinition } from "./contentLocale";
import { BLANK_PLACEHOLDER } from "./embeddedMathInputs";

function returnScoredContainerAncestorDependency(...variableNames) {
    return {
        dependencyType: "ancestor",
        variableNames,
    };
}

/**
 * Whether a math expression's tree carries nothing the reader typed.
 *
 * A whole expression that is the placeholder U+FF3F — what math-expressions
 * uses for a missing subexpression, and what an untouched math-flavored input
 * submits — is blank. One that is merely *partly* blank, `x + \uFF3F`, is
 * something the reader typed and is not.
 *
 * A `<matrixInput>` is the case that needs unwrapping: untouched, it submits a
 * matrix of placeholders rather than a bare one, and neither the dimensions
 * around them nor the tuples holding the rows are a response.
 *
 * @param {unknown} tree - a math-expression `tree`, or a subtree of one
 * @returns {boolean}
 */
function mathTreeIsBlank(tree) {
    if (tree === BLANK_PLACEHOLDER) {
        return true;
    }

    // ["matrix", ["tuple", nRows, nColumns], ["tuple", ...rows]], each row
    // itself a tuple of entries.
    if (Array.isArray(tree) && tree[0] === "matrix") {
        return matrixEntriesAreBlank(tree[2]);
    }

    return false;
}

/**
 * Whether every entry of a matrix's rows tuple — or of one such row — is the
 * blank placeholder. Anything that is not the tuple structure a matrix is built
 * from is not something this can call blank.
 *
 * @param {unknown} tuple - the rows of a matrix tree, or one of those rows
 * @returns {boolean}
 */
function matrixEntriesAreBlank(tuple) {
    return (
        Array.isArray(tuple) &&
        tuple[0] === "tuple" &&
        tuple
            .slice(1)
            .every(
                (entry) =>
                    entry === BLANK_PLACEHOLDER || matrixEntriesAreBlank(entry),
            )
    );
}

/**
 * Whether a single submitted response value carries nothing the reader typed.
 *
 * Pressing submit on an untouched input still records a response, so "was
 * something submitted?" and "did the reader respond?" are different questions.
 * The empty value differs by input: the math-flavored inputs submit a
 * math-expression built from the blank placeholder, a `<textInput>` an empty
 * string, and a `<choiceInput>` with nothing selected no response value at all.
 *
 * A `<booleanInput>` is the exception with no blank state of its own: untouched
 * it submits `false`, which is indistinguishable from the reader deliberately
 * leaving the box unchecked, so it counts as a response either way.
 *
 * @param {unknown} response - one entry of `submittedResponses`
 * @returns {boolean}
 */
function responseIsBlank(response) {
    if (response === null || response === undefined) {
        return true;
    }
    if (typeof response === "string") {
        return response.trim() === "";
    }
    if (typeof response === "number") {
        return Number.isNaN(response);
    }
    if (Array.isArray(response)) {
        return response.every(responseIsBlank);
    }
    if (typeof response === "object" && "tree" in response) {
        return mathTreeIsBlank(response.tree);
    }
    return false;
}

/**
 * Whether a submission carried nothing the reader entered, either because there
 * were no response values at all or because every one of them is blank.
 *
 * Filling one input of several is entering something, so a single non-blank
 * value is enough. Note that an author can add values of their own to the
 * responses with `<considerAsResponses>` or `isResponse`; those count here like
 * any other, having been declared responses.
 *
 * @param {unknown[]} submittedResponses - the answer's `submittedResponses`
 * @returns {boolean}
 */
function submittedResponsesAreBlank(submittedResponses) {
    return submittedResponses.every(responseIsBlank);
}

export function returnStandardAnswerAttributes() {
    return {
        weight: {
            createComponentOfType: "number",
            createStateVariable: "weight",
            defaultValue: 1,
            public: true,
            groupName: "answer-grading",
            description:
                "Relative weight of this answer when aggregating credit across multiple answers.",
        },
        handGraded: {
            createPrimitiveOfType: "boolean",
            createStateVariable: "handGraded",
            defaultValue: false,
            public: true,
            groupName: "answer-grading",
            description:
                "Whether this answer is graded by hand rather than automatically.",
        },
        matchPartial: {
            createComponentOfType: "boolean",
            createStateVariable: "matchPartial",
            defaultValue: false,
            public: true,
            groupName: "answer-grading",
            description:
                "Whether to award partial credit when the response is partially correct.",
        },
        maxNumAttempts: {
            createComponentOfType: "integer",
            createStateVariable: "maxNumAttempts",
            defaultValue: Infinity,
            public: true,
            groupName: "answer-grading",
            description:
                "Maximum number of times the response can be submitted.",
        },
        showCorrectness: {
            createComponentOfType: "boolean",
            createStateVariable: "showCorrectnessPreliminary",
            defaultValue: true,
            groupName: "answer-grading",
            description:
                "Whether to display whether the submitted response is correct.",
        },
        colorCorrectness: {
            createComponentOfType: "boolean",
            createStateVariable: "colorCorrectnessPreliminary",
            defaultValue: true,
            groupName: "answer-grading",
            // The runtime stores the raw attribute value under
            // `colorCorrectnessPreliminary` so a derived `colorCorrectness`
            // state def can combine it with the ancestor's setting. That raw
            // variable is plumbing, so it is not public: the attribute stays
            // author-facing, and `$a.colorCorrectnessPreliminary` is not a
            // reference anyone can write. See #1089.
            description:
                "Whether to color-code the response based on its correctness.",
        },

        disableAfterCorrect: {
            createComponentOfType: "boolean",
            createStateVariable: "disableAfterCorrect",
            defaultValue: false,
            public: true,
            groupName: "answer-grading",
            description:
                "Whether to disable the answer after a fully correct response has been submitted.",
        },

        submitLabel: {
            createComponentOfType: "text",
            createStateVariable: "submitLabelPreLocalize",
            // The default is English here only so that authors see the words
            // in the schema; `returnSubmitLabelStateVariableDefinitions`
            // ignores this value when the attribute is unspecified and takes
            // the label from the document's own language instead. An authored
            // value is never translated — see the note there.
            defaultValue: "Check Work",
            groupName: "answer-grading",
            description:
                "Label for the submit button when correctness is shown.",
        },

        submitLabelNoCorrectness: {
            createComponentOfType: "text",
            createStateVariable: "submitLabelNoCorrectnessPreLocalize",
            // See the note on `submitLabel`.
            defaultValue: "Submit Response",
            groupName: "answer-grading",
            description:
                "Label for the submit button when correctness is not shown.",
        },

        displayDigitsForResponses: {
            createComponentOfType: "integer",
            createStateVariable: "displayDigitsForResponses",
            defaultValue: 10,
            public: true,
            groupName: "answer-grading",
            description:
                "Number of significant digits to display when rendering numeric responses.",
        },

        displayDigitsForCreditAchieved: {
            createComponentOfType: "integer",
            createStateVariable: "displayDigitsForCreditAchieved",
            defaultValue: 3,
            public: true,
            groupName: "answer-grading",
            description:
                "Number of significant digits to display for the credit achieved value.",
        },
    };
}

/**
 * `submitLabel` and `submitLabelNoCorrectness`, with their defaults in the
 * document's language.
 *
 * Only the *default* is translated; see
 * `returnLocalizedDefaultStateVariableDefinition`, which every
 * author-overridable label in the worker resolves through.
 *
 * Shared by `<answer>` and by every container with a section-wide check-work
 * button, which declare the same two attributes from different tables
 * (`returnStandardAnswerAttributes` and `returnScoredSectionAttributes`) but
 * resolve them identically.
 *
 * @param button How the schema should name the button these label — a section
 *   labels a section-wide one, an `<answer>` its own.
 * @param ownLocale Read the component's *own* `locale` as well as the
 *   enclosing document's. Only `<document>` has one; see
 *   `returnContentLocaleDependencies`.
 */
export function returnSubmitLabelStateVariableDefinitions({
    ownLocale = false,
    button = "the submit button",
} = {}) {
    return {
        submitLabel: returnLocalizedDefaultStateVariableDefinition({
            name: "submitLabel",
            translatedDefault: (t) => t("answer-submit-label"),
            description: `Label for ${button} when correctness is shown.`,
            ownLocale,
        }),
        submitLabelNoCorrectness: returnLocalizedDefaultStateVariableDefinition(
            {
                name: "submitLabelNoCorrectness",
                translatedDefault: (t) =>
                    t("answer-submit-label-no-correctness"),
                description: `Label for ${button} when correctness is not shown.`,
                ownLocale,
            },
        ),
    };
}

// Note: depends on `creditAchievedIfSubmit` state variable
// and having the original `disabled` attribute be renamed to `disabledOriginal`.
export function returnStandardAnswerStateVariableDefinition() {
    const stateVariableDefinitions = {};

    Object.assign(
        stateVariableDefinitions,
        returnSubmitLabelStateVariableDefinitions(),
    );

    stateVariableDefinitions.showCorrectness = {
        description:
            "Whether correctness is shown for the submitted response, after combining the attribute with hand-grading, any enclosing section's setting, and the activity-wide flag.",
        public: true,
        shadowingInstructions: {
            createComponentOfType: "boolean",
        },
        forRenderer: true,
        returnDependencies: () => ({
            showCorrectnessPreliminary: {
                dependencyType: "stateVariable",
                variableName: "showCorrectnessPreliminary",
            },
            showCorrectnessFlag: {
                dependencyType: "flag",
                flagName: "showCorrectness",
            },
            handGraded: {
                dependencyType: "stateVariable",
                variableName: "handGraded",
            },
            showCorrectnessAncestor: {
                dependencyType: "ancestor",
                variableNames: ["showCorrectness"],
            },
        }),
        definition({ dependencyValues, usedDefault }) {
            let showCorrectness;
            if (!usedDefault.showCorrectnessPreliminary) {
                showCorrectness = dependencyValues.showCorrectnessPreliminary;
            } else if (dependencyValues.handGraded) {
                showCorrectness = false;
            } else if (dependencyValues.showCorrectnessAncestor) {
                showCorrectness =
                    dependencyValues.showCorrectnessAncestor.stateValues
                        .showCorrectness;
            } else {
                showCorrectness =
                    dependencyValues.showCorrectnessFlag !== false;
            }
            return { setValue: { showCorrectness } };
        },
    };

    stateVariableDefinitions.colorCorrectness = {
        description:
            "Whether the response is color-coded by correctness, after combining the attribute with any enclosing section's setting and with whether correctness is shown at all.",
        public: true,
        shadowingInstructions: {
            createComponentOfType: "boolean",
        },
        forRenderer: true,
        returnDependencies: () => ({
            colorCorrectnessPreliminary: {
                dependencyType: "stateVariable",
                variableName: "colorCorrectnessPreliminary",
            },
            showCorrectness: {
                dependencyType: "stateVariable",
                variableName: "showCorrectness",
            },
            colorCorrectnessAncestor: {
                dependencyType: "ancestor",
                variableNames: ["colorCorrectness"],
            },
        }),
        definition({ dependencyValues, usedDefault }) {
            let colorCorrectness = true;
            if (!dependencyValues.showCorrectness) {
                colorCorrectness = false;
            } else if (!usedDefault.colorCorrectnessPreliminary) {
                colorCorrectness = dependencyValues.colorCorrectnessPreliminary;
            } else if (dependencyValues.colorCorrectnessAncestor) {
                colorCorrectness =
                    dependencyValues.colorCorrectnessAncestor.stateValues
                        .colorCorrectness;
            }

            return { setValue: { colorCorrectness } };
        },
    };

    stateVariableDefinitions.suppressCheckWork = {
        returnDependencies: () => ({
            autoSubmit: {
                dependencyType: "flag",
                flagName: "autoSubmit",
            },
        }),
        definition({ dependencyValues }) {
            return {
                setValue: {
                    suppressCheckWork: dependencyValues.autoSubmit,
                },
            };
        },
    };

    stateVariableDefinitions.displayDecimalsForCreditAchieved = {
        returnDependencies: () => ({}),
        definition: () => ({
            setValue: { displayDecimalsForCreditAchieved: -Infinity },
        }),
    };

    stateVariableDefinitions.creditAchieved = {
        description:
            "The fraction of credit achieved on the most recent submission (between 0 and 1).",
        defaultValue: 0,
        public: true,
        shadowingInstructions: {
            createComponentOfType: "number",
            addAttributeComponentsShadowingStateVariables: {
                displayDigits: {
                    stateVariableToShadow: "displayDigitsForCreditAchieved",
                },
                displayDecimals: {
                    stateVariableToShadow: "displayDecimalsForCreditAchieved",
                },
            },
        },
        forRenderer: true,
        hasEssential: true,
        returnDependencies: () => ({}),
        definition: () => ({
            useEssentialOrDefaultValue: {
                creditAchieved: true,
            },
        }),
        inverseDefinition: function ({ desiredStateVariableValues }) {
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

    stateVariableDefinitions.responseHasBeenSubmitted = {
        description:
            "Whether a response has ever been submitted for this answer.",
        public: true,
        shadowingInstructions: {
            createComponentOfType: "boolean",
        },
        defaultValue: false,
        hasEssential: true,
        returnDependencies: () => ({}),
        definition: () => ({
            useEssentialOrDefaultValue: {
                responseHasBeenSubmitted: true,
            },
        }),
        inverseDefinition: function ({ desiredStateVariableValues }) {
            return {
                success: true,
                instructions: [
                    {
                        setEssentialValue: "responseHasBeenSubmitted",
                        value: desiredStateVariableValues.responseHasBeenSubmitted,
                    },
                ],
            };
        },
    };

    stateVariableDefinitions.creditAchievedForProgress = {
        description:
            "The credit this answer contributes when deciding whether the content around it has been completed, as a `<cascade>` does. Equal to `creditAchieved`, except that a hand-graded answer counts as fully correct once a non-blank response has been submitted.",
        stateVariablesDeterminingDependencies: ["handGraded"],
        returnDependencies({ stateValues }) {
            const dependencies = {
                handGraded: {
                    dependencyType: "stateVariable",
                    variableName: "handGraded",
                },
            };

            if (stateValues.handGraded) {
                // The submitted responses are worth resolving only for a
                // hand-graded answer. Every enclosing section aggregates this
                // variable to color its heading, so an unconditional dependency
                // would pull the whole response array of every answer in the
                // document into the initial render.
                dependencies.responseHasBeenSubmitted = {
                    dependencyType: "stateVariable",
                    variableName: "responseHasBeenSubmitted",
                };
                dependencies.submittedResponses = {
                    dependencyType: "stateVariable",
                    variableName: "submittedResponses",
                };
            } else {
                dependencies.creditAchieved = {
                    dependencyType: "stateVariable",
                    variableName: "creditAchieved",
                };
            }

            return dependencies;
        },
        definition({ dependencyValues }) {
            if (!dependencyValues.handGraded) {
                return {
                    setValue: {
                        creditAchievedForProgress:
                            dependencyValues.creditAchieved,
                    },
                };
            }

            // A hand-graded answer keeps `creditAchieved` at 0 until an
            // instructor grades it, which is well after the reader is done
            // with it. Progress therefore asks the only question that can be
            // answered here: did the reader actually respond?
            const responded =
                dependencyValues.responseHasBeenSubmitted &&
                !submittedResponsesAreBlank(
                    dependencyValues.submittedResponses,
                );

            return {
                setValue: { creditAchievedForProgress: responded ? 1 : 0 },
            };
        },
    };

    stateVariableDefinitions.autoSubmit = {
        returnDependencies: () => ({
            autoSubmit: {
                dependencyType: "flag",
                flagName: "autoSubmit",
            },
        }),
        definition({ dependencyValues }) {
            return {
                setValue: {
                    autoSubmit: Boolean(dependencyValues.autoSubmit),
                },
            };
        },
    };

    stateVariableDefinitions.creditAchievedDependencies = {
        shadowVariable: true,
        stateVariablesDeterminingDependencies: ["autoSubmit"],
        returnDependencies: ({ stateValues }) => ({
            currentCreditAchievedDependencies: {
                dependencyType: "recursiveDependencyValues",
                variableNames: ["creditAchievedIfSubmit"],
                includeImmediateValueWithValue: !stateValues.autoSubmit,
                includeRawValueWithImmediateValue: !stateValues.autoSubmit,
                includeOnlyEssentialValues: true,
            },
        }),
        definition({ dependencyValues, componentIdx }) {
            // Use stringify from json-stringify-deterministic
            // so that the string will be the same
            // even if the object was built in a different order
            // (as can happen when reloading from a database)

            let diagnostics = [];

            let selfDependencies =
                dependencyValues.currentCreditAchievedDependencies.find(
                    (x) => x.componentIdx === componentIdx,
                );

            if (selfDependencies) {
                // look for a dependency on a submitted response
                if (
                    Object.keys(selfDependencies.stateValues).find(
                        (x) => x.substring(0, 17) === "submittedResponse",
                    )
                ) {
                    diagnostics.push(
                        codedDiagnostic({
                            type: "warning",
                            code: "doenet-w0069",
                        }),
                    );
                }
            }

            let stringified = stringify(
                dependencyValues.currentCreditAchievedDependencies,
                { replacer: serializedComponentsReplacer },
            );

            return {
                setValue: {
                    creditAchievedDependencies: Base64.stringify(
                        sha1(stringified),
                    ),
                },
                sendDiagnostics: diagnostics,
            };
        },
        markStale: () => ({ answerCreditPotentiallyChanged: true }),
    };

    stateVariableDefinitions.creditAchievedDependenciesAtSubmit = {
        defaultValue: null,
        hasEssential: true,
        returnDependencies: () => ({}),
        definition: () => ({
            useEssentialOrDefaultValue: {
                creditAchievedDependenciesAtSubmit: true,
            },
        }),
        inverseDefinition: function ({ desiredStateVariableValues }) {
            return {
                success: true,
                instructions: [
                    {
                        setEssentialValue: "creditAchievedDependenciesAtSubmit",
                        value: desiredStateVariableValues.creditAchievedDependenciesAtSubmit,
                    },
                ],
            };
        },
    };

    stateVariableDefinitions.justSubmitted = {
        description:
            "Whether the most recent submission for this answer has not yet been changed.",
        public: true,
        shadowingInstructions: {
            createComponentOfType: "boolean",
        },
        forRenderer: true,
        defaultValue: false,
        hasEssential: true,
        shadowVariable: true,
        returnDependencies: () => ({
            currentCreditAchievedDependencies: {
                dependencyType: "stateVariable",
                variableName: "creditAchievedDependencies",
            },
            creditAchievedDependenciesAtSubmit: {
                dependencyType: "stateVariable",
                variableName: "creditAchievedDependenciesAtSubmit",
            },
            disableAfterCorrect: {
                dependencyType: "stateVariable",
                variableName: "disableAfterCorrect",
            },
            hasBeenCorrect: {
                dependencyType: "stateVariable",
                variableName: "hasBeenCorrect",
            },
        }),
        definition: function ({
            dependencyValues,
            justUpdatedForNewComponent,
            initialAddPhase,
        }) {
            if (
                dependencyValues.disableAfterCorrect &&
                dependencyValues.hasBeenCorrect
            ) {
                return {
                    setValue: { justSubmitted: true },
                };
            }

            let foundChange =
                dependencyValues.creditAchievedDependenciesAtSubmit !==
                dependencyValues.currentCreditAchievedDependencies;

            if (
                foundChange &&
                !(justUpdatedForNewComponent || initialAddPhase)
            ) {
                return {
                    setValue: { justSubmitted: false },
                    setEssentialValue: { justSubmitted: false },
                };
            } else {
                return {
                    useEssentialOrDefaultValue: { justSubmitted: true },
                };
            }
        },
        inverseDefinition({ desiredStateVariableValues }) {
            return {
                success: true,
                instructions: [
                    {
                        setEssentialValue: "justSubmitted",
                        value: desiredStateVariableValues.justSubmitted,
                    },
                ],
            };
        },
    };

    stateVariableDefinitions.numSubmissions = {
        description: "Total number of times a response has been submitted.",
        public: true,
        shadowingInstructions: {
            createComponentOfType: "integer",
        },
        defaultValue: 0,
        hasEssential: true,
        returnDependencies: () => ({}),
        definition: () => ({
            useEssentialOrDefaultValue: {
                numSubmissions: true,
            },
        }),
        inverseDefinition: ({ desiredStateVariableValues }) => ({
            success: true,
            instructions: [
                {
                    setEssentialValue: "numSubmissions",
                    value: desiredStateVariableValues.numSubmissions,
                },
            ],
        }),
    };

    stateVariableDefinitions.numIncorrectSubmissions = {
        defaultValue: 0,
        hasEssential: true,
        forRenderer: true,
        returnDependencies: () => ({}),
        definition: () => ({
            useEssentialOrDefaultValue: {
                numIncorrectSubmissions: true,
            },
        }),
        inverseDefinition: ({ desiredStateVariableValues }) => ({
            success: true,
            instructions: [
                {
                    setEssentialValue: "numIncorrectSubmissions",
                    value: desiredStateVariableValues.numIncorrectSubmissions,
                },
            ],
        }),
    };

    stateVariableDefinitions.numAttemptsLeft = {
        description:
            "Remaining number of submission attempts before the maximum is reached.",
        public: true,
        shadowingInstructions: {
            createComponentOfType: "integer",
        },
        forRenderer: true,
        returnDependencies: () => ({
            numSubmissions: {
                dependencyType: "stateVariable",
                variableName: "numSubmissions",
            },
            maxNumAttempts: {
                dependencyType: "stateVariable",
                variableName: "maxNumAttempts",
            },
            ancestorSuppressingAnswerSubmitButtons:
                returnScoredContainerAncestorDependency(
                    "suppressAnswerSubmitButtons",
                    "numAttemptsLeft",
                ),
            // Used to target the ignored-`maxNumAttempts` warning at the
            // attribute itself rather than the whole `<answer>`.
            maxNumAttemptsAttr: {
                dependencyType: "attributeComponent",
                attributeName: "maxNumAttempts",
            },
        }),
        definition({ dependencyValues, usedDefault }) {
            let sendDiagnostics = [];

            let insideSectionWideCheckWork =
                dependencyValues.ancestorSuppressingAnswerSubmitButtons
                    ?.stateValues.suppressAnswerSubmitButtons;

            if (!usedDefault.maxNumAttempts && insideSectionWideCheckWork) {
                sendDiagnostics.push(
                    codedDiagnostic({
                        type: "warning",
                        code: "doenet-w0070",
                        position: dependencyValues.maxNumAttemptsAttr?.position,
                    }),
                );
            }

            // Inside a section-wide check work, the answer's own
            // `maxNumAttempts` is ignored: the enclosing container controls the
            // number of attempts. Report that container's remaining attempts so
            // the public `numAttemptsLeft` is accurate. This matches how a
            // `maxNumAttempts` on a nested `sectionWideCheckWork` container is
            // ignored.
            const numAttemptsLeft = insideSectionWideCheckWork
                ? dependencyValues.ancestorSuppressingAnswerSubmitButtons
                      .stateValues.numAttemptsLeft
                : Math.max(
                      0,
                      dependencyValues.maxNumAttempts -
                          dependencyValues.numSubmissions,
                  );

            return {
                setValue: { numAttemptsLeft },
                sendDiagnostics,
            };
        },
    };

    stateVariableDefinitions.hasBeenCorrect = {
        defaultValue: false,
        hasEssential: true,
        shadowVariable: true,
        returnDependencies: () => ({
            creditAchieved: {
                dependencyType: "stateVariable",
                variableName: "creditAchieved",
            },
            nextCreditFactor: {
                dependencyType: "stateVariable",
                variableName: "nextCreditFactor",
                variablesOptional: true,
            },
        }),
        definition({ dependencyValues }) {
            const creditAchieved = dependencyValues.creditAchieved;
            if (
                creditAchieved === 1 ||
                (creditAchieved > 0 &&
                    creditAchieved === dependencyValues.nextCreditFactor)
            ) {
                return {
                    setValue: { hasBeenCorrect: true },
                    setEssentialValue: { hasBeenCorrect: true },
                };
            }

            return {
                useEssentialOrDefaultValue: {
                    hasBeenCorrect: true,
                },
            };
        },
    };

    stateVariableDefinitions.disabled = {
        description:
            "Whether this answer is disabled and is no longer accepting submissions.",
        public: true,
        shadowingInstructions: {
            createComponentOfType: "boolean",
        },
        forRenderer: true,
        stateVariablesDeterminingDependencies: ["disableAfterCorrect"],
        returnDependencies({ stateValues }) {
            let dependencies = {
                disabledOriginal: {
                    dependencyType: "stateVariable",
                    variableName: "disabledOriginal",
                },
                numAttemptsLeft: {
                    dependencyType: "stateVariable",
                    variableName: "numAttemptsLeft",
                },
                disableAfterCorrect: {
                    dependencyType: "stateVariable",
                    variableName: "disableAfterCorrect",
                },
            };

            if (stateValues.disableAfterCorrect) {
                dependencies.hasBeenCorrect = {
                    dependencyType: "stateVariable",
                    variableName: "hasBeenCorrect",
                };
            }

            return dependencies;
        },
        definition({ dependencyValues }) {
            let disabled =
                dependencyValues.disabledOriginal ||
                dependencyValues.numAttemptsLeft < 1 ||
                (dependencyValues.disableAfterCorrect &&
                    dependencyValues.hasBeenCorrect);

            return { setValue: { disabled } };
        },
    };

    stateVariableDefinitions.inComponentNumber = {
        returnDependencies: () => ({
            documentAncestor: {
                dependencyType: "ancestor",
                componentType: "document",
                variableNames: ["componentNumberByAnswerName"],
            },
        }),
        definition({ dependencyValues, componentIdx }) {
            return {
                setValue: {
                    inComponentNumber:
                        dependencyValues.documentAncestor.stateValues
                            .componentNumberByAnswerName[componentIdx],
                },
            };
        },
    };

    return stateVariableDefinitions;
}

export function returnSimplifyExpandOnCompareWarning() {
    const stateVariableDefinitions = {};

    stateVariableDefinitions.simplifyExpandOnCompareWarning = {
        returnDependencies: () => ({
            expandOnCompareAttr: {
                dependencyType: "attributeComponent",
                attributeName: "expandOnCompare",
            },
            simplifyOnCompareAttr: {
                dependencyType: "attributeComponent",
                attributeName: "simplifyOnCompare",
            },
            symbolicEquality: {
                dependencyType: "stateVariable",
                variableName: "symbolicEquality",
            },
        }),
        definition({ dependencyValues }) {
            const sendDiagnostics = [];
            if (!dependencyValues.symbolicEquality) {
                const attributesSpecified = [];

                if (dependencyValues.expandOnCompareAttr !== null) {
                    attributesSpecified.push("expandOnCompare");
                }

                if (dependencyValues.simplifyOnCompareAttr !== null) {
                    attributesSpecified.push("simplifyOnCompare");
                }

                if (attributesSpecified.length > 0) {
                    sendDiagnostics.push(
                        codedDiagnostic({
                            type: "warning",
                            code: "doenet-w0071",
                            args: { attributes: attributesSpecified },
                        }),
                    );
                }
            }

            return {
                sendDiagnostics,
                setValue: {
                    simplifyExpandOnCompareWarning: null,
                },
            };
        },
    };

    return stateVariableDefinitions;
}

/**
 * Walk a serialized-component tree and stamp each answer (and any
 * `_blockScoredComponent` descendant) with a sequential `answerNumber`
 * starting from `numSoFar + 1`. Answers and block-scored components
 * are leaves for the purpose of numbering: their children are not
 * descended into.
 *
 * Returns the running count so recursive calls can resume.
 */
export function numberAnswers(components, componentInfoObjects, numSoFar = 0) {
    let count = numSoFar;

    for (let comp of components) {
        if (
            comp.componentType === "answer" ||
            componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: comp.componentType,
                baseComponentType: "_blockScoredComponent",
            })
        ) {
            count++;
            comp.answerNumber = count;
        } else if (comp.children) {
            const result = numberAnswers(
                comp.children,
                componentInfoObjects,
                count,
            );
            count = result.count;
        }
    }

    return { count };
}

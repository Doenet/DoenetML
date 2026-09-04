import { codedDiagnostic } from "./diagnostics";
import { returnSubmitLabelStateVariableDefinitions } from "./answer";

/**
 * Builds the `returnDependencies` of a state variable that aggregates one
 * credit variable over a section's scored descendants.
 *
 * A section aggregates several credit variables — `creditAchieved`,
 * `creditAchievedForProgress`, `creditAchievedIfSubmit` — that differ only in
 * which variable is read off each descendant, so they all gather their
 * dependencies here. (`creditAchievedForCheckWork` is the exception: it usually
 * takes no dependencies at all, and reads two variables off a descendant when it
 * does. See {@link returnCheckWorkCreditStateVariableDefinition}.) Each descendant's value arrives as `<variableName><index>`
 * alongside the `scoredDescendants` that give the indices their meaning; when
 * the section does not aggregate scores, nothing but `aggregateScores` is
 * depended on.
 *
 * Requires `stateVariablesDeterminingDependencies` of `["aggregateScores",
 * "scoredDescendants"]` on the state variable using it.
 *
 * @param {string} variableName - the credit variable read off each scored descendant
 * @returns {({ stateValues }: { stateValues: any }) => any} a `returnDependencies` function
 */
function returnAggregateCreditDependencies(variableName) {
    return function ({ stateValues }) {
        const dependencies = {
            aggregateScores: {
                dependencyType: "stateVariable",
                variableName: "aggregateScores",
            },
        };

        if (stateValues.aggregateScores) {
            dependencies.scoredDescendants = {
                dependencyType: "stateVariable",
                variableName: "scoredDescendants",
            };
            for (let [
                ind,
                descendant,
            ] of stateValues.scoredDescendants.entries()) {
                dependencies[variableName + ind] = {
                    dependencyType: "stateVariable",
                    componentIdx: descendant.componentIdx,
                    variableName,
                };
            }
        }

        return dependencies;
    };
}

/**
 * The weight-averaged credit over the scored descendants gathered by
 * `returnAggregateCreditDependencies(variableName)`.
 *
 * @param {object} dependencyValues - the resolved dependencies
 * @param {string} variableName - the same name passed to the dependency builder
 * @param {number} [creditWhenNothingScored] - the credit for a section with no
 *   scored descendants at all, where there is no average to take; full credit
 *   unless the caller says otherwise
 * @returns {number} a credit between 0 and 1
 */
function aggregateCreditOverScoredDescendants(
    dependencyValues,
    variableName,
    creditWhenNothingScored = 1,
) {
    let creditSum = 0;
    let totalWeight = 0;

    for (let [ind, component] of dependencyValues.scoredDescendants.entries()) {
        const weight = component.stateValues.weight;
        creditSum += dependencyValues[variableName + ind] * weight;
        totalWeight += weight;
    }

    return totalWeight > 0 ? creditSum / totalWeight : creditWhenNothingScored;
}

/**
 * The credit a section-wide check-work button reports, and the credit the
 * answers under it are colored by.
 *
 * This is what `creditAchieved` reports except in one case: when every scored
 * descendant carries `weight="0"`. The two differ there because they answer
 * different questions. `creditAchieved` asks what the section is *worth* —
 * nothing carries weight, so nothing can be lost, and the reader is credited in
 * full, the same rule that credits a reader for a section holding no answers at
 * all. The button asks whether there is work here still to get right, and an
 * ungraded answer is still an answer, so when no weight distinguishes the
 * descendants they are weighed equally rather than treated as absent.
 * Otherwise the weighted mean is taken, and a zero-weight descendant among
 * weighted ones contributes nothing, exactly as it does to the score.
 *
 * Only called in the cases `checkWorkCreditNeedsAggregating` singles out; every
 * other case resolves to `null` without depending on anything. Each descendant's
 * credit arrives as `creditForCheckWork<index>`, carrying its
 * `creditAchievedForCheckWork` when it has one (an aggregating container, so a
 * zero-weight subsection passes its own equal-weighted credit up) and otherwise
 * its `creditAchieved` (an `<answer>`, or a container that took the `null` path).
 *
 * @param {object} dependencyValues - the resolved dependencies
 * @returns {number} a credit between 0 and 1
 */
function aggregateCreditForCheckWork(dependencyValues) {
    const descendants = dependencyValues.scoredDescendants;

    const totalWeight = descendants.reduce(
        (sum, descendant) => sum + descendant.stateValues.weight,
        0,
    );
    const useUnitWeights = !(totalWeight > 0);

    let creditSum = 0;
    let weightSum = 0;

    for (const [ind, descendant] of descendants.entries()) {
        const weight = useUnitWeights ? 1 : descendant.stateValues.weight;
        const stateValues =
            dependencyValues["creditForCheckWork" + ind].stateValues;
        const credit =
            stateValues.creditAchievedForCheckWork ??
            stateValues.creditAchieved;

        creditSum += credit * weight;
        weightSum += weight;
    }

    return creditSum / weightSum;
}

/**
 * Whether `creditAchievedForCheckWork` has to aggregate over the scored
 * descendants at all, decided from values that are already resolved so that the
 * usual case costs nothing.
 *
 * The variable exists for a rare shape — a section-wide check work whose
 * answers all carry `weight="0"` — and everywhere else it would report exactly
 * what `creditAchieved` reports. Rather than build a second aggregation graph
 * beside the three that already fan out from every scored container
 * (`creditAchieved`, `creditAchievedForProgress`, `creditAchievedIfSubmit`),
 * and so add another staleness path to walk on every submission, those cases
 * take no dependencies and resolve to `null`; the renderer and `Input.js` read
 * `creditAchievedForCheckWork ?? creditAchieved` and land on the same number.
 *
 * @param {object} stateValues - `suppressAnswerSubmitButtons`,
 *   `scoredDescendants`, and (unless `alwaysAggregate`) `aggregateScores`
 * @param {boolean} alwaysAggregate - for the document, which has no
 *   `aggregateScores` to consult
 * @returns {boolean} whether the aggregating dependencies are needed
 */
function checkWorkCreditNeedsAggregating(stateValues, alwaysAggregate) {
    // Outside a section-wide check work there is no section-wide button and no
    // section-driven answer coloring, so nothing reads this.
    if (!stateValues.suppressAnswerSubmitButtons) {
        return false;
    }

    // A non-aggregating container nested inside one: `scoredDescendants`
    // flattens it away in favor of its own scored descendants, so nothing reads
    // this either.
    if (!alwaysAggregate && !stateValues.aggregateScores) {
        return false;
    }

    const descendants = stateValues.scoredDescendants;

    // Nothing scored: `creditAchieved` already credits it in full, which is the
    // answer here too.
    if (descendants.length === 0) {
        return false;
    }

    // Something carries weight, so the weighted mean applies — and with every
    // descendant a leaf, that mean *is* `creditAchieved`. An aggregating
    // descendant still has to be asked, because it may be a subsection whose own
    // descendants all carry `weight="0"`.
    const anyPositiveWeight = descendants.some(
        (descendant) => descendant.stateValues.weight > 0,
    );
    const anyAggregatingDescendant = descendants.some(
        // The same test `scoredDescendants` uses to tell a container it keeps
        // from a leaf it cannot look inside.
        (descendant) => descendant.stateValues.scoredDescendants !== undefined,
    );

    return !anyPositiveWeight || anyAggregatingDescendant;
}

/**
 * The `creditAchievedForCheckWork` state variable: the credit a section-wide
 * check-work button reports, which is `null` — meaning "read `creditAchieved`
 * instead" — in every case but the one described on
 * {@link aggregateCreditForCheckWork}.
 *
 * Shared so the document, which always aggregates and so cannot use the
 * `aggregateScores` the shared set defines, gets the same rule rather than a
 * second copy of it.
 *
 * @param {object} [options]
 * @param {boolean} [options.alwaysAggregate] - skip the `aggregateScores` check
 * @returns {object} a state variable definition
 */
export function returnCheckWorkCreditStateVariableDefinition({
    alwaysAggregate = false,
} = {}) {
    const stateVariablesDeterminingDependencies = [
        "suppressAnswerSubmitButtons",
        "scoredDescendants",
    ];
    if (!alwaysAggregate) {
        stateVariablesDeterminingDependencies.push("aggregateScores");
    }

    return {
        forRenderer: true,
        defaultValue: null,
        stateVariablesDeterminingDependencies,
        returnDependencies({ stateValues }) {
            if (
                !checkWorkCreditNeedsAggregating(stateValues, alwaysAggregate)
            ) {
                return {};
            }

            const dependencies = {
                scoredDescendants: {
                    dependencyType: "stateVariable",
                    variableName: "scoredDescendants",
                },
            };

            for (const [
                ind,
                descendant,
            ] of stateValues.scoredDescendants.entries()) {
                dependencies["creditForCheckWork" + ind] = {
                    dependencyType: "multipleStateVariables",
                    componentIdx: descendant.componentIdx,
                    variableNames: [
                        "creditAchievedForCheckWork",
                        "creditAchieved",
                    ],
                    // An `<answer>` has only the latter, which is what its
                    // check-work credit would be anyway.
                    variablesOptional: true,
                };
            }

            return dependencies;
        },
        definition({ dependencyValues }) {
            if (dependencyValues.scoredDescendants === undefined) {
                return { setValue: { creditAchievedForCheckWork: null } };
            }

            return {
                setValue: {
                    creditAchievedForCheckWork:
                        aggregateCreditForCheckWork(dependencyValues),
                },
            };
        },
    };
}

/**
 * Attributes implementing a "scored section": score aggregation plus the
 * "section-wide check work" feature.
 *
 * This is shared by all containers that can host section-wide check work
 * (sections, `<p>`, `<ol>`, `<ul>`, `<li>`, `<div>`, `<span>`, and the
 * document), so the feature is defined in exactly one place. The document
 * reuses this set but removes the score-aggregation attributes it does not
 * expose; see `Document.js`.
 */
export function returnScoredSectionAttributes() {
    return {
        aggregateScores: {
            createComponentOfType: "boolean",
            createStateVariable: "aggregateScoresPreliminary",
            defaultValue: false,
            groupName: "scoring",
            description:
                "Whether to aggregate scores of scored descendants into a section credit-achieved value.",
        },
        weight: {
            createComponentOfType: "number",
            createStateVariable: "weight",
            defaultValue: 1,
            public: true,
            groupName: "scoring",
            description:
                "Relative weight of this section when aggregated by an enclosing scored section.",
        },

        sectionWideCheckWork: {
            createComponentOfType: "boolean",
            createStateVariable: "sectionWideCheckWork",
            defaultValue: false,
            public: true,
            groupName: "scoring",
            description:
                "Whether to show a single section-wide check-work button instead of per-answer buttons.",
        },
        maxNumAttempts: {
            createComponentOfType: "integer",
            createStateVariable: "maxNumAttempts",
            defaultValue: Infinity,
            public: true,
            groupName: "scoring",
            description:
                "Maximum number of times the section-wide check-work button can be submitted. Once reached, all enclosed answers are disabled.",
        },
        showCorrectness: {
            createComponentOfType: "boolean",
            createStateVariable: "showCorrectnessPreliminary",
            // This default is shown to authors but is not used to resolve the
            // value: when the attribute is unspecified, the `showCorrectness`
            // state variable ignores this (defaulted) value and falls back to
            // the enclosing ancestor and then the `showCorrectness` flag (which
            // defaults to `true`). It is set to `true` to reflect that effective
            // default.
            defaultValue: true,
            groupName: "scoring",
            description:
                "Whether to display correctness indicators for the answers it contains.",
        },
        colorCorrectness: {
            createComponentOfType: "boolean",
            createStateVariable: "colorCorrectnessPreliminary",
            // See the note on `showCorrectness`: this default is shown to
            // authors but the resolved value falls back to the ancestor and
            // then to whether correctness is shown.
            defaultValue: true,
            groupName: "scoring",
            description:
                "Whether to color-code the answers it contains based on correctness.",
        },
        colorAnswersSeparately: {
            createComponentOfType: "boolean",
            createStateVariable: "colorAnswersSeparately",
            defaultValue: false,
            groupName: "scoring",
            description:
                "When section-wide check work is enabled, color each answer based on its own correctness rather than the section's overall credit.",
        },
        submitLabel: {
            createComponentOfType: "text",
            createStateVariable: "submitLabelPreLocalize",
            // See the note in `returnStandardAnswerAttributes`: this default
            // is shown to authors, but an unspecified attribute resolves to
            // the label in the document's own language rather than to this
            // English.
            defaultValue: "Check Work",
            groupName: "scoring",
            description:
                "Label for the section-wide submit button when correctness is shown.",
        },
        submitLabelNoCorrectness: {
            createComponentOfType: "text",
            createStateVariable: "submitLabelNoCorrectnessPreLocalize",
            // See the note on `submitLabel`.
            defaultValue: "Submit Response",
            groupName: "scoring",
            description:
                "Label for the section-wide submit button when correctness is not shown.",
        },

        displayDigitsForCreditAchieved: {
            createComponentOfType: "integer",
            createStateVariable: "displayDigitsForCreditAchieved",
            defaultValue: 3,
            public: true,
            groupName: "scoring",
            description:
                "Number of significant digits to display for the credit achieved value.",
        },
    };
}

/**
 * State variables implementing a "scored section": the section-wide check work
 * feature plus score aggregation, shared by containers (sections, `<p>`,
 * `<ol>`, `<ul>`, `<li>`, `<div>`, `<span>`, and the document). Pairs with
 * {@link returnScoredSectionAttributes}.
 *
 * The section-wide check work portion includes the section-wide submit button
 * (`createSubmitAllButton`), the suppression of per-answer submit buttons
 * (`suppressAnswerSubmitButtons`), and the attempt cap (`numSubmissions`,
 * `numAttemptsLeft`) — which, when exhausted, disables the enclosed answers via
 * their own propagated `numAttemptsLeft`. The aggregation portion includes
 * `scoredDescendants`, `aggregateScores`, `creditAchieved`, and related
 * variables — including `creditAchievedForCheckWork`, the credit the
 * section-wide button reports when weights alone would say the section is
 * already worth full marks. The document reuses this set but deletes `aggregateScores` and
 * overrides `creditAchieved`; see `Document.js`.
 */
export function returnScoredSectionStateVariableDefinition() {
    const stateVariableDefinitions = {};

    // The section-wide button carries the same two labels an `<answer>` does,
    // and resolves them the same way.
    Object.assign(
        stateVariableDefinitions,
        returnSubmitLabelStateVariableDefinitions({
            button: "the section-wide submit button",
        }),
    );

    stateVariableDefinitions.scoredDescendants = {
        returnDependencies: () => ({
            scoredDescendants: {
                dependencyType: "descendant",
                componentTypes: [
                    "_sectioningComponent",
                    "answer",
                    "setup",
                    "_blockScoredComponent",
                    "p",
                    "ol",
                    "ul",
                    "li",
                    "div",
                    "span",
                ],
                variableNames: [
                    "scoredDescendants",
                    "aggregateScores",
                    "weight",
                ],
                recurseToMatchedChildren: false,
                variablesOptional: true,
            },
        }),
        definition({ dependencyValues }) {
            let scoredDescendants = [];
            for (let descendant of dependencyValues.scoredDescendants) {
                // added setup just so that can skip them
                if (descendant.componentType === "setup") {
                    continue;
                }
                if (
                    descendant.stateValues.aggregateScores ||
                    descendant.stateValues.scoredDescendants === undefined
                ) {
                    scoredDescendants.push(descendant);
                } else {
                    scoredDescendants.push(
                        ...descendant.stateValues.scoredDescendants,
                    );
                }
            }

            return { setValue: { scoredDescendants } };
        },
    };

    stateVariableDefinitions.answerDescendants = {
        returnDependencies: () => ({
            answerDescendants: {
                dependencyType: "descendant",
                componentTypes: ["answer", "_blockScoredComponent"],
                variableNames: ["justSubmitted"],
                recurseToMatchedChildren: false,
            },
        }),
        definition({ dependencyValues }) {
            return {
                setValue: {
                    answerDescendants: dependencyValues.answerDescendants,
                },
            };
        },
    };

    stateVariableDefinitions.justSubmitted = {
        forRenderer: true,
        returnDependencies: () => ({
            answerDescendants: {
                dependencyType: "stateVariable",
                variableName: "answerDescendants",
            },
        }),
        definition({ dependencyValues }) {
            return {
                setValue: {
                    justSubmitted: dependencyValues.answerDescendants.every(
                        (x) => x.stateValues.justSubmitted,
                    ),
                },
            };
        },
    };

    stateVariableDefinitions.numSubmissions = {
        description:
            "Number of times the section-wide check-work button has been submitted.",
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

    stateVariableDefinitions.numAttemptsLeft = {
        description:
            "Remaining number of section-wide submissions before the maximum is reached.",
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
            sectionWideCheckWork: {
                dependencyType: "stateVariable",
                variableName: "sectionWideCheckWork",
            },
            // The nearest enclosing scored container. If it suppresses answer
            // submit buttons, then this container is itself inside a
            // section-wide check work, so its own section-wide button (and thus
            // its `maxNumAttempts`) is not shown — the enclosing container
            // controls the number of attempts.
            ancestorSuppressingAnswerSubmitButtons: {
                dependencyType: "ancestor",
                variableNames: [
                    "suppressAnswerSubmitButtons",
                    "numAttemptsLeft",
                ],
            },
            // Used to target the ignored-`maxNumAttempts` warning at the
            // attribute itself rather than the whole container.
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

            if (
                !usedDefault.maxNumAttempts &&
                dependencyValues.sectionWideCheckWork &&
                insideSectionWideCheckWork
            ) {
                sendDiagnostics.push(
                    codedDiagnostic({
                        type: "warning",
                        code: "doenet-w0081",
                        position: dependencyValues.maxNumAttemptsAttr?.position,
                    }),
                );
            }

            let numAttemptsLeft;
            if (insideSectionWideCheckWork) {
                // Inside an enclosing section-wide check work, this container's
                // own `maxNumAttempts` is ignored; report the enclosing
                // container's remaining attempts so the value is accurate.
                numAttemptsLeft =
                    dependencyValues.ancestorSuppressingAnswerSubmitButtons
                        .stateValues.numAttemptsLeft;
            } else {
                // Clamp at 0: a public "remaining attempts" value should never
                // go negative, even if `maxNumAttempts` is lowered below the
                // number of submissions already made (or a persisted
                // `numSubmissions` exceeds it).
                numAttemptsLeft = Math.max(
                    0,
                    dependencyValues.maxNumAttempts -
                        dependencyValues.numSubmissions,
                );
            }

            return {
                setValue: { numAttemptsLeft },
                sendDiagnostics,
            };
        },
    };

    stateVariableDefinitions.showCorrectness = {
        description:
            "Whether correctness is shown for the answers this section contains, after combining the attribute with any enclosing section's setting and with the activity-wide flag.",
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
            showCorrectnessAncestor: {
                dependencyType: "ancestor",
                variableNames: ["showCorrectness"],
            },
        }),
        definition({ dependencyValues, usedDefault }) {
            let showCorrectness;
            if (!usedDefault.showCorrectnessPreliminary) {
                showCorrectness = dependencyValues.showCorrectnessPreliminary;
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
            "Whether the answers this section contains are color-coded by correctness, after combining the attribute with any enclosing section's setting and with whether correctness is shown at all.",
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

    stateVariableDefinitions.displayDecimalsForCreditAchieved = {
        returnDependencies: () => ({}),
        definition: () => ({
            setValue: { displayDecimalsForCreditAchieved: -Infinity },
        }),
    };

    stateVariableDefinitions.aggregateScores = {
        description:
            "Whether scores of scored descendants are aggregated into this section's credit value.",
        public: true,
        shadowingInstructions: {
            createComponentOfType: "boolean",
        },
        returnDependencies: () => ({
            aggregateScoresPreliminary: {
                dependencyType: "stateVariable",
                variableName: "aggregateScoresPreliminary",
            },
            sectionWideCheckWork: {
                dependencyType: "stateVariable",
                variableName: "sectionWideCheckWork",
            },
            parentChildrenAggregateScores: {
                dependencyType: "parentStateVariable",
                variableName: "childrenAggregateScores",
            },
        }),
        definition({ dependencyValues }) {
            return {
                setValue: {
                    aggregateScores:
                        dependencyValues.aggregateScoresPreliminary ||
                        dependencyValues.sectionWideCheckWork ||
                        dependencyValues.parentChildrenAggregateScores,
                },
            };
        },
    };

    stateVariableDefinitions.creditAchieved = {
        description:
            "Aggregate credit achieved (between 0 and 1) for scored descendants of this section.",
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
        defaultValue: 0,
        hasEssential: true,
        additionalStateVariablesDefined: [
            {
                variableName: "percentCreditAchieved",
                description:
                    "Aggregate credit achieved as a percentage (between 0 and 100).",
                public: true,
                shadowingInstructions: {
                    createComponentOfType: "number",
                    addAttributeComponentsShadowingStateVariables: {
                        displayDigits: {
                            stateVariableToShadow:
                                "displayDigitsForCreditAchieved",
                        },
                        displayDecimals: {
                            stateVariableToShadow:
                                "displayDecimalsForCreditAchieved",
                        },
                    },
                },
                defaultValue: 0,
                hasEssential: true,
            },
        ],
        stateVariablesDeterminingDependencies: [
            "aggregateScores",
            "scoredDescendants",
        ],
        returnDependencies: returnAggregateCreditDependencies("creditAchieved"),
        definition({ dependencyValues }) {
            if (!dependencyValues.aggregateScores) {
                return {
                    setValue: {
                        creditAchieved: 0,
                        percentCreditAchieved: 0,
                    },
                };
            }

            const creditAchieved = aggregateCreditOverScoredDescendants(
                dependencyValues,
                "creditAchieved",
            );

            return {
                setValue: {
                    creditAchieved,
                    percentCreditAchieved: creditAchieved * 100,
                },
            };
        },
    };

    stateVariableDefinitions.creditAchievedForProgress = {
        description:
            "Aggregate credit achieved (between 0 and 1) for scored descendants of this section, used when deciding whether the section has been completed. Differs from `creditAchieved` only in that a hand-graded answer counts as fully correct once a non-blank response has been submitted.",
        defaultValue: 0,
        stateVariablesDeterminingDependencies: [
            "aggregateScores",
            "scoredDescendants",
        ],
        returnDependencies: returnAggregateCreditDependencies(
            "creditAchievedForProgress",
        ),
        definition({ dependencyValues }) {
            if (!dependencyValues.aggregateScores) {
                return { setValue: { creditAchievedForProgress: 0 } };
            }

            return {
                setValue: {
                    creditAchievedForProgress:
                        aggregateCreditOverScoredDescendants(
                            dependencyValues,
                            "creditAchievedForProgress",
                        ),
                },
            };
        },
    };

    stateVariableDefinitions.creditAchievedForCheckWork =
        returnCheckWorkCreditStateVariableDefinition();

    stateVariableDefinitions.creditAchievedIfSubmit = {
        defaultValue: 0,
        stateVariablesDeterminingDependencies: [
            "aggregateScores",
            "scoredDescendants",
        ],
        returnDependencies: returnAggregateCreditDependencies(
            "creditAchievedIfSubmit",
        ),
        definition({ dependencyValues }) {
            if (!dependencyValues.aggregateScores) {
                return {
                    setValue: {
                        creditAchievedIfSubmit: 0,
                    },
                };
            }

            return {
                setValue: {
                    creditAchievedIfSubmit:
                        aggregateCreditOverScoredDescendants(
                            dependencyValues,
                            "creditAchievedIfSubmit",
                            // A section with nothing scored has always left
                            // this at NaN — the `0 / 0` of the average it used
                            // to take inline — where `creditAchieved` gives
                            // full credit. Passed explicitly so extracting the
                            // shared helper preserves the behavior rather than
                            // quietly changing it.
                            NaN,
                        ),
                },
            };
        },
    };

    stateVariableDefinitions.createSubmitAllButton = {
        forRenderer: true,
        additionalStateVariablesDefined: [
            "suppressAnswerSubmitButtons",
            "descendantColorCorrectnessBasedOnIdx",
        ],
        returnDependencies: () => ({
            sectionWideCheckWork: {
                dependencyType: "stateVariable",
                variableName: "sectionWideCheckWork",
            },
            colorAnswersSeparately: {
                dependencyType: "stateVariable",
                variableName: "colorAnswersSeparately",
            },
            ancestorDeterminingSubmit: {
                dependencyType: "ancestor",
                variableNames: [
                    "suppressAnswerSubmitButtons",
                    "descendantColorCorrectnessBasedOnIdx",
                ],
            },
        }),
        definition({ dependencyValues, componentIdx }) {
            let createSubmitAllButton = false;
            let suppressAnswerSubmitButtons = false;
            let descendantColorCorrectnessBasedOnIdx = null;
            if (
                dependencyValues.ancestorDeterminingSubmit?.stateValues
                    .suppressAnswerSubmitButtons
            ) {
                suppressAnswerSubmitButtons = true;
                descendantColorCorrectnessBasedOnIdx =
                    dependencyValues.ancestorDeterminingSubmit.stateValues
                        .descendantColorCorrectnessBasedOnIdx;
            } else if (dependencyValues.sectionWideCheckWork) {
                createSubmitAllButton = true;
                suppressAnswerSubmitButtons = true;
                if (!dependencyValues.colorAnswersSeparately) {
                    descendantColorCorrectnessBasedOnIdx = componentIdx;
                }
            }

            return {
                setValue: {
                    createSubmitAllButton,
                    suppressAnswerSubmitButtons,
                    descendantColorCorrectnessBasedOnIdx,
                },
            };
        },
    };

    stateVariableDefinitions.suppressCheckWork = {
        forRenderer: true,
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

    stateVariableDefinitions.showCheckWork = {
        forRenderer: true,
        returnDependencies: () => ({
            createSubmitAllButton: {
                dependencyType: "stateVariable",
                variableName: "createSubmitAllButton",
            },
            suppressCheckWork: {
                dependencyType: "stateVariable",
                variableName: "suppressCheckWork",
            },
        }),
        definition({ dependencyValues }) {
            return {
                setValue: {
                    showCheckWork:
                        dependencyValues.createSubmitAllButton &&
                        !dependencyValues.suppressCheckWork,
                },
            };
        },
    };

    return stateVariableDefinitions;
}

export async function submitAllAnswers({
    component,
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
}) {
    // Each press of the section-wide check-work button counts as one attempt.
    // Once attempts are exhausted, do nothing (the answers are already disabled).
    const numAttemptsLeft = await component.stateValues.numAttemptsLeft;
    if (numAttemptsLeft < 1) {
        return;
    }

    component.coreFunctions.requestRecordEvent({
        verb: "submitted",
        object: {
            componentIdx: component.componentIdx,
            componentType: component.componentType,
        },
        result: {
            creditAchieved: await component.stateValues.creditAchievedIfSubmit,
        },
    });

    // Submit the answers before counting the attempt. If counting the attempt
    // exhausts the limit, the answers become disabled, so they must be
    // submitted (and graded) while still enabled.
    let answersToSubmit = [];
    for (let answer of await component.stateValues.answerDescendants) {
        if (!(await answer.stateValues.justSubmitted)) {
            answersToSubmit.push(answer);
        }
    }

    for (let answer of answersToSubmit) {
        await component.coreFunctions.performAction({
            componentIdx: answer.componentIdx,
            actionName: "submitAnswer",
            args: {
                actionId,
                sourceInformation,
                // Defer renderer updates to the numSubmissions update below so
                // the rendered answer validation state and attempts message
                // update together.
                skipRendererUpdate: true,
            },
        });
    }

    await component.coreFunctions.performUpdate({
        updateInstructions: [
            {
                updateType: "updateValue",
                componentIdx: component.componentIdx,
                stateVariable: "numSubmissions",
                value: (await component.stateValues.numSubmissions) + 1,
            },
        ],
        skipRendererUpdate,
    });
}

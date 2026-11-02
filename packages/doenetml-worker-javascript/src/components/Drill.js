import BlockScoredComponent from "./abstract/BlockScoredComponent";
import { nanoid } from "nanoid";
import {
    cancelTimerTick,
    essentialDefinition,
    formatTimerSeconds,
    nowMs,
    returnTimerAttributes,
    returnTimerExpireInstructions,
    returnTimerPauseInstructions,
    returnTimerRestartInstructions,
    returnTimerStateVariableDefinitions,
    scheduleTimerTick,
    timerIsPastDeadline,
} from "../utils/timer";

/**
 * Timed practice: one question at a time until `numRequired` are answered
 * correctly, or `timeLimit` runs out.
 *
 * The drill's children are a template for one question; the parser wraps them
 * in a `<_drillRound>`, which holds one live copy of them, remade with fresh
 * random values whenever `roundKey` changes (see `DrillRound.js`).
 *
 * A run: `start` sets the counts to zero and starts the clock. When every
 * answer in the current round has been submitted, `processRoundSubmission`
 * (chained to those answers' submissions) counts the round, then either ends
 * the run or shows the result for `feedbackDelay` ms before `advanceRound`
 * brings in the next question. The run ends as `succeeded` when `numCorrect`
 * reaches `numRequired`, or as `expired` when the clock runs out; `start`
 * then begins a new attempt with new questions.
 *
 * The drill is scored as one item, like a `<pretzel>`: its credit is 1 once a
 * run has succeeded, and the answers inside it don't count on their own.
 */
export default class Drill extends BlockScoredComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            start: this.start.bind(this),
            tick: this.tick.bind(this),
            ensureTicking: this.ensureTicking.bind(this),
            changedRunning: this.changedRunning.bind(this),
            processRoundSubmission: this.processRoundSubmission.bind(this),
            advanceRound: this.advanceRound.bind(this),
            submitAnswer: this.submitAnswer.bind(this),
        });
    }

    static componentType = "drill";
    static rendererType = "drill";
    static renderChildren = true;

    static componentDocs = {
        summary:
            "Timed practice that asks one question at a time, each with new random values, until enough are answered correctly or time runs out",
    };

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        Object.assign(
            attributes,
            returnTimerAttributes({
                durationAttribute: "timeLimit",
                defaultDuration: 60,
            }),
        );
        attributes.timeLimit.description =
            "Seconds allowed for each attempt at the drill.";
        // A drill always keeps counting across a reload, so a student cannot
        // stop the clock by reloading.
        delete attributes.reloadBehavior;

        attributes.numRequired = {
            createComponentOfType: "integer",
            createStateVariable: "numRequiredPreliminary",
            defaultValue: 10,
            highlighted: true,
            description:
                "How many questions must be answered correctly, within the time limit, to complete the drill.",
        };

        attributes.wrongAnswerBehavior = {
            createComponentOfType: "text",
            createStateVariable: "wrongAnswerBehavior",
            defaultValue: "next",
            toLowerCase: true,
            validValues: [
                {
                    value: "next",
                    description:
                        "After a wrong answer, briefly show that it was wrong, then go on to a new question.",
                },
                {
                    value: "retry",
                    description:
                        "After a wrong answer, stay on the same question until it is answered correctly.",
                },
            ],
            public: true,
            highlighted: true,
            description: "What happens after a question is answered wrongly.",
        };

        attributes.feedbackDelay = {
            createComponentOfType: "number",
            createStateVariable: "feedbackDelay",
            defaultValue: 800,
            public: true,
            description:
                "Milliseconds to show whether an answer was right before the next question appears.",
        };

        return attributes;
    }

    static returnChildGroups() {
        return [
            {
                group: "anything",
                componentTypes: ["_base"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        Object.assign(
            stateVariableDefinitions,
            returnTimerStateVariableDefinitions({
                durationStateVariable: "timeLimit",
            }),
        );

        // The drill starts and stops its own clock; `phase` is what authors
        // read.
        stateVariableDefinitions.running.public = false;
        delete stateVariableDefinitions.running.shadowingInstructions;

        stateVariableDefinitions.numRequired = {
            description:
                "How many questions must be answered correctly to complete the drill (at least 1).",
            public: true,
            highlighted: true,
            shadowingInstructions: { createComponentOfType: "integer" },
            forRenderer: true,
            returnDependencies: () => ({
                numRequiredPreliminary: {
                    dependencyType: "stateVariable",
                    variableName: "numRequiredPreliminary",
                },
            }),
            definition({ dependencyValues }) {
                const n = dependencyValues.numRequiredPreliminary;
                return {
                    setValue: {
                        numRequired: Number.isFinite(n)
                            ? Math.max(1, Math.round(n))
                            : 1,
                    },
                };
            },
        };

        const publicCounts = {
            attemptNumber:
                "How many times the drill has been started (0 before the first start).",
            roundNumber:
                "Which question of the current attempt is showing, counting from 1.",
            numCorrect:
                "How many questions have been answered correctly in the current (or last) attempt.",
            numAnswered:
                "How many answers have been checked in the current (or last) attempt.",
            bestNumCorrect:
                "The most questions answered correctly in any one attempt.",
        };
        for (const [name, description] of Object.entries(publicCounts)) {
            stateVariableDefinitions[name] = {
                description,
                public: true,
                shadowingInstructions: { createComponentOfType: "integer" },
                forRenderer: true,
                ...essentialDefinition(name, 0),
            };
        }
        stateVariableDefinitions.numCorrect.highlighted = true;

        // Whether the current (or last) attempt reached `numRequired`.
        stateVariableDefinitions.succeededRun = essentialDefinition(
            "succeededRun",
            false,
        );

        // "answering", or "feedback" while showing whether the answer was right.
        stateVariableDefinitions.roundStatus = {
            forRenderer: true,
            ...essentialDefinition("roundStatus", "answering"),
        };

        // Whether the last question counted was answered correctly, or null.
        stateVariableDefinitions.lastRoundCorrect = {
            forRenderer: true,
            ...essentialDefinition("lastRoundCorrect", null),
        };

        stateVariableDefinitions.phase = {
            description:
                'Where the drill is: "notStarted", "running", "succeeded" (the last attempt answered enough correctly) or "expired" (time ran out first).',
            public: true,
            highlighted: true,
            shadowingInstructions: { createComponentOfType: "text" },
            forRenderer: true,
            returnDependencies: () => ({
                running: {
                    dependencyType: "stateVariable",
                    variableName: "running",
                },
                succeededRun: {
                    dependencyType: "stateVariable",
                    variableName: "succeededRun",
                },
                hasExpired: {
                    dependencyType: "stateVariable",
                    variableName: "hasExpired",
                },
                attemptNumber: {
                    dependencyType: "stateVariable",
                    variableName: "attemptNumber",
                },
            }),
            definition({ dependencyValues }) {
                let phase = "notStarted";
                if (dependencyValues.running) {
                    phase = "running";
                } else if (dependencyValues.succeededRun) {
                    phase = "succeeded";
                } else if (
                    dependencyValues.hasExpired ||
                    dependencyValues.attemptNumber > 0
                ) {
                    phase = "expired";
                }
                return { setValue: { phase } };
            },
        };

        // Identifies the question showing; `_drillRound` remakes its copy of
        // the template whenever it changes.
        stateVariableDefinitions.roundKey = {
            returnDependencies: () => ({
                attemptNumber: {
                    dependencyType: "stateVariable",
                    variableName: "attemptNumber",
                },
                roundNumber: {
                    dependencyType: "stateVariable",
                    variableName: "roundNumber",
                },
            }),
            definition({ dependencyValues }) {
                const { attemptNumber, roundNumber } = dependencyValues;
                return {
                    setValue: {
                        roundKey:
                            attemptNumber > 0
                                ? `${attemptNumber}.${roundNumber}`
                                : null,
                    },
                };
            },
        };

        stateVariableDefinitions.timeText = {
            forRenderer: true,
            returnDependencies: () => ({
                timeRemaining: {
                    dependencyType: "stateVariable",
                    variableName: "timeRemaining",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    timeText: formatTimerSeconds(
                        dependencyValues.timeRemaining,
                    ),
                },
            }),
        };

        stateVariableDefinitions.elapsedText = {
            forRenderer: true,
            returnDependencies: () => ({
                elapsed: {
                    dependencyType: "stateVariable",
                    variableName: "elapsed",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    elapsedText: formatTimerSeconds(dependencyValues.elapsed),
                },
            }),
        };

        // The answers in the question showing.
        stateVariableDefinitions.roundAnswerIdxs = {
            chainActionOnActionOfStateVariableTargets: {
                triggeredAction: "processRoundSubmission",
            },
            returnDependencies: () => ({
                answers: {
                    dependencyType: "descendant",
                    componentTypes: ["answer"],
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    roundAnswerIdxs: dependencyValues.answers.map(
                        (answer) => answer.componentIdx,
                    ),
                },
            }),
            markStale: () => ({ updateActionChaining: true }),
        };

        stateVariableDefinitions.roundAnswers = {
            returnDependencies: () => ({
                answers: {
                    dependencyType: "descendant",
                    componentTypes: ["answer"],
                    variableNames: [
                        "creditAchieved",
                        "responseHasBeenSubmitted",
                    ],
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    roundAnswers: dependencyValues.answers.map((answer) => ({
                        componentIdx: answer.componentIdx,
                        creditAchieved: answer.stateValues.creditAchieved,
                        submitted: answer.stateValues.responseHasBeenSubmitted,
                    })),
                },
            }),
        };

        // The answers in a question can be used only while it is being
        // answered: not before a run starts, after it ends, or while the
        // result of the last answer is showing.
        stateVariableDefinitions.disabled = {
            description:
                "Whether the questions in the drill are closed to answers, as they are except while a question is being answered.",
            public: true,
            shadowingInstructions: { createComponentOfType: "boolean" },
            forRenderer: true,
            returnDependencies: () => ({
                disabledOriginal: {
                    dependencyType: "stateVariable",
                    variableName: "disabledOriginal",
                },
                phase: {
                    dependencyType: "stateVariable",
                    variableName: "phase",
                },
                roundStatus: {
                    dependencyType: "stateVariable",
                    variableName: "roundStatus",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    disabled:
                        dependencyValues.disabledOriginal ||
                        dependencyValues.phase !== "running" ||
                        dependencyValues.roundStatus !== "answering",
                },
            }),
        };

        stateVariableDefinitions.canStart = {
            forRenderer: true,
            returnDependencies: () => ({
                disabledOriginal: {
                    dependencyType: "stateVariable",
                    variableName: "disabledOriginal",
                },
                phase: {
                    dependencyType: "stateVariable",
                    variableName: "phase",
                },
                numAttemptsLeft: {
                    dependencyType: "stateVariable",
                    variableName: "numAttemptsLeft",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    canStart:
                        !dependencyValues.disabledOriginal &&
                        dependencyValues.phase !== "running" &&
                        dependencyValues.numAttemptsLeft > 0,
                },
            }),
        };

        // A drill is never submitted as a whole; its credit is set when a run
        // ends.
        stateVariableDefinitions.creditAchievedIfSubmit = {
            returnDependencies: () => ({
                creditAchieved: {
                    dependencyType: "stateVariable",
                    variableName: "creditAchieved",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    creditAchievedIfSubmit: dependencyValues.creditAchieved,
                },
            }),
        };

        return stateVariableDefinitions;
    }

    _update(stateVariable, value) {
        return {
            updateType: "updateValue",
            componentIdx: this.componentIdx,
            stateVariable,
            value,
        };
    }

    _event(verb, context = {}) {
        return {
            verb,
            object: {
                componentIdx: this.componentIdx,
                componentType: this.componentType,
            },
            context,
        };
    }

    /** Begin a new attempt: counts to zero, new questions, full time. */
    async start({
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    } = {}) {
        if (!(await this.stateValues.canStart)) {
            return;
        }
        await this._cancelAdvance();
        const now = nowMs();
        const attemptNumber = (await this.stateValues.attemptNumber) + 1;
        await this.coreFunctions.performUpdate({
            updateInstructions: [
                ...returnTimerRestartInstructions(this, now),
                this._update("attemptNumber", attemptNumber),
                this._update("roundNumber", 1),
                this._update("numCorrect", 0),
                this._update("numAnswered", 0),
                this._update("succeededRun", false),
                this._update("roundStatus", "answering"),
                this._update("lastRoundCorrect", null),
            ],
            actionId,
            sourceInformation,
            skipRendererUpdate,
            event: this._event("played", { attemptNumber }),
        });
        await scheduleTimerTick(this, now);
    }

    /**
     * Refresh the clock, or end the run if time is up. As for `<timer>`, a
     * scheduled tick carries its `tickId` and schedules the next one.
     */
    async tick({
        tickId,
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    } = {}) {
        if (tickId !== undefined && tickId !== this._tickId) {
            return;
        }
        if ((await this.stateValues.startedAt) === null) {
            return;
        }
        const now = nowMs();
        if (await timerIsPastDeadline(this, now)) {
            await this._endRun({
                outcome: "expired",
                actionId,
                sourceInformation,
                skipRendererUpdate,
            });
            return;
        }
        await this.coreFunctions.performUpdate({
            updateInstructions: [this._update("clockNow", now)],
            actionId,
            sourceInformation,
            skipRendererUpdate,
            doNotSave: true,
            canSkipUpdatingRenderer: true,
        });
        if (tickId !== undefined) {
            await scheduleTimerTick(this, now);
        }
    }

    /** See `<timer>`'s `ensureTicking`. */
    async ensureTicking({
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    } = {}) {
        if (
            this.flags.readOnly ||
            (await this.stateValues.startedAt) === null
        ) {
            return;
        }
        await this.tick({ actionId, sourceInformation, skipRendererUpdate });
        if ((await this.stateValues.startedAt) !== null) {
            await scheduleTimerTick(this, nowMs());
        }
    }

    /**
     * On load (`previousValues.running` undefined), resume a run that was in
     * progress: end it if its time ran out while the page was closed,
     * otherwise keep the clock ticking and finish an advance to the next
     * question that the reload interrupted.
     */
    async changedRunning({
        stateValues,
        previousValues,
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        if (!stateValues.running) {
            await cancelTimerTick(this);
        }
        if (previousValues.running !== undefined || this.flags.readOnly) {
            return;
        }
        if (!stateValues.running) {
            return;
        }
        const updateArgs = { actionId, sourceInformation, skipRendererUpdate };
        const now = nowMs();
        if (await timerIsPastDeadline(this, now)) {
            await this._endRun({ outcome: "expired", ...updateArgs });
            return;
        }
        await this.tick(updateArgs);
        await scheduleTimerTick(this, now);
        if ((await this.stateValues.roundStatus) === "feedback") {
            await this._scheduleAdvance();
        }
    }

    /**
     * Chained to the submissions of the answers in the question showing.
     * Once all of them have been submitted, count the round.
     */
    async processRoundSubmission({
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    } = {}) {
        if (
            (await this.stateValues.phase) !== "running" ||
            (await this.stateValues.roundStatus) !== "answering"
        ) {
            return;
        }
        const updateArgs = { actionId, sourceInformation, skipRendererUpdate };

        // An answer checked after the deadline, before a tick noticed it,
        // does not count.
        if (await timerIsPastDeadline(this, nowMs())) {
            await this._endRun({ outcome: "expired", ...updateArgs });
            return;
        }

        const answers = await this.stateValues.roundAnswers;
        if (answers.length === 0 || answers.some((a) => !a.submitted)) {
            return;
        }
        const correct = answers.every((a) => a.creditAchieved >= 1);
        const numAnswered = (await this.stateValues.numAnswered) + 1;

        if (
            !correct &&
            (await this.stateValues.wrongAnswerBehavior) === "retry"
        ) {
            await this.coreFunctions.performUpdate({
                updateInstructions: [
                    this._update("numAnswered", numAnswered),
                    this._update("lastRoundCorrect", false),
                ],
                ...updateArgs,
            });
            return;
        }

        const numCorrect =
            (await this.stateValues.numCorrect) + (correct ? 1 : 0);
        const instructions = [
            this._update("numAnswered", numAnswered),
            this._update("numCorrect", numCorrect),
            this._update("lastRoundCorrect", correct),
        ];

        if (numCorrect >= (await this.stateValues.numRequired)) {
            await this._endRun({
                outcome: "succeeded",
                numCorrect,
                instructions,
                ...updateArgs,
            });
            return;
        }

        instructions.push(this._update("roundStatus", "feedback"));
        await this.coreFunctions.performUpdate({
            updateInstructions: instructions,
            ...updateArgs,
        });

        // The next question replaces this one, answers and all, so it comes
        // in a separate action rather than inside this answer's submission.
        await this._scheduleAdvance();
    }

    /** Bring in the next question, after the result has shown. */
    async advanceRound({
        advanceId,
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    } = {}) {
        if (advanceId !== undefined && advanceId !== this._advanceId) {
            return;
        }
        this._advanceId = undefined;
        if (
            (await this.stateValues.phase) !== "running" ||
            (await this.stateValues.roundStatus) !== "feedback"
        ) {
            return;
        }
        const updateArgs = { actionId, sourceInformation, skipRendererUpdate };
        if (await timerIsPastDeadline(this, nowMs())) {
            await this._endRun({ outcome: "expired", ...updateArgs });
            return;
        }
        await this.coreFunctions.performUpdate({
            updateInstructions: [
                this._update(
                    "roundNumber",
                    (await this.stateValues.roundNumber) + 1,
                ),
                this._update("roundStatus", "answering"),
                this._update("lastRoundCorrect", null),
            ],
            ...updateArgs,
        });
    }

    /**
     * A drill is not submitted as a whole (its credit is set when a run
     * ends), so a section-wide check-work button leaves it alone.
     */
    async submitAnswer() {}

    async _scheduleAdvance() {
        await this._cancelAdvance();
        const advanceId = nanoid();
        this._advanceId = advanceId;
        await this.coreFunctions.requestAnimationFrame({
            action: {
                actionName: "advanceRound",
                componentIdx: this.componentIdx,
            },
            delay: Math.max(0, (await this.stateValues.feedbackDelay) || 0),
            animationId: advanceId,
            actionArgs: { advanceId },
        });
    }

    async _cancelAdvance() {
        if (this._advanceId !== undefined) {
            await this.coreFunctions.cancelAnimationFrame(this._advanceId);
            this._advanceId = undefined;
        }
    }

    /**
     * End the run as `succeeded` or `expired`, record it as a submission of
     * the drill, then run the actions chained to the drill.
     */
    async _endRun({
        outcome,
        numCorrect,
        instructions = [],
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        await cancelTimerTick(this);
        await this._cancelAdvance();

        const succeeded = outcome === "succeeded";
        if (numCorrect === undefined) {
            numCorrect = await this.stateValues.numCorrect;
        }
        const creditAchieved = Math.max(
            await this.stateValues.creditAchieved,
            succeeded ? 1 : 0,
        );

        const updateInstructions = [
            ...instructions,
            ...(succeeded
                ? await returnTimerPauseInstructions(this, nowMs())
                : await returnTimerExpireInstructions(this)),
            this._update("succeededRun", succeeded),
            this._update("roundStatus", "answering"),
            this._update(
                "bestNumCorrect",
                Math.max(await this.stateValues.bestNumCorrect, numCorrect),
            ),
            this._update("creditAchieved", creditAchieved),
            this._update("responseHasBeenSubmitted", true),
            this._update(
                "numSubmissions",
                (await this.stateValues.numSubmissions) + 1,
            ),
            {
                updateType: "recordItemSubmission",
                componentNumber: await this.stateValues.inComponentNumber,
                submittedComponent: this.componentIdx,
                response: [numCorrect],
                responseText: [String(numCorrect)],
                creditAchieved,
            },
        ];

        await this.coreFunctions.performUpdate({
            updateInstructions,
            actionId,
            sourceInformation,
            skipRendererUpdate,
            event: this._event(succeeded ? "completed" : "interacted", {
                outcome,
                numCorrect,
                numRequired: await this.stateValues.numRequired,
                attemptNumber: await this.stateValues.attemptNumber,
            }),
        });

        await this.coreFunctions.triggerChainedActions({
            componentIdx: this.componentIdx,
            actionId,
            sourceInformation,
            skipRendererUpdate,
        });
    }
}

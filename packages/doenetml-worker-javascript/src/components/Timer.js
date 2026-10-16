import InlineComponent from "./abstract/InlineComponent";
import {
    cancelTimerTick,
    nowMs,
    returnTimerAttributes,
    returnTimerExpireInstructions,
    returnTimerPauseInstructions,
    returnTimerResetInstructions,
    returnTimerRestartInstructions,
    returnTimerStartInstructions,
    returnTimerStateVariableDefinitions,
    scheduleTimerTick,
    timerIsPastDeadline,
} from "../utils/timer";

export default class Timer extends InlineComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            start: this.start.bind(this),
            pause: this.pause.bind(this),
            reset: this.reset.bind(this),
            restart: this.restart.bind(this),
            tick: this.tick.bind(this),
            ensureTicking: this.ensureTicking.bind(this),
            changedRunning: this.changedRunning.bind(this),
        });
    }

    static componentType = "timer";
    static rendererType = "timer";

    static componentDocs = {
        summary:
            "A countdown clock measured in real time, which keeps counting in a background tab and across a reload",
    };

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        Object.assign(
            attributes,
            returnTimerAttributes({
                durationAttribute: "duration",
                defaultDuration: 60,
            }),
        );

        attributes.autoStart = {
            createComponentOfType: "boolean",
            createStateVariable: "autoStart",
            defaultValue: false,
            public: true,
            highlighted: true,
            description:
                "Whether the clock starts by itself the first time the page loads.",
        };

        attributes.displayMode = {
            createComponentOfType: "text",
            createStateVariable: "displayMode",
            defaultValue: "remaining",
            toLowerCase: true,
            validValues: [
                {
                    value: "remaining",
                    description: "Show the time left on the countdown.",
                },
                {
                    value: "elapsed",
                    description: "Show the time counted so far.",
                },
            ],
            public: true,
            description: "Which time the clock shows.",
        };

        attributes.format = {
            createComponentOfType: "text",
            createStateVariable: "format",
            defaultValue: "m:ss",
            toLowerCase: true,
            validValues: [
                {
                    value: "m:ss",
                    description:
                        "Minutes and seconds, such as 1:05 (hours are added when needed, such as 1:02:05).",
                },
                {
                    value: "s",
                    description: "Whole seconds only, such as 65.",
                },
            ],
            public: true,
            description: "How the time is written.",
        };

        attributes.showControls = {
            createComponentOfType: "boolean",
            createStateVariable: "showControls",
            defaultValue: true,
            public: true,
            forRenderer: true,
            highlighted: true,
            description:
                "Whether to show Start/Pause and Reset buttons beside the clock.",
        };

        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        Object.assign(
            stateVariableDefinitions,
            returnTimerStateVariableDefinitions({
                durationStateVariable: "duration",
            }),
        );

        stateVariableDefinitions.text = {
            description:
                "The time the clock shows, written in its `format`, such as 1:05.",
            public: true,
            shadowingInstructions: { createComponentOfType: "text" },
            forRenderer: true,
            returnDependencies: () => ({
                timeRemaining: {
                    dependencyType: "stateVariable",
                    variableName: "timeRemaining",
                },
                elapsed: {
                    dependencyType: "stateVariable",
                    variableName: "elapsed",
                },
                displayMode: {
                    dependencyType: "stateVariable",
                    variableName: "displayMode",
                },
                format: {
                    dependencyType: "stateVariable",
                    variableName: "format",
                },
            }),
            definition({ dependencyValues }) {
                const seconds =
                    dependencyValues.displayMode === "elapsed"
                        ? dependencyValues.elapsed
                        : dependencyValues.timeRemaining;
                return {
                    setValue: {
                        text: formatSeconds(seconds, dependencyValues.format),
                    },
                };
            },
        };

        stateVariableDefinitions.paused = {
            description:
                "Whether the clock has been stopped partway through and can be resumed.",
            public: true,
            shadowingInstructions: { createComponentOfType: "boolean" },
            forRenderer: true,
            returnDependencies: () => ({
                running: {
                    dependencyType: "stateVariable",
                    variableName: "running",
                },
                hasExpired: {
                    dependencyType: "stateVariable",
                    variableName: "hasExpired",
                },
                elapsedBefore: {
                    dependencyType: "stateVariable",
                    variableName: "elapsedBefore",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    paused:
                        !dependencyValues.running &&
                        !dependencyValues.hasExpired &&
                        dependencyValues.elapsedBefore > 0,
                },
            }),
        };

        return stateVariableDefinitions;
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

    /**
     * Start or resume the clock. An expired clock starts over from the full
     * duration, so one Start button also serves as "try again".
     */
    async start({
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    } = {}) {
        if ((await this.stateValues.startedAt) !== null) {
            // already counting
            return;
        }
        const now = nowMs();
        await this.coreFunctions.performUpdate({
            updateInstructions: await returnTimerStartInstructions(this, now),
            actionId,
            sourceInformation,
            skipRendererUpdate,
            event: this._event("played", {
                elapsed: await this.stateValues.elapsed,
            }),
        });
        await scheduleTimerTick(this, now);
    }

    async pause({
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    } = {}) {
        if ((await this.stateValues.startedAt) === null) {
            return;
        }
        const now = nowMs();
        if (await timerIsPastDeadline(this, now)) {
            await this._expire({
                actionId,
                sourceInformation,
                skipRendererUpdate,
            });
            return;
        }
        await cancelTimerTick(this);
        await this.coreFunctions.performUpdate({
            updateInstructions: await returnTimerPauseInstructions(this, now),
            actionId,
            sourceInformation,
            skipRendererUpdate,
            event: this._event("paused", {
                elapsed: await this.stateValues.elapsed,
            }),
        });
    }

    async reset({
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    } = {}) {
        await cancelTimerTick(this);
        await this.coreFunctions.performUpdate({
            updateInstructions: returnTimerResetInstructions(this),
            actionId,
            sourceInformation,
            skipRendererUpdate,
            event: this._event("interacted", { action: "reset" }),
        });
    }

    async restart({
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    } = {}) {
        const now = nowMs();
        await this.coreFunctions.performUpdate({
            updateInstructions: returnTimerRestartInstructions(this, now),
            actionId,
            sourceInformation,
            skipRendererUpdate,
            event: this._event("played", { elapsed: 0 }),
        });
        await scheduleTimerTick(this, now);
    }

    /**
     * Refresh the displayed time, or expire the clock if its deadline has
     * passed. A scheduled tick carries its `tickId` and schedules the next
     * one; a tick from a superseded schedule is ignored. Calling `tick` with
     * no `tickId` refreshes once without scheduling.
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
            await this._expire({
                actionId,
                sourceInformation,
                skipRendererUpdate,
            });
            return;
        }
        await this.coreFunctions.performUpdate({
            updateInstructions: [
                {
                    updateType: "updateValue",
                    componentIdx: this.componentIdx,
                    stateVariable: "clockNow",
                    value: now,
                },
            ],
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

    /**
     * Make sure a running clock has a tick scheduled. The renderer calls this
     * when it mounts, because ticks requested while the viewer was rebuilding
     * the core are dropped.
     */
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
     * Runs when `running` changes, and once when the page loads (with
     * `previousValues.running` undefined).
     *
     * On load it applies `reloadBehavior` and `autoStart`. Afterwards it
     * brings the rest of the clock into line when an author sets `running`
     * directly, such as with `<updateValue target="$t.running">`, since that
     * changes `running` alone.
     */
    async changedRunning({
        stateValues,
        previousValues,
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        if (this.flags.readOnly) {
            // show the saved state without counting
            return;
        }

        const running = stateValues.running;
        const wasRunning = previousValues.running;
        const startedAt = await this.stateValues.startedAt;
        const now = nowMs();
        const updateArgs = { actionId, sourceInformation, skipRendererUpdate };

        if (wasRunning === undefined) {
            if (running) {
                if ((await this.stateValues.reloadBehavior) === "reset") {
                    await this.coreFunctions.performUpdate({
                        updateInstructions: returnTimerResetInstructions(this),
                        ...updateArgs,
                    });
                } else if (await timerIsPastDeadline(this, now)) {
                    await this._expire(updateArgs);
                } else {
                    await this.tick(updateArgs);
                    await scheduleTimerTick(this, now);
                }
            } else if (
                (await this.stateValues.autoStart) &&
                !(await this.stateValues.hasStarted)
            ) {
                await this.start(updateArgs);
            }
            return;
        }

        if (running && !wasRunning) {
            if (startedAt === null) {
                // `running` was set directly: start counting now
                await this.coreFunctions.performUpdate({
                    updateInstructions: await returnTimerStartInstructions(
                        this,
                        now,
                    ),
                    ...updateArgs,
                    event: this._event("played", {
                        elapsed: await this.stateValues.elapsed,
                    }),
                });
                await scheduleTimerTick(this, now);
            }
        } else if (!running && wasRunning) {
            await cancelTimerTick(this);
            if (startedAt !== null) {
                // `running` was cleared directly: keep the time counted
                if (await timerIsPastDeadline(this, now)) {
                    await this._expire(updateArgs);
                } else {
                    await this.coreFunctions.performUpdate({
                        updateInstructions: await returnTimerPauseInstructions(
                            this,
                            now,
                        ),
                        ...updateArgs,
                        event: this._event("paused", {
                            elapsed: await this.stateValues.elapsed,
                        }),
                    });
                }
            }
        }
    }

    /**
     * Stop at zero, then run the actions chained to this timer, so
     * `triggerWith="$timer"` means "when time runs out". Starting and
     * pausing deliberately do not trigger them.
     */
    async _expire({ actionId, sourceInformation = {}, skipRendererUpdate }) {
        await cancelTimerTick(this);
        await this.coreFunctions.performUpdate({
            updateInstructions: await returnTimerExpireInstructions(this),
            actionId,
            sourceInformation,
            skipRendererUpdate,
            event: this._event("completed", {
                duration: await this.stateValues.duration,
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

/**
 * `seconds` as `m:ss` (`h:mm:ss` from an hour up) or as plain seconds.
 */
function formatSeconds(seconds, format) {
    if (!Number.isFinite(seconds)) {
        seconds = 0;
    }
    seconds = Math.max(0, Math.round(seconds));
    if (format === "s") {
        return String(seconds);
    }
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = String(seconds % 60).padStart(2, "0");
    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, "0")}:${secs}`;
    }
    return `${minutes}:${secs}`;
}

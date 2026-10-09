import { nanoid } from "nanoid";

/**
 * Shared clock for components that count down a fixed duration.
 *
 * Time is measured from timestamps, never by counting ticks. The saved state
 * is when the current running stretch began (`startedAt`) and how much time
 * earlier stretches used (`elapsedBefore`); everything else is derived from
 * those and the current time. A tick only refreshes `clockNow` so the display
 * moves, which means a late, throttled or missed tick (a background tab, a
 * busy worker) delays the display but never the time itself, and every action
 * re-checks the deadline against the clock rather than trusting the last tick.
 *
 * `clockNow` is written with `doNotSave`, so it never reaches saved state;
 * the deadline survives a reload through `startedAt` alone.
 */

/**
 * The one place the clock is read, so tests can fake it with
 * `vi.spyOn(Date, "now")`.
 */
export function nowMs() {
    return Date.now();
}

/**
 * Attributes shared by every component built on this clock.
 *
 * `durationAttribute` names the attribute holding the length in seconds
 * (`duration` on `<timer>`).
 */
export function returnTimerAttributes({
    durationAttribute = "duration",
    defaultDuration = 60,
} = {}) {
    return {
        [durationAttribute]: {
            createComponentOfType: "number",
            createStateVariable: durationAttribute,
            defaultValue: defaultDuration,
            public: true,
            highlighted: true,
            description: "Length of the countdown, in seconds.",
        },
        reloadBehavior: {
            createComponentOfType: "text",
            createStateVariable: "reloadBehavior",
            defaultValue: "continue",
            toLowerCase: true,
            validValues: [
                {
                    value: "continue",
                    description:
                        "Keep counting while the page is closed, so reloading neither pauses nor restarts the clock. A deadline that passed while the page was closed expires on load.",
                },
                {
                    value: "reset",
                    description:
                        "Return to the full duration, not running, whenever the page is loaded.",
                },
            ],
            public: true,
            description: "What a running clock does when the page is reloaded.",
        },
    };
}

/**
 * A state variable that holds a saved value, `defaultValue` until set.
 */
export function essentialDefinition(variableName, defaultValue) {
    return {
        hasEssential: true,
        defaultValue,
        returnDependencies: () => ({}),
        definition: () => ({
            useEssentialOrDefaultValue: { [variableName]: true },
        }),
        inverseDefinition: ({ desiredStateVariableValues }) => ({
            success: true,
            instructions: [
                {
                    setEssentialValue: variableName,
                    value: desiredStateVariableValues[variableName],
                },
            ],
        }),
    };
}

/**
 * State variables of the clock. `durationStateVariable` is the state variable
 * created by the duration attribute from {@link returnTimerAttributes}.
 */
export function returnTimerStateVariableDefinitions({
    durationStateVariable = "duration",
} = {}) {
    const stateVariableDefinitions = {};

    stateVariableDefinitions.durationMs = {
        returnDependencies: () => ({
            duration: {
                dependencyType: "stateVariable",
                variableName: durationStateVariable,
            },
        }),
        definition({ dependencyValues }) {
            const duration = dependencyValues.duration;
            const durationMs =
                Number.isFinite(duration) && duration > 0 ? duration * 1000 : 0;
            return { setValue: { durationMs } };
        },
    };

    // Epoch milliseconds when the current running stretch began, or null when
    // the clock is not running.
    stateVariableDefinitions.startedAt = essentialDefinition("startedAt", null);

    // Milliseconds used by running stretches before the current one.
    stateVariableDefinitions.elapsedBefore = essentialDefinition(
        "elapsedBefore",
        0,
    );

    // The time of the last tick. Only ever written with `doNotSave`.
    stateVariableDefinitions.clockNow = essentialDefinition("clockNow", null);

    // Whether the clock has ever been started, so `autoStart` happens once.
    stateVariableDefinitions.hasStarted = essentialDefinition(
        "hasStarted",
        false,
    );

    // Set only by the clock itself; `expired` is its read-only public face.
    stateVariableDefinitions.hasExpired = essentialDefinition(
        "hasExpired",
        false,
    );

    stateVariableDefinitions.expired = {
        description: "Whether the countdown has run out.",
        public: true,
        highlighted: true,
        shadowingInstructions: { createComponentOfType: "boolean" },
        forRenderer: true,
        returnDependencies: () => ({
            hasExpired: {
                dependencyType: "stateVariable",
                variableName: "hasExpired",
            },
        }),
        definition: ({ dependencyValues }) => ({
            setValue: { expired: dependencyValues.hasExpired },
        }),
    };

    stateVariableDefinitions.running = {
        description:
            "Whether the clock is counting. Setting it to true starts or resumes the clock; setting it to false pauses it.",
        public: true,
        highlighted: true,
        shadowingInstructions: { createComponentOfType: "boolean" },
        forRenderer: true,
        triggerActionOnChange: "changedRunning",
        ...essentialDefinition("running", false),
    };

    stateVariableDefinitions.elapsedMs = {
        returnDependencies: () => ({
            durationMs: {
                dependencyType: "stateVariable",
                variableName: "durationMs",
            },
            startedAt: {
                dependencyType: "stateVariable",
                variableName: "startedAt",
            },
            elapsedBefore: {
                dependencyType: "stateVariable",
                variableName: "elapsedBefore",
            },
            clockNow: {
                dependencyType: "stateVariable",
                variableName: "clockNow",
            },
            hasExpired: {
                dependencyType: "stateVariable",
                variableName: "hasExpired",
            },
        }),
        definition({ dependencyValues }) {
            const { durationMs, startedAt, clockNow, hasExpired } =
                dependencyValues;
            if (hasExpired) {
                return { setValue: { elapsedMs: durationMs } };
            }
            let elapsedMs = dependencyValues.elapsedBefore;
            if (startedAt !== null && clockNow !== null) {
                // A clock that went backwards counts as no time passing.
                elapsedMs += Math.max(0, clockNow - startedAt);
            }
            elapsedMs = Math.min(durationMs, Math.max(0, elapsedMs));
            return { setValue: { elapsedMs } };
        },
    };

    stateVariableDefinitions.timeRemaining = {
        description:
            "Whole seconds left on the countdown, rounded up, so it reaches 0 only when the countdown runs out.",
        public: true,
        highlighted: true,
        shadowingInstructions: { createComponentOfType: "number" },
        returnDependencies: () => ({
            durationMs: {
                dependencyType: "stateVariable",
                variableName: "durationMs",
            },
            elapsedMs: {
                dependencyType: "stateVariable",
                variableName: "elapsedMs",
            },
        }),
        definition: ({ dependencyValues }) => ({
            setValue: {
                timeRemaining: Math.ceil(
                    (dependencyValues.durationMs - dependencyValues.elapsedMs) /
                        1000,
                ),
            },
        }),
    };

    stateVariableDefinitions.elapsed = {
        description: "Whole seconds the clock has counted, rounded down.",
        public: true,
        shadowingInstructions: { createComponentOfType: "number" },
        returnDependencies: () => ({
            elapsedMs: {
                dependencyType: "stateVariable",
                variableName: "elapsedMs",
            },
        }),
        definition: ({ dependencyValues }) => ({
            setValue: {
                elapsed: Math.floor(dependencyValues.elapsedMs / 1000),
            },
        }),
    };

    return stateVariableDefinitions;
}

/**
 * Milliseconds the clock will have counted at time `now`, without the cap at
 * the duration. Reads saved state only, so it is right even when no tick has
 * run since the clock started.
 *
 * The clock is counting exactly when `startedAt` is set. That is the same as
 * `running` except in the moment after an author sets `running` directly,
 * before `changedRunning` brings `startedAt` into line: the stretch since
 * `startedAt` still counts then, so a pause folds it in rather than losing it.
 */
export async function timerElapsedMsAt(component, now) {
    let elapsedMs = await component.stateValues.elapsedBefore;
    const startedAt = await component.stateValues.startedAt;
    if (startedAt !== null) {
        elapsedMs += Math.max(0, now - startedAt);
    }
    return elapsedMs;
}

export async function timerIsPastDeadline(component, now) {
    if (
        (await component.stateValues.startedAt) === null ||
        (await component.stateValues.hasExpired)
    ) {
        return false;
    }
    return (
        (await timerElapsedMsAt(component, now)) >=
        (await component.stateValues.durationMs)
    );
}

function update(component, stateVariable, value) {
    return {
        updateType: "updateValue",
        componentIdx: component.componentIdx,
        stateVariable,
        value,
    };
}

/**
 * Start (or resume) counting at `now`. An expired clock starts over from the
 * full duration.
 */
export async function returnTimerStartInstructions(component, now) {
    const instructions = [
        update(component, "running", true),
        update(component, "startedAt", now),
        update(component, "clockNow", now),
        update(component, "hasStarted", true),
    ];
    if (await component.stateValues.hasExpired) {
        instructions.push(
            update(component, "hasExpired", false),
            update(component, "elapsedBefore", 0),
        );
    }
    return instructions;
}

/** Stop counting at `now`, keeping the time used so far. */
export async function returnTimerPauseInstructions(component, now) {
    return [
        update(component, "running", false),
        update(component, "startedAt", null),
        update(
            component,
            "elapsedBefore",
            Math.min(
                await timerElapsedMsAt(component, now),
                await component.stateValues.durationMs,
            ),
        ),
        update(component, "clockNow", now),
    ];
}

/** Back to the full duration, not running. */
export function returnTimerResetInstructions(component) {
    return [
        update(component, "running", false),
        update(component, "startedAt", null),
        update(component, "elapsedBefore", 0),
        update(component, "hasExpired", false),
        update(component, "clockNow", null),
    ];
}

/** Restart from the full duration at `now`, running. */
export function returnTimerRestartInstructions(component, now) {
    return [
        update(component, "running", true),
        update(component, "startedAt", now),
        update(component, "elapsedBefore", 0),
        update(component, "hasExpired", false),
        update(component, "clockNow", now),
        update(component, "hasStarted", true),
    ];
}

/** Stop at zero. */
export async function returnTimerExpireInstructions(component) {
    return [
        update(component, "running", false),
        update(component, "startedAt", null),
        update(
            component,
            "elapsedBefore",
            await component.stateValues.durationMs,
        ),
        update(component, "hasExpired", true),
    ];
}

/**
 * Schedule the next tick of `component`'s clock, replacing any tick already
 * scheduled. Each tick carries the id it was scheduled under, and the
 * component's `tick` action ignores one whose id is no longer current.
 *
 * The delay lands just after the next whole-second boundary of the time
 * remaining, so the displayed seconds change on the beat.
 */
export async function scheduleTimerTick(component, now) {
    await cancelTimerTick(component);

    const remainingMs =
        (await component.stateValues.durationMs) -
        (await timerElapsedMsAt(component, now));
    const delay = Math.max(0, remainingMs % 1000 || 1000) + 15;

    const tickId = nanoid();
    component._tickId = tickId;
    await component.coreFunctions.requestAnimationFrame({
        action: { actionName: "tick", componentIdx: component.componentIdx },
        delay,
        animationId: tickId,
        actionArgs: { tickId },
    });
}

export async function cancelTimerTick(component) {
    if (component._tickId !== undefined) {
        await component.coreFunctions.cancelAnimationFrame(component._tickId);
        component._tickId = undefined;
    }
}

/**
 * `seconds` as `m:ss` (`h:mm:ss` from an hour up) or as plain seconds.
 */
export function formatTimerSeconds(seconds, format = "m:ss") {
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

// Cypress component support file for DoenetML tests.
import { mount } from "cypress/react";

declare global {
    namespace Cypress {
        interface Chainable {
            mount: typeof mount;
        }
    }
}

Cypress.Commands.add("mount", mount);

// --- Boot diagnostics for failing tests (#1719) ----------------------------
//
// Most of what these specs wait on is the viewer putting content on screen,
// which means booting a core worker: spawning it, compiling the WASM, and
// running the init round-trips that the boot ladder time-boxes. When one of
// those waits runs out, the failure Cypress reports says only that the content
// never appeared — never why. #1719's leading explanation is that the boot
// ladder tripped its handshake watchdog and was still recovering when the wait
// expired, but that stays a hypothesis: no failing run on record carries any
// boot telemetry to check it against, because nothing the browser logs reaches
// the terminal under `cypress run`.
//
// So buffer the app's warnings and errors as each test runs and, when the test
// fails, hand them to the `printAppConsole` task in `cypress.config.ts`, which
// prints them from the runner process where CI logs pick them up.
//
// A failing test prints its transcript even when that transcript is empty. A
// watchdog that fires says so through `console.warn`, so a failing boot that
// logged nothing means it never fired — which is the observation that would
// kill the hypothesis rather than the absence of one. Printed as an explicit
// "logged nothing", that reads as an answer; printed as no block at all it
// would be indistinguishable from diagnostics that never ran.
//
// Passing tests print nothing at all, and the task is only ever reached from a
// test that has already failed, so it cannot turn a passing test red.

/** Enough for a full boot ladder's narration without flooding the log. */
const MAX_BUFFERED_MESSAGES = 100;

let bufferedMessages: string[] = [];
/**
 * How many messages the cap turned away since the last flush. Counted rather
 * than discarded silently: a boot that retried its way through the whole
 * ladder is exactly the failure most likely to hit the cap, and a truncated
 * transcript that does not say it is truncated invites reading "the warnings
 * stop here" as "the app stopped talking here".
 */
let droppedMessageCount = 0;

/**
 * Render one `console.warn`/`console.error` argument as a line of text.
 *
 * Errors are reduced to name and message on purpose: the boot ladder logs its
 * failures as `console.warn(summary, err)`, and a bundled Vite stack adds
 * dozens of lines of transformed frames that say nothing the summary has not
 * already said — while eating the message cap that the rest of the ladder's
 * narration needs.
 */
function formatConsoleArg(arg: unknown): string {
    if (arg instanceof Error) {
        return `${arg.name}: ${arg.message}`;
    }
    if (typeof arg === "string") {
        return arg;
    }
    try {
        // `JSON.stringify` returns `undefined` — not the string
        // `"undefined"` — for `undefined`, functions and symbols, despite its
        // `string` return type. Falling through to `String` keeps those
        // arguments visible instead of leaving an empty slot in the joined
        // line.
        return JSON.stringify(arg) ?? String(arg);
    } catch {
        // Circular structures, DOM nodes, null-prototype objects: neither
        // serializable nor necessarily even coercible to a string. This
        // wrapper sits in front of every warning the app makes in every spec
        // of the suite, so it must never turn one into an exception thrown
        // inside product code.
        return `[unprintable ${typeof arg}]`;
    }
}

// Wrapped once, at support-file load, rather than per test: the component
// runner reuses this window across the whole spec, and a boot begun by one
// test can still be talking during the next. Specs that stub `console.warn`
// themselves replace this wrapper for their own test and Cypress restores it
// afterwards — their messages are simply not buffered, which is the same
// bargain those specs already made with the real console.
for (const level of ["warn", "error"] as const) {
    const original = window.console[level].bind(window.console);
    window.console[level] = (...args: unknown[]) => {
        if (bufferedMessages.length < MAX_BUFFERED_MESSAGES) {
            bufferedMessages.push(
                `[${level}] ${args.map(formatConsoleArg).join(" ")}`,
            );
        } else {
            droppedMessageCount++;
        }
        original(...args);
    };
}

// Root-level on purpose: Mocha unwinds `afterEach` hooks innermost-first, so
// this runs after whatever cleanup a spec declares of its own and buffers
// anything those hooks log too. It also runs — with `this.currentTest.state`
// already `"failed"` — when the failure came from a spec's `beforeEach` rather
// than from the test body, which is what covers the specs that mount inside a
// hook (`DoenetEditor.diagnosticsPanelInset`).
afterEach(function () {
    const messages = bufferedMessages;
    const dropped = droppedMessageCount;
    // Emptied on the way out rather than on the way in, so that a boot still
    // talking after its test ended is attributed to the next test — the one
    // whose failure it may well be about — instead of being thrown away in a
    // `beforeEach` no one would see.
    bufferedMessages = [];
    droppedMessageCount = 0;
    // `this.currentTest` is why this is a `function` and not an arrow. With
    // `retries` configured, a flake that passes on a later attempt still
    // prints the failed attempt's messages, which is exactly the run worth
    // reading.
    if (this.currentTest?.state !== "failed") {
        return;
    }
    if (dropped > 0) {
        messages.push(`[truncated] ${dropped} further message(s) suppressed`);
    }
    cy.task(
        "printAppConsole",
        {
            title: this.currentTest.fullTitle(),
            // Retries mean the same title can print up to three times in one
            // run; number the attempts so the transcripts can be told apart —
            // and so "attempt 1 timed out, attempt 2 never started a worker"
            // is readable as such rather than as one confused log.
            attempt: Cypress.currentRetry + 1,
            messages,
        },
        { log: false },
    );
});

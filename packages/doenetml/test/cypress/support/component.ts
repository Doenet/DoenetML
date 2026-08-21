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
// running the init round-trips the boot ladder watchdogs. When that is slower
// than the wait — a cold 2-core CI runner is the case on record — the failure
// says only that the content never appeared. The ladder itself has already
// explained what happened, through `console.warn`, in the browser; `cypress
// run` just never shows it.
//
// So buffer the app's warnings and errors for the duration of each test and,
// when the test fails, hand them to the `printAppConsole` task, which prints
// them from the runner process where CI logs can pick them up. Passing tests
// print nothing.

/** Enough for a full boot ladder's narration without flooding the log. */
const MAX_BUFFERED_MESSAGES = 100;

let bufferedMessages: string[] = [];

function formatConsoleArg(arg: unknown): string {
    if (arg instanceof Error) {
        return `${arg.name}: ${arg.message}`;
    }
    if (typeof arg === "string") {
        return arg;
    }
    try {
        return JSON.stringify(arg);
    } catch {
        // Circular structures, DOM nodes, and the like.
        return String(arg);
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
        }
        original(...args);
    };
}

beforeEach(() => {
    bufferedMessages = [];
});

afterEach(function () {
    const messages = bufferedMessages;
    bufferedMessages = [];
    // `this.currentTest` is why this is a `function` and not an arrow. With
    // `retries` configured, a flake that passes on a later attempt still
    // prints the failed attempt's messages, which is exactly the run worth
    // reading.
    if (this.currentTest?.state !== "failed" || messages.length === 0) {
        return;
    }
    cy.task(
        "printAppConsole",
        { title: this.currentTest.fullTitle(), messages },
        { log: false },
    );
});

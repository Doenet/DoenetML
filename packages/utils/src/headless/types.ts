import type { DiagnosticRecord, Position } from "../diagnostics/types";

/**
 * The interface between `@doenet/doenetml-headless` and a DoenetML core.
 *
 * A core that implements this can be run without a browser: created from a
 * document, a variant and an optional saved state, driven by actions, and read
 * for its answers, credit and diagnostics. `@doenet/doenetml-headless` depends
 * on this interface alone, so another core can stand in for the JavaScript one
 * without changing that package's API or CLI. The JavaScript core's
 * implementation is `createJavascriptHeadlessCoreFactory` in
 * `@doenet/doenetml-worker-javascript/headless`.
 *
 * It lives here, rather than in either package, so that both can import it
 * without depending on each other.
 */
export interface HeadlessCore {
    /** What this core can do beyond the required members. */
    readonly capabilities: HeadlessCoreCapabilities;

    /** The variant this core is running, numbered from 1. */
    readonly variantIndex: number;

    /** How many variants the document has. */
    readonly numVariants: number;

    /**
     * Run an action on a component, as a renderer would, and wait for the
     * document to settle. Rejects if the core refuses the action.
     */
    dispatchAction(action: HeadlessAction): Promise<void>;

    /**
     * Resolve a reference path such as `r[3].g.p` (with or without the leading
     * `$`) from the document root, expanding whatever composites the path runs
     * through. A path resolves only if each step resolves uniquely from the one
     * before it, which is what makes it a stable key for the component.
     * Throws if `path` is not written as names joined by `.` with literal
     * indices.
     */
    resolvePath(path: string): Promise<HeadlessPathResolution>;

    /** The component's children, in order, as the document holds them now. */
    getChildren(componentIdx: number): Promise<HeadlessComponent[]>;

    /**
     * The current values of the named state variables of a component, public
     * or not. A name the component does not have is absent from the result.
     * `setInput` reads `disabled`, `fixed`, `fixLocation`, `draggable`,
     * `numChoices`, `selectMultiple`, `choicesDisabled`, `numRows`,
     * `numColumns` and `numDimensions`.
     */
    readProperties(
        componentIdx: number,
        propertyNames: string[],
    ): Promise<Record<string, unknown>>;

    /**
     * The document's `<answer>` components, in the order a reader meets them
     * (a repeat's answers iteration by iteration, a select's in the order
     * selected). Not included: a copy of an answer that shadows it (the
     * answer itself is reported once), an answer whose content has not been
     * created (inside an unopened `<solution>`), and a `<pretzel>`, nor the
     * `<answer>` that gives each of its problems' answer, which the pretzel
     * turns into text; a pretzel's credit is in the document's.
     */
    getAnswers(): Promise<HeadlessAnswer[]>;

    /** The document's own credit. */
    getDocumentCredit(): Promise<HeadlessDocumentCredit>;

    /** Every diagnostic the document has reported so far, of every type. */
    getDiagnostics(): Promise<DiagnosticRecord[]>;

    /**
     * The document's state as the viewer reports it to a host
     * (`reportScoreAndState`'s `state`), including its `data_format_version`.
     */
    serializeState(): Promise<HeadlessSavedState>;

    /**
     * Replace the running document's state with a saved one. Present only on a
     * core whose `capabilities.loadState` is `true`; a core without it applies
     * a saved state only when it is created, so a caller makes a new core for
     * each state instead.
     */
    loadState?(savedState: HeadlessSavedState): Promise<void>;

    /** Release everything the core holds. The core cannot be used after. */
    terminate(): Promise<void>;
}

export type HeadlessCoreCapabilities = {
    /** Whether `loadState` is implemented. */
    readonly loadState: boolean;
};

export type HeadlessCoreOptions = {
    /** The DoenetML source of the document. */
    doenetML: string;
    /** The variant to run, numbered from 1. Defaults to 1. */
    variantIndex?: number;
    /** Viewer flags, as `DoenetViewer` takes them. */
    flags?: Record<string, unknown>;
    /**
     * A saved state to start from: a `reportScoreAndState` payload, as the
     * viewer reported it. A core applies it as it is; checking that it
     * belongs to this document and variant is the caller's job.
     */
    savedState?: HeadlessSavedState | null;
};

/** Creates cores. Each core implementation provides one. */
export type HeadlessCoreFactory = {
    /**
     * The `data_format_version` the cores write into a saved state, and the
     * only one they read back. On the factory rather than on a core, so that a
     * saved state can be checked before a core is made from it.
     */
    readonly dataFormatVersion: string;
    create(options: HeadlessCoreOptions): Promise<HeadlessCore>;
};

/**
 * A saved state: the payload the viewer delivers through
 * `reportScoreAndState` (and `SPLICE.reportScoreAndState`). Opaque except for
 * the fields named here, which are the ones a caller checks before using it.
 */
export type HeadlessSavedState = {
    data_format_version?: unknown;
    cid?: unknown;
    coreInfo?: unknown;
    coreState?: unknown;
    attemptNumber?: unknown;
    onSubmission?: unknown;
    [key: string]: unknown;
};

export type HeadlessAction = {
    componentIdx: number;
    actionName: string;
    args?: Record<string, unknown>;
};

export type HeadlessComponent = {
    /**
     * The component's index in this core. Stable only while the document
     * source does not change, so not a key to store.
     */
    componentIdx: number;
    componentType: string;
};

export type HeadlessPathResolution =
    | { status: "resolved"; component: HeadlessComponent }
    /** Nothing in the document answers to the path. */
    | { status: "notFound" }
    /**
     * More than one component answers to some step of the path, so the path
     * is not a stable key for anything.
     */
    | { status: "notUnique" };

export type HeadlessAnswer = HeadlessComponent & {
    /**
     * The answer's stable key: the shortest path from the document root that
     * reaches it and nothing else, written as a reference without the `$`
     * (`r[3].g.ans`). `null` when no such path exists, which is the case for a
     * name that is not unique from the root and for an answer with no name on
     * its way from the root.
     */
    stableKey: string | null;
    /** Where the answer is written in the source, when the core knows. */
    position?: Position;
    /**
     * The credit the answer would get if it were submitted now, computed from
     * its current inputs. It ignores attempt limits and is not reduced by
     * `creditByAttempt`.
     */
    creditAchievedIfSubmit: number;
    /**
     * Values the document holds as they were stored, not recomputed: after a
     * saved state is loaded, these are whatever the saved state said.
     */
    stored: {
        creditAchieved: number;
        numSubmissions: number;
    };
    /**
     * The inputs that are the answer's own children, in order, so that
     * `inputs[n - 1]` is the input at position `n`. An input the answer uses
     * through `forAnswer` is not here; it is reached by its own path.
     */
    inputs: HeadlessComponent[];
};

export type HeadlessDocumentCredit = {
    /**
     * The document's credit if every answer were submitted now. `NaN` when
     * the document weighs nothing (no scored part, or every weight 0), or
     * when a `<problem>` or other aggregating section in it has no scored
     * part (each divides by the weight of what it holds, with no guard for
     * none).
     */
    creditAchievedIfSubmit: number;
    /** The document's credit from the stored credit of its parts. */
    stored: {
        creditAchieved: number;
    };
};

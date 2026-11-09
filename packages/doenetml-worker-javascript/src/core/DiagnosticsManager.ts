import { DiagnosticRecord } from "@doenet/utils";

/**
 * A diagnostic a condition gives ({@link DiagnosticsManager.setConditionDiagnostics}),
 * with its dedup key and its place in the order diagnostics were reported.
 */
type ConditionEntry = {
    diagnostic: DiagnosticRecord;
    key: string;
    seq: number;
};

/**
 * What happens to an error reported after the document has loaded
 * ({@link DiagnosticsManager.markLoaded}), which DIAG-7 forbids: an error is
 * decided at load, from the DoenetML alone (D38, #2463).
 *
 * - `"assert"`, in tests, or in Node in development
 *   ({@link defaultErrorsAfterLoad}): it is reported as an error, and
 *   recorded in {@link DiagnosticsManager.errorsReportedAfterLoad}, which the
 *   test harness fails a test on.
 * - `"warn"`, otherwise, as in a browser: it is reported as a warning, and the component
 *   in error is missing (`＿`) rather than an error box
 *   ({@link DiagnosticsManager.isErrorAfterLoad}), so a reader sees no error.
 */
export type ErrorsAfterLoad = "assert" | "warn";

/**
 * `"assert"` when running in tests (Vitest) or in Node in development
 * (`NODE_ENV=development`), and `"warn"` otherwise, which is how the worker
 * runs in a browser, where `process` is not defined, in a development
 * build too.
 */
export function defaultErrorsAfterLoad(): ErrorsAfterLoad {
    const env = (globalThis as any).process?.env;
    return env?.VITEST || env?.NODE_ENV === "development" ? "assert" : "warn";
}

/**
 * Owns the diagnostics queue (errors, warnings, info, accessibility) for a Core
 * instance. Core delegates to this manager for adding and reading diagnostics.
 *
 * A diagnostic is reported one of two ways. One added with
 * {@link addDiagnostic} stays. One a component gives on a condition
 * ({@link setConditionDiagnostics}) is there while the condition holds and
 * the component is shown ({@link isShown}), so a diagnostic caused by values
 * that can change appears and goes away with its cause (B33).
 */
export class DiagnosticsManager {
    /** The diagnostics added with {@link addDiagnostic}, in order. */
    _queue: DiagnosticRecord[];
    /** When each entry of `_queue` was reported (`_seq`). */
    _queueSeq: number[];
    /** The order in which the next diagnostic is reported. */
    _seq: number;
    hasPendingDiagnostics: boolean;
    /**
     * The dedup key of every entry in `_queue`, kept alongside the queue
     * rather than re-derived on each add. Only this class writes `_queue`,
     * so the two cannot drift apart — and the alternative is quadratic in a
     * way that shows: re-keying the queue on every add costs about 0.2 s for
     * a thousand diagnostics and 1.5 s for three thousand, against 5 ms and
     * 25 ms for the field-by-field comparison this replaced.
     */
    _diagnosticKeys: Set<string>;
    /**
     * What each condition a component reports on gives now
     * ({@link setConditionDiagnostics}), by component and then by
     * condition. A condition that gives nothing has no entry.
     */
    _conditionDiagnostics: Map<number, Map<string, ConditionEntry[]>>;
    /**
     * How to decide again each condition that is not decided again on its
     * own ({@link watchCondition}), by component and then by condition.
     */
    _watchedConditions: Map<number, Map<string, WatchedCondition>>;
    /** Whether {@link refreshWatchedConditions} is running. */
    _refreshing: boolean;
    /**
     * Whether component `componentIdx` is shown, and so whether what it gives
     * on its conditions is reported. Core sets it: a component inside content
     * a composite withholds, as a `<conditionalContent>` withholds a case not
     * chosen, explains nothing about what is shown, and a reload, which does
     * not make it, reports none of it (DIAG-6).
     */
    isShown: (componentIdx: number) => boolean;
    /**
     * The DoenetML of each source document, by `sourceDoc`, which Core sets:
     * where the start tag of a tag ends (`withoutExplainedIndexInfos`).
     */
    sources: readonly string[] = [];
    /**
     * Whether the document has loaded ({@link markLoaded}). After that, an
     * error is a bug (DIAG-7), handled as {@link errorsAfterLoad} says.
     */
    loaded = false;
    /** What happens to an error reported after load ({@link ErrorsAfterLoad}). */
    errorsAfterLoad: ErrorsAfterLoad;
    /**
     * Each error reported after load while {@link errorsAfterLoad} is
     * `"assert"`, in order. The test harness fails a test that leaves any.
     */
    errorsReportedAfterLoad: DiagnosticRecord[] = [];
    /**
     * The keys of what was reported by the end of load ({@link markLoaded}).
     * An error among them is not one after load, however many times it is
     * reported again, and whether or not the cap of {@link getDiagnostics}
     * has dropped it since.
     */
    _keysAtLoad: Set<string> = new Set();

    constructor({
        preliminaryDiagnostics,
        errorsAfterLoad = defaultErrorsAfterLoad(),
    }: {
        preliminaryDiagnostics: DiagnosticRecord[];
        errorsAfterLoad?: ErrorsAfterLoad;
    }) {
        this.errorsAfterLoad = errorsAfterLoad;
        // Preliminary diagnostics seed the queue at construction. They are not
        // unique: a reference resolution carries the same index nodes on both
        // its `originalPath` and its `unresolvedPath`, and the load-time
        // pipeline expands both — so anything reported about markup written
        // between index brackets arrived once per path, doubling for each level
        // of nesting. Both expansions are needed; only the reporting should
        // happen once. Deduping through a `Set` of keys is a single pass, so the
        // O(n²) that once argued against doing it here does not apply.
        //
        // Errors are kept too, though the `_error` components built from the
        // document raise most of them again, which is kept once: an `_error`
        // in content made only after an interaction, as in a case that is not
        // true yet, is reported now, where the author sees it, not first to a
        // student.
        this._diagnosticKeys = new Set<string>();
        this._conditionDiagnostics = new Map();
        this._watchedConditions = new Map();
        this._refreshing = false;
        this.isShown = () => true;
        this._queue = preliminaryDiagnostics.filter((diagnostic) => {
            this.assertDiagnosticIsValid(diagnostic);
            const key = diagnosticDedupKey(diagnostic);
            if (this._diagnosticKeys.has(key)) {
                return false;
            }
            this._diagnosticKeys.add(key);
            return true;
        });
        this._queueSeq = this._queue.map((_, ind) => ind);
        this._seq = this._queue.length;

        this.hasPendingDiagnostics = true;
    }

    /**
     * The diagnostics reported now, in the order they were reported: those
     * added with {@link addDiagnostic}, and those the conditions of shown
     * components give, each once.
     */
    get diagnostics(): DiagnosticRecord[] {
        if (this._conditionDiagnostics.size === 0) {
            return this._queue;
        }
        const keys = new Set(this._diagnosticKeys);
        const merged: { diagnostic: DiagnosticRecord; seq: number }[] =
            this._queue.map((diagnostic, ind) => ({
                diagnostic,
                seq: this._queueSeq[ind],
            }));
        for (const [componentIdx, byCondition] of this._conditionDiagnostics) {
            if (!this.isShown(componentIdx)) {
                continue;
            }
            for (const entries of byCondition.values()) {
                for (const entry of entries) {
                    if (!keys.has(entry.key)) {
                        keys.add(entry.key);
                        merged.push(entry);
                    }
                }
            }
        }
        return withoutExplainedIndexInfos(
            this.sources,
            merged
                .sort((a, b) => a.seq - b.seq)
                .map((entry) => entry.diagnostic),
        );
    }

    /**
     * Mark the end of load: the document's components are made and its first
     * render is decided. Every error is decided by then (DIAG-7), so one
     * reported after it is a bug, handled as {@link errorsAfterLoad} says.
     * One reported at load and again later, as when its content is made, is
     * the same one, kept once, and is not reported again.
     */
    markLoaded(): void {
        this._keysAtLoad = new Set(this._diagnosticKeys);
        for (const byCondition of this._conditionDiagnostics.values()) {
            for (const entries of byCondition.values()) {
                for (const entry of entries) {
                    this._keysAtLoad.add(entry.key);
                }
            }
        }
        this.loaded = true;
    }

    /**
     * Whether `diagnostic` is a new error reported after load, which in
     * production is a warning with its component missing
     * ({@link ErrorsAfterLoad}). One that was reported at load already is
     * not new; one first reported after load stays one, as when a composite
     * reports it and then makes the `_error` that shows it.
     */
    isErrorAfterLoad(diagnostic: DiagnosticRecord): boolean {
        return (
            this.loaded &&
            diagnostic.type === "error" &&
            !this._keysAtLoad.has(diagnosticDedupKey(diagnostic))
        );
    }

    /**
     * `diagnostic` as it is reported now: as it is, or, for an error after
     * load, recorded ({@link errorsReportedAfterLoad}) or made a warning, as
     * {@link errorsAfterLoad} says. The caller has checked it is not a
     * duplicate.
     */
    _afterLoad(diagnostic: DiagnosticRecord): DiagnosticRecord {
        if (!this.isErrorAfterLoad(diagnostic)) {
            return diagnostic;
        }
        if (this.errorsAfterLoad === "assert") {
            this.errorsReportedAfterLoad.push(diagnostic);
            return diagnostic;
        }
        return { ...diagnostic, type: "warning" };
    }

    /**
     * Mark the queue as having pending diagnostics without adding a record.
     * Used by Core's error-component path, where the diagnostic itself is
     * synthesized later by `convertToErrorComponent`.
     */
    markPending(): void {
        this.hasPendingDiagnostics = true;
    }

    /**
     * Note that which components are shown may have changed ({@link isShown}),
     * as when a composite withholds replacements or stops withholding them,
     * so the diagnostics their conditions give are sent again.
     */
    markShownChanged(): void {
        if (this._conditionDiagnostics.size > 0) {
            this.hasPendingDiagnostics = true;
        }
    }

    /**
     * Get pending diagnostics and reset the pending flag.
     *
     * Caps the diagnostics added with {@link addDiagnostic} at the most
     * recent {@link MAX_DIAGNOSTICS} entries so a long session with many
     * warnings can't grow the queue unboundedly.
     */
    getDiagnostics(): { diagnostics: DiagnosticRecord[] } {
        const MAX_DIAGNOSTICS = 1000;
        if (this._queue.length > MAX_DIAGNOSTICS) {
            this._queue = this._queue.slice(-MAX_DIAGNOSTICS);
            this._queueSeq = this._queueSeq.slice(-MAX_DIAGNOSTICS);
            // A diagnostic dropped by the cap is no longer in the queue, so it
            // must be able to be reported again — which is what the scan over
            // the capped array used to do on its own.
            this._diagnosticKeys = new Set(this._queue.map(diagnosticDedupKey));
        }

        this.hasPendingDiagnostics = false;

        return { diagnostics: this.diagnostics };
    }

    assertDiagnosticIsValid({
        type,
        level,
    }: {
        type: DiagnosticRecord["type"];
        level?: number;
    }): void {
        if (!["error", "warning", "info", "accessibility"].includes(type)) {
            throw Error("Invalid diagnostic type");
        }

        if (type === "accessibility") {
            if (level === undefined) {
                throw Error("Missing accessibility diagnostic level");
            }

            if (![1, 2].includes(level)) {
                throw Error("Invalid accessibility diagnostic level");
            }
        }
    }

    /**
     * Add a diagnostic record to the queue, deduplicating by type + message +
     * source location. It stays, unlike one a condition gives
     * ({@link setConditionDiagnostics}).
     *
     * Returns `true` if a new entry was added, `false` if it was deduped.
     * Core's initial-add phase inspects this so it can re-throw deduped errors
     * via the existing rethrow path (see `Core.js` near the
     * `result.sendDiagnostics` loop).
     */
    addDiagnostic(diagnostic: DiagnosticRecord): boolean {
        this.assertDiagnosticIsValid(diagnostic);

        const key = diagnosticDedupKey(diagnostic);
        if (this._diagnosticKeys.has(key)) {
            return false;
        }

        // Keyed as it was reported, so an error made a warning after load
        // (`_afterLoad`) is still kept once when it is reported again.
        this._diagnosticKeys.add(key);
        diagnostic = this._afterLoad(diagnostic);
        const reportedKey = diagnosticDedupKey(diagnostic);
        if (reportedKey !== key) {
            if (this._diagnosticKeys.has(reportedKey)) {
                return false;
            }
            this._diagnosticKeys.add(reportedKey);
        }
        this._queue.push(diagnostic);
        this._queueSeq.push(this._seq++);

        this.hasPendingDiagnostics = true;
        return true;
    }

    /**
     * Report what `condition` of component `componentIdx` gives now,
     * replacing what it gave before: `diagnostics` while the condition holds,
     * `[]` once it ends (B33).
     *
     * For a diagnostic caused by values that can change (DIAG-2), which
     * explains why part of a document shows nothing *now* (DIAG-1): it is to
     * appear when its condition starts and go away when it ends, and while it
     * holds there is one of it, however many times it is decided again. A
     * reload, which decides it once from the current state, then reports the
     * same (DIAG-6).
     *
     * `condition` names what is decided, such as `"typeChange"`, and is
     * scoped to the component. A diagnostic two components give — two
     * iterations of a repeat made from the same markup point at the same
     * place — is reported once, while either gives it; one also added with
     * {@link addDiagnostic} stays. It is reported only while the component is
     * shown ({@link isShown}), and is withdrawn when the component is deleted
     * ({@link withdrawConditionDiagnostics}).
     */
    setConditionDiagnostics(
        componentIdx: number,
        condition: string,
        diagnostics: DiagnosticRecord[],
    ): void {
        for (const diagnostic of diagnostics) {
            this.assertDiagnosticIsValid(diagnostic);
        }
        // A condition comes from values that can change, so it gives no
        // error (DIAG-2, DIAG-7); one it gives after load is a bug.
        if (this.loaded) {
            const previousKeys = new Set(
                (
                    this._conditionDiagnostics
                        .get(componentIdx)
                        ?.get(condition) ?? []
                ).map((entry) => entry.key),
            );
            diagnostics = diagnostics.map((diagnostic) =>
                diagnostic.type === "error" &&
                !previousKeys.has(diagnosticDedupKey(diagnostic)) &&
                !this._diagnosticKeys.has(diagnosticDedupKey(diagnostic))
                    ? this._afterLoad(diagnostic)
                    : diagnostic,
            );
        }
        let byCondition = this._conditionDiagnostics.get(componentIdx);
        const previous = byCondition?.get(condition) ?? [];
        const previousByKey = new Map(
            previous.map((entry) => [entry.key, entry]),
        );
        const entries: ConditionEntry[] = [];
        const keys = new Set<string>();
        for (const diagnostic of diagnostics) {
            const key = diagnosticDedupKey(diagnostic);
            if (keys.has(key)) {
                continue;
            }
            keys.add(key);
            // One given before keeps its place in the order.
            entries.push(
                previousByKey.get(key) ?? { diagnostic, key, seq: this._seq++ },
            );
        }
        if (
            entries.length === previous.length &&
            entries.every((entry) => previousByKey.has(entry.key))
        ) {
            return;
        }

        if (entries.length > 0) {
            if (!byCondition) {
                byCondition = new Map();
                this._conditionDiagnostics.set(componentIdx, byCondition);
            }
            byCondition.set(condition, entries);
        } else if (byCondition) {
            byCondition.delete(condition);
            if (byCondition.size === 0) {
                this._conditionDiagnostics.delete(componentIdx);
            }
        }
        this.hasPendingDiagnostics = true;
    }

    /**
     * Withdraw every diagnostic component `componentIdx` gives on a
     * condition ({@link setConditionDiagnostics}), and stop deciding its
     * watched conditions ({@link watchCondition}), as when it is deleted: a
     * component no longer in the document explains nothing about it.
     */
    withdrawConditionDiagnostics(componentIdx: number): void {
        this._watchedConditions.delete(componentIdx);
        if (this._conditionDiagnostics.delete(componentIdx)) {
            this.hasPendingDiagnostics = true;
        }
    }

    /**
     * Report `condition` of component `componentIdx` as `decide` gives it
     * now, and again after each update ({@link refreshWatchedConditions}),
     * replacing any way of deciding it given before.
     *
     * For a condition decided where nothing runs again when it changes, as
     * whether an index names an entry of a math's value, which is decided
     * when the reference is resolved and changes with the value. `decide`
     * gives the diagnostics the condition gives now (`[]` while it does not
     * hold), or `null` once there is nothing left to decide, which withdraws
     * them and stops watching.
     */
    async watchCondition(
        componentIdx: number,
        condition: string,
        decide: WatchedCondition,
    ): Promise<void> {
        let byCondition = this._watchedConditions.get(componentIdx);
        if (!byCondition) {
            byCondition = new Map();
            this._watchedConditions.set(componentIdx, byCondition);
        }
        byCondition.set(condition, decide);
        await this._decideWatched(componentIdx, condition, decide);
    }

    /**
     * Decide every watched condition ({@link watchCondition}) again, so a
     * diagnostic that follows a value appears and goes away as the value
     * changes. Run before each batch of renderer updates is built, after the
     * update that changed the value; a call made while one runs, as when a
     * value it reads is calculated, does nothing.
     */
    async refreshWatchedConditions(): Promise<void> {
        if (this._refreshing || this._watchedConditions.size === 0) {
            return;
        }
        this._refreshing = true;
        try {
            const watched = [...this._watchedConditions].flatMap(
                ([componentIdx, byCondition]) =>
                    [...byCondition].map(
                        ([condition, decide]) =>
                            [componentIdx, condition, decide] as const,
                    ),
            );
            for (const [componentIdx, condition, decide] of watched) {
                await this._decideWatched(componentIdx, condition, decide);
            }
        } finally {
            this._refreshing = false;
        }
    }

    async _decideWatched(
        componentIdx: number,
        condition: string,
        decide: WatchedCondition,
    ): Promise<void> {
        const diagnostics = await decide();
        if (
            this._watchedConditions.get(componentIdx)?.get(condition) !== decide
        ) {
            // Replaced, or withdrawn, while it was decided.
            return;
        }
        if (diagnostics === null) {
            const byCondition = this._watchedConditions.get(componentIdx)!;
            byCondition.delete(condition);
            if (byCondition.size === 0) {
                this._watchedConditions.delete(componentIdx);
            }
        }
        this.setConditionDiagnostics(
            componentIdx,
            condition,
            diagnostics ?? [],
        );
    }
}

/**
 * `diagnostics` without each info that the index of a reference written as
 * a tag names nothing now (`doenet-i0054`) where a warning or error at the
 * reference already says why: a property the referent does not have
 * (`$n.nonexistent[1]`), an index into a value that is a scalar
 * (`doenet-w0100`, an info too when the value can change), or an index
 * below 1 ({@link EXPLAINS_AT_ANY_LEVEL}). The tag then reports what
 * the bare reference reports (D37). The info spans the whole tag, children
 * and all, so only a diagnostic at the whole tag (as `doenet-w0100` is) or in
 * the value of its `extend` or `copy` attribute (`referenceSpan`) explains
 * it, not one in another attribute (`displayDigits="$nothing"`) or in what
 * is written in the tag (`<p extend="$g[$i]">$nothing</p>`). `sources` is
 * the DoenetML of each source document.
 */
function withoutExplainedIndexInfos(
    sources: readonly string[],
    diagnostics: DiagnosticRecord[],
): DiagnosticRecord[] {
    if (!diagnostics.some((d) => d.code === "doenet-i0054")) {
        return diagnostics;
    }
    const explaining = diagnostics.filter(
        (d) =>
            d.type === "warning" ||
            d.type === "error" ||
            (d.code !== undefined && EXPLAINS_AT_ANY_LEVEL.has(d.code)),
    );
    return diagnostics.filter((info) => {
        if (info.code !== "doenet-i0054") {
            return true;
        }
        const start = info.position?.start?.offset;
        const end = info.position?.end?.offset;
        if (start === undefined || end === undefined) {
            return true;
        }
        const reference = referenceSpan(
            sources[info.sourceDoc ?? 0],
            start,
            end,
        );
        return !explaining.some((d) => {
            const dStart = d.position?.start?.offset;
            const dEnd = d.position?.end?.offset;
            return (
                dStart !== undefined &&
                dEnd !== undefined &&
                ((dStart === start && dEnd === end) ||
                    (reference !== undefined &&
                        dStart >= reference.start &&
                        dEnd <= reference.end)) &&
                (d.sourceDoc ?? 0) === (info.sourceDoc ?? 0)
            );
        });
    });
}

/**
 * The codes that say why an index names nothing whatever their level: an
 * info when the value they are about can change (DIAG-2), as `doenet-w0100`
 * for an index into a math from an input, which explains the tag's
 * `doenet-i0054` as its warning does.
 */
const EXPLAINS_AT_ANY_LEVEL: ReadonlySet<string> = new Set([
    "doenet-w0100",
    "doenet-w0104",
]);

/**
 * The offsets of the value of the `extend` or `copy` attribute, inside its
 * quotes, in the start tag of the tag written at `start` in `source`, which
 * ends by `end`: the reference the tag is made from. `undefined` when there
 * is no such attribute there, or the source is not a tag.
 */
function referenceSpan(
    source: string | undefined,
    start: number,
    end: number,
): { start: number; end: number } | undefined {
    if (source?.[start] !== "<") {
        return undefined;
    }
    // Attributes are read in order, so a quote inside one value is not taken
    // for the start of another.
    let i = start + 1;
    while (i < end && /[^\s/>]/.test(source[i])) {
        i++;
    }
    while (i < end) {
        while (i < end && /\s/.test(source[i])) {
            i++;
        }
        if (i >= end || source[i] === ">" || source[i] === "/") {
            return undefined;
        }
        const nameStart = i;
        while (i < end && /[^\s=/>]/.test(source[i])) {
            i++;
        }
        const name = source.slice(nameStart, i);
        while (i < end && /\s/.test(source[i])) {
            i++;
        }
        if (source[i] !== "=") {
            continue;
        }
        i++;
        while (i < end && /\s/.test(source[i])) {
            i++;
        }
        const quote = source[i];
        if (quote !== '"' && quote !== "'") {
            return undefined;
        }
        const valueStart = i + 1;
        const valueEnd = source.indexOf(quote, valueStart);
        if (valueEnd === -1 || valueEnd >= end) {
            return undefined;
        }
        // attribute names are case-insensitive, as the resolver reads them
        const lowerName = name.toLowerCase();
        if (
            lowerName === "extend" ||
            lowerName === "copy" ||
            lowerName === "copywithstate"
        ) {
            return { start: valueStart, end: valueEnd };
        }
        i = valueEnd + 1;
    }
    return undefined;
}

/**
 * How a watched condition is decided ({@link DiagnosticsManager.watchCondition}):
 * the diagnostics it gives now, or `null` once there is nothing to decide.
 */
export type WatchedCondition = () => Promise<DiagnosticRecord[] | null>;

/**
 * What makes two diagnostics the same one: their type, their message and where
 * they point. An accessibility diagnostic's level counts too, since the same
 * message can be raised at either.
 *
 * A position is compared field by field rather than by identity, and a missing
 * point reads the same as one whose fields are all absent — the records come
 * from several places and do not agree on whether an unknown offset is `null`,
 * `undefined` or simply not there.
 *
 * Shared by the constructor's seed and by `addDiagnostic`, so the two channels
 * cannot drift into disagreeing about what a duplicate is.
 */
function diagnosticDedupKey(diagnostic: DiagnosticRecord): string {
    function point(p: any): string {
        return [p?.offset ?? "", p?.line ?? "", p?.column ?? ""].join(":");
    }
    const position =
        diagnostic.position === undefined
            ? ""
            : `${point(diagnostic.position.start)}-${point(diagnostic.position.end)}`;
    const level = diagnostic.type === "accessibility" ? diagnostic.level : "";
    return JSON.stringify([
        diagnostic.type,
        level,
        diagnostic.message,
        diagnostic.sourceDoc ?? "",
        position,
    ]);
}

import {
    AccessibilityRecord,
    DiagnosticRecord,
    InfoRecord,
    WarningRecord,
} from "@doenet/utils";

type NonErrorDiagnosticRecord =
    WarningRecord | InfoRecord | AccessibilityRecord;

/**
 * Owns the diagnostics queue (errors, warnings, info, accessibility) for a Core
 * instance. Core delegates to this manager for adding and reading diagnostics.
 */
export class DiagnosticsManager {
    diagnostics: DiagnosticRecord[];
    hasPendingDiagnostics: boolean;
    /**
     * The dedup key of every entry in `diagnostics`, kept alongside the queue
     * rather than re-derived on each add. Only this class writes
     * `diagnostics`, so the two cannot drift apart — and the alternative is
     * quadratic in a way that shows: re-keying the queue on every add costs
     * about 0.2 s for a thousand diagnostics and 1.5 s for three thousand,
     * against 5 ms and 25 ms for the field-by-field comparison this replaced.
     */
    _diagnosticKeys: Set<string>;

    constructor({
        preliminaryDiagnostics,
    }: {
        preliminaryDiagnostics: DiagnosticRecord[];
    }) {
        // Preliminary diagnostics seed the queue at construction. They are not
        // unique: a reference resolution carries the same index nodes on both
        // its `originalPath` and its `unresolvedPath`, and the load-time
        // pipeline expands both — so anything reported about markup written
        // between index brackets arrived once per path, doubling for each level
        // of nesting. Both expansions are needed; only the reporting should
        // happen once. Deduping through a `Set` of keys is a single pass, so the
        // O(n²) that once argued against doing it here does not apply.
        //
        // Errors are ignored here; we'll gather those from the dast when
        // processing it.
        this._diagnosticKeys = new Set<string>();
        this.diagnostics = preliminaryDiagnostics.filter(
            (diagnostic): diagnostic is NonErrorDiagnosticRecord => {
                if (diagnostic.type === "error") {
                    return false;
                }
                this.assertDiagnosticIsValid(diagnostic);
                const key = diagnosticDedupKey(diagnostic);
                if (this._diagnosticKeys.has(key)) {
                    return false;
                }
                this._diagnosticKeys.add(key);
                return true;
            },
        );

        this.hasPendingDiagnostics = true;
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
     * Get pending diagnostics and reset the pending flag.
     *
     * Caps the diagnostics array at the most recent {@link MAX_DIAGNOSTICS}
     * entries so a long session with many warnings can't grow it unboundedly.
     */
    getDiagnostics(): { diagnostics: DiagnosticRecord[] } {
        const MAX_DIAGNOSTICS = 1000;
        const kept = this.diagnostics.slice(-MAX_DIAGNOSTICS);
        if (kept.length !== this.diagnostics.length) {
            // A diagnostic dropped by the cap is no longer in the queue, so it
            // must be able to be reported again — which is what the scan over
            // the capped array used to do on its own.
            this._diagnosticKeys = new Set(kept.map(diagnosticDedupKey));
        }
        this.diagnostics = kept;

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
     * Add a diagnostic record to `this.diagnostics`, deduplicating by
     * type + message + source location.
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

        this._diagnosticKeys.add(key);
        this.diagnostics.push(diagnostic);

        this.hasPendingDiagnostics = true;
        return true;
    }
}

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

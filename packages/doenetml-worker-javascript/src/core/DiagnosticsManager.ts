import {
    AccessibilityRecord,
    DiagnosticRecord,
    InfoRecord,
    WarningRecord,
} from "@doenet/utils";

type NonErrorDiagnosticRecord =
    | WarningRecord
    | InfoRecord
    | AccessibilityRecord;

/**
 * Owns the diagnostics queue (errors, warnings, info, accessibility) for a Core
 * instance. Core delegates to this manager for adding and reading diagnostics.
 */
export class DiagnosticsManager {
    diagnostics: DiagnosticRecord[];
    hasPendingDiagnostics: boolean;

    constructor({
        preliminaryDiagnostics,
    }: {
        preliminaryDiagnostics: DiagnosticRecord[];
    }) {
        // Preliminary diagnostics seed the queue at construction. We skip the
        // dedup pass here — it would be O(n²) and these come from a single
        // upstream pass that has already produced unique entries. Errors are
        // ignored here; we'll gather those from the dast when processing it.
        this.diagnostics = preliminaryDiagnostics.filter(
            (diagnostic): diagnostic is NonErrorDiagnosticRecord => {
                if (diagnostic.type === "error") {
                    return false;
                }
                this.assertDiagnosticIsValid(diagnostic);
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
        this.diagnostics = this.diagnostics.slice(-MAX_DIAGNOSTICS);

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
        const sameLocation = (pointA: any, pointB: any) =>
            (pointA?.offset ?? undefined) === (pointB?.offset ?? undefined) &&
            (pointA?.line ?? undefined) === (pointB?.line ?? undefined) &&
            (pointA?.column ?? undefined) === (pointB?.column ?? undefined);

        const haveSamePosition = (warningPosition: any, newPosition: any) => {
            if (warningPosition === undefined || newPosition === undefined) {
                return warningPosition === newPosition;
            }

            return (
                sameLocation(warningPosition.start, newPosition.start) &&
                sameLocation(warningPosition.end, newPosition.end)
            );
        };

        this.assertDiagnosticIsValid(diagnostic);

        const alreadyHaveDiagnostic = this.diagnostics.some((existing) => {
            if (existing.type !== diagnostic.type) {
                return false;
            }
            if (
                diagnostic.type === "accessibility" &&
                existing.type === "accessibility" &&
                existing.level !== diagnostic.level
            ) {
                return false;
            }
            return (
                existing.message === diagnostic.message &&
                existing.sourceDoc === diagnostic.sourceDoc &&
                haveSamePosition(existing.position, diagnostic.position)
            );
        });

        if (alreadyHaveDiagnostic) {
            return false;
        }

        this.diagnostics.push(diagnostic);

        this.hasPendingDiagnostics = true;
        return true;
    }
}

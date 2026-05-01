type DiagnosticType = "error" | "warning" | "info" | "accessibility";
type DiagnosticLevel = 1 | 2;

type DiagnosticInput = {
    type: DiagnosticType;
    level?: DiagnosticLevel;
    message: string;
    position?: any;
    sourceDoc?: number;
};

type DiagnosticRecord = {
    type: DiagnosticType;
    level?: DiagnosticLevel;
    message: string;
    position?: any;
    sourceDoc?: number;
};

type AssertableDiagnostic = {
    type: DiagnosticType;
    level?: DiagnosticLevel;
};

/**
 * Owns the diagnostics queue (errors, warnings, info, accessibility) for a Core
 * instance. Core delegates to this manager for adding and reading diagnostics.
 *
 * Holds a back-reference to Core so `getSourceLocationForComponent` can walk
 * the parent chain via `core._components`.
 */
export class DiagnosticsManager {
    core: any;
    diagnostics: DiagnosticRecord[];
    hasPendingDiagnostics: boolean;

    constructor({
        core,
        preliminaryDiagnostics,
    }: {
        core: any;
        preliminaryDiagnostics: DiagnosticInput[];
    }) {
        this.core = core;

        this.diagnostics = preliminaryDiagnostics
            // Note: we ignore preliminary errors, as we'll gather those from the dast when processing it.
            .filter((diagnostic) => diagnostic.type !== "error")
            .map((diagnostic) => {
                this.assertDiagnosticIsValid(diagnostic);

                return {
                    type: diagnostic.type,
                    ...(diagnostic.type === "accessibility"
                        ? { level: diagnostic.level }
                        : {}),
                    message: diagnostic.message,
                    position: diagnostic.position,
                    sourceDoc: diagnostic.sourceDoc,
                };
            });

        this.hasPendingDiagnostics = true;
    }

    /**
     * Get pending diagnostics and reset the pending flag.
     * Automatically trims the diagnostics array to prevent unbounded memory growth.
     *
     * @returns Object containing the current diagnostics array
     * @note Diagnostics older than the 1000 most recent are discarded to manage memory
     */
    getDiagnostics(): { diagnostics: DiagnosticRecord[] } {
        // Keep only the last 1000 diagnostics to avoid unbounded memory growth.
        // Once the limit is exceeded, older diagnostics are discarded.
        // This ensures the codebase doesn't accumulate large numbers of stale messages.
        const MAX_DIAGNOSTICS = 1000;
        this.diagnostics = this.diagnostics.slice(-MAX_DIAGNOSTICS);

        this.hasPendingDiagnostics = false;

        return { diagnostics: this.diagnostics };
    }

    assertDiagnosticIsValid({ type, level }: AssertableDiagnostic): void {
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
     * @returns `true` if a new entry was added, `false` if deduped.
     */
    addDiagnostic({
        type,
        level,
        message,
        position,
        sourceDoc,
    }: DiagnosticInput): boolean {
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

        this.assertDiagnosticIsValid({ type, level });

        const alreadyHaveDiagnostic = this.diagnostics.some(
            (diagnostic) =>
                diagnostic.type === type &&
                (type === "accessibility"
                    ? diagnostic.level === level
                    : true) &&
                diagnostic.message === message &&
                diagnostic.sourceDoc === sourceDoc &&
                haveSamePosition(diagnostic.position, position),
        );

        if (alreadyHaveDiagnostic) {
            return false;
        }

        this.diagnostics.push({
            type,
            ...(type === "accessibility" ? { level } : {}),
            message,
            position,
            sourceDoc,
        });

        this.hasPendingDiagnostics = true;
        return true;
    }

    /**
     * Find the nearest available source position/sourceDoc for a component,
     * walking up ancestors when the component itself has no position.
     */
    getSourceLocationForComponent(component: any): {
        position: any;
        sourceDoc: number | undefined;
    } {
        let position = component.position;
        let sourceDoc = component.sourceDoc;
        let comp = component;

        while (position === undefined) {
            if (!(comp.parentIdx > 0)) {
                break;
            }
            comp = this.core._components[comp.parentIdx];
            position = comp.position;
            sourceDoc = comp.sourceDoc;
        }

        return { position, sourceDoc };
    }
}

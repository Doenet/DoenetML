import { useMemo } from "react";
import {
    createDiagnosticFormatter,
    type DiagnosticFormatter,
    type Translator,
} from "@doenet/i18n";
import type { DiagnosticRecord } from "@doenet/utils";

/**
 * Build the formatter that renders diagnostics in the chrome's language.
 *
 * A diagnostic is addressed to whoever is looking at the screen, so it follows
 * `uiLocale` — the same setting the buttons around it follow, and the same
 * translator. The worker knows nothing about it: it emits a stable code plus
 * the values that fill the message in, and English as a fallback.
 *
 * @param translate The chrome translator already in effect.
 * @param uiLocale The resolved `uiLocale`. `Intl.ListFormat` needs the tag,
 *   which the translator does not expose.
 */
export function useDiagnosticFormatter(
    translate: Translator,
    uiLocale: string,
): DiagnosticFormatter {
    return useMemo(
        () => createDiagnosticFormatter(translate, uiLocale),
        [translate, uiLocale],
    );
}

/**
 * Re-render each record's `message` in the formatter's language.
 *
 * Records without a code — every diagnostic that hasn't migrated to the
 * catalogs yet (#1518) — come back untouched, and so does the array itself
 * when nothing changed, so a document whose diagnostics are all legacy costs
 * nothing and doesn't churn a memo downstream.
 */
export function localizeDiagnostics(
    diagnostics: DiagnosticRecord[],
    format: DiagnosticFormatter,
): DiagnosticRecord[] {
    let changed = false;
    const localized = diagnostics.map((diagnostic) => {
        const message = format(diagnostic);
        if (message === diagnostic.message) {
            return diagnostic;
        }
        changed = true;
        return { ...diagnostic, message };
    });
    return changed ? localized : diagnostics;
}

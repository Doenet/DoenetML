import { micromark } from "micromark";
import { sanitizeDiagnosticHtml } from "./sanitizeDiagnosticHtml";

const safeMarkdownOptions = {
    allowDangerousHtml: false,
    allowDangerousProtocol: false,
};

/**
 * Render diagnostic markdown with safe micromark options and the diagnostic
 * HTML sanitizer allowlist.
 */
export function renderDiagnosticMarkdownHtml(message: string): string {
    return sanitizeDiagnosticHtml(micromark(message, safeMarkdownOptions));
}

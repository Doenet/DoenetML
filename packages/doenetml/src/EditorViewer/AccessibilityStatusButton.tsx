import React from "react";
import { IoAccessibility } from "react-icons/io5";
import { useT } from "../utils/i18n";

/**
 * The arguments both of the button's sentences are selected on: which of the
 * three things it has to say, how many of them, and whether clicking opens the
 * report or closes it.
 *
 * The tooltip and the label both branch on this, and both used to build their
 * English with an `if` per branch and an interpolated verb — `Click to
 * ${action} accessibility report` — with the plural spelled by hand
 * (`violation${count === 1 ? "" : "s"}`). None of that is reachable from a
 * catalog, and none of it is how every language works, so the branch and the
 * count go to Fluent as arguments and the sentences are selected there
 * (#1580).
 */
type AccessibilityStatus = {
    status: "violations" | "advisories" | "clean";
    count: number;
    action: "open" | "close";
};

function accessibilityStatus({
    accessibilityLevel1Count,
    accessibilityLevel2Count,
    isAccessibilityReportOpen,
}: {
    accessibilityLevel1Count: number;
    accessibilityLevel2Count: number;
    isAccessibilityReportOpen: boolean;
}): AccessibilityStatus {
    const action = isAccessibilityReportOpen ? "close" : "open";

    if (accessibilityLevel1Count > 0) {
        return {
            status: "violations",
            count: accessibilityLevel1Count,
            action,
        };
    }
    if (accessibilityLevel2Count > 0) {
        return {
            status: "advisories",
            count: accessibilityLevel2Count,
            action,
        };
    }
    return { status: "clean", count: 0, action };
}

/** The English the catalog falls back to, for the tooltip. */
function englishTitle({ status, action }: AccessibilityStatus) {
    if (status === "violations") {
        return `WCAG AA accessibility violation identified. Click to ${action} accessibility report.`;
    }
    if (status === "advisories") {
        return `Click to ${action} accessibility report. No WCAG AA violations were found, but additional accessibility recommendations are available.`;
    }
    return `Click to ${action} accessibility report. No accessibility issues were found.`;
}

/** The English the catalog falls back to, for the accessible name. */
function englishLabel({ status, count, action }: AccessibilityStatus) {
    if (status === "violations") {
        return `WCAG AA accessibility violation identified. ${count} WCAG AA violation${count === 1 ? "" : "s"} found. Click to ${action} accessibility report.`;
    }
    if (status === "advisories") {
        return `No WCAG AA violations identified. ${count} additional accessibility recommendation${count === 1 ? "" : "s"} found. Click to ${action} accessibility report.`;
    }
    return `No WCAG AA violations identified. Click to ${action} accessibility report.`;
}

/**
 * Viewer control that summarizes accessibility status and toggles the report tab.
 */
export function AccessibilityStatusButton({
    accessibilityLevel1Count,
    accessibilityLevel2Count,
    isAccessibilityReportOpen,
    onToggle,
}: {
    accessibilityLevel1Count: number;
    accessibilityLevel2Count: number;
    isAccessibilityReportOpen: boolean;
    onToggle: () => void;
}) {
    const t = useT();
    const args = accessibilityStatus({
        accessibilityLevel1Count,
        accessibilityLevel2Count,
        isAccessibilityReportOpen,
    });

    return (
        <button
            type="button"
            className={`accessibility-status-button ${
                accessibilityLevel1Count > 0
                    ? "has-level-1-issues"
                    : "no-level-1-issues"
            }`}
            onClick={onToggle}
            title={t("editor-accessibility-title", args, englishTitle(args))}
            aria-label={t(
                "editor-accessibility-label",
                args,
                englishLabel(args),
            )}
        >
            {accessibilityLevel1Count > 0 ? (
                <>
                    <IoAccessibility />
                    {/* The name of the standard, not a word — it stays as it
                        is in every language, the way the `es` catalog already
                        leaves it in `accessibility-heading-level-1`. */}
                    <span>
                        {t("editor-accessibility-badge", undefined, "WCAG")}
                    </span>
                </>
            ) : (
                <IoAccessibility />
            )}
        </button>
    );
}

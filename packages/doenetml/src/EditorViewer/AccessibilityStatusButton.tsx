import React from "react";
import { IoAccessibility } from "react-icons/io5";

/**
 * Returns the tooltip text for the accessibility status button.
 * The message varies by accessibility severity and whether the report is open.
 */
function getAccessibilityStatusTitle({
    accessibilityLevel1Count,
    accessibilityLevel2Count,
    isAccessibilityReportOpen,
}: {
    accessibilityLevel1Count: number;
    accessibilityLevel2Count: number;
    isAccessibilityReportOpen: boolean;
}) {
    const action = isAccessibilityReportOpen ? "close" : "open";

    if (accessibilityLevel1Count > 0) {
        return `WCAG AA accessibility violation identified. Click to ${action} accessibility report.`;
    }

    if (accessibilityLevel2Count > 0) {
        return `Click to ${action} accessibility report. No WCAG AA violations were found, but additional accessibility recommendations are available.`;
    }

    return `Click to ${action} accessibility report. No accessibility issues were found.`;
}

/**
 * Returns an accessible label that includes diagnostic counts and toggle action.
 */
function getAccessibilityStatusAriaLabel({
    accessibilityLevel1Count,
    accessibilityLevel2Count,
    isAccessibilityReportOpen,
}: {
    accessibilityLevel1Count: number;
    accessibilityLevel2Count: number;
    isAccessibilityReportOpen: boolean;
}) {
    const action = isAccessibilityReportOpen ? "close" : "open";

    if (accessibilityLevel1Count > 0) {
        return `WCAG AA accessibility violation identified. ${accessibilityLevel1Count} WCAG AA violation${accessibilityLevel1Count === 1 ? "" : "s"} found. Click to ${action} accessibility report.`;
    }

    if (accessibilityLevel2Count > 0) {
        return `No WCAG AA violations identified. ${accessibilityLevel2Count} additional accessibility recommendation${accessibilityLevel2Count === 1 ? "" : "s"} found. Click to ${action} accessibility report.`;
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
    return (
        <button
            type="button"
            className={`accessibility-status-button ${
                accessibilityLevel1Count > 0
                    ? "has-level-1-issues"
                    : "no-level-1-issues"
            }`}
            onClick={onToggle}
            title={getAccessibilityStatusTitle({
                accessibilityLevel1Count,
                accessibilityLevel2Count,
                isAccessibilityReportOpen,
            })}
            aria-label={getAccessibilityStatusAriaLabel({
                accessibilityLevel1Count,
                accessibilityLevel2Count,
                isAccessibilityReportOpen,
            })}
        >
            {accessibilityLevel1Count > 0 ? (
                <>
                    <IoAccessibility />
                    <span>WCAG</span>
                </>
            ) : (
                <IoAccessibility />
            )}
        </button>
    );
}

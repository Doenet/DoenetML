import React, { ReactElement, ReactNode, useEffect, useRef } from "react";
import { TabProvider, TabPanel, TabStore } from "@ariakit/react";
import {
    BsExclamationTriangleFill,
    BsInfoCircleFill,
    BsXOctagonFill,
} from "react-icons/bs";
import { IoAccessibility } from "react-icons/io5";
import classNames from "classnames";
import {
    AccessibilityRecord,
    ErrorRecord,
    InfoRecord,
    WarningRecord,
} from "@doenet/utils";
import { renderDiagnosticMarkdownHtml } from "@doenet/utils/diagnostics/renderDiagnosticMarkdownHtml";
import type { HelpContent } from "@doenet/lsp-tools";
import { ContextHelpPanel } from "./contextHelp/ContextHelpPanel";
import { useT } from "../utils/i18n";
import { fillSlots, slot } from "./slots";
import type { Translator } from "@doenet/i18n";

type SubmittedResponse = {
    answerId: string;
    response: ReactElement;
    creditAchieved: number;
    submittedAt: string;
};

/** IDs of the tabs available in the diagnostics/responses/help panel. */
export type DiagnosticsTabId =
    "errors" | "warnings" | "info" | "accessibility" | "responses" | "help";

/**
 * Human-readable label for diagnostic source line, when position exists.
 *
 * The line arrives as text rather than as a number, so Fluent hands it to no
 * `Intl.NumberFormat`: it identifies the line, and line 1234 is "#1234" rather
 * than "#1,234". Same rule `rangeArgs` follows for the error box.
 */
function diagnosticLocationLabel(
    t: Translator,
    diagnostic: {
        position?: { start: { line: number } };
    },
) {
    if (!diagnostic.position) {
        return null;
    }
    const line = String(diagnostic.position.start.line);
    return t("editor-diagnostic-line", { line }, `Line #${line}`);
}

/** Stable identity for diagnostic list rendering keys. */
function diagnosticIdentityKey(diagnostic: {
    type?: string;
    level?: number;
    message: string;
    sourceDoc?: number;
    position?: {
        start?: { line?: number; column?: number; offset?: number };
        end?: { line?: number; column?: number; offset?: number };
    };
}) {
    return [
        diagnostic.type ?? "",
        diagnostic.level ?? "",
        diagnostic.message,
        diagnostic.sourceDoc ?? "",
        diagnostic.position?.start?.line ?? "",
        diagnostic.position?.start?.column ?? "",
        diagnostic.position?.start?.offset ?? "",
        diagnostic.position?.end?.line ?? "",
        diagnostic.position?.end?.column ?? "",
        diagnostic.position?.end?.offset ?? "",
    ].join("|");
}

/** Helper function to format diagnostic message with markdown rendering. */
function FormattedDiagnosticMessage({ message }: { message: string }) {
    const html = renderDiagnosticMarkdownHtml(message);
    return (
        <div
            className="diagnostic-entry-message"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}

/** Shared list renderer for diagnostics across tab panels. */
function DiagnosticList({
    diagnostics,
    emptyMessage,
    testPrefix,
    icon,
    iconClassName,
}: {
    diagnostics: Array<{
        type?: string;
        level?: number;
        message: string;
        sourceDoc?: number;
        position?: { start: { line: number } };
    }>;
    emptyMessage: ReactNode;
    testPrefix: string;
    icon: ReactElement;
    iconClassName: string;
}) {
    const t = useT();
    if (diagnostics.length === 0) {
        return <>{emptyMessage}</>;
    }

    const diagnosticIdentityCounts = new Map<string, number>();

    return (
        <ul className="diagnostic-list">
            {diagnostics.map((diagnostic, i) => {
                const location = diagnosticLocationLabel(t, diagnostic);
                const identity = diagnosticIdentityKey(diagnostic);
                const currentCount =
                    diagnosticIdentityCounts.get(identity) ?? 0;
                diagnosticIdentityCounts.set(identity, currentCount + 1);
                const key =
                    currentCount === 0
                        ? identity
                        : `${identity}#${currentCount}`;

                return (
                    <li
                        key={key}
                        data-test={`${testPrefix} ${i}`}
                        className="diagnostic-entry"
                    >
                        <span
                            className={classNames(
                                "diagnostic-entry-icon",
                                iconClassName,
                            )}
                        >
                            {icon}
                        </span>
                        <div>
                            {location ? (
                                <span className="diagnostic-entry-location">
                                    {location}
                                </span>
                            ) : null}
                            <FormattedDiagnosticMessage
                                message={diagnostic.message}
                            />
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}

/** The name of the standard, which no locale translates. */
const WCAG_AA = "WCAG AA";

const WCAG_URL = "https://www.w3.org/WAI/standards-guidelines/wcag/";

/**
 * "Accessibility violations (WCAG AA)", with the standard's name linked.
 *
 * The heading is one message rather than two halves with a link between them,
 * so its wording and the brackets around the name are the catalog's while the
 * link stays the code's — see {@link fillSlots} for the mechanism and why the
 * argument is a marker rather than the name itself.
 */
function AccessibilityViolationsHeading() {
    const t = useT();
    return fillSlots(
        t(
            "editor-accessibility-violations-heading",
            { standard: slot(0) },
            `Accessibility violations (${slot(0)})`,
        ),
        [
            <a href={WCAG_URL} target="_blank">
                {WCAG_AA}
            </a>,
        ],
    );
}

/** Checkbox used to show/hide selected diagnostic annotations in the editor. */
function AnnotationToggle({
    checked,
    label,
    onChange,
}: {
    checked: boolean;
    label: string;
    onChange: (checked: boolean) => void;
}) {
    return (
        <label className="diagnostic-editor-toggle">
            <input
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
            />
            <span>{label}</span>
        </label>
    );
}

/**
 * Collapsible tab panels for diagnostics and submitted responses.
 * Handles auto-scroll behavior for newly appended responses.
 */
export function DiagnosticsResponseTabContents({
    store,
    warnings,
    errors,
    infos,
    accessibility,
    submittedResponses,
    isOpen,
    showDiagnostics = true,
    showResponses = true,
    showHelp = true,
    showInfoAnnotations,
    setShowInfoAnnotations,
    showAccessibilityAnnotations,
    setShowAccessibilityAnnotations,
    helpContent,
    docsURL,
}: {
    store: TabStore;
    warnings: WarningRecord[];
    errors: ErrorRecord[];
    infos: InfoRecord[];
    accessibility: AccessibilityRecord[];
    submittedResponses: SubmittedResponse[];
    isOpen: boolean;
    showDiagnostics?: boolean;
    showResponses?: boolean;
    showHelp?: boolean;
    showInfoAnnotations: boolean;
    setShowInfoAnnotations: (checked: boolean) => void;
    showAccessibilityAnnotations: boolean;
    setShowAccessibilityAnnotations: (checked: boolean) => void;
    helpContent: HelpContent;
    docsURL: string;
}) {
    const t = useT();
    const panels = useRef<HTMLDivElement>(null);
    const lastScrolledToBottom = useRef(true);

    function scrollToBottom() {
        if (panels.current) {
            setTimeout(() => {
                if (panels.current) {
                    panels.current.scrollTo(0, panels.current.scrollHeight);
                }
            });
        }
    }

    useEffect(() => {
        if (!panels.current) {
            return;
        }

        const panelElement = panels.current;

        function scrollListener() {
            lastScrolledToBottom.current =
                Math.abs(
                    panelElement.scrollHeight -
                        panelElement.scrollTop -
                        panelElement.clientHeight,
                ) <= 3.0;
        }

        panelElement.addEventListener("scroll", scrollListener);
        return () => {
            panelElement.removeEventListener("scroll", scrollListener);
        };
    }, [isOpen]);

    // Auto-scroll-to-bottom is desired only for the "responses" tab so the
    // most recent submission is in view; for other tabs it would jump the
    // user past the top of the report. Firing on `selectedTabIdForScroll`
    // changes too is intentional: switching to "responses" while the panel
    // is already open should also bring the latest submission into view.
    const selectedTabIdForScroll = store.useState("selectedId");
    useEffect(() => {
        if (isOpen && selectedTabIdForScroll === "responses") {
            scrollToBottom();
        }
    }, [isOpen, selectedTabIdForScroll]);

    useEffect(() => {
        if (isOpen && selectedTabIdForScroll === "responses") {
            if (lastScrolledToBottom.current) {
                scrollToBottom();
            }
        }
    }, [submittedResponses]);

    const level1Accessibility = accessibility.filter(
        (diagnostic) => diagnostic.level === 1,
    );
    const level2Accessibility = accessibility.filter(
        (diagnostic) => diagnostic.level === 2,
    );

    // Tolerate a trailing slash on the consumer-supplied `docsURL` so that
    // e.g. "https://docs.doenet.org/" doesn't produce a "//concepts/..." URL.
    const docsBase = docsURL.replace(/\/+$/, "");

    return (
        <div
            className={classNames("diagnostics-response-tabs-container", {
                "is-open": isOpen,
            })}
        >
            <TabProvider store={store}>
                {isOpen && (
                    <div
                        ref={panels}
                        className="diagnostics-response-tabs-panels"
                    >
                        {showDiagnostics && (
                            <TabPanel
                                store={store}
                                tabId="errors"
                                className="diagnostic-panel"
                            >
                                <DiagnosticList
                                    diagnostics={errors}
                                    emptyMessage={
                                        <h3>
                                            {t(
                                                "editor-no-errors",
                                                undefined,
                                                "No Errors",
                                            )}
                                        </h3>
                                    }
                                    testPrefix="Error"
                                    icon={<BsXOctagonFill />}
                                    iconClassName="is-error"
                                />
                            </TabPanel>
                        )}
                        {showDiagnostics && (
                            <TabPanel
                                store={store}
                                tabId="warnings"
                                className="diagnostic-panel"
                            >
                                <DiagnosticList
                                    diagnostics={warnings}
                                    emptyMessage={
                                        <h3>
                                            {t(
                                                "editor-no-warnings",
                                                undefined,
                                                "No Warnings",
                                            )}
                                        </h3>
                                    }
                                    testPrefix="Warning"
                                    icon={<BsExclamationTriangleFill />}
                                    iconClassName="is-warning"
                                />
                            </TabPanel>
                        )}
                        {showDiagnostics && (
                            <TabPanel
                                store={store}
                                tabId="info"
                                className="diagnostic-panel"
                            >
                                <AnnotationToggle
                                    checked={showInfoAnnotations}
                                    label={t(
                                        "editor-show-info-annotations",
                                        undefined,
                                        "Show info diagnostics in editor",
                                    )}
                                    onChange={setShowInfoAnnotations}
                                />
                                <DiagnosticList
                                    diagnostics={infos}
                                    emptyMessage={
                                        <h3>
                                            {t(
                                                "editor-no-info",
                                                undefined,
                                                "No Info Diagnostics",
                                            )}
                                        </h3>
                                    }
                                    testPrefix="Info"
                                    icon={<BsInfoCircleFill />}
                                    iconClassName="is-info"
                                />
                            </TabPanel>
                        )}
                        {showDiagnostics && (
                            <TabPanel
                                store={store}
                                tabId="accessibility"
                                className="diagnostic-panel accessibility-report"
                            >
                                <AnnotationToggle
                                    checked={showAccessibilityAnnotations}
                                    label={t(
                                        "editor-show-accessibility-annotations",
                                        undefined,
                                        "Show accessibility diagnostics in editor",
                                    )}
                                    onChange={setShowAccessibilityAnnotations}
                                />
                                <p className="accessibility-report-intro">
                                    <a
                                        href={`${docsBase}/concepts/accessibility`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {t(
                                            "editor-accessibility-learn-more",
                                            undefined,
                                            "Learn how Doenet approaches accessibility",
                                        )}
                                    </a>
                                </p>
                                <section className="accessibility-report-section">
                                    <div className="accessibility-report-heading critical">
                                        <h3>
                                            <AccessibilityViolationsHeading />
                                        </h3>
                                    </div>
                                    <DiagnosticList
                                        diagnostics={level1Accessibility}
                                        emptyMessage={
                                            <p>
                                                {t(
                                                    "editor-none-found",
                                                    undefined,
                                                    "None found",
                                                )}
                                            </p>
                                        }
                                        testPrefix="WCAG AA Accessibility Violation"
                                        icon={<IoAccessibility />}
                                        iconClassName="is-accessibility-critical"
                                    />
                                </section>
                                <section className="accessibility-report-section">
                                    <div className="accessibility-report-heading advisory">
                                        <h3>
                                            {t(
                                                "editor-accessibility-other-heading",
                                                undefined,
                                                "Other accessibility issues",
                                            )}
                                        </h3>
                                    </div>
                                    <DiagnosticList
                                        diagnostics={level2Accessibility}
                                        emptyMessage={
                                            <p>
                                                {t(
                                                    "editor-none-found",
                                                    undefined,
                                                    "None found",
                                                )}
                                            </p>
                                        }
                                        testPrefix="Accessibility alert"
                                        icon={<IoAccessibility />}
                                        iconClassName="is-accessibility-advisory"
                                    />
                                </section>
                            </TabPanel>
                        )}
                        {showResponses && (
                            <TabPanel
                                store={store}
                                tabId="responses"
                                className="diagnostic-panel"
                            >
                                {submittedResponses.length == 0 ? (
                                    <h3>
                                        {t(
                                            "editor-no-responses",
                                            undefined,
                                            "No submitted responses yet",
                                        )}
                                    </h3>
                                ) : (
                                    <div style={{ minWidth: "fit-content" }}>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th scope="col">
                                                        {t(
                                                            "editor-response-answer-id",
                                                            undefined,
                                                            "Answer Id",
                                                        )}
                                                    </th>
                                                    <th scope="col">
                                                        {t(
                                                            "editor-response-response",
                                                            undefined,
                                                            "Response",
                                                        )}
                                                    </th>
                                                    <th scope="col">
                                                        {t(
                                                            "editor-response-credit",
                                                            undefined,
                                                            "Credit",
                                                        )}
                                                    </th>
                                                    <th scope="col">
                                                        {t(
                                                            "editor-response-submitted",
                                                            undefined,
                                                            "Submitted",
                                                        )}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {submittedResponses.map(
                                                    (resp, i) => {
                                                        return (
                                                            <tr key={i}>
                                                                <td>
                                                                    {
                                                                        resp.answerId
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        resp.response
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {Math.round(
                                                                        resp.creditAchieved *
                                                                            1000,
                                                                    ) / 10}
                                                                    %
                                                                </td>
                                                                <td>
                                                                    {
                                                                        resp.submittedAt
                                                                    }
                                                                </td>
                                                            </tr>
                                                        );
                                                    },
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </TabPanel>
                        )}
                        {showHelp && (
                            <TabPanel
                                store={store}
                                tabId="help"
                                className="diagnostic-panel"
                            >
                                <ContextHelpPanel
                                    content={helpContent}
                                    docsURL={docsURL}
                                />
                            </TabPanel>
                        )}
                    </div>
                )}
            </TabProvider>
        </div>
    );
}

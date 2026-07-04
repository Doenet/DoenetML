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

type SubmittedResponse = {
    answerId: string;
    response: ReactElement;
    creditAchieved: number;
    submittedAt: string;
};

/** IDs of the tabs available in the diagnostics/responses/help panel. */
export type DiagnosticsTabId =
    "errors" | "warnings" | "info" | "accessibility" | "responses" | "help";

/** Human-readable label for diagnostic source line, when position exists. */
function diagnosticLocationLabel(diagnostic: {
    position?: { start: { line: number } };
}) {
    return diagnostic.position
        ? `Line #${diagnostic.position.start.line}`
        : null;
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
    if (diagnostics.length === 0) {
        return <>{emptyMessage}</>;
    }

    const diagnosticIdentityCounts = new Map<string, number>();

    return (
        <ul className="diagnostic-list">
            {diagnostics.map((diagnostic, i) => {
                const location = diagnosticLocationLabel(diagnostic);
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
                                    emptyMessage={<h3>No Errors</h3>}
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
                                    emptyMessage={<h3>No Warnings</h3>}
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
                                    label="Show info diagnostics in editor"
                                    onChange={setShowInfoAnnotations}
                                />
                                <DiagnosticList
                                    diagnostics={infos}
                                    emptyMessage={<h3>No Info Diagnostics</h3>}
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
                                    label="Show accessibility diagnostics in editor"
                                    onChange={setShowAccessibilityAnnotations}
                                />
                                <p className="accessibility-report-intro">
                                    <a
                                        href={`${docsBase}/concepts/accessibility`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Learn how Doenet approaches
                                        accessibility
                                    </a>
                                </p>
                                <section className="accessibility-report-section">
                                    <div className="accessibility-report-heading critical">
                                        <h3>
                                            Accessibility violations (
                                            <a
                                                href="https://www.w3.org/WAI/standards-guidelines/wcag/"
                                                target="_blank"
                                            >
                                                WCAG AA
                                            </a>
                                            )
                                        </h3>
                                    </div>
                                    <DiagnosticList
                                        diagnostics={level1Accessibility}
                                        emptyMessage={<p>None found</p>}
                                        testPrefix="WCAG AA Accessibility Violation"
                                        icon={<IoAccessibility />}
                                        iconClassName="is-accessibility-critical"
                                    />
                                </section>
                                <section className="accessibility-report-section">
                                    <div className="accessibility-report-heading advisory">
                                        <h3>Other accessibility issues</h3>
                                    </div>
                                    <DiagnosticList
                                        diagnostics={level2Accessibility}
                                        emptyMessage={<p>None found</p>}
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
                                    <h3>No submitted responses yet</h3>
                                ) : (
                                    <div style={{ minWidth: "fit-content" }}>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th scope="col">
                                                        Answer Id
                                                    </th>
                                                    <th scope="col">
                                                        Response
                                                    </th>
                                                    <th scope="col">Credit</th>
                                                    <th scope="col">
                                                        Submitted
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

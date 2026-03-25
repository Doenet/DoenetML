import React, { ReactElement, useEffect, useRef } from "react";
import {
    Button,
    Tab,
    TabProvider,
    TabList,
    TabPanel,
    TabStore,
} from "@ariakit/react";
import {
    BsChatSquareTextFill,
    BsExclamationTriangleFill,
    BsInfoCircleFill,
    BsX,
    BsXOctagonFill,
} from "react-icons/bs";
import { IoAccessibility } from "react-icons/io5";
import classNames from "classnames";
import {
    AccessibilityRecord,
    DiagnosticRecord,
    ErrorRecord,
    WarningRecord,
} from "@doenet/utils";

type InfoRecord = DiagnosticRecord & { type: "info" };

type SubmittedResponse = {
    answerId: string;
    response: ReactElement;
    creditAchieved: number;
    submittedAt: string;
};

/** Human-readable label for diagnostic source line, when position exists. */
function diagnosticLocationLabel(diagnostic: {
    position?: { start: { line: number } };
}) {
    return diagnostic.position
        ? `Line #${diagnostic.position.start.line}`
        : null;
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
        message: string;
        position?: { start: { line: number } };
    }>;
    emptyMessage: string;
    testPrefix: string;
    icon: ReactElement;
    iconClassName: string;
}) {
    if (diagnostics.length === 0) {
        return <h3>{emptyMessage}</h3>;
    }

    return (
        <ul className="diagnostic-list">
            {diagnostics.map((diagnostic, i) => {
                const location = diagnosticLocationLabel(diagnostic);

                return (
                    <li
                        key={i}
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
                        <span>
                            {location ? (
                                <span className="diagnostic-entry-location">
                                    {location}
                                </span>
                            ) : null}
                            {diagnostic.message}
                        </span>
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

/** Tab trigger with icon + count badge used by diagnostics and responses tabs. */
function TabTrigger({
    id,
    icon,
    label,
    count,
}: {
    id: string;
    icon: ReactElement;
    label: string;
    count: number;
}) {
    return (
        <Tab
            id={id}
            title={label}
            aria-label={`${label}: ${count}`}
            className="diagnostic-tab-trigger"
        >
            <span className="diagnostic-tab-icon">{icon}</span>
            <span className="diagnostic-tab-count">{count}</span>
        </Tab>
    );
}

/**
 * The tabstrip to control the display of the diagnostics and responses tabs.
 */
export function DiagnosticsResponseTabstrip({
    store,
    isOpen,
    showDiagnostics,
    warnings,
    errors,
    infos,
    accessibility,
    submittedResponses,
    setIsOpen,
    showResponses,
}: {
    store: TabStore;

    warnings: WarningRecord[];
    errors: ErrorRecord[];
    infos: InfoRecord[];
    accessibility: AccessibilityRecord[];
    submittedResponses: SubmittedResponse[];
    isOpen: boolean;
    setIsOpen: (arg: boolean) => void;
    showDiagnostics?: boolean;
    showResponses?: boolean;
}) {
    return (
        <TabProvider store={store}>
            <TabList
                onClick={(e) => {
                    if (!isOpen) {
                        setIsOpen(true);
                    }
                }}
                className="diagnostics-response-tabs"
                store={store}
            >
                {showDiagnostics && (
                    <TabTrigger
                        id="errors"
                        icon={<BsXOctagonFill />}
                        label="Errors"
                        count={errors.length}
                    />
                )}
                {showDiagnostics && (
                    <TabTrigger
                        id="warnings"
                        icon={<BsExclamationTriangleFill />}
                        label="Warnings"
                        count={warnings.length}
                    />
                )}
                {showDiagnostics && (
                    <TabTrigger
                        id="info"
                        icon={<BsInfoCircleFill />}
                        label="Info"
                        count={infos.length}
                    />
                )}
                {showDiagnostics && (
                    <TabTrigger
                        id="accessibility"
                        icon={<IoAccessibility />}
                        label="Accessibility"
                        count={accessibility.length}
                    />
                )}
                {showResponses && (
                    <TabTrigger
                        id="responses"
                        icon={<BsChatSquareTextFill />}
                        label="Submitted responses"
                        count={submittedResponses.length}
                    />
                )}
                <div
                    style={{
                        flexGrow: 1,
                    }}
                />
                {isOpen ? (
                    <Button
                        title="Close panel"
                        className="close-button"
                        onClick={() => {
                            setIsOpen(false);
                        }}
                    >
                        <BsX />
                    </Button>
                ) : null}
            </TabList>
        </TabProvider>
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
    setIsOpen,
    showDiagnostics = true,
    showResponses = true,
    showWarningAnnotations,
    setShowWarningAnnotations,
    showInfoAnnotations,
    setShowInfoAnnotations,
    showAccessibilityAnnotations,
    setShowAccessibilityAnnotations,
}: {
    store: TabStore;
    warnings: WarningRecord[];
    errors: ErrorRecord[];
    infos: InfoRecord[];
    accessibility: AccessibilityRecord[];
    submittedResponses: SubmittedResponse[];
    isOpen: boolean;
    setIsOpen: (arg: boolean) => void;
    showDiagnostics?: boolean;
    showResponses?: boolean;
    showWarningAnnotations: boolean;
    setShowWarningAnnotations: (checked: boolean) => void;
    showInfoAnnotations: boolean;
    setShowInfoAnnotations: (checked: boolean) => void;
    showAccessibilityAnnotations: boolean;
    setShowAccessibilityAnnotations: (checked: boolean) => void;
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

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
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
                                    emptyMessage="No Errors"
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
                                <AnnotationToggle
                                    checked={showWarningAnnotations}
                                    label="Show warnings in editor"
                                    onChange={setShowWarningAnnotations}
                                />
                                <DiagnosticList
                                    diagnostics={warnings}
                                    emptyMessage="No Warnings"
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
                                    emptyMessage="No Info Diagnostics"
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
                                <section className="accessibility-report-section">
                                    <div className="accessibility-report-heading critical">
                                        <IoAccessibility />
                                        <h3>WCAG AA Violations</h3>
                                    </div>
                                    <DiagnosticList
                                        diagnostics={level1Accessibility}
                                        emptyMessage="No WCAG AA violations"
                                        testPrefix="WCAG AA Accessibility Violation"
                                        icon={<IoAccessibility />}
                                        iconClassName="is-accessibility-critical"
                                    />
                                </section>
                                <section className="accessibility-report-section">
                                    <div className="accessibility-report-heading advisory">
                                        <IoAccessibility />
                                        <h3>Other Accessibility Issues</h3>
                                    </div>
                                    <DiagnosticList
                                        diagnostics={level2Accessibility}
                                        emptyMessage="No additional accessibility issues"
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
                                                    <td>Answer Id</td>
                                                    <td>Response</td>
                                                    <td>Credit</td>
                                                    <td>Submitted</td>
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
                    </div>
                )}
            </TabProvider>
        </div>
    );
}

import React, { ReactElement } from "react";
import {
    Menu,
    MenuButton,
    MenuItem,
    MenuProvider,
    Tab,
    TabList,
    TabProvider,
    TabStore,
} from "@ariakit/react";
import {
    BsChatSquareText,
    BsChatSquareTextFill,
    BsCodeSlash,
    BsExclamationTriangle,
    BsExclamationTriangleFill,
    BsInfoCircle,
    BsInfoCircleFill,
    BsThreeDotsVertical,
    BsXOctagon,
    BsXOctagonFill,
} from "react-icons/bs";
import { IoAccessibility, IoAccessibilityOutline } from "react-icons/io5";
import classNames from "classnames";
import type { DiagnosticsTabId } from "./DiagnosticsResponseTabs";
import type { DiagnosticsSummary } from "./diagnostics";

/**
 * Tab trigger with icon + optional count badge used by the editor footer to
 * drive the diagnostics/responses/help panel. The click is intercepted by the
 * footer so an active+selected click can close the panel rather than re-select.
 * Pass `inlineLabel` to render a short text label next to the icon (used by
 * the help tab); otherwise pass `count` to render a numeric badge.
 */
function TabTrigger({
    id,
    icon,
    label,
    count,
    inlineLabel,
    iconClassName,
    onActivate,
}: {
    id: DiagnosticsTabId;
    icon: ReactElement;
    label: string;
    count?: number;
    inlineLabel?: string;
    iconClassName?: string;
    onActivate: (tabId: DiagnosticsTabId) => void;
}) {
    return (
        <Tab
            id={id}
            title={label}
            aria-label={count === undefined ? label : `${label}: ${count}`}
            className="diagnostic-tab-trigger"
            data-test={`footer-tab-${id}`}
            onClick={() => onActivate(id)}
        >
            <span className={classNames("diagnostic-tab-icon", iconClassName)}>
                {icon}
            </span>
            {inlineLabel !== undefined && (
                <span className="diagnostic-tab-label">{inlineLabel}</span>
            )}
            {count !== undefined && (
                <span className="diagnostic-tab-count">{count}</span>
            )}
        </Tab>
    );
}

/**
 * Combined editor footer (left → right):
 *  - DoenetML version (truncates to `v…` with the full version in the tooltip)
 *  - help tab (`</> Context`) in its own group
 *  - diagnostics group (errors / warnings / info / accessibility)
 *  - submitted-responses tab in its own group
 *  - three-dot menu on the far right (formatter actions when available)
 *
 * Groups are visually separated by `.footer-icons-group-gap` spacers.
 *
 * `reserveKeyboardButtonSpace` shifts the three-dot menu inward to clear the
 * virtual keyboard's open-keyboard tab when the footer's right edge meets it
 * (showViewer={false} or viewerLocation in {"left","top"} with the keyboard
 * enabled). Narrow viewports may still let the menu collide with the keyboard
 * tab; that's accepted for now.
 */
export function EditorFooter({
    store,
    isOpen,
    activateTab,
    showDiagnostics,
    showResponses,
    showHelp,
    showFormatter,
    reserveKeyboardButtonSpace,
    onFormat,
    diagnosticsSummary,
    submittedResponsesCount,
}: {
    store: TabStore;
    isOpen: boolean;
    activateTab: (tabId: DiagnosticsTabId) => void;
    showDiagnostics: boolean;
    showResponses: boolean;
    showHelp: boolean;
    showFormatter: boolean;
    reserveKeyboardButtonSpace: boolean;
    onFormat: (asDoenetML: boolean) => Promise<void>;
    diagnosticsSummary: DiagnosticsSummary;
    submittedResponsesCount: number;
}) {
    const {
        warningsCount,
        errorsCount,
        infosCount,
        accessibilityLevel1Count,
        accessibilityLevel2Count,
    } = diagnosticsSummary;
    const accessibilityCount =
        accessibilityLevel1Count + accessibilityLevel2Count;

    const anyTabs = showDiagnostics || showResponses || showHelp;

    return (
        <div
            className={classNames("editor-footer", {
                "reserve-keyboard-button-space": reserveKeyboardButtonSpace,
            })}
        >
            <div
                className="doenetml-version"
                title={`DoenetML version ${DOENETML_VERSION}`}
            >
                v{DOENETML_VERSION}
            </div>
            {anyTabs && (
                <TabProvider store={store}>
                    <TabList
                        store={store}
                        className={classNames("footer-icons", {
                            "is-open": isOpen,
                        })}
                    >
                        {showHelp && (
                            <TabTrigger
                                id="help"
                                icon={<BsCodeSlash />}
                                iconClassName="is-help"
                                label="Context-sensitive help"
                                inlineLabel="Context"
                                onActivate={activateTab}
                            />
                        )}
                        {showHelp && showDiagnostics && (
                            <div
                                className="footer-icons-group-gap"
                                aria-hidden="true"
                            />
                        )}
                        {showDiagnostics && (
                            <TabTrigger
                                id="errors"
                                icon={
                                    errorsCount > 0 ? (
                                        <BsXOctagonFill />
                                    ) : (
                                        <BsXOctagon />
                                    )
                                }
                                iconClassName={
                                    errorsCount > 0 ? "is-error" : undefined
                                }
                                label="Errors"
                                count={errorsCount}
                                onActivate={activateTab}
                            />
                        )}
                        {showDiagnostics && (
                            <TabTrigger
                                id="warnings"
                                icon={
                                    warningsCount > 0 ? (
                                        <BsExclamationTriangleFill />
                                    ) : (
                                        <BsExclamationTriangle />
                                    )
                                }
                                iconClassName={
                                    warningsCount > 0 ? "is-warning" : undefined
                                }
                                label="Warnings"
                                count={warningsCount}
                                onActivate={activateTab}
                            />
                        )}
                        {showDiagnostics && (
                            <TabTrigger
                                id="info"
                                icon={
                                    infosCount > 0 ? (
                                        <BsInfoCircleFill />
                                    ) : (
                                        <BsInfoCircle />
                                    )
                                }
                                iconClassName={
                                    infosCount > 0 ? "is-info" : undefined
                                }
                                label="Info"
                                count={infosCount}
                                onActivate={activateTab}
                            />
                        )}
                        {showDiagnostics && (
                            <TabTrigger
                                id="accessibility"
                                icon={
                                    accessibilityCount > 0 ? (
                                        <IoAccessibility />
                                    ) : (
                                        <IoAccessibilityOutline />
                                    )
                                }
                                iconClassName={
                                    accessibilityLevel1Count > 0
                                        ? "is-accessibility-critical"
                                        : accessibilityLevel2Count > 0
                                          ? "is-accessibility-advisory"
                                          : undefined
                                }
                                label="Accessibility"
                                count={accessibilityCount}
                                onActivate={activateTab}
                            />
                        )}
                        {showResponses && (showHelp || showDiagnostics) && (
                            <div
                                className="footer-icons-group-gap"
                                aria-hidden="true"
                            />
                        )}
                        {showResponses && (
                            <TabTrigger
                                id="responses"
                                icon={
                                    submittedResponsesCount > 0 ? (
                                        <BsChatSquareTextFill />
                                    ) : (
                                        <BsChatSquareText />
                                    )
                                }
                                iconClassName={
                                    submittedResponsesCount > 0
                                        ? "is-responses"
                                        : undefined
                                }
                                label="Submitted responses"
                                count={submittedResponsesCount}
                                onActivate={activateTab}
                            />
                        )}
                    </TabList>
                </TabProvider>
            )}
            {showFormatter && (
                <MenuProvider>
                    <MenuButton
                        className="footer-menu-button"
                        title="Editor options"
                        aria-label="Editor options"
                        data-test="footer-menu-button"
                    >
                        <BsThreeDotsVertical />
                    </MenuButton>
                    <Menu className="footer-menu" gutter={4}>
                        <MenuItem
                            className="footer-menu-item"
                            onClick={() => {
                                onFormat(true).catch((err) =>
                                    console.error(
                                        "EditorFooter: format as DoenetML failed",
                                        err,
                                    ),
                                );
                            }}
                            data-test="footer-menu-format-doenetml"
                        >
                            Format as DoenetML
                        </MenuItem>
                        <MenuItem
                            className="footer-menu-item"
                            onClick={() => {
                                onFormat(false).catch((err) =>
                                    console.error(
                                        "EditorFooter: format as XML failed",
                                        err,
                                    ),
                                );
                            }}
                            data-test="footer-menu-format-xml"
                        >
                            Format as XML
                        </MenuItem>
                    </Menu>
                </MenuProvider>
            )}
        </div>
    );
}

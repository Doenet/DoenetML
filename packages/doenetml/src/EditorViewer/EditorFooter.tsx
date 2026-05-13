import React, { useCallback } from "react";
import {
    Menu,
    MenuButton,
    MenuItem,
    MenuProvider,
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
import {
    AccessibilityRecord,
    ErrorRecord,
    InfoRecord,
    WarningRecord,
} from "@doenet/utils";
import { TabTrigger } from "./DiagnosticsResponseTabs";
import type { DiagnosticsTabId } from "./DiagnosticsResponseTabs";

/**
 * Combined editor footer (left → right):
 *  - DoenetML version (truncates to `v…` with the full version in the tooltip)
 *  - help tab (`</> Context`) in its own group
 *  - diagnostics group (errors / warnings / info / accessibility)
 *  - submitted-responses tab in its own group
 *  - three-dot menu on the far right (formatter actions when available)
 *
 * Groups are visually separated by `.footer-icons-group-gap` spacers.
 */
export function EditorFooter({
    store,
    isOpen,
    activateTab,
    showDiagnostics,
    showResponses,
    showHelp,
    formatterAvailable,
    onFormat,
    warnings,
    errors,
    infos,
    accessibility,
    submittedResponses,
}: {
    store: TabStore;
    isOpen: boolean;
    activateTab: (tabId: DiagnosticsTabId) => void;
    showDiagnostics: boolean;
    showResponses: boolean;
    showHelp: boolean;
    formatterAvailable: boolean;
    onFormat: (asDoenetML: boolean) => void;
    warnings: WarningRecord[];
    errors: ErrorRecord[];
    infos: InfoRecord[];
    accessibility: AccessibilityRecord[];
    submittedResponses: { length: number };
}) {
    const handleActivate = useCallback(
        (tabId: string) => {
            activateTab(tabId as DiagnosticsTabId);
        },
        [activateTab],
    );

    const hasLevel1Accessibility = accessibility.some((d) => d.level === 1);
    const hasLevel2Accessibility = accessibility.some((d) => d.level === 2);

    const anyTabs = showDiagnostics || showResponses || showHelp;

    return (
        <div className="editor-footer">
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
                                onActivate={handleActivate}
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
                                    errors.length > 0 ? (
                                        <BsXOctagonFill />
                                    ) : (
                                        <BsXOctagon />
                                    )
                                }
                                iconClassName={
                                    errors.length > 0 ? "is-error" : undefined
                                }
                                label="Errors"
                                count={errors.length}
                                onActivate={handleActivate}
                            />
                        )}
                        {showDiagnostics && (
                            <TabTrigger
                                id="warnings"
                                icon={
                                    warnings.length > 0 ? (
                                        <BsExclamationTriangleFill />
                                    ) : (
                                        <BsExclamationTriangle />
                                    )
                                }
                                iconClassName={
                                    warnings.length > 0
                                        ? "is-warning"
                                        : undefined
                                }
                                label="Warnings"
                                count={warnings.length}
                                onActivate={handleActivate}
                            />
                        )}
                        {showDiagnostics && (
                            <TabTrigger
                                id="info"
                                icon={
                                    infos.length > 0 ? (
                                        <BsInfoCircleFill />
                                    ) : (
                                        <BsInfoCircle />
                                    )
                                }
                                iconClassName={
                                    infos.length > 0 ? "is-info" : undefined
                                }
                                label="Info"
                                count={infos.length}
                                onActivate={handleActivate}
                            />
                        )}
                        {showDiagnostics && (
                            <TabTrigger
                                id="accessibility"
                                icon={
                                    hasLevel1Accessibility ||
                                    hasLevel2Accessibility ? (
                                        <IoAccessibility />
                                    ) : (
                                        <IoAccessibilityOutline />
                                    )
                                }
                                iconClassName={
                                    hasLevel1Accessibility
                                        ? "is-accessibility-critical"
                                        : hasLevel2Accessibility
                                          ? "is-accessibility-advisory"
                                          : undefined
                                }
                                label="Accessibility"
                                count={accessibility.length}
                                onActivate={handleActivate}
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
                                    submittedResponses.length > 0 ? (
                                        <BsChatSquareTextFill />
                                    ) : (
                                        <BsChatSquareText />
                                    )
                                }
                                iconClassName={
                                    submittedResponses.length > 0
                                        ? "is-responses"
                                        : undefined
                                }
                                label="Submitted responses"
                                count={submittedResponses.length}
                                onActivate={handleActivate}
                            />
                        )}
                    </TabList>
                </TabProvider>
            )}
            {formatterAvailable && (
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
                            onClick={() => onFormat(true)}
                            data-test="footer-menu-format-doenetml"
                        >
                            Format as DoenetML
                        </MenuItem>
                        <MenuItem
                            className="footer-menu-item"
                            onClick={() => onFormat(false)}
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

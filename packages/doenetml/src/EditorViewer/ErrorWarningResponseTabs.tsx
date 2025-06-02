import React, { ReactElement, useEffect, useRef } from "react";
import {
    Button,
    Tab,
    TabProvider,
    TabList,
    TabPanel,
    useTabStore,
    TabStore,
} from "@ariakit/react";
import { BsExclamationTriangleFill, BsX } from "react-icons/bs";
import classNames from "classnames";
import { ErrorRecord, WarningRecord } from "@doenet/utils";

/**
 * The tabstrip to control the display of the errors and warnings tabs.
 */
export function ErrorWarningResponseTabstrip({
    store,
    isOpen,
    showErrorsWarnings,
    warnings,
    errors,
    submittedResponses,
    setIsOpen,
    showResponses,
}: {
    store: TabStore;

    warnings: WarningRecord[];
    errors: ErrorRecord[];
    submittedResponses: {
        answerId: string;
        response: ReactElement;
        creditAchieved: number;
        submittedAt: string;
    }[];
    isOpen: boolean;
    setIsOpen: (arg: boolean) => void;
    showErrorsWarnings?: boolean;
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
                className="error-warning-response-tabs"
                store={store}
            >
                {showErrorsWarnings && (
                    <Tab>
                        {warnings.length} Warning
                        {warnings.length != 1 && "s"}
                    </Tab>
                )}
                {showErrorsWarnings && (
                    <Tab>
                        {errors.length} Error
                        {errors.length != 1 && "s"}
                    </Tab>
                )}
                {showResponses && (
                    <Tab>
                        {submittedResponses.length} Submitted response
                        {submittedResponses.length != 1 && "s"}
                    </Tab>
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

export function ErrorWarningResponseTabContents({
    store,
    warnings,
    errors,
    submittedResponses,
    isOpen,
    setIsOpen,
    showErrorsWarnings = true,
    showResponses = true,
}: {
    store: TabStore;
    warnings: WarningRecord[];
    errors: ErrorRecord[];
    submittedResponses: {
        answerId: string;
        response: ReactElement;
        creditAchieved: number;
        submittedAt: string;
    }[];
    isOpen: boolean;
    setIsOpen: (arg: boolean) => void;
    showErrorsWarnings?: boolean;
    showResponses?: boolean;
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
        function scrollListener() {
            if (panels.current) {
                lastScrolledToBottom.current =
                    Math.abs(
                        panels.current.scrollHeight -
                            panels.current.scrollTop -
                            panels.current.clientHeight,
                    ) <= 3.0;
            }
        }

        panels.current?.addEventListener("scroll", scrollListener);
        return () => {
            panels.current?.removeEventListener("scroll", scrollListener);
        };
    }, [panels.current]);

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

    return (
        <div
            className={classNames("error-warning-response-tabs-container", {
                "is-open": isOpen,
            })}
        >
            <TabProvider store={store}>
                {isOpen && (
                    <div
                        ref={panels}
                        className="error-warning-response-tabs-panels"
                    >
                        {showErrorsWarnings && (
                            <TabPanel store={store}>
                                {warnings.length == 0 ? (
                                    <h3>No Warnings</h3>
                                ) : (
                                    <ul
                                        style={{
                                            listStyleType: "none",
                                        }}
                                    >
                                        {warnings.map((warningObj, i) => {
                                            return (
                                                <li
                                                    key={i}
                                                    data-test={`Warning ${i}`}
                                                >
                                                    <BsExclamationTriangleFill
                                                        style={{
                                                            color: "yellow",
                                                            marginRight: 4,
                                                            marginBottom: -2,
                                                        }}
                                                    />
                                                    {/* XXX: why doesn't the type of position come through? */}
                                                    {warningObj.position
                                                        ? `Line #${
                                                              warningObj
                                                                  .position
                                                                  ?.start.line
                                                          }`
                                                        : null}{" "}
                                                    {warningObj.message}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </TabPanel>
                        )}
                        {showErrorsWarnings && (
                            <TabPanel store={store}>
                                {errors.length == 0 ? (
                                    <h3>No Errors</h3>
                                ) : (
                                    <ul
                                        style={{
                                            listStyleType: "none",
                                        }}
                                    >
                                        {errors.map((errorObj, i) => {
                                            return (
                                                <li
                                                    key={i}
                                                    data-test={`Error ${i}`}
                                                >
                                                    <BsExclamationTriangleFill
                                                        color="red"
                                                        style={{
                                                            marginRight: 4,
                                                            marginBottom: -2,
                                                        }}
                                                    />
                                                    {errorObj.position
                                                        ? `Line #${
                                                              errorObj.position
                                                                  ?.start.line
                                                          }`
                                                        : null}{" "}
                                                    {errorObj.message}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </TabPanel>
                        )}
                        {showResponses && (
                            <TabPanel store={store}>
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

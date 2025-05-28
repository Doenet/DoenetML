import React, { ReactElement, useEffect, useRef } from "react";
import { CloseButton, Tabs } from "@chakra-ui/react";
import { WarningDescription, ErrorDescription } from "@doenet/utils";
import { BsExclamationTriangleFill } from "react-icons/bs";

export default function ErrorWarningResponseTabs({
    warnings,
    errors,
    submittedResponses,
    isOpen,
    setIsOpen,
    showErrorsWarnings = true,
    showResponses = true,
}: {
    warnings: WarningDescription[];
    errors: ErrorDescription[];
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
        <Tabs.Root
            onChange={scrollToBottom}
            variant="plain"
            backgroundColor={"doenet.mainGray"}
            className="error-warning-response-tabs"
            height={isOpen ? "100%" : "fit-content"}
        >
            <Tabs.List>
                {showErrorsWarnings ? (
                    <Tabs.Trigger
                        value="warnings"
                        data-test="Warnings Tab"
                        backgroundColor={
                            warnings.length == 0
                                ? "doenet.mainGray"
                                : "rgb(254, 252, 191)"
                        }
                        color={
                            warnings.length === 0
                                ? "inherit"
                                : "rgb(116, 66, 16)"
                        }
                        cursor={isOpen ? "inherit" : "pointer"}
                        onClick={() => {
                            setIsOpen(true);
                        }}
                        py="2px"
                        border={isOpen ? "inherit" : "none"}
                        _selected={isOpen ? { fontWeight: "bold" } : {}}
                    >
                        {warnings.length} Warning
                        {warnings.length != 1 && "s"}
                    </Tabs.Trigger>
                ) : null}
                {showErrorsWarnings ? (
                    <Tabs.Trigger
                        value="errors"
                        data-test="Errors Tab"
                        backgroundColor={
                            errors.length == 0
                                ? "doenet.mainGray"
                                : "rgb(254, 215, 215)"
                        }
                        color={
                            errors.length === 0 ? "inherit" : "rgb(130, 39, 39)"
                        }
                        cursor={isOpen ? "inherit" : "pointer"}
                        onClick={() => {
                            setIsOpen(true);
                        }}
                        py="2px"
                        border={isOpen ? "inherit" : "none"}
                        _selected={isOpen ? { fontWeight: "bold" } : {}}
                    >
                        {errors.length} Error
                        {errors.length != 1 && "s"}
                    </Tabs.Trigger>
                ) : null}
                {showResponses ? (
                    <Tabs.Trigger
                        value="responses"
                        data-test="Submissions Tab"
                        backgroundColor={
                            submittedResponses.length == 0
                                ? "doenet.mainGray"
                                : "rgb(198, 246, 213)"
                        }
                        color={
                            submittedResponses.length === 0
                                ? "inherit"
                                : "rgb(34, 84, 61)"
                        }
                        cursor={isOpen ? "inherit" : "pointer"}
                        onClick={() => {
                            setIsOpen(true);
                        }}
                        py="2px"
                        border={isOpen ? "inherit" : "none"}
                        _selected={isOpen ? { fontWeight: "bold" } : {}}
                    >
                        {submittedResponses.length} Submitted response
                        {submittedResponses.length != 1 && "s"}
                    </Tabs.Trigger>
                ) : null}
                <div
                    style={{
                        flexGrow: 1,
                    }}
                />
                {isOpen ? (
                    <CloseButton
                        margin="4px"
                        onClick={() => {
                            setIsOpen(false);
                        }}
                        size="xs"
                        border="none"
                    />
                ) : null}
            </Tabs.List>
            {isOpen && (
                <div
                    style={{
                        display: "flex",
                        height: "100%",
                        backgroundColor: "var(--canvas)",
                        overflowY: "hidden",
                    }}
                >
                    {showErrorsWarnings ? (
                        <Tabs.Content value="warnings">
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
                                                {warningObj.position?.lineBegin
                                                    ? `Line #${
                                                          warningObj.position
                                                              ?.lineBegin
                                                      }`
                                                    : null}{" "}
                                                {warningObj.message}
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </Tabs.Content>
                    ) : null}
                    {showErrorsWarnings ? (
                        <Tabs.Content value="errors">
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
                                                {errorObj.position?.lineBegin
                                                    ? `Line #${
                                                          errorObj.position
                                                              ?.lineBegin
                                                      }`
                                                    : null}{" "}
                                                {errorObj.message}
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </Tabs.Content>
                    ) : null}
                    {showResponses ? (
                        <Tabs.Content value="responses" minWidth="fit-content">
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
                                                                {resp.answerId}
                                                            </td>
                                                            <td>
                                                                {resp.response}
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
                        </Tabs.Content>
                    ) : null}
                </div>
            )}
        </Tabs.Root>
    );
}

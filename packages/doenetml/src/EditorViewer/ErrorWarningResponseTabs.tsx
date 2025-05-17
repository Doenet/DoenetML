import React, { ReactElement, useEffect, useRef } from "react";
import {
    Box,
    CloseButton,
    Flex,
    Heading,
    List,
    ListItem,
    Spacer,
    Table,
    Tabs,
} from "@chakra-ui/react";
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
        <>
            <Tabs.Root height="100%" onChange={scrollToBottom}>
                <Tabs.List height="30px">
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
                                errors.length === 0
                                    ? "inherit"
                                    : "rgb(130, 39, 39)"
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
                </Tabs.List>
                <Spacer />
                <CloseButton
                    hidden={!isOpen}
                    margin="4px"
                    onClick={() => {
                        setIsOpen(false);
                    }}
                    size="sm"
                    border="none"
                />
                {showErrorsWarnings ? (
                    <Tabs.Content value="warnings">
                        {warnings.length == 0 ? (
                            <Heading as="h3" size="sm">
                                No Warnings
                            </Heading>
                        ) : (
                            <Box>
                                <List.Root margin="0px" padding="0px">
                                    {warnings.map((warningObj, i) => {
                                        return (
                                            <List.Item
                                                key={i}
                                                data-test={`Warning ${i}`}
                                            >
                                                <List.Indicator
                                                    as={
                                                        BsExclamationTriangleFill
                                                    }
                                                    color="yellow.400"
                                                    marginBottom="2px"
                                                />
                                                {warningObj.position?.lineBegin
                                                    ? `Line #${
                                                          warningObj.position
                                                              ?.lineBegin
                                                      }`
                                                    : null}{" "}
                                                {warningObj.message}
                                            </List.Item>
                                        );
                                    })}
                                </List.Root>
                            </Box>
                        )}
                    </Tabs.Content>
                ) : null}
                {showErrorsWarnings ? (
                    <Tabs.Content value="errors">
                        {errors.length == 0 ? (
                            <Heading as="h3" size="sm">
                                No Errors
                            </Heading>
                        ) : (
                            <Box>
                                <List.Root margin="0px" padding="0px">
                                    {errors.map((errorObj, i) => {
                                        return (
                                            <List.Item
                                                key={i}
                                                data-test={`Error ${i}`}
                                            >
                                                <List.Indicator
                                                    as={
                                                        BsExclamationTriangleFill
                                                    }
                                                    color="red.500"
                                                    marginBottom="2px"
                                                />
                                                {errorObj.position?.lineBegin
                                                    ? `Line #${
                                                          errorObj.position
                                                              ?.lineBegin
                                                      }`
                                                    : null}{" "}
                                                {errorObj.message}
                                            </List.Item>
                                        );
                                    })}
                                </List.Root>
                            </Box>
                        )}
                    </Tabs.Content>
                ) : null}
                {showResponses ? (
                    <Tabs.Content value="messages" minWidth="fit-content">
                        {submittedResponses.length == 0 ? (
                            <Heading as="h3" size="sm">
                                No submitted responses yet
                            </Heading>
                        ) : (
                            <Box minWidth="fit-content">
                                <Table.Root marginTop="10px" size="sm">
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.ColumnHeader
                                                textTransform={"none"}
                                                fontSize="medium"
                                            >
                                                Answer Id
                                            </Table.ColumnHeader>
                                            <Table.ColumnHeader
                                                textTransform={"none"}
                                                fontSize="medium"
                                            >
                                                Response
                                            </Table.ColumnHeader>
                                            <Table.ColumnHeader
                                                textTransform={"none"}
                                                fontSize="medium"
                                            >
                                                Credit
                                            </Table.ColumnHeader>
                                            <Table.ColumnHeader
                                                textTransform={"none"}
                                                fontSize="medium"
                                            >
                                                Submitted
                                            </Table.ColumnHeader>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {submittedResponses.map((resp, i) => {
                                            return (
                                                <Table.Row key={i}>
                                                    <Table.Cell>
                                                        {resp.answerId}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {resp.response}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {Math.round(
                                                            resp.creditAchieved *
                                                                1000,
                                                        ) / 10}
                                                        %
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {resp.submittedAt}
                                                    </Table.Cell>
                                                </Table.Row>
                                            );
                                        })}
                                    </Table.Body>
                                </Table.Root>
                            </Box>
                        )}
                    </Tabs.Content>
                ) : null}
            </Tabs.Root>
        </>
    );
}

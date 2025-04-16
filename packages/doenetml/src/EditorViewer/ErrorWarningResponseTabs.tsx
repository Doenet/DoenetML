import React, { ReactElement, useEffect, useRef } from "react";
import {
    Box,
    CloseButton,
    Flex,
    Heading,
    List,
    ListIcon,
    ListItem,
    Spacer,
    Tab,
    Table,
    TableContainer,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { WarningTwoIcon } from "@chakra-ui/icons";
import { WarningDescription, ErrorDescription } from "@doenet/utils";

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
            <Tabs height="100%" variant="unstyled" onChange={scrollToBottom}>
                <Flex backgroundColor="doenet.mainGray" alignItems="center">
                    <TabList height="30px">
                        {showErrorsWarnings ? (
                            <Tab
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
                            </Tab>
                        ) : null}
                        {showErrorsWarnings ? (
                            <Tab
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
                            </Tab>
                        ) : null}
                        {showResponses ? (
                            <Tab
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
                            </Tab>
                        ) : null}
                    </TabList>
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
                </Flex>
                <TabPanels
                    height="calc(100% - 32px)"
                    overflow="auto"
                    ref={panels}
                >
                    {showErrorsWarnings ? (
                        <TabPanel>
                            {warnings.length == 0 ? (
                                <Heading as="h3" size="sm">
                                    No Warnings
                                </Heading>
                            ) : (
                                <Box>
                                    <List
                                        spacing={2}
                                        margin="0px"
                                        padding="0px"
                                    >
                                        {warnings.map((warningObj, i) => {
                                            return (
                                                <ListItem
                                                    key={i}
                                                    data-test={`Warning ${i}`}
                                                >
                                                    <ListIcon
                                                        as={WarningTwoIcon}
                                                        color="yellow.400"
                                                        marginBottom="2px"
                                                    />
                                                    {warningObj.position
                                                        ?.lineBegin
                                                        ? `Line #${
                                                              warningObj
                                                                  .position
                                                                  ?.lineBegin
                                                          }`
                                                        : null}{" "}
                                                    {warningObj.message}
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                </Box>
                            )}
                        </TabPanel>
                    ) : null}
                    {showErrorsWarnings ? (
                        <TabPanel>
                            {errors.length == 0 ? (
                                <Heading as="h3" size="sm">
                                    No Errors
                                </Heading>
                            ) : (
                                <Box>
                                    <List
                                        spacing={2}
                                        margin="0px"
                                        padding="0px"
                                    >
                                        {errors.map((errorObj, i) => {
                                            return (
                                                <ListItem
                                                    key={i}
                                                    data-test={`Error ${i}`}
                                                >
                                                    <ListIcon
                                                        as={WarningTwoIcon}
                                                        color="red.500"
                                                        marginBottom="2px"
                                                    />
                                                    {errorObj.position
                                                        ?.lineBegin
                                                        ? `Line #${
                                                              errorObj.position
                                                                  ?.lineBegin
                                                          }`
                                                        : null}{" "}
                                                    {errorObj.message}
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                </Box>
                            )}
                        </TabPanel>
                    ) : null}
                    {showResponses ? (
                        <TabPanel minWidth="fit-content">
                            {submittedResponses.length == 0 ? (
                                <Heading as="h3" size="sm">
                                    No submitted responses yet
                                </Heading>
                            ) : (
                                <Box minWidth="fit-content">
                                    <TableContainer marginTop="10px">
                                        <Table size="xs">
                                            <Thead>
                                                <Tr>
                                                    <Th
                                                        textTransform={"none"}
                                                        fontSize="medium"
                                                    >
                                                        Answer Id
                                                    </Th>
                                                    <Th
                                                        textTransform={"none"}
                                                        fontSize="medium"
                                                    >
                                                        Response
                                                    </Th>
                                                    <Th
                                                        textTransform={"none"}
                                                        fontSize="medium"
                                                    >
                                                        Credit
                                                    </Th>
                                                    <Th
                                                        textTransform={"none"}
                                                        fontSize="medium"
                                                    >
                                                        Submitted
                                                    </Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {submittedResponses.map(
                                                    (resp, i) => {
                                                        return (
                                                            <Tr key={i}>
                                                                <Td>
                                                                    {
                                                                        resp.answerId
                                                                    }
                                                                </Td>
                                                                <Td>
                                                                    {
                                                                        resp.response
                                                                    }
                                                                </Td>
                                                                <Td>
                                                                    {Math.round(
                                                                        resp.creditAchieved *
                                                                            1000,
                                                                    ) / 10}
                                                                    %
                                                                </Td>
                                                                <Td>
                                                                    {
                                                                        resp.submittedAt
                                                                    }
                                                                </Td>
                                                            </Tr>
                                                        );
                                                    },
                                                )}
                                            </Tbody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            )}
                        </TabPanel>
                    ) : null}
                </TabPanels>
            </Tabs>
        </>
    );
}

import React from "react";
import { Button, Menu, Portal } from "@chakra-ui/react";

export function AnswerResponseMenu({
    answerId,
    activityId,
    docId,
    numResponses = 0,
}: {
    answerId: string;
    activityId: string;
    docId: string;
    numResponses?: number;
}) {
    const modifiedId = answerId[0] === "/" ? answerId.substring(1) : answerId;
    return (
        <Menu.Root>
            <Menu.Trigger asChild>
                <Button
                    as={Button}
                    size="2xs"
                    paddingLeft="2px"
                    paddingRight="2px"
                    cursor="pointer"
                    style={{
                        backgroundColor: "#aaa",
                    }}
                >
                    {numResponses}
                </Button>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        <Menu.Item
                            cursor="pointer"
                            value="showResponses"
                            onClick={() => {
                                window.postMessage({
                                    subject: "requestAnswerResponses",
                                    answerId,
                                    activityId,
                                    docId,
                                });
                            }}
                        >
                            Show {numResponses} response
                            {numResponses === 1 ? "" : "s"} to {modifiedId}
                        </Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
}

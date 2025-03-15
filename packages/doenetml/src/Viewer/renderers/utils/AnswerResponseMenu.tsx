import React from "react";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";

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
    return (
        <Menu>
            <MenuButton
                as={Button}
                size="xs"
                paddingLeft="2px"
                paddingRight="2px"
                cursor="pointer"
            >
                {numResponses}
            </MenuButton>
            <MenuList>
                <MenuItem
                    cursor="pointer"
                    onClick={() => {
                        window.postMessage({
                            subject: "requestAnswerResponses",
                            answerId,
                            activityId,
                            docId,
                        });
                    }}
                >
                    Show {numResponses} response{numResponses === 1 ? "" : "s"}{" "}
                    to {answerId}
                </MenuItem>
            </MenuList>
        </Menu>
    );
}

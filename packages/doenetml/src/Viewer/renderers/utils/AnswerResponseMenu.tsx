import React from "react";
import {
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
} from "@chakra-ui/react";
import { MdInfoOutline } from "react-icons/md";

export function AnswerResponseMenu({
    answerName,
    activityId,
    docId,
}: {
    answerName: string;
    activityId: string;
    docId: string;
}) {
    return (
        <Menu>
            <MenuButton
                as={IconButton}
                icon={<MdInfoOutline />}
                size="xs"
                paddingLeft="2px"
                paddingRight="2px"
                cursor="pointer"
            />
            <MenuList>
                <MenuItem
                    cursor="pointer"
                    onClick={() => {
                        window.postMessage({
                            subject: "requestAnswerResponses",
                            answerName,
                            activityId,
                            docId,
                        });
                    }}
                >
                    Show responses to {answerName}
                </MenuItem>
            </MenuList>
        </Menu>
    );
}

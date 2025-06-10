import React from "react";
import { MenuProvider, Menu, MenuItem, MenuButton } from "@ariakit/react";
import "./AnswerResponseMenu.css";

export function AnswerResponseMenu({
    answerId,
    activityId,
    docId,
    numResponses = 0,
}: {
    answerId: number;
    activityId: string;
    docId: string;
    numResponses?: number;
}) {
    // XXX: we need to send in the actual answer name, as displaying the component index is not useful for instructors
    const modifiedId = answerId;
    return (
        <MenuProvider>
            <MenuButton className="doenet-button action-button answer-response-menu-trigger">
                {numResponses}
            </MenuButton>
            <Menu className="answer-response-menu">
                <MenuItem
                    className="answer-response-menu-item"
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
                </MenuItem>
            </Menu>
        </MenuProvider>
    );
}

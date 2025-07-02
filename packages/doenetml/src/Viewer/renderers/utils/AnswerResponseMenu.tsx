import React from "react";
import { MenuProvider, Menu, MenuItem, MenuButton } from "@ariakit/react";
import "./AnswerResponseMenu.css";

export function AnswerResponseMenu({
    answerId,
    answerComponentIdx,
    activityId,
    docId,
    numResponses = 0,
}: {
    answerId: string;
    answerComponentIdx: number;
    activityId: string;
    docId: string;
    numResponses?: number;
}) {
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
                            answerComponentIdx,
                            answerId,
                            activityId,
                            docId,
                        });
                    }}
                >
                    Show {numResponses} response
                    {numResponses === 1 ? "" : "s"} to {answerId}
                </MenuItem>
            </Menu>
        </MenuProvider>
    );
}

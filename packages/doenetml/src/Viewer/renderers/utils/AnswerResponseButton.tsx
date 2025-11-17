import React from "react";
import {
    Button,
    Tooltip,
    TooltipProvider,
    TooltipAnchor,
} from "@ariakit/react";
import "./AnswerResponseButton.css";
import { DoenetMLFlags } from "../../../doenetml";

export function AnswerResponseButton({
    answerId,
    answerComponentIdx,
    activityId,
    docId,
    numResponses = 0,
    flags,
}: {
    answerId: string;
    answerComponentIdx: number;
    activityId: string;
    docId: string;
    numResponses?: number;
    flags: DoenetMLFlags;
}) {
    return (
        <TooltipProvider>
            <TooltipAnchor className="answer-response-tooltip-anchor">
                <Button
                    className="doenet-button action-button answer-response-button"
                    onClick={() => {
                        const message = {
                            subject: "requestAnswerResponses",
                            answerComponentIdx,
                            answerId,
                            activityId,
                            docId,
                        };
                        if (flags.messageParent && window.parent) {
                            window.parent.postMessage(message);
                        } else {
                            window.postMessage(message);
                        }
                    }}
                >
                    {numResponses}
                </Button>
            </TooltipAnchor>
            <Tooltip className="answer-response-tooltip">
                Show {numResponses} response
                {numResponses === 1 ? "" : "s"} to {answerId}
            </Tooltip>
        </TooltipProvider>
    );
}

import React from "react";
import {
    Button,
    Tooltip,
    TooltipProvider,
    TooltipAnchor,
} from "@ariakit/react";
import "./AnswerResponseButton.css";

export function AnswerResponseButton({
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
        <TooltipProvider>
            <TooltipAnchor className="answer-response-tooltip-anchor">
                <Button
                    className="doenet-button action-button answer-response-button"
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

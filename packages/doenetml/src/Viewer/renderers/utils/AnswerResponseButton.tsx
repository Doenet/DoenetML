import React from "react";
import { Button } from "@ariakit/react";
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
    );
}

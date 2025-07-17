import React from "react";
import { BasicComponent } from "../types";
import { useAppSelector } from "../../state/hooks";
import { renderingOnServerSelector } from "../../state/redux-slices/global";

export const Answer: BasicComponent = ({ node }) => {
    const onServer = useAppSelector(renderingOnServerSelector);
    if (onServer) {
        return <span className="answer-input"></span>;
    }
    return (
        <span className="answer-input">
            <input type="text" />
            <button type="button" className="answer-submit">
                Submit
            </button>
        </span>
    );
};

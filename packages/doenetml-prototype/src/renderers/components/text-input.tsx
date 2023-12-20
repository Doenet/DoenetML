import React from "react";
import { BasicComponent } from "../types";
import { useAppSelector } from "../../state/hooks";
import { renderingOnServerSelector } from "../../state/redux-slices/global";
import "./text-input.css";

export const TextInput: BasicComponent = ({ node }) => {
    const onServer = useAppSelector(renderingOnServerSelector);
    if (onServer) {
        return <span className="text-input"></span>;
    }
    return (
        <span className="text-input">
            <label>
                <input type="text" />
            </label>
        </span>
    );
};

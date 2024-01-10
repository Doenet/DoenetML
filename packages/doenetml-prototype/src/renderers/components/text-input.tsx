import React from "react";
import { BasicComponent } from "../types";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { renderingOnServerSelector } from "../../state/redux-slices/global";
import "./text-input.css";
import { coreActions } from "../../state/redux-slices/core";

type TextInputData = { state: { immediateValue: string } };

export const TextInput: BasicComponent<TextInputData> = ({ node }) => {
    const onServer = useAppSelector(renderingOnServerSelector);
    const id = node.data.id;
    const value = node.data.state.immediateValue;
    const dispatch = useAppDispatch();

    const updateValue = React.useCallback(() => {
        dispatch(
            coreActions.dispatchAction({
                actionName: "updateValue",
                componentIdx: id,
                args: { text: value },
            }),
        );
    }, [dispatch, value]);

    if (onServer) {
        return <span className="text-input">{value}</span>;
    }

    return (
        <span className="text-input">
            <label>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => {
                        dispatch(
                            coreActions.dispatchAction({
                                actionName: "updateImmediateValue",
                                componentIdx: id,
                                args: { text: e.target.value },
                            }),
                        );
                    }}
                    onBlur={updateValue}
                    onKeyUp={(e) => {
                        if (e.key === "Enter") {
                            updateValue();
                        }
                    }}
                />
            </label>
        </span>
    );
};

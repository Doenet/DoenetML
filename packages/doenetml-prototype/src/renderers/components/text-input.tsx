import React from "react";
import { BasicComponent } from "../types";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { renderingOnServerSelector } from "../../state/redux-slices/global";
import "./text-input.css";
import { coreActions } from "../../state/redux-slices/core";
import { TextInputAction } from "lib-doenetml-worker-rust";

type TextInputData = { state: { immediateValue: string } };
type Action = TextInputAction & { componentIdx: number };

export const TextInput: BasicComponent<TextInputData> = ({ node }) => {
    const onServer = useAppSelector(renderingOnServerSelector);
    const id = node.data.id;
    const value = node.data.state.immediateValue;
    const dispatch = useAppDispatch();

    const updateValue = React.useCallback(() => {
        let action: Action = {
            actionName: "updateValue",
            componentIdx: id,
        };
        dispatch(coreActions.dispatchAction(action));
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
                        const action: Action = {
                            actionName: "updateImmediateValue",
                            componentIdx: id,
                            args: { text: e.target.value },
                        };
                        dispatch(coreActions.dispatchAction(action));
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

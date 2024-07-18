import React from "react";
import type {
    Action,
    TextInputPropsInText,
} from "@doenet/doenetml-worker-rust";
import { BasicComponent } from "../types";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { renderingOnServerSelector } from "../../state/redux-slices/global";
import "./text-input.css";
import { coreActions } from "../../state/redux-slices/core";

type TextInputData = { props: TextInputPropsInText };

export const TextInput: BasicComponent<TextInputData> = ({ node }) => {
    const onServer = useAppSelector(renderingOnServerSelector);
    const id = node.data.id;
    const value = node.data.props.immediateValue;
    //const disabled = node.data.props.disabled;
    const dispatch = useAppDispatch();

    const updateValue = React.useCallback(() => {
        let action: Action = {
            component: "textInput",
            actionName: "updateValue",
            componentIdx: id,
        };
        dispatch(coreActions.dispatchAction(action));
    }, [dispatch, value]);

    if (onServer) {
        return <span className="text-input">{value}</span>;
    }

    // TODO: change style to gray out when disabled

    return (
        <span className="text-input">
            <label>
                <input
                    type="text"
                    value={value}
                    disabled={
                        false //disabled
                    }
                    onChange={(e) => {
                        const action: Action = {
                            component: "textInput",
                            componentIdx: id,
                            actionName: "updateImmediateValue",
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

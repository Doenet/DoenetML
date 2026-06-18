import React from "react";
import { BasicComponent } from "../types";
import { useAppDispatch } from "../../state/hooks";
import { Action } from "@doenet/doenetml-worker";
import { coreActions } from "../../state/redux-slices/core";
import { processLabelWithMath } from "./text-input";

import "./_button.css";

type ButtonData = {
    props: {
        clickAction: "updateValue" | "callAction" | "triggerActions";
        label: string;
        labelHasLatex: boolean;
        disabled: boolean;
    };
};

/**
 * A basic button. Not used directly, but as the renderer for `callAction`, `updateValue`, and `triggerActions` components. 
 * 
 * Sample code
 * -----------
 ```
    <number name="count">0</number>
    <boolean name="active">false</boolean>
    <sampleRandomNumbers name="dice" from="1" to="6" />

    <p>Count: $count</p>
    <p>Active: $active</p>
    <p>Dice roll: $dice</p>

    <updateValue target="$count" newValue="$count + 1" type="number">
    <label>Increment</label>
    </updateValue>

    <callAction target="$dice" actionName="resample">
    <label>Roll Dice</label>
    </callAction>

    <triggerSet>
    <label>Reset All <m>val</m></label>
    <updateValue target="$count" newValue="0" type="number" />
    <updateValue target="$active" newValue="true" type="boolean" />
    </triggerSet>
```
 */
export const Button: BasicComponent<ButtonData> = ({ node, htmlId }) => {
    const dispatch = useAppDispatch();
    const { clickAction, label, disabled } = node.data.props;

    const onClick = React.useCallback(() => {
        const action: Action = {
            component: node.name,
            componentIdx: node.data.id,
            actionName: clickAction,
            args: {},
        };
        dispatch(coreActions.dispatchAction(action));
    }, [dispatch, node.name, node.data.id, clickAction]);

    const displayLabel = processLabelWithMath(
        node.data.props.label,
        node.data.props.labelHasLatex,
    );

    console.log(
        "Rendering Button with label:",
        displayLabel,
        node.data.props.label,
    );

    return (
        <button
            className="button"
            id={htmlId}
            disabled={disabled}
            onClick={onClick}
        >
            {displayLabel}
        </button>
    );
};

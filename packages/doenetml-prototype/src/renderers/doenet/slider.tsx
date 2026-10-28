import React from "react";
import type { Action } from "@doenet/doenetml-worker";
import { BasicComponent } from "../types";
import { useAppDispatch } from "../../state/hooks";
import { coreActions } from "../../state/redux-slices/core";
import { processLabelWithMath } from "./text-input";
import type { InputLabelProps } from "./_commit-field";

type SliderData = {
    props: {
        from: number;
        to: number;
        step: number;
        value: number;
    } & InputLabelProps;
};

/** `<slider>` over numbers. The core snaps and clamps what it is sent, so
 * the slider shows whatever value the core then holds; no value is shown at
 * `from`. */
export const Slider: BasicComponent<SliderData> = ({ node, htmlId }) => {
    const dispatch = useAppDispatch();
    const { from, to, step, value, label, labelHasLatex, shortDescription } =
        node.data.props;
    const shown = Number.isNaN(value) ? from : value;
    return (
        <span className="slider" id={htmlId}>
            <label>
                <span className="input-label">
                    {processLabelWithMath(label, labelHasLatex)}
                </span>{" "}
                <input
                    type="range"
                    min={from}
                    max={to}
                    step={step > 0 ? step : "any"}
                    value={shown}
                    aria-label={label ? undefined : shortDescription}
                    onChange={(e) => {
                        const action = {
                            component: "slider",
                            actionName: "changeValue",
                            componentIdx: node.data.id,
                            args: { value: Number(e.target.value) },
                        } as unknown as Action;
                        dispatch(coreActions.dispatchAction(action));
                    }}
                />{" "}
                <span className="slider-value">
                    {Number.isInteger(shown)
                        ? shown
                        : Number(shown.toPrecision(6))}
                </span>
            </label>
        </span>
    );
};

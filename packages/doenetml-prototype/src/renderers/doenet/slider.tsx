import React from "react";
import type { Action } from "@doenet/doenetml-worker";
import { BasicComponent } from "../types";
import { useAppDispatch } from "../../state/hooks";
import { coreActions } from "../../state/redux-slices/core";
import { ariaProps, InputLabelProps, LabeledInput } from "./_labeled-input";
import "./slider.css";

type SliderData = {
    props: {
        from: number;
        to: number;
        step: number;
        /** NaN when no value is set; the slider then shows `from`. */
        value: number;
    } & InputLabelProps;
};

/**
 * Slider renders a range input over numbers. The core snaps and clamps the
 * values it is sent, so the slider shows whatever value the core then holds.
 *
 * Sample code
 * -----------
 * ```
   <slider from="0" to="10" step="2"><label>Count</label></slider>
  ```
 */
export const Slider: BasicComponent<SliderData> = ({ node, htmlId }) => {
    const dispatch = useAppDispatch();
    const { from, to, step, value, ...labelProps } = node.data.props;
    if (value === undefined) {
        return null;
    }
    const shown = Number.isNaN(value) ? from : value;
    const shownText = Number.isInteger(shown)
        ? String(shown)
        : String(Number(shown.toPrecision(6)));

    return (
        <LabeledInput
            className="slider"
            htmlId={htmlId}
            labelProps={labelProps}
            server={shownText}
        >
            <input
                type="range"
                min={from}
                max={to}
                step={step > 0 ? step : "any"}
                value={shown}
                {...ariaProps(labelProps)}
                onChange={(e) => {
                    const action: Action = {
                        component: "slider",
                        componentIdx: node.data.id,
                        actionName: "changeValue",
                        args: { value: Number(e.target.value) },
                    };
                    dispatch(coreActions.dispatchAction(action));
                }}
            />
            <span className="slider-value">{shownText}</span>
        </LabeledInput>
    );
};

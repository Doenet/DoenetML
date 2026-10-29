import React from "react";
import type { Action } from "@doenet/doenetml-worker";
import { BasicComponent } from "../types";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { renderingOnServerSelector } from "../../state/redux-slices/global";
import { coreActions } from "../../state/redux-slices/core";
import { processLabelWithMath } from "./text-input";
import "./slider.css";

type SliderData = {
    props: {
        from: number;
        to: number;
        step: number;
        /** NaN when no value is set; the slider then shows `from`. */
        value: number;
        label: string;
        labelHasLatex: boolean;
        labelPosition: "start" | "end";
        /**
         * Description used for Aria state.
         */
        shortDescription: string;
    };
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
    const onServer = useAppSelector(renderingOnServerSelector);
    const id = node.data.id;
    const { from, to, step, value, label, labelHasLatex, shortDescription } =
        node.data.props;

    const dispatch = useAppDispatch();

    const onChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const action: Action = {
                component: "slider",
                componentIdx: id,
                actionName: "changeValue",
                args: { value: Number(e.target.value) },
            };
            dispatch(coreActions.dispatchAction(action));
        },
        [dispatch, id],
    );

    if (value === undefined) {
        return null;
    }

    const shown = Number.isNaN(value) ? from : value;
    const shownText = Number.isInteger(shown)
        ? String(shown)
        : String(Number(shown.toPrecision(6)));
    const hasLabel = !!label?.trim();
    const displayLabel = processLabelWithMath(label, labelHasLatex);

    if (onServer) {
        return (
            <span className="slider" id={htmlId}>
                {shownText}
            </span>
        );
    }

    return (
        <span className="slider input" id={htmlId}>
            <label className={`input-label-${node.data.props.labelPosition}`}>
                <span className="input-label">{displayLabel}</span>
                <input
                    type="range"
                    min={from}
                    max={to}
                    step={step > 0 ? step : "any"}
                    value={shown}
                    aria-label={hasLabel ? undefined : shortDescription}
                    aria-description={hasLabel ? shortDescription : undefined}
                    onChange={onChange}
                />
                <span className="slider-value">{shownText}</span>
            </label>
        </span>
    );
};

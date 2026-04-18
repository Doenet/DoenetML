import React from "react";
import { GraphControlsMode, PointControlsMode } from "../model";
import SliderUI from "../../utils/SliderUI";
import InputWithError from "./InputWithError";
import {
    GRAPH_CONTROL_INLINE_INPUT_STACK_STYLE,
    GRAPH_CONTROL_INPUT_BLOCK_STYLE,
} from "./styles";
import ControlSectionHeading from "./ControlSectionHeading";

type TextInputConfig = {
    value: string;
    ariaLabel: string;
    error: string | undefined;
    errorId: string;
    onDraftChange: (value: string) => void;
    onCommit: (value: string) => Promise<void>;
    hasDraft?: boolean;
    isCommitting?: boolean;
    commitErrorContext: string;
};

type AxisControlConfig = {
    label: string;
    sliderAriaLabel: string;
    inputOnlyAriaLabel?: string;
    displayValue: string;
    min: number;
    max: number;
    step: number;
    value: number;
    onSliderChange: (value: number, transient: boolean) => void;
    onDragEnd: () => void;
    input: TextInputConfig;
};

type PointControlViewProps = {
    id: string;
    controlId: string;
    /** Optional subheading rendered when multiple controls share one control card. */
    sectionHeading?: React.ReactNode;
    sectionHeadingHasDivider?: boolean;
    labelForAria: string;
    graphControlsMode: Exclude<GraphControlsMode, "none">;
    controlsMode: PointControlsMode;
    pairInput: TextInputConfig;
    axisControls: {
        x: AxisControlConfig;
        y: AxisControlConfig;
    };
};

export default function PointControlView({
    id,
    controlId,
    sectionHeading,
    sectionHeadingHasDivider = true,
    labelForAria,
    graphControlsMode,
    controlsMode,
    pairInput,
    axisControls,
}: PointControlViewProps) {
    const includeSliders =
        graphControlsMode === "all" || graphControlsMode === "slidersonly";
    const includeInputs =
        graphControlsMode === "all" || graphControlsMode === "inputsonly";

    const showXAxis = controlsMode !== "yonly";
    const showYAxis = controlsMode !== "xonly";
    const showAxisInputsInline = graphControlsMode === "all";
    const showInputsOnly = graphControlsMode === "inputsonly" && includeInputs;

    function renderLabeledInput({
        inputId,
        label,
        input,
    }: {
        inputId: string;
        label: string;
        input: TextInputConfig;
    }) {
        return (
            <div style={GRAPH_CONTROL_INPUT_BLOCK_STYLE}>
                <label htmlFor={inputId}>{label}</label>
                <InputWithError
                    id={inputId}
                    value={input.value}
                    ariaLabel={input.ariaLabel}
                    error={input.error}
                    errorId={input.errorId}
                    onDraftChange={input.onDraftChange}
                    onCommit={input.onCommit}
                    hasDraft={input.hasDraft}
                    isCommitting={input.isCommitting}
                    commitErrorContext={input.commitErrorContext}
                />
            </div>
        );
    }

    function renderAxisSlider(axis: "x" | "y") {
        const axisControl = axisControls[axis];

        return (
            <SliderUI
                id={`${id}-${controlId}-${axis}`}
                label={
                    showAxisInputsInline ? (
                        <span style={GRAPH_CONTROL_INLINE_INPUT_STACK_STYLE}>
                            {axisControl.label}:{" "}
                            <InputWithError
                                value={axisControl.input.value}
                                ariaLabel={axisControl.input.ariaLabel}
                                error={axisControl.input.error}
                                errorId={axisControl.input.errorId}
                                onDraftChange={axisControl.input.onDraftChange}
                                onCommit={axisControl.input.onCommit}
                                hasDraft={axisControl.input.hasDraft}
                                isCommitting={axisControl.input.isCommitting}
                                commitErrorContext={
                                    axisControl.input.commitErrorContext
                                }
                            />
                        </span>
                    ) : (
                        `${axisControl.label}: ${axisControl.displayValue}`
                    )
                }
                ariaLabel={axisControl.sliderAriaLabel}
                min={axisControl.min}
                max={axisControl.max}
                step={axisControl.step}
                value={axisControl.value}
                onChange={axisControl.onSliderChange}
                onDragEnd={axisControl.onDragEnd}
            />
        );
    }

    return (
        <>
            <ControlSectionHeading
                heading={sectionHeading}
                withDivider={sectionHeadingHasDivider}
            />

            {showInputsOnly && controlsMode === "both" ? (
                <div style={GRAPH_CONTROL_INPUT_BLOCK_STYLE}>
                    <label htmlFor={`${id}-${controlId}-pair`}>
                        Coordinates
                    </label>
                    <InputWithError
                        id={`${id}-${controlId}-pair`}
                        value={pairInput.value}
                        ariaLabel={pairInput.ariaLabel}
                        error={pairInput.error}
                        errorId={pairInput.errorId}
                        onDraftChange={pairInput.onDraftChange}
                        onCommit={pairInput.onCommit}
                        hasDraft={pairInput.hasDraft}
                        isCommitting={pairInput.isCommitting}
                        commitErrorContext={pairInput.commitErrorContext}
                    />
                </div>
            ) : null}

            {showInputsOnly && controlsMode === "xonly"
                ? renderLabeledInput({
                      inputId: `${id}-${controlId}-x-input`,
                      label: "x",
                      input: {
                          ...axisControls.x.input,
                          ariaLabel:
                              axisControls.x.inputOnlyAriaLabel ??
                              `x input for ${labelForAria}`,
                      },
                  })
                : null}

            {showInputsOnly && controlsMode === "yonly"
                ? renderLabeledInput({
                      inputId: `${id}-${controlId}-y-input`,
                      label: "y",
                      input: {
                          ...axisControls.y.input,
                          ariaLabel:
                              axisControls.y.inputOnlyAriaLabel ??
                              `y input for ${labelForAria}`,
                      },
                  })
                : null}

            {includeSliders && showXAxis ? renderAxisSlider("x") : null}

            {includeSliders && showYAxis ? renderAxisSlider("y") : null}
        </>
    );
}

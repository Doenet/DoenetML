import React from "react";
import { GraphControlsMode } from "../model";
import SliderUI from "../../utils/SliderUI";
import InputWithError from "./InputWithError";
import ControlSectionHeading from "./ControlSectionHeading";
import {
    GRAPH_CONTROL_INLINE_INPUT_STACK_STYLE,
    GRAPH_CONTROL_INPUT_BLOCK_STYLE,
} from "./styles";

type ScalarControlInputConfig = {
    value: string;
    ariaLabel: string;
    error: string | undefined;
    errorId: string;
    onDraftChange: (value: string) => void;
    onCommit: (rawValue: string) => Promise<void>;
    hasDraft: boolean;
    isCommitting: boolean;
    commitErrorContext: string;
};

type ScalarControlSliderConfig = {
    id: string;
    ariaLabel: string;
    ariaValueText: string;
    min: number;
    max: number;
    step: number;
    value: number;
    displayValue: string;
    onSliderChange: (value: number, transient: boolean) => void;
    onSliderDragEnd: () => void;
};

type ScalarControlProps = {
    sectionHeading?: React.ReactNode;
    sectionHeadingHasDivider?: boolean;
    label: string;
    graphControlsMode: Exclude<GraphControlsMode, "none">;
    input: ScalarControlInputConfig;
    slider: ScalarControlSliderConfig;
};

export default function ScalarControl({
    sectionHeading,
    sectionHeadingHasDivider = true,
    label,
    graphControlsMode,
    input,
    slider,
}: ScalarControlProps) {
    const includeSliders =
        graphControlsMode === "all" || graphControlsMode === "slidersonly";
    const includeInputs =
        graphControlsMode === "all" || graphControlsMode === "inputsonly";

    if (!includeSliders && includeInputs) {
        return (
            <>
                <ControlSectionHeading
                    heading={sectionHeading}
                    withDivider={sectionHeadingHasDivider}
                />
                <div style={GRAPH_CONTROL_INPUT_BLOCK_STYLE}>
                    <label>
                        {label}
                        <InputWithError
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
                    </label>
                </div>
            </>
        );
    }

    if (!includeSliders) {
        return null;
    }

    return (
        <>
            <ControlSectionHeading
                heading={sectionHeading}
                withDivider={sectionHeadingHasDivider}
            />
            <SliderUI
                id={slider.id}
                label={
                    graphControlsMode === "all" ? (
                        <span style={GRAPH_CONTROL_INLINE_INPUT_STACK_STYLE}>
                            {label}:
                            <InputWithError
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
                        </span>
                    ) : (
                        `${label}: ${slider.displayValue}`
                    )
                }
                ariaLabel={slider.ariaLabel}
                ariaValueText={slider.ariaValueText}
                min={slider.min}
                max={slider.max}
                step={slider.step}
                value={slider.value}
                onChange={slider.onSliderChange}
                onDragEnd={slider.onSliderDragEnd}
            />
        </>
    );
}

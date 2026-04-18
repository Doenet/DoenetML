import React from "react";
import { GraphControlsMode } from "../../utils/graphControls";
import SliderUI from "../../utils/SliderUI";
import CommitInputWithError from "./CommitInputWithError";
import GraphControlSectionHeading from "./GraphControlSectionHeading";
import {
    GRAPH_CONTROL_INLINE_INPUT_STACK_STYLE,
    GRAPH_CONTROL_INPUT_BLOCK_STYLE,
} from "./graphControlStyles";

type NumberControlInputConfig = {
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

type NumberControlSliderConfig = {
    id: string;
    ariaLabel: string;
    min: number;
    max: number;
    step: number;
    value: number;
    displayValue: string;
    onSliderChange: (value: number, transient: boolean) => void;
};

type NumberControlProps = {
    sectionHeading?: React.ReactNode;
    sectionHeadingHasDivider?: boolean;
    label: string;
    graphControlsMode: Exclude<GraphControlsMode, "none">;
    input: NumberControlInputConfig;
    slider: NumberControlSliderConfig;
};

export default function NumberControl({
    sectionHeading,
    sectionHeadingHasDivider = true,
    label,
    graphControlsMode,
    input,
    slider,
}: NumberControlProps) {
    const includeSliders =
        graphControlsMode === "all" || graphControlsMode === "slidersonly";
    const includeInputs =
        graphControlsMode === "all" || graphControlsMode === "inputsonly";

    if (!includeSliders && includeInputs) {
        return (
            <>
                <GraphControlSectionHeading
                    heading={sectionHeading}
                    withDivider={sectionHeadingHasDivider}
                />
                <div style={GRAPH_CONTROL_INPUT_BLOCK_STYLE}>
                    <label>
                        {label}
                        <CommitInputWithError
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
            <GraphControlSectionHeading
                heading={sectionHeading}
                withDivider={sectionHeadingHasDivider}
            />
            <SliderUI
                id={slider.id}
                label={
                    graphControlsMode === "all" ? (
                        <span style={GRAPH_CONTROL_INLINE_INPUT_STACK_STYLE}>
                            {label}:
                            <CommitInputWithError
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
                min={slider.min}
                max={slider.max}
                step={slider.step}
                value={slider.value}
                onChange={slider.onSliderChange}
            />
        </>
    );
}

import React from "react";
import { useGraphControlsState } from "./hooks/useGraphControlsState";
import GraphControlsPanel from "./components/graphControls/GraphControlsPanel";
import GraphPointControlCard from "./components/graphControls/GraphPointControlCard";
import {
    GraphControlPoint,
    makeInputKey,
    normalizeGraphControlsMode,
    normalizePointControlsMode,
} from "./utils/graphControls";
import { formatCoordinateForControls } from "./utils/graphControlsMath";
import {
    accessibleLabelText,
    renderLabelWithLatex,
} from "./utils/labelWithLatex";

type PointGraphControlsProps = {
    id: string;
    SVs: {
        addControls: string;
        xMin: number;
        xMax: number;
        yMin: number;
        yMax: number;
        draggablePointsForControls: GraphControlPoint[];
    };
    callAction: (argObj: Record<string, any>) => Promise<any> | void;
};

/**
 * Point-specific controls composition layer.
 *
 * This component binds shared domain/state helpers to point presentation
 * components while preserving the existing point controls behavior.
 */
export default React.memo(function PointGraphControls({
    id,
    SVs,
    callAction,
}: PointGraphControlsProps) {
    const coreControlPoints = SVs.draggablePointsForControls;
    const graphControlsMode = normalizeGraphControlsMode(SVs.addControls);
    const includeSliders =
        graphControlsMode === "all" || graphControlsMode === "slidersonly";
    const includeInputs =
        graphControlsMode === "all" || graphControlsMode === "inputsonly";

    const {
        rendererSliderCoordinates,
        inputDraftByKey,
        inputErrorByKey,
        setInputDraftValue,
        submitAxisInput,
        submitPairInput,
        renderAxisSlider,
    } = useGraphControlsState({
        id,
        coreControlPoints,
        graphControlsMode,
        includeSliders,
        includeInputs,
        xMin: SVs.xMin,
        xMax: SVs.xMax,
        yMin: SVs.yMin,
        yMax: SVs.yMax,
        callAction,
    });

    // Keep this mapping focused on deriving per-point display props; all
    // mutation, validation, and slider mechanics live in the state hook.
    const controlsSection = coreControlPoints
        .map((point) => {
            const {
                componentIdx,
                x: defaultX,
                y: defaultY,
                pointNumber,
                label,
                labelHasLatex,
            } = point;
            const pointControlsMode = normalizePointControlsMode(
                point.addControls,
            );
            if (pointControlsMode === "none") {
                return null;
            }

            const currentCoordinates = rendererSliderCoordinates[
                componentIdx
            ] ?? {
                x: defaultX,
                y: defaultY,
            };
            const pointFallbackLabel = `Point ${pointNumber}`;
            const pointLabelForAria = accessibleLabelText({
                label,
                labelHasLatex,
                fallback: pointFallbackLabel,
            });
            const pointLabelForDisplay = label.trim()
                ? renderLabelWithLatex({ label, labelHasLatex })
                : pointFallbackLabel;

            const xInputKey = makeInputKey(componentIdx, "x");
            const yInputKey = makeInputKey(componentIdx, "y");
            const pairInputKey = makeInputKey(componentIdx, "pair");

            const formattedX = formatCoordinateForControls(
                currentCoordinates.x,
                point,
            );
            const formattedY = formatCoordinateForControls(
                currentCoordinates.y,
                point,
            );

            const xInputValue = inputDraftByKey[xInputKey] ?? formattedX;
            const yInputValue = inputDraftByKey[yInputKey] ?? formattedY;
            const pairInputValue =
                inputDraftByKey[pairInputKey] ??
                `(${formattedX},${formattedY})`;

            const xInputError = inputErrorByKey[xInputKey];
            const yInputError = inputErrorByKey[yInputKey];
            const pairInputError = inputErrorByKey[pairInputKey];

            return (
                <GraphPointControlCard
                    key={componentIdx}
                    id={id}
                    point={point}
                    graphControlsMode={graphControlsMode}
                    includeSliders={includeSliders}
                    includeInputs={includeInputs}
                    pointControlsMode={pointControlsMode}
                    currentCoordinates={currentCoordinates}
                    pointLabelForAria={pointLabelForAria}
                    pointLabelForDisplay={pointLabelForDisplay}
                    xInputValue={xInputValue}
                    yInputValue={yInputValue}
                    pairInputValue={pairInputValue}
                    xInputError={xInputError}
                    yInputError={yInputError}
                    pairInputError={pairInputError}
                    setInputDraftValue={setInputDraftValue}
                    submitAxisInput={submitAxisInput}
                    submitPairInput={submitPairInput}
                    renderAxisSlider={renderAxisSlider}
                />
            );
        })
        .filter((section): section is React.JSX.Element => Boolean(section));

    if (controlsSection.length === 0) {
        return null;
    }

    return (
        <GraphControlsPanel id={id} ariaLabel="Point controls">
            {controlsSection}
        </GraphControlsPanel>
    );
});

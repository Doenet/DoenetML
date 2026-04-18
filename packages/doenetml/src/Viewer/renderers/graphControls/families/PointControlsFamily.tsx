import React from "react";
import GraphControl from "../primitives/ControlCard";
import GraphControlsPanel from "../primitives/ControlsStack";
import PointControlController from "../primitives/PointControlCoordinator";
import {
    GraphControlPoint,
    normalizeGraphControlsMode,
    normalizePointControlsMode,
} from "../model";
import { formatCoordinateForControls } from "../mathFormatParse";
import {
    accessibleLabelText,
    renderLabelWithLatex,
} from "../../utils/labelWithLatex";

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

export default React.memo(function PointGraphControls({
    id,
    SVs,
    callAction,
}: PointGraphControlsProps) {
    const points = Array.isArray(SVs.draggablePointsForControls)
        ? SVs.draggablePointsForControls
        : [];
    const graphControlsMode = normalizeGraphControlsMode(SVs.addControls);
    if (graphControlsMode === "none" || points.length === 0) {
        return null;
    }

    async function movePointLike({
        componentIdx,
        x,
        y,
        transient,
        skippable,
    }: {
        componentIdx: number;
        x: number;
        y: number;
        transient: boolean;
        skippable: boolean;
    }) {
        try {
            await callAction({
                action: { actionName: "movePoint", componentIdx },
                args: {
                    x,
                    y,
                    pointRole: "point",
                    transient,
                    skippable,
                },
            });
        } catch (error) {
            console.error(
                `[graph-controls] movePoint failed for component ${componentIdx}`,
                error,
            );
        }
    }

    const controlsSection = points
        .map((point) => {
            const pointControlsMode = normalizePointControlsMode(
                point.addControls,
            );
            if (pointControlsMode === "none") {
                return null;
            }

            const pointFallbackLabel = `Point ${point.pointNumber}`;
            const pointLabelForAria = accessibleLabelText({
                label: point.label,
                labelHasLatex: point.labelHasLatex,
                fallback: pointFallbackLabel,
            });
            const pointLabelForDisplay = point.label.trim()
                ? renderLabelWithLatex({
                      label: point.label,
                      labelHasLatex: point.labelHasLatex,
                  })
                : pointFallbackLabel;

            return (
                <GraphControl
                    key={point.componentIdx}
                    id={`${id}-point-${point.componentIdx}`}
                    headingId={`${id}-point-${point.componentIdx}-heading`}
                    heading={pointLabelForDisplay}
                >
                    <PointControlController
                        id={id}
                        controlId={`point-${point.componentIdx}`}
                        componentIdx={point.componentIdx}
                        pointRole="point"
                        labelForAria={pointLabelForAria}
                        graphControlsMode={graphControlsMode}
                        pointControlsMode={pointControlsMode}
                        x={point.x}
                        y={point.y}
                        xMin={SVs.xMin}
                        xMax={SVs.xMax}
                        yMin={SVs.yMin}
                        yMax={SVs.yMax}
                        formatCoordinate={(value) =>
                            formatCoordinateForControls(value, point)
                        }
                        onMovePointLike={movePointLike}
                    />
                </GraphControl>
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

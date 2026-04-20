import React from "react";
import ControlCard from "../primitives/ControlCard";
import ControlsStack from "../primitives/ControlsStack";
import PointControlCoordinator from "../primitives/PointControlCoordinator";
import {
    GraphControlItem,
    GraphControlPoint,
    PointControlsMode,
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
        graphicalDescendantsForControls: GraphControlItem[];
    };
    callAction: (argObj: Record<string, any>) => Promise<any> | void;
};

type PointSectionConfig = {
    controlIdSuffix: string;
    pointControlsMode: PointControlsMode;
};

function getPointSections(mode: PointControlsMode): PointSectionConfig[] {
    if (mode === "none") {
        return [];
    }

    return [{ controlIdSuffix: "point", pointControlsMode: mode }];
}

export default React.memo(function PointControlsFamily({
    id,
    SVs,
    callAction,
}: PointGraphControlsProps) {
    const points = (Array.isArray(SVs.graphicalDescendantsForControls)
        ? SVs.graphicalDescendantsForControls
        : []
    ).filter(
        (item): item is GraphControlPoint => item.controlType === "point",
    );
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
            const sections = getPointSections(pointControlsMode);
            if (sections.length === 0) {
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
                <ControlCard
                    key={point.componentIdx}
                    id={`${id}-point-${point.componentIdx}`}
                    headingId={`${id}-point-${point.componentIdx}-heading`}
                    heading={pointLabelForDisplay}
                >
                    {sections.map((section) => (
                        <PointControlCoordinator
                            key={`${point.componentIdx}-${section.controlIdSuffix}`}
                            id={id}
                            controlId={`${section.controlIdSuffix}-${point.componentIdx}`}
                            componentIdx={point.componentIdx}
                            pointRole="point"
                            labelForAria={pointLabelForAria}
                            graphControlsMode={graphControlsMode}
                            pointControlsMode={section.pointControlsMode}
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
                    ))}
                </ControlCard>
            );
        })
        .filter((section): section is React.JSX.Element => Boolean(section));

    if (controlsSection.length === 0) {
        return null;
    }

    return (
        <ControlsStack id={`${id}-points`} ariaLabel="Point controls">
            {controlsSection}
        </ControlsStack>
    );
});

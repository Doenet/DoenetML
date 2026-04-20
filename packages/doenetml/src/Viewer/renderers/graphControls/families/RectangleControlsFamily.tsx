import React from "react";
import ControlCard from "../primitives/ControlCard";
import ControlsStack from "../primitives/ControlsStack";
import PointControlCoordinator from "../primitives/PointControlCoordinator";
import ScalarControlCoordinator from "../primitives/ScalarControlCoordinator";
import {
    GraphControlRectangle,
    PointMoveRole,
    RectangleControlsMode,
    normalizeGraphControlsMode,
    normalizeRectangleControlsMode,
} from "../model";
import {
    formatCoordinateForControls,
    parseSingleMathNumber,
} from "../mathFormatParse";
import {
    accessibleLabelText,
    renderLabelWithLatex,
} from "../../utils/labelWithLatex";

type RectangleControlsFamilyProps = {
    id: string;
    SVs: {
        addControls: string;
        xMin: number;
        xMax: number;
        yMin: number;
        yMax: number;
        draggableRectanglesForControls: GraphControlRectangle[];
    };
    callAction: (argObj: Record<string, any>) => Promise<any> | void;
};

type RectangleSectionConfig =
    | {
          kind: "center";
          sectionHeadingHasDivider: boolean;
      }
    | {
          kind: "width" | "height";
          sectionHeading?: string;
          sectionHeadingHasDivider: boolean;
      };

function getRectangleSections(
    mode: RectangleControlsMode,
): RectangleSectionConfig[] {
    if (mode === "center") {
        return [{ kind: "center", sectionHeadingHasDivider: false }];
    }

    if (mode === "widthandheight") {
        return [
            {
                kind: "width",
                sectionHeading: "Dimensions",
                sectionHeadingHasDivider: false,
            },
            {
                kind: "height",
                sectionHeadingHasDivider: false,
            },
        ];
    }

    if (mode === "centerwidthandheight") {
        return [
            { kind: "center", sectionHeadingHasDivider: false },
            {
                kind: "width",
                sectionHeading: "Dimensions",
                sectionHeadingHasDivider: true,
            },
            {
                kind: "height",
                sectionHeadingHasDivider: false,
            },
        ];
    }

    return [];
}

export default React.memo(function RectangleControlsFamily({
    id,
    SVs,
    callAction,
}: RectangleControlsFamilyProps) {
    const graphControlsMode = normalizeGraphControlsMode(SVs.addControls);
    if (graphControlsMode === "none") {
        return null;
    }

    const rectangles = Array.isArray(SVs.draggableRectanglesForControls)
        ? SVs.draggableRectanglesForControls
        : [];
    if (rectangles.length === 0) {
        return null;
    }

    async function moveRectangleCenter({
        componentIdx,
        pointRole,
        x,
        y,
        transient,
        skippable,
    }: {
        componentIdx: number;
        pointRole: PointMoveRole;
        x: number;
        y: number;
        transient: boolean;
        skippable: boolean;
    }) {
        if (pointRole !== "rectangle") {
            return;
        }

        try {
            await callAction({
                action: {
                    actionName: "moveRectangleCenter",
                    componentIdx,
                },
                args: {
                    x,
                    y,
                    pointRole: "rectangle",
                    transient,
                    skippable,
                },
            });
        } catch (error) {
            console.error(
                `[graph-controls] moveRectangleCenter failed for component ${componentIdx}`,
                error,
            );
        }
    }

    async function updateRectangleScalar({
        componentIdx,
        scalarRole,
        value,
        transient,
        skippable,
    }: {
        componentIdx: number;
        scalarRole: string;
        value: number;
        transient: boolean;
        skippable: boolean;
    }) {
        if (scalarRole !== "width" && scalarRole !== "height") {
            return;
        }

        try {
            await callAction({
                action: {
                    actionName:
                        scalarRole === "width" ? "changeWidth" : "changeHeight",
                    componentIdx,
                },
                args: {
                    [scalarRole]: Math.max(0, value),
                    transient,
                    skippable,
                },
            });
        } catch (error) {
            console.error(
                `[graph-controls] ${scalarRole} update failed for component ${componentIdx}`,
                error,
            );
        }
    }

    const defaultDimensionMax = Math.max(
        1,
        Math.abs(SVs.xMax - SVs.xMin),
        Math.abs(SVs.yMax - SVs.yMin),
    );

    const cards = rectangles
        .map((rectangle) => {
            const mode = normalizeRectangleControlsMode(rectangle.addControls);
            const sections = getRectangleSections(mode);
            if (sections.length === 0) {
                return null;
            }

            const fallbackLabel = `Rectangle ${rectangle.rectangleNumber}`;
            const labelForAria = accessibleLabelText({
                label: rectangle.label,
                labelHasLatex: rectangle.labelHasLatex,
                fallback: fallbackLabel,
            });
            const labelForDisplay = rectangle.label.trim()
                ? renderLabelWithLatex({
                      label: rectangle.label,
                      labelHasLatex: rectangle.labelHasLatex,
                  })
                : fallbackLabel;

            const dimensionMax = Math.max(
                defaultDimensionMax,
                rectangle.width,
                rectangle.height,
            );
            const dimensionStep = dimensionMax > 0 ? dimensionMax / 100 : 1;

            return (
                <ControlCard
                    key={rectangle.componentIdx}
                    id={`${id}-rectangle-${rectangle.componentIdx}`}
                    headingId={`${id}-rectangle-${rectangle.componentIdx}-heading`}
                    heading={labelForDisplay}
                >
                    {sections.map((section) => {
                        if (section.kind === "center") {
                            return (
                                <PointControlCoordinator
                                    key={`${rectangle.componentIdx}-center`}
                                    id={id}
                                    controlId={`rectangle-${rectangle.componentIdx}-center`}
                                    componentIdx={rectangle.componentIdx}
                                    pointRole="rectangle"
                                    sectionHeading="Center"
                                    sectionHeadingHasDivider={
                                        section.sectionHeadingHasDivider
                                    }
                                    labelForAria={`center of ${labelForAria}`}
                                    pairAriaLabel={`center coordinates for ${labelForAria}`}
                                    xSliderAriaLabel={`center x coordinate for ${labelForAria}`}
                                    ySliderAriaLabel={`center y coordinate for ${labelForAria}`}
                                    xInputAriaLabel={`center x input for ${labelForAria}`}
                                    yInputAriaLabel={`center y input for ${labelForAria}`}
                                    graphControlsMode={graphControlsMode}
                                    pointControlsMode="both"
                                    x={rectangle.center.x}
                                    y={rectangle.center.y}
                                    xMin={SVs.xMin}
                                    xMax={SVs.xMax}
                                    yMin={SVs.yMin}
                                    yMax={SVs.yMax}
                                    formatCoordinate={(value) =>
                                        formatCoordinateForControls(
                                            value,
                                            rectangle,
                                        )
                                    }
                                    onMovePointLike={moveRectangleCenter}
                                />
                            );
                        }

                        return (
                            <ScalarControlCoordinator
                                key={`${rectangle.componentIdx}-${section.kind}`}
                                id={id}
                                controlId={`rectangle-${rectangle.componentIdx}-${section.kind}`}
                                componentIdx={rectangle.componentIdx}
                                scalarRole={section.kind}
                                sectionHeading={section.sectionHeading}
                                sectionHeadingHasDivider={
                                    section.sectionHeadingHasDivider
                                }
                                label={section.kind}
                                graphControlsMode={graphControlsMode}
                                value={rectangle[section.kind]}
                                min={0}
                                max={dimensionMax}
                                step={dimensionStep}
                                formatValue={(value) =>
                                    formatCoordinateForControls(
                                        value,
                                        rectangle,
                                    )
                                }
                                parseValue={parseSingleMathNumber}
                                controlFamily="rectangle"
                                sliderAriaLabel={`${section.kind} for ${labelForAria}`}
                                inputAriaLabel={`${section.kind} input for ${labelForAria}`}
                                commitErrorContext={`[graph-controls] failed to commit rectangle ${rectangle.componentIdx} ${section.kind} input`}
                                onUpdateScalar={updateRectangleScalar}
                            />
                        );
                    })}
                </ControlCard>
            );
        })
        .filter((card): card is React.JSX.Element => Boolean(card));

    if (cards.length === 0) {
        return null;
    }

    return (
        <ControlsStack id={`${id}-rectangles`} ariaLabel="Rectangle controls">
            {cards}
        </ControlsStack>
    );
});

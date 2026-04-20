import React from "react";
import ControlsStack from "../primitives/ControlsStack";
import ControlCard from "../primitives/ControlCard";
import ScalarControlCoordinator from "../primitives/ScalarControlCoordinator";
import PointControlCoordinator from "../primitives/PointControlCoordinator";
import {
    GraphControlItem,
    PointMoveRole,
    RegularPolygonControlsMode,
    normalizeGraphControlsMode,
    normalizeRegularPolygonControlsMode,
    type GraphControlRegularPolygon,
} from "../model";
import {
    formatCoordinateForControls,
    parseSingleMathNumber,
} from "../mathFormatParse";
import {
    accessibleLabelText,
    renderLabelWithLatex,
} from "../../utils/labelWithLatex";

type RegularPolygonControlsFamilyProps = {
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

type RegularPolygonSectionConfig = {
    kind: "center" | "radius";
    sectionHeadingHasDivider: boolean;
};

function getRegularPolygonSections(
    mode: RegularPolygonControlsMode,
): RegularPolygonSectionConfig[] {
    if (mode === "center") {
        return [{ kind: "center", sectionHeadingHasDivider: false }];
    }

    if (mode === "radius") {
        return [{ kind: "radius", sectionHeadingHasDivider: false }];
    }

    if (mode === "centerandradius") {
        return [
            { kind: "center", sectionHeadingHasDivider: false },
            { kind: "radius", sectionHeadingHasDivider: true },
        ];
    }

    return [];
}

export default React.memo(function RegularPolygonControlsFamily({
    id,
    SVs,
    callAction,
}: RegularPolygonControlsFamilyProps) {
    const graphControlsMode = normalizeGraphControlsMode(SVs.addControls);
    if (graphControlsMode === "none") {
        return null;
    }

    const regularPolygons = (Array.isArray(SVs.graphicalDescendantsForControls)
        ? SVs.graphicalDescendantsForControls
        : []
    ).filter(
        (item): item is GraphControlRegularPolygon =>
            item.controlType === "regularPolygon",
    );
    if (regularPolygons.length === 0) {
        return null;
    }

    async function moveRegularPolygonCenter({
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
        if (pointRole !== "regularPolygon") {
            return;
        }

        try {
            await callAction({
                action: {
                    actionName: "movePolygonCenter",
                    componentIdx,
                },
                args: {
                    center: [x, y],
                    pointRole: "regularPolygon",
                    transient,
                    skippable,
                },
            });
        } catch (error) {
            console.error(
                `[graph-controls] movePolygonCenter failed for component ${componentIdx}`,
                error,
            );
        }
    }

    async function changeRegularPolygonRadius({
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
        if (scalarRole !== "radius") {
            return;
        }

        const radius = Math.max(0, value);

        try {
            await callAction({
                action: {
                    actionName: "changeRadius",
                    componentIdx,
                },
                args: {
                    radius,
                    transient,
                    skippable,
                },
            });
        } catch (error) {
            console.error(
                `[graph-controls] changeRadius failed for component ${componentIdx}`,
                error,
            );
        }
    }

    const defaultRadiusMax = Math.max(
        1,
        Math.abs(SVs.xMax - SVs.xMin),
        Math.abs(SVs.yMax - SVs.yMin),
    );

    const cards = regularPolygons
        .map((regularPolygon) => {
            const mode = normalizeRegularPolygonControlsMode(
                regularPolygon.addControls,
            );
            const sections = getRegularPolygonSections(mode);
            if (sections.length === 0) {
                return null;
            }

            const fallbackLabel = `Regular polygon ${regularPolygon.regularPolygonNumber}`;
            const labelForAria = accessibleLabelText({
                label: regularPolygon.label,
                labelHasLatex: regularPolygon.labelHasLatex,
                fallback: fallbackLabel,
            });
            const labelForDisplay = regularPolygon.label.trim()
                ? renderLabelWithLatex({
                      label: regularPolygon.label,
                      labelHasLatex: regularPolygon.labelHasLatex,
                  })
                : fallbackLabel;

            const radiusMax = Math.max(defaultRadiusMax, regularPolygon.radius);
            const radiusStep = radiusMax > 0 ? radiusMax / 100 : 1;

            return (
                <ControlCard
                    key={regularPolygon.componentIdx}
                    id={`${id}-regularPolygon-${regularPolygon.componentIdx}`}
                    headingId={`${id}-regularPolygon-${regularPolygon.componentIdx}-heading`}
                    heading={labelForDisplay}
                >
                    {sections.map((section) =>
                        section.kind === "center" ? (
                            <PointControlCoordinator
                                key={`${regularPolygon.componentIdx}-center`}
                                id={id}
                                controlId={`regularPolygon-${regularPolygon.componentIdx}-center`}
                                componentIdx={regularPolygon.componentIdx}
                                pointRole="regularPolygon"
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
                                x={regularPolygon.center.x}
                                y={regularPolygon.center.y}
                                xMin={SVs.xMin}
                                xMax={SVs.xMax}
                                yMin={SVs.yMin}
                                yMax={SVs.yMax}
                                formatCoordinate={(value) =>
                                    formatCoordinateForControls(
                                        value,
                                        regularPolygon,
                                    )
                                }
                                onMovePointLike={moveRegularPolygonCenter}
                            />
                        ) : (
                            <ScalarControlCoordinator
                                key={`${regularPolygon.componentIdx}-radius`}
                                id={id}
                                controlId={`regularPolygon-${regularPolygon.componentIdx}-radius`}
                                componentIdx={regularPolygon.componentIdx}
                                scalarRole="radius"
                                sectionHeading="Radius"
                                sectionHeadingHasDivider={
                                    section.sectionHeadingHasDivider
                                }
                                label="radius"
                                graphControlsMode={graphControlsMode}
                                value={regularPolygon.radius}
                                min={0}
                                max={radiusMax}
                                step={radiusStep}
                                formatValue={(value) =>
                                    formatCoordinateForControls(
                                        value,
                                        regularPolygon,
                                    )
                                }
                                parseValue={parseSingleMathNumber}
                                controlFamily="regularPolygon"
                                sliderAriaLabel={`radius for ${labelForAria}`}
                                inputAriaLabel={`radius input for ${labelForAria}`}
                                commitErrorContext={`[graph-controls] failed to commit regular polygon ${regularPolygon.componentIdx} radius input`}
                                onUpdateScalar={changeRegularPolygonRadius}
                            />
                        ),
                    )}
                </ControlCard>
            );
        })
        .filter((card): card is React.JSX.Element => Boolean(card));

    if (cards.length === 0) {
        return null;
    }

    return (
        <ControlsStack
            id={`${id}-regularPolygons`}
            ariaLabel="Regular polygon controls"
        >
            {cards}
        </ControlsStack>
    );
});

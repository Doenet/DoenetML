import React, { useEffect, useContext, useRef } from "react";
import JXG from "jsxgraph";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { BoardContext, LINE_LAYER_OFFSET } from "./graph";
import { MathJax } from "better-react-mathjax";
import { JXGAngle, JXGPoint } from "./jsxgraph-distrib/types";
import { textRendererStyle } from "@doenet/utils";
import { DocContext } from "../DocViewer";
import { ChoiceInputInlineContext } from "./choiceInput";
import { GraphicalSVs } from "./utils/graphicalSVs";
import { syncLayer, syncWithLabelToggle } from "./utils/jsxgraph";
import { getPatternFillAttributes } from "./utils/fillPatterns";

interface AngleSVs extends GraphicalSVs {
    numericalPoints: [number, number][];
    numericalRadius: number;
    swapPointOrder: boolean;
    emphasizeRightAngle: boolean;
    latexForRenderer: string;
}

export default React.memo(function Angle(props: UseDoenetRendererProps) {
    let { id, SVs } = useDoenetRenderer<AngleSVs>(props);

    const board = useContext(BoardContext);
    const choiceInputInlineContext = useContext(ChoiceInputInlineContext);

    let point1JXG = useRef<JXGPoint | null>(null);
    let point2JXG = useRef<JXGPoint | null>(null);
    let point3JXG = useRef<JXGPoint | null>(null);
    let angleJXG = useRef<JXGAngle | null>(null);
    let previousWithLabel = useRef<boolean | null>(null);

    const { darkMode } = useContext(DocContext) || {};

    useEffect(() => {
        return () => {
            deleteGraphicalObject();
        };
    }, []);

    function deleteGraphicalObject() {
        if (point1JXG.current !== null) {
            board?.removeObject(angleJXG.current!);
            angleJXG.current = null;
            board?.removeObject(point1JXG.current);
            point1JXG.current = null;
            board?.removeObject(point2JXG.current!);
            point2JXG.current = null;
            board?.removeObject(point3JXG.current!);
            point3JXG.current = null;
        }
    }

    function createAngleJXG(): JXGAngle | null {
        if (board === null) {
            return null;
        }

        if (
            SVs.numericalPoints.length !== 3 ||
            SVs.numericalPoints.some((x) => x.length !== 2) ||
            !(Number.isFinite(SVs.numericalRadius) && SVs.numericalRadius > 0)
        ) {
            return null;
        }

        const fillAttributes = getPatternFillAttributes({
            defsEl: board.renderer.defs as SVGDefsElement | null,
            boardId: board.container.id,
            fillStyle: SVs.selectedStyle.fillStyle ?? "solid",
            fillColor: SVs.selectedStyle.fillColor,
            fillOpacity: SVs.selectedStyle.fillOpacity,
        });

        var jsxAngleAttributes: Record<string, any> = {
            name: SVs.labelForGraph,
            visible: !SVs.hidden,
            withLabel: SVs.labelForGraph !== "",
            fixed: true,
            layer: 10 * SVs.layer + LINE_LAYER_OFFSET,
            radius: SVs.numericalRadius,
            fillColor: fillAttributes.fillColor,
            fillOpacity: fillAttributes.fillOpacity,
            strokeColor: SVs.selectedStyle.lineColor,
            highlight: false,
            orthoType: SVs.emphasizeRightAngle ? "square" : "sector",
        };

        jsxAngleAttributes.label = {
            highlight: false,
        };
        if (SVs.labelHasLatex) {
            jsxAngleAttributes.label.useMathJax = true;
        }

        previousWithLabel.current = SVs.labelForGraph !== "";

        let through;

        if (SVs.swapPointOrder) {
            through = [
                [...SVs.numericalPoints[2]],
                [...SVs.numericalPoints[1]],
                [...SVs.numericalPoints[0]],
            ];
        } else {
            through = [
                [...SVs.numericalPoints[0]],
                [...SVs.numericalPoints[1]],
                [...SVs.numericalPoints[2]],
            ];
        }

        let jsxPointAttributes = {
            visible: false,
        };

        // create invisible points at through
        point1JXG.current = board.create(
            "point",
            through[0],
            jsxPointAttributes,
        );
        point2JXG.current = board.create(
            "point",
            through[1],
            jsxPointAttributes,
        );
        point3JXG.current = board.create(
            "point",
            through[2],
            jsxPointAttributes,
        );

        return board.create(
            "angle",
            [point1JXG.current, point2JXG.current, point3JXG.current],
            jsxAngleAttributes,
        );
    }

    if (SVs.hidden) {
        return null;
    }

    if (board) {
        if (angleJXG.current === null) {
            angleJXG.current = createAngleJXG();
        } else if (
            SVs.numericalPoints.length !== 3 ||
            SVs.numericalPoints.some((x) => x.length !== 2) ||
            !(Number.isFinite(SVs.numericalRadius) && SVs.numericalRadius > 0)
        ) {
            deleteGraphicalObject();
        } else {
            //update

            let through;
            if (SVs.swapPointOrder) {
                through = [
                    [...SVs.numericalPoints[2]],
                    [...SVs.numericalPoints[1]],
                    [...SVs.numericalPoints[0]],
                ];
            } else {
                through = [
                    [...SVs.numericalPoints[0]],
                    [...SVs.numericalPoints[1]],
                    [...SVs.numericalPoints[2]],
                ];
            }

            // in JSXgraph, point 1 and point 2 are switched
            angleJXG.current.point2.coords.setCoordinates(
                JXG.COORDS_BY_USER,
                through[0],
            );
            angleJXG.current.point1.coords.setCoordinates(
                JXG.COORDS_BY_USER,
                through[1],
            );
            angleJXG.current.point3.coords.setCoordinates(
                JXG.COORDS_BY_USER,
                through[2],
            );

            angleJXG.current.setAttribute({
                radius: SVs.numericalRadius,
                visible: !SVs.hidden,
            });

            syncLayer(angleJXG.current, SVs.layer, LINE_LAYER_OFFSET);

            const fillAttributes = getPatternFillAttributes({
                defsEl: board.renderer.defs as SVGDefsElement | null,
                boardId: board.container.id,
                fillStyle: SVs.selectedStyle.fillStyle ?? "solid",
                fillColor: SVs.selectedStyle.fillColor,
                fillOpacity: SVs.selectedStyle.fillOpacity,
            });
            const angleFillColor = fillAttributes.fillColor;
            if (angleJXG.current.visProp.fillcolor !== angleFillColor) {
                angleJXG.current.visProp.fillcolor = angleFillColor;
            }
            if (
                angleJXG.current.visProp.fillopacity !==
                fillAttributes.fillOpacity
            ) {
                angleJXG.current.visProp.fillopacity =
                    fillAttributes.fillOpacity;
            }
            if (
                angleJXG.current.visProp.strokecolor !==
                SVs.selectedStyle.lineColor
            ) {
                angleJXG.current.visProp.strokecolor =
                    SVs.selectedStyle.lineColor;
            }

            angleJXG.current.name = SVs.labelForGraph;

            syncWithLabelToggle(
                angleJXG.current,
                SVs.labelForGraph,
                previousWithLabel,
            );

            angleJXG.current.visProp.orthotype = SVs.emphasizeRightAngle
                ? "square"
                : "sector";

            angleJXG.current.needsUpdate = true;
            angleJXG.current.update();

            if (angleJXG.current.hasLabel && angleJXG.current.label) {
                angleJXG.current.label.needsUpdate = true;
                angleJXG.current.label.update();
            }
            board.updateRenderer();
        }

        return <span id={id} />;
    }

    const mathJaxify = "\\(" + SVs.latexForRenderer + "\\)";
    const style = !choiceInputInlineContext.inOption
        ? textRendererStyle(darkMode ?? "light", SVs.selectedStyle)
        : undefined;
    return (
        <span style={style} id={id}>
            <MathJax hideUntilTypeset={"first"} inline dynamic>
                {mathJaxify}
            </MathJax>
        </span>
    );
});

import React, { useContext, useEffect, useRef } from "react";
import JXG from "jsxgraph";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { BoardContext, LINE_LAYER_OFFSET } from "./graph";
import { createFunctionFromDefinition } from "@doenet/utils";
import { DocContext } from "../DocViewer";
import { GraphicalSVs } from "./utils/graphicalSVs";
import { JXGCurve, JXGElement, JXGPoint } from "./jsxgraph-distrib/types";
import { getPatternFillAttributes } from "./utils/fillPatterns";

interface RegionBetweenCurveXAxisSVs extends GraphicalSVs {
    haveFunction: boolean;
    boundaryValues: number[];
    fDefinition: any;
}

type JXGIntegral = JXGElement & {
    curveLeft: JXGPoint;
    curveRight: JXGPoint;
};

export default React.memo(function RegionBetweenCurveXAxis(
    props: UseDoenetRendererProps,
) {
    let { id, SVs } = useDoenetRenderer<RegionBetweenCurveXAxisSVs>(props);

    // @ts-ignore
    RegionBetweenCurveXAxis.ignoreActionsWithoutCore = () => true;

    const board = useContext(BoardContext);

    let curveJXG = useRef<JXGCurve | null>(null);
    let integralJXG = useRef<JXGIntegral | null>(null);

    const { darkMode } = useContext(DocContext) || {};

    useEffect(() => {
        //On unmount
        return () => {
            // if integral is defined
            if (integralJXG.current !== null) {
                deleteRegion();
            }
        };
    }, []);

    function createRegion(): JXGIntegral | null {
        if (board === null) {
            return null;
        }
        if (
            !SVs.haveFunction ||
            SVs.boundaryValues.length !== 2 ||
            !SVs.boundaryValues.every(Number.isFinite)
        ) {
            return null;
        }

        const fillAttributes = getPatternFillAttributes({
            defsEl: board.renderer.defs as SVGDefsElement | null,
            boardId: board.container.id,
            fillStyle: SVs.selectedStyle.fillStyle ?? "solid",
            fillColor:
                darkMode === "dark"
                    ? SVs.selectedStyle.fillColorDarkMode
                    : SVs.selectedStyle.fillColor,
            fillOpacity: SVs.selectedStyle.fillOpacity,
        });
        // Note: actual content of label is being ignored
        // but, if label is non-empty, then jsxgraph display a label
        // which is an integral sign = value of integral

        // TODO: either change behavior or change how label is specified

        let jsxAttributes: Record<string, any> = {
            name: SVs.labelForGraph,
            visible: !SVs.hidden,
            withLabel: SVs.labelForGraph !== "",
            fixed: true,
            layer: 10 * SVs.layer + LINE_LAYER_OFFSET,

            fillColor: fillAttributes.fillColor,
            fillOpacity: fillAttributes.fillOpacity,
            highlight: false,

            // don't display points at left and right endpoints along function
            curveLeft: { visible: false },
            curveRight: { visible: false },
        };

        jsxAttributes.label = {
            highlight: false,
        };

        let f = createFunctionFromDefinition(SVs.fDefinition);
        curveJXG.current = board.create("functiongraph", f, {
            visible: false,
        }) as JXGCurve;

        return board.create(
            "integral",
            [SVs.boundaryValues, curveJXG.current],
            jsxAttributes,
        ) as JXGIntegral;
    }

    function deleteRegion() {
        if (integralJXG.current) {
            board?.removeObject(integralJXG.current);
            integralJXG.current = null;

            if (curveJXG.current) {
                board?.removeObject(curveJXG.current);
                curveJXG.current = null;
            }
        }
    }

    if (board) {
        if (integralJXG.current === null) {
            integralJXG.current = createRegion();
        } else if (
            !SVs.haveFunction ||
            SVs.boundaryValues.length !== 2 ||
            !SVs.boundaryValues.every(Number.isFinite)
        ) {
            deleteRegion();
        } else {
            let f = createFunctionFromDefinition(SVs.fDefinition);

            if (curveJXG.current) {
                (curveJXG.current as any).Y = f;
            }
            // Since not drawing curve, do we need to update it?
            // curveJXG.current.needsUpdate = true;
            // curveJXG.current.updateCurve();

            integralJXG.current.visProp["visible"] = !SVs.hidden;
            integralJXG.current.visPropCalc["visible"] = !SVs.hidden;

            let [x1, x2] = SVs.boundaryValues;
            let [y1, y2] = SVs.boundaryValues.map(f as (n: number) => number);
            integralJXG.current.curveLeft.coords.setCoordinates(
                JXG.COORDS_BY_USER,
                [x1, y1],
            );
            integralJXG.current.curveRight.coords.setCoordinates(
                JXG.COORDS_BY_USER,
                [x2, y2],
            );

            let layer = 10 * SVs.layer + LINE_LAYER_OFFSET;
            let layerChanged = integralJXG.current.visProp.layer !== layer;

            if (layerChanged) {
                integralJXG.current.setAttribute({ layer });
            }

            const fillAttributes = getPatternFillAttributes({
                defsEl: board.renderer.defs as SVGDefsElement | null,
                boardId: board.container.id,
                fillStyle: SVs.selectedStyle.fillStyle ?? "solid",
                fillColor:
                    darkMode === "dark"
                        ? SVs.selectedStyle.fillColorDarkMode
                        : SVs.selectedStyle.fillColor,
                fillOpacity: SVs.selectedStyle.fillOpacity,
            });

            if (
                integralJXG.current.visProp.fillcolor !==
                fillAttributes.fillColor
            ) {
                integralJXG.current.visProp.fillcolor =
                    fillAttributes.fillColor;
            }

            if (
                integralJXG.current.visProp.fillopacity !==
                fillAttributes.fillOpacity
            ) {
                integralJXG.current.visProp.fillopacity =
                    fillAttributes.fillOpacity;
            }

            // including both update and full updates for all parts of curve and board
            // makes sure that it updates consistently.
            // Was experiencing intermitant failures without all these updates.
            integralJXG.current.curveLeft.needsUpdate = true;
            integralJXG.current.curveLeft.update();
            integralJXG.current.curveLeft.fullUpdate();

            integralJXG.current.curveRight.needsUpdate = true;
            integralJXG.current.curveLeft.update();
            integralJXG.current.curveRight.fullUpdate();

            integralJXG.current.needsUpdate = true;
            integralJXG.current.curveLeft.update();
            integralJXG.current.fullUpdate();

            board.update();
            board.fullUpdate();

            board.updateRenderer();
        }

        return (
            <>
                <span id={id} />
            </>
        );
    }

    if (SVs.hidden) {
        return null;
    }

    // don't think we want to return anything if not in board
    return (
        <>
            <span id={id} />
        </>
    );
});

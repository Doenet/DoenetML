import React, { useContext, useEffect, useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { BoardContext, LINE_LAYER_OFFSET } from "./graph";
import { createFunctionFromDefinition } from "@doenet/utils";
import { DocContext } from "../DocViewer";
import { GraphicalSVs } from "./utils/graphicalSVs";
import { JXGCurve } from "./jsxgraph-distrib/types";
import { styleToDash } from "./utils/styleToDash";

interface RegionBetweenCurvesSVs extends GraphicalSVs {
    haveFunctions: boolean;
    boundaryValues: number[];
    fDefinitions: any[];
    dashed: boolean;
    flipFunctions: boolean;
}

export default React.memo(function RegionBetweenCurves(
    props: UseDoenetRendererProps,
) {
    let { id, SVs } = useDoenetRenderer<RegionBetweenCurvesSVs>(props);

    // @ts-ignore
    RegionBetweenCurves.ignoreActionsWithoutCore = () => true;

    const board = useContext(BoardContext);

    let curve1JXG = useRef<JXGCurve | null>(null);
    let curve2JXG = useRef<JXGCurve | null>(null);
    let regionJXG = useRef<JXGCurve | null>(null);
    let left = useRef<number | null>(null);
    let right = useRef<number | null>(null);

    const { darkMode } = useContext(DocContext) || {};

    useEffect(() => {
        //On unmount
        return () => {
            deleteRegion();
        };
    }, []);

    function createRegion(): JXGCurve | null {
        if (board === null) {
            return null;
        }
        if (
            !SVs.haveFunctions ||
            SVs.boundaryValues.length !== 2 ||
            !SVs.boundaryValues.every(Number.isFinite)
        ) {
            return null;
        }

        [left.current, right.current] = [...SVs.boundaryValues].sort(
            (a, b) => a - b,
        );

        let lineColor =
            darkMode === "dark"
                ? SVs.selectedStyle.lineColorDarkMode
                : SVs.selectedStyle.lineColor;

        let fillColor =
            darkMode === "dark"
                ? SVs.selectedStyle.fillColorDarkMode
                : SVs.selectedStyle.fillColor;

        let jsxAttributes: Record<string, any> = {
            name: SVs.labelForGraph,
            visible: !SVs.hidden,
            withLabel: SVs.labelForGraph !== "",
            fixed: true,
            layer: 10 * SVs.layer + LINE_LAYER_OFFSET,

            strokeColor: lineColor,
            strokeOpacity: SVs.selectedStyle.lineOpacity,
            strokeWidth: SVs.selectedStyle.lineWidth,
            dash: styleToDash(SVs.selectedStyle.lineStyle, SVs.dashed),

            fillColor,
            fillOpacity: SVs.selectedStyle.fillOpacity,
            highlight: false,
        };

        jsxAttributes.label = {
            highlight: false,
        };

        let f1 = createFunctionFromDefinition(SVs.fDefinitions[0]);
        let f2 = createFunctionFromDefinition(SVs.fDefinitions[1]);
        curve1JXG.current = board.create("functiongraph", f1, {
            visible: false,
        }) as JXGCurve;
        curve2JXG.current = board.create("functiongraph", f2, {
            visible: false,
        }) as JXGCurve;

        // based on https://jsfiddle.net/migerh/u95pL/
        // as described in https://groups.google.com/g/jsxgraph/c/umlhu6CkGD0
        var region = board.create("curve", [[], []], jsxAttributes) as JXGCurve;

        (region as any).updateDataArray = function (this: JXGCurve) {
            // start and end
            var x: number[], y: number[];

            const c1 = curve1JXG.current!;
            const c2 = curve2JXG.current!;
            const leftVal = left.current!;
            const rightVal = right.current!;

            x = [leftVal];
            y = [c1.Y!(leftVal)];

            // go through c1 forwards, push all of c1's data points into the data array for region
            for (let pt of c1.points!) {
                if (leftVal <= pt.usrCoords[1] && pt.usrCoords[1] <= rightVal) {
                    x.push(pt.usrCoords[1]);
                    y.push(pt.usrCoords[2]);
                }
            }
            x.push(rightVal);
            y.push(c1.Y!(rightVal));

            x.push(rightVal);
            y.push(c2.Y!(rightVal));

            // walk backwards through c2
            for (let pt of [...c2.points!].reverse()) {
                if (leftVal <= pt.usrCoords[1] && pt.usrCoords[1] <= rightVal) {
                    x.push(pt.usrCoords[1]);
                    y.push(pt.usrCoords[2]);
                }
            }

            x.push(leftVal);
            y.push(c2.Y!(leftVal));

            // close the curve
            x.push(leftVal);
            y.push(c1.Y!(leftVal));

            if (SVs.flipFunctions) {
                this.dataX = y;
                this.dataY = x;
            } else {
                this.dataX = x;
                this.dataY = y;
            }
        };

        return region;
    }

    function deleteRegion() {
        if (regionJXG.current) {
            board?.removeObject(regionJXG.current);
            regionJXG.current = null;

            if (curve1JXG.current) {
                board?.removeObject(curve1JXG.current);
                curve1JXG.current = null;
            }
            if (curve2JXG.current) {
                board?.removeObject(curve2JXG.current);
                curve2JXG.current = null;
            }
        }
    }

    if (board) {
        if (regionJXG.current === null) {
            regionJXG.current = createRegion();
        } else if (
            !SVs.haveFunctions ||
            SVs.boundaryValues.length !== 2 ||
            !SVs.boundaryValues.every(Number.isFinite)
        ) {
            deleteRegion();
        } else {
            let f1 = createFunctionFromDefinition(SVs.fDefinitions[0]);
            let f2 = createFunctionFromDefinition(SVs.fDefinitions[1]);

            if (curve1JXG.current) {
                (curve1JXG.current as any).Y = f1;
            }
            if (curve2JXG.current) {
                (curve2JXG.current as any).Y = f2;
            }

            regionJXG.current.visProp["visible"] = !SVs.hidden;
            regionJXG.current.visPropCalc["visible"] = !SVs.hidden;

            [left.current, right.current] = [...SVs.boundaryValues].sort(
                (a, b) => a - b,
            );

            let layer = 10 * SVs.layer + LINE_LAYER_OFFSET;
            let layerChanged = regionJXG.current.visProp.layer !== layer;

            if (layerChanged) {
                regionJXG.current.setAttribute({ layer });
            }

            let lineColor =
                darkMode === "dark"
                    ? SVs.selectedStyle.lineColorDarkMode
                    : SVs.selectedStyle.lineColor;

            if (regionJXG.current.visProp.strokecolor !== lineColor) {
                regionJXG.current.visProp.strokecolor = lineColor;
                regionJXG.current.visProp.highlightstrokecolor = lineColor;
            }
            if (
                regionJXG.current.visProp.strokeopacity !==
                SVs.selectedStyle.lineOpacity
            ) {
                regionJXG.current.visProp.strokeopacity =
                    SVs.selectedStyle.lineOpacity;
            }
            let newDash = styleToDash(SVs.selectedStyle.lineStyle, SVs.dashed);
            if (regionJXG.current.visProp.dash !== newDash) {
                regionJXG.current.visProp.dash = newDash;
            }
            if (
                regionJXG.current.visProp.strokewidth !==
                SVs.selectedStyle.lineWidth
            ) {
                regionJXG.current.visProp.strokewidth =
                    SVs.selectedStyle.lineWidth;
            }

            let fillColor =
                darkMode === "dark"
                    ? SVs.selectedStyle.fillColorDarkMode
                    : SVs.selectedStyle.fillColor;

            if (regionJXG.current.visProp.fillcolor !== fillColor) {
                regionJXG.current.visProp.fillcolor = fillColor;
            }

            if (
                regionJXG.current.visProp.fillopacity !==
                SVs.selectedStyle.fillOpacity
            ) {
                regionJXG.current.visProp.fillopacity =
                    SVs.selectedStyle.fillOpacity;
            }

            regionJXG.current.needsUpdate = true;
            regionJXG.current.fullUpdate();

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

    // don't return anything if not in board
    return (
        <>
            <span id={id} />
        </>
    );
});

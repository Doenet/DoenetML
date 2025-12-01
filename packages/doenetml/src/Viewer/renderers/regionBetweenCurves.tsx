// @ts-nocheck
import React, { useContext, useEffect, useState, useRef } from "react";
import useDoenetRenderer from "../useDoenetRenderer";
import { BoardContext, LINE_LAYER_OFFSET } from "./graph";
import { createFunctionFromDefinition } from "@doenet/utils";
import { DocContext } from "../DocViewer";

export default React.memo(function RegionBetweenCurves(props) {
    let { id, SVs } = useDoenetRenderer(props);

    RegionBetweenCurves.ignoreActionsWithoutCore = () => true;

    const board = useContext(BoardContext);

    let curve1JXG = useRef(null);
    let curve2JXG = useRef(null);
    let regionJXG = useRef(null);
    let left = useRef(null);
    let right = useRef(null);

    const { darkMode } = useContext(DocContext) || {};

    useEffect(() => {
        //On unmount
        return () => {
            deleteRegion();
        };
    }, []);

    function createRegion() {
        if (
            !SVs.haveFunctions ||
            SVs.boundaryValues.length !== 2 ||
            !SVs.boundaryValues.every(Number.isFinite)
        ) {
            return null;
        }

        [left.current, right.current] = SVs.boundaryValues.toSorted(
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

        let jsxAttributes = {
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
        });
        curve2JXG.current = board.create("functiongraph", f2, {
            visible: false,
        });

        // based on https://jsfiddle.net/migerh/u95pL/
        // as described in https://groups.google.com/g/jsxgraph/c/umlhu6CkGD0
        var region = board.create("curve", [[], []], jsxAttributes);

        region.updateDataArray = function () {
            // start and end
            var x, y;

            const c1 = curve1JXG.current;
            const c2 = curve2JXG.current;

            x = [left.current];
            y = [c1.Y(left.current)];

            // go through c1 forwards, push all of c1's data points into the data array for region
            for (let pt of c1.points) {
                if (
                    left.current <= pt.usrCoords[1] &&
                    pt.usrCoords[1] <= right.current
                ) {
                    x.push(pt.usrCoords[1]);
                    y.push(pt.usrCoords[2]);
                }
            }
            x.push(right.current);
            y.push(c1.Y(right.current));

            x.push(right.current);
            y.push(c2.Y(right.current));

            // walk backwards through c2
            for (let pt of c2.points.toReversed()) {
                if (
                    left.current <= pt.usrCoords[1] &&
                    pt.usrCoords[1] <= right.current
                ) {
                    x.push(pt.usrCoords[1]);
                    y.push(pt.usrCoords[2]);
                }
            }

            x.push(left.current);
            y.push(c2.Y(left.current));

            // close the curve
            x.push(left.current);
            y.push(c1.Y(left.current));

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

            board?.removeObject(curve1JXG.current);
            curve1JXG.current = null;
            board?.removeObject(curve2JXG.current);
            curve2JXG.current = null;
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

            curve1JXG.current.Y = f1;
            curve2JXG.current.Y = f2;

            regionJXG.current.visProp["visible"] = !SVs.hidden;
            regionJXG.current.visPropCalc["visible"] = !SVs.hidden;

            [left.current, right.current] = SVs.boundaryValues.toSorted(
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
                <a name={id} />
            </>
        );
    }

    if (SVs.hidden) {
        return null;
    }

    // don't think we want to return anything if not in board
    return (
        <>
            <a name={id} />
        </>
    );
});

function styleToDash(style, dash) {
    if (style === "dashed" || dash) {
        return 2;
    } else if (style === "solid") {
        return 0;
    } else if (style === "dotted") {
        return 1;
    } else {
        return 0;
    }
}

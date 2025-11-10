// @ts-nocheck
import React, { useEffect, useState, useRef, createContext } from "react";
import { sizeToCSS } from "./utils/css";
import useDoenetRenderer from "../useDoenetRenderer";
import me from "math-expressions";
import { useRecordVisibilityChanges } from "../../utils/visibility";
//@ts-ignore
import JXG from "jsxgraph";
// import JXG from './jsxgraph';
import { cesc } from "@doenet/utils";
import { JXGObject } from "./jsxgraph-distrib/types";

export const BoardContext = createContext<JXGObject | null>();

export default React.memo(function Graph(props) {
    let { id, SVs, children, ignoreUpdate, actions, callAction } =
        useDoenetRenderer(props);

    Graph.baseStateVariable = "boundingbox";

    const [board, setBoard] = useState(null);

    const previousDimensions = useRef(null);
    const previousBoundingbox = useRef(null);
    const xaxis = useRef(null);
    const yaxis = useRef(null);
    const settingBoundingBox = useRef(false);
    // const resizingBoard = useRef(false);
    const boardJustInitialized = useRef(false);

    const previousShowNavigation = useRef(false);
    let previousXaxisWithLabel = useRef(null);
    let previousYaxisWithLabel = useRef(null);

    let showNavigation = SVs.showNavigation && !SVs.fixAxes;

    const ref = useRef(null);

    useRecordVisibilityChanges(ref, callAction, actions, SVs.haveGraphParent);

    useEffect(() => {
        if (SVs.haveGraphParent) {
            return;
        }
        return () => {
            callAction({
                action: actions.recordVisibilityChange,
                args: { isVisible: false },
            });
        };
    }, []);

    //Draw Board after mounting component
    useEffect(() => {
        if (SVs.haveGraphParent) {
            return;
        }

        let boundingbox = [SVs.xMin, SVs.yMax, SVs.xMax, SVs.yMin];
        previousBoundingbox.current = boundingbox;

        JXG.Options.layer.numlayers = 100;
        JXG.Options.navbar.highlightFillColor = "var(--canvasText)";
        JXG.Options.navbar.strokeColor = "var(--canvasText)";

        // check if have grid with specified width
        let haveFixedGrid = false;
        if (Array.isArray(SVs.grid)) {
            haveFixedGrid = true;
            JXG.Options.grid.gridX = SVs.grid[0];
            JXG.Options.grid.gridY = SVs.grid[1];
        }

        let newBoard = window.JXG.JSXGraph.initBoard(id, {
            boundingbox,
            axis: false,
            showCopyright: false,
            showNavigation: false, // will add navigation buttons later so can style them
            // keepAspectRatio: SVs.identicalAxisScales,
            zoom: { wheel: !SVs.fixAxes, needShift: true },
            pan: { enabled: !SVs.fixAxes, needShift: false },
            grid: haveFixedGrid,
            title: SVs.description,
        });

        newBoard.itemsRenderedLowQuality = {};

        newBoard.on("boundingbox", () => {
            if (
                !(
                    settingBoundingBox.current
                    //  || resizingBoard.current
                )
            ) {
                let newBoundingbox = newBoard.getBoundingBox();
                let [xMin, yMax, xMax, yMin] = newBoundingbox;

                // look for a change in bounding box that isn't due to roundoff error
                let xscale = Math.abs(xMax - xMin);
                let yscale = Math.abs(yMax - yMin);
                let diffs = newBoundingbox.map((v, i) =>
                    Math.abs(v - previousBoundingbox.current[i]),
                );
                if (
                    Math.max(
                        diffs[0] / xscale,
                        diffs[1] / yscale,
                        diffs[2] / xscale,
                        diffs[3] / yscale,
                    ) > 1e-12
                ) {
                    previousBoundingbox.current = newBoundingbox;
                    callAction({
                        action: actions.changeAxisLimits,
                        args: { xMin, xMax, yMin, yMax },
                        baseVariableValue: newBoundingbox,
                    });
                }
            }
        });

        setBoard(newBoard);

        previousDimensions.current = {
            width: parseFloat(sizeToCSS(SVs.width)),
            aspectRatio: SVs.aspectRatio,
        };

        if (SVs.displayXAxis) {
            createXAxis(newBoard);
        }

        if (SVs.displayYAxis) {
            createYAxis(newBoard);
        }

        boardJustInitialized.current = true;

        previousShowNavigation.current = showNavigation;

        // Question: jsxgraph has added a "hit" listener for keyfocusin
        // so we just add a keyfocusout listener.
        // Should we add a keyfocusin listener so we can have parity
        // in the event names?
        // (And in case they change "hit" to include focus by mouse)

        function keyFocusOutListener(evt) {
            let id_node = evt.target.id;

            if (id_node === "") {
                return false;
            }

            let el_id = id_node.replace(id + "_", "");
            let el = newBoard.select(el_id);
            el.triggerEventHandlers?.(["keyfocusout"], [evt]);
        }

        newBoard.containerObj.addEventListener("focusout", keyFocusOutListener);

        function keyDownListener(evt) {
            let id_node = evt.target.id;

            if (id_node === "") {
                return false;
            }

            let el_id = id_node.replace(id + "_", "");
            let el = newBoard.select(el_id);
            el.triggerEventHandlers?.(["keydown"], [evt]);
        }

        newBoard.containerObj.addEventListener("keydown", keyDownListener);

        // on unmount
        return () => {
            newBoard.off("boundingbox");
        };
    }, []);

    useEffect(() => {
        if (board && showNavigation) {
            addNavigationButtons();
        }
    }, [board]);

    if (SVs.haveGraphParent) {
        // have have graph parent, then don't render graph
        // but just render children so that will be inside parent graph
        return (
            <>
                <a name={id} />
                {children}
            </>
        );
    }

    const divStyle = {
        width: sizeToCSS(SVs.width),
        aspectRatio: String(SVs.aspectRatio),
        maxWidth: "100%",
    };

    let outerStyle = {};

    if (SVs.hidden) {
        divStyle.display = "none";
    } else if (SVs.displayMode === "inline") {
        outerStyle = { display: "inline-block", verticalAlign: "middle" };
    } else {
        outerStyle = { display: "flex", justifyContent: SVs.horizontalAlign };
    }

    if (SVs.showBorder) {
        divStyle.border = "2px solid var(--canvasText)";
    } else {
        divStyle.border = "none";
    }
    divStyle.marginBottom = "12px";
    divStyle.marginTop = "12px";
    divStyle.backgroundColor = "var(--canvas)";
    divStyle.color = "var(--canvasText)";

    if (!board) {
        return (
            <div style={outerStyle} ref={ref}>
                <a name={id} />
                <div id={id} className="jxgbox" style={divStyle} />
            </div>
        );
    }

    if (boardJustInitialized.current) {
        // skip the update logic the first time after just created the board
        boardJustInitialized.current = false;
    } else {
        // check if have grid with specified width
        if (Array.isArray(SVs.grid)) {
            let gridParamsChanged =
                JXG.Options.grid.gridX !== SVs.grid[0] ||
                JXG.Options.grid.gridY !== SVs.grid[1];
            if (gridParamsChanged) {
                JXG.Options.grid.gridX = SVs.grid[0];
                JXG.Options.grid.gridY = SVs.grid[1];
                if (board.grids.length > 0) {
                    board.removeObject(board.grids[0]);
                    board.grids = [];
                }
            }
            if (board.grids.length === 0) {
                board.create("grid", [], {
                    gridX: SVs.grid[0],
                    gridY: SVs.grid[1],
                });
            }
        } else {
            if (board.grids.length > 0) {
                board.removeObject(board.grids[0]);
                board.grids = [];
            }
        }

        if (SVs.grid === "dense") {
            if (xaxis.current) {
                xaxis.current.defaultTicks.setAttribute({ majorHeight: -1 });
                xaxis.current.defaultTicks.setAttribute({ minorHeight: -1 });
            }
            if (yaxis.current) {
                yaxis.current.defaultTicks.setAttribute({ majorHeight: -1 });
                yaxis.current.defaultTicks.setAttribute({ minorHeight: -1 });
            }
        } else if (SVs.grid === "medium") {
            if (xaxis.current) {
                xaxis.current.defaultTicks.setAttribute({ majorHeight: -1 });
                xaxis.current.defaultTicks.setAttribute({ minorHeight: 10 });
            }
            if (yaxis.current) {
                yaxis.current.defaultTicks.setAttribute({ majorHeight: -1 });
                yaxis.current.defaultTicks.setAttribute({ minorHeight: 10 });
            }
        } else {
            if (xaxis.current) {
                xaxis.current.defaultTicks.setAttribute({ majorHeight: 12 });
                xaxis.current.defaultTicks.setAttribute({ minorHeight: 10 });
            }
            if (yaxis.current) {
                yaxis.current.defaultTicks.setAttribute({ majorHeight: 12 });
                yaxis.current.defaultTicks.setAttribute({ minorHeight: 10 });
            }
        }

        // Note: since we display a zero tick only if the other axis does not exist,
        // if the display of one axis changed, we delete and rebuild the other axis
        let displayXAxisChanged = SVs.displayXAxis
            ? !Boolean(xaxis.current)
            : Boolean(xaxis.current);
        let displayYAxisChanged = SVs.displayYAxis
            ? !Boolean(yaxis.current)
            : Boolean(yaxis.current);

        if (displayYAxisChanged && !displayXAxisChanged && SVs.displayXAxis) {
            board.removeObject(xaxis.current);
            xaxis.current = null;
        }

        if (displayXAxisChanged && !displayYAxisChanged && SVs.displayYAxis) {
            board.removeObject(yaxis.current);
            yaxis.current = null;
        }

        if (SVs.displayXAxis) {
            if (xaxis.current) {
                let xaxisWithLabel = Boolean(SVs.xLabel);

                if (xaxisWithLabel !== previousXaxisWithLabel.current) {
                    xaxis.current.setAttribute({ withlabel: xaxisWithLabel });
                    previousXaxisWithLabel.current = xaxisWithLabel;
                }
                xaxis.current.name = SVs.xLabel;
                xaxis.current.defaultTicks.setAttribute({
                    drawLabels: SVs.displayXAxisTickLabels,
                });
                setMinorTicks(xaxis.current);
                if (xaxis.current.hasLabel) {
                    let position = "rt";
                    let offset = [5, 10];
                    let anchorx = "right";
                    if (SVs.xLabelPosition === "left") {
                        position = "lft";
                        anchorx = "left";
                        offset = [-5, 10];
                    }
                    xaxis.current.label.visProp.position = position;
                    xaxis.current.label.visProp.anchorx = anchorx;
                    xaxis.current.label.visProp.offset = offset;
                    xaxis.current.label.needsUpdate = true;
                    xaxis.current.label.fullUpdate();
                }
            } else {
                createXAxis(board);
            }
        } else if (xaxis.current) {
            board.removeObject(xaxis.current);
            xaxis.current = null;
        }

        if (SVs.displayYAxis) {
            if (yaxis.current) {
                let yaxisWithLabel = Boolean(SVs.yLabel);

                if (yaxisWithLabel !== previousYaxisWithLabel.current) {
                    yaxis.current.setAttribute({ withlabel: yaxisWithLabel });
                    previousYaxisWithLabel.current = yaxisWithLabel;
                }
                yaxis.current.name = SVs.yLabel;
                yaxis.current.defaultTicks.setAttribute({
                    drawLabels: SVs.displayYAxisTickLabels,
                });
                setMinorTicks(yaxis.current);
                if (yaxis.current.hasLabel) {
                    let position = "rt";
                    let offset = [-10, -5];
                    let anchorx = "right";
                    if (SVs.yLabelPosition === "bottom") {
                        position = "lft";
                        offset[1] = 5;
                    }
                    if (SVs.yLabelAlignment === "right") {
                        anchorx = "left";
                        offset[0] = 10;
                    }
                    yaxis.current.label.visProp.position = position;
                    yaxis.current.label.visProp.offset = offset;
                    yaxis.current.label.visProp.anchorx = anchorx;
                    yaxis.current.label.needsUpdate = true;
                    yaxis.current.label.fullUpdate();
                }
            } else {
                createYAxis(board);
            }
        } else if (yaxis.current) {
            board.removeObject(yaxis.current);
            yaxis.current = null;
        }

        board.attr.zoom.wheel = !SVs.fixAxes;
        board.attr.pan.enabled = !SVs.fixAxes;

        if (showNavigation) {
            if (!previousShowNavigation.current) {
                addNavigationButtons();
                previousShowNavigation.current = true;
            }
        } else {
            if (previousShowNavigation.current) {
                removeNavigationButtons();
                previousShowNavigation.current = false;
            }
        }

        let currentDimensions = {
            width: parseFloat(sizeToCSS(SVs.width)),
            aspectRatio: SVs.aspectRatio,
        };

        if (
            (currentDimensions.width !== previousDimensions.current.width ||
                currentDimensions.aspectRatio !==
                    previousDimensions.current.aspectRatio) &&
            Number.isFinite(currentDimensions.width) &&
            Number.isFinite(currentDimensions.aspectRatio)
        ) {
            // resizingBoard.current = true;
            // board.resizeContainer(currentDimensions.width, currentDimensions.height);
            // resizingBoard.current = false;
            previousDimensions.current = currentDimensions;
        }

        // since baseStateVariable is boundingbox,
        // ignoreUpdate means ignore change in boundingbox
        if (!ignoreUpdate) {
            let boundingbox = [SVs.xMin, SVs.yMax, SVs.xMax, SVs.yMin];

            if (
                boundingbox.some((v, i) => v !== previousBoundingbox.current[i])
            ) {
                settingBoundingBox.current = true;
                board.setBoundingBox(boundingbox);
                settingBoundingBox.current = false;
                // seem to need to call this again to get the ticks correct
                board.fullUpdate();

                if (board.updateQuality === board.BOARD_QUALITY_LOW) {
                    board.itemsRenderedLowQuality[id] = board;
                }

                previousBoundingbox.current = boundingbox;
            }
        }
    }

    return (
        <div style={outerStyle} ref={ref}>
            <a name={id} />
            <div id={id} className="jxgbox" style={divStyle} />
            <BoardContext.Provider value={board}>
                {children}
            </BoardContext.Provider>
        </div>
    );

    function setMinorTicks(axis) {
        const ticks = axis.defaultTicks;
        const tickInterval = ticks.getDistanceMajorTicks();

        let mag =
            10 ** Math.floor(Math.log10(tickInterval)) * ticks.visProp.scale;

        let minorTicks = 4;

        if (Math.abs(tickInterval / mag - 2) < 1e-14) {
            minorTicks = 3;
        }

        ticks.visProp.minorticks = minorTicks;
        ticks.fullUpdate();
    }

    function createYAxis(theBoard) {
        let yaxisOptions = { highlight: false, fixed: true };
        if (SVs.yLabel) {
            let position = "rt";
            let offset = [-10, -5];
            let anchorx = "right";
            if (SVs.yLabelPosition === "bottom") {
                position = "lft";
                offset[1] = 5;
            }
            if (SVs.yLabelAlignment === "right") {
                anchorx = "left";
                offset[0] = 10;
            }
            yaxisOptions.name = SVs.yLabel;
            yaxisOptions.withLabel = true;
            yaxisOptions.label = {
                position,
                offset,
                anchorx,
                strokeColor: "var(--canvasText)",
                highlight: false,
            };
            if (SVs.yLabelHasLatex) {
                yaxisOptions.label.useMathJax = true;
            }
        }
        previousYaxisWithLabel.current = Boolean(SVs.yLabel);

        yaxisOptions.strokeColor = "var(--canvasText)";
        yaxisOptions.highlight = false;

        yaxisOptions.ticks = {
            ticksDistance: 2,
            label: {
                offset: [12, -2],
                layer: 2,
                strokeColor: "var(--canvasText)",
                highlightStrokeColor: "var(--canvasText)",
                highlightStrokeOpacity: 1,
            },
            strokeColor: "var(--canvasText)",
            strokeOpacity: 0.5,
            digits: 4,
            drawLabels: SVs.displayYAxisTickLabels,
        };
        if (SVs.yTickScaleFactor !== null) {
            let yTickScaleFactor = me.fromAst(SVs.yTickScaleFactor);
            let scale = yTickScaleFactor.evaluate_to_constant();
            if (scale > 0) {
                let scaleSymbol = yTickScaleFactor.toString();
                yaxisOptions.ticks.scale = scale;
                yaxisOptions.ticks.scaleSymbol = scaleSymbol;
            }
        }
        if (SVs.grid === "dense") {
            yaxisOptions.ticks.majorHeight = -1;
            yaxisOptions.ticks.minorHeight = -1;
        } else if (SVs.grid === "medium") {
            yaxisOptions.ticks.majorHeight = -1;
            yaxisOptions.ticks.minorHeight = 10;
        } else {
            yaxisOptions.ticks.majorHeight = 12;
            yaxisOptions.ticks.minorHeight = 10;
        }

        if (!SVs.displayXAxis) {
            yaxisOptions.ticks.drawZero = true;
        }

        theBoard.suspendUpdate();

        yaxis.current = theBoard.create(
            "axis",
            [
                [0, 0],
                [0, 1],
            ],
            yaxisOptions,
        );

        setMinorTicks(yaxis.current);

        theBoard.unsuspendUpdate();
    }

    function createXAxis(theBoard) {
        let xaxisOptions = { highlight: false, fixed: true };
        if (SVs.xLabel) {
            let position = "rt";
            let offset = [5, 10];
            let anchorx = "right";
            if (SVs.xLabelPosition === "left") {
                position = "lft";
                anchorx = "left";
                offset = [-5, 10];
            }
            xaxisOptions.name = SVs.xLabel;
            xaxisOptions.withLabel = true;
            xaxisOptions.label = {
                position,
                offset,
                anchorx,
                strokeColor: "var(--canvasText)",
                highlight: false,
            };
            if (SVs.xLabelHasLatex) {
                xaxisOptions.label.useMathJax = true;
            }
        }
        previousXaxisWithLabel.current = Boolean(SVs.xLabel);

        xaxisOptions.ticks = {
            ticksDistance: 2,
            label: {
                offset: [-5, -15],
                layer: 2,
                strokeColor: "var(--canvasText)",
                highlightStrokeColor: "var(--canvasText)",
                highlightStrokeOpacity: 1,
            },
            strokeColor: "var(--canvasText)",
            strokeOpacity: 0.5,
            digits: 4,
            drawLabels: SVs.displayXAxisTickLabels,
        };
        if (SVs.xTickScaleFactor !== null) {
            let xTickScaleFactor = me.fromAst(SVs.xTickScaleFactor);
            let scale = xTickScaleFactor.evaluate_to_constant();
            if (scale > 0) {
                let scaleSymbol = xTickScaleFactor.toString();
                xaxisOptions.ticks.scale = scale;
                xaxisOptions.ticks.scaleSymbol = scaleSymbol;
            }
        }
        xaxisOptions.strokeColor = "var(--canvasText)";
        xaxisOptions.highlight = false;

        if (SVs.grid === "dense") {
            xaxisOptions.ticks.majorHeight = -1;
            xaxisOptions.ticks.minorHeight = -1;
        } else if (SVs.grid === "medium") {
            xaxisOptions.ticks.majorHeight = -1;
            xaxisOptions.ticks.minorHeight = 10;
        } else {
            xaxisOptions.ticks.majorHeight = 12;
            xaxisOptions.ticks.minorHeight = 10;
        }

        if (!SVs.displayYAxis) {
            xaxisOptions.ticks.drawZero = true;
        }

        theBoard.suspendUpdate();

        xaxis.current = theBoard.create(
            "axis",
            [
                [0, 0],
                [1, 0],
            ],
            xaxisOptions,
        );

        setMinorTicks(xaxis.current);
        theBoard.unsuspendUpdate();
    }

    function addNavigationButtons() {
        // not sure why getElementById doesn't work
        let navigationBar = document.querySelector(
            "#" + cesc(id) + `_navigationbar`,
        );

        // code modified from abstract.js and env.js of JSXGraph

        let addEvent = function (obj, type, fn) {
            var el = function () {
                return fn.apply(board, arguments);
            };

            board["x_internal" + type] = board["x_internal" + type] || [];
            board["x_internal" + type].push(el);

            obj.addEventListener(type, el, false);
        };

        let cancelbubble = function (e) {
            if (!e) {
                e = window.event;
            }

            if (e.stopPropagation) {
                // Non IE<=8
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }
        };

        let createButton = function (label, handler) {
            var button;

            button = document.createElement("span");
            navigationBar.appendChild(button);
            button.setAttribute(
                "style",
                "color: var(--canvasText); opacity: 0.7",
            );
            let text_node = document.createTextNode(label);
            button.appendChild(text_node);

            // Style settings are superseded by adding the CSS class below
            button.style.paddingLeft = "7px";
            button.style.paddingRight = "7px";

            if (button.classList !== undefined) {
                // classList not available in IE 9
                button.classList.add("JXG_navigation_button");
            }

            addEvent(
                button,
                "click",
                function (e) {
                    handler.bind(board)();
                    return false;
                },
                board,
            );
            // prevent the click from bubbling down to the board
            addEvent(button, "mouseup", cancelbubble);
            addEvent(button, "mousedown", cancelbubble);
            addEvent(button, "touchend", cancelbubble);
            addEvent(button, "touchstart", cancelbubble);
            addEvent(button, "pointerup", cancelbubble);
            addEvent(button, "pointerdown", cancelbubble);
            addEvent(button, "pointerleave", cancelbubble);
        };

        if (board.attr.showzoom) {
            createButton("\u2013", board.zoomOut);
            createButton("o", board.zoom100);
            createButton("+", board.zoomIn);
        }
    }

    function removeNavigationButtons() {
        for (let i = 3; i >= 1; i--) {
            let button = document.querySelector(
                "#" + cesc(id) + `_navigationbar > :first-child`,
            );
            button.remove();
        }

        board.internalclick = [];
        board.internalmousedown = [];
        board.internalmouseup = [];
        board.internaltouchend = [];
        board.internaltouchstart = [];
    }
});

// ticks labels: layer 2 overall

// NOTE: there can be at most 10 different layer offsets,
// given that the DoenetML layer is multiplied by 10 and added to these offsets
let tempCounter = 0;
export const BASE_LAYER_OFFSET = tempCounter++;
export const IMAGE_LAYER_OFFSET = tempCounter++;
export const LINE_LAYER_OFFSET = tempCounter++;
export const VERTEX_LAYER_OFFSET = tempCounter++;
export const CONTROL_POINT_LAYER_OFFSET = tempCounter++;
export const POINT_LAYER_OFFSET = tempCounter++;
export const TEXT_LAYER_OFFSET = tempCounter++;

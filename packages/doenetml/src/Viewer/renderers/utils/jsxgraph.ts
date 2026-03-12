// @ts-nocheck
import me from "math-expressions";
import { cesc } from "@doenet/utils";

export function setMinorTicks(axis) {
    const ticks = axis.defaultTicks;
    const tickInterval = ticks.getDistanceMajorTicks();

    const mag = 10 ** Math.floor(Math.log10(tickInterval)) * ticks.visProp.scale;

    let minorTicks = 4;

    if (Math.abs(tickInterval / mag - 2) < 1e-14) {
        minorTicks = 3;
    }

    ticks.visProp.minorticks = minorTicks;
    ticks.fullUpdate();
}

export function applyAxisTickHeights({ grid, xaxisRef, yaxisRef }) {
    if (grid === "dense") {
        if (xaxisRef.current) {
            xaxisRef.current.defaultTicks.setAttribute({ majorHeight: -1 });
            xaxisRef.current.defaultTicks.setAttribute({ minorHeight: -1 });
        }
        if (yaxisRef.current) {
            yaxisRef.current.defaultTicks.setAttribute({ majorHeight: -1 });
            yaxisRef.current.defaultTicks.setAttribute({ minorHeight: -1 });
        }
    } else if (grid === "medium") {
        if (xaxisRef.current) {
            xaxisRef.current.defaultTicks.setAttribute({ majorHeight: -1 });
            xaxisRef.current.defaultTicks.setAttribute({ minorHeight: 10 });
        }
        if (yaxisRef.current) {
            yaxisRef.current.defaultTicks.setAttribute({ majorHeight: -1 });
            yaxisRef.current.defaultTicks.setAttribute({ minorHeight: 10 });
        }
    } else {
        if (xaxisRef.current) {
            xaxisRef.current.defaultTicks.setAttribute({ majorHeight: 12 });
            xaxisRef.current.defaultTicks.setAttribute({ minorHeight: 10 });
        }
        if (yaxisRef.current) {
            yaxisRef.current.defaultTicks.setAttribute({ majorHeight: 12 });
            yaxisRef.current.defaultTicks.setAttribute({ minorHeight: 10 });
        }
    }
}

export function createYAxis({
    theBoard,
    SVs,
    yaxisRef,
    previousYaxisWithLabelRef,
}) {
    const yaxisOptions = { highlight: false, fixed: true };
    if (SVs.yLabel) {
        let position = "rt";
        const offset = [-10, -5];
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
    previousYaxisWithLabelRef.current = Boolean(SVs.yLabel);

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
        const yTickScaleFactor = me.fromAst(SVs.yTickScaleFactor);
        const scale = yTickScaleFactor.evaluate_to_constant();
        if (scale > 0) {
            const scaleSymbol = yTickScaleFactor.toString();
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

    yaxisRef.current = theBoard.create(
        "axis",
        [
            [0, 0],
            [0, 1],
        ],
        yaxisOptions,
    );

    setMinorTicks(yaxisRef.current);

    theBoard.unsuspendUpdate();
}

export function createXAxis({
    theBoard,
    SVs,
    xaxisRef,
    previousXaxisWithLabelRef,
}) {
    const xaxisOptions = { highlight: false, fixed: true };
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
    previousXaxisWithLabelRef.current = Boolean(SVs.xLabel);

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
        const xTickScaleFactor = me.fromAst(SVs.xTickScaleFactor);
        const scale = xTickScaleFactor.evaluate_to_constant();
        if (scale > 0) {
            const scaleSymbol = xTickScaleFactor.toString();
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

    xaxisRef.current = theBoard.create(
        "axis",
        [
            [0, 0],
            [1, 0],
        ],
        xaxisOptions,
    );

    setMinorTicks(xaxisRef.current);
    theBoard.unsuspendUpdate();
}

export function addNavigationButtons({ board, id }) {
    const navigationBar = document.querySelector("#" + cesc(id) + `_navigationbar`);

    const addEvent = function (obj, type, fn) {
        const el = function () {
            return fn.apply(board, arguments);
        };

        board["x_internal" + type] = board["x_internal" + type] || [];
        board["x_internal" + type].push(el);

        obj.addEventListener(type, el, false);
    };

    const cancelbubble = function (e) {
        if (!e) {
            e = window.event;
        }

        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
    };

    const createButton = function (label, handler) {
        const button = document.createElement("span");
        navigationBar.appendChild(button);
        button.setAttribute("style", "color: var(--canvasText); opacity: 0.7");
        const text_node = document.createTextNode(label);
        button.appendChild(text_node);

        button.style.paddingLeft = "7px";
        button.style.paddingRight = "7px";

        if (button.classList !== undefined) {
            button.classList.add("JXG_navigation_button");
        }

        addEvent(
            button,
            "click",
            function () {
                handler.bind(board)();
                return false;
            },
            board,
        );
        addEvent(button, "mouseup", cancelbubble);
        addEvent(button, "mousedown", cancelbubble);
        addEvent(button, "touchend", cancelbubble);
        addEvent(button, "touchstart", cancelbubble);
        addEvent(button, "pointerup", cancelbubble);
        addEvent(button, "pointerdown", cancelbubble);
        addEvent(button, "pointerleave", cancelbubble);
    };

    if (board.attr.showzoom) {
        createButton("-", board.zoomOut);
        createButton("o", board.zoom100);
        createButton("+", board.zoomIn);
    }
}

export function removeNavigationButtons({ board, id }) {
    for (let i = 3; i >= 1; i--) {
        const button = document.querySelector(
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

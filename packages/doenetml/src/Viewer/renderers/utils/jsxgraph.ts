import me from "math-expressions";
import { cesc } from "@doenet/utils";
import type { RefObject } from "react";
import { JXGBoard, JXGElement } from "../jsxgraph-distrib/types";

export type AxisJXG = JXGElement & {
    defaultTicks: {
        getDistanceMajorTicks: () => number;
        visProp: Record<string, any>;
        setAttribute: (attrs: Record<string, any>) => void;
        fullUpdate: () => void;
    };
    getLabelAnchor?: () => { scrCoords?: number[] };
};

export type AxisRef = RefObject<AxisJXG | null | undefined>;

/**
 * Minimal structural shape for the line-like objects these helpers touch.
 * Defined loosely so both legacy `JXGObject` consumers and new `JXGElement`
 * consumers can pass values without contortion.
 */
type LineLikeJXG = {
    hasLabel?: boolean;
    label?: any;
    needsUpdate?: boolean;
    update?: Function;
    getLabelAnchor?: () => { scrCoords?: number[] };
    [key: string]: any;
};

export function setMinorTicks(axis: AxisJXG): void {
    const ticks = axis.defaultTicks;
    const tickInterval = ticks.getDistanceMajorTicks();

    const mag =
        10 ** Math.floor(Math.log10(tickInterval)) * ticks.visProp.scale;

    let minorTicks = 4;

    if (Math.abs(tickInterval / mag - 2) < 1e-14) {
        minorTicks = 3;
    }

    ticks.visProp.minorticks = minorTicks;
    ticks.fullUpdate();
}

export function applyAxisTickHeights({
    grid,
    xaxisRef,
    yaxisRef,
    displayXAxisTicks = true,
    displayYAxisTicks = true,
}: {
    grid: unknown;
    xaxisRef: AxisRef;
    yaxisRef: AxisRef;
    displayXAxisTicks?: boolean;
    displayYAxisTicks?: boolean;
}): void {
    // Only control real ticks (height != -1), not grid lines (height = -1)
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
            xaxisRef.current.defaultTicks.setAttribute({
                minorHeight: displayXAxisTicks ? 10 : 0,
            });
        }
        if (yaxisRef.current) {
            yaxisRef.current.defaultTicks.setAttribute({ majorHeight: -1 });
            yaxisRef.current.defaultTicks.setAttribute({
                minorHeight: displayYAxisTicks ? 10 : 0,
            });
        }
    } else {
        if (xaxisRef.current) {
            xaxisRef.current.defaultTicks.setAttribute({
                majorHeight: displayXAxisTicks ? 12 : 0,
            });
            xaxisRef.current.defaultTicks.setAttribute({
                minorHeight: displayXAxisTicks ? 10 : 0,
            });
        }
        if (yaxisRef.current) {
            yaxisRef.current.defaultTicks.setAttribute({
                majorHeight: displayYAxisTicks ? 12 : 0,
            });
            yaxisRef.current.defaultTicks.setAttribute({
                minorHeight: displayYAxisTicks ? 10 : 0,
            });
        }
    }
}

/**
 * Restore the sign of an axis's tick labels after its defining points have
 * been reversed (as done for a negative-only axis so the arrow head is drawn
 * on the negative side).
 *
 * JSXGraph computes each equidistant tick label from the *signed distance*
 * from the origin, where the sign follows the axis's `point1 -> point2`
 * direction (see `getDistanceFromZero` in jsxgraph's ticks.js). When the axis
 * is defined pointing toward the negative direction, that flips the sign of
 * every label (e.g. the tick at x = -2 would be labeled "2"). Overriding
 * `generateLabelText` to read the tick's true coordinate restores the correct
 * labels while leaving tick placement and bounds untouched.
 *
 * @param coordIndex 1 for an x axis, 2 for a y axis (JSXGraph `usrCoords` are
 *   homogeneous: `[w, x, y]`).
 */
function reverseTickLabelSigns(axis: AxisJXG, coordIndex: 1 | 2): void {
    const ticks = axis.defaultTicks as any;
    ticks.generateLabelText = function (tick: { usrCoords: number[] }): string {
        const scale = this.evalVisProp("scale") || 1;
        const coord = tick.usrCoords[coordIndex];
        if (Math.abs(coord) < 1e-12) {
            return "0";
        }
        return this.formatLabelText(coord / scale);
    };
}

export function createXAxis({
    theBoard,
    SVs,
    xaxisRef,
    previousXaxisWithLabelRef,
}: {
    theBoard: JXGBoard;
    SVs: Record<string, any>;
    xaxisRef: AxisRef;
    previousXaxisWithLabelRef: RefObject<boolean>;
}): void {
    const xaxisOptions: Record<string, any> = { highlight: false, fixed: true };
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
        if (scale !== null && scale > 0) {
            const scaleSymbol = xTickScaleFactor.toString();
            xaxisOptions.ticks.scale = scale;
            xaxisOptions.ticks.scaleSymbol = scaleSymbol;
        }
    }
    xaxisOptions.strokeColor = "var(--canvasText)";
    xaxisOptions.highlight = false;

    // Only control real ticks (height != -1), not grid lines (height = -1)
    if (SVs.grid === "dense") {
        xaxisOptions.ticks.majorHeight = -1;
        xaxisOptions.ticks.minorHeight = -1;
    } else if (SVs.grid === "medium") {
        xaxisOptions.ticks.majorHeight = -1;
        xaxisOptions.ticks.minorHeight = SVs.displayXAxisTicks ? 10 : 0;
    } else {
        xaxisOptions.ticks.majorHeight = SVs.displayXAxisTicks ? 12 : 0;
        xaxisOptions.ticks.minorHeight = SVs.displayXAxisTicks ? 10 : 0;
    }

    if (SVs.displayYAxis === "none") {
        xaxisOptions.ticks.drawZero = true;
    }

    // Second defining point of the axis. For a negative-only axis, point it
    // toward -x so the axis (and its default arrow head) is drawn on the
    // negative side, mirroring the positive-only case exactly. This keeps the
    // arrow head inside the graph's rounded border, unlike a custom
    // `firstArrow` extending in the backward direction. The tradeoff is that
    // JSXGraph signs tick labels by the point1->point2 direction, so the
    // labels must have their sign restored afterward (see reverseTickLabelSigns).
    let secondPoint = [1, 0];
    if (SVs.displayXAxis === "positiveonly") {
        xaxisOptions.straightFirst = false;
    } else if (SVs.displayXAxis === "negativeonly") {
        xaxisOptions.straightFirst = false;
        secondPoint = [-1, 0];
    }

    theBoard.suspendUpdate();

    xaxisRef.current = theBoard.create(
        "axis",
        [[0, 0], secondPoint],
        xaxisOptions,
    ) as AxisJXG;

    if (SVs.displayXAxis === "negativeonly") {
        reverseTickLabelSigns(xaxisRef.current, 1);
    }

    setMinorTicks(xaxisRef.current);
    theBoard.unsuspendUpdate();
}

export function createYAxis({
    theBoard,
    SVs,
    yaxisRef,
    previousYaxisWithLabelRef,
}: {
    theBoard: JXGBoard;
    SVs: Record<string, any>;
    yaxisRef: AxisRef;
    previousYaxisWithLabelRef: RefObject<boolean>;
}): void {
    const yaxisOptions: Record<string, any> = { highlight: false, fixed: true };
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
        if (scale !== null && scale > 0) {
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
        yaxisOptions.ticks.minorHeight = SVs.displayYAxisTicks ? 10 : 0;
    } else {
        yaxisOptions.ticks.majorHeight = SVs.displayYAxisTicks ? 12 : 0;
        yaxisOptions.ticks.minorHeight = SVs.displayYAxisTicks ? 10 : 0;
    }

    if (SVs.displayXAxis === "none") {
        yaxisOptions.ticks.drawZero = true;
    }

    // See createXAxis for why a negative-only axis is defined toward the
    // negative direction (arrow head placement) and why its tick label signs
    // must then be restored.
    let secondPoint = [0, 1];
    if (SVs.displayYAxis === "positiveonly") {
        yaxisOptions.straightFirst = false;
    } else if (SVs.displayYAxis === "negativeonly") {
        yaxisOptions.straightFirst = false;
        secondPoint = [0, -1];
    }

    theBoard.suspendUpdate();

    yaxisRef.current = theBoard.create(
        "axis",
        [[0, 0], secondPoint],
        yaxisOptions,
    ) as AxisJXG;

    if (SVs.displayYAxis === "negativeonly") {
        reverseTickLabelSigns(yaxisRef.current, 2);
    }

    setMinorTicks(yaxisRef.current);

    theBoard.unsuspendUpdate();
}

export function addNavigationButtons({
    board,
    id,
}: {
    board: JXGBoard;
    id: string;
}): void {
    const navigationBar = document.querySelector(
        "#" + cesc(id) + `_navigationbar`,
    );

    if (!navigationBar) {
        return;
    }

    const addEvent = function (obj: Element, type: string, fn: Function) {
        const el = function (this: unknown) {
            return fn.apply(board, arguments as unknown as any[]);
        };

        board["x_internal" + type] = board["x_internal" + type] || [];
        board["x_internal" + type].push(el);

        obj.addEventListener(type, el as EventListener, false);
    };

    const cancelbubble = function (e: Event | undefined) {
        if (!e) {
            e = window.event as Event | undefined;
        }

        if (e?.stopPropagation) {
            e.stopPropagation();
        } else if (e) {
            (e as any).cancelBubble = true;
        }
    };

    const createButton = function (label: string, handler: Function) {
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

        addEvent(button, "click", function () {
            handler.bind(board)();
            return false;
        });
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

export function removeNavigationButtons({
    board,
    id,
}: {
    board: JXGBoard;
    id: string;
}): void {
    const navigationBar = document.querySelector(
        "#" + cesc(id) + `_navigationbar`,
    );

    // Remove whatever buttons currently exist without assuming a fixed count.
    while (navigationBar?.firstElementChild) {
        navigationBar.firstElementChild.remove();
    }

    // Clear the x_internal* arrays that addNavigationButtons populates
    // (the prefix is "x_internal", not "internal").
    for (const type of [
        "click",
        "mouseup",
        "mousedown",
        "touchend",
        "touchstart",
        "pointerup",
        "pointerdown",
        "pointerleave",
    ]) {
        board["x_internal" + type] = [];
    }
}

export type LineFamilyLabelPlacement = {
    position: string;
    offset: [number, number];
    anchorx: "left" | "right" | "middle";
    anchory: "top" | "bottom" | "middle";
};

/**
 * Map Doenet line-family `labelPosition` values onto the JSXGraph placement
 * tuple used by line-like labels.
 *
 * `position` selects the side of the line in JSXGraph's coordinate system,
 * while `anchorx`/`anchory` and `offset` control how the rendered text box is
 * aligned relative to that anchor point.
 *
 * `center` intentionally uses JSXGraph's `top` position with a centered anchor
 * so the label stays attached to the line midpoint instead of being treated as
 * a distinct side placement.
 */
export function getLineFamilyLabelPlacementSpec(
    labelPosition: string,
): LineFamilyLabelPlacement {
    const positionMap: Record<string, LineFamilyLabelPlacement> = {
        upperright: {
            position: "urt",
            offset: [0, 0],
            anchorx: "left",
            anchory: "bottom",
        },
        upperleft: {
            position: "ulft",
            offset: [0, 0],
            anchorx: "right",
            anchory: "bottom",
        },
        lowerright: {
            position: "lrt",
            offset: [0, 0],
            anchorx: "left",
            anchory: "top",
        },
        lowerleft: {
            position: "llft",
            offset: [0, 0],
            anchorx: "right",
            anchory: "top",
        },
        top: {
            position: "top",
            offset: [0, 0],
            anchorx: "middle",
            anchory: "bottom",
        },
        bottom: {
            position: "bot",
            offset: [0, 0],
            anchorx: "middle",
            anchory: "top",
        },
        left: {
            position: "lft",
            offset: [0, 0],
            anchorx: "right",
            anchory: "middle",
        },
        right: {
            position: "rt",
            offset: [0, 0],
            anchorx: "left",
            anchory: "middle",
        },
        center: {
            position: "top",
            offset: [0, 0],
            anchorx: "middle",
            anchory: "middle",
        },
    };

    return positionMap[labelPosition] ?? positionMap.center;
}

export function adjustLineFamilyLabelAnchorXToStayInGraph({
    board,
    lineLike,
    label,
    anchorx,
    offset,
}: {
    board: JXGBoard | null;
    lineLike: LineLikeJXG | null | undefined;
    label: { size?: [number, number] } | null | undefined;
    anchorx: string;
    offset: [number, number] | undefined;
}): string {
    if (!board || !lineLike?.getLabelAnchor || !label?.size) {
        return anchorx;
    }

    const anchor = lineLike.getLabelAnchor();
    if (!anchor?.scrCoords) {
        return anchorx;
    }

    const labelWidth = Number(label.size[0]);
    const anchorScreenX = Number(anchor.scrCoords[1]);
    if (!Number.isFinite(labelWidth) || !Number.isFinite(anchorScreenX)) {
        return anchorx;
    }

    const offsetX = Number(offset?.[0] ?? 0);
    const x = anchorScreenX + (Number.isFinite(offsetX) ? offsetX : 0);
    const margin = 6;
    const maxX = Number(board.canvasWidth) - margin;
    const minX = margin;

    if (!Number.isFinite(maxX) || maxX <= minX) {
        return anchorx;
    }

    let leftX, rightX;
    if (anchorx === "left") {
        leftX = x;
        rightX = x + labelWidth;
    } else if (anchorx === "right") {
        leftX = x - labelWidth;
        rightX = x;
    } else {
        leftX = x - labelWidth / 2;
        rightX = x + labelWidth / 2;
    }

    if (rightX > maxX && anchorx !== "right") {
        return "right";
    }

    if (leftX < minX && anchorx !== "left") {
        return "left";
    }

    return anchorx;
}

/**
 * Build JSXGraph `label` attributes for line-family objects from Doenet state.
 * Handles with/without label, optional MathJax, and label color styling.
 */
export function buildLineFamilyLabelAttributes({
    labelForGraph,
    labelPosition,
    labelHasLatex,
    applyStyleToLabel,
    lineColor,
}: {
    labelForGraph: string;
    labelPosition: string;
    labelHasLatex: boolean;
    applyStyleToLabel: boolean;
    lineColor: string;
}): Record<string, any> {
    if (labelForGraph !== "") {
        const { position, offset, anchorx, anchory } =
            getLineFamilyLabelPlacementSpec(labelPosition);

        const labelAttributes: Record<string, any> = {
            position,
            offset,
            anchorx,
            anchory,
            highlight: false,
            strokeColor: applyStyleToLabel ? lineColor : "var(--canvasText)",
        };

        if (labelHasLatex) {
            labelAttributes.useMathJax = true;
        }

        return labelAttributes;
    }

    const labelAttributes: Record<string, any> = {
        highlight: false,
    };

    if (labelHasLatex) {
        labelAttributes.useMathJax = true;
    }

    return labelAttributes;
}

/**
 * Apply line-family label placement and edge-aware anchor correction.
 *
 * If placement does not change, optionally sets `needsUpdate` before a light
 * `update()` call for renderers that require it.
 */
export function applyLineFamilyLabelPlacement({
    board,
    lineLike,
    labelPosition,
    forceFullUpdate = false,
    setNeedsUpdateOnNoChange = false,
}: {
    board: JXGBoard | null;
    lineLike: LineLikeJXG | null | undefined;
    labelPosition: string;
    forceFullUpdate?: boolean;
    setNeedsUpdateOnNoChange?: boolean;
}): void {
    if (!lineLike?.hasLabel || !lineLike.label) {
        return;
    }

    const { position, offset, anchorx, anchory } =
        getLineFamilyLabelPlacementSpec(labelPosition);
    const adjustedAnchorx = adjustLineFamilyLabelAnchorXToStayInGraph({
        board,
        lineLike,
        label: lineLike.label as unknown as { size?: [number, number] },
        anchorx,
        offset,
    });

    const labelVisProp = lineLike.label.visProp as Record<string, any>;
    const offsetChanged =
        labelVisProp.offset?.[0] !== offset[0] ||
        labelVisProp.offset?.[1] !== offset[1];

    const placementChanged =
        labelVisProp.position !== position ||
        labelVisProp.anchorx !== adjustedAnchorx ||
        labelVisProp.anchory !== anchory ||
        offsetChanged;

    if (placementChanged || forceFullUpdate) {
        labelVisProp.position = position;
        labelVisProp.anchorx = adjustedAnchorx;
        labelVisProp.anchory = anchory;
        labelVisProp.offset = offset;
        lineLike.label.needsUpdate = true;
        lineLike.label.fullUpdate();
        return;
    }

    if (setNeedsUpdateOnNoChange) {
        lineLike.label.needsUpdate = true;
    }
    lineLike.label.update();
}

/**
 * Stabilize initial line-family label placement across async first-render
 * timing (first paint, late font metrics, late layout settling).
 *
 * `applyPlacement` may return `false` to indicate the line-like object is no
 * longer current and that no renderer update should be triggered.
 */
export function stabilizeInitialLineFamilyLabelPlacement({
    board,
    lineLike,
    applyPlacement,
    delayMs = 120,
}: {
    board: JXGBoard | null;
    lineLike: LineLikeJXG | null | undefined;
    applyPlacement: ((forceFullUpdate: boolean) => boolean | void) | null;
    delayMs?: number;
}): () => void {
    if (!lineLike?.hasLabel || !lineLike.label || !applyPlacement) {
        return () => {};
    }

    let cancelled = false;
    let animationFrameId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const runPlacement = () => {
        if (cancelled || !lineLike?.hasLabel || !lineLike.label) {
            return false;
        }

        lineLike.label.needsUpdate = true;
        const placementApplied = applyPlacement(true);
        if (placementApplied === false) {
            return false;
        }

        board?.updateRenderer?.();
        return true;
    };

    lineLike.needsUpdate = true;
    lineLike.update?.();
    runPlacement();

    const rerunPlacement = () => {
        runPlacement();
    };

    if (typeof requestAnimationFrame === "function") {
        animationFrameId = requestAnimationFrame(() => {
            rerunPlacement();
        });
    } else {
        rerunPlacement();
    }

    if (typeof document !== "undefined" && document.fonts?.ready) {
        document.fonts.ready.then(() => {
            rerunPlacement();
        });
    }

    timeoutId = setTimeout(() => {
        rerunPlacement();
    }, delayMs);

    return () => {
        cancelled = true;
        if (
            animationFrameId !== null &&
            typeof cancelAnimationFrame === "function"
        ) {
            cancelAnimationFrame(animationFrameId);
        }
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }
    };
}

/**
 * Minimal structural shape for `visProp`-bearing JSXgraph objects whose
 * attributes the sync helpers below mutate. Using a structural type keeps
 * these helpers usable from both legacy `JXGObject` consumers and new
 * per-kind `JXGElement` consumers.
 */
type SyncableJXG = {
    visProp: Record<string, any>;
    visPropCalc?: Record<string, any>;
    setAttribute: Function;
};

/**
 * Sync visibility on a line-family object, gated by `validCoords`.
 *
 * Mirrors the per-renderer pattern of writing both `visProp.visible` and
 * `visPropCalc.visible`, but only calling `setAttribute({ visible })` when the
 * value actually changes — `setAttribute` is incredibly slow on point labels,
 * so it should not run when nothing changed. When `validCoords` is false,
 * forces both flags off without invoking `setAttribute`.
 *
 * Returns whether `visProp.visible` actually changed (callers may piggyback
 * additional updates on this signal).
 */
export function syncLineFamilyVisibility(
    obj: SyncableJXG,
    visible: boolean,
    validCoords: boolean,
): boolean {
    if (!validCoords) {
        obj.visProp.visible = false;
        if (obj.visPropCalc) {
            obj.visPropCalc.visible = false;
        }
        return false;
    }

    const changed = obj.visProp.visible !== visible;
    obj.visProp.visible = visible;
    if (obj.visPropCalc) {
        obj.visPropCalc.visible = visible;
    }
    if (changed) {
        obj.setAttribute({ visible });
    }
    return changed;
}

/**
 * Sync a JSXgraph object's layer attribute. Doenet `SVs.layer` is multiplied
 * by 10 and added to a per-element-kind offset (see `LINE_LAYER_OFFSET`,
 * `VERTEX_LAYER_OFFSET`, etc. in `graph.ts`). Returns whether the layer
 * actually changed, so callers can mirror updates to companion objects
 * (e.g. endpoint points whose layer must follow the segment's).
 */
export function syncLayer(
    obj: SyncableJXG,
    svsLayer: number,
    offset: number,
): boolean {
    const layer = 10 * svsLayer + offset;
    const changed = obj.visProp.layer !== layer;
    if (changed) {
        obj.setAttribute({ layer });
    }
    return changed;
}

/**
 * Sync stroke color/width/opacity/dash on a line-family object.
 *
 * Highlight values mirror the base values, with `strokeOpacity` halved on
 * highlight (matching the convention used across renderers prior to this
 * helper). `dash` is taken as a precomputed numeric value because some
 * renderers (e.g. line.tsx) pass an extra `dashed` SV into `styleToDash`.
 */
export function syncLineStrokeStyle(
    obj: SyncableJXG,
    {
        lineColor,
        lineWidth,
        lineOpacity,
        dash,
    }: {
        lineColor: string;
        lineWidth: number;
        lineOpacity: number;
        dash: number;
    },
): void {
    const vp = obj.visProp;
    if (vp.strokecolor !== lineColor) {
        vp.strokecolor = lineColor;
        vp.highlightstrokecolor = lineColor;
    }
    if (vp.strokewidth !== lineWidth) {
        vp.strokewidth = lineWidth;
        vp.highlightstrokewidth = lineWidth;
    }
    if (vp.strokeopacity !== lineOpacity) {
        vp.strokeopacity = lineOpacity;
        vp.highlightstrokeopacity = lineOpacity * 0.5;
    }
    if (vp.dash !== dash) {
        vp.dash = dash;
    }
}

/**
 * Sync one or more raw `visProp` entries on a JSXGraph object without calling
 * `setAttribute`, which is often unnecessarily expensive during per-render
 * updates.
 */
export function syncVisPropValues(
    obj: { visProp: Record<string, any> },
    values: Record<string, any>,
): void {
    for (const [key, value] of Object.entries(values)) {
        if (obj.visProp[key] !== value) {
            obj.visProp[key] = value;
        }
    }
}

/**
 * Sync the `withlabel` attribute based on whether `labelForGraph` is
 * non-empty, calling `setAttribute` only when the value actually changes.
 * `previousWithLabelRef` tracks the last applied value across renders.
 * Returns the resolved `withlabel` boolean.
 */
export function syncWithLabelToggle(
    obj: SyncableJXG,
    labelForGraph: string,
    previousWithLabelRef: RefObject<boolean | null>,
): boolean {
    const withlabel = labelForGraph !== "";
    if (withlabel !== previousWithLabelRef.current) {
        obj.setAttribute({ withlabel });
        previousWithLabelRef.current = withlabel;
    }
    return withlabel;
}

/**
 * Set a label's stroke color: either inherit the line color
 * (`applyStyleToLabel`) or fall back to `var(--canvasText)`.
 */
export function syncLabelStrokeColor(
    label: { visProp: Record<string, any> },
    applyStyleToLabel: boolean,
    lineColor: string,
): void {
    label.visProp.strokecolor = applyStyleToLabel
        ? lineColor
        : "var(--canvasText)";
}

/**
 * Pointer/keyboard event names registered by line-family renderers (line,
 * lineSegment, ray, vector, polyline, polygon, circle, and point's shadow
 * point) on every draggable JSXgraph object. Centralized so adding a new
 * event type is a one-place change.
 */
export const LINE_FAMILY_EVENTS = [
    "drag",
    "down",
    "hit",
    "up",
    "keyfocusout",
    "keydown",
] as const;

/**
 * Deregister event handlers from a JSXgraph object. No-op if `obj` is
 * null/undefined; defaults to `LINE_FAMILY_EVENTS` so the common case is a
 * single argument.
 */
export function removeJXGEventHandlers(
    obj: { off: (event: string) => void } | null | undefined,
    events: readonly string[] = LINE_FAMILY_EVENTS,
): void {
    if (!obj) return;
    for (const event of events) {
        obj.off(event);
    }
}

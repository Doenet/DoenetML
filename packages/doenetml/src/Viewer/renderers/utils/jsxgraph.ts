import me from "math-expressions";
import { cesc } from "@doenet/utils";
import type { RefObject } from "react";
import { JXGBoard, JXGElement } from "../jsxgraph-distrib/types";
import { computeLabelMaskCssStyle } from "./labelMaskStyle";

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

/**
 * How close a mantissa has to be to a round number to count as that number.
 * JSXGraph builds tick intervals as a power of ten times 1, 2, or 5, so the
 * only discrepancy to absorb is floating-point noise.
 */
const MANTISSA_TOLERANCE = 1e-12;

/**
 * Whether the mantissa of `value` — the `m` of `m * 10**k` with `1 <= m < 10`,
 * divided by `scale` — is one of `targets`. A value with no mantissa (zero,
 * negative, non-finite) matches nothing.
 *
 * Dividing by `scale` means an axis carrying an `xTickScaleFactor` /
 * `yTickScaleFactor` never matches a round number, so both predicates below
 * come out false there: such an axis always takes 4 minor ticks. That is
 * longstanding behavior, preserved here — changing it would move the major-tick
 * interval on scaled axes, which is a separate question from the flicker this
 * fixes.
 */
function scaledMantissaIsOneOf(
    value: number,
    scale: number,
    targets: number[],
): boolean {
    if (!(value > 0) || !Number.isFinite(value)) {
        return false;
    }
    const mantissa = value / (10 ** Math.floor(Math.log10(value)) * scale);
    return targets.some(
        (target) => Math.abs(mantissa - target) < MANTISSA_TOLERANCE,
    );
}

/**
 * How many minor ticks a major-tick interval of `tickInterval` wants, so that
 * the minor ticks land on readable numbers. JSXGraph draws `minorticks` ticks
 * between neighboring majors, so the interval is cut into `minorticks + 1`
 * steps: a 2·10^k interval divides into quarters, everything else into fifths.
 */
function preferredMinorTicks(tickInterval: number, scale: number): number {
    return scaledMantissaIsOneOf(tickInterval, scale, [2]) ? 3 : 4;
}

/** Whether minor ticks spaced `step` apart land on readable numbers. */
function isReadableMinorStep(step: number, scale: number): boolean {
    return scaledMantissaIsOneOf(step, scale, [1, 2, 2.5, 5]);
}

/**
 * Pick the number of minor ticks for `axis` and apply it.
 *
 * The two quantities involved define each other. JSXGraph derives the
 * major-tick interval from `minorticks` — it keeps at least `minTicksDistance`
 * pixels between *minor* ticks, so the interval it settles on scales with the
 * minor count — while the interval is what tells us how many minor ticks read
 * well. At some board scales the two never agree: writing 3 yields an interval
 * that asks for 4, and writing 4 yields one that asks for 3. This used to be
 * re-run on every render of the graph, so an unresolved disagreement surfaced
 * as tick spacing flickering between two values for as long as renders kept
 * coming — throughout a point drag, say.
 *
 * So evaluate the candidates rather than iterating toward a fixed point that
 * may not exist: take the count that agrees with the interval it produces, and
 * when neither does, settle it in favor of the more readable minor ticks. The
 * answer then depends only on the board's geometry, so repeating the call
 * cannot move the ticks.
 */
export function setMinorTicks(axis: AxisJXG): void {
    const ticks = axis.defaultTicks;
    const scale = ticks.visProp.scale;

    // What each candidate count would produce. `getDistanceMajorTicks` only
    // reads state, `minorticks` included, so writing a candidate to visProp and
    // calling it is how we ask what that candidate would give; the write at the
    // end of this function leaves visProp holding the count we settle on.
    //
    // 4 comes first so that when both candidates agree with their own interval,
    // taking the first keeps the coarser spacing. A larger minor count normally
    // forces a larger interval; the exception is that JSXGraph rounds the gap it
    // needs to a power of ten times 1, 2, or 5, which can leave the 3 candidate
    // on the coarser interval instead — but only ever on a 5·10^k one, and that
    // asks for 4 minor ticks, so it is never self-consistent with 3. Taking the
    // first is also the answer the old code reached, since it read the interval
    // with JSXGraph's default of 4 already in place.
    const candidates = [4, 3].map((minorTicks) => {
        ticks.visProp.minorticks = minorTicks;
        return { minorTicks, tickInterval: ticks.getDistanceMajorTicks() };
    });

    let chosen = candidates.find(
        (candidate) =>
            preferredMinorTicks(candidate.tickInterval, scale) ===
            candidate.minorTicks,
    );

    if (!chosen) {
        // No self-consistent pairing exists at this scale. Both candidates
        // leave the axis in a state its own interval would argue with, so pick
        // by how the minor ticks read, and fall back to the coarser interval —
        // where neither reads well, that is the pairing whose minor ticks still
        // clear `minTicksDistance`, which JSXGraph's rounding of that gap can
        // otherwise undershoot. Which of the two is coarser has to be measured
        // rather than assumed, for the reason given above.
        const readable = candidates.filter((candidate) =>
            isReadableMinorStep(
                candidate.tickInterval / (candidate.minorTicks + 1),
                scale,
            ),
        );
        const pool = readable.length > 0 ? readable : candidates;
        chosen = pool.reduce((best, candidate) =>
            candidate.tickInterval > best.tickInterval ? candidate : best,
        );
    }

    ticks.visProp.minorticks = chosen.minorTicks;
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
    // Grid lines are rendered by a separate grid object so tick marks can use
    // the axis color independently.
    if (grid === "dense") {
        if (xaxisRef.current) {
            xaxisRef.current.defaultTicks.setAttribute({ majorHeight: 0 });
            xaxisRef.current.defaultTicks.setAttribute({
                minorHeight: displayXAxisTicks ? 10 : 0,
            });
        }
        if (yaxisRef.current) {
            yaxisRef.current.defaultTicks.setAttribute({ majorHeight: 0 });
            yaxisRef.current.defaultTicks.setAttribute({
                minorHeight: displayYAxisTicks ? 10 : 0,
            });
        }
    } else if (grid === "medium") {
        if (xaxisRef.current) {
            xaxisRef.current.defaultTicks.setAttribute({ majorHeight: 0 });
            xaxisRef.current.defaultTicks.setAttribute({
                minorHeight: displayXAxisTicks ? 10 : 0,
            });
        }
        if (yaxisRef.current) {
            yaxisRef.current.defaultTicks.setAttribute({ majorHeight: 0 });
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
            strokeColor: "var(--graphAxes)",
            highlight: false,
        };
        if (SVs.yLabelHasLatex) {
            yaxisOptions.label.useMathJax = true;
        }
    }
    previousYaxisWithLabelRef.current = Boolean(SVs.yLabel);

    yaxisOptions.strokeColor = "var(--graphAxes)";
    yaxisOptions.highlight = false;

    yaxisOptions.ticks = {
        ticksDistance: 2,
        label: {
            offset: [12, -2],
            layer: 2,
            strokeColor: "var(--graphAxes)",
            highlightStrokeColor: "var(--graphAxes)",
        },
        strokeColor: "var(--graphAxes)",
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
    // Grid lines are rendered separately; these values control axis ticks.
    if (SVs.grid === "dense") {
        yaxisOptions.ticks.majorHeight = 0;
        yaxisOptions.ticks.minorHeight = 0;
    } else if (SVs.grid === "medium") {
        yaxisOptions.ticks.majorHeight = 0;
        yaxisOptions.ticks.minorHeight = SVs.displayYAxisTicks ? 10 : 0;
    } else {
        yaxisOptions.ticks.majorHeight = SVs.displayYAxisTicks ? 12 : 0;
        yaxisOptions.ticks.minorHeight = SVs.displayYAxisTicks ? 10 : 0;
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
    ) as AxisJXG;

    setMinorTicks(yaxisRef.current);

    theBoard.unsuspendUpdate();
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
            strokeColor: "var(--graphAxes)",
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
            strokeColor: "var(--graphAxes)",
            highlightStrokeColor: "var(--graphAxes)",
        },
        strokeColor: "var(--graphAxes)",
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
    xaxisOptions.strokeColor = "var(--graphAxes)";
    xaxisOptions.highlight = false;

    // Grid lines are rendered separately; these values control axis ticks.
    if (SVs.grid === "dense") {
        xaxisOptions.ticks.majorHeight = 0;
        xaxisOptions.ticks.minorHeight = 0;
    } else if (SVs.grid === "medium") {
        xaxisOptions.ticks.majorHeight = 0;
        xaxisOptions.ticks.minorHeight = SVs.displayXAxisTicks ? 10 : 0;
    } else {
        xaxisOptions.ticks.majorHeight = SVs.displayXAxisTicks ? 12 : 0;
        xaxisOptions.ticks.minorHeight = SVs.displayXAxisTicks ? 10 : 0;
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
    ) as AxisJXG;

    setMinorTicks(xaxisRef.current);
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
    layer,
    maskLabel = true,
}: {
    labelForGraph: string;
    labelPosition: string;
    labelHasLatex: boolean;
    applyStyleToLabel: boolean;
    lineColor: string;
    layer: number;
    maskLabel?: boolean;
}): Record<string, any> {
    const { cssStyle, highlightCssStyle } = computeLabelMaskCssStyle({
        layer,
        masked: maskLabel,
    });

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
            cssStyle,
            highlightCssStyle,
            highlightStrokeOpacity: 1,
        };

        if (labelHasLatex) {
            labelAttributes.useMathJax = true;
        }

        return labelAttributes;
    }

    const labelAttributes: Record<string, any> = {
        highlight: false,
        cssStyle,
        highlightCssStyle,
        highlightStrokeOpacity: 1,
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
 * `dash` is taken as a precomputed numeric value because some renderers
 * (e.g. line.tsx) pass an extra `dashed` SV into `styleToDash`.
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
 * Sync a label's opaque mask background (see `computeLabelMaskCssStyle`),
 * recomputing the CSS from the current `layer` (which affects z-index).
 * Since these object-attached labels are created with `highlight: false`,
 * JSXGraph never automatically applies `highlightcssstyle`; instead,
 * `attachLabelHoverHighlight` directly toggles `label.visProp.cssstyle`
 * between the returned `cssStyle` and `highlightCssStyle` on the object's
 * over/out events.
 *
 * This preserves an active hover highlight across a re-render: the hover
 * handler records its desired state on `label.visProp.labelMaskHovered`, and
 * we re-apply the freshly recomputed highlight style when it is set rather
 * than clobbering the border back to the base style.
 */
export function syncLabelMaskCssStyle(
    label: { visProp: Record<string, any> },
    layer: number,
    options: {
        backgroundColor?: string;
        maskLabel?: boolean;
    } = {},
): { cssStyle: string; highlightCssStyle: string } {
    const { backgroundColor, maskLabel = true } = options;
    const { cssStyle, highlightCssStyle } = computeLabelMaskCssStyle({
        layer,
        backgroundColor,
        masked: maskLabel,
    });
    const hovered = label.visProp.labelMaskHovered === true;
    label.visProp.cssstyle = hovered ? highlightCssStyle : cssStyle;
    label.visProp.highlightcssstyle = highlightCssStyle;
    label.visProp.highlightstrokeopacity = 1;
    return { cssStyle, highlightCssStyle };
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

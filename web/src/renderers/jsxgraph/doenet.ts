// What makes a JSXGraph board look like Doenet's: style values, attribute
// builders, axis and navigation setup, and the small geometry helpers the
// component renderers use. Copied from the DoenetML checkout at
// ~/doenet/ml (commit dfb2b5c9e, branch cells-prototype-adapter) with
// Doenet-only inputs (layers, labels, dark mode, tick scale factors, grids)
// fixed at their defaults. Sources:
//   packages/utils/src/style/styleDefinitionHelpers.ts   DEFAULT_STYLE_VALUES
//   packages/doenetml/src/Viewer/renderers/utils/buildGraphicalAttributes.ts
//   packages/doenetml/src/Viewer/renderers/utils/graph.ts   normalizePoint*, layers, threshold
//   packages/doenetml/src/Viewer/renderers/utils/jsxgraph.ts   axes, navigation, minor ticks
//   packages/doenetml/src/Viewer/renderers/utils/offGraphIndicators.ts
//   packages/doenetml/src/Viewer/renderers/utils/pointerToBoardCoords.ts
//   packages/doenetml/src/Viewer/renderers/JSXGraphRenderer.tsx   initBoard options
// Re-sync by diffing those files; the copied bodies keep Doenet's structure.

export interface Style {
  lineOpacity: number;
  lineWidth: number;
  markerOpacity: number;
  markerStyle: string;
  markerSize: number;
  fillOpacity: number;
  lineColor: string;
  markerColor: string;
  fillColor: string;
}

// Style 1 of the default palette.
export const STYLE: Style = {
  lineOpacity: 0.7,
  lineWidth: 4,
  markerOpacity: 0.7,
  markerStyle: "circle",
  markerSize: 5,
  fillOpacity: 0.3,
  lineColor: "#1f5dff",
  markerColor: "#1f5dff",
  fillColor: "#1f5dff",
};

/** Styles 1 to 3 of the default palette (packages/utils/src/style/palettes/default.ts),
 * light mode; `styleNumber` picks one. */
const STYLES: Record<number, Style> = {
  1: STYLE,
  2: { lineOpacity: 0.7, lineWidth: 2, markerOpacity: 0.7, markerStyle: "square", markerSize: 5, fillOpacity: 0.3, lineColor: "#D4042D", markerColor: "#D4042D", fillColor: "#D4042D" },
  3: { lineOpacity: 0.7, lineWidth: 3, markerOpacity: 0.7, markerStyle: "triangle", markerSize: 5, fillOpacity: 0.3, lineColor: "#a6510c", markerColor: "#a6510c", fillColor: "#a6510c" },
};

/** The style an element's `styleNumber` attribute names (style 1 otherwise). */
export function styleFor(styleNumber: string | null): Style {
  return STYLES[Number(styleNumber)] ?? STYLE;
}

export const HANDLE_COLOR = "#404040";

// Layer offsets (graph.tsx); DoenetML's `layer` is always 0 here.
export const LINE_LAYER_OFFSET = 2;
export const VERTEX_LAYER_OFFSET = 3;
export const POINT_LAYER_OFFSET = 5;

export const POINTER_DRAG_THRESHOLD = 1;

/** Doenet's default graph is "medium" (0.5 × 850 px) with aspect ratio 1. */
export const GRAPH_SIZE = 425;

export function normalizePointSize(size: number, style: string) {
  if (style === "diamond") return size * 1.4;
  else if (style === "plus") return size * 1.2;
  else if (style === "square") return size * 1.1;
  else if (style.substring(0, 8) === "triangle") return size * 1.5;
  else return size;
}

export function normalizePointStyle(style: string, offGraphIndicatorSides: [number, number]) {
  if (offGraphIndicatorSides[1] === -1) return "triangledown";
  else if (offGraphIndicatorSides[1] === 1) return "triangleup";
  else if (offGraphIndicatorSides[0] === -1) return "triangleleft";
  else if (offGraphIndicatorSides[0] === 1) return "triangleright";
  else if (style === "triangle") return "triangleup";
  else return style;
}

export function pointAttributes(sides: [number, number], style: Style = STYLE): Record<string, any> {
  return {
    name: "",
    withlabel: false,
    fixed: true,
    layer: POINT_LAYER_OFFSET,
    fillColor: style.markerColor,
    strokeColor: "none",
    strokeOpacity: style.markerOpacity,
    fillOpacity: style.markerOpacity,
    highlightFillColor: "var(--mainGray)",
    highlightStrokeColor: "var(--lightBlue)",
    size: normalizePointSize(style.markerSize, style.markerStyle),
    face: normalizePointStyle(style.markerStyle, sides),
    highlight: true,
    showInfoBox: false,
  };
}

/** The invisible, draggable twin of a point (point.tsx). */
export function shadowPointAttributes(visible: Record<string, any>): Record<string, any> {
  return {
    ...visible,
    fixed: false,
    showInfoBox: false,
    withlabel: false,
    fillOpacity: 0,
    strokeOpacity: 0,
    highlightFillOpacity: 0,
    highlightStrokeOpacity: 0,
  };
}

function baseAttributes(layerOffset: number): Record<string, any> {
  return { name: "", visible: true, withlabel: false, fixed: false, layer: layerOffset, highlight: true };
}

export function lineLikeAttributes(layerOffset: number, style: Style = STYLE): Record<string, any> {
  return {
    ...baseAttributes(layerOffset),
    strokeColor: style.lineColor,
    strokeOpacity: style.lineOpacity,
    highlightStrokeColor: style.lineColor,
    highlightStrokeOpacity: style.lineOpacity * 0.5,
    strokeWidth: style.lineWidth,
    highlightStrokeWidth: style.lineWidth,
    dash: 0,
  };
}

/** A circle or polygon with `filled` false, Doenet's default for both. */
export function unfilledShapeAttributes(layerOffset: number): Record<string, any> {
  return { ...lineLikeAttributes(layerOffset), fillColor: "none", highlightFillColor: "none", fillOpacity: STYLE.fillOpacity, highlightFillOpacity: STYLE.fillOpacity * 0.5 };
}

/** Endpoint and vertex handles: invisible until hovered (buildDragHandleAttributes). */
export function dragHandleAttributes(layer: number): Record<string, any> {
  return {
    withlabel: false,
    fixed: false,
    highlight: true,
    fillColor: "none",
    strokeColor: "none",
    highlightStrokeColor: "none",
    highlightFillColor: HANDLE_COLOR,
    layer,
    showInfoBox: false,
    size: 3,
  };
}

/** Where a point outside the board is drawn instead, and on which sides. */
export function characterizeOffGraphPoint(coords: [number, number], bbox: number[]) {
  let [xMin, yMax, xMax, yMin] = bbox;
  const xscale = xMax - xMin, yscale = yMax - yMin;
  const xminAdjusted = xMin + xscale * 0.01, xmaxAdjusted = xMax - xscale * 0.01;
  const yminAdjusted = yMin + yscale * 0.01, ymaxAdjusted = yMax - yscale * 0.01;
  const indicatorCoords: [number, number] = [coords[0], coords[1]];
  const indicatorSides: [number, number] = [0, 0];
  let needIndicator = false;
  if (indicatorCoords[0] < xminAdjusted) { needIndicator = true; indicatorSides[0] = -1; indicatorCoords[0] = xminAdjusted; }
  else if (indicatorCoords[0] > xmaxAdjusted) { needIndicator = true; indicatorSides[0] = 1; indicatorCoords[0] = xmaxAdjusted; }
  if (indicatorCoords[1] < yminAdjusted) { needIndicator = true; indicatorSides[1] = -1; indicatorCoords[1] = yminAdjusted; }
  else if (indicatorCoords[1] > ymaxAdjusted) { needIndicator = true; indicatorSides[1] = 1; indicatorCoords[1] = ymaxAdjusted; }
  return { needIndicator, indicatorCoords, indicatorSides };
}

/** A pointer position in user coordinates, from the object's screen
 * position and the pointer position at pointerdown. */
export function pointerEventToUserCoords(e: { x: number; y: number }, pointerAtDown: [number, number], objectAtDownScrCoords: number[], board: any): [number, number] {
  const o = board.origin.scrCoords;
  const x = (objectAtDownScrCoords[1] + e.x - pointerAtDown[0] - o[1]) / board.unitX;
  const y = (o[2] - (objectAtDownScrCoords[2] + e.y - pointerAtDown[1])) / board.unitY;
  return [x, y];
}

export function initBoardOptions(bbox: number[], fixAxes: boolean, renderer: "svg" | "canvas"): Record<string, any> {
  return {
    boundingbox: bbox,
    axis: false,
    showCopyright: false,
    showNavigation: false,
    zoom: { wheel: !fixAxes, needShift: true },
    pan: { enabled: !fixAxes, needShift: false },
    grid: false,
    renderer,
  };
}

function scaledMantissaIsOneOf(value: number, scale: number, targets: number[]) {
  if (!(value > 0) || !Number.isFinite(value)) return false;
  const mantissa = value / (10 ** Math.floor(Math.log10(value)) * scale);
  return targets.some((t) => Math.abs(mantissa - t) < 1e-12);
}

/** Choose 3 or 4 minor ticks so they land on readable numbers (jsxgraph.ts). */
function setMinorTicks(axis: any) {
  const ticks = axis.defaultTicks;
  const scale = ticks.visProp.scale;
  const candidates = [4, 3].map((minorTicks) => {
    ticks.visProp.minorticks = minorTicks;
    return { minorTicks, tickInterval: ticks.getDistanceMajorTicks() };
  });
  let chosen = candidates.find((c) => (scaledMantissaIsOneOf(c.tickInterval, scale, [2]) ? 3 : 4) === c.minorTicks);
  if (!chosen) {
    const readable = candidates.filter((c) => scaledMantissaIsOneOf(c.tickInterval / (c.minorTicks + 1), scale, [1, 2, 2.5, 5]));
    const pool = readable.length > 0 ? readable : candidates;
    chosen = pool.reduce((best, c) => (c.tickInterval > best.tickInterval ? c : best));
  }
  ticks.visProp.minorticks = chosen.minorTicks;
  ticks.fullUpdate();
}

/** Both axes with Doenet's ticks: no labels on the axes, tick labels on. */
export function createAxes(board: any): any[] {
  const make = (direction: [number, number], labelOffset: [number, number]) => {
    const axis = board.create("axis", [[0, 0], direction], {
      highlight: false,
      fixed: true,
      strokeColor: "var(--canvasText)",
      ticks: {
        ticksDistance: 2,
        label: { offset: labelOffset, layer: 2, strokeColor: "var(--canvasText)", highlightStrokeColor: "var(--canvasText)", highlightStrokeOpacity: 1 },
        strokeColor: "var(--canvasText)",
        strokeOpacity: 0.5,
        digits: 4,
        drawLabels: true,
        majorHeight: 12,
        minorHeight: 10,
      },
    });
    setMinorTicks(axis);
    return axis;
  };
  board.suspendUpdate();
  const x = make([1, 0], [-5, -15]);
  const y = make([0, 1], [12, -2]);
  board.unsuspendUpdate();
  return [x, y];
}

/** The "- o +" zoom buttons in the lower right (addNavigationButtons).
 * Doenet's buttons live in a bar JSXGraph creates; here the bar is made
 * by hand with the same class, so Doenet's CSS places it. */
export function addNavigationButtons(board: any, container: HTMLElement) {
  const bar = document.createElement("div");
  bar.className = "JXG_navigation";
  container.appendChild(bar);
  const stop = (e: Event) => e.stopPropagation();
  const button = (label: string, handler: () => void) => {
    const b = document.createElement("span");
    b.setAttribute("style", "color: var(--canvasText); opacity: 0.7");
    b.style.paddingLeft = "7px";
    b.style.paddingRight = "7px";
    b.classList.add("JXG_navigation_button");
    b.appendChild(document.createTextNode(label));
    b.addEventListener("click", () => handler.call(board));
    for (const t of ["mouseup", "mousedown", "touchend", "touchstart", "pointerup", "pointerdown", "pointerleave"]) b.addEventListener(t, stop);
    bar.appendChild(b);
  };
  button("-", board.zoomOut);
  button("o", board.zoom100);
  button("+", board.zoomIn);
}

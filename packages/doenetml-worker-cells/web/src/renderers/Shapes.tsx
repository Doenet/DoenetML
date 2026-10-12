// Line, line segment, circle and polygon: SVG renderers that drag the way
// the current core's actions do (ADR 0006). A whole-shape drag requests the
// shape's own point cells, so the core's shape-preserving inverse (ADR 0006)
// decides where the defining points go; a vertex handle drags one point.
import { useRef } from "react";
import { useCell, useStore } from "../hooks";
import { toGraph, toPixel, useGraph, type GraphFrame } from "./Graph";

type Pt = [number, number];

/** Pointer-drag plumbing shared by every shape: `onMove` gets the graph
 * coordinates of the pointer and its offset from where the drag started. */
function useDrag(frame: GraphFrame, onMove: (at: Pt, delta: Pt) => void) {
  const start = useRef<Pt | null>(null);
  const graphAt = (e: React.PointerEvent) => {
    const rect = frame.svg.current!.getBoundingClientRect();
    return toGraph(frame, e.clientX - rect.left, e.clientY - rect.top);
  };
  return {
    onPointerDown: (e: React.PointerEvent<SVGElement>) => {
      start.current = graphAt(e);
      e.currentTarget.setPointerCapture(e.pointerId);
      e.stopPropagation();
    },
    onPointerUp: (e: React.PointerEvent<SVGElement>) => {
      start.current = null;
      e.currentTarget.releasePointerCapture(e.pointerId);
    },
    onPointerMove: (e: React.PointerEvent<SVGElement>) => {
      if (!start.current) return;
      const at = graphAt(e);
      const delta: Pt = [at[0] - start.current[0], at[1] - start.current[1]];
      start.current = at;
      onMove(at, delta);
    },
    style: { cursor: "grab" as const },
  };
}

function Handle({ idx, x, y, cellX, cellY }: { idx: number; x: number; y: number; cellX: number; cellY: number }) {
  const store = useStore();
  const frame = useGraph();
  const [px, py] = toPixel(frame, x, y);
  const drag = useDrag(frame, (at) => store.request([[cellX, at[0]], [cellY, at[1]]]));
  return <circle cx={px} cy={py} r={5} fill="#fff" stroke="#1f77b4" strokeWidth={1.5} data-handle={idx} {...drag} />;
}

export function Line({ idx, segment }: { idx: number; segment: boolean }) {
  const store = useStore();
  const frame = useGraph();
  const c = (p: string) => store.comps.cell(idx, p);
  const x1 = useCell(c("x1")), y1 = useCell(c("y1")), x2 = useCell(c("x2")), y2 = useCell(c("y2"));
  const basedOnDirection = segment ? 0 : useCell(c("basedOnDirection"));
  // As the current core's moveLine: a direction-based line translates by
  // its first point only; otherwise both points are requested together as
  // one point group, which keeps them a translation apart (ADR 0006).
  const drag = useDrag(frame, (_at, [dx, dy]) => {
    const pts: [number, number, number, number][] = [[c("x1"), c("y1"), x1 + dx, y1 + dy]];
    if (!basedOnDirection) pts.push([c("x2"), c("y2"), x2 + dx, y2 + dy]);
    store.requestPoints(pts);
  });
  if (![x1, y1, x2, y2].every(Number.isFinite)) return null;
  let [ax, ay] = toPixel(frame, x1, y1);
  let [bx, by] = toPixel(frame, x2, y2);
  if (!segment) {
    // Extend to the frame edges.
    const dx = bx - ax, dy = by - ay;
    const len = Math.hypot(dx, dy) || 1;
    const far = 4 * Math.max(frame.width, frame.height);
    [ax, ay, bx, by] = [ax - (dx / len) * far, ay - (dy / len) * far, bx + (dx / len) * far, by + (dy / len) * far];
  }
  return (
    <g data-comp={idx} data-name={store.comps.name(idx) ?? undefined}>
      <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#1f77b4" strokeWidth={2} />
      <line x1={ax} y1={ay} x2={bx} y2={by} stroke="transparent" strokeWidth={12} {...drag} />
      <Handle idx={idx} x={x1} y={y1} cellX={c("x1")} cellY={c("y1")} />
      <Handle idx={idx} x={x2} y={y2} cellX={c("x2")} cellY={c("y2")} />
    </g>
  );
}

export function Circle({ idx }: { idx: number }) {
  const store = useStore();
  const frame = useGraph();
  const c = (p: string) => store.comps.cell(idx, p);
  const cx = useCell(c("cx")), cy = useCell(c("cy")), r = useCell(c("radius"));
  // As the current core's moveCircle: request the center; the inverse
  // carries the through points along.
  const drag = useDrag(frame, (_at, [dx, dy]) => store.request([[c("cx"), cx + dx], [c("cy"), cy + dy]]));
  if (![cx, cy, r].every(Number.isFinite)) return null;
  const [px, py] = toPixel(frame, cx, cy);
  const pr = (r / (frame.xmax - frame.xmin)) * frame.width;
  return (
    <g data-comp={idx} data-name={store.comps.name(idx) ?? undefined}>
      <circle cx={px} cy={py} r={pr} fill="rgba(31,119,180,0.08)" stroke="#1f77b4" strokeWidth={2} {...drag} />
    </g>
  );
}

export function Polygon({ idx }: { idx: number }) {
  const store = useStore();
  const frame = useGraph();
  const c = (p: string) => store.comps.cell(idx, p);
  const n = useCell(c("numVertices"));
  // Hooks must not depend on n, so read the fixed layout and slice.
  const xs = Array.from({ length: 16 }, (_, i) => useCell(c(`x${i + 1}`)));
  const ys = Array.from({ length: 16 }, (_, i) => useCell(c(`y${i + 1}`)));
  const count = Number.isFinite(n) ? Math.min(16, n) : 0;
  // As the current core's movePolygon from a drag of the whole shape: every
  // vertex is requested with the same shift, as one point group.
  const drag = useDrag(frame, (_at, [dx, dy]) => {
    const pts: [number, number, number, number][] = [];
    for (let i = 0; i < count; i++) pts.push([c(`x${i + 1}`), c(`y${i + 1}`), xs[i] + dx, ys[i] + dy]);
    store.requestPoints(pts);
  });
  if (count < 2) return null;
  const pts = Array.from({ length: count }, (_, i) => toPixel(frame, xs[i], ys[i]));
  if (!pts.every(([x, y]) => Number.isFinite(x) && Number.isFinite(y))) return null;
  return (
    <g data-comp={idx} data-name={store.comps.name(idx) ?? undefined}>
      <polygon points={pts.map(([x, y]) => `${x},${y}`).join(" ")} fill="rgba(31,119,180,0.12)" stroke="#1f77b4" strokeWidth={2} {...drag} />
      {Array.from({ length: count }, (_, i) => (
        <Handle key={i} idx={idx} x={xs[i]} y={ys[i]} cellX={c(`x${i + 1}`)} cellY={c(`y${i + 1}`)} />
      ))}
    </g>
  );
}

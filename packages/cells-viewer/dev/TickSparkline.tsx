import React from "react";
import type { CellStore, TickSample } from "../src/core";

/** One frame at 60 Hz, the budget a tick should fit in. */
const BUDGET_MS = 1000 / 60;
const BARS = 100;
const BAR_PX = 2;
const HEIGHT_PX = 24;

/** The stacked segments of a tick, bottom to top: busy time, not latency.
 * The wait from React's commit to the next animation frame is idle and is
 * left out, so a bar is the work the tick cost; the browser's share is the
 * frame callback to the paint after it. */
const SEGMENTS: {
    name: string;
    color: string;
    ms: (s: TickSample) => number;
}[] = [
    { name: "core", color: "#1e293b", ms: (s) => s.core },
    { name: "boards", color: "#2563eb", ms: (s) => s.sync - s.roundTrip },
    { name: "React", color: "#93c5fd", ms: (s) => s.commit - s.sync },
    { name: "browser", color: "#cbd5e1", ms: (s) => s.paint - s.frame },
];

/** The known segments of a tick, in order; a segment not yet measured
 * (the frame has not gone by) and those after it are left out. */
function durations(s: TickSample): number[] {
    const out: number[] = [];
    for (const seg of SEGMENTS) {
        const v = seg.ms(s);
        if (Number.isNaN(v)) break;
        out.push(Math.max(v, 0));
    }
    return out;
}

const busy = (s: TickSample) => durations(s).reduce((sum, v) => sum + v, 0);

/**
 * The last hundred ticks as stacked bars of busy time, newest at the
 * right: the core's time, the JSXGraph boards' redraw, React's commit, and
 * the browser's layout and paint, on a square-root scale against a line
 * at one frame's budget. Hover a bar for its numbers. Redrawn after each tick and again once that tick's frame
 * has painted, since `frame` and `paint` are measured then.
 */
export function TickSparkline({ store }: { store: CellStore }) {
    const canvas = React.useRef<HTMLCanvasElement>(null);
    const [, bump] = React.useReducer((n: number) => n + 1, 0);

    React.useEffect(() => {
        let frame = 0;
        let timer = 0;
        const unsubscribe = store.subscribeAny(() => {
            bump();
            cancelAnimationFrame(frame);
            window.clearTimeout(timer);
            frame = requestAnimationFrame(() => {
                timer = window.setTimeout(bump, 20);
            });
        });
        return () => {
            unsubscribe();
            cancelAnimationFrame(frame);
            window.clearTimeout(timer);
        };
    }, [store]);

    const samples = store.samples.slice(-BARS);

    React.useLayoutEffect(() => {
        const el = canvas.current;
        if (!el) return;
        const dpr = window.devicePixelRatio || 1;
        const w = BARS * BAR_PX;
        const h = HEIGHT_PX;
        if (el.width !== w * dpr || el.height !== h * dpr) {
            el.width = w * dpr;
            el.height = h * dpr;
        }
        const ctx = el.getContext("2d")!;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);
        // A square-root scale: a half-millisecond core stays visible beside
        // a sixteen-millisecond frame. The axis fits the worst tick in view
        // up to four frames; taller ticks are clipped and flagged red.
        const worst = Math.max(...samples.map((s) => busy(s)), 0);
        const yMax = Math.min(Math.max(BUDGET_MS * 1.25, worst), BUDGET_MS * 4);
        const y = (ms: number) => h - Math.sqrt(Math.min(ms, yMax) / yMax) * h;
        samples.forEach((s, i) => {
            const x = w - (samples.length - i) * BAR_PX;
            let from = 0;
            durations(s).forEach((d, k) => {
                const to = from + d;
                ctx.fillStyle = SEGMENTS[k].color;
                ctx.fillRect(x, y(to), BAR_PX, y(from) - y(to));
                from = to;
            });
            if (busy(s) > BUDGET_MS) {
                ctx.fillStyle = "#dc2626";
                ctx.fillRect(x, 0, BAR_PX, 2);
            }
        });
        ctx.strokeStyle = "#dc2626";
        ctx.setLineDash([2, 2]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, Math.round(y(BUDGET_MS)) + 0.5);
        ctx.lineTo(w, Math.round(y(BUDGET_MS)) + 0.5);
        ctx.stroke();
    });

    function onMouseMove(event: React.MouseEvent<HTMLCanvasElement>) {
        const el = event.currentTarget;
        const x = event.clientX - el.getBoundingClientRect().left;
        const i = samples.length - Math.ceil((BARS * BAR_PX - x) / BAR_PX);
        const s = samples[i];
        el.title = s
            ? describe(s, store.samples.length - samples.length + i + 1)
            : "";
    }

    return (
        <canvas
            ref={canvas}
            className="tick-sparkline"
            style={{ width: BARS * BAR_PX, height: HEIGHT_PX }}
            aria-label="Tick timings"
            onMouseMove={onMouseMove}
        />
    );
}

function describe(s: TickSample, n: number): string {
    const ms = (v: number) =>
        Number.isNaN(v) ? "…" : `${v < 10 ? v.toFixed(1) : Math.round(v)} ms`;
    const span = (from: number, to: number) =>
        Number.isNaN(from) || Number.isNaN(to) ? "…" : ms(to - from);
    return [
        `tick ${n}: ${s.changed} cells changed${s.rebuilt ? ", document rebuilt" : ""}`,
        `core ${ms(s.core)} (inversion and recompute)`,
        `boards ${span(s.roundTrip, s.sync)} (JSXGraph redraw)`,
        `React ${span(s.sync, s.commit)} (commit)`,
        `browser ${span(s.frame, s.paint)} (layout and paint of the frame)`,
        `busy ${ms(busy(s))}; idle ${span(s.commit, s.frame)} waiting for the frame; painted ${ms(s.paint)} after the request`,
    ].join("\n");
}

// The viewer's primitives (ADR 0016): what a view shape draws a component
// with, each bound to cells by the shape the core chose
// (`generated/shapes.ts`). A primitive updates in place: a changed cell
// writes the DOM (or the board element) it feeds, with no React render on
// the tick path; React mounts it, and mounts it again after a rebuild.
import { useLayoutEffect, useRef } from "react";
import { useStore } from "../hooks";
import type { Prim, Shape } from "../generated/shapes";
import { fmt } from "./Number";
import { JxCircle, JxPoint } from "./jsxgraph/elements";

type PrimProps = { idx: number; cells: number[] };

/** Run `draw` now and whenever one of `cells` changes; again after a
 * rebuild, whose cell indices are new even where they come out the same. */
function useInPlace(cells: number[], draw: () => void) {
    const store = useStore();
    useLayoutEffect(() => {
        draw();
        const unsubs = cells.map((c) => store.subscribe(c, draw));
        return () => unsubs.forEach((u) => u());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store, store.comps, cells.join(",")]);
}

/** `number(value)`: the value as text. */
function NumberPrim({ cells: [value] }: PrimProps) {
    const store = useStore();
    const ref = useRef<HTMLSpanElement>(null);
    useInPlace([value], () => {
        ref.current!.textContent = fmt(store.get(value));
    });
    return <span ref={ref} className="number" />;
}

/** `range(min, max, step, value)`: a range control that requests its
 * value; the core snaps and clamps (ADR 0003), so it shows what the cell
 * holds after the tick. A NaN value is shown at `min`. */
function RangePrim({ cells: [min, max, step, value] }: PrimProps) {
    const store = useStore();
    const ref = useRef<HTMLInputElement>(null);
    useInPlace([min, max, step, value], () => {
        const el = ref.current!;
        const [lo, hi, st, v] = [min, max, step, value].map((c) =>
            store.get(c),
        );
        el.min = String(lo);
        el.max = String(hi);
        el.step = st > 0 ? String(st) : "any";
        el.value = String(Number.isNaN(v) ? lo : v);
    });
    return (
        <input
            ref={ref}
            type="range"
            onInput={(e) =>
                store.request([[value, Number(e.currentTarget.value)]])
            }
        />
    );
}

const PRIMS: Record<Prim, (p: PrimProps) => React.ReactNode> = {
    number: NumberPrim,
    range: RangePrim,
    point: ({ idx, cells }) => <JxPoint idx={idx} cells={cells} />,
    circle: ({ idx, cells }) => <JxCircle idx={idx} cells={cells} />,
};

/** Primitives drawn on a graph's board rather than in the page. */
const ON_BOARD: ReadonlySet<Prim> = new Set(["point", "circle"]);

/** A component drawn by its shape: each primitive with its cells. */
export function ShapeView({ idx, shape }: { idx: number; shape: Shape }) {
    const store = useStore();
    const prims = shape.nodes.map((use, i) => {
        const P = PRIMS[use.prim];
        return <P key={i} idx={idx} cells={store.comps.primCells(idx, use)} />;
    });
    if (shape.nodes.every((n) => ON_BOARD.has(n.prim))) return <>{prims}</>;
    return (
        <span
            className={shape.name}
            data-comp={idx}
            data-name={store.comps.name(idx) ?? undefined}
        >
            {prims}
        </span>
    );
}

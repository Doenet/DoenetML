// The viewer's primitives (ADR 0016): what a view shape draws a component
// with, each bound to cells by the shape the core chose
// (`generated/shapes.ts`). A primitive updates in place: a changed cell
// writes the DOM (or the board element) it feeds, with no React render on
// the tick path. It is addressed by its component's identity, not its
// index, and reads the store through the context a rebuild does not
// change, so a rebuild binds it to the new cells without a React render
// either: React mounts the components a rebuild adds and unmounts the ones
// it drops, and leaves the rest.
import { memo, useLayoutEffect, useRef } from "react";
import { useStableStore } from "../hooks";
import type { Prim, PrimUse, Shape } from "../generated/shapes";
import { fmt } from "./Number";
import { JxCircle, JxPoint } from "./jsxgraph/elements";
import { JsxGraph } from "./jsxgraph/Board";

type PrimProps = { id: string; use: PrimUse };

/** Bind `draw` to the cells `use` names on the component with identity
 * `id`: run it now and whenever one of them changes, and after a rebuild,
 * which renumbers the cells, bind again and run it if their values moved. */
function useBinding(
    id: string,
    use: PrimUse,
    draw: (cells: number[], values: number[]) => void,
) {
    const store = useStableStore();
    useLayoutEffect(() => {
        let unsubs: (() => void)[] = [];
        // The values last drawn, refilled in place: a tick allocates nothing.
        const values = new Array<number>(use.at.length).fill(NaN);
        let drawn = false;
        const bind = () => {
            unsubs.forEach((u) => u());
            unsubs = [];
            const c = store.comps.byId(id);
            if (c === undefined) return;
            const cells = store.comps.primCells(c, use);
            const redraw = () => {
                const all = store.cells();
                for (let i = 0; i < cells.length; i++)
                    values[i] = all[cells[i]];
                drawn = true;
                draw(cells, values);
            };
            unsubs = cells.map((x) => store.subscribe(x, redraw));
            const all = store.cells();
            if (!drawn || cells.some((x, i) => !Object.is(all[x], values[i])))
                redraw();
        };
        bind();
        const off = store.subscribeStructure(bind);
        return () => {
            off();
            unsubs.forEach((u) => u());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store, id, use]);
}

/** Write `text` only when it differs: any write to a text node makes the
 * browser lay out its line again, which in a long inline flow is the whole
 * flow, and a changed value often formats as the same text. */
function setText(el: HTMLElement, text: string) {
    if (el.textContent !== text) el.textContent = text;
}

/** `number(value)`: the value as text. */
function NumberPrim({ id, use }: PrimProps) {
    const ref = useRef<HTMLSpanElement>(null);
    useBinding(id, use, (_, [v]) => setText(ref.current!, fmt(v)));
    return <span ref={ref} className="number" />;
}

/** `coords(x, y, hide)`: a point's coordinates as text, `(x, y)`, or
 * nothing while it is hidden. */
function CoordsPrim({ id, use }: PrimProps) {
    const ref = useRef<HTMLSpanElement>(null);
    useBinding(id, use, (_, [x, y, hide]) => {
        const hidden = hide !== 0 && !Number.isNaN(hide);
        setText(ref.current!, hidden ? "" : `(${fmt(x)}, ${fmt(y)})`);
    });
    return <span ref={ref} className="coords" />;
}

/** `range(min, max, step, value)`: a range control that requests its
 * value; the core snaps and clamps (ADR 0003), so it shows what the cell
 * holds after the tick. A NaN value is shown at `min`. Its accessible name
 * is the slider's label or short description. */
function RangePrim({ id, use }: PrimProps) {
    const store = useStableStore();
    const ref = useRef<HTMLInputElement>(null);
    const valueCell = useRef(-1);
    useBinding(id, use, (cells, [lo, hi, st, v]) => {
        const el = ref.current!;
        valueCell.current = cells[3];
        el.min = String(lo);
        el.max = String(hi);
        el.step = st > 0 ? String(st) : "any";
        el.value = String(Number.isNaN(v) ? lo : v);
    });
    const c = store.comps.byId(id);
    return (
        <input
            ref={ref}
            type="range"
            aria-label={c === undefined ? undefined : accessibleName(c)}
            onInput={(e) =>
                store.request([
                    [valueCell.current, Number(e.currentTarget.value)],
                ])
            }
        />
    );

    /** The text of the slider's `<label>` or `<shortDescription>` child. */
    function accessibleName(c: number): string | undefined {
        for (const ch of store.comps.children(c)) {
            if (!("c" in ch)) continue;
            const t = store.comps.componentType(ch.c);
            if (t === "group" || t === "shortDescription")
                return store.comps.textOf(ch.c).trim() || undefined;
        }
        return undefined;
    }
}

const PRIMS: Record<Prim, (p: PrimProps) => React.ReactNode> = {
    number: NumberPrim,
    range: RangePrim,
    point: JxPoint,
    coords: CoordsPrim,
    circle: JxCircle,
    board: JsxGraph,
};

/** Primitives drawn on a graph's board rather than in the page. */
const ON_BOARD: ReadonlySet<Prim> = new Set(["point", "circle"]);
/** Primitives that are blocks, held in a `div` rather than a `span`. */
const BLOCK: ReadonlySet<Prim> = new Set(["board"]);

/** A component drawn by its shape: each primitive bound to it. Memoized on
 * the component's identity and shape, so a rebuild that leaves both alone
 * does not render it again; its primitives rebind themselves. */
export const ShapeView = memo(function ShapeView({
    id,
    shape,
}: {
    id: string;
    shape: Shape;
}) {
    const store = useStableStore();
    const prims = shape.nodes.map((use, i) => {
        const P = PRIMS[use.prim];
        return <P key={i} id={id} use={use} />;
    });
    if (shape.nodes.every((n) => ON_BOARD.has(n.prim))) return <>{prims}</>;
    const c = store.comps.byId(id);
    const Holder = shape.nodes.some((n) => BLOCK.has(n.prim)) ? "div" : "span";
    return (
        <Holder
            className={shape.name}
            data-name={
                c === undefined ? undefined : (store.comps.name(c) ?? undefined)
            }
        >
            {prims}
        </Holder>
    );
});

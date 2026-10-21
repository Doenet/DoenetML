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
import { useStableStore, useStore } from "../hooks";
import type { Prim, PrimUse, Shape } from "../generated/shapes";
import { JxCircle, JxPoint, JxPolygon } from "./jsxgraph/elements";
import { JsxGraph } from "./jsxgraph/Board";
import { Children } from "./index";
import { SECTION_LABELS } from "./Choice";

type PrimProps = { id: string; use: PrimUse };

/** Bind `draw` to the cells `use` names on the component with identity
 * `id`: run it now and whenever one of them changes, and after a rebuild,
 * which renumbers the cells, bind again and run it if their values moved,
 * or always with `onRebuild`, for a primitive whose drawing depends on more
 * than its cells (a number's format) and costs little to repeat. */
function useBinding(
    id: string,
    use: PrimUse,
    draw: (cells: number[], values: number[], comp: number) => void,
    onRebuild = false,
    // Cells beyond the shape's own that the drawing reads (a section
    // heading's enclosing numbers), after them.
    more?: (comp: number) => number[],
) {
    const store = useStableStore();
    useLayoutEffect(() => {
        let unsubs: (() => void)[] = [];
        // The values last drawn, refilled in place: a tick allocates nothing.
        let values = new Array<number>(use.at.length).fill(NaN);
        let drawn = false;
        const bind = () => {
            unsubs.forEach((u) => u());
            unsubs = [];
            const c = store.comps.byId(id);
            if (c === undefined) return;
            let cells = store.comps.primCells(c, use);
            if (more) cells = cells.concat(more(c));
            if (values.length !== cells.length) {
                values = new Array<number>(cells.length).fill(NaN);
                drawn = false;
            }
            const redraw = () => {
                const all = store.cells();
                for (let i = 0; i < cells.length; i++)
                    values[i] = all[cells[i]];
                drawn = true;
                draw(cells, values, c);
            };
            unsubs = cells.map((x) => store.subscribe(x, redraw));
            const all = store.cells();
            if (
                !drawn ||
                onRebuild ||
                cells.some((x, i) => !Object.is(all[x], values[i]))
            )
                redraw();
        };
        bind();
        const off = store.subscribeStructure(bind);
        return () => {
            off();
            unsubs.forEach((u) => u());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store, id, use, onRebuild, more]);
}

/** Write `text` only when it differs: any write to a text node makes the
 * browser lay out its line again, which in a long inline flow is the whole
 * flow, and a changed value often formats as the same text. */
function setText(el: HTMLElement, text: string) {
    if (el.textContent !== text) el.textContent = text;
}

/** `number(value)`: the value as text, formatted by the core. */
function NumberPrim({ id, use }: PrimProps) {
    const store = useStableStore();
    const ref = useRef<HTMLSpanElement>(null);
    useBinding(
        id,
        use,
        (_, [v], c) =>
            store.formatLater(c, [v], ([t]) => {
                if (ref.current) setText(ref.current, t);
            }),
        true,
    );
    return <span ref={ref} className="number" />;
}

/** `coords(x, y, hide)`: a point's coordinates as text, `(x, y)`, or
 * nothing while it is hidden. */
function CoordsPrim({ id, use }: PrimProps) {
    const store = useStableStore();
    const ref = useRef<HTMLSpanElement>(null);
    useBinding(
        id,
        use,
        (_, [x, y, hide], c) => {
            if (hide !== 0 && !Number.isNaN(hide)) setText(ref.current!, "");
            else
                store.formatLater(c, [x, y], ([a, b]) => {
                    if (ref.current) setText(ref.current, `(${a}, ${b})`);
                });
        },
        true,
    );
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

/** `mathField(expr)`: a text field showing the expression `expr` holds;
 * what a student types is parsed by the core on commit (Enter or blur) and
 * requested on `expr`. Text that does not parse stays, marked invalid. */
function MathFieldPrim({ id, use }: PrimProps) {
    const store = useStableStore();
    const ref = useRef<HTMLInputElement>(null);
    const exprCell = useRef(-1);
    useBinding(
        id,
        use,
        (cells, [h]) => {
            exprCell.current = cells[0];
            const el = ref.current!;
            // Not while the student is typing in it.
            if (document.activeElement === el) return;
            const text = Number.isNaN(h) ? "" : store.exprText(cells[0]);
            if (el.value !== text) el.value = text;
            el.removeAttribute("aria-invalid");
        },
        true,
    );
    const commit = () => {
        const el = ref.current!;
        const text = el.value.trim();
        let h = NaN;
        if (text !== "") {
            try {
                h = store.parseMath(text);
            } catch {
                el.setAttribute("aria-invalid", "true");
                return;
            }
        }
        el.removeAttribute("aria-invalid");
        store.request([[exprCell.current, h]]);
    };
    return (
        <input
            ref={ref}
            className="mathInput"
            type="text"
            onBlur={commit}
            onKeyDown={(e) => e.key === "Enter" && commit()}
        />
    );
}

/** `submit()`: a button submitting the component's answer. */
function SubmitPrim({ id }: PrimProps) {
    const store = useStableStore();
    return (
        <button
            className="submitAnswer"
            style={{ marginLeft: "0.4em" }}
            onClick={() => {
                const c = store.comps.byId(id);
                if (c !== undefined) store.submit(c);
            }}
        >
            Submit
        </button>
    );
}

/** `credit(credit, submissions)`: the credit as a percentage, colored by
 * how much, once there has been a submission. */
function CreditPrim({ id, use }: PrimProps) {
    const ref = useRef<HTMLSpanElement>(null);
    useBinding(id, use, (_, [credit, submissions]) => {
        const el = ref.current!;
        const shown = Number.isNaN(credit) ? 0 : credit;
        el.hidden = !(submissions > 0);
        el.style.color = shown >= 1 ? "green" : shown > 0 ? "orange" : "red";
        setText(el, `${Math.round(shown * 100)}%`);
    });
    return (
        <span
            ref={ref}
            className="answerCredit"
            style={{ marginLeft: "0.4em" }}
            hidden
        />
    );
}

/** `heading(label, number, includeParentNumber)`: a section's heading, its
 * label's word and its number ("Problem 2.1"), after its enclosing
 * section's when it includes it: the one primitive that reads cells of
 * other components. */
function HeadingPrim({ id, use }: PrimProps) {
    const store = useStableStore();
    const ref = useRef<HTMLHeadingElement>(null);
    useBinding(
        id,
        use,
        (_, values) => {
            // The enclosing sections' numbers follow the shape's slots.
            const [label, number] = values;
            const n = [...values.slice(3), number].join(".");
            setText(ref.current!, `${SECTION_LABELS[label] ?? "Section"} ${n}`);
        },
        false,
        enclosingNumbers,
    );
    return <h3 ref={ref} />;

    /** The `number` cells of the sections around `c`, outermost first,
     * each included while the one inside includes its parent's. */
    function enclosingNumbers(c: number): number[] {
        const out: number[] = [];
        let inner = c;
        for (
            let p = store.comps.parent(c);
            p !== null;
            p = store.comps.parent(p)
        ) {
            if (store.comps.componentType(p) !== "section") continue;
            if (store.get(store.comps.cell(inner, "includeParentNumber")) === 0)
                break;
            out.unshift(store.comps.cell(p, "number"));
            inner = p;
        }
        return out;
    }
}

/** `contents()`: the component's children, where the shape puts them. It
 * renders with the tree on a rebuild, as children do. */
function ContentsPrim({ id }: PrimProps) {
    const store = useStore();
    const c = store.comps.byId(id);
    return c === undefined ? null : <Children idx={c} inGraph={false} />;
}

const PRIMS: Record<Prim, (p: PrimProps) => React.ReactNode> = {
    number: NumberPrim,
    range: RangePrim,
    point: JxPoint,
    coords: CoordsPrim,
    circle: JxCircle,
    board: JsxGraph,
    polygon: JxPolygon,
    mathField: MathFieldPrim,
    submit: SubmitPrim,
    credit: CreditPrim,
    heading: HeadingPrim,
    contents: ContentsPrim,
};

/** Primitives drawn on a graph's board rather than in the page. */
const ON_BOARD: ReadonlySet<Prim> = new Set(["point", "circle", "polygon"]);
/** Primitives that are blocks, held in a `div` rather than a `span`. */
const BLOCK: ReadonlySet<Prim> = new Set(["board", "heading"]);

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
    const Holder = (shape.tag ??
        (shape.nodes.some((n) => BLOCK.has(n.prim))
            ? "div"
            : "span")) as React.ElementType;
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

import { useLayoutEffect, useMemo, useSyncExternalStore } from "react";
import { useStore } from "../hooks";
import type { Child } from "../components";
import { NumberView } from "./Number";
import { NumberInput } from "./NumberInput";
import { TextInput } from "./TextInput";
import { BooleanInput } from "./BooleanInput";
import { BooleanView } from "./Boolean";
import { AnswerView } from "./Answer";
import { MathView } from "./Math";
import { CaseView, ChoiceView, SectionView, TextView } from "./Choice";
import { ChoiceInputView, HintView } from "./Hint";
import { ShapeView } from "./prims";
import { JxLine, JxPolygon, JxPolyline } from "./jsxgraph/elements";
import {
    Aside,
    Cell,
    DisplayMath,
    InlineMath,
    List,
    ListItem,
    Ref,
    Row,
    SideBySide,
    Stack,
    Table,
    Title,
    TriggerSet,
    TupleView,
} from "./Text";

export function Component({ idx, inGraph }: { idx: number; inGraph: boolean }) {
    const store = useStore();
    // A component the core gave a shape is drawn by its primitives.
    const shape = store.comps.shape(idx);
    if (shape) return <ShapeView id={store.comps.id(idx)} shape={shape} />;
    switch (store.comps.componentType(idx)) {
        case "document":
            return (
                <div className="doc">
                    <Children idx={idx} inGraph={false} />
                </div>
            );
        // A point is drawn by its shape, in a graph or as text.
        case "point":
            return null;
        case "clampNumber":
            return <NumberView idx={idx} />;
        case "tuple":
            return <TupleView idx={idx} />;
        case "polyline":
            return inGraph ? <JxPolyline idx={idx} /> : null;
        case "title":
            return <Title idx={idx} />;
        case "ref":
            return <Ref idx={idx} />;
        case "ul":
            return <List idx={idx} />;
        case "li":
            return <ListItem idx={idx} />;
        case "m":
            return <InlineMath idx={idx} />;
        case "md":
            return <DisplayMath idx={idx} />;
        case "aside":
            return <Aside idx={idx} />;
        case "sideBySide":
            return <SideBySide idx={idx} />;
        case "stack":
            return <Stack idx={idx} />;
        case "tabular":
            return <Table idx={idx} spreadsheet={false} />;
        case "spreadsheet":
            return <Table idx={idx} spreadsheet={true} />;
        case "row":
            return <Row idx={idx} />;
        case "cell":
            return <Cell idx={idx} />;
        case "triggerSet":
            return inGraph ? null : <TriggerSet idx={idx} />;
        // Drawn by the graph itself (`GraphLegend`).
        case "legend":
            return null;
        case "numberInput":
            return <NumberInput idx={idx} />;
        case "booleanInput":
            return <BooleanInput idx={idx} />;
        case "boolean":
            return <BooleanView idx={idx} />;
        case "math":
            return <MathView idx={idx} />;
        case "mathInput":
            return <NumberInput idx={idx} />;
        case "textInput":
            return <TextInput idx={idx} />;
        case "answer":
            return <AnswerView idx={idx} />;
        // An answer's awards, whens and submitted responses have no view.
        case "award":
        case "when":
        case "response":
        case "functionIterates":
        case "updateValue":
            return null;
        case "line":
            return inGraph ? <JxLine idx={idx} segment={false} /> : null;
        case "lineSegment":
            return inGraph ? <JxLine idx={idx} segment={true} /> : null;
        // A circle is drawn in a graph, by its shape, and nowhere else.
        case "circle":
            return null;
        case "polygon":
            return inGraph ? <JxPolygon idx={idx} /> : null;
        // A point list's children are points aliasing a shape's own points.
        case "pointList":
        case "group":
        case "stickyGroup":
            return <Children idx={idx} inGraph={inGraph} />;
        case "p":
            return inGraph ? (
                <Children idx={idx} inGraph={inGraph} />
            ) : (
                // A div: a paragraph's children may render as blocks.
                <div className="p">
                    <Children idx={idx} inGraph={inGraph} />
                </div>
            );
        case "text":
            return <TextView idx={idx} />;
        case "conditionalContent":
        case "select":
            return <ChoiceView idx={idx} inGraph={inGraph} />;
        case "case":
            return <CaseView idx={idx} inGraph={inGraph} />;
        case "section":
            return <SectionView idx={idx} inGraph={inGraph} />;
        case "hint":
            return <HintView idx={idx} />;
        case "choiceInput":
            return <ChoiceInputView idx={idx} />;
        // Rendered by its choiceInput, beside its radio button.
        case "choice":
            return null;
        // A load-time pick has no view; its value shows where it is used.
        case "selectFromSequence":
            return null;
        case "setup":
            return null;
        case "evaluate":
            return <NumberView idx={idx} />;
        // A repeat's children are every iteration's expanded template; a
        // collect's are copies of what it gathered. Both render inline.
        case "repeatForSequence":
        case "repeat":
        case "collect":
            return <Children idx={idx} inGraph={inGraph} />;
        case "sequenceValue":
            return <NumberView idx={idx} />;
        case "_error":
            return <ErrorBox idx={idx} />;
        default:
            return null; // <op> has no rendering
    }
}

/** The box an element that could not be built stands as (ADR 0013): the
 * message of the error diagnostic about its DAST node. */
function ErrorBox({ idx }: { idx: number }) {
    const store = useStore();
    const node = store.comps.node(idx);
    const d = store.diagnostics.find(
        (d) => d.kind === "error" && d.node === node,
    );
    return (
        <span className="error-box" data-comp={idx} role="alert">
            {d ? d.message : "error"}
        </span>
    );
}

/** React clones every child fiber of a parent on the update path, so a flat
 * list of N siblings costs O(N) per tick. Chunking children into a shallow
 * tree makes the update path O(CHUNK * log N) instead. */
const CHUNK = 32;

export function Children({ idx, inGraph }: { idx: number; inGraph: boolean }) {
    const store = useStore();
    // The table is replaced by a rebuild; `structureVersion` re-reads it.
    const items = useMemo(
        () => store.comps.children(idx),
        [store, store.comps, idx],
    );
    return (
        <ChildRange
            items={items}
            from={0}
            to={items.length}
            inGraph={inGraph}
        />
    );
}

/** A list of children taken from a component's (some left out). */
export function ChildItems({
    items,
    inGraph,
}: {
    items: Child[];
    inGraph: boolean;
}) {
    return (
        <ChildRange
            items={items}
            from={0}
            to={items.length}
            inGraph={inGraph}
        />
    );
}

/** Children are keyed by stable component identity (DAST node and scope),
 * not by index, so after a rebuild React updates surviving components in
 * place and mounts only the iterations that appeared. */
function ChildRange({
    items,
    from,
    to,
    inGraph,
}: {
    items: Child[];
    from: number;
    to: number;
    inGraph: boolean;
}) {
    const store = useStore();
    const n = to - from;
    if (n <= CHUNK) {
        return (
            <>
                {items
                    .slice(from, to)
                    .map((ch, i) =>
                        "c" in ch ? (
                            <Component
                                key={store.comps.key(ch.c, from + i)}
                                idx={ch.c}
                                inGraph={inGraph}
                            />
                        ) : (
                            <span key={from + i}>{ch.t}</span>
                        ),
                    )}
            </>
        );
    }
    // Split into CHUNK ranges of roughly equal size.
    const step = Math.ceil(n / CHUNK);
    const parts = [];
    for (let s = from; s < to; s += step) {
        parts.push(
            <ChildRange
                key={s}
                items={items}
                from={s}
                to={Math.min(to, s + step)}
                inGraph={inGraph}
            />,
        );
    }
    return <>{parts}</>;
}

/** Reports React commits back to the store for commit-latency samples. */
export function CommitReporter() {
    const store = useStore();
    const version = useSyncExternalStore(
        (fn) => store.subscribeAny(fn),
        () => store.version,
    );
    useLayoutEffect(() => {
        store.markCommit();
    }, [store, version]);
    return null;
}

// Every request a renderer sends is on a cell the core marks interactive
// (ADR 0017): the saved-state check sees only declared inputs, and the core
// accepts a request on any cell, so this is where an undeclared one is
// caught. The document below is rendered in jsdom and every control is
// used: each input, button and hint, and each graph element's drag
// handlers and the board's pan.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { CellStore, loadDocument } from "./core";
import { CellsViewer } from "./CellsViewer";
import { parseDoenetML } from "./parse";
import { boards } from "./renderers/jsxgraph/Board";

declare global {
    var IS_REACT_ACT_ENVIRONMENT: boolean;
}

const DOC = `
<graph name="g">
  <point name="p">(1,2)</point>
  <point name="q" extend="$p" y="3"/>
  <line name="l" through="(0,0) (1,1)"/>
  <line name="ld" through="(0,1)" slope="2"/>
  <lineSegment name="s" endpoints="(0,0) (1,0)"/>
  <circle name="c" through="(0,0) (2,0) (0,2)"/>
  <circle name="cr" center="(3,3)" radius="1"/>
  <polygon name="pg" vertices="(0,0) (1,0) (0,1)"/>
</graph>
<graph name="bound" xmin="$n" xmax="$n + 20"><point>(5,5)</point></graph>
<numberInput name="n" value="1"/>
<booleanInput name="b"/>
<boolean name="bb">true</boolean>
<booleanInput name="bBound" bindValueTo="$bb"/>
<mathInput name="mi"/>
<mathInput name="miBound" bindValueTo="$n"/>
<textInput name="ti"/>
<slider name="sl" from="0" to="10"/>
<slider name="slBound" from="0" to="10" bindValueTo="$n"/>
<choiceInput name="ci"><choice>a</choice><choice>b</choice></choiceInput>
<hint name="h"><p>help</p></hint>
<number name="k">3</number>
<triggerSet name="t"><label>Go</label><updateValue target="$k" newValue="5"/></triggerSet>
<answer name="a">2x</answer>
`;

/** What the renderers must have requested between them, as
 * `type.prop` (`_describeCell`): one per kind of control, so a driver
 * that stops reaching one fails here rather than passing vacuously. */
const EXPECTED = [
    "graph.xmin",
    "graph.ymax",
    "point.x",
    "point.y",
    "line.x1",
    "line.y2",
    "lineSegment.x1",
    "lineSegment.y2",
    "circle.cx",
    "circle.cy",
    "polygon.list[0]",
    "numberInput.value",
    "booleanInput.value",
    "mathInput.expr",
    "mathInput.value",
    "textInput.value",
    "slider.value",
    "choiceInput.selectedIndex",
    "hint.open",
    "number.value",
];

const wasm = resolve(__dirname, "../../cells-core/pkg/cells_wasm_bg.wasm");

let root: Root | null = null;
let container: HTMLElement | null = null;

beforeAll(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    window.__cellsWasm = WebAssembly.compile(readFileSync(wasm));
    CellStore.checkRequests = true;
});

afterEach(() => {
    act(() => root?.unmount());
    container?.remove();
    root = container = null;
});

/** Load and render `source`, recording every request the renderers send:
 * the props it was on, and the error the check threw, if any. */
async function render(source: string) {
    const store = await loadDocument(
        await parseDoenetML(source),
        "dirty-closure",
        {},
    );
    const requested = new Set<string>();
    const refused: string[] = [];
    const send = store._send.bind(store);
    store._send = (pairs, points) => {
        for (const [cell] of pairs)
            for (const name of store._describeCell(cell).split(", "))
                requested.add(name);
        try {
            send(pairs, points);
        } catch (e) {
            refused.push(String(e));
        }
    };
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    await act(async () => root!.render(<CellsViewer store={store} />));
    // Board elements mount a commit after their board.
    await act(async () => {});
    return { store, requested, refused };
}

/** Type into a controlled input as a user would. */
function setValue(input: HTMLInputElement, value: string) {
    Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
    )!.set!.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
}

/** Use every control in `root`, once each, as a student would. */
async function useEveryControl(root: HTMLElement) {
    for (const input of root.querySelectorAll<HTMLInputElement>("input")) {
        await act(async () => {
            if (input.type === "checkbox" || input.type === "radio")
                input.click();
            else if (input.type === "range") setValue(input, input.max);
            else {
                setValue(input, "3");
                input.dispatchEvent(
                    new KeyboardEvent("keydown", {
                        key: "Enter",
                        bubbles: true,
                    }),
                );
            }
        });
    }
    for (const details of root.querySelectorAll("details"))
        await act(async () => {
            details.open = !details.open;
            details.dispatchEvent(new Event("toggle"));
        });
    for (const button of root.querySelectorAll("button"))
        await act(async () => button.click());
    // A drag of every JSXGraph object that has one (a point's shadow, a
    // segment's endpoint, a whole shape), then a pan of every board.
    for (const h of boards) {
        for (const o of [...h.board.objectsList])
            if (o.eventHandlers?.drag?.length)
                await act(async () => {
                    const at = { type: "mouse", x: 0, y: 0 };
                    o.triggerEventHandlers(["down"], [at]);
                    o.triggerEventHandlers(["drag"], [at]);
                    o.triggerEventHandlers(["up"], [at]);
                });
        await act(async () => {
            const [x0, y1, x1, y0] = h.board.getBoundingBox();
            h.board.setBoundingBox([x0 + 1, y1 + 1, x1 + 1, y0 + 1]);
        });
    }
}

describe("renderers request only interactive cells", () => {
    it("checks a request on a cell that is not", async () => {
        const { store, refused } = await render(`<slider name="s"/>`);
        const s = store.comps.byName("s")!;
        await act(async () =>
            store.request([[store.comps.cell(s, "value"), 4]]),
        );
        expect(refused).toEqual([]);
        await act(async () =>
            store.request([[store.comps.cell(s, "index"), 4]]),
        );
        expect(refused).toEqual([
            expect.stringMatching(/slider\.index.*marks interactive/),
        ]);
    });

    it("every control of every renderer", async () => {
        const { requested, refused } = await render(DOC);
        await useEveryControl(container!);
        expect(refused).toEqual([]);
        expect(EXPECTED.filter((name) => !requested.has(name))).toEqual([]);
    });
});

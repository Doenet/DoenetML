/**
 * Every request the bridge sends is on a cell the core marks interactive
 * (ADR 0017, 0018), and every cell it reads is an output (ADR 0019). The
 * cells viewer checks its own renderers this way in jsdom
 * (`packages/cells-viewer/src/interactive.test.tsx`); here the renderer is the
 * prototype's, which reaches the core only through the bridge, so the check is
 * the bridge's: every renderer action it knows is carried out on every element
 * that takes it, in the viewer's test document and every golden document.
 */
import { beforeAll, describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { lezerToDast, normalizeDocumentDast } from "@doenet/parser";
import { initCellsCore, loadCellsDocument } from "./loadCellsCore";
import { RENDERER_ACTIONS } from "./actions";

const CELLS_CORE = path.resolve(__dirname, "../../../cells-core");

/** The arguments each renderer action is carried out with: what its
 * renderer would send. */
const ARGS: Record<string, Record<string, Record<string, unknown>[]>> = {
    point: { move: [{ x: 2, y: 3 }] },
    graph: {
        changeBoundingBox: [{ xMin: -9, xMax: 9, yMin: -8, yMax: 8 }],
    },
    textInput: {
        updateImmediateValue: [{ text: "3" }],
        updateValue: [{}],
    },
    booleanInput: { updateBoolean: [{ boolean: true }] },
    choiceInput: { updateSelectedIndices: [{ selectedIndices: [2] }] },
    line: {
        moveLine: [{ point1coords: [1, 1], point2coords: [2, 3] }],
    },
    lineSegment: {
        moveLineSegment: [
            { point1coords: [1, 1], point2coords: [2, 3] },
            { point2coords: [4, 4] },
        ],
    },
    circle: { moveCircle: [{ center: [1, 1] }] },
    polygon: {
        movePolygon: [
            { pointCoords: { 0: [1, 1], 1: [2, 1], 2: [1, 2] } },
            { pointCoords: { 1: [3, 1] } },
        ],
    },
    slider: { changeValue: [{ value: 4 }] },
    numberInput: { updateValue: [{ value: 3 }] },
    mathInput: { updateValue: [{ text: "3" }] },
    hint: { toggle: [{ open: true }] },
    answer: { submitAnswer: [{}] },
    triggerSet: { triggerActions: [{}] },
};

/** The viewer's interactive document (`interactive.test.tsx`). */
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
  <collect name="pts" componentType="point" from="$g2"/>
  <polyline name="pl" vertices="$pts"/>
  <function name="f">x^2</function>
</graph>
<graph name="g2"><point>(0,0)</point><point>(1,1)</point></graph>
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
<boolean name="k"/>
<triggerSet name="t"><label>Go</label><updateValue target="$k" newValue="true"/></triggerSet>
<answer name="a">2x</answer>
<number name="num">$n + 1</number>
<clampNumber name="cl">5</clampNumber>
<math name="mm">x + $n</math>
<math name="tu">(1, 2, 3)</math>
<text name="tx">words</text>
<p><m>x = $num</m></p>
<md><mrow>y = $mm</mrow></md>
<evaluate name="e" function="$f" input="2"/>
<section name="sec"><p>inside</p></section>
<aside><title>More</title><p>aside</p></aside>
<conditionalContent name="cc"><case condition="$n > 2"><p>big</p></case><else><p>small</p></else></conditionalContent>
<select name="sel"><option><p>one</p></option><option><p>two</p></option></select>
<repeatForSequence name="r" from="1" to="3" valueName="v"><number>$v</number></repeatForSequence>
<setup><number name="hidden">$n + 2</number></setup>
`;

/** What the bridge must have requested, as `type.prop`: one per kind of
 * control, so an action that stops reaching its cells fails here rather
 * than passing vacuously. */
const EXPECTED_REQUESTS = [
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
];

/** What the bridge must have read, as `type.prop`: one or more per
 * contract that reads cells. */
const EXPECTED_READS = [
    "graph.xmin",
    "point.x",
    "point.hide",
    "line.x1",
    "lineSegment.y2",
    "circle.radius",
    "polygon.list[0]",
    "number.value",
    "clampNumber.value",
    "math.expr",
    "math.value",
    "tuple.x3",
    "text.value",
    "evaluate.value",
    "function.xmin",
    "function.samples",
    "numberInput.value",
    "booleanInput.value",
    "boolean.value",
    "mathInput.expr",
    "textInput.value",
    "slider.step",
    "choiceInput.selectedIndex",
    "hint.open",
    "answer.credit",
    "answer.numSubmissions",
    "section.number",
    "section.label",
    "case.active",
];

beforeAll(async () => {
    await initCellsCore(
        fs.readFileSync(path.join(CELLS_CORE, "pkg/cells_wasm_bg.wasm")),
    );
});

/** Load `source`, record what the bridge requests and reads (and what its
 * checks refuse), and carry out every renderer action on every element. */
async function exercise(source: string) {
    const bridge = await loadCellsDocument(
        normalizeDocumentDast(lezerToDast(source)),
    );
    const requested = new Set<string>();
    const read = new Set<string>();
    const refused: string[] = [];
    const described = new Map<number, string>();
    const describe = (cell: number) => {
        if (!described.has(cell)) described.set(cell, bridge._describe(cell));
        return described.get(cell)!.split(", ");
    };
    const checkInteractive = bridge._checkInteractive.bind(bridge);
    bridge._checkInteractive = (pairs) => {
        for (const [cell] of pairs) {
            for (const name of describe(cell)) requested.add(name);
        }
        try {
            checkInteractive(pairs);
        } catch (e) {
            refused.push(String(e));
            throw e;
        }
    };
    const checkOutput = bridge._checkOutput.bind(bridge);
    bridge._checkOutput = (cell) => {
        for (const name of describe(cell)) read.add(name);
        try {
            checkOutput(cell);
        } catch (e) {
            refused.push(String(e));
            throw e;
        }
    };

    const root = bridge.flatDast();
    // Every element sent, by its component type, as it stands at load.
    const elements = (root.elements as any[]).filter(
        (e) => e?.type === "element",
    );
    for (const element of elements) {
        const c = bridge._componentById.get(element.data.id);
        if (c === undefined) continue;
        const type = bridge.table.componentType(c);
        for (const [actionName, argsList] of Object.entries(ARGS[type] ?? {})) {
            for (const args of argsList) {
                try {
                    bridge.dispatch({
                        component: element.name,
                        actionName,
                        componentIdx: element.data.id,
                        args,
                    });
                } catch (e) {
                    // A check's refusal is recorded already.
                    if (!refused.includes(String(e))) refused.push(String(e));
                }
            }
        }
    }
    return { requested, read, refused };
}

describe("the bridge requests only interactive cells and reads only outputs", () => {
    it("carries out every renderer action it has", () => {
        for (const [type, actions] of Object.entries(RENDERER_ACTIONS)) {
            for (const actionName of Object.keys(actions)) {
                expect(
                    ARGS[type]?.[actionName],
                    `${type}.${actionName} needs arguments here`,
                ).toBeDefined();
            }
        }
    });

    it("throws on a request on a cell that is not interactive", async () => {
        const bridge = await loadCellsDocument(
            normalizeDocumentDast(lezerToDast(`<number name="n">1</number>`)),
        );
        bridge.flatDast();
        const cell = bridge.table.cell(bridge.core.resolve_path("n"), "value")!;
        expect(() => bridge._checkInteractive([[cell, 2]])).toThrow(
            /number\.value.*interactive/,
        );
    });

    it("in the viewer's interactive document", async () => {
        const { requested, read, refused } = await exercise(DOC);
        expect(refused).toEqual([]);
        expect([...requested]).toEqual(
            expect.arrayContaining(EXPECTED_REQUESTS),
        );
        expect([...read]).toEqual(expect.arrayContaining(EXPECTED_READS));
    });

    const golden = path.join(CELLS_CORE, "crates/cells-bench/golden");
    const documents = [
        ...fs
            .readdirSync(golden)
            .filter((f) => f.endsWith(".doenet"))
            .map((f) => path.join(golden, f)),
        path.join(CELLS_CORE, "fixtures/sir.doenet"),
    ];
    it.each(documents.map((f) => [path.basename(f), f]))(
        "in %s",
        async (_, file) => {
            const { refused } = await exercise(fs.readFileSync(file, "utf8"));
            expect(refused).toEqual([]);
        },
    );
});

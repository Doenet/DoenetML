/**
 * The cells bridge against the real cells core (ADR 0020): the flat DAST it
 * builds, the updates a renderer action causes, element ids across a rebuild,
 * and that every cell a contract reads is an output (`CellsBridge.strict`,
 * on under vitest).
 */
import { beforeAll, describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { lezerToDast, normalizeDocumentDast } from "@doenet/parser";
import { initCellsCore, loadCellsDocument } from "./loadCellsCore";
import { CellsBridge, type ElementUpdate } from "./bridge";

const CELLS_CORE = path.resolve(__dirname, "../../../cells-core");

beforeAll(async () => {
    await initCellsCore(
        fs.readFileSync(path.join(CELLS_CORE, "pkg/cells_wasm_bg.wasm")),
    );
});

function load(source: string) {
    return loadCellsDocument(normalizeDocumentDast(lezerToDast(source)));
}

/** The elements of a flat DAST by their name, in id order. */
function byName(root: ReturnType<CellsBridge["flatDast"]>, name: string) {
    return root.elements.filter(
        (e) => e?.type === "element" && e.name === name,
    );
}

describe("flat DAST", () => {
    it("gives each component its renderer's props", async () => {
        const bridge = await load(`<section><title>Intro</title>
<p><text>hello</text> <number>3.25</number> <math>x+1</math> <boolean>true</boolean> <point>(1,2)</point></p>
<graph xmin="-5"><point>(3,4)</point></graph>
<textInput prefill="hi"/><booleanInput/>
<choiceInput><choice>a</choice><choice>b</choice></choiceInput>
</section>`);
        const root = bridge.flatDast();

        const [doc] = byName(root, "document");
        expect(root.children).toEqual([
            { id: doc.data.id, annotation: "original" },
        ]);

        const [division] = byName(root, "division");
        const [title] = byName(root, "title");
        expect(division.data).toMatchObject({
            props: {
                title: title.data.id,
                codeNumber: "1",
                divisionDepth: 1,
                divisionType: "section",
                xrefLabel: { label: "Section" },
            },
        });
        // The title is drawn from the prop, not as a child.
        expect(division.children).not.toContainEqual(
            expect.objectContaining({ id: title.data.id }),
        );

        const props = (name: string) =>
            byName(root, name).map((e) => (e.data as any).props);
        expect(props("text")).toEqual([{ value: "hello" }]);
        expect(props("number")).toEqual([{ text: "3.25" }]);
        expect(props("math")).toEqual([
            { latex: "x + 1", renderMode: "inline" },
        ]);
        expect(props("boolean")).toEqual([{ value: true }]);
        // In text a point is its coordinates' LaTeX; in a graph, its
        // coordinates as `Math`.
        expect(props("point")).toEqual([
            { coordsLatex: "\\left( 1, 2 \\right)" },
            { x: { math_object: "3" }, y: { math_object: "4" } },
        ]);
        expect(props("graph")[0]).toMatchObject({ xMin: -5 });
        expect(props("textInput")[0]).toMatchObject({ immediateValue: "hi" });
        expect(props("booleanInput")[0]).toMatchObject({
            immediateValue: false,
        });
        const [choiceInput] = byName(root, "choiceInput");
        expect((choiceInput.data as any).props).toMatchObject({
            selectedIndices: [],
            choiceOrder: [1, 2],
        });
        expect(choiceInput.children).toHaveLength(2);
    });

    it("splices in what only arranges its children, leaves out what has no view", async () => {
        const bridge = await load(
            `<setup><number name="hidden">1</number></setup><group><text>a</text><text>b</text></group>`,
        );
        const root = bridge.flatDast();
        const [doc] = byName(root, "document");
        const texts = byName(root, "text").map((e) => e.data.id);
        expect(doc.children.filter((c) => typeof c !== "string")).toEqual(
            texts.map((id) => ({ id, annotation: "original" })),
        );
        expect(byName(root, "number")).toEqual([]);
    });

    it("reads only outputs, for every golden document", async () => {
        expect(CellsBridge.strict).toBe(true);
        const golden = path.join(CELLS_CORE, "crates/cells-bench/golden");
        for (const file of fs.readdirSync(golden)) {
            if (!file.endsWith(".doenet")) continue;
            const source = fs.readFileSync(path.join(golden, file), "utf8");
            const bridge = await load(source);
            expect(() => bridge.flatDast(), file).not.toThrow();
        }
    });
});

describe("renderer actions", () => {
    it("moves a point and sends only what changed", async () => {
        const bridge = await load(
            `<graph><point name="P">(1,2)</point></graph><p><number>$P.x</number></p>`,
        );
        const root = bridge.flatDast();
        const [point] = byName(root, "point");
        const [number] = byName(root, "number");
        const { payload } = bridge.dispatch({
            component: "point",
            actionName: "move",
            componentIdx: point.data.id,
            args: { x: 5, y: 2 },
        });
        expect(payload).toEqual({
            [point.data.id]: {
                type: "elementUpdate",
                changedState: { x: { math_object: "5" } },
            },
            [number.data.id]: {
                type: "elementUpdate",
                changedState: { text: "5" },
            },
        });
    });

    it("types text, checks a box and picks a choice", async () => {
        const bridge = await load(`<textInput name="ti"/><text>$ti</text>
<booleanInput name="bi"/><boolean>$bi</boolean>
<choiceInput name="ci"><choice>a</choice><choice>b</choice></choiceInput>`);
        const root = bridge.flatDast();
        const id = (name: string) => byName(root, name)[0].data.id;
        const send = (component: string, actionName: string, args: object) =>
            bridge.dispatch({
                component,
                actionName,
                componentIdx: id(component),
                args,
            }).payload as Record<number, ElementUpdate>;

        let payload = send("textInput", "updateImmediateValue", {
            text: "abc",
        });
        expect(payload[id("text")].changedState).toEqual({ value: "abc" });
        expect(payload[id("textInput")].changedState).toEqual({
            immediateValue: "abc",
        });
        expect(send("textInput", "updateValue", {})).toEqual({});

        payload = send("booleanInput", "updateBoolean", { boolean: true });
        expect(payload[id("boolean")].changedState).toEqual({ value: true });

        payload = send("choiceInput", "updateSelectedIndices", {
            selectedIndices: [2],
        });
        expect(payload[id("choiceInput")].changedState).toEqual({
            selectedIndices: [2],
        });
    });

    it("throws on a renderer action it does not know", async () => {
        const bridge = await load(`<text>a</text>`);
        const [text] = byName(bridge.flatDast(), "text");
        expect(() =>
            bridge.dispatch({
                component: "text",
                actionName: "explode",
                componentIdx: text.data.id,
            }),
        ).toThrow(/no renderer action text.explode/);
    });

    it("shows a case's children when it becomes active", async () => {
        const bridge = await load(`<booleanInput name="b"/>
<conditionalContent><case condition="$b"><text>shown</text></case></conditionalContent>`);
        const root = bridge.flatDast();
        const [doc] = byName(root, "document");
        const [input] = byName(root, "booleanInput");
        const { payload } = bridge.dispatch({
            component: "booleanInput",
            actionName: "updateBoolean",
            componentIdx: input.data.id,
            args: { boolean: true },
        }) as { payload: Record<number, ElementUpdate> };
        const children = payload[doc.data.id].newChildren!;
        const added = children.find(
            (c) => typeof c !== "string" && c.id !== input.data.id,
        ) as { id: number };
        expect(payload[added.id].newFlatDastElement).toMatchObject({
            name: "text",
            data: { props: { value: "shown" } },
        });
    });
});

describe("rebuilds", () => {
    it("keeps element ids and sends the new iterations as new elements", async () => {
        const bridge = await load(`<numberInput name="n" value="2"/>
<repeatForSequence length="$n" valueName="v"><number>$v</number></repeatForSequence>`);
        const root = bridge.flatDast();
        const [doc] = byName(root, "document");
        const before = byName(root, "number").map((e) => e.data.id);
        expect(before).toHaveLength(2);

        // No renderer draws a numberInput yet (step 3), so the request is
        // sent to the core directly.
        const c = bridge.table.length;
        let input = -1;
        for (let k = 0; k < c; k++) {
            if (bridge.table.componentType(k) === "numberInput") input = k;
        }
        const cell = bridge.table.cell(input, "value")!;
        const changed = bridge.core.request(
            Uint32Array.of(cell),
            Float64Array.of(3),
        );
        expect(bridge.core.last_rebuilt()).toBe(true);
        const payload = bridge._afterTick(changed);

        const children = payload[doc.data.id].newChildren!.filter(
            (c) => typeof c !== "string",
        ) as { id: number }[];
        const after = children
            .map((c) => c.id)
            .filter((id) => id !== doc.data.id);
        expect(after.slice(1, 3)).toEqual(before);
        const added = after[3];
        expect(payload[added].newFlatDastElement).toMatchObject({
            name: "number",
            data: { props: { text: "3" } },
        });
        // The iterations that stayed changed nothing.
        expect(payload[before[0]]).toBeUndefined();
    });
});

describe("step 3 components", () => {
    /** Load, then find elements by name and send renderer actions. */
    async function open(source: string) {
        const bridge = await load(source);
        const root = bridge.flatDast();
        const all = (name: string) => byName(root, name);
        const props = (name: string, i = 0) => (all(name)[i].data as any).props;
        const send = (
            component: string,
            actionName: string,
            args: object,
            i = 0,
        ) =>
            bridge.dispatch({
                component,
                actionName,
                componentIdx: all(component)[i].data.id,
                args,
            }).payload as Record<number, ElementUpdate>;
        const changed = (
            payload: Record<number, ElementUpdate>,
            name: string,
            i = 0,
        ) => payload[all(name)[i].data.id]?.changedState;
        return { bridge, root, all, props, send, changed };
    }

    it("draws and moves lines, segments, circles and polygons", async () => {
        const { props, send, changed } = await open(`<graph>
<line through="(0,0) (1,1)"/>
<lineSegment endpoints="(0,0) (2,0)"/>
<circle center="(1,2)" radius="3"/>
<polygon vertices="(0,0) (1,0) (0,1)"/>
</graph>`);
        expect(props("line")).toEqual({
            numericalPoints: [
                [0, 0],
                [1, 1],
            ],
        });
        expect(props("lineSegment").numericalEndpoints).toEqual([
            [0, 0],
            [2, 0],
        ]);
        expect(props("circle")).toEqual({
            numericalCenter: [1, 2],
            numericalRadius: 3,
        });
        expect(props("polygon").numericalVertices).toEqual([
            [0, 0],
            [1, 0],
            [0, 1],
        ]);

        let payload = send("line", "moveLine", {
            point1coords: [1, 0],
            point2coords: [2, 1],
        });
        expect(changed(payload, "line")).toEqual({
            numericalPoints: [
                [1, 0],
                [2, 1],
            ],
        });
        payload = send("lineSegment", "moveLineSegment", {
            point2coords: [3, 3],
        });
        expect(changed(payload, "lineSegment")).toEqual({
            numericalEndpoints: [
                [0, 0],
                [3, 3],
            ],
        });
        payload = send("circle", "moveCircle", { center: [-1, -1] });
        expect(changed(payload, "circle")).toEqual({
            numericalCenter: [-1, -1],
        });
        payload = send("polygon", "movePolygon", {
            pointCoords: { 2: [0, 5] },
        });
        expect(changed(payload, "polygon")).toEqual({
            numericalVertices: [
                [0, 0],
                [1, 0],
                [0, 5],
            ],
        });
    });

    it("draws a polyline through the points it gathered, and a legend", async () => {
        const { all, props } = await open(`<graph>
<collect name="ps" componentType="point" from="$g2"/>
<polyline vertices="$ps"/>
<legend><label>Path</label></legend>
</graph>
<graph name="g2"><point>(0,0)</point><point>(1,2)</point></graph>`);
        expect(props("polyline").numericalVertices).toEqual([
            [0, 0],
            [1, 2],
        ]);
        expect(all("polyline")[0].children).toEqual([]);
        expect(props("legend").legendElements).toEqual([
            { swatchType: "line", label: { value: "Path", hasLatex: false } },
        ]);
    });

    it("draws a function's curve through its samples", async () => {
        const { all, props } = await open(`<graph xmin="-1" xmax="1">
<function name="f">x^2</function>
<derivative>$f</derivative>
<function variables="x y">(x, y)</function>
</graph>
<p><function>x</function></p>`);
        // In a graph, a polyline through the samples over the x-range; a
        // function of several variables has none.
        const curves = all("polyline");
        expect(curves).toHaveLength(3);
        const [f, df, vector] = curves.map(
            (e) => (e.data as any).props.numericalVertices,
        );
        expect(f).toHaveLength(200);
        expect(f[0]).toEqual([-1, 1]);
        expect(f[199]).toEqual([1, 1]);
        expect(df[0]).toEqual([-1, -2]);
        expect(df[199]).toEqual([1, 2]);
        expect(vector).toEqual([]);
        expect(curves[0].children).toEqual([]);
        // In text it has no view yet.
        expect(props("function")).toEqual({});
    });

    it("takes numbers, expressions and slider values", async () => {
        const { props, send, changed } = await open(`
<numberInput name="n"/><number>$n</number>
<mathInput name="m"/>
<slider name="s" from="0" to="10" step="2"/><number>$s</number>`);
        let payload = send("numberInput", "updateValue", { value: 4 });
        expect(changed(payload, "number")).toEqual({ text: "4" });

        payload = send("mathInput", "updateValue", { text: "x+x" });
        expect(changed(payload, "mathInput")?.text).toMatch(/x/);
        // Text that does not parse changes nothing.
        expect(send("mathInput", "updateValue", { text: "(" })).toEqual({});

        expect(props("slider")).toMatchObject({ from: 0, to: 10, step: 2 });
        payload = send("slider", "changeValue", { value: 5 });
        // The core snaps to the slider's steps.
        expect([4, 6]).toContain(changed(payload, "slider")?.value);
    });

    it("opens a hint and scores a submitted answer", async () => {
        const { props, send, changed } = await open(`
<hint><p>Try harder</p></hint>
<answer><mathInput name="mi"/><award><when>$mi = x</when></award></answer>`);
        expect(props("hint")).toEqual({ open: false });
        let payload = send("hint", "toggle", { open: true });
        expect(changed(payload, "hint")).toEqual({ open: true });

        send("mathInput", "updateValue", { text: "x" });
        payload = send("answer", "submitAnswer", {});
        expect(changed(payload, "answer")).toEqual({
            creditAchieved: 1,
            numSubmissions: 1,
        });
    });

    it("writes math notation with the values it refers to", async () => {
        const { all, props } = await open(`<number name="n">3</number>
<m>x^{$n}</m><md><mrow>a</mrow><mrow>b</mrow></md>
<math>(1, 2, 3)</math>`);
        expect(props("m").latex).toBe("x^{3}");
        expect(all("m")[0].children).toEqual([]);
        expect(props("md")).toEqual({
            latex: "a\\\\b",
            renderMode: "align",
        });
        expect(props("tuple").latex).toBe("\\left( 1, 2, 3 \\right)");
    });
});

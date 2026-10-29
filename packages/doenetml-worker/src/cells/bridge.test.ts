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

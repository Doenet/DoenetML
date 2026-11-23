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
    it("draws a value list as the text of its entries (ADR 0041)", async () => {
        const bridge = await load(`<numberList>1 2.5 3</numberList>
<textList>a b</textList>
<booleanList>true false</booleanList>`);
        const root = bridge.flatDast();
        expect(byName(root, "text").map((e) => (e.data as any).props)).toEqual([
            { value: "1, 2.5, 3" },
            { value: "a, b" },
            { value: "true, false" },
        ]);
    });

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

describe("references and copies", () => {
    it("present a reference as its referent, and append a copy's own children", async () => {
        const bridge =
            await load(`<p name="p">a<text>x</text></p><p name="pe" extend="$p">b</p>
<textInput name="ti"><label>Name</label></textInput><textInput extend="$ti"/>
<textInput extend="$ti"><label>Other</label></textInput>
<p><number name="n" displayDecimals="1">3.14159</number> $n <number extend="$n" displayDecimals="3"/></p>`);
        const root = bridge.flatDast();
        const props = (name: string) =>
            byName(root, name).map((e) => (e.data as any).props);
        // The copy shows the referent's children, then its own (REF-4).
        const texts = (e: any) =>
            e.children.map((c: any) =>
                typeof c === "string"
                    ? c
                    : (root.elements[c.id]?.data as any).props?.value,
            );
        const [p, pe] = byName(root, "p");
        expect(texts(p)).toEqual(["a", "x"]);
        expect(texts(pe)).toEqual(["a", "x", "b"]);
        // A reference has its referent's label unless it gives its own,
        // the last `<label>` written winning (ADR 0024, REF-4a).
        expect(props("textInput").map((q) => q.label)).toEqual([
            "Name",
            "Name",
            "Other",
        ]);
        // And its referent's display settings.
        expect(props("number").map((q) => q.text)).toEqual([
            "3.1",
            "3.1",
            "3.142",
        ]);
    });
});

describe("values and lists", () => {
    it("reads a bare reference to an input as its value, and shows repeated items as a list", async () => {
        const bridge =
            await load(`<mathInput name="mi" prefill="x+1"/><textInput name="ti" prefill="hi"/>
<p name="vals">$mi $ti</p>
<number name="n">3</number><math name="m" extend="$n"/>
<p name="r"><repeatForSequence from="1" to="3" valueName="v">$v</repeatForSequence></p>
<p name="g"><group><number>1</number><number>2</number></group></p>
<p name="gl"><group asList><number>1</number><number>2</number></group></p>
<p name="rn"><repeatForSequence from="1" to="2" valueName="w" asList="false">$w</repeatForSequence></p>`);
        const root = bridge.flatDast();
        const texts = (e: any) =>
            e.children.map((c: any) => {
                if (typeof c === "string") return c;
                const el = root.elements[c.id] as any;
                return `<${el.name}>${el.data.props?.text ?? el.data.props?.value ?? el.data.props?.latex ?? ""}`;
            });
        const [vals] = byName(root, "p").filter(
            (e) => (e as any).attributes?.name?.children?.[0] === "vals",
        ).length
            ? byName(root, "p")
            : byName(root, "p");
        const ps = byName(root, "p").map(texts);
        // `$mi` is a math showing what was entered; `$ti` a text.
        expect(ps[0]).toEqual(["<math>x + 1", " ", "<text>hi"]);
        // `<math extend="$n"/>` is n's value as a math.
        expect(
            byName(root, "math").map((e) => (e.data as any).props.latex),
        ).toEqual(["x + 1", "3"]);
        // A repeat's items are comma-separated; a group's are not unless
        // it asks; `asList="false"` turns them off.
        expect(ps[1]).toEqual([
            "<number>1",
            ", ",
            "<number>2",
            ", ",
            "<number>3",
        ]);
        expect(ps[2]).toEqual(["<number>1", "<number>2"]);
        expect(ps[3]).toEqual(["<number>1", ", ", "<number>2"]);
        expect(ps[4]).toEqual(["<number>1", "<number>2"]);
        void vals;
    });

    it("lists the items of a list written over several lines, not the whitespace between them", async () => {
        const bridge = await load(`<p><group asList>
    <number>1</number>
    <number>2</number>
</group></p>
<p><repeatForSequence from="1" to="2" valueName="v"> $v </repeatForSequence></p>`);
        const root = bridge.flatDast();
        const ps = byName(root, "p").map((e: any) =>
            e.children.map((c: any) =>
                typeof c === "string"
                    ? c
                    : `<${(root.elements[c.id] as any).name}>`,
            ),
        );
        // COMP-2: commas between the items, and no whitespace item.
        expect(ps[0]).toEqual(["<number>", ", ", "<number>"]);
        expect(ps[1]).toEqual(["<number>", ", ", "<number>"]);
    });
});

describe("missing values", () => {
    it("shows a reference that names nothing, and what is made from it, as a blank, and keeps NaN for a computation", async () => {
        const bridge = await load(`<numberList name="l">1 2</numberList>
<p><number>$l[5]</number> <number>$l[5] + 3</number> <number>0/0</number></p>
<booleanList name="bl">true</booleanList>
<p><text extend="$nope"/> <boolean>$bl[3]</boolean> <boolean>$l[5] > 0</boolean></p>
<p><math>x + $nope</math> <point>($l[5], 1)</point></p>
<p><numberList>$l[5] 2</numberList></p>`);
        const root = bridge.flatDast();
        const props = (name: string) =>
            byName(root, name).map((e) => (e.data as any).props);
        // VAL-5, D40: missing is the blank; NaN stays for 0/0 (ADR 0046).
        expect(props("number").map((p) => p.text)).toEqual(["＿", "＿", "NaN"]);
        expect(props("text").map((p) => p.value)).toContain("＿");
        // A missing boolean is the blank; a comparison with a missing side
        // is false, since a blank never equals anything (D37, D40).
        expect(props("boolean").map((p) => p.value)).toEqual(["＿", false]);
        expect(props("math").map((p) => p.latex)).toEqual(["x + ＿"]);
        expect(props("point")).toEqual([
            { coordsLatex: "\\left( ＿, 1 \\right)" },
        ]);
        // The element that names nothing still builds: a warning, no box.
        expect(byName(root, "_error")).toEqual([]);
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

    it("draws a curve whose samples are folded into constants", async () => {
        // `fixAxes` holds the graph's bounds, so the samples read only
        // constants and fold (ADR 0028); the curve is drawn all the same.
        const { all } = await open(`<graph xmin="-1" xmax="1" fixAxes>
<function name="f">x^2</function>
<derivative>$f</derivative>
<function variables="x y">(x, y)</function>
</graph>`);
        const [f, df, vector] = all("polyline").map(
            (e) => (e.data as any).props.numericalVertices,
        );
        expect(f).toHaveLength(200);
        expect(f[0]).toEqual([-1, 1]);
        expect(f[199]).toEqual([1, 1]);
        expect(df[0]).toEqual([-1, -2]);
        expect(df[199]).toEqual([1, 2]);
        expect(vector).toEqual([]);
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

    it("draws operators as math notation and booleans, without their operands", async () => {
        const { all, props, send, changed } = await open(`
<numberInput name="n" value="-4"/>
<abs>$n</abs> <round numDecimals="1">2.25</round> <sum>1 2 $n</sum>
<mean>2 3 5 7</mean> <max>$n 3</max>
<and>true false</and> <or>true $b</or> <not>true</not>
<isBetween limits="1 5">3</isBetween> <booleanInput name="b"/>
<count name="c">x y</count><m>k = $c</m>`);
        expect(props("abs")).toEqual({ latex: "4", renderMode: "inline" });
        expect(props("round").latex).toBe("2.3");
        expect(props("sum").latex).toBe("-1");
        expect(props("mean").latex).toBe("4.25");
        expect(props("max").latex).toBe("3");
        for (const name of ["abs", "sum", "and"]) {
            expect(all(name)[0].children).toEqual([]);
        }
        expect(props("and")).toEqual({ value: false });
        expect(props("or")).toEqual({ value: true });
        expect(props("not")).toEqual({ value: false });
        expect(props("isBetween")).toEqual({ value: true });
        // Math notation refers to an operator by its value.
        expect(props("m").latex).toBe("k = 2");

        const payload = send("numberInput", "updateValue", { value: 6 });
        expect(changed(payload, "abs")).toEqual({ latex: "6" });
        expect(changed(payload, "sum")).toEqual({ latex: "9" });
        expect(changed(payload, "max")).toEqual({ latex: "6" });
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

    it("draws text markup, characters and plain blocks by their tags", async () => {
        const { root, all, props } =
            await open(`<p><em>a</em><alert>b</alert><term>c</term><q>d</q><sq>e</sq><c>f</c><attr>g</attr><span>h</span><tag>i</tag><tagc>j</tagc><tage>k</tage></p>
<p>1<ndash/>2<mdash/>3<nbsp/><ellipsis/><lq/><rq/><lsq/><rsq/><br/></p>
<hr/><div>x</div><pre>  y  z</pre><blockQuote>w</blockQuote>
<ol><li>one</li><li>two</li></ol>`);
        const names = (id: number): string[] => {
            const e = root.elements[id] as any;
            return [
                e.name,
                ...e.children.flatMap((c: any) =>
                    typeof c === "string" ? [] : names(c.id),
                ),
            ];
        };
        const [doc] = all("document");
        expect(names(doc.data.id).slice(1)).toEqual([
            "p",
            "em",
            "alert",
            "alert",
            "q",
            "sq",
            "c",
            "attr",
            "span",
            "tag",
            "tagc",
            "tag",
            "p",
            "ndash",
            "mdash",
            "nbsp",
            "ellipsis",
            "lq",
            "rq",
            "lsq",
            "rsq",
            "br",
            "hr",
            "div",
            "pre",
            "blockQuote",
            "ol",
            "li",
            "li",
        ]);
        // An element with no props has none; a `<tage>` is a self-closed tag.
        expect(props("em")).toEqual({});
        expect(all("tag").map((e) => (e.data as any).props)).toEqual([
            {},
            { selfClosed: true },
        ]);
        expect(all("tag")[1].children).toEqual(["k"]);
        expect(all("ndash")[0].children).toEqual([]);
        // Preformatted text keeps its whitespace.
        expect(all("pre")[0].children).toEqual(["  y  z"]);
        // The items of an `<ol>` are numbered.
        expect(all("li").map((e) => (e.data as any).props)).toEqual([
            { label: "1." },
            { label: "2." },
        ]);
        expect(props("ol")).toEqual({ listDepth: { Ol: 1 } });
    });

    it("draws and moves rays, vectors, rectangles and regular polygons, and shows angles", async () => {
        const { all, props, send, changed } = await open(`<graph>
<ray endpoint="(1,2)" through="(3,2)"/>
<vector tail="(0,0)" head="(1,2)" headDraggable="false"/>
<rectangle width="2" height="1"/>
<regularPolygon numVertices="4" circumradius="2"/>
</graph>
<p><ray/><vector>(3, 4)</vector></p>
<p><angle through="(1,0) (0,0) (0,1)"/> <angle degrees="45" inDegrees/></p>`);
        expect(props("ray")).toEqual({
            numericalEndpoint: [1, 2],
            numericalThroughpoint: [3, 2],
        });
        // Outside a graph a ray sends nothing, a vector its displacement.
        expect(props("ray", 1)).toEqual({});
        expect(props("vector")).toEqual({
            numericalEndpoints: [
                [0, 0],
                [1, 2],
            ],
            headDraggable: false,
            tailDraggable: true,
        });
        expect(props("vector", 1)).toEqual({
            latex: "\\left( 3, 4 \\right)",
            renderMode: "inline",
        });
        expect(props("rectangle").numericalVertices).toEqual([
            [0, 0],
            [2, 0],
            [2, 1],
            [0, 1],
        ]);
        const square = props("regularPolygon").numericalVertices;
        expect(square).toHaveLength(4);
        expect(square[0]).toEqual([2, 0]);
        expect(all("angle").map((e) => (e.data as any).props)).toEqual([
            { latex: String(Number((Math.PI / 2).toPrecision(10))) },
            { latex: "45^\\circ" },
        ]);

        // A ray's drag moves both points.
        let payload = send("ray", "moveRay", {
            endpointcoords: [0, 0],
            throughcoords: [1, 1],
        });
        expect(changed(payload, "ray")).toEqual({
            numericalEndpoint: [0, 0],
            numericalThroughpoint: [1, 1],
        });
        // A vector's tail dragged alone: its head stays.
        payload = send("vector", "moveVector", { tailcoords: [-1, -1] });
        expect(changed(payload, "vector")).toEqual({
            numericalEndpoints: [
                [-1, -1],
                [1, 2],
            ],
        });
        // A rectangle's corner dragged: the opposite corner holds.
        payload = send("rectangle", "movePolygon", {
            pointCoords: { 1: [5, -1] },
        });
        expect(changed(payload, "rectangle")).toEqual({
            numericalVertices: [
                [0, -1],
                [5, -1],
                [5, 1],
                [0, 1],
            ],
        });
        // A regular polygon's vertex dragged turns it about its center.
        payload = send("regularPolygon", "movePolygon", {
            pointCoords: { 0: [0, 3] },
        });
        const turned = changed(payload, "regularPolygon").numericalVertices;
        const near = (got: number[], want: number[]) =>
            want.forEach((v, j) => expect(got[j]).toBeCloseTo(v));
        near(turned[0], [0, 3]);
        near(turned[1], [-3, 0]);
    });
});

describe("sectioning and document-structure blocks", () => {
    async function open(source: string) {
        const bridge = await load(source);
        const root = bridge.flatDast();
        const all = (name: string) => byName(root, name);
        const props = (name: string, i = 0) => (all(name)[i].data as any).props;
        const ids = (name: string) => all(name).map((e) => e.data.id);
        const childIds = (name: string, i = 0) =>
            (all(name)[i].children as any[])
                .filter((c) => typeof c !== "string")
                .map((c) => c.id);
        return { bridge, all, props, ids, childIds };
    }

    it("draws every division as a division of its kind, numbered among its siblings", async () => {
        const { all } = await open(`<section><title>S</title>
<theorem><title>Pythagoras</title><statement><p>a</p></statement></theorem>
<introduction><subsection/></introduction>
<objectives><p>learn</p></objectives>
<problems><problem><part><p>a</p></part><part><p>b</p></part></problem></problems>
<question/><definition/><note/><paragraphs/><activity/><exercises/>
</section>`);
        const divisions = all("division").map((e) => {
            const p = (e.data as any).props;
            return [p.divisionType, p.xrefLabel.label, p.codeNumber, p.boxed];
        });
        expect(divisions).toEqual([
            ["section", "Section", "1", false],
            ["theorem", "Theorem", "1", false],
            ["subsection", "Section", "1.2", false],
            ["objectives", "Objectives", "3", true],
            ["problems", "Problems", "4", false],
            ["problem", "Problem", "1", false],
            ["part", "Part", "1", false],
            ["part", "Part", "2", false],
            ["question", "Question", "5", false],
            ["definition", "Definition", "6", false],
            ["note", "Note", "7", false],
            ["paragraphs", "Paragraphs", "8", false],
            ["activity", "Activity", "9", false],
            ["exercises", "Exercises", "10", false],
        ]);
        // A statement and an introduction are elements of their own.
        expect(all("statement")).toHaveLength(1);
        expect(all("introduction")).toHaveLength(1);
    });

    it("draws a proof as an unnumbered division that starts closed", async () => {
        const { props, ids, childIds } = await open(`<theorem/>
<proof><p>Clear.</p></proof>
<proof startOpen boxed><title>Why</title><p>Because.</p></proof>
<theorem/>`);
        expect(props("proof")).toMatchObject({
            title: null,
            codeNumber: "",
            divisionType: "proof",
            xrefLabel: { label: "Proof" },
            collapsible: true,
            boxed: false,
            open: false,
        });
        const [title] = ids("title");
        expect(props("proof", 1)).toMatchObject({
            title,
            xrefLabel: { label: "" },
            boxed: true,
            open: true,
        });
        expect(childIds("proof", 1)).not.toContain(title);
        expect(props("division", 1).codeNumber).toBe("2");
    });

    it("reveals and closes a solution", async () => {
        const { bridge, all, props, ids, childIds } = await open(
            `<solution><p>It is 2.</p></solution>`,
        );
        expect(props("solution")).toEqual({
            open: false,
            canBeClosed: true,
            sectionName: "Solution",
            hide: false,
        });
        // The parser's wrapper around its content is spliced away.
        expect(childIds("solution")).toEqual(ids("p"));
        const id = all("solution")[0].data.id;
        const send = (actionName: string) =>
            (
                bridge.dispatch({
                    component: "solution",
                    actionName,
                    componentIdx: id,
                    args: {},
                }).payload as Record<number, ElementUpdate>
            )[id]?.changedState;
        expect(send("revealSolution")).toEqual({ open: true });
        expect(send("closeSolution")).toEqual({ open: false });
    });

    it("draws a figure's caption from a prop, and a footnote's text", async () => {
        const { props, ids, childIds } = await open(`<figure>
<caption>A graph</caption><graph/></figure>
<figure suppressFigureNameInCaption><graph/></figure>
<p>Claim.<footnote>See page 3.</footnote></p>`);
        const [caption] = ids("caption");
        expect(props("figure")).toEqual({
            caption: "",
            captionChild: caption,
            figureName: "Figure",
            figureNamePrefix: "Figure: ",
            suppressFigureNameInCaption: false,
        });
        expect(childIds("figure")).not.toContain(caption);
        expect(props("figure", 1)).toMatchObject({
            captionChild: null,
            suppressFigureNameInCaption: true,
        });
        expect(props("footnote")).toEqual({
            footnoteTag: "",
            text: "See page 3.",
        });
        expect(childIds("footnote")).toEqual([]);
    });
});

describe("the layout containers and the formatted values", () => {
    async function open(source: string) {
        const bridge = await load(source);
        const root = bridge.flatDast();
        const all = (name: string) => byName(root, name);
        const props = (name: string) =>
            all(name).map((e) => (e.data as any).props);
        /** An element's children: text as written, an element as
         * `<name>` and its text or value prop. */
        const children = (e: any) =>
            e.children.map((c: any) => {
                if (typeof c === "string") return c;
                const el = root.elements[c.id] as any;
                return `<${el.name}>${el.data.props?.text ?? el.data.props?.value ?? ""}`;
            });
        return { root, all, props, children };
    }

    it("draws the formatted values as their text", async () => {
        const { props } = await open(`<p><integer>2.6</integer>
<intComma>25236501.35</intComma> <intComma>-1234</intComma>
<pluralize>two mouse</pluralize> <pluralize basedOnNumber="1">dog</pluralize>
<pluralize>goose</pluralize>
<latex>\\frac{<number>3</number>}{2}</latex></p>`);
        expect(props("integer")).toEqual([{ text: "3" }]);
        expect(props("intComma")).toEqual([
            { text: "25,236,501.35" },
            { text: "-1,234" },
        ]);
        expect(props("pluralize")).toEqual([
            { text: "two mice" },
            { text: "dog" },
            { text: "geese" },
        ]);
        expect(props("latex")).toEqual([{ text: "\\frac{ 3 }{2}" }]);
    });

    it("shows an asList's children separated by commas", async () => {
        const { all, children } = await open(
            `<p><asList><number>1</number> <number>2</number><text>c</text></asList></p>`,
        );
        expect(all("asList")).toEqual([]);
        expect(children(all("p")[0])).toEqual([
            "<number>1",
            ", ",
            "<number>2",
            ", ",
            "<text>c",
        ]);
    });

    it("draws a table's title from a prop", async () => {
        const { all, props } = await open(`<section>
<table><title>Data</title><tabular><row><cell>1</cell></row></tabular></table>
<table suppressTableNameInTitle><tabular><row><cell>2</cell></row></tabular></table>
</section>`);
        const [title] = all("title");
        const [table] = all("table");
        expect(props("table")).toEqual([
            {
                title: title.data.id,
                titlePrefix: "Table: ",
                codeNumber: "",
                divisionDepth: 2,
                divisionType: "table",
                xrefLabel: {
                    label: "Table",
                    global_ident: "",
                    local_ident: "",
                    preferred_form: "Global",
                },
            },
            expect.objectContaining({ title: null, titlePrefix: "" }),
        ]);
        expect(table.children).not.toContainEqual(
            expect.objectContaining({ id: title.data.id }),
        );
        expect(all("tabular")).toHaveLength(2);
    });

    it("draws an sbsGroup as a stack whose side-by-sides share its widths", async () => {
        const { all, props } = await open(`<sbsGroup widths="30% 70%">
<sideBySide><p>a</p><p>b</p></sideBySide>
<sideBySide widths="50% 50%"><p>c</p><p>d</p></sideBySide>
</sbsGroup>`);
        expect(all("sbsGroup")).toEqual([]);
        expect(all("stack")).toHaveLength(1);
        expect(props("sideBySide")).toEqual([
            { widths: [30, 70] },
            { widths: [50, 50] },
        ]);
    });

    it("draws the PreTeXt wrappers and leaves the axis labels out", async () => {
        const { all, root } = await open(`<pretext><article>
<p>x</p>
<graph><xLabel>t</xLabel><yLabel>y</yLabel><point>(1,2)</point></graph>
</article></pretext>`);
        expect(all("pretext")).toHaveLength(1);
        expect(all("article")).toHaveLength(1);
        expect(all("xLabel")).toEqual([]);
        expect(all("yLabel")).toEqual([]);
        const [graph] = all("graph");
        expect(
            graph.children
                .filter((c: any) => typeof c !== "string")
                .map((c: any) => (root.elements[c.id] as any).name),
        ).toEqual(["point"]);
    });
});

describe("random selections, sequences, reordering and list operators", () => {
    async function open(source: string) {
        const bridge = await load(source);
        const root = bridge.flatDast();
        const all = (name: string) => byName(root, name);
        const texts = () =>
            all("text").map((e) => (e.data as any).props.value as string);
        const send = (component: string, actionName: string, args: object) =>
            bridge.dispatch({
                component,
                actionName,
                componentIdx: all(component)[0].data.id,
                args,
            }).payload as Record<number, ElementUpdate>;
        return { bridge, all, texts, send };
    }

    it("draws computed lists of numbers as the text of their entries, without their operands", async () => {
        const { all, texts, send } = await open(`
<numberInput name="a" value="5"/>
<cumulativeSum>1 $a 2</cumulativeSum>
<cumulativeProduct>1 2 3</cumulativeProduct>
<cumulativeMin>3 1 4</cumulativeMin>
<cumulativeMax>3 1 4</cumulativeMax>
<differences>30 75 87</differences>
<sort>5 3 1</sort>
<sequence from="2" to="10" step="4"/>
<selectPrimeNumbers to="5" numToSelect="3" sort/>
<argMax>3 9 2</argMax> <indexOf target="2">3 9 2</indexOf>`);
        expect(texts()).toEqual([
            "1, 6, 8",
            "1, 2, 6",
            "3, 1, 1",
            "3, 3, 4",
            "45, 12",
            "1, 3, 5",
            "2, 6, 10",
            "2, 3, 5",
        ]);
        for (const e of all("text")) {
            expect(e.children).toEqual([]);
        }
        expect((all("argMax")[0].data as any).props).toEqual({
            latex: "2",
            renderMode: "inline",
        });
        expect((all("indexOf")[0].data as any).props.latex).toBe("3");

        const payload = send("numberInput", "updateValue", { value: 10 });
        expect(payload[all("text")[0].data.id]?.changedState).toEqual({
            value: "1, 11, 13",
        });
    });

    it("draws the numbers a sampler or a shuffle drew, the same on every load", async () => {
        const source = `<selectRandomNumbers type="discreteUniform" from="1" to="6" numToSelect="4"/>
<sampleRandomNumbers numSamples="2"/>
<samplePrimeNumbers numSamples="3"/>
<shuffle>1 2 3 4</shuffle>`;
        const first = (await open(source)).texts();
        expect(first).toHaveLength(4);
        const dice = first[0].split(", ").map(Number);
        expect(dice).toHaveLength(4);
        for (const x of dice) {
            expect(Number.isInteger(x) && x >= 1 && x <= 6).toBe(true);
        }
        expect(first[3].split(", ").map(Number).sort()).toEqual([1, 2, 3, 4]);
        expect((await open(source)).texts()).toEqual(first);
    });
});

describe("function operators and triangles", () => {
    async function open(source: string) {
        const bridge = await load(source);
        const root = bridge.flatDast();
        const all = (name: string) => byName(root, name);
        const send = (component: string, actionName: string, args: object) =>
            bridge.dispatch({
                component,
                actionName,
                componentIdx: all(component)[0].data.id,
                args,
            }).payload as Record<number, ElementUpdate>;
        return { bridge, all, send };
    }

    it("draws a clamped and a wrapped function as curves through their samples", async () => {
        const { all, send } = await open(`<graph xmin="-2" xmax="2">
<function name="f">x^3</function>
<clampFunction lowerValue="-3" upperValue="$n">$f</clampFunction>
<wrapFunctionPeriodic lowerValue="-2" upperValue="3">$f</wrapFunctionPeriodic>
</graph>
<numberInput name="n" value="5"/>`);
        const curves = all("polyline");
        expect(curves).toHaveLength(3);
        const [, clamped, wrapped] = curves.map(
            (e) => (e.data as any).props.numericalVertices,
        );
        expect(clamped).toHaveLength(200);
        expect(clamped[0]).toEqual([-2, -3]);
        expect(clamped[199]).toEqual([2, 5]);
        // -2 + mod(f(x) + 2, 5): 2 at x = -2, -2 at x = 2.
        expect(wrapped[0][0]).toBe(-2);
        expect(wrapped[0][1]).toBeCloseTo(2);
        expect(wrapped[199][1]).toBeCloseTo(-2);
        expect(curves[1].children).toEqual([]);

        // A bound that follows an input resamples the curve.
        const payload = send("numberInput", "updateValue", { value: 1 });
        const resampled = payload[curves[1].data.id]?.changedState as any;
        expect(resampled.numericalVertices[199]).toEqual([2, 1]);
    });

    it("draws a triangle as a polygon and moves its vertices", async () => {
        const { all, send } = await open(`<graph>
<triangle vertices="(1,1) (3,1)"/>
</graph>`);
        const [triangle] = all("triangle");
        expect((triangle.data as any).props).toEqual({
            numericalVertices: [
                [1, 1],
                [3, 1],
                [0, 0],
            ],
        });
        let payload = send("triangle", "movePolygon", {
            pointCoords: { 2: [2, 4] },
        });
        expect(payload[triangle.data.id]?.changedState).toEqual({
            numericalVertices: [
                [1, 1],
                [3, 1],
                [2, 4],
            ],
        });
        // A whole drag moves the three together.
        payload = send("triangle", "movePolygon", {
            pointCoords: { 0: [2, 2], 1: [4, 2], 2: [3, 5] },
        });
        expect(payload[triangle.data.id]?.changedState).toEqual({
            numericalVertices: [
                [2, 2],
                [4, 2],
                [3, 5],
            ],
        });
    });
});

describe("derived geometry", () => {
    async function open(source: string) {
        const bridge = await load(source);
        const root = bridge.flatDast();
        const all = (name: string) => byName(root, name);
        const send = (
            id: number,
            component: string,
            actionName: string,
            args: object,
        ) =>
            bridge.dispatch({ component, actionName, componentIdx: id, args })
                .payload as Record<number, ElementUpdate>;
        return { bridge, all, send };
    }
    const props = (e: { data: unknown }) => (e.data as any).props;
    const childIds = (children: unknown[]) =>
        children.flatMap((c) =>
            c !== null && typeof c === "object" && "id" in c
                ? [(c as { id: number }).id]
                : [],
        );

    it("draws a best-fit line as a line that follows its data and does not move", async () => {
        const { all, send } = await open(`<graph>
<point name="P1">(1,2)</point><point name="P2">(1,6)</point>
<point name="P3">(7,3)</point><point name="P4">(7,-1)</point>
<bestFitLine data="$P1 $P2 $P3 $P4"/>
</graph>`);
        const [fit] = all("line");
        // y = -0.5x + 4.5, through two of its points.
        const [[x1, y1], [x2, y2]] = props(fit).numericalPoints;
        expect(y1).toBeCloseTo(-0.5 * x1 + 4.5);
        expect(y2).toBeCloseTo(-0.5 * x2 + 4.5);
        expect(x1).not.toBeCloseTo(x2);
        expect(
            send(fit.data.id, "line", "moveLine", {
                point1coords: [0, 0],
                point2coords: [1, 1],
            }),
        ).toEqual({});
        // A data point moved refits it: through (1,-2), (1,6), (7,3) and
        // (7,-1), the line through the means at each x, (1, 2) and (7, 1).
        const [p1] = all("point");
        const payload = send(p1.data.id, "point", "move", { x: 1, y: -2 });
        const [[a, b], [c, d]] = (payload[fit.data.id]?.changedState as any)
            .numericalPoints;
        expect(b).toBeCloseTo((13 - a) / 6);
        expect(d).toBeCloseTo((13 - c) / 6);
    });

    it("draws an intersection as a point, left out while the lines do not cross", async () => {
        const { all, send } = await open(`<graph>
<point name="A">(0,0)</point>
<line name="l1" through="$A (1,1)"/>
<line name="l2" through="(0,2) (1,1)"/>
<intersection>$l1 $l2</intersection>
</graph>`);
        const [graph] = all("graph");
        const [a, crossing] = all("point");
        expect(props(crossing)).toEqual({
            x: { math_object: "1" },
            y: { math_object: "1" },
        });
        expect(childIds(graph.children)).toContain(crossing.data.id);
        // The same line: no crossing.
        let payload = send(a.data.id, "point", "move", { x: 0, y: 2 });
        expect(childIds(payload[graph.data.id].newChildren!)).not.toContain(
            crossing.data.id,
        );
        payload = send(a.data.id, "point", "move", { x: 0, y: 1 });
        expect(childIds(payload[graph.data.id].newChildren!)).toContain(
            crossing.data.id,
        );
        // It does not move.
        expect(send(crossing.data.id, "point", "move", { x: 5, y: 5 })).toEqual(
            {},
        );
    });

    it("draws a parabola as a curve through its samples", async () => {
        const { all } = await open(`<graph xmin="-2" xmax="2">
<parabola through="(1,2) (3,4)"/>
</graph>`);
        const [curve] = all("polyline");
        const vertices = props(curve).numericalVertices;
        expect(vertices).toHaveLength(200);
        // y = x² - 3x + 4.
        expect(vertices[0]).toEqual([-2, 14]);
        expect(vertices[199]).toEqual([2, 2]);
    });

    it("draws equilibrium points and lines and endpoints with their flags, and switches them", async () => {
        const { all, send } = await open(`<graph>
<equilibriumPoint switchable>(4,0)</equilibriumPoint>
<equilibriumPoint stable="false">(7,0)</equilibriumPoint>
<endpoint open>(1,0)</endpoint>
<equilibriumLine through="(0,1) (1,2)" switchAble/>
</graph>`);
        const [stable, unstable, end] = all("point");
        expect(props(stable)).toEqual({
            x: { math_object: "4" },
            y: { math_object: "0" },
            open: false,
            switchable: true,
        });
        expect(props(unstable)).toMatchObject({
            open: true,
            switchable: false,
        });
        expect(props(end)).toMatchObject({ open: true, switchable: false });
        const [line] = all("line");
        expect(props(line)).toEqual({
            numericalPoints: [
                [0, 1],
                [1, 2],
            ],
            dashed: false,
            switchable: true,
        });

        let payload = send(stable.data.id, "point", "switchPoint", {});
        expect(payload[stable.data.id]?.changedState).toEqual({ open: true });
        // Not switchable: nothing.
        expect(send(unstable.data.id, "point", "switchPoint", {})).toEqual({});
        expect(send(end.data.id, "point", "switchPoint", {})).toEqual({});
        payload = send(line.data.id, "line", "switchLine", {});
        expect(payload[line.data.id]?.changedState).toEqual({ dashed: true });
        // They move as a point and a line do.
        payload = send(stable.data.id, "point", "move", { x: 3, y: 1 });
        expect(payload[stable.data.id]?.changedState).toEqual({
            x: { math_object: "3" },
            y: { math_object: "1" },
        });
    });
});

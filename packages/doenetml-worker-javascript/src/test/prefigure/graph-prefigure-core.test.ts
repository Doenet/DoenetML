import { describe, expect, it } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import {
    getGraphRendererState,
    getPrefigureXML,
    getWarnings,
} from "./graph-prefigure.helpers";
import { nextAvailableConceptualAnnotationRef } from "../../utils/prefigure/annotations";
import {
    prefigureGraph,
    withStyleDefinitions,
} from "./graph-prefigure.fixtures";

describe("Graph prefigure renderer core @group4", () => {
    it("renderer=doenet leaves prefigureXML null", async () => {
        const { graphState } =
            await getGraphRendererState(`<graph name="g" />`);

        expect(graphState.renderer).eq("doenet");
        expect(graphState.effectiveRenderer).eq("doenet");
        expect(graphState.prefigureXML).eq(null);
    });

    it("renderer=prefigure emits prefigureXML payload", async () => {
        const { graphState, prefigureXML } = await getGraphRendererState(
            prefigureGraph(""),
        );

        expect(graphState.renderer).eq("prefigure");
        expect(graphState.effectiveRenderer).eq("prefigure");

        expect(typeof prefigureXML).eq("string");
        expect(prefigureXML).toContain("<diagram");
        expect(prefigureXML).toContain("dimensions=");
        expect(prefigureXML).toContain("<coordinates");
        expect(prefigureXML).toContain("bbox=");
        expect(prefigureXML).toContain("<axes");
    });

    it("renderer=prefigure empty graph has exact XML baseline", async () => {
        const prefigureXML = await getPrefigureXML(prefigureGraph(""));

        expect(prefigureXML).eq(
            `<diagram dimensions="(425,425)"><coordinates bbox="(-10,-10,10,10)"><axes axes="all" /></coordinates></diagram>`,
        );
    });

    it("renderer=prefigure xMin updates bbox with computed defaults", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph("", { attrs: 'xMin="0"' }),
        );

        expect(prefigureXML).eq(
            `<diagram dimensions="(425,425)"><coordinates bbox="(0,-10,10,10)"><axes axes="all" /></coordinates></diagram>`,
        );
    });

    it("renderer=prefigure size and aspectRatio control dimensions", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph("", { attrs: 'size="full" aspectRatio="2"' }),
        );

        expect(prefigureXML).eq(
            `<diagram dimensions="(850,425)"><coordinates bbox="(-10,-10,10,10)"><axes axes="all" /></coordinates></diagram>`,
        );
    });

    it("renderer=prefigure maps axis visibility to horizontal/vertical axes", async () => {
        const gxPrefigureXML = await getPrefigureXML(
            `
<graph name="gx" renderer="prefigure" displayXAxis="true" displayYAxis="false" />
<graph name="gy" renderer="prefigure" displayXAxis="false" displayYAxis="true" />
`,
            "gx",
        );
        const gyPrefigureXML = await getPrefigureXML(
            `
<graph name="gx" renderer="prefigure" displayXAxis="true" displayYAxis="false" />
<graph name="gy" renderer="prefigure" displayXAxis="false" displayYAxis="true" />
`,
            "gy",
        );

        expect(gxPrefigureXML).eq(
            `<diagram dimensions="(425,425)"><coordinates bbox="(-10,-10,10,10)"><axes axes="horizontal" /></coordinates></diagram>`,
        );
        expect(gyPrefigureXML).eq(
            `<diagram dimensions="(425,425)"><coordinates bbox="(-10,-10,10,10)"><axes axes="vertical" /></coordinates></diagram>`,
        );
    });

    it("renderer=prefigure with both axes hidden emits no axes element", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph("", {
                attrs: 'displayXAxis="false" displayYAxis="false"',
            }),
        );

        expect(prefigureXML).eq(
            `<diagram dimensions="(425,425)"><coordinates bbox="(-10,-10,10,10)"></coordinates></diagram>`,
        );
    });

    it("renderer=prefigure warns for unsupported graph axis label positions", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph("<xLabel>time</xLabel>\n  <yLabel>value</yLabel>", {
                attrs: 'xLabelPosition="left" yLabelPosition="bottom"',
            }),
        );

        expect(prefigureXML).toContain(`<axes axes="all">`);
        expect(prefigureXML).toContain(`<xlabel alignment="nw">time</xlabel>`);
        expect(prefigureXML).toContain(`<ylabel alignment="se">value</ylabel>`);

        const diagnosticsByType = await getWarnings(
            prefigureGraph(
                "<xLabel>time</xLabel>\n    <yLabel>value</yLabel>",
                { attrs: 'xLabelPosition="left" yLabelPosition="bottom"' },
            ),
        );
        expect(diagnosticsByType.errors.length).eq(0);
        expect(
            diagnosticsByType.warnings.some((x) =>
                x.message.includes(
                    'xLabelPosition="left" is not supported in prefigure renderer',
                ),
            ),
        ).eq(true);
        expect(
            diagnosticsByType.warnings.some((x) =>
                x.message.includes(
                    'yLabelPosition="bottom" is not supported in prefigure renderer',
                ),
            ),
        ).eq(true);
    });

    it("renderer=prefigure descendant warning includes position", async () => {
        const { core } = await createTestCore({
            doenetML: withStyleDefinitions(
                '        <styleDefinition styleNumber="7" markerStyle="triangleRight" markerColor="purple" />',
                prefigureGraph('<point styleNumber="7">(1,2)</point>'),
            ),
        });

        const diagnosticsByType = getDiagnosticsByType(core);
        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).toBeGreaterThan(0);

        const warningWithPosition = diagnosticsByType.warnings.find(
            (x) => x.position,
        );

        expect(warningWithPosition).toBeDefined();
        expect(warningWithPosition?.position).toBeDefined();
        expect(warningWithPosition?.position?.start?.line).toBeGreaterThan(0);
        expect(warningWithPosition?.position?.start?.column).toBeGreaterThan(0);
    });

    it("renderer=prefigure triangle marker warning has exact position", async () => {
        const { core } = await createTestCore({
            doenetML: withStyleDefinitions(
                '        <styleDefinition styleNumber="7" markerStyle="triangleRight" markerColor="purple" />',
                prefigureGraph('<point styleNumber="7">(1,2)</point>'),
            ),
        });

        const diagnosticsByType = getDiagnosticsByType(core);
        expect(diagnosticsByType.errors.length).eq(0);

        const triangleWarning = diagnosticsByType.warnings.find(
            (x) =>
                x.message.includes("marker style") &&
                x.message.includes("mapped to PreFigure style") &&
                x.message.includes("diamond"),
        );

        expect(triangleWarning).toBeDefined();
        expect(triangleWarning?.position).toBeDefined();
        expect(triangleWarning?.position?.start?.line).eq(7);
        expect(triangleWarning?.position?.start?.column).eq(1);
    });

    it("renderer=prefigure maps graph axis labels with latex to m tags", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                "<xLabel><m>x^2</m></xLabel>\n  <yLabel><m>y_1</m></yLabel>",
            ),
        );

        expect(prefigureXML).toContain(`<axes axes="all">`);
        expect(prefigureXML).toContain(`<xlabel alignment="nw"><m>`);
        expect(prefigureXML).toContain(`<ylabel alignment="se"><m>`);
        expect(prefigureXML).toContain(`x^2`);
        expect(prefigureXML).toContain(`y_1`);
    });

    it("renderer=prefigure axis labels snapshot", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                "<xLabel><m>x^2</m></xLabel>\n  <yLabel><m>y_1</m></yLabel>",
            ),
        );

        expect(prefigureXML).toMatchInlineSnapshot(
            `"<diagram dimensions="(425,425)"><coordinates bbox="(-10,-10,10,10)"><axes axes="all"><xlabel alignment="nw"><m>x^2</m></xlabel><ylabel alignment="se"><m>y_1</m></ylabel></axes></coordinates></diagram>"`,
        );
    });

    it("renderer=prefigure maps point marker style and marker attributes", async () => {
        const prefigureXML = await getPrefigureXML(
            withStyleDefinitions(
                '    <styleDefinition styleNumber="7" markerStyle="square" markerSize="6" markerColor="green" markerOpacity="0.4" lineWidth="3" />',
                prefigureGraph('<point styleNumber="7">(1,2)</point>'),
            ),
        );

        expect(prefigureXML).toContain(
            `p="(1,2)" style="box" size="6" fill="green" stroke="green" fill-opacity="0.4" stroke-opacity="0.4" thickness="3"`,
        );
    });

    it("renderer=prefigure maps endpoint and equilibriumPoint as points", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                "<endpoint>(1,2)</endpoint>\n  <equilibriumPoint>(3,4)</equilibriumPoint>",
            ),
        );

        expect(prefigureXML).toContain(`<point `);
        expect(prefigureXML).toContain(`at="endpoint_`);
        expect(prefigureXML).toContain(`at="equilibriumpoint_`);
        expect(prefigureXML).toContain(`p="(1,2)"`);
        expect(prefigureXML).toContain(`p="(3,4)"`);
    });

    it("renderer=prefigure open endpoint/equilibriumPoint are unfilled", async () => {
        const prefigureXML = await getPrefigureXML(
            withStyleDefinitions(
                '    <styleDefinition styleNumber="7" markerStyle="circle" markerColor="green" markerOpacity="0.4" lineWidth="3" />',
                prefigureGraph(
                    '<endpoint styleNumber="7" open="true">(1,2)</endpoint>\n  <equilibriumPoint styleNumber="7" stable="false">(3,4)</equilibriumPoint>',
                ),
            ),
        );

        expect(prefigureXML).toContain(
            `p="(1,2)" style="circle" size="5" stroke="green" stroke-opacity="0.4" thickness="3"`,
        );
        expect(prefigureXML).toContain(
            `p="(3,4)" style="circle" size="5" stroke="green" stroke-opacity="0.4" thickness="3"`,
        );
        expect(prefigureXML).not.toContain(
            `p="(1,2)" style="circle" size="5" fill="green"`,
        );
        expect(prefigureXML).not.toContain(
            `p="(3,4)" style="circle" size="5" fill="green"`,
        );
    });

    it("renderer=prefigure maps triangle marker styles to diamond with warning", async () => {
        const prefigureXML = await getPrefigureXML(
            withStyleDefinitions(
                '    <styleDefinition styleNumber="7" markerStyle="triangleRight" markerColor="purple" />',
                prefigureGraph('<point styleNumber="7">(1,2)</point>'),
            ),
        );

        expect(prefigureXML).toContain(`style="diamond"`);
        expect(prefigureXML).toContain(`p="(1,2)" style="diamond"`);
    });

    it("extended graph preserves point marker mapping in prefigure renderer", async () => {
        const prefigureXML = await getPrefigureXML(
            `
<setup>
    <styleDefinitions>
        <styleDefinition styleNumber="7" markerStyle="square" markerSize="16" markerColor="green" markerOpacity="0.4" lineWidth="3" />
    </styleDefinitions>
</setup>
<graph name="g">
    <point styleNumber="7">(1,2)</point>
</graph>
<graph name="gp" extend="$g" renderer="prefigure" />
`,
            "gp",
        );

        expect(prefigureXML).toContain(
            `p="(1,2)" style="box" size="16" fill="green" stroke="green" fill-opacity="0.4" stroke-opacity="0.4" thickness="3"`,
        );
    });

    it("renderer=prefigure maps point label and labelPosition", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<point labelPosition="upperLeft">(1,2)<label>A</label></point>',
            ),
        );

        expect(prefigureXML).toContain(`p="(1,2)"`);
        expect(prefigureXML).toContain(`alignment="nw"`);
        expect(prefigureXML).toContain(`>A</point>`);
    });

    it("renderer=prefigure maps point latex label to m tag", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<point labelPosition="top">(1,2)<label><m>x^2</m></label></point>',
            ),
        );

        expect(prefigureXML).toContain(`p="(1,2)"`);
        expect(prefigureXML).toContain(`alignment="n"`);
        expect(prefigureXML).toContain(`<m>`);
        expect(prefigureXML).toContain(`x^2`);
    });

    it("nested graph inherits prefigure renderer from parent", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="outer" renderer="prefigure">
  <graph name="inner" renderer="doenet">
    <point>(1,2)</point>
  </graph>
</graph>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        const outer =
            stateVariables[await resolvePathToNodeIdx("outer")].stateValues;
        const inner =
            stateVariables[await resolvePathToNodeIdx("inner")].stateValues;

        expect(outer.renderer).eq("prefigure");
        expect(outer.effectiveRenderer).eq("prefigure");
        expect(typeof outer.prefigureXML).eq("string");

        expect(inner.renderer).eq("doenet");
        expect(inner.effectiveRenderer).eq("prefigure");
        expect(inner.prefigureXML).eq(null);
    });

    it("emits authored annotations block for graph annotations child", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<point name="p">(1,2)</point>\n  <annotations><annotation ref="$p" text="point summary" /></annotations>',
            ),
        );

        const pointHandleMatch = prefigureXML.match(/<point at="([^"]+)"/);
        expect(pointHandleMatch).toBeTruthy();

        const pointHandle = pointHandleMatch?.[1];
        expect(prefigureXML).toContain(`<annotations>`);
        expect(prefigureXML).toContain(
            `<annotation ref="${pointHandle}" text="point summary"></annotation>`,
        );
    });

    it("serializes speech, sonify, and circular annotation attributes", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<point name="p">(1,2)</point>\n  <annotations><annotation text="group" circular><annotation ref="$p" text="point summary" speech="detailed speech" sonify /></annotation></annotations>',
            ),
        );

        const pointHandleMatch = prefigureXML.match(/<point at="([^"]+)"/);
        expect(pointHandleMatch).toBeTruthy();

        const pointHandle = pointHandleMatch?.[1];
        expect(prefigureXML).toContain(
            `<annotation ref="annotation_1" text="group" circular="yes">`,
        );
        expect(prefigureXML).toContain(
            `<annotation ref="${pointHandle}" text="point summary" speech="detailed speech" sonify="yes"></annotation>`,
        );
    });

    it("uses only the last annotations child under graph", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<annotations><annotation ref="$g" text="first" /></annotations>\n  <annotations><annotation ref="$g" text="second" /></annotations>',
            ),
        );

        expect(prefigureXML).toContain(`text="second"`);
        expect(prefigureXML).not.toContain(`text="first"`);

        const diagnosticsByType = await getWarnings(
            prefigureGraph(
                '<annotations><annotation ref="$g" text="first" /></annotations>\n  <annotations><annotation ref="$g" text="second" /></annotations>',
            ),
        );

        expect(
            diagnosticsByType.infos.some((x) =>
                x.message.includes("all but the last one are ignored"),
            ),
        ).eq(true);
    });

    it("preserves nested annotation order", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<point name="p1">(1,2)</point>\n  <point name="p2">(3,4)</point>\n  <annotations><annotation ref="$g" text="root"><annotation ref="$p1" text="first" /><annotation ref="$p2" text="second" /></annotation></annotations>',
            ),
        );

        const firstIndex = prefigureXML.indexOf('text="first"');
        const secondIndex = prefigureXML.indexOf('text="second"');
        expect(firstIndex).toBeGreaterThan(-1);
        expect(secondIndex).toBeGreaterThan(-1);
        expect(firstIndex).toBeLessThan(secondIndex);
    });

    it("missing or empty text emits empty text with warning", async () => {
        const doenetML = prefigureGraph(
            '<point name="p">(1,2)</point>\n  <annotations><annotation ref="$p" /></annotations>',
        );

        const prefigureXML = await getPrefigureXML(doenetML);
        expect(prefigureXML).toContain(`text=""`);

        const diagnosticsByType = await getWarnings(doenetML);
        expect(
            diagnosticsByType.warnings.some((x) =>
                x.message.includes("missing or empty `text`"),
            ),
        ).eq(true);
    });

    it("unresolved ref omits annotation and emits warning", async () => {
        const doenetML = prefigureGraph(
            '<annotations><annotation ref="$missing" text="bad" /></annotations>',
        );

        const prefigureXML = await getPrefigureXML(doenetML);
        expect(prefigureXML).not.toContain(`<annotations>`);

        const diagnosticsByType = await getWarnings(doenetML);
        expect(
            diagnosticsByType.warnings.some(
                (x) =>
                    x.message.includes("invalid `ref`") &&
                    x.message.includes("cannot resolve target"),
            ),
        ).eq(true);
    });

    it("ref outside graph subtree omits annotation and emits warning", async () => {
        const doenetML = `
<graph name="g" renderer="prefigure">
  <annotations><annotation ref="$outside" text="outside" /></annotations>
</graph>
<point name="outside">(4,5)</point>
`;

        const prefigureXML = await getPrefigureXML(doenetML);
        expect(prefigureXML).not.toContain(`<annotations>`);

        const diagnosticsByType = await getWarnings(doenetML);
        expect(
            diagnosticsByType.warnings.some((x) =>
                x.message.includes("outside the containing graph"),
            ),
        ).eq(true);
    });

    it("ref to unsupported graph child omits annotation and emits warning", async () => {
        const doenetML = prefigureGraph(
            '<textInput name="ti" />\n  <annotations><annotation ref="$ti" text="input summary" /></annotations>',
        );

        const prefigureXML = await getPrefigureXML(doenetML);
        expect(prefigureXML).not.toContain(`<annotations>`);

        const diagnosticsByType = await getWarnings(doenetML);
        expect(
            diagnosticsByType.warnings.some((x) =>
                x.message.includes(
                    "not a supported graphical object in prefigure conversion",
                ),
            ),
        ).eq(true);
    });

    it("ref to graph emits figure ref", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<annotations><annotation ref="$g" text="overall figure" /></annotations>',
            ),
        );

        expect(prefigureXML).toContain(`ref="figure"`);
    });

    it("raw string ref falls back to conceptual ref and emits invalid attribute warning", async () => {
        const doenetML = prefigureGraph(
            '<annotations><annotation ref="hello" text="string ref" /></annotations>',
        );

        const prefigureXML = await getPrefigureXML(doenetML);
        expect(prefigureXML).toContain(`ref="annotation_1"`);
        expect(prefigureXML).toContain(`text="string ref"`);

        const diagnosticsByType = await getWarnings(doenetML);
        expect(
            diagnosticsByType.warnings.some((x) =>
                x.message.includes("must be composed of references"),
            ),
        ).eq(true);
    });

    it("missing ref auto-generates conceptual refs in order", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph(
                '<annotations><annotation text="first" /><annotation text="second" /></annotations>',
            ),
        );

        expect(prefigureXML).toContain(`ref="annotation_1"`);
        expect(prefigureXML).toContain(`ref="annotation_2"`);
    });

    it("multiple ref tokens uses first resolved target with warning", async () => {
        const doenetML = prefigureGraph(
            '<point name="p1">(1,2)</point>\n  <point name="p2">(3,4)</point>\n  <annotations><annotation ref="$p1 $p2" text="multi" /></annotations>',
        );

        const prefigureXML = await getPrefigureXML(doenetML);
        const pointHandleMatch = prefigureXML.match(/<point at="([^"]+)"/);
        expect(pointHandleMatch).toBeTruthy();
        expect(prefigureXML).toContain(`ref="${pointHandleMatch?.[1]}"`);

        const diagnosticsByType = await getWarnings(doenetML);
        expect(
            diagnosticsByType.warnings.some((x) =>
                x.message.includes("resolved to multiple targets"),
            ),
        ).eq(true);
    });

    it("keeps valid annotation siblings when one sibling ref is invalid", async () => {
        const doenetML = prefigureGraph(
            '<point name="p">(1,2)</point>\n  <annotations><annotation ref="$p" text="valid" /><annotation ref="$missing" text="bad" /></annotations>',
        );

        const prefigureXML = await getPrefigureXML(doenetML);
        const pointHandleMatch = prefigureXML.match(/<point at="([^"]+)"/);
        expect(pointHandleMatch).toBeTruthy();

        expect(prefigureXML).toContain(`<annotations>`);
        expect(prefigureXML).toContain(
            `<annotation ref="${pointHandleMatch?.[1]}" text="valid"></annotation>`,
        );
        expect(prefigureXML).not.toContain(`text="bad"`);

        const diagnosticsByType = await getWarnings(doenetML);
        expect(
            diagnosticsByType.warnings.some(
                (x) =>
                    x.message.includes("invalid `ref`") &&
                    x.message.includes("cannot resolve target"),
            ),
        ).eq(true);
    });

    it("conceptual ref generation skips collisions", () => {
        const usedRefs = new Set(["annotation_1", "line-a"]);
        const { ref, nextCounter } = nextAvailableConceptualAnnotationRef({
            initialCounter: 1,
            usedRefs,
        });

        expect(ref).eq("annotation_2");
        expect(nextCounter).eq(3);
    });

    it("annotations on non-prefigure graph emit info and are not rendered", async () => {
        const doenetML =
            '<graph name="g"><point name="p">(1,2)</point><annotations><annotation ref="$p" text="point summary" /></annotations></graph>';

        const { prefigureXML } = await getGraphRendererState(doenetML);
        expect(prefigureXML).eq(null);

        const diagnosticsByType = await getWarnings(doenetML);
        expect(
            diagnosticsByType.infos.some((x) =>
                x.message.includes("annotations will not be rendered"),
            ),
        ).eq(true);
    });

    describe("hidden descendants", () => {
        it("hidden point is excluded from prefigure XML", async () => {
            const prefigureXML = await getPrefigureXML(
                prefigureGraph('<point hide="true">(1,2)</point>'),
            );

            expect(prefigureXML).not.toContain(`<point `);
            expect(prefigureXML).not.toContain(`p="(1,2)"`);
        });

        it("hidden line is excluded from prefigure XML", async () => {
            const prefigureXML = await getPrefigureXML(
                prefigureGraph('<line hide="true" through="(0,0) (1,1)" />'),
            );

            expect(prefigureXML).not.toContain(`<line `);
        });

        it("visible point is included while hidden point is excluded", async () => {
            const prefigureXML = await getPrefigureXML(
                prefigureGraph(
                    '<point name="p1">(1,2)</point>\n  <point name="p2" hide="true">(3,4)</point>',
                ),
            );

            expect(prefigureXML).toContain(`p="(1,2)"`);
            expect(prefigureXML).not.toContain(`p="(3,4)"`);
        });

        it("hiding one of two points does not affect handle of the visible point", async () => {
            const prefigureXML = await getPrefigureXML(
                prefigureGraph(
                    '<point name="p1">(1,2)</point>\n  <point name="p2" hide="true">(3,4)</point>',
                ),
            );

            expect(prefigureXML).toContain(`at="point_`);
            const matches = prefigureXML?.match(/at="point_(\d+)"/g) ?? [];
            expect(matches.length).eq(1);
        });

        it("hidden component referenced by annotation produces target-not-found warning", async () => {
            const doenetML = prefigureGraph(
                '<point name="p" hide="true">(1,2)</point>\n  <annotations><annotation ref="$p" text="hidden point" /></annotations>',
            );

            const prefigureXML = await getPrefigureXML(doenetML);
            expect(prefigureXML).not.toContain(`p="(1,2)"`);

            const diagnosticsByType = await getWarnings(doenetML);
            expect(
                diagnosticsByType.warnings.some((x) =>
                    x.message.includes(
                        "target is not a supported graphical object",
                    ),
                ),
            ).eq(true);
        });
    });
});

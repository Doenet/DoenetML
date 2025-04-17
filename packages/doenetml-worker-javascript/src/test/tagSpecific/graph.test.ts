import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    submitAnswer,
    updateBooleanInputValue,
    updateMathInputValue,
    updateSelectedIndices,
    updateTextInputValue,
    updateValue,
} from "../utils/actions";
import { widthsBySize } from "@doenet/utils";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Graph tag tests", async () => {
    it("functions adapted to curves in graph", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g">
      <function>x^2</function>
      <function variables="t" styleNumber="2"><label>g</label>t^3</function>
    </graph>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let curve1Name = stateVariables["/g"].activeChildren[0].componentIdx;
        let curve2Name = stateVariables["/g"].activeChildren[1].componentIdx;

        let f1 = stateVariables[curve1Name].stateValues.fs[0];
        let f2 = stateVariables[curve2Name].stateValues.fs[0];

        expect(f1(-2)).eq(4);
        expect(f1(3)).eq(9);
        expect(f2(-2)).eq(-8);
        expect(f2(3)).eq(27);
        expect(stateVariables[curve1Name].componentType).eq("curve");
        expect(stateVariables[curve2Name].componentType).eq("curve");
        expect(stateVariables[curve1Name].stateValues.label).eq("");
        expect(stateVariables[curve2Name].stateValues.label).eq("g");
        expect(stateVariables[curve1Name].stateValues.styleNumber).eq(1);
        expect(stateVariables[curve2Name].stateValues.styleNumber).eq(2);
    });

    it("labels and positioning", async () => {
        let core = await createTestCore({
            doenetML: `
    <text>a</text>

    <graph name="g" xlabelPosition="$xlabelpos" ylabelPosition="$ylabelpos" ylabelAlignment="$ylabelalign">
    <xlabel>$xlabel</xlabel><ylabel>$ylabel</ylabel>
    </graph>

    <tabular>
      <row>
        <cell>xlabel: <textInput name="xlabel" prefill="x" /></cell>
        <cell>position: 
        <choiceInput inline preselectChoice="2" name="xlabelpos">
          <choice>left</choice>
          <choice>right</choice>
        </choiceInput></cell>
      </row>
      <row>
        <cell>ylabel: <textInput name="ylabel" prefill="y" /></cell>
        <cell>position:
        <choiceInput inline preselectChoice="1" name="ylabelpos">
          <choice>top</choice>
          <choice>bottom</choice>
        </choiceInput>
        </cell>
        <cell>alignment:
        <choiceInput inline preselectChoice="1" name="ylabelalign">
          <choice>left</choice>
          <choice>right</choice>
        </choiceInput>
        </cell>
      </row>
    </tabular>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g"].stateValues.xlabel).eq("x");
        expect(stateVariables["/g"].stateValues.xlabelPosition).eq("right");
        expect(stateVariables["/g"].stateValues.ylabel).eq("y");
        expect(stateVariables["/g"].stateValues.ylabelPosition).eq("top");
        expect(stateVariables["/g"].stateValues.ylabelAlignment).eq("left");

        await updateTextInputValue({
            text: "hello",
            name: "/xlabel",
            core,
        });
        await updateTextInputValue({
            text: "bye",
            name: "/ylabel",
            core,
        });

        await updateSelectedIndices({
            name: "/xlabelpos",
            selectedIndices: [1],
            core,
        });
        await updateSelectedIndices({
            name: "/ylabelpos",
            selectedIndices: [2],
            core,
        });
        await updateSelectedIndices({
            name: "/ylabelalign",
            selectedIndices: [2],
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g"].stateValues.xlabel).eq("hello");
        expect(stateVariables["/g"].stateValues.xlabelPosition).eq("left");
        expect(stateVariables["/g"].stateValues.ylabel).eq("bye");
        expect(stateVariables["/g"].stateValues.ylabelPosition).eq("bottom");
        expect(stateVariables["/g"].stateValues.ylabelAlignment).eq("right");
    });

    it("change essential xlabel and ylabel", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g" />
    <p><updateValue name="uvx" target="g.xlabel" type="text" newValue="s" ><label>Change x-label</label></updateValue></p>
    <p><updateValue name="uvy" target="g.ylabel" type="text" newValue="t" ><label>Change y-label</label></updateValue></p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g"].stateValues.xlabel).eq("");
        expect(stateVariables["/g"].stateValues.ylabel).eq("");

        await updateValue({ name: "/uvx", core });
        await updateValue({ name: "/uvy", core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g"].stateValues.xlabel).eq("s");
        expect(stateVariables["/g"].stateValues.ylabel).eq("t");
    });

    it("identical axis scales, with given aspect ratio", async () => {
        type AxisLimits = {
            xmin: number;
            xmax: number;
            ymin: number;
            ymax: number;
        };

        async function checkLimits(
            core: PublicDoenetMLCore,
            { xmin, xmax, ymin, ymax }: AxisLimits,
        ) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/g"].stateValues.xmin).eq(xmin);
            expect(stateVariables["/g"].stateValues.xmax).eq(xmax);
            expect(stateVariables["/g"].stateValues.ymin).eq(ymin);
            expect(stateVariables["/g"].stateValues.ymax).eq(ymax);
        }

        async function test_case({
            specified_limits,
            ratio1,
            ratio2,
            ratio05,
        }: {
            specified_limits: string;
            ratio1: AxisLimits;
            ratio2: AxisLimits;
            ratio05: AxisLimits;
        }) {
            const doenetML = `
    <p>Aspect ratio: <mathInput name="aspectRatio" prefill="1" /></p>
    <graph name="g" identicalAxisScales aspectRatio="$aspectRatio" ${specified_limits} />
    `;

            const core = await createTestCore({ doenetML });

            await checkLimits(core, ratio1);

            await updateMathInputValue({
                latex: "2",
                name: "/aspectRatio",
                core,
            });
            await checkLimits(core, ratio2);

            await updateMathInputValue({
                latex: "1/2",
                name: "/aspectRatio",
                core,
            });
            await checkLimits(core, ratio05);
        }

        let cases = [
            {
                specified_limits: ``,
                ratio1: { xmin: -10, xmax: 10, ymin: -10, ymax: 10 },
                ratio2: { xmin: -10, xmax: 10, ymin: -5, ymax: 5 },
                ratio05: { xmin: -10, xmax: 10, ymin: -20, ymax: 20 },
            },
            {
                specified_limits: `xmin="-5"`,
                ratio1: { xmin: -5, xmax: 15, ymin: -10, ymax: 10 },
                ratio2: { xmin: -5, xmax: 15, ymin: -5, ymax: 5 },
                ratio05: { xmin: -5, xmax: 15, ymin: -20, ymax: 20 },
            },
            {
                specified_limits: `xmax="5"`,
                ratio1: { xmin: -15, xmax: 5, ymin: -10, ymax: 10 },
                ratio2: { xmin: -15, xmax: 5, ymin: -5, ymax: 5 },
                ratio05: { xmin: -15, xmax: 5, ymin: -20, ymax: 20 },
            },
            {
                specified_limits: `ymin="-5"`,
                ratio1: { xmin: -10, xmax: 10, ymin: -5, ymax: 15 },
                ratio2: { xmin: -10, xmax: 10, ymin: -5, ymax: 5 },
                ratio05: { xmin: -10, xmax: 10, ymin: -5, ymax: 35 },
            },
            {
                specified_limits: `ymax="5"`,
                ratio1: { xmin: -10, xmax: 10, ymin: -15, ymax: 5 },
                ratio2: { xmin: -10, xmax: 10, ymin: -5, ymax: 5 },
                ratio05: { xmin: -10, xmax: 10, ymin: -35, ymax: 5 },
            },
            {
                specified_limits: `xmin="-20" xmax="40"`,
                ratio1: { xmin: -20, xmax: 40, ymin: -30, ymax: 30 },
                ratio2: { xmin: -20, xmax: 40, ymin: -15, ymax: 15 },
                ratio05: { xmin: -20, xmax: 40, ymin: -60, ymax: 60 },
            },
            {
                specified_limits: `ymin="-20" ymax="40"`,
                ratio1: { xmin: -30, xmax: 30, ymin: -20, ymax: 40 },
                ratio2: { xmin: -60, xmax: 60, ymin: -20, ymax: 40 },
                ratio05: { xmin: -15, xmax: 15, ymin: -20, ymax: 40 },
            },
            {
                // all specified
                specified_limits: `xmin="-50" xmax="30" ymin="-20" ymax="40"`,
                ratio1: { xmin: -50, xmax: 30, ymin: -20, ymax: 60 },
                ratio2: { xmin: -50, xmax: 70, ymin: -20, ymax: 40 },
                ratio05: { xmin: -50, xmax: 30, ymin: -20, ymax: 140 },
            },
            {
                // leave out xmin
                specified_limits: `xmax="30" ymin="-20" ymax="40"`,
                ratio1: { xmin: -30, xmax: 30, ymin: -20, ymax: 40 },
                ratio2: { xmin: -90, xmax: 30, ymin: -20, ymax: 40 },
                ratio05: { xmin: 0, xmax: 30, ymin: -20, ymax: 40 },
            },
            {
                // leave out xmax
                specified_limits: `xmin="-30" ymin="-20" ymax="40"`,
                ratio1: { xmin: -30, xmax: 30, ymin: -20, ymax: 40 },
                ratio2: { xmin: -30, xmax: 90, ymin: -20, ymax: 40 },
                ratio05: { xmin: -30, xmax: 0, ymin: -20, ymax: 40 },
            },
            {
                // leave out ymin
                specified_limits: `xmin="-50" xmax="30" ymax="40"`,
                ratio1: { xmin: -50, xmax: 30, ymin: -40, ymax: 40 },
                ratio2: { xmin: -50, xmax: 30, ymin: 0, ymax: 40 },
                ratio05: { xmin: -50, xmax: 30, ymin: -120, ymax: 40 },
            },
            {
                // leave out ymax
                specified_limits: `xmin="-50" xmax="30" ymin="-40"`,
                ratio1: { xmin: -50, xmax: 30, ymin: -40, ymax: 40 },
                ratio2: { xmin: -50, xmax: 30, ymin: -40, ymax: 0 },
                ratio05: { xmin: -50, xmax: 30, ymin: -40, ymax: 120 },
            },
        ];

        for (let c of cases) {
            await test_case(c);
        }
    });

    it("identical axis scales, without given aspect ratio", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g" identicalAxisScales />

    <p>xmin: $g.xmin{assignNames="xmin"}</p>
    <p>xmax: $g.xmax{assignNames="xmax"}</p>
    <p>ymin: $g.ymin{assignNames="ymin"}</p>
    <p>ymax: $g.ymax{assignNames="ymax"}</p>

    <p>Change xmin: <mathinput name="xminInput" bindValueTo="$g.xmin" /></p>
    <p>Change xmax: <mathinput name="xmaxInput" bindValueTo="$g.xmax" /></p>
    <p>Change ymin: <mathinput name="yminInput" bindValueTo="$g.ymin" /></p>
    <p>Change ymax: <mathinput name="ymaxInput" bindValueTo="$g.ymax" /></p>

    `,
        });

        async function checkLimits(xmin, xmax, ymin, ymax) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/g"].stateValues.xmin).eq(xmin);
            expect(stateVariables["/g"].stateValues.xmax).eq(xmax);
            expect(stateVariables["/g"].stateValues.ymin).eq(ymin);
            expect(stateVariables["/g"].stateValues.ymax).eq(ymax);

            expect(stateVariables["/g"].stateValues.aspectRatio).eq(
                (xmax - xmin) / (ymax - ymin),
            );
        }

        await checkLimits(-10, 10, -10, 10);

        // set xmin to -5
        await updateMathInputValue({
            latex: "-5",
            name: "/xminInput",
            core,
        });
        await checkLimits(-5, 10, -10, 10);

        // set ymax to 0
        await updateMathInputValue({
            latex: "0",
            name: "/ymaxInput",
            core,
        });
        await checkLimits(-5, 10, -10, 0);
    });

    it("show grid", async () => {
        let core = await createTestCore({
            doenetML: `

    <graph name="g1"/>
    <p>Graph 1 has grid: $g1.grid{assignNames="sg1"}</p>

    <graph name="g2" grid="none"/>
    <p>Graph 2 has grid: $g2.grid{assignNames="sg2"}</p>

    <graph name="g3" grid/>
    <p>Graph 3 has grid: $g3.grid{assignNames="sg3"}</p>

    <graph name="g4" grid="medium"/>
    <p>Graph 4 has grid: $g4.grid{assignNames="sg4"}</p>

    <graph name="g5" grid="dense"/>
    <p>Graph 5 has grid: $g5.grid{assignNames="sg5"}</p>


    <p>Show grid: <booleanInput name="bi" /></p>
    <graph name="g6" grid="$bi"/>
    <p>Graph 6 has grid: $g6.grid{assignNames="sg6"}</p>


    <p>Show grid: <textInput name="ti" /></p>
    <graph name="g7" grid="$ti"/>
    <p>Graph 7 has grid: $g7.grid{assignNames="sg7"}</p>

    `,
        });

        // not sure what to test as don't know how to check renderer...

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/sg1"].stateValues.value).eq("none");
        expect(stateVariables["/sg2"].stateValues.value).eq("none");
        expect(stateVariables["/sg3"].stateValues.value).eq("medium");
        expect(stateVariables["/sg4"].stateValues.value).eq("medium");
        expect(stateVariables["/sg5"].stateValues.value).eq("dense");
        expect(stateVariables["/sg6"].stateValues.value).eq("none");
        expect(stateVariables["/sg7"].stateValues.value).eq("none");

        await updateBooleanInputValue({
            boolean: true,
            name: "/bi",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/sg6"].stateValues.value).eq("medium");

        await updateTextInputValue({
            text: "true",
            name: "/ti",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/sg7"].stateValues.value).eq("medium");

        await updateTextInputValue({
            text: "false",
            name: "/ti",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/sg7"].stateValues.value).eq("none");

        await updateTextInputValue({
            text: "dense",
            name: "/ti",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/sg7"].stateValues.value).eq("dense");

        await updateTextInputValue({
            text: "hello",
            name: "/ti",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/sg7"].stateValues.value).eq("none");

        await updateTextInputValue({
            text: "medium",
            name: "/ti",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/sg7"].stateValues.value).eq("medium");

        await updateTextInputValue({
            text: "none",
            name: "/ti",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/sg7"].stateValues.value).eq("none");
    });

    it("fixed grids", async () => {
        let core = await createTestCore({
            doenetML: `

    <graph name="g1" grid="1 pi/2" displayDigits="4" />
    <p>Graph 1 has grid: $g1.grid{assignNames="sg1"}</p>

    <p>grid x: <mathInput name="g2x" /></p>
    <p>grid y: <mathInput name="g2y" /></p>
    <graph name="g2" grid="$g2x $g2y" />
    <p>Graph 2 has grid: $g2.grid{assignNames="sg2"}</p>

    <p>grid x: <mathInput name="g3x" /> <number name="g3xa" hide>$g3x</number></p>
    <p>grid y: <mathInput name="g3y" /> <number name="g3ya" hide>$g3y</number></p>
    <graph name="g3" grid="$g3xa $g3ya" />
    <p>Graph 3 has grid: $g3.grid{assignNames="sg3"}</p>

    <p>grid x: <mathInput name="g4x" prefill="1" /></p>
    <p>grid y: <mathInput name="g4y" prefill="1" /></p>
    <graph name="g4" grid="2$g4x 3$g4y" displayDecimals="2" />
    <p>Graph 4 has grid: $g4.grid{assignNames="sg4"}</p>

    <p>grid x: <mathInput name="g5x" prefill="1" /> <number name="g5xa">$g5x</number></p>
    <p>grid y: <mathInput name="g5y" prefill="1" /> <number name="g5ya">$g5y</number></p>
    <graph name="g5" grid="2$g5xa 3$g5ya" displayDecimals="2" />
    <p>Graph 5 has grid: $g5.grid{assignNames="sg5"}</p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/sg1"].stateValues.numbers).eqls([
            1,
            Math.PI / 2,
        ]);
        expect(stateVariables["/sg2"].stateValues.value).eq("none");
        expect(stateVariables["/sg3"].stateValues.value).eq("none");
        expect(stateVariables["/sg4"].stateValues.numbers).eqls([2, 3]);
        expect(stateVariables["/sg5"].stateValues.numbers).eqls([2, 3]);

        await updateMathInputValue({ latex: "3", name: "/g2x", core });
        await updateMathInputValue({
            latex: "1.5",
            name: "/g2y",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/sg2"].stateValues.numbers).eqls([3, 1.5]);

        await updateMathInputValue({ latex: "3", name: "/g3x", core });
        await updateMathInputValue({
            latex: "1.5",
            name: "/g3y",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/sg3"].stateValues.numbers).eqls([3, 1.5]);

        await updateMathInputValue({ latex: "3", name: "/g4x", core });
        await updateMathInputValue({
            latex: "1.5",
            name: "/g4y",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/sg4"].stateValues.numbers).eqls([
            3 * 2,
            1.5 * 3,
        ]);

        await updateMathInputValue({ latex: "3", name: "/g5x", core });
        await updateMathInputValue({
            latex: "1.5",
            name: "/g5y",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/sg5"].stateValues.numbers).eqls([
            3 * 2,
            1.5 * 3,
        ]);

        await updateMathInputValue({
            latex: "3e/2",
            name: "/g2x",
            core,
        });
        await updateMathInputValue({
            latex: "1.5\\pi",
            name: "/g2y",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/sg2"].stateValues.numbers).eqls([
            (3 * Math.E) / 2,
            1.5 * Math.PI,
        ]);

        await updateMathInputValue({
            latex: "3e/2",
            name: "/g3x",
            core,
        });
        await updateMathInputValue({
            latex: "1.5\\pi",
            name: "/g3y",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/sg3"].stateValues.numbers).eqls([
            (3 * Math.E) / 2,
            1.5 * Math.PI,
        ]);

        await updateMathInputValue({
            latex: "3\\pi/5",
            name: "/g4x",
            core,
        });
        await updateMathInputValue({
            latex: "1.5e/6",
            name: "/g4y",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/sg4"].stateValues.numbers).eqls([
            ((3 * Math.PI) / 5) * 2,
            ((1.5 * Math.E) / 6) * 3,
        ]);

        await updateMathInputValue({
            latex: "3\\pi/5",
            name: "/g5x",
            core,
        });
        await updateMathInputValue({
            latex: "1.5e/6",
            name: "/g5y",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/sg5"].stateValues.numbers).eqls([
            ((3 * Math.PI) / 5) * 2,
            ((1.5 * Math.E) / 6) * 3,
        ]);
    });

    it("correctly shadow references to number list grid", async () => {
        let core = await createTestCore({
            doenetML: `
    <section name="sec">
        <graph grid="1 2" name="g" />

        <p>Grid: $g.grid{name="cgr" assignNames="gr"}</p>
        <p>Grid2: $cgr{assignNames="gr2a gr2b"}</p>
        <p>Grid3: $gr{name="gr3"}</p>
    </section>

    <section copySource="sec" name="sec2" newNamespace />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/gr"].stateValues.numbers).eqls([1, 2]);
        expect(stateVariables["/gr2a"].stateValues.value).eq(1);
        expect(stateVariables["/gr2b"].stateValues.value).eq(2);
        expect(stateVariables["/gr3"].stateValues.numbers).eqls([1, 2]);
        expect(stateVariables["/sec2/gr"].stateValues.numbers).eqls([1, 2]);
        expect(stateVariables["/sec2/gr2a"].stateValues.value).eq(1);
        expect(stateVariables["/sec2/gr2b"].stateValues.value).eq(2);
        expect(stateVariables["/sec2/gr3"].stateValues.numbers).eqls([1, 2]);
    });

    // check for bug in placeholder adapter
    it("graph with label as submitted response, createComponentOfType specified", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="graph1">
      <xlabel>$(x.submittedResponse{ createComponentOfType='math'})</xlabel>
      <ylabel>y</ylabel>
    </graph>

    <answer name="x">x</answer>
    `,
        });

        // not sure what to test as don't know how to check renderer...
        // but main thing is that don't have an error

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/graph1"].stateValues.xlabel).eq("\\(\uff3f\\)");

        let mathinputName =
            stateVariables["/x"].stateValues.inputChildren[0].componentIdx;

        await updateMathInputValue({
            latex: "x",
            name: mathinputName,
            core,
        });
        await submitAnswer({ name: "/x", core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/graph1"].stateValues.xlabel).eq("\\(x\\)");
    });

    it("display tick labels", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g" displayXAxisTickLabels="$b1" displayYAxisTickLabels="$b2"/>
    <booleanInput name="b1" />
    <booleanInput name="b2" prefill="true" />


    `,
        });

        // not sure what to test as don't know how to check renderer...
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g"].stateValues.displayXAxisTickLabels).eq(
            false,
        );
        expect(stateVariables["/g"].stateValues.displayYAxisTickLabels).eq(
            true,
        );

        await updateBooleanInputValue({
            boolean: true,
            name: "/b1",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g"].stateValues.displayXAxisTickLabels).eq(
            true,
        );
        expect(stateVariables["/g"].stateValues.displayYAxisTickLabels).eq(
            true,
        );

        await updateBooleanInputValue({
            boolean: false,
            name: "/b2",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g"].stateValues.displayXAxisTickLabels).eq(
            true,
        );
        expect(stateVariables["/g"].stateValues.displayYAxisTickLabels).eq(
            false,
        );

        await updateBooleanInputValue({
            boolean: false,
            name: "/b1",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g"].stateValues.displayXAxisTickLabels).eq(
            false,
        );
        expect(stateVariables["/g"].stateValues.displayYAxisTickLabels).eq(
            false,
        );

        await updateBooleanInputValue({
            boolean: true,
            name: "/b2",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g"].stateValues.displayXAxisTickLabels).eq(
            false,
        );
        expect(stateVariables["/g"].stateValues.displayYAxisTickLabels).eq(
            true,
        );
    });

    it("graph sizes", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g" />

    <graph name="gtiny" size="tiny" />
    <graph name="gsmall" size="small" />
    <graph name="gmedium" size="medium" />
    <graph name="glarge" size="large" />
    <graph name="gfull" size="full" />
    <graph name="ginvalid" size="invalid" />

    <graph name="ga10" width="10" />
    <graph name="ga100" width="100" />
    <graph name="ga200" width="200" />
    <graph name="ga300" width="300" />
    <graph name="ga400" width="400" />
    <graph name="ga500" width="500" />
    <graph name="ga600" width="600" />
    <graph name="ga700" width="700" />
    <graph name="ga800" width="800" />
    <graph name="ga900" width="900" />
    <graph name="ga10000" width="10000" />

    <graph name="gp1" width="1%" />
    <graph name="gp10" width="10%" />
    <graph name="gp20" width="20%" />
    <graph name="gp30" width="30%" />
    <graph name="gp40" width="40%" />
    <graph name="gp50" width="50%" />
    <graph name="gp60" width="60%" />
    <graph name="gp70" width="70%" />
    <graph name="gp80" width="80%" />
    <graph name="gp90" width="90%" />
    <graph name="gp100" width="100%" />
    <graph name="gp1000" width="1000%" />

    <graph name="gbadwidth" width="bad" />

    `,
        });

        let expectedSizes = {
            g: "medium",
            gtiny: "tiny",
            gsmall: "small",
            gmedium: "medium",
            glarge: "large",
            gfull: "full",
            ginvalid: "medium",
            ga10: "tiny",
            ga100: "tiny",
            ga200: "small",
            ga300: "small",
            ga400: "medium",
            ga500: "medium",
            ga600: "large",
            ga700: "large",
            ga800: "full",
            ga900: "full",
            ga10000: "full",
            gp1: "tiny",
            gp10: "tiny",
            gp20: "small",
            gp30: "small",
            gp40: "small",
            gp50: "medium",
            gp60: "medium",
            gp70: "large",
            gp80: "large",
            gp90: "full",
            gp100: "full",
            gp1000: "full",
            gbadwidth: "medium",
        };

        let stateVariables = await core.returnAllStateVariables(false, true);
        for (let name in expectedSizes) {
            expect(stateVariables["/" + name].stateValues.size).eq(
                expectedSizes[name],
            );
            expect(stateVariables["/" + name].stateValues.width.size).eq(
                widthsBySize[expectedSizes[name]],
            );
        }
    });

    it("horizontal align", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g" />
    <graph name="gleft" horizontalAlign="left" />
    <graph name="gright" horizontalAlign="right" />
    <graph name="gcenter" horizontalAlign="center" />
    <graph name="ginvalid" horizontalAlign="invalid" />

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g"].stateValues.horizontalAlign).eq("center");
        expect(stateVariables["/gleft"].stateValues.horizontalAlign).eq("left");
        expect(stateVariables["/gright"].stateValues.horizontalAlign).eq(
            "right",
        );
        expect(stateVariables["/gcenter"].stateValues.horizontalAlign).eq(
            "center",
        );
        expect(stateVariables["/ginvalid"].stateValues.horizontalAlign).eq(
            "center",
        );
    });

    it("displayMode", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g" />
    <graph name="ginline" displayMode="inline" />
    <graph name="gblock" displayMode="block" />
    <graph name="ginvalid" displayMode="invalid" />

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g"].stateValues.displayMode).eq("block");
        expect(stateVariables["/ginline"].stateValues.displayMode).eq("inline");
        expect(stateVariables["/gblock"].stateValues.displayMode).eq("block");
        expect(stateVariables["/ginvalid"].stateValues.displayMode).eq("block");
    });

    it("display axes", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g" displayXAxis="$b1" displayYAxis="$b2"/>
    <booleanInput name="b1" />
    <booleanInput name="b2" prefill="true" />


    `,
        });

        // not sure what to test as don't know how to check renderer...
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g"].stateValues.displayXAxis).eq(false);
        expect(stateVariables["/g"].stateValues.displayYAxis).eq(true);

        await updateBooleanInputValue({
            boolean: true,
            name: "/b1",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g"].stateValues.displayXAxis).eq(true);
        expect(stateVariables["/g"].stateValues.displayYAxis).eq(true);

        await updateBooleanInputValue({
            boolean: false,
            name: "/b2",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g"].stateValues.displayXAxis).eq(true);
        expect(stateVariables["/g"].stateValues.displayYAxis).eq(false);

        await updateBooleanInputValue({
            boolean: false,
            name: "/b1",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g"].stateValues.displayXAxis).eq(false);
        expect(stateVariables["/g"].stateValues.displayYAxis).eq(false);

        await updateBooleanInputValue({
            boolean: true,
            name: "/b2",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g"].stateValues.displayXAxis).eq(false);
        expect(stateVariables["/g"].stateValues.displayYAxis).eq(true);
    });

    it("display navigation bar", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g" showNavigation="$b"/>
    <booleanInput name="b" />

    `,
        });

        // not sure what to test as don't know how to check renderer...
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g"].stateValues.showNavigation).eq(false);

        await updateBooleanInputValue({
            boolean: true,
            name: "/b",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g"].stateValues.showNavigation).eq(true);

        await updateBooleanInputValue({
            boolean: false,
            name: "/b",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g"].stateValues.showNavigation).eq(false);
    });

    it("display digits and decimals, overwrite in copies", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g" size="small" xmin="-45.03232523423" xmax="8.2857234234" ymin="-5.582342383823423" ymax="7.83710375032" />
    <graph name="gdg3" displayDigits="5" copySource="g" />
    <graph name="gdc5" displayDecimals="5" copySource="g" />
    <graph name="gdg3a" displayDigits="5" copySource="gdc5" />
    <graph name="gdc5a" displayDecimals="5" copySource="gdg3" />
    <graph name="gdg3b" displayDigits="5" copySource="gdc5a" />
    <graph name="gdc5b" displayDecimals="5" copySource="gdg3a" />

    <p name="p">$g.xmin, $g.xmax, $g.ymin, $g.ymax</p>

    <p name="pdg3">$gdg3.xmin, $gdg3.xmax, $gdg3.ymin, $gdg3.ymax</p>
    <p name="pdg3a">$gdg3a.xmin, $gdg3a.xmax, $gdg3a.ymin, $gdg3a.ymax</p>
    <p name="pdg3b">$gdg3b.xmin, $gdg3b.xmax, $gdg3b.ymin, $gdg3b.ymax</p>
    <p name="pdg3c">$g{displayDigits="5"}.xmin, $g{displayDigits="5"}.xmax, $g{displayDigits="5"}.ymin, $g{displayDigits="5"}.ymax</p>
    <p name="pdg3d">$gdc5{displayDigits="5"}.xmin, $gdc5{displayDigits="5"}.xmax, $gdc5{displayDigits="5"}.ymin, $gdc5{displayDigits="5"}.ymax</p>

    <p name="pdc5">$gdc5.xmin, $gdc5.xmax, $gdc5.ymin, $gdc5.ymax</p>
    <p name="pdc5a">$gdc5a.xmin, $gdc5a.xmax, $gdc5a.ymin, $gdc5a.ymax</p>
    <p name="pdc5b">$gdc5b.xmin, $gdc5b.xmax, $gdc5b.ymin, $gdc5b.ymax</p>
    <p name="pdc5c">$g{displayDecimals="5"}.xmin, $g{displayDecimals="5"}.xmax, $g{displayDecimals="5"}.ymin, $g{displayDecimals="5"}.ymax</p>
    <p name="pdc5d">$gdg3{displayDecimals="5"}.xmin, $gdg3{displayDecimals="5"}.xmax, $gdg3{displayDecimals="5"}.ymin, $gdg3{displayDecimals="5"}.ymax</p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/p"].stateValues.text).eq(
            "-45.03, 8.29, -5.58, 7.84",
        );

        expect(stateVariables["/pdg3"].stateValues.text).eq(
            "-45.032, 8.2857, -5.5823, 7.8371",
        );
        expect(stateVariables["/pdg3b"].stateValues.text).eq(
            "-45.032, 8.2857, -5.5823, 7.8371",
        );
        expect(stateVariables["/pdg3c"].stateValues.text).eq(
            "-45.032, 8.2857, -5.5823, 7.8371",
        );
        expect(stateVariables["/pdg3d"].stateValues.text).eq(
            "-45.032, 8.2857, -5.5823, 7.8371",
        );
        expect(stateVariables["/pdc5"].stateValues.text).eq(
            "-45.03233, 8.28572, -5.58234, 7.8371",
        );
        expect(stateVariables["/pdc5b"].stateValues.text).eq(
            "-45.03233, 8.28572, -5.58234, 7.8371",
        );
        expect(stateVariables["/pdc5c"].stateValues.text).eq(
            "-45.03233, 8.28572, -5.58234, 7.8371",
        );
        expect(stateVariables["/pdc5d"].stateValues.text).eq(
            "-45.03233, 8.28572, -5.58234, 7.8371",
        );
    });

    it("pegboard", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <pegboard />
    </graph>
    
    <graph>
      <pegboard dx="3" dy="2" xoffset="1" yoffset="-1" />
    </graph>
    `,
        });

        // not sure what to test as don't know how to check renderer...
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/_pegboard1"].stateValues.dx).eq(1);
        expect(stateVariables["/_pegboard1"].stateValues.dy).eq(1);
        expect(stateVariables["/_pegboard1"].stateValues.xoffset).eq(0);
        expect(stateVariables["/_pegboard1"].stateValues.yoffset).eq(0);
        expect(stateVariables["/_pegboard2"].stateValues.dx).eq(3);
        expect(stateVariables["/_pegboard2"].stateValues.dy).eq(2);
        expect(stateVariables["/_pegboard2"].stateValues.xoffset).eq(1);
        expect(stateVariables["/_pegboard2"].stateValues.yoffset).eq(-1);
    });

    it("show border", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph/>
    
    <graph showBorder/>
    
    <graph showBorder="false"/>
    `,
        });

        // not sure what to test as don't know how to check renderer...
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/_graph1"].stateValues.showBorder).eq(true);
        expect(stateVariables["/_graph2"].stateValues.showBorder).eq(true);
        expect(stateVariables["/_graph3"].stateValues.showBorder).eq(false);
    });

    it("graph inside graph renders children in parent graph", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g1">
      <vector tail="(3,4)">(4,-5)</vector>
      <graph name="g1inner" xmin="-2" xmax="5" ymin="-3" ymax="4">
        <point>(6,9)
          <constraints>
            <constrainToGraph />
          </constraints>
        </point>
      </graph
    </graph>
    
    <graph xmin="-15" xmax="15" ymin="-15" ymax="15" name="g2">
      <circle center="(-5,-4)" />
      $g1
    </graph>
    
  `,
        });

        // Not sure what to test as the interesting part is the graph renderer
        // The only new part from core is that the inner graph ignores its xmin, etc. attributes
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g1inner"].stateValues.xmin).eq(-10);
        expect(stateVariables["/g1inner"].stateValues.xmax).eq(10);
        expect(stateVariables["/g1inner"].stateValues.ymin).eq(-10);
        expect(stateVariables["/g1inner"].stateValues.ymax).eq(10);
    });
});

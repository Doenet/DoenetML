import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import {
    movePoint,
    submitAnswer,
    updateMathInputValue,
    updateTextInputValue,
} from "../utils/actions";
import { widthsBySize } from "@doenet/utils";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

const externalDoenetMLs = {
    abc: `
<module>          
<moduleAttributes>
<text name="title">Find point</text>
<math name="initialx">0</math>
<math name="initialy">0</math>
<math name="goalx">3</math>
<math name="goaly">4</math>
<text name="size">medium</text>
<number name="aspectRatio">1</number>
</moduleAttributes>

<setup>
<math name="initialxCopy" copy="$initialx" />
<math name="initialyCopy" copy="$initialy" />
</setup>

<problem name="prob"><title>$title</title>

<p>Move the point to <m name="m">($goalx, $goaly)</m>.</p>
<graph name="graph" size="$size" aspectRatio="$aspectRatio">
<point x="$initialxCopy" y="$initialyCopy" name="P">
  <attractTo><point x="$goalx" y="$goaly" ></point></attractTo>
</point>
</graph>

<answer name="ans">
<award referencesAreResponses="$P">
<when>
  $P = ($goalx, $goaly)
</when>
</award>
</answer>
</problem>
</module>`,
    def: `
        <module>          
        <moduleAttributes>
            <text name="title">Original title</text>
        </moduleAttributes>

        <problem name="prob"><title>$title</title>

        </problem>
        </module>
    `,
};

describe("Module tag tests", async () => {
    it("module with sentence", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <module name="m">
      <moduleAttributes>
        <text name="item">who?</text>
      </moduleAttributes>
      <p name="p">Hello $item!</p>
    </module>
    
    <p name="p2">Hello $item!</p>
    <p name="p2a">Hello $m.item!</p>

    <module copy="$m" item="plant" name="m2" />

    <p><textInput name="item2" prefill="animal" /></p>
    <module copy="$m" item="$item2" name="m3" />
    <module copy="$m" name="m4" />

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("m.p")].stateValues.text,
        ).eq("Hello who?!");
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("Hello who?!");
        expect(
            stateVariables[await resolvePathToNodeIdx("p2a")].stateValues.text,
        ).eq("Hello who?!");
        expect(
            stateVariables[await resolvePathToNodeIdx("m2.p")].stateValues.text,
        ).eq("Hello plant!");
        expect(
            stateVariables[await resolvePathToNodeIdx("m3.p")].stateValues.text,
        ).eq("Hello animal!");
        expect(
            stateVariables[await resolvePathToNodeIdx("m4.p")].stateValues.text,
        ).eq("Hello who?!");

        await updateTextInputValue({
            text: "rock",
            componentIdx: await resolvePathToNodeIdx("item2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m3.p")].stateValues.text,
        ).eq("Hello rock!");
        expect(
            stateVariables[await resolvePathToNodeIdx("m.p")].stateValues.text,
        ).eq("Hello who?!");
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("Hello who?!");
        expect(
            stateVariables[await resolvePathToNodeIdx("m2.p")].stateValues.text,
        ).eq("Hello plant!");
        expect(
            stateVariables[await resolvePathToNodeIdx("m4.p")].stateValues.text,
        ).eq("Hello who?!");
    });

    it("module with graph", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <module name="m">
      <moduleAttributes>
        <math name="x">3</math>
        <math name="y">5</math>
        <text name="size">medium</text>
        <number name="aspectRatio">1</number>
      </moduleAttributes>

      <graph size="$size" aspectRatio="$aspectRatio" name="g">
        <point name="p" x="$x" y="$y" />
      </graph>
      <p>Point coords:
        <mathInput name="x2">$p.x</mathInput>
        <mathInput name="y2">$p.y</mathInput>
      </p>
    </module>

    <p>Point coords: <mathInput name="px" prefill="7" /> <mathInput name="py" prefill='-7' /></p>
    <p>Graph size: <textInput name="s" prefill="small" /> <mathInput name="ar" prefill="1/2" /></p>
    
    <module copy="$m" x="$px" y="$py" size="$s" aspectRatio="$ar" name="m2" />
    `,
        });

        async function check_items({
            p1,
            p2,
            size,
            ar,
        }: {
            p1: number[];
            p2: number[];
            size: string;
            ar: number;
        }) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("m.g")].stateValues
                    .size,
            ).eq("medium");
            expect(
                stateVariables[await resolvePathToNodeIdx("m.g")].stateValues
                    .width.size,
            ).eq(widthsBySize["medium"]);
            expect(
                stateVariables[await resolvePathToNodeIdx("m.g")].stateValues
                    .aspectRatio,
            ).eq(1);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("m.p")
                ].stateValues.xs.map((v) => v.tree),
            ).eqls(p1);
            expect(
                stateVariables[await resolvePathToNodeIdx("m2.g")].stateValues
                    .size,
            ).eq(size);
            expect(
                stateVariables[await resolvePathToNodeIdx("m2.g")].stateValues
                    .width.size,
            ).eq(widthsBySize[size]);
            expect(
                stateVariables[await resolvePathToNodeIdx("m2.g")].stateValues
                    .aspectRatio,
            ).eq(ar);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("m2.p")
                ].stateValues.xs.map((v) => v.tree),
            ).eqls(p2);
        }

        let p1 = [3, 5];
        let p2 = [7, -7];
        let size = "small";
        let ar = 0.5;

        await check_items({ p1, p2, size, ar });

        p1 = [-6, 9];
        await updateMathInputValue({
            latex: p1[0].toString(),
            componentIdx: await resolvePathToNodeIdx("m.x2"),
            core,
        });
        await updateMathInputValue({
            latex: p1[1].toString(),
            componentIdx: await resolvePathToNodeIdx("m.y2"),
            core,
        });
        await check_items({ p1, p2, size, ar });

        p2 = [1, 2];
        size = "large";
        ar = 3 / 2;
        await updateMathInputValue({
            latex: p2[0].toString(),
            componentIdx: await resolvePathToNodeIdx("px"),
            core,
        });
        await updateMathInputValue({
            latex: p2[1].toString(),
            componentIdx: await resolvePathToNodeIdx("py"),
            core,
        });
        await updateTextInputValue({
            text: size,
            componentIdx: await resolvePathToNodeIdx("s"),
            core,
        });
        await updateMathInputValue({
            latex: "3/2",
            componentIdx: await resolvePathToNodeIdx("ar"),
            core,
        });
        await check_items({ p1, p2, size, ar });

        p2 = [-3, 4];

        await updateMathInputValue({
            latex: p2[0].toString(),
            componentIdx: await resolvePathToNodeIdx("m2.x2"),
            core,
        });
        await updateMathInputValue({
            latex: p2[1].toString(),
            componentIdx: await resolvePathToNodeIdx("m2.y2"),
            core,
        });
        await check_items({ p1, p2, size, ar });

        p1 = [-8, 9];
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("m.p"),
            x: p1[0],
            y: p1[1],
            core,
        });
        await check_items({ p1, p2, size, ar });

        p2 = [6, -10];
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("m2.p"),
            x: p2[0],
            y: p2[1],
            core,
        });
        await check_items({ p1, p2, size, ar });
    });

    it("module inside a module", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <module name="m">
      <moduleAttributes>
        <math name="x">3</math>
        <math name="y">5</math>
      </moduleAttributes>
      <graph>
        <point name="p" x="$x" y="$y" />
      </graph>
    </module>

    <module name="n">
      <moduleAttributes>
        <math name="u">1</math>
        <math name="v">-2</math>
      </moduleAttributes>
      <graph>
        <point name="p" x="$u" y="$v" />
      </graph>
      <math name="vfixed" modifyIndirectly="false" hide>$v</math>
      <module copy="$m" x="$u+$vfixed" y="9" name="m2" />
      
    </module>

    <p>Point coords: <mathInput name="px" prefill="7" /> <mathInput name="py" prefill='-7' /></p>
    <module copy="$n" u="$px" v="$py" name="n2" />

    `,
        });

        async function check_items({
            mx,
            my,
            nx,
            ny,
            nmy,
            n2x,
            n2y,
            n2my,
        }: {
            mx: number;
            my: number;
            nx: number;
            ny: number;
            nmy: number;
            n2x: number;
            n2y: number;
            n2my: number;
        }) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("m.p")
                ].stateValues.xs.map((v) => v.tree),
            ).eqls([mx, my]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("n.p")
                ].stateValues.xs.map((v) => v.tree),
            ).eqls([nx, ny]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("n.m2.p")
                ].stateValues.xs.map((v) => v.tree),
            ).eqls([nx + ny, nmy]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("n2.p")
                ].stateValues.xs.map((v) => v.tree),
            ).eqls([n2x, n2y]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("n2.m2.p")
                ].stateValues.xs.map((v) => v.tree),
            ).eqls([n2x + n2y, n2my]);
        }

        let mx = 3;
        let my = 5;
        let nx = 1;
        let ny = -2;
        let nmy = 9;
        let n2x = 7;
        let n2y = -7;
        let n2my = 9;

        await check_items({ mx, my, nx, ny, nmy, n2x, n2y, n2my });

        n2x = -6;
        n2y = 8;
        await updateMathInputValue({
            latex: n2x.toString(),
            componentIdx: await resolvePathToNodeIdx("px"),
            core,
        });
        await updateMathInputValue({
            latex: n2y.toString(),
            componentIdx: await resolvePathToNodeIdx("py"),
            core,
        });
        await check_items({ mx, my, nx, ny, nmy, n2x, n2y, n2my });

        mx = -2;
        my = -4;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("m.p"),
            x: mx,
            y: my,
            core,
        });
        await check_items({ mx, my, nx, ny, nmy, n2x, n2y, n2my });

        nx = 7;
        ny = -3;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("n.p"),
            x: nx,
            y: ny,
            core,
        });
        await check_items({ mx, my, nx, ny, nmy, n2x, n2y, n2my });

        nx = -2;
        nmy = -7;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("n.m2.p"),
            x: nx + ny,
            y: nmy,
            core,
        });
        await check_items({ mx, my, nx, ny, nmy, n2x, n2y, n2my });

        n2x = 4;
        n2y = 5;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("n2.p"),
            x: n2x,
            y: n2y,
            core,
        });
        await check_items({ mx, my, nx, ny, nmy, n2x, n2y, n2my });

        n2x = -10;
        n2my = -6;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("n2.m2.p"),
            x: n2x + n2y,
            y: n2my,
            core,
        });
        await check_items({ mx, my, nx, ny, nmy, n2x, n2y, n2my });
    });

    it("apply sugar in module attributes", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <module name="m">
      <moduleAttributes>
        <point name="P">(1,2)</point>
      </moduleAttributes>
      <p>Point: <point extend="$P" name="p" /></p>
    </module>
    
    <module copy="$m" P="(3,4)" name="m2" />

    <graph>
      <point name="Q">(5,6)</point>
    </graph>
    <module copy="$m" P="$Q" name="m3" />
    

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("m.p")
            ].stateValues.xs.map((v) => v.tree),
        ).eqls([1, 2]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("m2.p")
            ].stateValues.xs.map((v) => v.tree),
        ).eqls([3, 4]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("m3.p")
            ].stateValues.xs.map((v) => v.tree),
        ).eqls([5, 6]);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("Q"),
            x: 7,
            y: 8,
            core,
        });
        expect(
            stateVariables[
                await resolvePathToNodeIdx("m3.p")
            ].stateValues.xs.map((v) => v.tree),
        ).eqls([7, 8]);
    });

    it("invalid attributes ignored in module", async () => {
        // disabled is already an attribute on all components, so we can't add a custom attribute with that name
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <module name='m'>
      <moduleAttributes>
        <boolean name="disabled">true</boolean>
      </moduleAttributes>
      <p name="p">Disabled? $disabled</p>
    </module>
    
    <module copy="$m" name="m1" />
    <module copy="$m" disabled="true" name="m2" />
    <module copy="$m" disabled="false" name="m3" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m.p")].stateValues.text,
        ).eq("Disabled? true");
        expect(
            stateVariables[await resolvePathToNodeIdx("m1.p")].stateValues.text,
        ).eq("Disabled? true");
        expect(
            stateVariables[await resolvePathToNodeIdx("m2.p")].stateValues.text,
        ).eq("Disabled? true");
        expect(
            stateVariables[await resolvePathToNodeIdx("m3.p")].stateValues.text,
        ).eq("Disabled? true");

        let errorWarnings = core.core!.errorWarnings;
        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(2);
        for (let i = 0; i < 2; i++) {
            expect(errorWarnings.warnings[i].message).contain(
                `The component <boolean name="disabled"> cannot be used as an attribute for a module because the <module> component type already has a "disabled" attribute defined`,
            );
        }
    });

    it("copy module and overwrite attribute values", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <module name="md">
      <moduleAttributes>
        <number name="n">2</number>
        <number name="m">1</number>
      </moduleAttributes>
      <p name="p1">The first number is $m; the second number is $n.</p>
      <p name="p2">Next value? <mathInput name="q" />  OK <math extend="$q" name="q2" /> it is.</p>
    </module>
    
    <module copy="$md" name="md1" />
    <module copy="$md1" n="10" name="md2" />
    <module copy="$md2" m="100" name="md3" />
    <module copy="$md3" n="0" name="md4" />

    <module copy="$md" m="13" n="17" name="md5" />
    <module copy="$md5" m="" n="a" name="md6" />
    <module copy="$md6" m="3" n="4" name="md7" />

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("md.p1")].stateValues
                .text,
        ).eq("The first number is 1; the second number is 2.");
        expect(
            stateVariables[await resolvePathToNodeIdx("md1.p1")].stateValues
                .text,
        ).eq("The first number is 1; the second number is 2.");
        expect(
            stateVariables[await resolvePathToNodeIdx("md2.p1")].stateValues
                .text,
        ).eq("The first number is 1; the second number is 10.");
        expect(
            stateVariables[await resolvePathToNodeIdx("md3.p1")].stateValues
                .text,
        ).eq("The first number is 100; the second number is 10.");
        expect(
            stateVariables[await resolvePathToNodeIdx("md4.p1")].stateValues
                .text,
        ).eq("The first number is 100; the second number is 0.");
        expect(
            stateVariables[await resolvePathToNodeIdx("md5.p1")].stateValues
                .text,
        ).eq("The first number is 13; the second number is 17.");
        expect(
            stateVariables[await resolvePathToNodeIdx("md6.p1")].stateValues
                .text,
        ).eq("The first number is NaN; the second number is NaN.");
        expect(
            stateVariables[await resolvePathToNodeIdx("md7.p1")].stateValues
                .text,
        ).eq("The first number is 3; the second number is 4.");

        for (let i = 0; i <= 7; i++) {
            expect(
                stateVariables[await resolvePathToNodeIdx(`md${i || ""}.q2`)]
                    .stateValues.value.tree,
            ).eq("\uff3f");
        }

        let qs = ["x", "y", "z", "u", "v", "w", "s", "t"];

        for (let [i, v] of qs.entries()) {
            await updateMathInputValue({
                latex: v,
                componentIdx: await resolvePathToNodeIdx(`md${i || ""}.q`),
                core,
            });
        }

        stateVariables = await core.returnAllStateVariables(false, true);
        for (let [i, v] of qs.entries()) {
            expect(
                stateVariables[await resolvePathToNodeIdx(`md${i || ""}.q2`)]
                    .stateValues.value.tree,
            ).eq(v);
        }
    });

    it("copy referencesAreResponses with parent target", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup>
      <module name="mod">
        <moduleAttributes>
          <text name="title">Find point</text>
          <math name="initialx">0</math>
          <math name="initialy">0</math>
          <math name="goalx">3</math>
          <math name="goaly">4</math>
          <number name="width">300</number>
          <number name="aspectRatio">1</number>
        </moduleAttributes>
      
        <problem name="prob"><title>$title</title>
      
          <p>Move the point to <m name="m">($goalx, $goaly)</m>.</p>
          <graph width="$width" aspectRatio="$aspectRatio">
            <point x="$initialx" y="$initialy" name="P">
                <attractTo><point x="$goalx" y="$goaly" ></point></attractTo>
            </point>
          </graph>
      
          <answer name="ans" >
            <award referencesAreResponses="$P">
              <when>
                $P = ($goalx, $goaly)
              </when>
            </award>
          </answer>
        </problem>
      </module>
    </setup>


    <section><title>First one</title>
    <module copy="$mod" name="m1" />

    <p>Submitted response for problem 1: <math name="sr1">$m1.ans.submittedResponse</math></p>
    <p>Credit for problem 1: <number extend="$m1.prob.creditAchieved" name="ca1"/></p>
    </section>

    <section><title>Second one</title>

    <p>Now, let's use initial point <m name="coordsa">(<math name="xa">-3</math>, <math name="ya">3</math>)</m> and the goal point <m name="coordsb">(<math name="xb">7</math>, <math name="yb">-5</math>)</m> </p>

    
    <module copy="$mod" title="Find point again" goalX="$xb" GoaLy="$yb" initialX="$xa" initialy="$ya" width="200px" aspectRatio="1" name="m2" />
    <p>Submitted response for problem 2: <math name="sr2">$m2.ans.submittedResponse</math></p>
    <p>Credit for problem 2: <number extend="$m2.prob.creditAchieved" name="ca2" /></p>
    </section>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1.m")].stateValues
                    .latex,
            ),
        ).eq("(3,4)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("coordsa")]
                    .stateValues.latex,
            ),
        ).eq("(-3,3)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("coordsb")]
                    .stateValues.latex,
            ),
        ).eq("(7,-5)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2.m")].stateValues
                    .latex,
            ),
        ).eq("(7,-5)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sr1")].stateValues
                    .latex,
            ),
        ).eq("＿");
        expect(
            stateVariables[await resolvePathToNodeIdx("ca1")].stateValues.value,
        ).eq(0);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sr2")].stateValues
                    .latex,
            ),
        ).eq("＿");
        expect(
            stateVariables[await resolvePathToNodeIdx("ca2")].stateValues.value,
        ).eq(0);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("m1.P")
            ].stateValues.xs.map((v) => v.tree),
        ).eqls([0, 0]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("m2.P")
            ].stateValues.xs.map((v) => v.tree),
        ).eqls([-3, 3]);

        // submit answers
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("m1.ans"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("m2.ans"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sr1")].stateValues
                    .latex,
            ),
        ).eq("(0,0)");
        expect(
            stateVariables[await resolvePathToNodeIdx("ca1")].stateValues.value,
        ).eq(0);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sr2")].stateValues
                    .latex,
            ),
        ).eq("(-3,3)");
        expect(
            stateVariables[await resolvePathToNodeIdx("ca2")].stateValues.value,
        ).eq(0);

        // move near correct answers
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("m1.P"),
            x: 3.2,
            y: 3.9,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("m2.P"),
            x: 7.2,
            y: -4.9,
            core,
        });
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1.m")].stateValues
                    .latex,
            ),
        ).eq("(3,4)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("coordsa")]
                    .stateValues.latex,
            ),
        ).eq("(-3,3)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("coordsb")]
                    .stateValues.latex,
            ),
        ).eq("(7,-5)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2.m")].stateValues
                    .latex,
            ),
        ).eq("(7,-5)");

        // submit answers
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("m1.ans"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("m2.ans"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sr1")].stateValues
                    .latex,
            ),
        ).eq("(3,4)");
        expect(
            stateVariables[await resolvePathToNodeIdx("ca1")].stateValues.value,
        ).eq(1);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sr2")].stateValues
                    .latex,
            ),
        ).eq("(7,-5)");
        expect(
            stateVariables[await resolvePathToNodeIdx("ca2")].stateValues.value,
        ).eq(1);
    });

    it("external module", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <section><title>First one</title>
    <module copy='doenet:abc' name="m1" />

    <p>Submitted response for problem 1: <math name="sr1">$m1.ans.submittedResponse</math></p>
    <p>Credit for problem 1: <number extend="$m1.prob.creditAchieved" name="ca1" /></p>
    </section>

    <section><title>Second one</title>

    <p>Now, let's use initial point <m name="coordsa">(<math name="xa">-3</math>, <math name="ya">3</math>)</m> and the goal point <m name="coordsb">(<math name="xb">7</math>, <math name="yb">-5</math>)</m> </p>

    
    <module copy='doenet:abc' title="Find point again" goalX="$xb" GoaLy="$yb" initialX="$xa" initialy="$ya" size="medium" aspectRatio="1" name="m2" />
    <p>Submitted response for problem 2: <math name="sr2">$m2.ans.submittedResponse</math></p>
    <p>Credit for problem 2: <number extend="$m2.prob.creditAchieved" name="ca2" /></p>
    </section>

    `,
            externalDoenetMLs,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1.m")].stateValues
                    .latex,
            ),
        ).eq("(3,4)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("coordsa")]
                    .stateValues.latex,
            ),
        ).eq("(-3,3)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("coordsb")]
                    .stateValues.latex,
            ),
        ).eq("(7,-5)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2.m")].stateValues
                    .latex,
            ),
        ).eq("(7,-5)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sr1")].stateValues
                    .latex,
            ),
        ).eq("＿");
        expect(
            stateVariables[await resolvePathToNodeIdx("ca1")].stateValues.value,
        ).eq(0);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sr2")].stateValues
                    .latex,
            ),
        ).eq("＿");
        expect(
            stateVariables[await resolvePathToNodeIdx("ca2")].stateValues.value,
        ).eq(0);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("m1.P")
            ].stateValues.xs.map((v) => v.tree),
        ).eqls([0, 0]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("m2.P")
            ].stateValues.xs.map((v) => v.tree),
        ).eqls([-3, 3]);

        // submit answers
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("m1.ans"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("m2.ans"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sr1")].stateValues
                    .latex,
            ),
        ).eq("(0,0)");
        expect(
            stateVariables[await resolvePathToNodeIdx("ca1")].stateValues.value,
        ).eq(0);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sr2")].stateValues
                    .latex,
            ),
        ).eq("(-3,3)");
        expect(
            stateVariables[await resolvePathToNodeIdx("ca2")].stateValues.value,
        ).eq(0);

        // move near correct answers
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("m1.P"),
            x: 3.2,
            y: 3.9,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("m2.P"),
            x: 7.2,
            y: -4.9,
            core,
        });
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m1.m")].stateValues
                    .latex,
            ),
        ).eq("(3,4)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("coordsa")]
                    .stateValues.latex,
            ),
        ).eq("(-3,3)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("coordsb")]
                    .stateValues.latex,
            ),
        ).eq("(7,-5)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("m2.m")].stateValues
                    .latex,
            ),
        ).eq("(7,-5)");

        // submit answers
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("m1.ans"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("m2.ans"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sr1")].stateValues
                    .latex,
            ),
        ).eq("(3,4)");
        expect(
            stateVariables[await resolvePathToNodeIdx("ca1")].stateValues.value,
        ).eq(1);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("sr2")].stateValues
                    .latex,
            ),
        ).eq("(7,-5)");
        expect(
            stateVariables[await resolvePathToNodeIdx("ca2")].stateValues.value,
        ).eq(1);
    });

    it("get new title when copy external module", async () => {
        // This test makes sure that the references are resolved correctly when
        // copying a module that is a copy of external content.
        // This tests makes sure we don't get a duplicate component index
        // due to a copy not resolving its source's `generatedVariantInfo` state variable before expanding
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
        <module title="New title" copy="doenet:def" name="g" />
        <module copy="$g" name="g2" />
        <module copy="$g" name="g3" title="Newer title" />
        <p name="gTitle">$g.title</p>
        <p name="g2Title">$g2.title</p>
        <p name="g3Title">$g3.title</p>
    `,
            externalDoenetMLs,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("g.title")].stateValues
                .value,
        ).eq("New title");
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.title")].stateValues
                .value,
        ).eq("New title");
        expect(
            stateVariables[await resolvePathToNodeIdx("g3.title")].stateValues
                .value,
        ).eq("Newer title");

        expect(
            stateVariables[await resolvePathToNodeIdx("gTitle")].stateValues
                .text,
        ).eq("New title");
        expect(
            stateVariables[await resolvePathToNodeIdx("g2Title")].stateValues
                .text,
        ).eq("New title");
        expect(
            stateVariables[await resolvePathToNodeIdx("g3Title")].stateValues
                .text,
        ).eq("Newer title");
    });

    it("external module inside a module", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `

    <module name="g">
      <moduleAttributes>
        <math name="a">1</math>
        <math name="b">2</math>
        <math name="c">3</math>
        <text name="size">medium</text>
        <number name="aspectRatio">1</number>
      </moduleAttributes>
    
      <p>Make the goal be <m name="m1">($a,$b)</m>.</p>
      <p>Make the <m>x</m> value of the initial point be <m name="m3">$c</m>.</p>
      <module size="$size" aspectRatio="$aspectRatio" goalx="$a" goaly="$b" iniTialX="$c" title="Embedded find point" copy="doenet:abc" name="extMod" />
    
      <p>Submitted response for problem: <math name="sr">$extMod.ans.submittedResponse</math></p>
      <p>Credit for problem: <number extend="$extMod.prob.creditAchieved" name="ca" /></p>

    </module>
    
    <module copy="$g" b="-5" c="9" size="small" aspectRatio="4/5" name="g2" />
    <module copy="$g" a="7" c="-3" size="large" aspectRatio="1.2" name="g3" />
    `,
            externalDoenetMLs,
        });

        let smallWidth = 255;
        let mediumWidth = 425;
        let largeWidth = 595;

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("g.m1")].stateValues
                    .latex,
            ),
        ).eq("(1,2)");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("g.m3")].stateValues
                    .latex,
            ),
        ).eq("3");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("g.extMod.m")]
                    .stateValues.latex,
            ),
        ).eq("(1,2)");
        expect(
            stateVariables[await resolvePathToNodeIdx("g.sr")].stateValues.text,
        ).eq("＿");
        expect(
            stateVariables[await resolvePathToNodeIdx("g.ca")].stateValues.text,
        ).eq("0");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("g2.m1")].stateValues
                    .latex,
            ),
        ).eq("(1,-5)");
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.m3")].stateValues
                .latex,
        ).eq("9");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("g2.extMod.m")]
                    .stateValues.latex,
            ),
        ).eq("(1,-5)");
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.sr")].stateValues
                .text,
        ).eq("＿");
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.ca")].stateValues
                .text,
        ).eq("0");

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("g3.m1")].stateValues
                    .latex,
            ),
        ).eq("(7,2)");
        expect(
            stateVariables[await resolvePathToNodeIdx("g3.m3")].stateValues
                .text,
        ).eq("-3");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("g3.extMod.m")]
                    .stateValues.latex,
            ),
        ).eq("(7,2)");
        expect(
            stateVariables[await resolvePathToNodeIdx("g3.sr")].stateValues
                .text,
        ).eq("＿");
        expect(
            stateVariables[await resolvePathToNodeIdx("g3.ca")].stateValues
                .text,
        ).eq("0");

        expect(
            stateVariables[
                await resolvePathToNodeIdx("g.extMod.P")
            ].stateValues.xs.map((x) => x.tree),
        ).eqls([3, 0]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("g2.extMod.P")
            ].stateValues.xs.map((x) => x.tree),
        ).eqls([9, 0]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("g3.extMod.P")
            ].stateValues.xs.map((x) => x.tree),
        ).eqls([-3, 0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("g.extMod.graph")]
                .stateValues.size,
        ).eq("medium");
        expect(
            stateVariables[await resolvePathToNodeIdx("g.extMod.graph")]
                .stateValues.width.size,
        ).eq(mediumWidth);
        expect(
            stateVariables[await resolvePathToNodeIdx("g.extMod.graph")]
                .stateValues.aspectRatio,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.extMod.graph")]
                .stateValues.size,
        ).eq("small");
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.extMod.graph")]
                .stateValues.width.size,
        ).eq(smallWidth);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.extMod.graph")]
                .stateValues.aspectRatio,
        ).eq(0.8);
        expect(
            stateVariables[await resolvePathToNodeIdx("g3.extMod.graph")]
                .stateValues.size,
        ).eq("large");
        expect(
            stateVariables[await resolvePathToNodeIdx("g3.extMod.graph")]
                .stateValues.width.size,
        ).eq(largeWidth);
        expect(
            stateVariables[await resolvePathToNodeIdx("g3.extMod.graph")]
                .stateValues.aspectRatio,
        ).eq(1.2);

        // submit answers
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("g.extMod.ans"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("g2.extMod.ans"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("g3.extMod.ans"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("g.sr")].stateValues
                    .latex,
            ),
        ).eq("(3,0)");
        expect(
            stateVariables[await resolvePathToNodeIdx("g.ca")].stateValues.text,
        ).eq("0");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("g2.sr")].stateValues
                    .latex,
            ),
        ).eq("(9,0)");
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.ca")].stateValues
                .text,
        ).eq("0");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("g3.sr")].stateValues
                    .latex,
            ),
        ).eq("(-3,0)");
        expect(
            stateVariables[await resolvePathToNodeIdx("g3.ca")].stateValues
                .text,
        ).eq("0");

        // move near correct answers
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g.extMod.P"),
            x: 1.2,
            y: 1.9,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g2.extMod.P"),
            x: 1.2,
            y: -4.9,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g3.extMod.P"),
            x: 7.2,
            y: 1.9,
            core,
        });

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("g.extMod.ans"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("g2.extMod.ans"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("g3.extMod.ans"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("g.sr")].stateValues
                    .latex,
            ),
        ).eq("(1,2)");
        expect(
            stateVariables[await resolvePathToNodeIdx("g.ca")].stateValues.text,
        ).eq("1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("g2.sr")].stateValues
                    .latex,
            ),
        ).eq("(1,-5)");
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.ca")].stateValues
                .text,
        ).eq("1");
        expect(
            cleanLatex(
                stateVariables[await resolvePathToNodeIdx("g3.sr")].stateValues
                    .latex,
            ),
        ).eq("(7,2)");
        expect(
            stateVariables[await resolvePathToNodeIdx("g3.ca")].stateValues
                .text,
        ).eq("1");
    });

    it("extend copied module containing component with attribute", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
        <module name='m1'>
            <point y='1' name="p"/>
        </module>
        
        <module name='m2' copy='$m1' />
        <module extend='$m2' name="m3" />

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1.p")].stateValues
                .coords.tree,
        ).eqls(["vector", 0, 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2.p")].stateValues
                .coords.tree,
        ).eqls(["vector", 0, 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m3.p")].stateValues
                .coords.tree,
        ).eqls(["vector", 0, 1]);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("m1.p"),
            x: 2,
            y: 3,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1.p")].stateValues
                .coords.tree,
        ).eqls(["vector", 2, 3]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2.p")].stateValues
                .coords.tree,
        ).eqls(["vector", 0, 1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m3.p")].stateValues
                .coords.tree,
        ).eqls(["vector", 0, 1]);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("m2.p"),
            x: 4,
            y: 5,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1.p")].stateValues
                .coords.tree,
        ).eqls(["vector", 2, 3]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2.p")].stateValues
                .coords.tree,
        ).eqls(["vector", 4, 5]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m3.p")].stateValues
                .coords.tree,
        ).eqls(["vector", 4, 5]);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("m3.p"),
            x: 6,
            y: 7,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1.p")].stateValues
                .coords.tree,
        ).eqls(["vector", 2, 3]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2.p")].stateValues
                .coords.tree,
        ).eqls(["vector", 6, 7]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m3.p")].stateValues
                .coords.tree,
        ).eqls(["vector", 6, 7]);
    });
});

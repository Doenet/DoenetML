import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import {
    movePoint,
    submitAnswer,
    updateBooleanInputValue,
    updateMathInputValue,
    updateValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Repeat tag tests", async () => {
    it("single repeat of maths", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup>
      <mathList name="s">x y</mathList>
    </setup>
    <p name="p"><repeat name="repeat1" for="$s" valueName="x" indexName="i">
      <math>sin(2$x) + $i</math>
    </repeat></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let replacements =
            stateVariables[await resolvePathToNodeIdx("repeat1")].replacements!;
        let mathr1Name =
            stateVariables[replacements[0].componentIdx].replacements![0]
                .componentIdx;
        let mathr2Name =
            stateVariables[replacements[1].componentIdx].replacements![0]
                .componentIdx;

        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("sin(2 x) + 1, sin(2 y) + 2");

        expect(stateVariables[mathr1Name].stateValues.value.tree).eqls([
            "+",
            ["apply", "sin", ["*", 2, "x"]],
            1,
        ]);
        expect(stateVariables[mathr2Name].stateValues.value.tree).eqls([
            "+",
            ["apply", "sin", ["*", 2, "y"]],
            2,
        ]);
    });

    it("single repeat of texts", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup>
      <textList name="s">squirrel bat</textList>
    </setup>
    <p name="p"><repeat name="repeat1" for="$s" valueName="animal" asList="false">
      <text>You are a $animal!</text>
    </repeat></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let replacements =
            stateVariables[await resolvePathToNodeIdx("repeat1")].replacements!;
        let textr1Name =
            stateVariables[replacements[0].componentIdx].replacements![0]
                .componentIdx;
        let textr2Name =
            stateVariables[replacements[1].componentIdx].replacements![0]
                .componentIdx;

        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("You are a squirrel!You are a bat!");

        expect(stateVariables[textr1Name].stateValues.value).eq(
            "You are a squirrel!",
        );

        expect(stateVariables[textr2Name].stateValues.value).eq(
            "You are a bat!",
        );
    });

    it("single repeat of sequence", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup>
        <sequence name="s" from="1" to="5"/>
    </setup>
    <p name="p"><repeat for="$s" valueName="n" name="repeat1">
      <math simplify>$n^2</math>
    </repeat></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let replacements =
            stateVariables[await resolvePathToNodeIdx("repeat1")].replacements!;
        let mathrNames = replacements.map(
            (x) => stateVariables[x.componentIdx].replacements![0].componentIdx,
        );

        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("1, 4, 9, 16, 25");
        expect(stateVariables[mathrNames[0]].stateValues.value.tree).eq(1);
        expect(stateVariables[mathrNames[1]].stateValues.value.tree).eq(4);
        expect(stateVariables[mathrNames[2]].stateValues.value.tree).eq(9);
        expect(stateVariables[mathrNames[3]].stateValues.value.tree).eq(16);
        expect(stateVariables[mathrNames[4]].stateValues.value.tree).eq(25);
    });

    it("triple parallel repeat", async () => {
        // Mimicked behavior of the old parallel map with a repeat
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup>
        <sequence name="s1" from="1" to="5"/>   
        <sequence name="s2" from="21" to="23"/>
        <sequence name="s3" from="-5" to="-21" step="-3"/>
    </setup>
    <p name="p"><repeat for="$s2" indexName="i">
      <math>($s1[$i], $s2[$i], $s3[$i])</math>: <math>($i, $i, $i)</math>
    </repeat></p>
    `,
        });

        let options1 = [1, 2, 3, 4, 5];
        let options2 = [21, 22, 23];
        let options3 = [-5, -8, -11, -14, -17, -20];

        let nValues = Math.min(
            options1.length,
            options2.length,
            options3.length,
        );

        let values: number[][] = [];
        let indices: number[][] = [];

        for (let i = 0; i < nValues; i++) {
            values.push([options1[i], options2[i], options3[i]]);
            indices.push([i + 1, i + 1, i + 1]);
        }

        let pText = values
            .map((v, i) => `( ${v.join(", ")} ): ( ${indices[i].join(", ")} )`)
            .join(", ");

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq(pText);
    });

    it("triple combination repeat", async () => {
        // Mimicked the combination behavior of a map with nested repeats
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup>
      <sequence name="s1" from="1" to="3"/>
      <sequence name="s2" from="21" to="23" step="2"/>
      <sequence name="s3" from="-5" to="-8" step="-3"/>
    </setup>
    <p name="p"><repeat for="$s1" valueName="l" indexName="i">
      <repeat for="$s2" valueName="m" indexName="j">
        <repeat for="$s3" valueName="n" indexName="k">
          <math>($l, $m, $n)</math>: <math>($i, $j, $k)</math></template>
        </repeat>
      </repeat>
    </repeat></p>
    `,
        });

        let options1 = [1, 2, 3];
        let options2 = [21, 23];
        let options3 = [-5, -8];
        let values: number[][] = [];
        let indices: number[][] = [];

        for (let [i, l] of options1.entries()) {
            for (let [j, m] of options2.entries()) {
                for (let [k, n] of options3.entries()) {
                    values.push([l, m, n]);
                    indices.push([i + 1, j + 1, k + 1]);
                }
            }
        }

        let pText = values
            .map((v, i) => `( ${v.join(", ")} ): ( ${indices[i].join(", ")} )`)
            .join(", ");

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq(pText);
    });

    it("two nested repeats", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup>
        <group name="s1"><number>-10</number><number>5</number></group>
        <sequence name="s2" from="1" to="2"/>
    </setup>
    <p name="p"><repeat for="$s1" valueName="n" indexName="j">
      <repeat for="$s2" valueName="m" indexName="i">
          <math simplify>$m+$n</math> and <math simplify>$i+2$j</math>
        </repeat>
    </repeat></p>

    `,
        });

        let options1 = [1, 2];
        let options2 = [-10, 5];
        let values1: number[] = [];
        let values2: number[] = [];

        for (let [j, n] of options2.entries()) {
            for (let [i, m] of options1.entries()) {
                values1.push(m + n);
                values2.push(i + 1 + 2 * (j + 1));
            }
        }

        let pText = values1.map((v, i) => `${v} and ${values2[i]}`).join(", ");

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq(pText);
    });

    it("three nested repeats with graphs and copied", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup>
       <sequence name="s1" from="-10" to="5" step="15"/>
       <sequence name="s2" from="-5" to="5" step="10"/>
       <sequence name="s3" from="1" to="2"/>
    </setup>
    <repeat name="repeat1" for="$s1" valueName="n" indexName="k">
      <graph>
        <repeat for="$s2" valueName="m" indexName="j">
          <repeat for="$s3" valueName="l" indexName="i">
              <point>($l+$n, $m)</point><point>($i+2*$k, $j)</point>
            </repeat>
        </repeat>
      </graph>
    </repeat>
    <repeat extend="$repeat1" name="repeatCopy" />
    `,
        });

        let options1 = [1, 2];
        let options2 = [-5, 5];
        let options3 = [-10, 5];

        let point1sByGraph: number[][][] = [];
        let point2sByGraph: number[][][] = [];

        for (let [k, n] of options3.entries()) {
            point1sByGraph.push([]);
            point2sByGraph.push([]);
            for (let [j, m] of options2.entries()) {
                for (let [i, l] of options1.entries()) {
                    point1sByGraph[k].push([l + n, m]);
                    point2sByGraph[k].push([i + 1 + 2 * (k + 1), j + 1]);
                }
            }
        }

        let stateVariables = await core.returnAllStateVariables(false, true);

        async function checkRepeat(repeatName: string) {
            let graphIndices = stateVariables[
                await resolvePathToNodeIdx(repeatName)
            ].replacements!.map(
                (x) =>
                    stateVariables[x.componentIdx].replacements![0]
                        .componentIdx,
            );

            expect(graphIndices.length).eq(2);

            for (let [graphNum, graphIdx] of graphIndices.entries()) {
                let point1IndicesForGraph: string[] = [];
                let point2IndicesForGraph: string[] = [];

                let allPointIndices = stateVariables[
                    graphIdx
                ].activeChildren.map((x) => x.componentIdx);

                expect(allPointIndices.length).eq(8);

                for (let [pointInd, pointIdx] of allPointIndices.entries()) {
                    if (pointInd % 2 === 0) {
                        point1IndicesForGraph.push(pointIdx);
                    } else {
                        point2IndicesForGraph.push(pointIdx);
                    }
                }

                for (let [ind, val] of point1sByGraph[graphNum].entries()) {
                    let componentIdx = point1IndicesForGraph[ind];
                    expect(
                        stateVariables[componentIdx].stateValues.xs.map(
                            (x) => x.tree,
                        ),
                    ).eqls(val);
                }
                for (let [ind, val] of point2sByGraph[graphNum].entries()) {
                    let componentIdx = point2IndicesForGraph[ind];
                    expect(
                        stateVariables[componentIdx].stateValues.xs.map(
                            (x) => x.tree,
                        ),
                    ).eqls(val);
                }
            }
        }

        await checkRepeat("repeat1");
        await checkRepeat("repeatCopy");
    });

    // XXX: this test exposes a new flaw, where one gets errors of the form:
    // Attempting to set value of stateVariable extendedComponent of [n] while it is still unresolved!
    it.skip("three nested repeats with graphs and referenced coords", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup>
        <sequence name="s1" from="-10" to="5" step="15"/>
        <sequence name="s2" from="-5" to="5" step="10"/>
        <sequence name="s3" from="1" to="2"/>
    </setup>
    <repeat for="$s1" name="r1" valueName="n">
      <graph name="graph1">
        <repeat for="$s2" name="r2" valueName="m">
            <repeat for="$s3" name="r3" valueName="l">
                <point name="A">($l+$n, $m)</point>
            </repeat>
        </repeat>
      </graph>
    </repeat>
    <coords name="c1" extend="$r1[1].r2[1].r3[1].A" />
    <coords name="c2" extend="$r1[1].r2[1].r3[2].A" />
    <coords name="c3" extend="$r1[1].r2[2].r3[1].A" />
    <coords name="c4" extend="$r1[1].r2[2].r3[2].A" />
    <coords name="c5" extend="$r1[2].r2[1].r3[1].A" />
    <coords name="c6" extend="$r1[2].r2[1].r3[2].A" />
    <coords name="c7" extend="$r1[2].r2[2].r3[1].A" />
    <coords name="c8" extend="$r1[2].r2[2].r3[2].A" />
    `,
        });

        let options1 = [-10, 5];
        let options2 = [-5, 5];
        let options3 = [1, 2];

        let pointsByRepeat: number[][][][] = [];

        for (let [k, n] of options1.entries()) {
            pointsByRepeat.push([]);
            for (let [j, m] of options2.entries()) {
                pointsByRepeat[k].push([]);
                for (let [i, l] of options3.entries()) {
                    pointsByRepeat[k][j].push([l + n, m]);
                }
            }
        }

        let stateVariables = await core.returnAllStateVariables(false, true);

        const r1 = await resolvePathToNodeIdx("r1");

        const group1 = stateVariables[r1].replacements![0].componentIdx;
        const group2 = stateVariables[r1].replacements![1].componentIdx;

        const graph1 = stateVariables[group1].replacements![0].componentIdx;
        const graph2 = stateVariables[group2].replacements![0].componentIdx;

        expect(
            stateVariables[graph1].stateValues.graphicalDescendants.length,
        ).eq(4);
        expect(
            stateVariables[graph2].stateValues.graphicalDescendants.length,
        ).eq(4);

        // let cName = ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9"]
        let cNames = ["c8", "c7", "c6", "c5", "c4", "c3", "c2", "c1"];

        for (let i1 = 0; i1 < 2; i1++) {
            for (let i2 = 0; i2 < 2; i2++) {
                for (let i3 = 0; i3 < 2; i3++) {
                    const pointIdx = await resolvePathToNodeIdx(
                        `r1[${i1 + 1}].r2[${i2 + 1}].r3[${i3 + 1}].A`,
                    );

                    expect(
                        stateVariables[pointIdx].stateValues.xs.map(
                            (x) => x.tree,
                        ),
                    ).eqls(pointsByRepeat[i1][i2][i3]);

                    let cIdx = await resolvePathToNodeIdx(cNames.pop()!);

                    expect(stateVariables[cIdx!].stateValues.value.tree).eqls([
                        "vector",
                        ...pointsByRepeat[i1][i2][i3],
                    ]);
                }
            }
        }
    });

    it("repeat with copies", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    
    <setup>
        <sequence name="s" from="3" to="4" />
    </setup>
    <p name="p1"><repeat name="repeat1" for="$s" valueName="n" indexName="j">
    <math simplify>
        <number extend="$n" name="b" /> + <number extend="$j" name="i" /> + $a 
        + <math name="q">z</math> + $q + $b +$i
      </math> and <math>x</math>
    </repeat></p>
    <math name="a">x</math>
    <p name="p2">$repeat1</p>
    `,
        });

        let texts: string[] = [];
        for (let [n, j] of [
            [3, 1],
            [4, 2],
        ]) {
            let b = n;
            let i = j;
            let constant = n + j + b + i;
            texts.push(`x + 2 z + ${constant} and x`);
        }

        let pText = texts.join(", ");

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq(pText);
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq(pText);
    });

    it("repeat with copies, extended dynamically", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <number name="length">1</number>
    <setup>
      <sequence name="s" from="3" length="$length"/>
    </setup>
    <p name="p1"><repeat name="repeat1" for="$s" valueName="n" indexName="j">
    <math simplify>
        <number extend="$n" name="b" /> + <number extend="$j" name="i" /> + $a 
        + <math name="q">z</math> + $q + $b +$i
      </math> and <math>x</math>
    </repeat></p>
    <math name="a">x</math>
    <p name="p2">$repeat1</p>
    <p name="p3" extend="$p2" />

    <updateValue name="uv" target="$length" newValue="2$length"  >
      <label>double</label>
    </updateValue>
    `,
        });

        function textForLength(length: number) {
            let sources = [...Array(length).keys()].map((v) => [v + 3, v + 1]);

            let texts: string[] = [];
            for (let [n, j] of sources) {
                let b = n;
                let i = j;
                let constant = n + j + b + i;
                texts.push(`x + 2 z + ${constant} and x`);
            }

            return texts.join(", ");
        }

        let pText = textForLength(1);

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq(pText);
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq(pText);
        expect(
            stateVariables[await resolvePathToNodeIdx("p3")].stateValues.text,
        ).eq(pText);

        // Double the length then test again
        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv"),
            core,
        });

        pText = textForLength(2);
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq(pText);
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq(pText);
        expect(
            stateVariables[await resolvePathToNodeIdx("p3")].stateValues.text,
        ).eq(pText);

        // Double the length again then test one more time
        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv"),
            core,
        });

        pText = textForLength(4);
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq(pText);
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq(pText);
        expect(
            stateVariables[await resolvePathToNodeIdx("p3")].stateValues.text,
        ).eq(pText);
    });

    function sinTextFromVars(vars: string[]) {
        let sources = vars.map((v, i) => [i + 1, v]);

        let texts: string[] = [];
        for (let [i, x] of sources) {
            if (i === 1) {
                texts.push(`sin(${x})`);
            } else {
                texts.push(`sin(${i} ${x})`);
            }
        }

        return texts.join(", ");
    }

    // TODO: this does not currently work.
    // Do we want to restore this behavior?
    it.skip("copy repeat and change for", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p1"><repeat for="x y" name="repeat1" valueName="x" indexName="i">
       <math simplify="full">sin($i$x)</math>
    </repeat></p>
  
    <p name="p2"><repeat name="repeat2" copy="$repeat1" for="q p" /></p>

    <p name="p3">$repeat2</p>
    `,
        });

        let pText1 = sinTextFromVars(["x", "y"]);
        let pText2 = sinTextFromVars(["q", "p"]);

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq(pText1);
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq(pText2);
        expect(
            stateVariables[await resolvePathToNodeIdx("p3")].stateValues.text,
        ).eq(pText2);
    });

    it("repeat copying value from other repeat", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <repeat name="r1" for="1 2 3" valueName="n">
      <math name="math">($n, $r2[3].n2)</math>
    </repeat>
    <repeat name="r2" for="4 5 6" valueName="n">
      <math name="math">sin(<number extend="$n" name="n2" />)</math>
    </repeat>
    `,
        });

        let e_n2 = 6;

        let maths1 = [1, 2, 3].map((n) => `( ${n}, ${e_n2} )`);
        let maths2 = [4, 5, 6].map((n) => `sin(${n})`);
        let names1 = ["r1[1].math", "r1[2].math", "r1[3].math"];
        let names2 = ["r2[1].math", "r2[2].math", "r2[3].math"];

        let stateVariables = await core.returnAllStateVariables(false, true);

        for (let i = 0; i < 3; i++) {
            expect(
                stateVariables[await resolvePathToNodeIdx(names1[i])]
                    .stateValues.text,
            ).eq(maths1[i]);

            expect(
                stateVariables[await resolvePathToNodeIdx(names2[i])]
                    .stateValues.text,
            ).eq(maths2[i]);
        }
    });

    it("repeat length depending on other repeat", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    
    <setup>
      <sequence name="s1" from="1" to="3"/>
    </setup>
    <p name="p"><repeat for="$s1" valueName="b"><setup>
           <sequence name="s2" from="1" to="$b" />
        </setup><repeat for="$s2" valueName="a">
            <math>($a, $b)</math>
        </repeat>
    </repeat></p>
    `,
        });

        let texts: string[] = [];

        for (let b of [1, 2, 3]) {
            for (let a of [...Array(b).keys()].map((v) => v + 1)) {
                texts.push(`( ${a}, ${b} )`);
            }
        }

        let pText = texts.join(", ");

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq(pText);
    });

    it("repeat begins zero length, copied multiple times", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup>
        <sequence name="s" from="$sequenceFrom" to="$sequenceTo" length="$sequenceCount" />
    </setup>
    <p name="p1"><repeat name="repeat1" for="$s" valueName="n">
        <math simplify>$n^2</math>
    </repeat></p>

    <mathInput name="sequenceFrom" prefill="1"/>
    <mathInput name="sequenceTo" prefill="2"/>
    <mathInput name="sequenceCount" prefill="0"/>
    
    <p name="p2"><repeat extend="$repeat1" name="copyRepeat2" /></p>
    <p name="p3">$copyRepeat2</p>

    <p extend="$p1" name="p4" />
    <p extend="$p4" name="p5" />
    <p extend="$p5" name="p6" />

    `,
        });

        async function check_items(from: number, to: number, count: number) {
            let step = (to - from) / (count - 1);

            let maths: number[] = [];
            for (let i = 0; i < count; i++) {
                let n = from + (i ? i * step : 0);
                maths.push(n ** 2);
            }

            let pText = maths.join(", ");

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            for (let i = 1; i <= 6; i++) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(`p${i}`)]
                        .stateValues.text,
                ).eq(pText);
            }
        }

        // At beginning, nothing shown
        let from = 1,
            to = 2,
            count = 0;
        await check_items(from, to, count);

        // make sequence length 1
        count = 1;
        await updateMathInputValue({
            latex: count.toString(),
            componentIdx: await resolvePathToNodeIdx("sequenceCount"),
            core,
        });
        await check_items(from, to, count);

        // make sequence length 0 again
        count = 0;
        await updateMathInputValue({
            latex: count.toString(),
            componentIdx: await resolvePathToNodeIdx("sequenceCount"),
            core,
        });
        await check_items(from, to, count);

        // make sequence length 2
        count = 2;
        await updateMathInputValue({
            latex: count.toString(),
            componentIdx: await resolvePathToNodeIdx("sequenceCount"),
            core,
        });
        await check_items(from, to, count);

        // change limits
        from = 3;
        to = 5;
        await updateMathInputValue({
            latex: from.toString(),
            componentIdx: await resolvePathToNodeIdx("sequenceFrom"),
            core,
        });
        await updateMathInputValue({
            latex: to.toString(),
            componentIdx: await resolvePathToNodeIdx("sequenceTo"),
            core,
        });
        await check_items(from, to, count);

        // make sequence length 0 again
        count = 0;
        await updateMathInputValue({
            latex: count.toString(),
            componentIdx: await resolvePathToNodeIdx("sequenceCount"),
            core,
        });
        await check_items(from, to, count);

        // make sequence length 3
        count = 3;
        await updateMathInputValue({
            latex: count.toString(),
            componentIdx: await resolvePathToNodeIdx("sequenceCount"),
            core,
        });
        await check_items(from, to, count);
    });

    it("repeat with seemingly circular dependence in template", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `

    <setup>
        <sequence name="s" from="2" to="4" />
    </setup>
    <graph>
      <repeat for="$s" valueName="n" name="repeat">
        <point name="P1">
            ($q$n^2,
            $P2.x)
          </point><point name="P2">
            ($r$n,
            $P1.x)
          </point>
      </repeat>
    </graph>
    <math name="q">1</math>
    <math name="r">1</math>
    <coords name="c1" extend="$repeat[1].P1.coords" />
    <coords name="c2" extend="$repeat[1].P2.coords" />
    <coords name="c3" extend="$repeat[2].P1.coords" />
    <coords name="c4" extend="$repeat[2].P2.coords" />
    <coords name="c5" extend="$repeat[3].P1.coords" />
    <coords name="c6" extend="$repeat[3].P2.coords" />
    `,
        });

        function points_from_pars(q: number, r: number) {
            let P1s: number[][] = [];
            let P2s: number[][] = [];

            for (let n = 2; n <= 4; n++) {
                let P1x = q * n ** 2;
                let P2x = r * n;

                P1s.push(rnd([P1x, P2x]));
                P2s.push(rnd([P2x, P1x]));
            }

            return { P1s, P2s };
        }

        /**
         * Round numerical components of `vec` to 12 digits.
         *
         * Used to eliminate differences due to round off error
         */
        function rnd(vec: any[]) {
            return vec.map((v) =>
                Number.isFinite(v) ? Math.round(v * 1e12) / 1e12 : v,
            );
        }

        async function check_items(q: number, r: number) {
            let { P1s, P2s } = points_from_pars(q, r);

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            for (let ind = 0; ind < 3; ind++) {
                const p1 = await resolvePathToNodeIdx(`repeat[${ind + 1}].P1`);
                const p2 = await resolvePathToNodeIdx(`repeat[${ind + 1}].P2`);
                expect(
                    rnd(stateVariables[p1].stateValues.xs.map((x) => x.tree)),
                ).eqls(P1s[ind]);
                expect(
                    rnd(stateVariables[p2].stateValues.xs.map((x) => x.tree)),
                ).eqls(P2s[ind]);

                expect(
                    rnd(
                        stateVariables[
                            await resolvePathToNodeIdx(`c${ind * 2 + 1}`)
                        ].stateValues.value.tree,
                    ),
                ).eqls(["vector", ...P1s[ind]]);
                expect(
                    rnd(
                        stateVariables[
                            await resolvePathToNodeIdx(`c${ind * 2 + 2}`)
                        ].stateValues.value.tree,
                    ),
                ).eqls(["vector", ...P2s[ind]]);
            }
        }

        let q = 1,
            r = 1;

        await check_items(q, r);

        // move point /a/P1
        r = 1.3;
        q = -2.1;

        let P1s = points_from_pars(q, r).P1s;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`repeat[1].P1`),
            x: P1s[0][0],
            y: P1s[0][1],
            core,
        });
        await check_items(q, r);

        // move point /a/P2
        r = 0.7;
        q = 1.8;
        let P2s = points_from_pars(q, r).P2s;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`repeat[1].P2`),
            x: P2s[0][0],
            y: P2s[0][1],
            core,
        });
        await check_items(q, r);

        // move point /b/P1
        r = -0.2;
        q = 0.3;
        P1s = points_from_pars(q, r).P1s;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`repeat[2].P1`),
            x: P1s[1][0],
            y: P1s[1][1],
            core,
        });
        await check_items(q, r);

        // move point /b/P2
        r = 0.6;
        q = 0.35;
        P2s = points_from_pars(q, r).P2s;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`repeat[2].P2`),
            x: P2s[1][0],
            y: P2s[1][1],
            core,
        });
        await check_items(q, r);

        // move point /c/P1
        r = -0.21;
        q = -0.46;
        P1s = points_from_pars(q, r).P1s;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`repeat[3].P1`),
            x: P1s[2][0],
            y: P1s[2][1],
            core,
        });
        await check_items(q, r);

        // move point /c/P2
        r = 0.37;
        q = -0.73;
        P2s = points_from_pars(q, r).P2s;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`repeat[3].P2`),
            x: P2s[2][0],
            y: P2s[2][1],
            core,
        });
        await check_items(q, r);
    });

    it("two repeats with mutual copies, begin zero length, copied multiple times", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup>
        <sequence name="s" from="$sequenceFrom" to="$sequenceTo" length="$sequenceCount" />
    </setup>
    <graph name="g1">
      <repeat name="repeat1" for="$s" valueName="n">
        <point name="P">
            (-$n, $n($repeat2[1].P.x))
          </point>
      </repeat>
      <repeat name="repeat2" for="$s" valueName="n">
        <point name="P">
            ($n, $n($repeat1[1].P.x))
          </point>
      </repeat>
    </graph>
    
    <mathInput name="sequenceFrom" prefill="1"/>
    <mathInput name="sequenceTo" prefill="2"/>
    <mathInput name="sequenceCount" prefill="0"/>
    
    <graph name="g2">
        <repeat name="copyRepeat1" extend="$repeat1" />
        <repeat name="copyRepeat2" extend="$repeat2" />
    </graph>
    <graph name="g3">
        <repeat name="copyRepeat1b" extend="$copyRepeat1" />
        <repeat name="copyRepeat2b" extend="$copyRepeat2" />
    </graph>
    
    <graph name="g4" extend="$g1" />
    `,
        });

        const g1 = await resolvePathToNodeIdx("g1");
        const g2 = await resolvePathToNodeIdx("g2");
        const g3 = await resolvePathToNodeIdx("g3");
        const g4 = await resolvePathToNodeIdx("g4");
        const gs = [g1, g2, g3, g4];

        async function check_items(from: number, to: number, count: number) {
            let a_Px = -from;
            let q_Px = from;

            let step = (to - from) / (count - 1);

            let points1: number[][] = [];
            let points2: number[][] = [];
            for (let i = 0; i < count; i++) {
                let n = from + (i ? i * step : 0);
                points1.push([-n, n * q_Px]);
                points2.push([n, n * a_Px]);
            }

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[g1].stateValues.graphicalDescendants.length,
            ).eq(2 * count);
            expect(
                stateVariables[g2].stateValues.graphicalDescendants.length,
            ).eq(2 * count);
            expect(
                stateVariables[g3].stateValues.graphicalDescendants.length,
            ).eq(2 * count);
            expect(
                stateVariables[g4].stateValues.graphicalDescendants.length,
            ).eq(2 * count);

            for (let i = 0; i < count; i++) {
                for (let g of gs) {
                    const childA =
                        stateVariables[g].activeChildren[i].componentIdx;
                    expect(
                        stateVariables[childA].stateValues.xs.map(
                            (x) => x.tree,
                        ),
                    ).eqls(points1[i]);

                    const childB =
                        stateVariables[g].activeChildren[i + count]
                            .componentIdx;

                    expect(
                        stateVariables[childB].stateValues.xs.map(
                            (x) => x.tree,
                        ),
                    ).eqls(points2[i]);
                }
            }
        }

        // At beginning, nothing shown
        let from = 1,
            to = 2,
            count = 0;
        await check_items(from, to, count);

        // make sequence length 1
        count = 1;
        await updateMathInputValue({
            latex: count.toString(),
            componentIdx: await resolvePathToNodeIdx("sequenceCount"),
            core,
        });
        await check_items(from, to, count);

        // make sequence length 0 again
        count = 0;
        await updateMathInputValue({
            latex: count.toString(),
            componentIdx: await resolvePathToNodeIdx("sequenceCount"),
            core,
        });
        await check_items(from, to, count);

        // make sequence length 2
        count = 2;
        await updateMathInputValue({
            latex: count.toString(),
            componentIdx: await resolvePathToNodeIdx("sequenceCount"),
            core,
        });
        await check_items(from, to, count);

        // change limits
        from = 3;
        to = 5;
        await updateMathInputValue({
            latex: from.toString(),
            componentIdx: await resolvePathToNodeIdx("sequenceFrom"),
            core,
        });
        await updateMathInputValue({
            latex: to.toString(),
            componentIdx: await resolvePathToNodeIdx("sequenceTo"),
            core,
        });
        await check_items(from, to, count);

        // make sequence length 0 again
        count = 0;
        await updateMathInputValue({
            latex: count.toString(),
            componentIdx: await resolvePathToNodeIdx("sequenceCount"),
            core,
        });
        await check_items(from, to, count);

        // make sequence length 3
        count = 3;
        await updateMathInputValue({
            latex: count.toString(),
            componentIdx: await resolvePathToNodeIdx("sequenceCount"),
            core,
        });
        await check_items(from, to, count);
    });

    it("repeat points to adapt to math", async () => {
        // Note: math1 ends up getting math children from the repeat.
        // We aren't worrying about the interpretation of
        // the juxtaposition of vectors that the children represent.
        // We're just checking that the points from the repeat
        // are adapted into maths due to their math parent.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Number of points: <mathInput name="number"/></p>
    <p>Step size: <mathInput name="step" /></p>
    
    <setup>
        <sequence name="s" from="2" length="$number" step="$step" />
    </setup>
    <math name="math1">
      <repeat for="$s" valueName="n">
        <point>($n, sin($n))</point>
      </repeat>
    </math>
    `,
        });

        async function check_math_children(numPoints: number, step: number) {
            let from = 2;

            if (step === 0) {
                numPoints = 0;
            }

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("math1")]
                    .activeChildren.length,
            ).eq(numPoints);

            for (let i = 0; i < numPoints; i++) {
                let n = from + i * step;
                let child =
                    stateVariables[
                        stateVariables[await resolvePathToNodeIdx("math1")]
                            .activeChildren[i].componentIdx
                    ];
                // Note: coords is a type of math
                expect(child.componentType).eq("coords");

                if (Number.isInteger(n)) {
                    expect(child.stateValues.value.tree).eqls([
                        "vector",
                        n,
                        ["apply", "sin", n],
                    ]);
                } else {
                    let val = child.stateValues.value.tree;
                    expect(val[0]).eq("vector");
                    expect(val[1]).eq(n);
                    expect(val[2]).closeTo(Math.sin(n), 1e14);
                }
            }
        }

        // use 0 as a stand-in for undefined
        let numPoints = 0;
        let step = 0;

        await check_math_children(numPoints, step);

        numPoints = 10;
        await updateMathInputValue({
            latex: numPoints.toString(),
            componentIdx: await resolvePathToNodeIdx("number"),
            core,
        });
        await check_math_children(numPoints, step);

        step = 1;
        await updateMathInputValue({
            latex: step.toString(),
            componentIdx: await resolvePathToNodeIdx("step"),
            core,
        });
        await check_math_children(numPoints, step);

        numPoints = 20;
        await updateMathInputValue({
            latex: numPoints.toString(),
            componentIdx: await resolvePathToNodeIdx("number"),
            core,
        });
        await check_math_children(numPoints, step);

        step = 0.5;
        await updateMathInputValue({
            latex: step.toString(),
            componentIdx: await resolvePathToNodeIdx("step"),
            core,
        });
        await check_math_children(numPoints, step);

        numPoints = 10;
        await updateMathInputValue({
            latex: numPoints.toString(),
            componentIdx: await resolvePathToNodeIdx("number"),
            core,
        });
        await check_math_children(numPoints, step);

        // use 0 as a stand-in for undefined
        step = 0;
        await updateMathInputValue({
            latex: "",
            componentIdx: await resolvePathToNodeIdx("step"),
            core,
        });
        await check_math_children(numPoints, step);

        numPoints = 5;
        await updateMathInputValue({
            latex: numPoints.toString(),
            componentIdx: await resolvePathToNodeIdx("number"),
            core,
        });
        await check_math_children(numPoints, step);

        step = -3;
        await updateMathInputValue({
            latex: step.toString(),
            componentIdx: await resolvePathToNodeIdx("step"),
            core,
        });
        await check_math_children(numPoints, step);
    });

    it("repeat inside sources of repeat", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Number of points: <mathInput name="number"/></p>
    
    <setup>
      <sequence name="s" length="$number" />
    </setup>
    <repeat name="m1" for="$s" valueName="n">
      <point name="pt">($n, 2$n)</point>
    </repeat>

    <repeat name="m2" for="$m1" valueName="p">
      <point name="pt">($p.x^2, $p.y^2)</point>
    </repeat>

    <p name="p1a">$m1[1]</p>
    <p name="p1b">$m1[1].pt</p>
    <p name="p2a">$m1[2]</p>
    <p name="p2b">$m1[2].pt</p>
    <p name="p3a">$m1[3]</p>
    <p name="p3b">$m1[3].pt</p>

    <p name="q1a">$m2[1]</p>
    <p name="q1b">$m2[1].pt</p>
    <p name="q2a">$m2[2]</p>
    <p name="q2b">$m2[2].pt</p>
    <p name="q3a">$m2[3]</p>
    <p name="q3b">$m2[3].pt</p>

    `,
        });

        async function check_items(num: number) {
            let sources1 = [...Array(num).keys()].map((x) => x + 1);

            let points1 = sources1.map((n) => [n, 2 * n]);
            let points2 = points1.map((p) => [p[0] ** 2, p[1] ** 2]);

            let point1Texts = points1.map((p) => `( ${p[0]}, ${p[1]} )`);
            let point2Texts = points2.map((p) => `( ${p[0]}, ${p[1]} )`);

            let pNames1 = [
                ["p1a", "p1b"],
                ["p2a", "p2b"],
                ["p3a", "p3b"],
            ];
            let pNames2 = [
                ["q1a", "q1b"],
                ["q2a", "q2b"],
                ["q3a", "q3b"],
            ];

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            for (let n = 0; n < 3; n++) {
                for (let i = 0; i < 2; i++) {
                    expect(
                        stateVariables[
                            await resolvePathToNodeIdx(pNames1[n][i])
                        ].stateValues.text,
                    ).eq(point1Texts[n] || "");
                    expect(
                        stateVariables[
                            await resolvePathToNodeIdx(pNames2[n][i])
                        ].stateValues.text,
                    ).eq(point2Texts[n] || "");
                }
            }
        }

        let num = 0;

        await check_items(num);

        // set number to be 2
        num = 2;
        await updateMathInputValue({
            latex: num.toString(),
            componentIdx: await resolvePathToNodeIdx("number"),
            core,
        });
        await check_items(num);

        // set number to be 1
        num = 1;
        await updateMathInputValue({
            latex: num.toString(),
            componentIdx: await resolvePathToNodeIdx("number"),
            core,
        });
        await check_items(num);

        // set number to be 3
        num = 3;
        await updateMathInputValue({
            latex: num.toString(),
            componentIdx: await resolvePathToNodeIdx("number"),
            core,
        });
        await check_items(num);

        // set number back to zero
        num = 0;
        await updateMathInputValue({
            latex: num.toString(),
            componentIdx: await resolvePathToNodeIdx("number"),
            core,
        });
        await check_items(num);

        // set number back to 1
        num = 1;
        await updateMathInputValue({
            latex: num.toString(),
            componentIdx: await resolvePathToNodeIdx("number"),
            core,
        });
        await check_items(num);
    });

    it("cannot override fixed of source index", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <repeat name="r1" for="red yellow" type="text" indexName="i">
        <integer extend="$i" name="ind" />
        <mathInput name="mi">$ind</mathInput>
    </repeat>
    <repeat name="r2" for="red yellow" type="text" indexName="i">
        <integer extend="$i" name="ind" fixed="false" />
        <mathInput name="mi">$ind</mathInput>
    </repeat>


    `,
        });

        const r1 = await resolvePathToNodeIdx("r1");
        const r2 = await resolvePathToNodeIdx("r2");

        async function check_items(a: number, b: number, c: number, d: number) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("r1[1].ind")]
                    .stateValues.value,
            ).eqls(a);
            expect(
                stateVariables[await resolvePathToNodeIdx("r1[2].ind")]
                    .stateValues.value,
            ).eqls(b);
            expect(
                stateVariables[await resolvePathToNodeIdx("r2[1].ind")]
                    .stateValues.value,
            ).eqls(c);
            expect(
                stateVariables[await resolvePathToNodeIdx("r2[2].ind")]
                    .stateValues.value,
            ).eqls(d);
        }

        async function set_items(a: string, b: string, c: string, d: string) {
            await updateMathInputValue({
                latex: a,
                componentIdx: await resolvePathToNodeIdx("r1[1].mi"),
                core,
            });
            await updateMathInputValue({
                latex: b,
                componentIdx: await resolvePathToNodeIdx("r1[2].mi"),
                core,
            });
            await updateMathInputValue({
                latex: c,
                componentIdx: await resolvePathToNodeIdx("r2[1].mi"),
                core,
            });
            await updateMathInputValue({
                latex: d,
                componentIdx: await resolvePathToNodeIdx("r2[2].mi"),
                core,
            });
        }

        await check_items(1, 2, 1, 2);

        await set_items("3", "4", "5", "6");
        await check_items(1, 2, 1, 2);

        await set_items("x", "x", "x", "x");
        await check_items(1, 2, 1, 2);

        await set_items("7", "8", "9", "10");
        await check_items(1, 2, 1, 2);
    });

    it("repeats hide dynamically", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <booleanInput name='h1' prefill="false" >
      <label>Hide first repeat</label>
    </booleanInput>
    <booleanInput name='h2' prefill="true" >
      <label>Hide second repeat</label>
    </booleanInput>
    <p>Length of repeat 1: <mathInput name="n1" prefill="4" /></p>
    <p>Length of repeat 2: <mathInput name="n2" prefill="4" /></p>

    <setup>
        <sequence name="s1" length="$n1" />
        <sequence name="s2" length="$n2" />
    </setup>
    <p name="m1">repeat 1: <repeat hide="$h1" for="$s1" valueName="a">
        hi$a
    </repeat></p>
    <p name="m2">repeat 2: <repeat hide="$h2" for="$s2" valueName="a">
        hi$a
    </repeat></p>
    `,
        });

        async function check_items(
            h1: boolean,
            h2: boolean,
            n1: number,
            n2: number,
        ) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            if (h1) {
                expect(
                    stateVariables[await resolvePathToNodeIdx("m1")].stateValues
                        .text,
                ).eq("repeat 1: ");
            } else {
                let m1text =
                    "repeat 1: " +
                    [...Array(n1).keys()].map((v) => `hi${v + 1}`).join(", ");
                expect(
                    stateVariables[await resolvePathToNodeIdx("m1")].stateValues
                        .text,
                ).eq(m1text);
            }

            if (h2) {
                expect(
                    stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                        .text,
                ).eq("repeat 2: ");
            } else {
                let m2text =
                    "repeat 2: " +
                    [...Array(n2).keys()].map((v) => `hi${v + 1}`).join(", ");
                expect(
                    stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                        .text,
                ).eq(m2text);
            }
        }

        async function set_ns(n1: number, n2: number) {
            await updateMathInputValue({
                latex: n1.toString(),
                componentIdx: await resolvePathToNodeIdx("n1"),
                core,
            });
            await updateMathInputValue({
                latex: n2.toString(),
                componentIdx: await resolvePathToNodeIdx("n2"),
                core,
            });
        }

        async function set_hs(h1: boolean, h2: boolean) {
            await updateBooleanInputValue({
                boolean: h1,
                componentIdx: await resolvePathToNodeIdx("h1"),
                core,
            });
            await updateBooleanInputValue({
                boolean: h2,
                componentIdx: await resolvePathToNodeIdx("h2"),
                core,
            });
        }

        let h1 = false,
            h2 = true,
            n1 = 4,
            n2 = 4;

        await check_items(h1, h2, n1, n2);

        n1 = 6;
        n2 = 6;
        await set_ns(n1, n2);
        await check_items(h1, h2, n1, n2);

        h1 = true;
        h2 = false;
        await set_hs(h1, h2);
        await check_items(h1, h2, n1, n2);

        n1 = 8;
        n2 = 8;
        await set_ns(n1, n2);
        await check_items(h1, h2, n1, n2);

        h1 = false;
        h2 = true;
        await set_hs(h1, h2);
        await check_items(h1, h2, n1, n2);

        n1 = 3;
        n2 = 3;
        await set_ns(n1, n2);
        await check_items(h1, h2, n1, n2);

        h1 = true;
        h2 = false;
        await set_hs(h1, h2);
        await check_items(h1, h2, n1, n2);

        n1 = 4;
        n2 = 4;
        await set_ns(n1, n2);
        await check_items(h1, h2, n1, n2);
    });

    function create_as_list_template(inner_content: string) {
        return `
      <setup>
        <sequence name="s" />
      </setup>
      <p name="pdefault">
        <repeat name="default" for="$s" valueName="v">
            ${inner_content}
        </repeat>
      </p>
      <p name="pnocommas">
        <repeat name="nocommas" asList="false" for="$s" valueName="v">
            ${inner_content}
        </repeat>
      </p>
      <p name="pwithcommas">
        <repeat name="withcommas" asList for="$s" valueName="v">
            ${inner_content}
        </repeat>
      </p>
      <p name="pdefault2">$default</p>
      <p name="pnocommas2">$nocommas</p>
      <p name="pwithcommas2">$withcommas</p>
      <p name="pnocommas3"><repeat extend="$default" asList="false" /></p>
      <p name="pnocommas3a"><repeat extend="$withcommas" asList="false" /></p>
      <p name="pwithcommas3"><repeat extend="$nocommas" asList="true" /></p>
      <p name="pdefault4" extend="$pdefault" />
      <p name="pnocommas4" extend="$pnocommas" />
      <p name="pwithcommas4" extend="$pwithcommas" />
      <p name="pdefault5" extend="$pdefault2" />
      <p name="pnocommas5" extend="$pnocommas2" />
      <p name="pwithcommas5" extend="$pwithcommas2" />
      <p name="pnocommas6" extend="$pnocommas3" />
      <p name="pnocommas6a" extend="$pnocommas3a" />
      <p name="pwithcommas6" extend="$pwithcommas3" />
    `;
    }

    async function test_as_list_maps(
        core,
        items: string[],
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        let pTextCommas = items.join(", ");
        let pTextNoCommas = items.join("");

        let commaNames = [
            "pdefault",
            "pwithcommas",
            "pdefault2",
            "pwithcommas2",
            "pwithcommas3",
            "pdefault4",
            "pwithcommas4",
            "pdefault5",
            "pwithcommas5",
            "pwithcommas6",
        ];
        let noCommaNames = [
            "pnocommas",
            "pnocommas2",
            "pnocommas3",
            "pnocommas3a",
            "pnocommas4",
            "pnocommas5",
            "pnocommas6",
            "pnocommas6a",
        ];

        const stateVariables = await core.returnAllStateVariables(false, true);

        for (let name of commaNames) {
            // Note: we do not remove whitespace that has a following commas,
            // as we want to test that the whitespace before a comma is removed.

            expect(
                stateVariables[
                    await resolvePathToNodeIdx(name)
                ].stateValues.text
                    .replace(/\s+(?!,)/g, " ")
                    .trim(),
            ).eq(pTextCommas);
        }
        for (let name of noCommaNames) {
            expect(
                stateVariables[
                    await resolvePathToNodeIdx(name)
                ].stateValues.text
                    .replace(/\s+(?!,)/g, " ")
                    .trim(),
            ).eq(pTextNoCommas);
        }
    }

    it("repeat displays as list by default, single number in template", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: create_as_list_template(`<number>$v^2</number>`),
        });

        let numbers = [...Array(10).keys()].map((v) => String((v + 1) ** 2));

        await test_as_list_maps(core, numbers, resolvePathToNodeIdx);
    });

    it("repeat displays as list by default, number and string in template", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: create_as_list_template(`
            <number>$v^2</number>
            x`),
        });

        let numbers = [...Array(10).keys()].map(
            (v) => String((v + 1) ** 2) + " x",
        );

        await test_as_list_maps(core, numbers, resolvePathToNodeIdx);
    });

    it("repeat displays as list by default, number, string and math in template", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: create_as_list_template(`
            <number>$v^2</number>
            <math>x</math>`),
        });

        let numbers = [...Array(10).keys()].map(
            (v) => String((v + 1) ** 2) + " x",
        );

        await test_as_list_maps(core, numbers, resolvePathToNodeIdx);
    });

    it("repeat will display as list even if if has non-inline components with canBeInList set", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <setup>
        <sequence to="3" name="s" />
      </setup>
      <p name="p1"><repeat for="$s" valueName="v">
        <point>($v, $v^2)</point>
      </repeat></p>
      <p name="p2"><repeat for="$s" valueName="v">
        <vector>($v, $v^2)</vector>
      </repeat></p>
      <p name="p3"><repeat for="$s" valueName="v">
        <line>y=$v</line>
      </repeat></p>
      <p name="p4"><repeat for="$s" valueName="v">
        <angle>2$v</angle>
      </repeat></p>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq("( 1, 1 ), ( 2, 4 ), ( 3, 9 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq("( 1, 1 ), ( 2, 4 ), ( 3, 9 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("p3")].stateValues.text,
        ).eq("y = 1, y = 2, y = 3");
        expect(
            stateVariables[await resolvePathToNodeIdx("p4")].stateValues.text,
        ).eq("2, 4, 6");
    });

    it("isResponse", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup><sequence name="s" length="2" /></setup>
    <repeat isResponse valueName="v" for="$s" name="r">
        <p name="p">hi $v</p>
    </repeat>
    <repeat valueName="v" for="$s" name="r2">
        <p name="p">hi $v</p>
    </repeat>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("r[1].p")].stateValues
                .text,
        ).eq("hi 1");
        expect(
            stateVariables[await resolvePathToNodeIdx("r[2].p")].stateValues
                .text,
        ).eq("hi 2");
        expect(
            stateVariables[await resolvePathToNodeIdx("r[1].p")].stateValues
                .isResponse,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("r[2].p")].stateValues
                .isResponse,
        ).eq(true);

        expect(
            stateVariables[await resolvePathToNodeIdx("r2[1].p")].stateValues
                .text,
        ).eq("hi 1");
        expect(
            stateVariables[await resolvePathToNodeIdx("r2[2].p")].stateValues
                .text,
        ).eq("hi 2");
        expect(
            stateVariables[await resolvePathToNodeIdx("r2[1].p")].stateValues
                .isResponse,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("r2[2].p")].stateValues
                .isResponse,
        ).eq(false);
    });

    it("repeat iterates over lists", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathList name="ml">x y</mathList>
    <textList name="tl">dog cat</textList>
    <numberList name="nl">1 2</numberList>
    <booleanList name="bl">true false</booleanList>

    <repeat name="m" valueName="v" for="$ml">
        <math name="math">2$v</math>
    </repeat>
    <repeat name="n" valueName="v" for="$nl">
        <number name="number">2$v</number>
    </repeat>
    <repeat name="t" valueName="v" for="$tl">
        <text name="text">Hello $v!</text>
    </repeat>
    <repeat name="b" valueName="v" for="$bl">
        <boolean name="boolean">not$v</boolean>
    </repeat>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("m[1].math")].stateValues
                .value.tree,
        ).eqls(["*", 2, "x"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m[2].math")].stateValues
                .value.tree,
        ).eqls(["*", 2, "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("n[1].number")]
                .stateValues.value,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("n[2].number")]
                .stateValues.value,
        ).eq(4);
        expect(
            stateVariables[await resolvePathToNodeIdx("t[1].text")].stateValues
                .value,
        ).eq("Hello dog!");
        expect(
            stateVariables[await resolvePathToNodeIdx("t[2].text")].stateValues
                .value,
        ).eq("Hello cat!");
        expect(
            stateVariables[await resolvePathToNodeIdx("b[1].boolean")]
                .stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b[2].boolean")]
                .stateValues.value,
        ).eq(true);
    });

    it("repeat iterates over combination of list, group, sequence, components, and string", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup>
        <mathList name="ml">1 2</mathList>
        <group name="g">
            <number>3</number>
            <number>4</number>
        </group>
        <sequence name="s" from="5" to="6" />
        <number name="n7">7</number>
        <math name="m8">8</math>
    </setup>
    <repeat for="$ml $g $s $n7 $m8 9" valueName="n" name="r">
        <number name="number">$n^2</number>
    </repeat>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        for (let i = 1; i <= 9; i++) {
            expect(
                stateVariables[await resolvePathToNodeIdx(`r[${i}].number`)]
                    .stateValues.value,
            ).eq(i ** 2);
        }
    });

    it("type attribute wraps string", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <repeat for="x^2 y^2" valueName="x" name="rDefault">
        $x
    </repeat>
    <repeat type="math" for="ab cd" valueName="x" name="rMath">
        $x
    </repeat>
    <repeat type="number" for="5 6" valueName="x" name="rNumber">
        $x
    </repeat>
    <repeat type="text" for="hello there" valueName="x" name="rText">
        $x
    </repeat>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        // Unwrap the group and then the copy, then get the value state variable
        async function unwrap(name: string) {
            return stateVariables[
                stateVariables[
                    stateVariables[await resolvePathToNodeIdx(name)]
                        .replacements![0].componentIdx
                ].replacements![0].componentIdx
            ].stateValues.value;
        }

        expect((await unwrap(`rDefault[1]`)).tree).eqls(["^", "x", 2]);
        expect((await unwrap(`rDefault[2]`)).tree).eqls(["^", "y", 2]);
        expect((await unwrap(`rMath[1]`)).tree).eqls(["*", "a", "b"]);
        expect((await unwrap(`rMath[2]`)).tree).eqls(["*", "c", "d"]);
        expect(await unwrap(`rNumber[1]`)).eq(5);
        expect(await unwrap(`rNumber[2]`)).eq(6);
        expect(await unwrap(`rText[1]`)).eq("hello");
        expect(await unwrap(`rText[2]`)).eq("there");
    });

    it("restore state with answers", async () => {
        const doenetML = `
        <p>n: <mathInput name="n" prefill="0" /></p>
        <setup>
            <sequence name="s" length="$n" />
        </setup>
        <repeat for="$s" valueName="v" name="r">
            <p name="p">$v + $v = <answer name="ans">2$v</answer></p>
        </repeat>
        `;

        async function check_items(count: number, answers: number[]) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("n")].stateValues
                    .value.tree,
            ).eq(count);

            for (let i = 0; i < count; i++) {
                const pIdx = await resolvePathToNodeIdx(`r[${i + 1}].p`);
                const ansIdx = await resolvePathToNodeIdx(`r[${i + 1}].ans`);
                const mathInputIdx =
                    stateVariables[ansIdx].activeChildren[0].componentIdx;

                expect(stateVariables[pIdx].stateValues.text.trim()).eq(
                    `${i + 1} + ${i + 1} =`,
                );

                expect(stateVariables[mathInputIdx].stateValues.value.tree).eq(
                    answers[i],
                );

                expect(stateVariables[ansIdx].stateValues.creditAchieved).eq(1);
                expect(stateVariables[ansIdx].stateValues.justSubmitted).eq(
                    true,
                );
            }
        }

        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });

        await check_items(0, []);

        // set to length 1 and submit correct answer
        let count = 1;
        await updateMathInputValue({
            latex: count.toString(),
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        const ansIdx1 = await resolvePathToNodeIdx(`r[1].ans`);
        const mathInputIdx1 =
            stateVariables[ansIdx1].activeChildren[0].componentIdx;

        await updateMathInputValue({
            latex: "2",
            componentIdx: mathInputIdx1,
            core,
        });

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("r[1].ans"),
            core,
        });
        await check_items(1, [2]);

        // set to length 2 and submit correct answers
        count = 2;
        await updateMathInputValue({
            latex: count.toString(),
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        const ansIdx2 = await resolvePathToNodeIdx(`r[2].ans`);
        const mathInputIdx2 =
            stateVariables[ansIdx2].activeChildren[0].componentIdx;

        await updateMathInputValue({
            latex: "4",
            componentIdx: mathInputIdx2,
            core,
        });

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("r[2].ans"),
            core,
        });
        await check_items(2, [2, 4]);

        const endingState = scoreState.state;

        // reload with saved state
        ({ core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
            initialState: endingState,
        }));

        await check_items(2, [2, 4]);
    });

    it("restore state with answers, copied", async () => {
        const doenetML = `
    <section name="sec1">
    <p>n: <mathInput name="n" prefill="0" /></p>
    <setup>
        <sequence name="s" length="$n" />
    </setup>
    <repeat for="$s" valueName="v" name="r">
        <p name="p">$v + $v = <answer name="ans">2$v</answer></p>
    </repeat>
    </section>
    <section name="sec2">
        <repeat copy="$sec1.r" name="r" />
    </section>
    <section name="sec3" copy="$sec1" />
    <section name="sec4" copy="$sec2" />
    `;

        async function check_items(count: number, answers: number[][]) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("n")].stateValues
                    .value.tree,
            ).eq(count);

            for (let i = 0; i < count; i++) {
                for (let j = 1; j <= 4; j++) {
                    const pIdx = await resolvePathToNodeIdx(
                        `sec${j}.r[${i + 1}].p`,
                    );
                    const ansIdx = await resolvePathToNodeIdx(
                        `sec${j}.r[${i + 1}].ans`,
                    );
                    const mathInputIdx =
                        stateVariables[ansIdx].activeChildren[0].componentIdx;

                    expect(stateVariables[pIdx].stateValues.text.trim()).eq(
                        `${i + 1} + ${i + 1} =`,
                    );

                    expect(
                        stateVariables[mathInputIdx].stateValues.value.tree,
                    ).eq(answers[j - 1][i]);

                    expect(
                        stateVariables[ansIdx].stateValues.creditAchieved,
                    ).eq(j == 1 ? 1 : 0);
                    expect(stateVariables[ansIdx].stateValues.justSubmitted).eq(
                        true,
                    );
                    expect(
                        stateVariables[ansIdx].stateValues.showCorrectness,
                    ).eq(true);
                }
            }
        }

        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });

        await check_items(0, []);

        // set to length 1 and submit answers
        let count = 1;
        await updateMathInputValue({
            latex: count.toString(),
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await updateMathInputValue({
            latex: count.toString(),
            componentIdx: await resolvePathToNodeIdx("sec3.n"),
            core,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        const ansIdx1s: number[] = [];
        for (let j = 1; j <= 4; j++) {
            ansIdx1s.push(await resolvePathToNodeIdx(`sec${j}.r[1].ans`));
        }

        const mathInputIdx1s = ansIdx1s.map(
            (ansIdx1) => stateVariables[ansIdx1].activeChildren[0].componentIdx,
        );

        const answers: number[][] = [[], [], [], []];

        for (let j = 0; j < 4; j++) {
            answers[j].push(2 + 10 * j);

            await updateMathInputValue({
                latex: answers[j][0].toString(),
                componentIdx: mathInputIdx1s[j],
                core,
            });
            await submitAnswer({
                componentIdx: ansIdx1s[j],
                core,
            });
        }

        await check_items(1, answers);

        // set to length 2 and submit correct answers
        count = 2;
        await updateMathInputValue({
            latex: count.toString(),
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });

        await updateMathInputValue({
            latex: count.toString(),
            componentIdx: await resolvePathToNodeIdx("sec3.n"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        const ansIdx2s: number[] = [];
        for (let j = 1; j <= 4; j++) {
            ansIdx2s.push(await resolvePathToNodeIdx(`sec${j}.r[2].ans`));
        }

        const mathInputIdx2s = ansIdx2s.map(
            (ansIdx2) => stateVariables[ansIdx2].activeChildren[0].componentIdx,
        );

        for (let j = 0; j < 4; j++) {
            answers[j].push(4 + 10 * j);

            await updateMathInputValue({
                latex: answers[j][1].toString(),
                componentIdx: mathInputIdx2s[j],
                core,
            });
            await submitAnswer({
                componentIdx: ansIdx2s[j],
                core,
            });
        }

        await check_items(2, answers);

        const endingState = scoreState.state;

        // reload with saved state
        ({ core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
            initialState: endingState,
        }));

        await check_items(2, answers);
    });
});

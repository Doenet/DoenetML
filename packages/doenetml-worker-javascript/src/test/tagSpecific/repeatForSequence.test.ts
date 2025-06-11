import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    movePoint,
    updateBooleanInputValue,
    updateMathInputValue,
    updateValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("RepeatForSequence tag tests", async () => {
    it("defaults to number sequence", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <p name="p"><repeatForSequence from="6" to="9" itemName="n" name="r">
      <math name="m" simplify>$n^2</math>
    </repeatForSequence></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables[resolveComponentName("p")].stateValues.text).eq(
            "36, 49, 64, 81",
        );

        for (let i = 6; i <= 9; i++) {
            expect(
                stateVariables[resolveComponentName(`r[${i - 5}].m`)]
                    .stateValues.value.tree,
            ).eq(i ** 2);
        }
    });

    it("explicit number sequence", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <p name="p"><repeatForSequence type="number" from="2" to="8" step="2" exclude="4" itemName="n" name="r">
      <math name="m" simplify>$n^2</math>
    </repeatForSequence></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables[resolveComponentName("p")].stateValues.text).eq(
            "4, 36, 64",
        );

        for (let i = 1; i <= 3; i++) {
            let val = i;
            if (i > 1) {
                val++;
            }
            val *= 2;
            val = val ** 2;

            expect(
                stateVariables[resolveComponentName(`r[${i}].m`)].stateValues
                    .value.tree,
            ).eq(val);
        }
    });

    it("letters sequence", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <p name="p"><repeatForSequence asList="false" type="letters" from="f" to="l" step="3" exclude="i" itemName="l" name="r">
      <text name="t">We have $l. </text>
    </repeatForSequence></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables[resolveComponentName("p")].stateValues.text).eq(
            "We have f. We have l. ",
        );

        expect(
            stateVariables[resolveComponentName(`r[1].t`)].stateValues.value,
        ).eq("We have f. ");

        expect(
            stateVariables[resolveComponentName(`r[2].t`)].stateValues.value,
        ).eq("We have l. ");
    });

    it("math sequence", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <p name="p"><repeatForSequence type="math" from="x" step="h" length="3" itemName="x" name="r">
      <math name="m" simplify>$x - h</math>
    </repeatForSequence></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables[resolveComponentName("p")].stateValues.text).eq(
            "-h + x, x, h + x",
        );

        expect(
            stateVariables[resolveComponentName(`r[1].m`)].stateValues.value
                .tree,
        ).eqls(["+", ["-", "h"], "x"]);
        expect(
            stateVariables[resolveComponentName(`r[2].m`)].stateValues.value
                .tree,
        ).eqls("x");
        expect(
            stateVariables[resolveComponentName(`r[3].m`)].stateValues.value
                .tree,
        ).eqls(["+", "h", "x"]);
    });

    it("two nested repeatForSequences", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <p name="p"><repeatForSequence from="-10" to="10" step="15" itemName="n" indexName="j">
      <repeatForSequence from="1" to="2" itemName="m" indexName="i">
          <math simplify>$m+$n</math> and <math simplify>$i+2$j</math>
        </repeatForSequence>
    </repeatForSequence></p>

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

        expect(stateVariables[resolveComponentName("p")].stateValues.text).eq(
            pText,
        );
    });

    it("three nested repeatForSequences with graphs and copied", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <repeatForSequence name="repeat1" from="-10" to="5" step="15" itemName="n" indexName="k">
      <graph>
        <repeatForSequence from="-5" to="5" step="10" itemName="m" indexName="j">
          <repeatForSequence from="1" to="2" itemName="l" indexName="i">
              <point>($l+$n, $m)</point><point>($i+2*$k, $j)</point>
            </repeatForSequence>
        </repeatForSequence>
      </graph>
    </repeatForSequence>
    <repeatForSequence extend="$repeat1" name="repeatCopy" />
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

        function checkRepeat(repeatName: string) {
            let graphIndices = stateVariables[
                resolveComponentName(repeatName)
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

        checkRepeat("repeat1");
        checkRepeat("repeatCopy");
    });

    it("three nested repeats with graphs and referenced coords", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <repeatForSequence  from="-10" to="5" step="15" name="r1" itemName="n">
      <graph name="graph1">
        <repeatForSequence from="-5" to="5" step="10" name="r2" itemName="m">
            <repeatForSequence from="1" to="2" name="r3" itemName="l">
                <point name="A">($l+$n, $m)</point>
            </repeatForSequence>
        </repeatForSequence>
      </graph>
    </repeatForSequence>
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

        const r1 = resolveComponentName("r1");

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
                    const pointIdx = resolveComponentName(
                        `r1[${i1 + 1}].r2[${i2 + 1}].r3[${i3 + 1}].A`,
                    );

                    expect(
                        stateVariables[pointIdx].stateValues.xs.map(
                            (x) => x.tree,
                        ),
                    ).eqls(pointsByRepeat[i1][i2][i3]);

                    let cIdx = resolveComponentName(cNames.pop()!);

                    expect(stateVariables[cIdx!].stateValues.value.tree).eqls([
                        "vector",
                        ...pointsByRepeat[i1][i2][i3],
                    ]);
                }
            }
        }
    });

    it("repeatForSequence with copies", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <p name="p1"><repeatForSequence name="repeat1" from="3" to="4" itemName="n" indexName="j">
    <math simplify>
        <number extend="$n" name="b" /> + <number extend="$j" name="i" /> + $a 
        + <math name="q">z</math> + $q + $b +$i
      </math> and <math>x</math>
    </repeatForSequence></p>
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

        expect(stateVariables[resolveComponentName("p1")].stateValues.text).eq(
            pText,
        );
        expect(stateVariables[resolveComponentName("p2")].stateValues.text).eq(
            pText,
        );
    });

    it("repeatForSequence with copies, extended dynamically", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <number name="length">1</number>
    <p name="p1"><repeatForSequence name="repeat1" from="3" length="$length" itemName="n" indexName="j">
    <math simplify>
        <number extend="$n" name="b" /> + <number extend="$j" name="i" /> + $a 
        + <math name="q">z</math> + $q + $b +$i
      </math> and <math>x</math>
    </repeatForSequence></p>
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
        expect(stateVariables[resolveComponentName("p1")].stateValues.text).eq(
            pText,
        );
        expect(stateVariables[resolveComponentName("p2")].stateValues.text).eq(
            pText,
        );
        expect(stateVariables[resolveComponentName("p3")].stateValues.text).eq(
            pText,
        );

        // Double the length then test again
        await updateValue({ componentIdx: resolveComponentName("uv"), core });

        pText = textForLength(2);
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[resolveComponentName("p1")].stateValues.text).eq(
            pText,
        );
        expect(stateVariables[resolveComponentName("p2")].stateValues.text).eq(
            pText,
        );
        expect(stateVariables[resolveComponentName("p3")].stateValues.text).eq(
            pText,
        );

        // Double the length again then test one more time
        await updateValue({ componentIdx: resolveComponentName("uv"), core });

        pText = textForLength(4);
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[resolveComponentName("p1")].stateValues.text).eq(
            pText,
        );
        expect(stateVariables[resolveComponentName("p2")].stateValues.text).eq(
            pText,
        );
        expect(stateVariables[resolveComponentName("p3")].stateValues.text).eq(
            pText,
        );
    });

    it("repeatForSequence copying value from other repeat", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <repeatForSequence name="r1" from="1" to="3" itemName="n">
      <math name="math">($n, $r2[3].n2)</math>
    </repeatForSequence>
    <repeatForSequence name="r2" from="4" to="6" itemName="n">
      <math name="math">sin(<number extend="$n" name="n2" />)</math>
    </repeatForSequence>
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
                stateVariables[resolveComponentName(names1[i])].stateValues
                    .text,
            ).eq(maths1[i]);

            expect(
                stateVariables[resolveComponentName(names2[i])].stateValues
                    .text,
            ).eq(maths2[i]);
        }
    });

    it("repeatForSequence length depending on other repeat", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    
    <p name="p"><repeatForSequence from="1" to="3" itemName="b"><repeatForSequence from="1" to="$b" itemName="a">
            <math>($a, $b)</math>
        </repeatForSequence>
    </repeatForSequence></p>
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
        expect(stateVariables[resolveComponentName("p")].stateValues.text).eq(
            pText,
        );
    });

    it("repeatForSequence begins zero length, copied multiple times", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <p name="p1"><repeatForSequence name="repeat1" from="$sequenceFrom" to="$sequenceTo" length="$sequenceCount" itemName="n">
        <math simplify>$n^2</math>
    </repeatForSequence></p>

    <mathInput name="sequenceFrom" prefill="1"/>
    <mathInput name="sequenceTo" prefill="2"/>
    <mathInput name="sequenceCount" prefill="0"/>
    
    <p name="p2"><repeatForSequence extend="$repeat1" name="copyRepeat2" /></p>
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
                    stateVariables[resolveComponentName(`p${i}`)].stateValues
                        .text,
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
            componentIdx: resolveComponentName("sequenceCount"),
            core,
        });
        await check_items(from, to, count);

        // make sequence length 0 again
        count = 0;
        await updateMathInputValue({
            latex: count.toString(),
            componentIdx: resolveComponentName("sequenceCount"),
            core,
        });
        await check_items(from, to, count);

        // make sequence length 2
        count = 2;
        await updateMathInputValue({
            latex: count.toString(),
            componentIdx: resolveComponentName("sequenceCount"),
            core,
        });
        await check_items(from, to, count);

        // change limits
        from = 3;
        to = 5;
        await updateMathInputValue({
            latex: from.toString(),
            componentIdx: resolveComponentName("sequenceFrom"),
            core,
        });
        await updateMathInputValue({
            latex: to.toString(),
            componentIdx: resolveComponentName("sequenceTo"),
            core,
        });
        await check_items(from, to, count);

        // make sequence length 0 again
        count = 0;
        await updateMathInputValue({
            latex: count.toString(),
            componentIdx: resolveComponentName("sequenceCount"),
            core,
        });
        await check_items(from, to, count);

        // make sequence length 3
        count = 3;
        await updateMathInputValue({
            latex: count.toString(),
            componentIdx: resolveComponentName("sequenceCount"),
            core,
        });
        await check_items(from, to, count);
    });

    it("repeatForSequence with seemingly circular dependence", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <graph>
      <repeatForSequence from="2" to="4"  itemName="n" name="repeat">
        <point name="P1">
            ($q$n^2,
            $P2.x)
          </point><point name="P2">
            ($r$n,
            $P1.x)
          </point>
      </repeatForSequence>
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
                const p1 = resolveComponentName(`repeat[${ind + 1}].P1`);
                const p2 = resolveComponentName(`repeat[${ind + 1}].P2`);
                expect(
                    rnd(stateVariables[p1].stateValues.xs.map((x) => x.tree)),
                ).eqls(P1s[ind]);
                expect(
                    rnd(stateVariables[p2].stateValues.xs.map((x) => x.tree)),
                ).eqls(P2s[ind]);

                expect(
                    rnd(
                        stateVariables[resolveComponentName(`c${ind * 2 + 1}`)]
                            .stateValues.value.tree,
                    ),
                ).eqls(["vector", ...P1s[ind]]);
                expect(
                    rnd(
                        stateVariables[resolveComponentName(`c${ind * 2 + 2}`)]
                            .stateValues.value.tree,
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
            componentIdx: resolveComponentName(`repeat[1].P1`),
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
            componentIdx: resolveComponentName(`repeat[1].P2`),
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
            componentIdx: resolveComponentName(`repeat[2].P1`),
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
            componentIdx: resolveComponentName(`repeat[2].P2`),
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
            componentIdx: resolveComponentName(`repeat[3].P1`),
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
            componentIdx: resolveComponentName(`repeat[3].P2`),
            x: P2s[2][0],
            y: P2s[2][1],
            core,
        });
        await check_items(q, r);
    });

    it("two repeatForSequences with mutual copies, begin zero length, copied multiple times", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <graph name="g1">
      <repeatForSequence name="repeat1" from="$sequenceFrom" to="$sequenceTo" length="$sequenceCount" itemName="n">
        <point name="P">
            (-$n, $n($repeat2[1].P.x))
          </point>
      </repeatForSequence>
      <repeatForSequence name="repeat2" from="$sequenceFrom" to="$sequenceTo" length="$sequenceCount" itemName="n">
        <point name="P">
            ($n, $n($repeat1[1].P.x))
          </point>
      </repeatForSequence>
    </graph>
    
    <mathInput name="sequenceFrom" prefill="1"/>
    <mathInput name="sequenceTo" prefill="2"/>
    <mathInput name="sequenceCount" prefill="0"/>
    
    <graph name="g2">
        <repeatForSequence name="copyRepeat1" extend="$repeat1" />
        <repeatForSequence name="copyRepeat2" extend="$repeat2" />
    </graph>
    <graph name="g3">
        <repeatForSequence name="copyRepeat1b" extend="$copyRepeat1" />
        <repeatForSequence name="copyRepeat2b" extend="$copyRepeat2" />
    </graph>
    
    <graph name="g4" extend="$g1" />
    `,
        });

        const g1 = resolveComponentName("g1");
        const g2 = resolveComponentName("g2");
        const g3 = resolveComponentName("g3");
        const g4 = resolveComponentName("g4");
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
            componentIdx: resolveComponentName("sequenceCount"),
            core,
        });
        await check_items(from, to, count);

        // make sequence length 0 again
        count = 0;
        await updateMathInputValue({
            latex: count.toString(),
            componentIdx: resolveComponentName("sequenceCount"),
            core,
        });
        await check_items(from, to, count);

        // make sequence length 2
        count = 2;
        await updateMathInputValue({
            latex: count.toString(),
            componentIdx: resolveComponentName("sequenceCount"),
            core,
        });
        await check_items(from, to, count);

        // change limits
        from = 3;
        to = 5;
        await updateMathInputValue({
            latex: from.toString(),
            componentIdx: resolveComponentName("sequenceFrom"),
            core,
        });
        await updateMathInputValue({
            latex: to.toString(),
            componentIdx: resolveComponentName("sequenceTo"),
            core,
        });
        await check_items(from, to, count);

        // make sequence length 0 again
        count = 0;
        await updateMathInputValue({
            latex: count.toString(),
            componentIdx: resolveComponentName("sequenceCount"),
            core,
        });
        await check_items(from, to, count);

        // make sequence length 3
        count = 3;
        await updateMathInputValue({
            latex: count.toString(),
            componentIdx: resolveComponentName("sequenceCount"),
            core,
        });
        await check_items(from, to, count);
    });

    it("repeatForSequence points to adapt to math", async () => {
        // Note: math1 ends up getting math children from the repeatForSequence.
        // We aren't worrying about the interpretation of
        // the juxtaposition of vectors that the children represent.
        // We're just checking that the points from the repeatForSequence
        // are adapted into maths due to their math parent.
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <p>Number of points: <mathInput name="number"/></p>
    <p>Step size: <mathInput name="step" /></p>
    
    <math name="math1">
      <repeatForSequence from="2" length="$number" step="$step"  itemName="n">
        <point>($n, sin($n))</point>
      </repeatForSequence>
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
                stateVariables[resolveComponentName("math1")].activeChildren
                    .length,
            ).eq(numPoints);

            for (let i = 0; i < numPoints; i++) {
                let n = from + i * step;
                let child =
                    stateVariables[
                        stateVariables[resolveComponentName("math1")]
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
            componentIdx: resolveComponentName("number"),
            core,
        });
        await check_math_children(numPoints, step);

        step = 1;
        await updateMathInputValue({
            latex: step.toString(),
            componentIdx: resolveComponentName("step"),
            core,
        });
        await check_math_children(numPoints, step);

        numPoints = 20;
        await updateMathInputValue({
            latex: numPoints.toString(),
            componentIdx: resolveComponentName("number"),
            core,
        });
        await check_math_children(numPoints, step);

        step = 0.5;
        await updateMathInputValue({
            latex: step.toString(),
            componentIdx: resolveComponentName("step"),
            core,
        });
        await check_math_children(numPoints, step);

        numPoints = 10;
        await updateMathInputValue({
            latex: numPoints.toString(),
            componentIdx: resolveComponentName("number"),
            core,
        });
        await check_math_children(numPoints, step);

        // use 0 as a stand-in for undefined
        step = 0;
        await updateMathInputValue({
            latex: "",
            componentIdx: resolveComponentName("step"),
            core,
        });
        await check_math_children(numPoints, step);

        numPoints = 5;
        await updateMathInputValue({
            latex: numPoints.toString(),
            componentIdx: resolveComponentName("number"),
            core,
        });
        await check_math_children(numPoints, step);

        step = -3;
        await updateMathInputValue({
            latex: step.toString(),
            componentIdx: resolveComponentName("step"),
            core,
        });
        await check_math_children(numPoints, step);
    });

    it("cannot override fixed of source index", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <repeatForSequence name="r1" length="2" type="text" indexName="i">
        <integer extend="$i" name="ind" />
        <mathInput name="mi">$ind</mathInput>
    </repeatForSequence>
    <repeatForSequence name="r2" length="2" type="text" indexName="i">
        <integer extend="$i" name="ind" fixed="false" />
        <mathInput name="mi">$ind</mathInput>
    </repeatForSequence>


    `,
        });

        const r1 = resolveComponentName("r1");
        const r2 = resolveComponentName("r2");

        async function check_items(a: number, b: number, c: number, d: number) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[resolveComponentName("r1[1].ind")].stateValues
                    .value,
            ).eqls(a);
            expect(
                stateVariables[resolveComponentName("r1[2].ind")].stateValues
                    .value,
            ).eqls(b);
            expect(
                stateVariables[resolveComponentName("r2[1].ind")].stateValues
                    .value,
            ).eqls(c);
            expect(
                stateVariables[resolveComponentName("r2[2].ind")].stateValues
                    .value,
            ).eqls(d);
        }

        async function set_items(a: string, b: string, c: string, d: string) {
            await updateMathInputValue({
                latex: a,
                componentIdx: resolveComponentName("r1[1].mi"),
                core,
            });
            await updateMathInputValue({
                latex: b,
                componentIdx: resolveComponentName("r1[2].mi"),
                core,
            });
            await updateMathInputValue({
                latex: c,
                componentIdx: resolveComponentName("r2[1].mi"),
                core,
            });
            await updateMathInputValue({
                latex: d,
                componentIdx: resolveComponentName("r2[2].mi"),
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

    it("repeatForSequence hide dynamically", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <booleanInput name='h1' prefill="false" >
      <label>Hide first repeat</label>
    </booleanInput>
    <booleanInput name='h2' prefill="true" >
      <label>Hide second repeat</label>
    </booleanInput>
    <p>Length of repeat 1: <mathInput name="n1" prefill="4" /></p>
    <p>Length of repeat 2: <mathInput name="n2" prefill="4" /></p>

    <p name="m1">repeat 1: <repeatForSequence hide="$h1" length="$n1" itemName="a">
        hi$a
    </repeatForSequence></p>
    <p name="m2">repeat 2: <repeatForSequence hide="$h2" length="$n2" itemName="a">
        hi$a
    </repeatForSequence></p>
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
                    stateVariables[resolveComponentName("m1")].stateValues.text,
                ).eq("repeat 1: ");
            } else {
                let m1text =
                    "repeat 1: " +
                    [...Array(n1).keys()].map((v) => `hi${v + 1}`).join(", ");
                expect(
                    stateVariables[resolveComponentName("m1")].stateValues.text,
                ).eq(m1text);
            }

            if (h2) {
                expect(
                    stateVariables[resolveComponentName("m2")].stateValues.text,
                ).eq("repeat 2: ");
            } else {
                let m2text =
                    "repeat 2: " +
                    [...Array(n2).keys()].map((v) => `hi${v + 1}`).join(", ");
                expect(
                    stateVariables[resolveComponentName("m2")].stateValues.text,
                ).eq(m2text);
            }
        }

        async function set_ns(n1: number, n2: number) {
            await updateMathInputValue({
                latex: n1.toString(),
                componentIdx: resolveComponentName("n1"),
                core,
            });
            await updateMathInputValue({
                latex: n2.toString(),
                componentIdx: resolveComponentName("n2"),
                core,
            });
        }

        async function set_hs(h1: boolean, h2: boolean) {
            await updateBooleanInputValue({
                boolean: h1,
                componentIdx: resolveComponentName("h1"),
                core,
            });
            await updateBooleanInputValue({
                boolean: h2,
                componentIdx: resolveComponentName("h2"),
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
      <p name="pdefault">
        <repeatForSequence name="default" itemName="v">
            ${inner_content}
        </repeatForSequence>
      </p>
      <p name="pnocommas">
        <repeatForSequence name="nocommas" asList="false" itemName="v">
            ${inner_content}
        </repeatForSequence>
      </p>
      <p name="pwithcommas">
        <repeatForSequence name="withcommas" asList itemName="v">
            ${inner_content}
        </repeatForSequence>
      </p>
      <p name="pdefault2">$default</p>
      <p name="pnocommas2">$nocommas</p>
      <p name="pwithcommas2">$withcommas</p>
      <p name="pnocommas3"><repeatForSequence extend="$default" asList="false" /></p>
      <p name="pnocommas3a"><repeatForSequence extend="$withcommas" asList="false" /></p>
      <p name="pwithcommas3"><repeatForSequence extend="$nocommas" asList="true" /></p>
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
        resolveComponentName: (name: string, origin?: number) => number,
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
                stateVariables[resolveComponentName(name)].stateValues.text
                    .replace(/\s+(?!,)/g, " ")
                    .trim(),
            ).eq(pTextCommas);
        }
        for (let name of noCommaNames) {
            console.log(name);
            expect(
                stateVariables[resolveComponentName(name)].stateValues.text
                    .replace(/\s+(?!,)/g, " ")
                    .trim(),
            ).eq(pTextNoCommas);
        }
    }

    it("repeat displays as list by default, single number in template", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: create_as_list_template(`<number>$v^2</number>`),
        });

        let numbers = [...Array(10).keys()].map((v) => String((v + 1) ** 2));

        await test_as_list_maps(core, numbers, resolveComponentName);
    });

    it("repeat displays as list by default, number and string in template", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: create_as_list_template(`
            <number>$v^2</number>
            x`),
        });

        let numbers = [...Array(10).keys()].map(
            (v) => String((v + 1) ** 2) + " x",
        );

        await test_as_list_maps(core, numbers, resolveComponentName);
    });

    it("repeat displays as list by default, number, string and math in template", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: create_as_list_template(`
            <number>$v^2</number>
            <math>x</math>`),
        });

        let numbers = [...Array(10).keys()].map(
            (v) => String((v + 1) ** 2) + " x",
        );

        await test_as_list_maps(core, numbers, resolveComponentName);
    });

    it("repeat will display as list even if if has non-inline components with canBeInList set", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
      <p name="p1"><repeatForSequence to="3" itemName="v">
        <point>($v, $v^2)</point>
      </repeatForSequence></p>
      <p name="p2"><repeatForSequence to="3" itemName="v">
        <vector>($v, $v^2)</vector>
      </repeatForSequence></p>
      <p name="p3"><repeatForSequence to="3" itemName="v">
        <line>y=$v</line>
      </repeatForSequence></p>
      <p name="p4"><repeatForSequence to="3" itemName="v">
        <angle>2$v</angle>
      </repeatForSequence></p>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[resolveComponentName("p1")].stateValues.text).eq(
            "( 1, 1 ), ( 2, 4 ), ( 3, 9 )",
        );
        expect(stateVariables[resolveComponentName("p2")].stateValues.text).eq(
            "( 1, 1 ), ( 2, 4 ), ( 3, 9 )",
        );
        expect(stateVariables[resolveComponentName("p3")].stateValues.text).eq(
            "y = 1, y = 2, y = 3",
        );
        expect(stateVariables[resolveComponentName("p4")].stateValues.text).eq(
            "2, 4, 6",
        );
    });

    it("isResponse", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <repeatForSequence isResponse itemName="v" length="2" name="r">
        <p name="p">hi $v</p>
    </repeatForSequence>
    <repeatForSequence itemName="v" length="2" name="r2">
        <p name="p">hi $v</p>
    </repeatForSequence>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[resolveComponentName("r[1].p")].stateValues.text,
        ).eq("hi 1");
        expect(
            stateVariables[resolveComponentName("r[2].p")].stateValues.text,
        ).eq("hi 2");
        expect(
            stateVariables[resolveComponentName("r[1].p")].stateValues
                .isResponse,
        ).eq(true);
        expect(
            stateVariables[resolveComponentName("r[2].p")].stateValues
                .isResponse,
        ).eq(true);

        expect(
            stateVariables[resolveComponentName("r2[1].p")].stateValues.text,
        ).eq("hi 1");
        expect(
            stateVariables[resolveComponentName("r2[2].p")].stateValues.text,
        ).eq("hi 2");
        expect(
            stateVariables[resolveComponentName("r2[1].p")].stateValues
                .isResponse,
        ).eq(false);
        expect(
            stateVariables[resolveComponentName("r2[2].p")].stateValues
                .isResponse,
        ).eq(false);
    });
});

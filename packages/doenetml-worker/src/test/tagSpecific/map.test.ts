import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import {
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);

describe("Map tag tests", async () => {
    it("single map of maths", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><map name="map1">
      <template><math>sin(2$x) + $i</math></template>
      <sources alias="x" indexAlias="i">
        <math>x</math>
        <math>y</math>
      </sources>
    </map></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        let replacements = stateVariables["/map1"].replacements!;
        let mathr1Name =
            stateVariables[replacements[0].componentName].replacements![0]
                .componentName;
        let mathr2Name =
            stateVariables[replacements[1].componentName].replacements![0]
                .componentName;

        expect(stateVariables["/p"].stateValues.text).eq(
            "sin(2 x) + 1, sin(2 y) + 2",
        );

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

    it("single map of texts", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><map name="map1" asList="false">
      <template><text>You are a $animal!</text> </template>
      <sources alias="animal"><text>squirrel</text><text>bat</text></sources>
    </map></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        let replacements = stateVariables["/map1"].replacements!;
        let textr1Name =
            stateVariables[replacements[0].componentName].replacements![0]
                .componentName;
        let textr2Name =
            stateVariables[replacements[1].componentName].replacements![0]
                .componentName;

        expect(stateVariables["/p"].stateValues.text).eq(
            "You are a squirrel! You are a bat! ",
        );

        expect(stateVariables[textr1Name].stateValues.value).eq(
            "You are a squirrel!",
        );

        expect(stateVariables[textr2Name].stateValues.value).eq(
            "You are a bat!",
        );
    });

    it("single map of sequence", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><map name="map1">
      <template><math simplify>$n^2</math></template>
      <sources alias="n"><sequence from="1" to="5"/></sources>
    </map></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        let replacements = stateVariables["/map1"].replacements!;
        let mathrNames = replacements.map(
            (x) =>
                stateVariables[x.componentName].replacements![0].componentName,
        );

        expect(stateVariables["/p"].stateValues.text).eq("1, 4, 9, 16, 25");
        expect(stateVariables[mathrNames[0]].stateValues.value.tree).eq(1);
        expect(stateVariables[mathrNames[1]].stateValues.value.tree).eq(4);
        expect(stateVariables[mathrNames[2]].stateValues.value.tree).eq(9);
        expect(stateVariables[mathrNames[3]].stateValues.value.tree).eq(16);
        expect(stateVariables[mathrNames[4]].stateValues.value.tree).eq(25);
    });

    it("triple parallel map", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><map behavior="parallel">
      <template><math>($l, $m, $n)</math>: <math>($i, $j, $k)</math></template>
      <sources alias="l" indexAlias="i"><sequence from="1" to="5"/></sources>
      <sources alias="m" indexAlias="j"><sequence from="21" to="23"/></sources>
      <sources alias="n" indexAlias="k"><sequence from="-5" to="-21" step="-3"/></sources>
    </map></p>
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

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/p"].stateValues.text).eq(pText);

        // Have warning that ignored extra iterates
        let errorWarnings = core.errorWarnings;
        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(1);

        expect(errorWarnings.warnings[0].message).contain(
            "<map> has parallel behavior but different numbers of iterates in sources. Extra iterates will be ignored",
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(2);
        expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(17);
        expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(7);
        expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(10);
    });

    it("triple combination map", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><map behavior="combination">
      <template><math>($l, $m, $n)</math>: <math>($i, $j, $k)</math></template>
      <sources alias="l" indexAlias="i"><sequence from="1" to="3"/></sources>
      <sources alias="m" indexAlias="j"><sequence from="21" to="23" step="2"/></sources>
      <sources alias="n" indexAlias="k"><sequence from="-5" to="-8" step="-3"/></sources>
    </map></p>
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

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/p"].stateValues.text).eq(pText);
    });

    it("map with invalid behavior", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><map behavior="bad">
      <template>hi</template>
      <sources><number>1</number></sources>
    </map></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq("");

        let errorWarnings = core.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(1);

        expect(errorWarnings.warnings[0].message).contain(
            `Invalid map behavior: "bad"`,
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(2);
        expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(17);
        expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(5);
        expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(10);
    });

    it("two nested maps", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><map>
      <template><map>
          <template><math simplify>$m+$n</math> and <math simplify>$i+2$j</math></template>
          <sources alias="m" indexAlias="i"><sequence from="1" to="2"/></sources>
        </map></template>
      <sources alias="n" indexAlias="j"><number>-10</number><number>5</number></sources>
    </map></p>

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

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/p"].stateValues.text).eq(pText);
    });

    it("three nested maps with graphs and copied", async () => {
        let core = await createTestCore({
            doenetML: `
    <map name="map1">
    <template><graph>
        <map>
          <template><map>
              <template><point>($l+$n, $m)</point><point>($i+2*$k, $j)</point></template>
              <sources alias="l" indexAlias="i"><sequence from="1" to="2"/></sources>
            </map></template>
          <sources alias="m" indexAlias="j"><sequence from="-5" to="5" step="10"/></sources>
        </map>
      </graph></template>
    <sources alias="n" indexAlias="k"><sequence from="-10" to="5" step="15"/></sources>
    </map>
    $map1{name="mapCopy"}
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

        let stateVariables = await returnAllStateVariables(core);

        function checkMap(mapName: string) {
            let graphNames = stateVariables[mapName].replacements!.map(
                (x) =>
                    stateVariables[x.componentName].replacements![0]
                        .componentName,
            );

            for (let [graphInd, graphName] of graphNames.entries()) {
                let point1NamesForGraph: string[] = [];
                let point2NamesForGraph: string[] = [];

                let allPointNames = stateVariables[
                    graphName
                ].activeChildren.map((x) => x.componentName);

                expect(allPointNames.length).eq(8);

                for (let [pointInd, pointName] of allPointNames.entries()) {
                    if (pointInd % 2 === 0) {
                        point1NamesForGraph.push(pointName);
                    } else {
                        point2NamesForGraph.push(pointName);
                    }
                }

                for (let [ind, val] of point1sByGraph[graphInd].entries()) {
                    let name = point1NamesForGraph[ind];
                    expect(
                        stateVariables[name].stateValues.xs.map((x) => x.tree),
                    ).eqls(val);
                }
                for (let [ind, val] of point2sByGraph[graphInd].entries()) {
                    let name = point2NamesForGraph[ind];
                    expect(
                        stateVariables[name].stateValues.xs.map((x) => x.tree),
                    ).eqls(val);
                }
            }
        }

        await checkMap("/map1");
        await checkMap("/mapCopy");
    });

    it("three nested maps with graphs and assignNames", async () => {
        let core = await createTestCore({
            doenetML: `
    <map assignNames="u v">
    <template newNamespace>
      <graph name="graph1">
        <map assignNames="u v">
          <template newNamespace>
            <map assignNames="u v">
              <template newNamespace>
                <point name="A">($l+$n, $m)</point>
              </template>
              <sources alias="l"><sequence from="1" to="2"/></sources>
            </map>
          </template>
          <sources alias="m"><sequence from="-5" to="5" step="10"/></sources>
        </map>
      </graph>
    </template>
    <sources alias="n"><sequence from="-10" to="5" step="15"/></sources>
    </map>
    <copy assignNames="c1" prop="coords" target="/u/u/u/A" />
    <copy assignNames="c2" prop="coords" target="/u/u/v/A" />
    <copy assignNames="c3" prop="coords" target="/u/v/u/A" />
    <copy assignNames="c4" prop="coords" target="/u/v/v/A" />
    <copy assignNames="c5" prop="coords" target="/v/u/u/A" />
    <copy assignNames="c6" prop="coords" target="/v/u/v/A" />
    <copy assignNames="c7" prop="coords" target="/v/v/u/A" />
    <copy assignNames="c8" prop="coords" target="/v/v/v/A" />
    `,
        });

        let options1 = [1, 2];
        let options2 = [-5, 5];
        let options3 = [-10, 5];

        let pointsByMap: number[][][][] = [];

        for (let [k, n] of options3.entries()) {
            pointsByMap.push([]);
            for (let [j, m] of options2.entries()) {
                pointsByMap[k].push([]);
                for (let [i, l] of options1.entries()) {
                    pointsByMap[k][j].push([l + n, m]);
                }
            }
        }

        let stateVariables = await returnAllStateVariables(core);

        expect(
            stateVariables["/u/graph1"].stateValues.graphicalDescendants.length,
        ).eq(4);
        expect(
            stateVariables["/v/graph1"].stateValues.graphicalDescendants.length,
        ).eq(4);

        let assignedNames = ["/u", "/v"];

        let cNames = ["/c8", "/c7", "/c6", "/c5", "/c4", "/c3", "/c2", "/c1"];

        for (let [i1, name1] of assignedNames.entries()) {
            for (let [i2, name2] of assignedNames.entries()) {
                for (let [i3, name3] of assignedNames.entries()) {
                    let name = name1 + name2 + name3 + "/A";
                    expect(
                        stateVariables[name].stateValues.xs.map((x) => x.tree),
                    ).eqls(pointsByMap[i1][i2][i3]);

                    let cName = cNames.pop();

                    expect(stateVariables[cName!].stateValues.value.tree).eqls([
                        "vector",
                        ...pointsByMap[i1][i2][i3],
                    ]);
                }
            }
        }
    });

    it("combination map nested inside map with graphs", async () => {
        let core = await createTestCore({
            doenetML: `
    <map name="map1">
        <template><graph>
        <map behavior="combination">
            <template><point>($l+$n, $m)</point></template>
            <sources alias="l"><sequence from="1" to="2"/></sources>
            <sources alias="m"><sequence from="-5" to="5" step="10"/></sources>
        </map>
        </graph></template>
        <sources alias="n"><sequence from="-10" to="5" step="15"/></sources>
    </map>
    `,
        });

        let options1 = [1, 2];
        let options2 = [-5, 5];
        let options3 = [-10, 5];

        let pointsByGraph: number[][][] = [];

        for (let [k, n] of options3.entries()) {
            pointsByGraph.push([]);
            for (let [i, l] of options1.entries()) {
                for (let [j, m] of options2.entries()) {
                    pointsByGraph[k].push([l + n, m]);
                }
            }
        }

        let stateVariables = await returnAllStateVariables(core);

        let graphNames = stateVariables["/map1"].replacements!.map(
            (x) =>
                stateVariables[x.componentName].replacements![0].componentName,
        );

        for (let [graphInd, graphName] of graphNames.entries()) {
            expect(
                stateVariables[graphName].stateValues.graphicalDescendants
                    .length,
            ).eq(4);

            let pointNames = stateVariables[graphName].activeChildren.map(
                (x) => x.componentName,
            );

            for (let [ind, val] of pointsByGraph[graphInd].entries()) {
                expect(
                    stateVariables[pointNames[ind]].stateValues.xs.map(
                        (x) => x.tree,
                    ),
                ).eqls(val);
            }
        }
    });

    it("map with copies", async () => {
        let core = await createTestCore({
            doenetML: `
    
    <p name="p1"><map name="map1">
    <template newNamespace><math simplify>
        $n{name="b"} + $j{name="i"} + $(../a) 
        + <math name="q">z</math> + $q + $b +$i
      </math> and <math>x</math></template>
    <sources alias="n" indexAlias="j"><sequence from="3" to="4"/></sources>
    </map></p>
    <math name="a">x</math>
    <p name="p2">$map1</p>
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

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/p1"].stateValues.text).eq(pText);
        expect(stateVariables["/p2"].stateValues.text).eq(pText);
    });

    it("map with copies, extended dynamically", async () => {
        let core = await createTestCore({
            doenetML: `
    <number name="length">1</number>
    <p name="p1"><map name="map1">
    <template newNamespace><math simplify>
        $n{name="b"} + $j{name="i"} + $(../a) 
        + <math name="q">z</math> + $q + $b +$i
      </math> and <math>x</math></template>
    <sources alias="n" indexAlias="j"><sequence from="3" length="$length"/></sources>
    </map></p>
    <math name="a">x</math>
    <p name="p2">$map1</p>
    <p name="p3" copySource="p2" />

    <updateValue name="uv" target="length" newValue="2$length"  >
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

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p1"].stateValues.text).eq(pText);
        expect(stateVariables["/p2"].stateValues.text).eq(pText);
        expect(stateVariables["/p3"].stateValues.text).eq(pText);

        // Double the length then test again
        await core.requestAction({
            componentName: "/uv",
            actionName: "updateValue",
            args: {},
            event: null,
        });

        pText = textForLength(2);
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p1"].stateValues.text).eq(pText);
        expect(stateVariables["/p2"].stateValues.text).eq(pText);
        expect(stateVariables["/p3"].stateValues.text).eq(pText);

        // Double the length again then test one more time
        await core.requestAction({
            componentName: "/uv",
            actionName: "updateValue",
            args: {},
            event: null,
        });

        pText = textForLength(4);
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p1"].stateValues.text).eq(pText);
        expect(stateVariables["/p2"].stateValues.text).eq(pText);
        expect(stateVariables["/p3"].stateValues.text).eq(pText);
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

    it("map with copied template", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><map name="map1">
        <template name="template1"><math simplify="full">sin($i$x)</math></template>
        <sources alias="x" indexAlias="i"><math>x</math><math>y</math></sources>
    </map></p>
  
    <p name="p2"><map name="map2">
        $template1
        <sources alias="x" indexAlias="i"><math>q</math><math>p</math></sources>
    </map></p>

    <p name="p3">$map2</p>
    `,
        });

        let pText1 = sinTextFromVars(["x", "y"]);
        let pText2 = sinTextFromVars(["q", "p"]);

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/p1"].stateValues.text).eq(pText1);
        expect(stateVariables["/p2"].stateValues.text).eq(pText2);
        expect(stateVariables["/p3"].stateValues.text).eq(pText2);
    });

    it("map with new namespace but no new namespace on template", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><map name="map1" newNamespace>
    <template><math simplify="full">sin($i$x)</math></template>
    <sources alias="x" indexAlias="i"><math>x</math><math>y</math></sources>
    </map></p>
  
    <p name="p2">$map1</p>
    `,
        });

        let pText = sinTextFromVars(["x", "y"]);

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p1"].stateValues.text).eq(pText);
        expect(stateVariables["/p2"].stateValues.text).eq(pText);
    });

    it("graph with new namespace and assignNames", async () => {
        let core = await createTestCore({
            doenetML: `
    $(/hi/c/P.coords{assignNames="c1"})
    $(/hi/s/P.coords{assignNames="c2"})
    $(/hi/q/P.coords{assignNames="c3"})
    
    <grapH Name="hi" newNamespace >
    <map assignNames="q  c s" name="map1">
      <template newNamespace><point name="P">($m, $n)</point></template>
      <sources alias="m"><sequence from="1" to="2"/></sources>
      <sources alias="n"><sequence from="-3" to="-2"/></sources>
    </map>
    </graph>
    `,
        });

        let points: number[][] = [];
        for (let m = 1; m <= 2; m++) {
            for (let n = -3; n <= -2; n++) {
                points.push([m, n]);
            }
        }

        let stateVariables = await returnAllStateVariables(core);
        let replacementNames = stateVariables["/hi/map1"].replacements!.map(
            (x) =>
                stateVariables[x.componentName].replacements![0].componentName,
        );

        expect(
            stateVariables["/hi"].stateValues.graphicalDescendants.length,
        ).eq(4);
        expect(
            stateVariables["/hi/q/P"].stateValues.xs.map((x) => x.tree),
        ).eqls(points[0]);
        expect(
            stateVariables["/hi/c/P"].stateValues.xs.map((x) => x.tree),
        ).eqls(points[1]);
        expect(
            stateVariables["/hi/s/P"].stateValues.xs.map((x) => x.tree),
        ).eqls(points[2]);

        expect(
            stateVariables[replacementNames[3]].stateValues.xs.map(
                (x) => x.tree,
            ),
        ).eqls(points[3]);

        expect(stateVariables["/c1"].stateValues.value.tree).eqls([
            "vector",
            ...points[1],
        ]);
        expect(stateVariables["/c2"].stateValues.value.tree).eqls([
            "vector",
            ...points[2],
        ]);
        expect(stateVariables["/c3"].stateValues.value.tree).eqls([
            "vector",
            ...points[0],
        ]);
    });

    it("map copying value from source of other map", async () => {
        let core = await createTestCore({
            doenetML: `
    <map assignNames="u v w">
      <template newNamespace><math name="math">($n, $(../e/n2))</math></template>
      <sources alias="n"><sequence from="1" to="3"/></sources>
    </map>
    <map assignNames="c d e">
      <template newNamespace><math name="math">sin($n{name="n2"})</math></template>
      <sources alias="n"><sequence from="4" to="6"/></sources>
    </map>
    `,
        });

        let e_n2 = 6;

        let maths1 = [1, 2, 3].map((n) => `( ${n}, ${e_n2} )`);
        let maths2 = [4, 5, 6].map((n) => `sin(${n})`);
        let names1 = ["/u/math", "/v/math", "/w/math"];
        let names2 = ["/c/math", "/d/math", "/e/math"];

        let stateVariables = await returnAllStateVariables(core);

        for (let i = 0; i < 3; i++) {
            expect(stateVariables[names1[i]].stateValues.text).eq(maths1[i]);
            expect(stateVariables[names2[i]].stateValues.text).eq(maths2[i]);
        }
    });

    it("map length depending on other map", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p"><map>
        <template><map>
            <template><math>($a, $b)</math></template>
            <sources alias="a"><sequence from="1" to="$b" /></sources>
        </map></template>
        <sources alias="b"><sequence from="1" to="3"/></sources>
    </map></p>
    `,
        });

        let texts: string[] = [];

        for (let b of [1, 2, 3]) {
            for (let a of [...Array(b).keys()].map((v) => v + 1)) {
                texts.push(`( ${a}, ${b} )`);
            }
        }

        let pText = texts.join(", ");

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p"].stateValues.text).eq(pText);
    });

    it("map begins zero length, copied multiple times", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><map name="map1">
        <template><math simplify>$n^2</math></template>
        <sources alias="n">
            <sequence from="$sequenceFrom" to="$sequenceTo" length="$sequenceCount" />
        </sources>
    </map></p>

    <mathInput name="sequenceFrom" prefill="1"/>
    <mathInput name="sequenceTo" prefill="2"/>
    <mathInput name="sequenceCount" prefill="0"/>
    
    <p name="p2">$map1{name="copyMap2"}</p>
    <p name="p3">$copyMap2{name="copyMap3"}</p>

    $p1{name="p4"}
    $p4{name="p5"}
    $p5{name="p6"}

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

            const stateVariables = await returnAllStateVariables(core);
            for (let i = 1; i <= 6; i++) {
                expect(stateVariables[`/p${i}`].stateValues.text).eq(pText);
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
            componentName: "/sequenceCount",
            core,
        });
        await check_items(from, to, count);

        // make sequence length 0 again
        count = 0;
        await updateMathInputValue({
            latex: count.toString(),
            componentName: "/sequenceCount",
            core,
        });
        await check_items(from, to, count);

        // make sequence length 2
        count = 2;
        await updateMathInputValue({
            latex: count.toString(),
            componentName: "/sequenceCount",
            core,
        });
        await check_items(from, to, count);

        // change limits
        from = 3;
        to = 5;
        await updateMathInputValue({
            latex: from.toString(),
            componentName: "/sequenceFrom",
            core,
        });
        await updateMathInputValue({
            latex: to.toString(),
            componentName: "/sequenceTo",
            core,
        });
        await check_items(from, to, count);

        // make sequence length 0 again
        count = 0;
        await updateMathInputValue({
            latex: count.toString(),
            componentName: "/sequenceCount",
            core,
        });
        await check_items(from, to, count);

        // make sequence length 3
        count = 3;
        await updateMathInputValue({
            latex: count.toString(),
            componentName: "/sequenceCount",
            core,
        });
        await check_items(from, to, count);
    });

    it("map with seemingly circular dependence in template", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <map assignnames="a b c">
        <template newNamespace><point name="P1">
            ($(../q)$n^2,
            $P2.x)
          </point><point name="P2">
            ($(../r)$n,
            $P1.x)
          </point></template>
      <sources alias='n'>
        <sequence from="2" to="4" />
      </sources>
      </map>
    </graph>
    <math name="q">1</math>
    <math name="r">1</math>
    <copy assignNames="c1" prop="coords" target="a/P1" />
    <copy assignNames="c2" prop="coords" target="a/P2" />
    <copy assignNames="c3" prop="coords" target="b/P1" />
    <copy assignNames="c4" prop="coords" target="b/P2" />
    <copy assignNames="c5" prop="coords" target="c/P1" />
    <copy assignNames="c6" prop="coords" target="c/P2" />
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

            let nameSpaces = ["/a", "/b", "/c"];

            const stateVariables = await returnAllStateVariables(core);

            for (let [ind, ns] of nameSpaces.entries()) {
                expect(
                    rnd(
                        stateVariables[`${ns}/P1`].stateValues.xs.map(
                            (x) => x.tree,
                        ),
                    ),
                ).eqls(P1s[ind]);
                expect(
                    rnd(
                        stateVariables[`${ns}/P2`].stateValues.xs.map(
                            (x) => x.tree,
                        ),
                    ),
                ).eqls(P2s[ind]);

                expect(
                    rnd(
                        stateVariables[`/c${ind * 2 + 1}`].stateValues.value
                            .tree,
                    ),
                ).eqls(["vector", ...P1s[ind]]);
                expect(
                    rnd(
                        stateVariables[`/c${ind * 2 + 2}`].stateValues.value
                            .tree,
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

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/a/P1",
            args: { x: P1s[0][0], y: P1s[0][1] },
            event: null,
        });
        await check_items(q, r);

        // move point /a/P2
        r = 0.7;
        q = 1.8;
        let P2s = points_from_pars(q, r).P2s;

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/a/P2",
            args: { x: P2s[0][0], y: P2s[0][1] },
            event: null,
        });
        await check_items(q, r);

        // move point /b/P1
        r = -0.2;
        q = 0.3;
        P1s = points_from_pars(q, r).P1s;

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/b/P1",
            args: { x: P1s[1][0], y: P1s[1][1] },
            event: null,
        });
        await check_items(q, r);

        // move point /b/P2
        r = 0.6;
        q = 0.35;
        P2s = points_from_pars(q, r).P2s;

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/b/P2",
            args: { x: P2s[1][0], y: P2s[1][1] },
            event: null,
        });
        await check_items(q, r);

        // move point /c/P1
        r = -0.21;
        q = -0.46;
        P1s = points_from_pars(q, r).P1s;

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/c/P1",
            args: { x: P1s[2][0], y: P1s[2][1] },
            event: null,
        });
        await check_items(q, r);

        // move point /c/P2
        r = 0.37;
        q = -0.73;
        P2s = points_from_pars(q, r).P2s;

        await core.requestAction({
            actionName: "movePoint",
            componentName: "/c/P2",
            args: { x: P2s[2][0], y: P2s[2][1] },
            event: null,
        });
        await check_items(q, r);
    });

    it("two maps with mutual copies, begin zero length, copied multiple times", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g1">
      <map assignNames="a b c" name="map1">
        <template newNamespace><point name="P">
            (-$n, $n$(../q/P.x))
          </point></template>
      <sources alias="n">
        <sequence from="$sequenceFrom" to="$sequenceTo" length="$sequenceCount" />
      </sources>
      </map>
      <map assignNames="q r s" name="map2">
        <template newNamespace><point name="P">
            ($n, $n$(../a/P.x))
          </point></template>
      <sources alias="n">
        <sequence from="$sequenceFrom" to="$sequenceTo" length="$sequenceCount" />
      </sources>
      </map>
    </graph>
    
    <mathInput name="sequenceFrom" prefill="1"/>
    <mathInput name="sequenceTo" prefill="2"/>
    <mathInput name="sequenceCount" prefill="0"/>
    
    <graph name="g2">
        <map name="copyMap1" copySource="map1" newNamespace />
        <map name="copyMap2" copySource="map2" newNamespace />
    </graph>
    <graph name="g3">
        <map name="copyMap1b" copySource="copyMap1" newNamespace />
        <map name="copyMap2b" copySource="copyMap2" newNamespace />
    </graph>
    
    <graph name="g4" copySource="g1" newNamespace />
    `,
        });

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

            let ns1 = ["/a", "/b", "/c"];
            let ns2 = ["/q", "/r", "/s"];
            let ns1Prefixes = ["", "/copyMap1", "/copyMap1b", "/g4"];
            let ns2Prefixes = ["", "/copyMap2", "/copyMap2b", "/g4"];

            const stateVariables = await returnAllStateVariables(core);

            expect(
                stateVariables["/g1"].stateValues.graphicalDescendants.length,
            ).eq(2 * count);
            expect(
                stateVariables["/g2"].stateValues.graphicalDescendants.length,
            ).eq(2 * count);
            expect(
                stateVariables["/g3"].stateValues.graphicalDescendants.length,
            ).eq(2 * count);
            expect(
                stateVariables["/g4"].stateValues.graphicalDescendants.length,
            ).eq(2 * count);

            for (let i = 0; i < count; i++) {
                for (let pre of ns1Prefixes) {
                    expect(
                        stateVariables[`${pre}${ns1[i]}/P`].stateValues.xs.map(
                            (x) => x.tree,
                        ),
                    ).eqls(points1[i]);
                }
                for (let pre of ns2Prefixes) {
                    expect(
                        stateVariables[`${pre}${ns2[i]}/P`].stateValues.xs.map(
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
            componentName: "/sequenceCount",
            core,
        });
        await check_items(from, to, count);

        // make sequence length 0 again
        count = 0;
        await updateMathInputValue({
            latex: count.toString(),
            componentName: "/sequenceCount",
            core,
        });
        await check_items(from, to, count);

        // make sequence length 2
        count = 2;
        await updateMathInputValue({
            latex: count.toString(),
            componentName: "/sequenceCount",
            core,
        });
        await check_items(from, to, count);

        // change limits
        from = 3;
        to = 5;
        await updateMathInputValue({
            latex: from.toString(),
            componentName: "/sequenceFrom",
            core,
        });
        await updateMathInputValue({
            latex: to.toString(),
            componentName: "/sequenceTo",
            core,
        });
        await check_items(from, to, count);

        // make sequence length 0 again
        count = 0;
        await updateMathInputValue({
            latex: count.toString(),
            componentName: "/sequenceCount",
            core,
        });
        await check_items(from, to, count);

        // make sequence length 3
        count = 3;
        await updateMathInputValue({
            latex: count.toString(),
            componentName: "/sequenceCount",
            core,
        });
        await check_items(from, to, count);
    });

    it("map points to adapt to math", async () => {
        // Note: math1 ends up getting math children from the map.
        // We aren't worrying about the interpretation of
        // the juxtaposition of vectors that the children represent.
        // We're just checking that the points from the map
        // are adapted into maths due to their math parent.
        let core = await createTestCore({
            doenetML: `
    <p>Number of points: <mathInput name="number"/></p>
    <p>Step size: <mathInput name="step" /></p>
    
    <math name="math1">
      <map>
        <template><point>($n, sin($n))</point></template>
        <sources alias="n">
          <sequence from="2" length="$number" step="$step" />
        </sources>
      </map>
    </math>
    `,
        });

        async function check_math_children(numPoints: number, step: number) {
            let from = 2;

            if (step === 0) {
                numPoints = 0;
            }

            let stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/math1"].activeChildren.length).eq(
                numPoints,
            );

            for (let i = 0; i < numPoints; i++) {
                let n = from + i * step;
                let child =
                    stateVariables[
                        stateVariables["/math1"].activeChildren[i].componentName
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
            componentName: "/number",
            core,
        });
        await check_math_children(numPoints, step);

        step = 1;
        await updateMathInputValue({
            latex: step.toString(),
            componentName: "/step",
            core,
        });
        await check_math_children(numPoints, step);

        numPoints = 20;
        await updateMathInputValue({
            latex: numPoints.toString(),
            componentName: "/number",
            core,
        });
        await check_math_children(numPoints, step);

        step = 0.5;
        await updateMathInputValue({
            latex: step.toString(),
            componentName: "/step",
            core,
        });
        await check_math_children(numPoints, step);

        numPoints = 10;
        await updateMathInputValue({
            latex: numPoints.toString(),
            componentName: "/number",
            core,
        });
        await check_math_children(numPoints, step);

        // use 0 as a stand-in for undefined
        step = 0;
        await updateMathInputValue({
            latex: "",
            componentName: "/step",
            core,
        });
        await check_math_children(numPoints, step);

        numPoints = 5;
        await updateMathInputValue({
            latex: numPoints.toString(),
            componentName: "/number",
            core,
        });
        await check_math_children(numPoints, step);

        step = -3;
        await updateMathInputValue({
            latex: step.toString(),
            componentName: "/step",
            core,
        });
        await check_math_children(numPoints, step);
    });

    it("map inside sources of map", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Number of points: <mathInput name="number"/></p>
    
    <map name="m1" assignNames="p1 p2 p3">
      <template newNamespace><point name="pt">($n, 2$n)</point></template>
      <sources alias="n">
        <sequence length="$number" />
      </sources>
    </map>

    <map name="m2" assignNames="q1 q2 q3">
      <template newNamespace><point name="pt">($p.x^2, $p.y^2)</point></template>
      <sources alias="p">
        $m1
      </sources>
    </map>

    <p name="p1a">$p1</p>
    <p name="p1b">$(p1/pt)</p>
    <p name="p2a">$p2</p>
    <p name="p2b">$(p2/pt)</p>
    <p name="p3a">$p3</p>
    <p name="p3b">$(p3/pt)</p>

    <p name="q1a">$q1</p>
    <p name="q1b">$(q1/pt)</p>
    <p name="q2a">$q2</p>
    <p name="q2b">$(q2/pt)</p>
    <p name="q3a">$q3</p>
    <p name="q3b">$(q3/pt)</p>

    `,
        });

        async function check_items(num: number) {
            let sources1 = [...Array(num).keys()].map((x) => x + 1);

            let points1 = sources1.map((n) => [n, 2 * n]);
            let points2 = points1.map((p) => [p[0] ** 2, p[1] ** 2]);

            let point1Texts = points1.map((p) => `( ${p[0]}, ${p[1]} )`);
            let point2Texts = points2.map((p) => `( ${p[0]}, ${p[1]} )`);

            let pNames1 = [
                ["/p1a", "/p1b"],
                ["/p2a", "/p2b"],
                ["/p3a", "/p3b"],
            ];
            let pNames2 = [
                ["/q1a", "/q1b"],
                ["/q2a", "/q2b"],
                ["/q3a", "/q3b"],
            ];

            const stateVariables = await returnAllStateVariables(core);
            for (let n = 0; n < 3; n++) {
                for (let i = 0; i < 2; i++) {
                    expect(stateVariables[pNames1[n][i]].stateValues.text).eq(
                        point1Texts[n] || "",
                    );
                    expect(stateVariables[pNames2[n][i]].stateValues.text).eq(
                        point2Texts[n] || "",
                    );
                }
            }
        }

        let num = 0;

        await check_items(num);

        // set number to be 2
        num = 2;
        await updateMathInputValue({
            latex: num.toString(),
            componentName: "/number",
            core,
        });
        await check_items(num);

        // set number to be 1
        num = 1;
        await updateMathInputValue({
            latex: num.toString(),
            componentName: "/number",
            core,
        });
        await check_items(num);

        // set number to be 3
        num = 3;
        await updateMathInputValue({
            latex: num.toString(),
            componentName: "/number",
            core,
        });
        await check_items(num);

        // set number back to zero
        num = 0;
        await updateMathInputValue({
            latex: num.toString(),
            componentName: "/number",
            core,
        });
        await check_items(num);

        // set number back to 1
        num = 1;
        await updateMathInputValue({
            latex: num.toString(),
            componentName: "/number",
            core,
        });
        await check_items(num);
    });

    it("can override fixed of source index", async () => {
        let core = await createTestCore({
            doenetML: `
    <map assignNames="a b">
      <template newNamespace>
        $i{name="ind"}
        <mathInput name="mi">$ind</mathInput>
      </template>
      <sources indexAlias="i"><text>red</text><text>yellow</text></sources>
    </map>
    <map assignNames="c d">
      <template newNamespace>
        $i{name="ind" fixed="false"}
        <mathInput name="mi">$ind</mathInput>
      </template>
      <sources indexAlias="i"><text>red</text><text>yellow</text></sources>
    </map>


    `,
        });

        async function check_items(a: number, b: number, c: number, d: number) {
            const stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/a/ind"].stateValues.value).eqls(a);
            expect(stateVariables["/b/ind"].stateValues.value).eqls(b);
            expect(stateVariables["/c/ind"].stateValues.value).eqls(c);
            expect(stateVariables["/d/ind"].stateValues.value).eqls(d);
        }

        async function set_items(a: string, b: string, c: string, d: string) {
            await updateMathInputValue({
                latex: a,
                componentName: "/a/mi",
                core,
            });
            await updateMathInputValue({
                latex: b,
                componentName: "/b/mi",
                core,
            });
            await updateMathInputValue({
                latex: c,
                componentName: "/c/mi",
                core,
            });
            await updateMathInputValue({
                latex: d,
                componentName: "/d/mi",
                core,
            });
        }

        await check_items(1, 2, 1, 2);

        await set_items("3", "4", "5", "6");
        await check_items(1, 2, 5, 6);

        await set_items("x", "x", "x", "x");
        await check_items(1, 2, NaN, NaN);

        await set_items("7", "8", "9", "10");
        await check_items(1, 2, 9, 10);
    });

    it("maps hide dynamically", async () => {
        let core = await createTestCore({
            doenetML: `
    <booleanInput name='h1' prefill="false" >
      <label>Hide first map</label>
    </booleanInput>
    <booleanInput name='h2' prefill="true" >
      <label>Hide second map</label>
    </booleanInput>
    <p>Length of map 1: <mathInput name="n1" prefill="4" /></p>
    <p>Length of map 2: <mathInput name="n2" prefill="4" /></p>

    <p name="m1">map 1: <map hide="$h1">
        <template>hi$a</template>
        <sources alias="a"><sequence length="$n1" /></sources>
    </map></p>
    <p name="m2">map 2: <map hide="$h2">
        <template>hi$a</template>
        <sources alias="a"><sequence length="$n2" /></sources>
    </map></p>
    `,
        });

        async function check_items(
            h1: boolean,
            h2: boolean,
            n1: number,
            n2: number,
        ) {
            const stateVariables = await returnAllStateVariables(core);

            if (h1) {
                expect(stateVariables["/m1"].stateValues.text).eq("map 1: ");
            } else {
                let m1text =
                    "map 1: " +
                    [...Array(n1).keys()].map((v) => `hi${v + 1}`).join(", ");
                expect(stateVariables["/m1"].stateValues.text).eq(m1text);
            }

            if (h2) {
                expect(stateVariables["/m2"].stateValues.text).eq("map 2: ");
            } else {
                let m2text =
                    "map 2: " +
                    [...Array(n2).keys()].map((v) => `hi${v + 1}`).join(", ");
                expect(stateVariables["/m2"].stateValues.text).eq(m2text);
            }
        }

        async function set_ns(n1: number, n2: number) {
            await updateMathInputValue({
                latex: n1.toString(),
                componentName: "/n1",
                core,
            });
            await updateMathInputValue({
                latex: n2.toString(),
                componentName: "/n2",
                core,
            });
        }

        async function set_hs(h1: boolean, h2: boolean) {
            await updateBooleanInputValue({
                boolean: h1,
                componentName: "/h1",
                core,
            });
            await updateBooleanInputValue({
                boolean: h2,
                componentName: "/h2",
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
        <map name="default" >
          <template>
            ${inner_content}
          </template>
          <sources alias="v"><sequence /></sources>
        </map>
      </p>
      <p name="pnocommas">
        <map name="nocommas" asList="false">
          <template>
            ${inner_content}
          </template>
          <sources alias="v"><sequence /></sources>
        </map>
      </p>
      <p name="pwithcommas">
        <map name="withcommas" asList>
          <template>
            ${inner_content}
          </template>
          <sources alias="v"><sequence /></sources>
        </map>
      </p>
      <p name="pdefault2">$default</p>
      <p name="pnocommas2">$nocommas</p>
      <p name="pwithcommas2">$withcommas</p>
      <p name="pnocommas3">$default{asList="false"}</p>
      <p name="pnocommas3a">$withcommas{asList="false"}</p>
      <p name="pwithcommas3">$nocommas{asList="true"}</p>
      <p name="pdefault4" copysource="pdefault" />
      <p name="pnocommas4" copysource="pnocommas" />
      <p name="pwithcommas4" copysource="pwithcommas" />
      <p name="pdefault5" copysource="pdefault2" />
      <p name="pnocommas5" copysource="pnocommas2" />
      <p name="pwithcommas5" copysource="pwithcommas2" />
      <p name="pnocommas6" copysource="pnocommas3" />
      <p name="pnocommas6a" copysource="pnocommas3a" />
      <p name="pwithcommas6" copysource="pwithcommas3" />
    `;
    }

    async function test_as_list_maps(core, items: string[]) {
        let pTextCommas = items.join(", ");
        let pTextNoCommas = items.join(" ");

        let commaNames = [
            "/pdefault",
            "/pwithcommas",
            "/pdefault2",
            "/pwithcommas2",
            "/pwithcommas3",
            "/pdefault4",
            "/pwithcommas4",
            "/pdefault5",
            "/pwithcommas5",
            "/pwithcommas6",
        ];
        let noCommaNames = [
            "/pnocommas",
            "/pnocommas2",
            "/pnocommas3",
            "/pnocommas3a",
            "/pnocommas4",
            "/pnocommas5",
            "/pnocommas6",
            "/pnocommas6a",
        ];

        const stateVariables = await returnAllStateVariables(core);

        for (let name of commaNames) {
            // Note: we do not remove whitespace that has a following commas,
            // as we want to test that the whitespace before a comma is removed.

            expect(
                stateVariables[name].stateValues.text
                    .replace(/\s+(?!,)/g, " ")
                    .trim(),
            ).eq(pTextCommas);
        }
        for (let name of noCommaNames) {
            expect(
                stateVariables[name].stateValues.text
                    .replace(/\s+(?!,)/g, " ")
                    .trim(),
            ).eq(pTextNoCommas);
        }
    }

    it("map displays as list by default, single number in template", async () => {
        let core = await createTestCore({
            doenetML: create_as_list_template(`<number>$v^2</number>`),
        });

        let numbers = [...Array(10).keys()].map((v) => String((v + 1) ** 2));

        await test_as_list_maps(core, numbers);
    });

    it("map displays as list by default, number and string in template", async () => {
        let core = await createTestCore({
            doenetML: create_as_list_template(`
            <number>$v^2</number>
            x`),
        });

        let numbers = [...Array(10).keys()].map(
            (v) => String((v + 1) ** 2) + " x",
        );

        await test_as_list_maps(core, numbers);
    });

    it("map displays as list by default, number, string and math in template", async () => {
        let core = await createTestCore({
            doenetML: create_as_list_template(`
            <number>$v^2</number>
            <math>x</math>`),
        });

        let numbers = [...Array(10).keys()].map(
            (v) => String((v + 1) ** 2) + " x",
        );

        await test_as_list_maps(core, numbers);
    });

    it("map will display as list even if if has non-inline components with canBeInList set", async () => {
        let core = await createTestCore({
            doenetML: `
      <p name="p1"><map>
        <template><point>($v, $v^2)</point></template>
        <sources alias="v"><sequence to="3" /></sources>
      </map></p>
      <p name="p2"><map>
        <template><vector>($v, $v^2)</vector></template>
        <sources alias="v"><sequence to="3" /></sources>
      </map></p>
      <p name="p3"><map>
        <template><line>y=$v</line></template>
        <sources alias="v"><sequence to="3" /></sources>
      </map></p>
      <p name="p4"><map>
        <template><angle>2$v</angle></template>
        <sources alias="v"><sequence to="3" /></sources>
      </map></p>
    `,
        });

        const stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p1"].stateValues.text).eq(
            "( 1, 1 ), ( 2, 4 ), ( 3, 9 )",
        );
        expect(stateVariables["/p2"].stateValues.text).eq(
            "( 1, 1 ), ( 2, 4 ), ( 3, 9 )",
        );
        expect(stateVariables["/p3"].stateValues.text).eq(
            "y = 1, y = 2, y = 3",
        );
        expect(stateVariables["/p4"].stateValues.text).eq("2, 4, 6");
    });

    it("properly create unique name to avoid duplicate names", async () => {
        // Key point: second number in template is not assigned a name
        // and there is no new namespace. Make sure the names created
        // for the two instances of the second number do not collide.
        let core = await createTestCore({
            doenetML: `
    <map name="map1" assignNames='(n1) (n2) '>
      <template>
        <number>$i</number>
        <number>10*$i</number>
      </template>
      
      <sources alias='i'><sequence from='1' to='2' /></sources>
    </map>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        // Note: filter out strings by only including replacements
        // with a component type
        let n1a = stateVariables[
            stateVariables["/map1"].replacements![0].componentName
        ].replacements!.filter((s) => s.componentType)[1].componentName;
        let n2a = stateVariables[
            stateVariables["/map1"].replacements![1].componentName
        ].replacements!.filter((s) => s.componentType)[1].componentName;

        expect(stateVariables["/n1"].stateValues.value).eq(1);
        expect(stateVariables[n1a].stateValues.value).eq(10);
        expect(stateVariables["/n2"].stateValues.value).eq(2);
        expect(stateVariables[n2a].stateValues.value).eq(20);
    });

    it("bug for isResponse and parallel is fixed", async () => {
        let core = await createTestCore({
            doenetML: `
    <map isResponse behavior="parallel" assignNames="(p1) (p2)">
      <template>
        <p>hi $v</p>
      </template>
      <sources alias="v"><sequence length="2" /></sources>
    </map>
    `,
        });

        const stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/p1"].stateValues.text).eq("hi 1");
        expect(stateVariables["/p2"].stateValues.text).eq("hi 2");
        expect(stateVariables["/p1"].stateValues.isResponse).eq(true);
        expect(stateVariables["/p2"].stateValues.isResponse).eq(true);
    });

    it("map iterates over lists", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathList name="ml">x y</mathList>
    <textList name="tl">dog cat</textList>
    <numberList name="nl">1 2</numberList>
    <booleanList name="bl">true false</booleanList>

    <map assignNames="(m1) (m2)">
      <template>
        <math>2$v</math>
      </template>
      <sources alias="v">$ml</sources>
    </map>
    <map assignNames="(n1) (n2)">
      <template>
        <number>2$v</number>
      </template>
      <sources alias="v">$nl</sources>
    </map>
    <map assignNames="(t1) (t2)">
      <template>
        <text>Hello $v!</text>
      </template>
      <sources alias="v">$tl</sources>
    </map>
    <map assignNames="(b1) (b2)">
      <template>
        <boolean>not$v</boolean>
      </template>
      <sources alias="v">$bl</sources>
    </map>
    `,
        });

        const stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/m1"].stateValues.value.tree).eqls([
            "*",
            2,
            "x",
        ]);
        expect(stateVariables["/m2"].stateValues.value.tree).eqls([
            "*",
            2,
            "y",
        ]);
        expect(stateVariables["/n1"].stateValues.value).eq(2);
        expect(stateVariables["/n2"].stateValues.value).eq(4);
        expect(stateVariables["/t1"].stateValues.value).eq("Hello dog!");
        expect(stateVariables["/t2"].stateValues.value).eq("Hello cat!");
        expect(stateVariables["/b1"].stateValues.value).eq(false);
        expect(stateVariables["/b2"].stateValues.value).eq(true);
    });
});

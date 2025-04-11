import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { movePoint, updateMathInputValue } from "../utils/actions";
import { flattenDeep } from "@doenet/utils";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Collection assign name tests", async () => {
    it("name points and coords off a graph", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="graph1">
    <point>(1,2)</point>
    <point>(3,4)</point>
  </graph>

  <collect name="cl1" componentTypes="point" target="graph1" assignNames="a b" />

  <p>a: $a.coords{assignNames="aShadow"}</p>
  <p>b: $b.coords{assignNames="bShadow"}</p>

  <collect name="cl2" componentTypes="point" prop="x" target="graph1" assignNames="u v" />

  <p>u: $u{name="uShadow"}</p>
  <p>v: $v{name="vShadow"}</p>

  <graph>
    $cl1{name="cp1" assignNames="a1 b1"}
  </graph>

  <p>a1: $a1.coords{assignNames="a1Shadow"}</p>
  <p>b1: $b1.coords{assignNames="b1Shadow"}</p>

  $cl1.x{name="cp2" assignNames="u1 v1"}

  <p>u1: $u1{name="u1Shadow"}</p>
  <p>v1: $v1{name="v1Shadow"}</p>

  $cp1.x{name="cp3" assignNames="u2 v2"}

  <p>u2: $u2{name="u2Shadow"}</p>
  <p>v2: $v2{name="v2Shadow"}</p>

  <extract prop="x" assignNames="u3 v3">$cl1</extract>

  <p>u3: $u3{name="u3Shadow"}</p>
  <p>v3: $v3{name="v3Shadow"}</p>

  <extract prop="x" assignNames="u4">$a1</extract>
  <extract prop="x" assignNames="v4">$b1</extract>

  <p>u4: $u4{name="u4Shadow"}</p>
  <p>v4: $v4{name="v4Shadow"}</p>

  `,
        });

        const p1s = ["/a", "/a1"];
        const p2s = ["/b", "/b1"];
        const p1Coords = ["/aShadow", "/a1Shadow"];
        const p2Coords = ["/bShadow", "/b1Shadow"];
        const p1xs = [
            "/u",
            "/uShadow",
            "/u1",
            "/u1Shadow",
            "/u2",
            "/u2Shadow",
            "/u3",
            "/u3Shadow",
            "/u4",
            "/u4Shadow",
        ];
        const p2xs = [
            "/v",
            "/vShadow",
            "/v1",
            "/v1Shadow",
            "/v2",
            "/v2Shadow",
            "/v3",
            "/v3Shadow",
            "/v4",
            "/v4Shadow",
        ];
        async function check_items(p1: number[], p2: number[]) {
            let stateVariables = await core.returnAllStateVariables(true);
            for (let name of p1s) {
                expect(
                    stateVariables[name].stateValues.xs.map((v) => v.tree),
                ).eqls(p1);
            }
            for (let name of p2s) {
                expect(
                    stateVariables[name].stateValues.xs.map((v) => v.tree),
                ).eqls(p2);
            }
            for (let name of p1Coords) {
                expect(stateVariables[name].stateValues.value.tree).eqls([
                    "vector",
                    ...p1,
                ]);
            }
            for (let name of p2Coords) {
                expect(stateVariables[name].stateValues.value.tree).eqls([
                    "vector",
                    ...p2,
                ]);
            }
            for (let name of p1xs) {
                expect(stateVariables[name].stateValues.value.tree).eqls(p1[0]);
            }
            for (let name of p2xs) {
                expect(stateVariables[name].stateValues.value.tree).eqls(p2[0]);
            }
        }

        let p1 = [1, 2];
        let p2 = [3, 4];
        await check_items(p1, p2);

        // Move point a
        p1 = [5, -5];
        await movePoint({ name: "/a", x: p1[0], y: p1[1], core });
        await check_items(p1, p2);

        // Move point b
        p2 = [9, 8];
        await movePoint({ name: "/b", x: p2[0], y: p2[1], core });
        await check_items(p1, p2);

        // Move point a1
        p1 = [7, 0];
        await movePoint({ name: "/a1", x: p1[0], y: p1[1], core });
        await check_items(p1, p2);

        // Move point b1
        p2 = [4, 1];
        await movePoint({ name: "/b1", x: p2[0], y: p2[1], core });
        await check_items(p1, p2);
    });

    it("name points and coords off a graph, extra names", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="graph1">
    <point>(1,2)</point>
    <point>(3,4)</point>
  </graph>

  <collect name="cl1" componentTypes="point" target="graph1" assignNames="a b c" />

  <p>a: $a.coords{assignNames="aShadow"}</p>
  <p>b: $b.coords{assignNames="bShadow"}</p>
  <p name="pc">c: $c.coords{assignNames="cShadow"}</p>

  <collect name="cl2" componentTypes="point" prop="x" target="graph1" assignNames="u v w" />

  <p>u: $u{name="uShadow"}</p>
  <p>v: $v{name="vShadow"}</p>
  <p name="pw">w: $w{name="wShadow"}</p>

  <graph>
    $cl1{name="cp1" assignNames="a1 b1 c1"}
  </graph>

  <p>a1: $a1.coords{assignNames="a1Shadow"}</p>
  <p>b1: $b1.coords{assignNames="b1Shadow"}</p>
  <p name="pc1">c1: $c1.coords{assignNames="c1Shadow"}</p>

  $cl1.x{name="cp2" assignNames="u1 v1 w1 x1"}

  <p>u1: $u1{name="u1Shadow"}</p>
  <p>v1: $v1{name="v1Shadow"}</p>
  <p name="pw1">w1: $w1{name="w1Shadow"}</p>
  <p name="px1">x1: $x1{name="x1Shadow"}</p>

  $cp1.x{name="cp3" assignNames="u2 v2"}

  <p>u2: $u2{name="u2Shadow"}</p>
  <p>v2: $v2{name="v2Shadow"}</p>

  <extract prop="x" assignNames="u3 v3 w3 x3">$cl1</extract>

  <p>u3: $u3{name="u3Shadow"}</p>
  <p>v3: $v3{name="v3Shadow"}</p>
  <p name="pw3">w3: $w3{name="w3Shadow"}</p>
  <p name="px3">x3: $x3{name="x3Shadow"}</p>

  <extract prop="x" assignNames="u4 w4">$a1</extract>
  <extract prop="x" assignNames="v4 x4">$b1</extract>

  <p>u4: $u4{name="u4Shadow"}</p>
  <p>v4: $v4{name="v4Shadow"}</p>
  <p name="pw4">w4: $w4{name="w4Shadow"}</p>
  <p name="px4">x4: $x4{name="x4Shadow"}</p>

  `,
        });

        const p1s = ["/a", "/a1"];
        const p2s = ["/b", "/b1"];
        const p1Coords = ["/aShadow", "/a1Shadow"];
        const p2Coords = ["/bShadow", "/b1Shadow"];
        const p1xs = [
            "/u",
            "/uShadow",
            "/u1",
            "/u1Shadow",
            "/u2",
            "/u2Shadow",
            "/u3",
            "/u3Shadow",
            "/u4",
            "/u4Shadow",
        ];
        const p2xs = [
            "/v",
            "/vShadow",
            "/v1",
            "/v1Shadow",
            "/v2",
            "/v2Shadow",
            "/v3",
            "/v3Shadow",
            "/v4",
            "/v4Shadow",
        ];

        const extras = ["c", "c1", "w", "w1", "w3", "w4", "x1", "x3", "x4"];

        async function check_items(p1: number[], p2: number[]) {
            let stateVariables = await core.returnAllStateVariables(true);
            for (let name of p1s) {
                expect(
                    stateVariables[name].stateValues.xs.map((v) => v.tree),
                ).eqls(p1);
            }
            for (let name of p2s) {
                expect(
                    stateVariables[name].stateValues.xs.map((v) => v.tree),
                ).eqls(p2);
            }
            for (let name of p1Coords) {
                expect(stateVariables[name].stateValues.value.tree).eqls([
                    "vector",
                    ...p1,
                ]);
            }
            for (let name of p2Coords) {
                expect(stateVariables[name].stateValues.value.tree).eqls([
                    "vector",
                    ...p2,
                ]);
            }
            for (let name of p1xs) {
                expect(stateVariables[name].stateValues.value.tree).eqls(p1[0]);
            }
            for (let name of p2xs) {
                expect(stateVariables[name].stateValues.value.tree).eqls(p2[0]);
            }

            for (let prefix of extras) {
                expect(stateVariables[`/${prefix}`]).be.undefined;
                expect(stateVariables[`/${prefix}Shadow`]).be.undefined;
                expect(stateVariables[`/p${prefix}`].stateValues.text).eq(
                    `${prefix}: `,
                );
            }
        }

        let p1 = [1, 2];
        let p2 = [3, 4];
        await check_items(p1, p2);

        // Move point a
        p1 = [5, -5];
        await movePoint({ name: "/a", x: p1[0], y: p1[1], core });
        await check_items(p1, p2);

        // Move point b
        p2 = [9, 8];
        await movePoint({ name: "/b", x: p2[0], y: p2[1], core });
        await check_items(p1, p2);

        // Move point a1
        p1 = [7, 0];
        await movePoint({ name: "/a1", x: p1[0], y: p1[1], core });
        await check_items(p1, p2);

        // Move point b1
        p2 = [4, 1];
        await movePoint({ name: "/b1", x: p2[0], y: p2[1], core });
        await check_items(p1, p2);
    });

    it("sequentially name points and coords off lines", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="graph1">
    <line through="(0,0) (1,1)"/>
    <line through="(4,3) (2,1)"/>
  </graph>

  <graph>
    <collect name="cl1" componentTypes="line" prop="points" target="graph1" assignNames="a b c d" />
  </graph>
  
  <p>a: $a.coords{assignNames="aShadow"}</p>
  <p>b: $b.coords{assignNames="bShadow"}</p>
  <p>c: $c.coords{assignNames="cShadow"}</p>
  <p>d: $d.coords{assignNames="dShadow"}</p>

  $cl1.x{assignNames="p q r s"}

  <p>p: $p{name="pShadow"}</p>
  <p>q: $q{name="qShadow"}</p>
  <p>r: $r{name="rShadow"}</p>
  <p>s: $s{name="sShadow"}</p>

  <extract prop="x" assignNames="p1 q1 r1 s1" >$cl1</extract>

  <p>p1: $p1{name="p1Shadow"}</p>
  <p>q1: $q1{name="q1Shadow"}</p>
  <p>r1: $r1{name="r1Shadow"}</p>
  <p>s1: $s1{name="s1Shadow"}</p>

  $cl1.xs{assignNames="x11 x12 x21 x22 x31 x32 x41 x42"}

  <p>x11: $x11{name="x11Shadow"}</p>
  <p>x12: $x12{name="x12Shadow"}</p>
  <p>x21: $x21{name="x21Shadow"}</p>
  <p>x22: $x22{name="x22Shadow"}</p>
  <p>x31: $x31{name="x31Shadow"}</p>
  <p>x32: $x32{name="x32Shadow"}</p>
  <p>x41: $x41{name="x41Shadow"}</p>
  <p>x42: $x42{name="x42Shadow"}</p>

  <extract prop="xs" assignNames="y11 y12 y21 y22 y31 y32 y41 y42" >$cl1</extract>

  <p>y11: $y11{name="y11Shadow"}</p>
  <p>y12: $y12{name="y12Shadow"}</p>
  <p>y21: $y21{name="y21Shadow"}</p>
  <p>y22: $y22{name="y22Shadow"}</p>
  <p>y31: $y31{name="y31Shadow"}</p>
  <p>y32: $y32{name="y32Shadow"}</p>
  <p>y41: $y41{name="y41Shadow"}</p>
  <p>y42: $y42{name="y42Shadow"}</p>

  `,
        });

        async function check_items(ps: number[][]) {
            let stateVariables = await core.returnAllStateVariables(true);
            for (let [i, v] of ["/a", "/b", "/c", "/d"].entries()) {
                expect(
                    stateVariables[v].stateValues.xs.map((v) => v.tree),
                ).eqls(ps[i]);
                expect(
                    stateVariables[`${v}Shadow`].stateValues.value.tree,
                ).eqls(["vector", ...ps[i]]);
            }

            for (let [i, v] of ["/p", "/q", "/r", "/s"].entries()) {
                for (let post of ["", "Shadow", "1", "1Shadow"]) {
                    expect(
                        stateVariables[`${v}${post}`].stateValues.value.tree,
                    ).eqls(ps[i][0]);
                }
            }

            for (let i = 1; i <= 4; i++) {
                for (let j = 1; j <= 2; j++) {
                    for (let pre of ["/x", "/y"]) {
                        for (let post of ["", "Shadow"]) {
                            expect(
                                stateVariables[`${pre}${i}${j}${post}`]
                                    .stateValues.value.tree,
                            ).eq(ps[i - 1][j - 1]);
                        }
                    }
                }
            }
        }

        let ps = [
            [0, 0],
            [1, 1],
            [4, 3],
            [2, 1],
        ];
        await check_items(ps);

        // Move point a
        ps[0] = [5, -5];
        await movePoint({ name: "/a", x: ps[0][0], y: ps[0][1], core });
        await check_items(ps);

        // Move point b
        ps[1] = [7, 8];
        await movePoint({ name: "/b", x: ps[1][0], y: ps[1][1], core });
        await check_items(ps);

        // Move point c
        ps[2] = [-3, -6];
        await movePoint({ name: "/c", x: ps[2][0], y: ps[2][1], core });

        // Move point d
        ps[3] = [-9, -4];
        await movePoint({ name: "/d", x: ps[3][0], y: ps[3][1], core });
    });

    it("name points off a dynamic graph", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>Number for first set of points: <mathInput name="n1" /></p>
  <p>Number for second set of points: <mathInput name="n2" /></p>
  <graph name="graph1">
    <map>
      <template>
        <point>
          ($n+<math>0</math>,
          $i+<math>0</math>)
        </point>
      </template>
      <sources alias="n" indexAlias="i">
        <sequence from="2" length="$n1" />
      </sources>
    </map>
    <map>
      <template>
        <point>
          (-$n+<math>0</math>,
          -$i+<math>0</math>)
        </point>
      </template>
      <sources alias="n" indexAlias="i">
        <sequence from="2" length="$n2" />
      </sources>
    </map>
  </graph>


  <collect name="allPoints" componentTypes="point" target="graph1" assignNames="p1 p2 p3 p4"/>

  <p>p1: $p1.coords{assignNames="p1Shadow"}</p>
  <p>p2: $p2.coords{assignNames="p2Shadow"}</p>
  <p>p3: $p3.coords{assignNames="p3Shadow"}</p>
  <p>p4: $p4.coords{assignNames="p4Shadow"}</p>

  $allPoints{name="allPoints2" target="allPoints" assignNames="q1 q2 q3 q4 q5 q6"}

  <p>q1: $q1.coords{assignNames="q1Shadow"}</p>
  <p>q2: $q2.coords{assignNames="q2Shadow"}</p>
  <p>q3: $q3.coords{assignNames="q3Shadow"}</p>
  <p>q4: $q4.coords{assignNames="q4Shadow"}</p>
  <p>q5: $q5.coords{assignNames="q5Shadow"}</p>
  <p>q6: $q6.coords{assignNames="q6Shadow"}</p>

  <collect name="allXs1" componentTypes="point" prop="x" target="graph1" assignNames="x11 x12 x13 x14 x15 x16" />

  <p>x11: $x11{name="x11Shadow"}</p>
  <p>x12: $x12{name="x12Shadow"}</p>
  <p>x13: $x13{name="x13Shadow"}</p>
  <p>x14: $x14{name="x14Shadow"}</p>
  <p>x15: $x15{name="x15Shadow"}</p>
  <p>x16: $x16{name="x16Shadow"}</p>

  $allXs1{name="allXs2" assignNames="x21 x22 x23 x24"}

  <p>x21: $x21{name="x21Shadow"}</p>
  <p>x22: $x22{name="x22Shadow"}</p>
  <p>x23: $x23{name="x23Shadow"}</p>
  <p>x24: $x24{name="x24Shadow"}</p>

  $allPoints.x{name="allXs3" assignNames="x31 x32 x33 x34"}

  <p>x31: $x31{name="x31Shadow"}</p>
  <p>x32: $x32{name="x32Shadow"}</p>
  <p>x33: $x33{name="x33Shadow"}</p>
  <p>x34: $x34{name="x34Shadow"}</p>

  $allPoints2.x{name="allXs4" assignNames="x41 x42 x43 x44"}

  <p>x41: $x41{name="x41Shadow"}</p>
  <p>x42: $x42{name="x42Shadow"}</p>
  <p>x43: $x43{name="x43Shadow"}</p>
  <p>x44: $x44{name="x44Shadow"}</p>

  <extract name="allXs5" prop="x" assignNames="x51 x52 x53 x54 x55 x56">$allPoints</extract>

  <p>x51: $x51{name="x51Shadow"}</p>
  <p>x52: $x52{name="x52Shadow"}</p>
  <p>x53: $x53{name="x53Shadow"}</p>
  <p>x54: $x54{name="x54Shadow"}</p>
  <p>x55: $x55{name="x55Shadow"}</p>
  <p>x56: $x56{name="x56Shadow"}</p>


  `,
        });

        async function check_items(ps: number[][]) {
            let stateVariables = await core.returnAllStateVariables(true);
            for (let i = 1; i <= 4; i++) {
                if (i <= ps.length) {
                    expect(
                        stateVariables[`/p${i}`].stateValues.xs.map(
                            (v) => v.tree,
                        ),
                    ).eqls(ps[i - 1]);
                    expect(
                        stateVariables[`/p${i}Shadow`].stateValues.value.tree,
                    ).eqls(["vector", ...ps[i - 1]]);
                    for (let j of [2, 3, 4]) {
                        for (let post of ["", "Shadow"]) {
                            expect(
                                stateVariables[`/x${j}${i}${post}`].stateValues
                                    .value.tree,
                            ).eq(ps[i - 1][0]);
                        }
                    }
                } else {
                    expect(stateVariables[`/p${i}`]).be.undefined;
                    expect(stateVariables[`/p${i}Shadow`]).be.undefined;
                    for (let j of [2, 3, 4]) {
                        for (let post of ["", "Shadow"]) {
                            expect(stateVariables[`/x${j}${i}${post}`]).be
                                .undefined;
                        }
                    }
                }
            }
            for (let i = 1; i <= 6; i++) {
                if (i <= ps.length) {
                    expect(
                        stateVariables[`/q${i}`].stateValues.xs.map(
                            (v) => v.tree,
                        ),
                    ).eqls(ps[i - 1]);
                    expect(
                        stateVariables[`/q${i}Shadow`].stateValues.value.tree,
                    ).eqls(["vector", ...ps[i - 1]]);
                    for (let j of [1, 5]) {
                        for (let post of ["", "Shadow"]) {
                            expect(
                                stateVariables[`/x${j}${i}${post}`].stateValues
                                    .value.tree,
                            ).eq(ps[i - 1][0]);
                        }
                    }
                } else {
                    expect(stateVariables[`/q${i}`]).be.undefined;
                    expect(stateVariables[`/q${i}Shadow`]).be.undefined;
                    for (let j of [1, 5]) {
                        for (let post of ["", "Shadow"]) {
                            expect(stateVariables[`/x${j}${i}${post}`]).be
                                .undefined;
                        }
                    }
                }
            }
        }

        let ps: number[][] = [];
        await check_items(ps);

        // Create 1 and 2 points
        await updateMathInputValue({ latex: "1", name: "/n1", core });
        await updateMathInputValue({ latex: "2", name: "/n2", core });
        ps = [
            [2, 1],
            [-2, -1],
            [-3, -2],
        ];
        await check_items(ps);

        // Move point all three points
        ps = [
            [1, 2],
            [3, 4],
            [5, 6],
        ];
        await movePoint({ name: "/p1", x: ps[0][0], y: ps[0][1], core });
        await movePoint({ name: "/p2", x: ps[1][0], y: ps[1][1], core });
        await movePoint({ name: "/p3", x: ps[2][0], y: ps[2][1], core });
        await check_items(ps);

        // 2 and 4 points
        await updateMathInputValue({ latex: "2", name: "/n1", core });
        await updateMathInputValue({ latex: "4", name: "/n2", core });
        ps.splice(1, 0, [3, 2]);
        ps.push(
            ...[
                [-4, -3],
                [-5, -4],
            ],
        );
        await check_items(ps);

        // Move point all six points
        ps = [
            [-1, -9],
            [-2, -8],
            [-3, -7],
            [-4, -6],
            [-5, -5],
            [-6, -4],
        ];
        await movePoint({ name: "/q1", x: ps[0][0], y: ps[0][1], core });
        await movePoint({ name: "/q2", x: ps[1][0], y: ps[1][1], core });
        await movePoint({ name: "/q3", x: ps[2][0], y: ps[2][1], core });
        await movePoint({ name: "/q4", x: ps[3][0], y: ps[3][1], core });
        await movePoint({ name: "/q5", x: ps[4][0], y: ps[4][1], core });
        await movePoint({ name: "/q6", x: ps[5][0], y: ps[5][1], core });
        await check_items(ps);

        // Down to 1 and 3 points
        await updateMathInputValue({ latex: "1", name: "/n1", core });
        await updateMathInputValue({ latex: "3", name: "/n2", core });
        ps.splice(1, 1);
        ps.splice(4, 1);
        await check_items(ps);

        // Move point all four points
        ps = [
            [4, -5],
            [3, -6],
            [2, -7],
            [1, -8],
        ];
        await movePoint({ name: "/p1", x: ps[0][0], y: ps[0][1], core });
        await movePoint({ name: "/p2", x: ps[1][0], y: ps[1][1], core });
        await movePoint({ name: "/p3", x: ps[2][0], y: ps[2][1], core });
        await movePoint({ name: "/p4", x: ps[3][0], y: ps[3][1], core });
        await check_items(ps);

        // 4 and 2 points, remembers old 2nd value
        await updateMathInputValue({ latex: "4", name: "/n1", core });
        await updateMathInputValue({ latex: "2", name: "/n2", core });
        ps.splice(1, 0, [-2, -8], [4, 3], [5, 4]);
        ps.splice(6, 1);
        await check_items(ps);

        // Move point all six points again
        ps = [
            [-4, 6],
            [-5, 5],
            [-6, 4],
            [-7, 3],
            [-8, 2],
            [-9, 1],
        ];
        await movePoint({ name: "/q1", x: ps[0][0], y: ps[0][1], core });
        await movePoint({ name: "/q2", x: ps[1][0], y: ps[1][1], core });
        await movePoint({ name: "/q3", x: ps[2][0], y: ps[2][1], core });
        await movePoint({ name: "/q4", x: ps[3][0], y: ps[3][1], core });
        await movePoint({ name: "/q5", x: ps[4][0], y: ps[4][1], core });
        await movePoint({ name: "/q6", x: ps[5][0], y: ps[5][1], core });
        await check_items(ps);

        // 0 and 3 points, remembers old 3rd value
        await updateMathInputValue({ latex: "0", name: "/n1", core });
        await updateMathInputValue({ latex: "3", name: "/n2", core });
        ps.splice(0, 4);
        ps.push([1, -8]);
        await check_items(ps);

        // 3 and 3 points
        await updateMathInputValue({ latex: "3", name: "/n1", core });
        ps.splice(0, 0, [-4, 6], [-5, 5], [-6, 4]);
        await check_items(ps);
    });

    it("name points off a dynamic list with changing dimensions", async () => {
        let core = await createTestCore({
            doenetML: `
  <section name="originals"><title>The originals</title>

    <p>Number for first set of points: <mathInput name="n1" /></p>
    <p>Number for second set of points: <mathInput name="n2" /></p>
    <p>Number of dimensions 1: <mathInput name="nd1" prefill="2"/></p>
    <p>Number of dimensions 2: <mathInput name="nd2" prefill="3"/></p>
    <map assignNames="pa1 pa2 pa3">
      <template newNamespace>
        <map hide name="map1">
          <template>
            <math>$b$a + <math>0</math></math>
          </template>
          <sources alias="a">
            <sequence length="$(../nd1)" />
          </sources>
        </map>
        <point name="point1" xs="$map1" />
      </template>
      <sources alias="b">
        <sequence length="$n1" />
      </sources>
    </map>
    <map assignNames="pb1 pb2 pb3">
      <template newNamespace>
        <map name="map1">
          <template>
            <math>-$b$a + <math>0</math></math>
          </template>
          <sources alias="a">
            <sequence length="$(../nd2)" />
          </sources>
        </map>
        <point name="point1" xs="$map1" />
      </template>
      <sources alias="b">
        <sequence length="$n2" />
      </sources>
    </map>
  </section>

  <collect name="allPoints" componentTypes="point" target="originals" assignNames="p1 p2 p3 p4"/>

  <p>p1: $p1.coords{assignNames="p1Shadow"}</p>
  <p>p2: $p2.coords{assignNames="p2Shadow"}</p>
  <p>p3: $p3.coords{assignNames="p3Shadow"}</p>
  <p>p4: $p4.coords{assignNames="p4Shadow"}</p>

  $allPoints{name="allPoints2" assignNames="q1 q2 q3 q4 q5 q6"}

  <p>q1: $q1.coords{assignNames="q1Shadow"}</p>
  <p>q2: $q2.coords{assignNames="q2Shadow"}</p>
  <p>q3: $q3.coords{assignNames="q3Shadow"}</p>
  <p>q4: $q4.coords{assignNames="q4Shadow"}</p>
  <p>q5: $q5.coords{assignNames="q5Shadow"}</p>
  <p>q6: $q6.coords{assignNames="q6Shadow"}</p>

  <collect name="allXs1" componentTypes="point" prop="xs" target="originals" assignNames="xs11 xs12 xs13 xs14 xs15 xs16 xs17 xs18" />

  <p>xs11: $xs11{name="xs11Shadow"}</p>
  <p>xs12: $xs12{name="xs12Shadow"}</p>
  <p>xs13: $xs13{name="xs13Shadow"}</p>
  <p>xs14: $xs14{name="xs14Shadow"}</p>
  <p>xs15: $xs15{name="xs15Shadow"}</p>
  <p>xs16: $xs16{name="xs16Shadow"}</p>
  <p>xs17: $xs17{name="xs17Shadow"}</p>
  <p>xs18: $xs18{name="xs18Shadow"}</p>

  $allXs1{name="allXs2" assignNames="xs21 xs22 xs23 xs24 xs25 xs26"}

  <p>xs21: $xs21{name="xs21Shadow"}</p>
  <p>xs22: $xs22{name="xs22Shadow"}</p>
  <p>xs23: $xs23{name="xs23Shadow"}</p>
  <p>xs24: $xs24{name="xs24Shadow"}</p>
  <p>xs25: $xs25{name="xs25Shadow"}</p>
  <p>xs26: $xs26{name="xs26Shadow"}</p>

  $allPoints.xs{name="allXs3" assignNames="xs31 xs32 xs33 xs34 xs35 xs36"}

  <p>xs31: $xs31{name="xs31Shadow"}</p>
  <p>xs32: $xs32{name="xs32Shadow"}</p>
  <p>xs33: $xs33{name="xs33Shadow"}</p>
  <p>xs34: $xs34{name="xs34Shadow"}</p>
  <p>xs35: $xs35{name="xs35Shadow"}</p>
  <p>xs36: $xs36{name="xs36Shadow"}</p>

  $allPoints2.xs{name="allXs4" assignNames="xs41 xs42 xs43 xs44 xs45 xs46"}

  <p>xs41: $xs41{name="xs41Shadow"}</p>
  <p>xs42: $xs42{name="xs42Shadow"}</p>
  <p>xs43: $xs43{name="xs43Shadow"}</p>
  <p>xs44: $xs44{name="xs44Shadow"}</p>
  <p>xs45: $xs45{name="xs45Shadow"}</p>
  <p>xs46: $xs46{name="xs46Shadow"}</p>

  <extract name="allXs5" prop="xs" assignNames="xs51 xs52 xs53 xs54 xs55 xs56 xs57 xs58">$allPoints</extract>

  <p>xs51: $xs51{name="xs51Shadow"}</p>
  <p>xs52: $xs52{name="xs52Shadow"}</p>
  <p>xs53: $xs53{name="xs53Shadow"}</p>
  <p>xs54: $xs54{name="xs54Shadow"}</p>
  <p>xs55: $xs55{name="xs55Shadow"}</p>
  <p>xs56: $xs56{name="xs56Shadow"}</p>
  <p>xs57: $xs57{name="xs57Shadow"}</p>
  <p>xs58: $xs58{name="xs58Shadow"}</p>

  `,
        });

        async function check_items(points1: number[][], points2: number[][]) {
            const stateVariables = await core.returnAllStateVariables(true);
            let allPoints = [...points1, ...points2];

            let allXs = flattenDeep(allPoints);

            for (let ind = 0; ind < 3; ind++) {
                let pointA = points1[ind];
                if (pointA) {
                    expect(
                        stateVariables[
                            `/pa${ind + 1}/point1`
                        ].stateValues.xs.map((v) => v.tree),
                    ).eqls(pointA);
                } else {
                    expect(
                        stateVariables[`/pa${ind + 1}/point1`] === undefined ||
                            stateVariables[`/pa${ind + 1}/point1`].stateValues
                                .isInactiveCompositeReplacement,
                    ).eq(true);
                }

                let pointB = points2[ind];
                if (pointB) {
                    expect(
                        stateVariables[
                            `/pb${ind + 1}/point1`
                        ].stateValues.xs.map((v) => v.tree),
                    ).eqls(pointB);
                } else {
                    expect(
                        stateVariables[`/pb${ind + 1}/point1`] === undefined ||
                            stateVariables[`/pb${ind + 1}/point1`].stateValues
                                .isInactiveCompositeReplacement,
                    ).eq(true);
                }
            }

            for (let ind = 0; ind < 4; ind++) {
                let point = allPoints[ind];
                if (point) {
                    expect(
                        stateVariables[`/p${ind + 1}`].stateValues.xs.map(
                            (v) => v.tree,
                        ),
                    ).eqls(point);
                    expect(
                        stateVariables[`/p${ind + 1}Shadow`].stateValues.value
                            .tree,
                    ).eqls(
                        point.length === 1 ? point[0] : ["vector", ...point],
                    );
                } else {
                    expect(stateVariables[`/p${ind + 1}`]).be.undefined;
                    expect(stateVariables[`/p${ind + 1}Shadow`]).be.undefined;
                }
            }

            for (let ind = 0; ind < 6; ind++) {
                let point = allPoints[ind];
                if (point) {
                    expect(
                        stateVariables[`/q${ind + 1}`].stateValues.xs.map(
                            (v) => v.tree,
                        ),
                    ).eqls(point);
                    expect(
                        stateVariables[`/q${ind + 1}Shadow`].stateValues.value
                            .tree,
                    ).eqls(
                        point.length === 1 ? point[0] : ["vector", ...point],
                    );
                } else {
                    expect(stateVariables[`/q${ind + 1}`]).be.undefined;
                    expect(stateVariables[`/q${ind + 1}Shadow`]).be.undefined;
                }
            }

            for (let ind = 0; ind < 8; ind++) {
                let theX = allXs[ind];
                if (theX !== undefined) {
                    for (let j of [1, 5]) {
                        for (let post of ["", "Shadow"]) {
                            expect(
                                stateVariables[`/xs${j}${ind + 1}${post}`]
                                    .stateValues.value.tree,
                            ).eq(theX);
                        }
                    }
                } else {
                    for (let j of [1, 5]) {
                        for (let post of ["", "Shadow"]) {
                            expect(stateVariables[`/xs${j}${ind + 1}${post}`])
                                .be.undefined;
                        }
                    }
                }
            }

            for (let ind = 0; ind < 6; ind++) {
                let theX = allXs[ind];
                if (theX !== undefined) {
                    for (let j of [2, 3, 4]) {
                        for (let post of ["", "Shadow"]) {
                            expect(
                                stateVariables[`/xs${j}${ind + 1}${post}`]
                                    .stateValues.value.tree,
                            ).eq(theX);
                        }
                    }
                } else {
                    if (theX !== undefined) {
                        for (let j of [2, 3, 4]) {
                            for (let post of ["", "Shadow"]) {
                                expect(
                                    stateVariables[`/xs${j}${ind + 1}${post}`],
                                ).be.undefined;
                            }
                        }
                    }
                }
            }
        }

        let points1: number[][] = [],
            points2: number[][] = [];

        await check_items(points1, points2);

        // Create 1 and 2 points
        await updateMathInputValue({ latex: "1", name: "/n1", core });
        await updateMathInputValue({ latex: "2", name: "/n2", core });

        points1 = [[1, 2]];
        points2 = [
            [-1, -2, -3],
            [-2, -4, -6],
        ];

        await check_items(points1, points2);

        // move points
        // Move points
        await movePoint({ name: "/pa1/point1", x: 3, y: 9, core });
        await movePoint({ name: "/pb1/point1", x: -6, y: -5, z: 4, core });
        await movePoint({ name: "/pb2/point1", x: 8, y: 0, z: 7, core });

        points1 = [[3, 9]];
        points2 = [
            [-6, -5, 4],
            [8, 0, 7],
        ];

        await check_items(points1, points2);

        // Change dimensions to 3 and 2
        await updateMathInputValue({ latex: "3", name: "/nd1", core });
        await updateMathInputValue({ latex: "2", name: "/nd2", core });

        points1 = [[3, 9, 3]];
        points2 = [
            [-6, -5],
            [8, 0],
        ];

        await check_items(points1, points2);

        // Move points
        await movePoint({ name: "/pa1/point1", x: -1, y: 7, z: -9, core });
        await movePoint({ name: "/pb1/point1", x: 5, y: 4, core });
        await movePoint({ name: "/pb2/point1", x: 3, y: 2, core });

        points1 = [[-1, 7, -9]];
        points2 = [
            [5, 4],
            [3, 2],
        ];

        await check_items(points1, points2);

        // Change to 2 and 1 points
        await updateMathInputValue({ latex: "2", name: "/n1", core });
        await updateMathInputValue({ latex: "1", name: "/n2", core });

        points1 = [
            [-1, 7, -9],
            [2, 4, 6],
        ];
        points2 = [[5, 4]];

        await check_items(points1, points2);

        // Move points
        await movePoint({ name: "/pa1/point1", x: 9, y: -8, z: 7, core });
        await movePoint({ name: "/pa2/point1", x: -6, y: 5, z: -4, core });
        await movePoint({ name: "/pb1/point1", x: 3, y: -2, core });

        points1 = [
            [9, -8, 7],
            [-6, 5, -4],
        ];
        points2 = [[3, -2]];

        await check_items(points1, points2);

        // Change dimensions to 2 and 1
        await updateMathInputValue({ latex: "2", name: "/nd1", core });
        await updateMathInputValue({ latex: "1", name: "/nd2", core });

        points1 = [
            [9, -8],
            [-6, 5],
        ];
        points2 = [[3]];

        await check_items(points1, points2);

        // Change to 1 and 3 points
        await updateMathInputValue({ latex: "1", name: "/n1", core });
        await updateMathInputValue({ latex: "3", name: "/n2", core });

        points1 = [[9, -8]];
        points2 = [[3], [3], [-3]];

        await check_items(points1, points2);
    });

    // collect points and lines, once decide how should recurse
});

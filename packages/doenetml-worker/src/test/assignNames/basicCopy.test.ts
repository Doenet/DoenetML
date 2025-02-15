import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import { movePoint, updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Basic copy assign name tests", async () => {
    // Note: this isn't using assignNames anymore given changes to how copies work
    it("recursively copying and naming text", async () => {
        let core = await createTestCore({
            doenetML: `
      <text name="a">hello</text>
      $a{name="b"}
      $b{name="c"}
      $c{name="d"}
      $c{name="e"}
      $e{name="f"}
      $f{name="g"}
      $g{name="h"}
      $h{name="i"}
    
      `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/a"].stateValues.value).eq("hello");
        expect(stateVariables["/b"].stateValues.value).eq("hello");
        expect(stateVariables["/c"].stateValues.value).eq("hello");
        expect(stateVariables["/d"].stateValues.value).eq("hello");
        expect(stateVariables["/e"].stateValues.value).eq("hello");
        expect(stateVariables["/f"].stateValues.value).eq("hello");
        expect(stateVariables["/g"].stateValues.value).eq("hello");
        expect(stateVariables["/h"].stateValues.value).eq("hello");
        expect(stateVariables["/i"].stateValues.value).eq("hello");
    });

    it("assign name to prop", async () => {
        let core = await createTestCore({
            doenetML: `
  <math name="math1">x+x</math>
  $math1.simplify{name="cp1" assignNames="s1"}
  $s1{name="s2"}
  $cp1{assignNames="s3"}

  <math name="m1" copySource="math1" simplify="full" />
  $m1.simplify{name="cp5" assignNames="s4" target="m1" }
  $s4{name="s5"}
  $cp5{assignNames="s6"}

  <extract name="ex1" prop="simplify" assignNames="s7">$math1</extract>
  $s7{name="s8"}
  $ex1{assignNames="s9"}
  <extract name="ex2" prop="simplify" assignNames="s10">$m1</extract>
  $s10{name="s11"}
  $ex2{assignNames="s12"}

  `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/math1"].stateValues.value.tree).eqls([
            "+",
            "x",
            "x",
        ]);
        expect(stateVariables["/s1"].stateValues.value).eq("none");
        expect(stateVariables["/s2"].stateValues.value).eq("none");
        expect(stateVariables["/s3"].stateValues.value).eq("none");

        expect(stateVariables["/m1"].stateValues.value.tree).eqls([
            "*",
            2,
            "x",
        ]);
        expect(stateVariables["/s4"].stateValues.value).eq("full");
        expect(stateVariables["/s5"].stateValues.value).eq("full");
        expect(stateVariables["/s6"].stateValues.value).eq("full");

        expect(stateVariables["/s7"].stateValues.value).eq("none");
        expect(stateVariables["/s8"].stateValues.value).eq("none");
        expect(stateVariables["/s9"].stateValues.value).eq("none");
        expect(stateVariables["/s10"].stateValues.value).eq("full");
        expect(stateVariables["/s11"].stateValues.value).eq("full");
        expect(stateVariables["/s12"].stateValues.value).eq("full");
    });

    it("assign names to array prop", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <line name="l" through="(0,0) (1,1)" />
  </graph>

  $l.points{name="pts" assignNames="b c"}

  <graph>
    $b{name="b1"}
    $c{name="c1"}
  </graph>

  <graph>
    $pts{assignNames="d e"}
  </graph>

  $d{name="f"}
  $e{name="g"}

  `,
        });

        async function check_items(b: number[], c: number[]) {
            const stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/b"].stateValues.xs.map((v) => v.tree)).eqls(
                b,
            );
            expect(stateVariables["/c"].stateValues.xs.map((v) => v.tree)).eqls(
                c,
            );
            expect(
                stateVariables["/b1"].stateValues.xs.map((v) => v.tree),
            ).eqls(b);
            expect(
                stateVariables["/c1"].stateValues.xs.map((v) => v.tree),
            ).eqls(c);
            expect(stateVariables["/d"].stateValues.xs.map((v) => v.tree)).eqls(
                b,
            );
            expect(stateVariables["/e"].stateValues.xs.map((v) => v.tree)).eqls(
                c,
            );
            expect(stateVariables["/f"].stateValues.xs.map((v) => v.tree)).eqls(
                b,
            );
            expect(stateVariables["/g"].stateValues.xs.map((v) => v.tree)).eqls(
                c,
            );
        }

        let b = [0, 0];
        let c = [1, 1];

        await check_items(b, c);

        // move point b
        b = [5, -5];
        await movePoint({ name: "/b", x: b[0], y: b[1], core });
        await check_items(b, c);

        // move point c
        c = [3, 4];
        await movePoint({ name: "/c", x: c[0], y: c[1], core });
        await check_items(b, c);

        // move point b1
        b = [-9, -8];
        await movePoint({ name: "/b1", x: b[0], y: b[1], core });
        await check_items(b, c);

        // move point c1
        c = [-1, -3];
        await movePoint({ name: "/c1", x: c[0], y: c[1], core });
        await check_items(b, c);

        // move point d
        b = [0, 2];
        await movePoint({ name: "/d", x: b[0], y: b[1], core });
        await check_items(b, c);

        // move point e
        c = [5, 4];
        await movePoint({ name: "/e", x: c[0], y: c[1], core });
        await check_items(b, c);

        // move point f
        b = [6, 7];
        await movePoint({ name: "/f", x: b[0], y: b[1], core });
        await check_items(b, c);

        // move point g
        c = [9, 3];
        await movePoint({ name: "/g", x: c[0], y: c[1], core });
        await check_items(b, c);
    });

    it("assign names to length-1 array prop", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <line name="l" through="(0,0) (1,1)" />
  </graph>

  $l.point1{name="cp1" assignNames="b"}

  <graph>
    $b{name="b1"}
  </graph>

  <graph>
    $cp1{assignNames="d"}
  </graph>

  $d{name="f"}

  `,
        });

        async function check_items(b: number[]) {
            const stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/b"].stateValues.xs.map((v) => v.tree)).eqls(
                b,
            );
            expect(
                stateVariables["/b1"].stateValues.xs.map((v) => v.tree),
            ).eqls(b);
            expect(stateVariables["/d"].stateValues.xs.map((v) => v.tree)).eqls(
                b,
            );
            expect(stateVariables["/f"].stateValues.xs.map((v) => v.tree)).eqls(
                b,
            );
        }

        let b = [0, 0];
        await check_items(b);

        // move point b
        b = [5, -5];
        await movePoint({ name: "/b", x: b[0], y: b[1], core });
        await check_items(b);

        // move point b1
        b = [-9, -8];
        await movePoint({ name: "/b1", x: b[0], y: b[1], core });
        await check_items(b);

        // move point d
        b = [0, 2];
        await movePoint({ name: "/d", x: b[0], y: b[1], core });
        await check_items(b);

        // move point f
        b = [6, 7];
        await movePoint({ name: "/f", x: b[0], y: b[1], core });
        await check_items(b);
    });

    it("assign names to prop of array prop", async () => {
        let core = await createTestCore({
            doenetML: `

  <graph>
    <line name="l" through="(0,0) (1,1)" />
  </graph>

  <graph>
    $l.points{name="pts" assignNames="b c"}
  </graph>

  <p>xs of points: $pts.x{assignNames="d e"}</p>

  <p>
    xs again: $d{name="f"}
    $e{name="g"}
  </p>

  `,
        });

        async function check_items(b: number[], c: number[]) {
            const stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/b"].stateValues.xs.map((v) => v.tree)).eqls(
                b,
            );
            expect(stateVariables["/c"].stateValues.xs.map((v) => v.tree)).eqls(
                c,
            );
            expect(stateVariables["/d"].stateValues.value.tree).eq(b[0]);
            expect(stateVariables["/e"].stateValues.value.tree).eq(c[0]);
            expect(stateVariables["/f"].stateValues.value.tree).eq(b[0]);
            expect(stateVariables["/g"].stateValues.value.tree).eq(c[0]);
        }

        let b = [0, 0];
        let c = [1, 1];
        await check_items(b, c);

        // move point b
        b = [5, -5];
        await movePoint({ name: "/b", x: b[0], y: b[1], core });
        await check_items(b, c);

        // move point c
        c = [3, 4];
        await movePoint({ name: "/c", x: c[0], y: c[1], core });
        await check_items(b, c);
    });

    it("cannot assign sub-names to array prop", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <line name="l" through="(0,0) (1,1)" />
  </graph>

  $l.points{name="pts" assignNames="(a1 a2) (b1 b2)"}
  
  <p name="n1">nothing 1: $a1</p>
  <p name="n2">nothing 2: $a2</p>
  <p name="n3">nothing 3: $b1</p>
  <p name="n4">nothing 4: $b2</p>

  <graph>
    $pts{name="ptsa" assignNames="c d"}
  </graph>

  $c{name="e"}
  $d{name="f"}

  $pts{name="ptsb" assignNames="(g1 g2) (h1 h2)"}

  <p name="n5">nothing 5: $g1</p>
  <p name="n6">nothing 6: $g2</p>
  <p name="n7">nothing 7: $h1</p>
  <p name="n8">nothing 8: $h2</p>

  $ptsa{name="ptsc" assignNames="(i1 i2) (j1 j2)"}

  <p name="n9">nothing 9: $i1</p>
  <p name="n10">nothing 10: $i2</p>
  <p name="n11">nothing 11: $j1</p>
  <p name="n12">nothing 12: $j2</p>


  `,
        });

        async function check_items(p1: number[], p2: number[]) {
            const stateVariables = await returnAllStateVariables(core);
            let point1 = stateVariables["/pts"].replacements![0].componentName;
            let point2 = stateVariables["/pts"].replacements![1].componentName;
            let point1a =
                stateVariables["/ptsb"].replacements![0].componentName;
            let point2a =
                stateVariables["/ptsb"].replacements![1].componentName;
            let point1b =
                stateVariables["/ptsc"].replacements![0].componentName;
            let point2b =
                stateVariables["/ptsc"].replacements![1].componentName;

            expect(
                stateVariables[point1].stateValues.xs.map((v) => v.tree),
            ).eqls(p1);
            expect(
                stateVariables[point2].stateValues.xs.map((v) => v.tree),
            ).eqls(p2);
            expect(
                stateVariables[point1a].stateValues.xs.map((v) => v.tree),
            ).eqls(p1);
            expect(
                stateVariables[point2a].stateValues.xs.map((v) => v.tree),
            ).eqls(p2);
            expect(
                stateVariables[point1b].stateValues.xs.map((v) => v.tree),
            ).eqls(p1);
            expect(
                stateVariables[point2b].stateValues.xs.map((v) => v.tree),
            ).eqls(p2);
            expect(stateVariables["/c"].stateValues.xs.map((v) => v.tree)).eqls(
                p1,
            );
            expect(stateVariables["/d"].stateValues.xs.map((v) => v.tree)).eqls(
                p2,
            );
            expect(stateVariables["/e"].stateValues.xs.map((v) => v.tree)).eqls(
                p1,
            );
            expect(stateVariables["/f"].stateValues.xs.map((v) => v.tree)).eqls(
                p2,
            );
            for (let prefix of ["a", "b", "g", "h", "i", "j"]) {
                expect(stateVariables[`/${prefix}1`]).be.undefined;
                expect(stateVariables[`/${prefix}2`]).be.undefined;
            }
            for (let i = 1; i <= 12; i++) {
                expect(stateVariables[`/n${i}`].stateValues.text).eq(
                    `nothing ${i}: `,
                );
            }
        }

        let p1 = [0, 0];
        let p2 = [1, 1];
        await check_items(p1, p2);

        // move point c
        p1 = [5, -5];
        await movePoint({ name: "/c", x: p1[0], y: p1[1], core });
        await check_items(p1, p2);

        // move point d
        p2 = [3, 4];
        await movePoint({ name: "/d", x: p2[0], y: p2[1], core });
        await check_items(p1, p2);

        // move point e
        p1 = [-9, -8];
        await movePoint({ name: "/e", x: p1[0], y: p1[1], core });
        await check_items(p1, p2);

        // move point f
        p2 = [-1, -3];
        await movePoint({ name: "/f", x: p2[0], y: p2[1], core });
        await check_items(p1, p2);
    });

    it("cannot assign sub-names to array prop, inside namespace", async () => {
        let core = await createTestCore({
            doenetML: `
  <section name="hello" newNamespace ><title>hello</title>
    <graph>
        <line name="l" through="(0,0) (1,1)" />
    </graph>

    $l.points{name="pts" assignNames="(a1 a2) (b1 b2)"}
    
    <p name="n1">nothing 1: $a1</p>
    <p name="n2">nothing 2: $a2</p>
    <p name="n3">nothing 3: $b1</p>
    <p name="n4">nothing 4: $b2</p>

    <graph>
        $pts{name="ptsa" assignNames="c d"}
    </graph>

    $c{name="e"}
    $d{name="f"}

    $pts{name="ptsb" assignNames="(g1 g2) (h1 h2)"}
    
    <p name="n5">nothing 5: $g1</p>
    <p name="n6">nothing 6: $g2</p>
    <p name="n7">nothing 7: $h1</p>
    <p name="n8">nothing 8: $h2</p>

    $ptsa{name="ptsc" assignNames="(i1 i2) (j1 j2)"}
    
    <p name="n9">nothing 9: $i1</p>
    <p name="n10">nothing 10: $i2</p>
    <p name="n11">nothing 11: $j1</p>
    <p name="n12">nothing 12: $j2</p>
  
  </section>

  $(hello/e{name="e"})
  $(hello/f{name="f"})

  <p name="n13">nothing 13: $(hello/i1)</p>
  <p name="n14">nothing 14: $(hello/i2)</p>
  <p name="n15">nothing 15: $(hello/j1)</p>
  <p name="n16">nothing 16: $(hello/j2)</p>
  

  `,
        });

        async function check_items(p1: number[], p2: number[]) {
            const stateVariables = await returnAllStateVariables(core);
            let point1 =
                stateVariables["/hello/pts"].replacements![0].componentName;
            let point2 =
                stateVariables["/hello/pts"].replacements![1].componentName;
            let point1a =
                stateVariables["/hello/ptsb"].replacements![0].componentName;
            let point2a =
                stateVariables["/hello/ptsb"].replacements![1].componentName;
            let point1b =
                stateVariables["/hello/ptsc"].replacements![0].componentName;
            let point2b =
                stateVariables["/hello/ptsc"].replacements![1].componentName;

            expect(
                stateVariables[point1].stateValues.xs.map((v) => v.tree),
            ).eqls(p1);
            expect(
                stateVariables[point2].stateValues.xs.map((v) => v.tree),
            ).eqls(p2);
            expect(
                stateVariables[point1a].stateValues.xs.map((v) => v.tree),
            ).eqls(p1);
            expect(
                stateVariables[point2a].stateValues.xs.map((v) => v.tree),
            ).eqls(p2);
            expect(
                stateVariables[point1b].stateValues.xs.map((v) => v.tree),
            ).eqls(p1);
            expect(
                stateVariables[point2b].stateValues.xs.map((v) => v.tree),
            ).eqls(p2);
            expect(
                stateVariables["/hello/c"].stateValues.xs.map((v) => v.tree),
            ).eqls(p1);
            expect(
                stateVariables["/hello/d"].stateValues.xs.map((v) => v.tree),
            ).eqls(p2);
            expect(
                stateVariables["/hello/e"].stateValues.xs.map((v) => v.tree),
            ).eqls(p1);
            expect(
                stateVariables["/hello/f"].stateValues.xs.map((v) => v.tree),
            ).eqls(p2);
            expect(stateVariables["/e"].stateValues.xs.map((v) => v.tree)).eqls(
                p1,
            );
            expect(stateVariables["/f"].stateValues.xs.map((v) => v.tree)).eqls(
                p2,
            );
            for (let prefix of ["a", "b", "g", "h", "i", "j"]) {
                expect(stateVariables[`/hello/${prefix}1`]).be.undefined;
                expect(stateVariables[`/hello/${prefix}2`]).be.undefined;
            }
            for (let i = 1; i <= 12; i++) {
                expect(stateVariables[`/hello/n${i}`].stateValues.text).eq(
                    `nothing ${i}: `,
                );
            }
            for (let i = 13; i <= 16; i++) {
                expect(stateVariables[`/n${i}`].stateValues.text).eq(
                    `nothing ${i}: `,
                );
            }
        }

        let p1 = [0, 0];
        let p2 = [1, 1];
        await check_items(p1, p2);

        // move point c
        p1 = [5, -5];
        await movePoint({ name: "/hello/c", x: p1[0], y: p1[1], core });
        await check_items(p1, p2);

        // move point d
        p2 = [3, 4];
        await movePoint({ name: "/hello/d", x: p2[0], y: p2[1], core });
        await check_items(p1, p2);

        // move point e
        p1 = [-9, -8];
        await movePoint({ name: "/hello/e", x: p1[0], y: p1[1], core });
        await check_items(p1, p2);

        // move point f
        p2 = [-1, -3];
        await movePoint({ name: "/hello/f", x: p2[0], y: p2[1], core });
        await check_items(p1, p2);
    });

    it("assign names to array prop, further copies", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <line name="l" through="(0,0) (1,1)" />
  </graph>

  $l.points{name="pts" assignNames="p1 p2"}
  $l.points.y{name="ys" assignNames="y1 y2"}

  <section name="sec1">
    <p>ptsa: $pts{name="ptsa" assignNames="p1a p2a"}, repeat: $p1a{name="p1ac"}, $p2a{name="p2ac"}</p>
    <p>ptsb: $ptsa{name="ptsb" assignNames="p1b p2b"}, repeat: $p1b{name="p1bc"}, $p2a{name="p2bc"}</p>
    <p>ptsc: $ptsb{name="ptsc" assignNames="p1c p2c"}, repeat: $p1c{name="p1cc"}, $p2a{name="p2cc"}</p>

    <p>ysa: $ys{name="ysa" assignNames="y1a y2a"}, repeat: $y1a{name="y1ac"}, $y2a{name="y2ac"}</p>
    <p>ysb: $ysa{name="ysb" assignNames="y1b y2b"}, repeat: $y1b{name="y1bc"}, $y2b{name="y2bc"}</p>
    <p>ysc: $ysb{name="ysc" assignNames="y1c y2c"}, repeat: $y1c{name="y1cc"}, $y2c{name="y2cc"}</p>
  </section>

  <section name="sec2" copySource="sec1" newNamespace />
  <section name="sec3" copySource="sec2" newNamespace />

  `,
        });

        let p1Names = [
            "/p1",
            "/p1a",
            "/p1ac",
            "/p1b",
            "/p1bc",
            "/p1c",
            "/p1cc",
            "/sec2/p1a",
            "/sec2/p1ac",
            "/sec2/p1b",
            "/sec2/p1bc",
            "/sec2/p1c",
            "/sec2/p1cc",
            "/sec3/p1a",
            "/sec3/p1ac",
            "/sec3/p1b",
            "/sec3/p1bc",
            "/sec3/p1c",
            "/sec3/p1cc",
        ];
        let p2Names = [
            "/p2",
            "/p2a",
            "/p2ac",
            "/p2b",
            "/p2bc",
            "/p2c",
            "/p2cc",
            "/sec2/p2a",
            "/sec2/p2ac",
            "/sec2/p2b",
            "/sec2/p2bc",
            "/sec2/p2c",
            "/sec2/p2cc",
            "/sec3/p2a",
            "/sec3/p2ac",
            "/sec3/p2b",
            "/sec3/p2bc",
            "/sec3/p2c",
            "/sec3/p2cc",
        ];

        let y1Names = [
            "/y1",
            "/y1a",
            "/y1ac",
            "/y1b",
            "/y1bc",
            "/y1c",
            "/y1cc",
            "/sec2/y1a",
            "/sec2/y1ac",
            "/sec2/y1b",
            "/sec2/y1bc",
            "/sec2/y1c",
            "/sec2/y1cc",
            "/sec3/y1a",
            "/sec3/y1ac",
            "/sec3/y1b",
            "/sec3/y1bc",
            "/sec3/y1c",
            "/sec3/y1cc",
        ];
        let y2Names = [
            "/y2",
            "/y2a",
            "/y2ac",
            "/y2b",
            "/y2bc",
            "/y2c",
            "/y2cc",
            "/sec2/y2a",
            "/sec2/y2ac",
            "/sec2/y2b",
            "/sec2/y2bc",
            "/sec2/y2c",
            "/sec2/y2cc",
            "/sec3/y2a",
            "/sec3/y2ac",
            "/sec3/y2b",
            "/sec3/y2bc",
            "/sec3/y2c",
            "/sec3/y2cc",
        ];

        async function check_items(p1: number[], p2: number[]) {
            const stateVariables = await returnAllStateVariables(core);

            for (let p1Name of p1Names) {
                expect(
                    stateVariables[p1Name].stateValues.xs.map((v) => v.tree),
                ).eqls(p1);
            }
            for (let p2Name of p2Names) {
                expect(
                    stateVariables[p2Name].stateValues.xs.map((v) => v.tree),
                ).eqls(p2);
            }
            for (let y1Name of y1Names) {
                expect(stateVariables[y1Name].stateValues.value.tree).eq(p1[1]);
            }
            for (let y2Name of y2Names) {
                expect(stateVariables[y2Name].stateValues.value.tree).eq(p2[1]);
            }
        }

        let p1 = [0, 0];
        let p2 = [1, 1];
        await check_items(p1, p2);

        // move point p1
        p1 = [5, -5];
        await movePoint({ name: "/p1", x: p1[0], y: p1[1], core });
        await check_items(p1, p2);

        // move point p2
        p2 = [3, 4];
        await movePoint({ name: "/p2", x: p2[0], y: p2[1], core });
        await check_items(p1, p2);
    });

    it("assign names to array prop with copy component index, further copies", async () => {
        let core = await createTestCore({
            doenetML: `
  <mathInput name="n" prefill="1" />
  
  <graph>
    <line name="l" through="(1,2) (3,4)" />
  </graph>

  <p>xs = $l.points[$n].xs{name="xs" assignNames="x1 x2"}</p>

  <section name="sec1">
    <p>xsa: $xs{name="xsa" assignNames="x1a x2a"}, repeat: $x1a{name="x1ac"}, $x2a{name="x2ac"}</p>
    <p>xsb: $xsa{name="xsb" assignNames="x1b x2b"}, repeat: $x1b{name="x1bc"}, $x2b{name="x2bc"}</p>
    <p>xsc: $xsb{name="xsc" assignNames="x1c x2c"}, repeat: $x1c{name="x1cc"}, $x2c{name="x2cc"}</p>
  </section>

  <section name="sec2" copySource="sec1" newNamespace />
  <section name="sec3" copySource="sec2" newNamespace />

  `,
        });

        let x1Names = [
            "/x1",
            "/x1a",
            "/x1ac",
            "/x1b",
            "/x1bc",
            "/x1c",
            "/x1cc",
            "/sec2/x1a",
            "/sec2/x1ac",
            "/sec2/x1b",
            "/sec2/x1bc",
            "/sec2/x1c",
            "/sec2/x1cc",
            "/sec3/x1a",
            "/sec3/x1ac",
            "/sec3/x1b",
            "/sec3/x1bc",
            "/sec3/x1c",
            "/sec3/x1cc",
        ];
        let x2Names = [
            "/x2",
            "/x2a",
            "/x2ac",
            "/x2b",
            "/x2bc",
            "/x2c",
            "/x2cc",
            "/sec2/x2a",
            "/sec2/x2ac",
            "/sec2/x2b",
            "/sec2/x2bc",
            "/sec2/x2c",
            "/sec2/x2cc",
            "/sec3/x2a",
            "/sec3/x2ac",
            "/sec3/x2b",
            "/sec3/x2bc",
            "/sec3/x2c",
            "/sec3/x2cc",
        ];

        async function check_items(p: number[] | undefined) {
            const stateVariables = await returnAllStateVariables(core);
            if (p) {
                for (let x1Name of x1Names) {
                    expect(stateVariables[x1Name].stateValues.value.tree).eq(
                        p[0],
                    );
                }
                for (let x2Name of x2Names) {
                    expect(stateVariables[x2Name].stateValues.value.tree).eq(
                        p[1],
                    );
                }
            } else {
                for (let x1Name of x1Names) {
                    expect(stateVariables[x1Name]).be.undefined;
                }
                for (let x2Name of x2Names) {
                    expect(stateVariables[x2Name]).be.undefined;
                }
            }
        }

        let ps = [
            [1, 2],
            [3, 4],
        ];
        let n = 1;
        await check_items(ps[n - 1]);

        // switch point index
        n = 2;
        await updateMathInputValue({ latex: `${n}`, name: "/n", core });
        await check_items(ps[n - 1]);

        // switch to invalid point index
        n = 3;
        await updateMathInputValue({ latex: `${n}`, name: "/n", core });
        await check_items(ps[n - 1]);

        // back to point 1
        n = 1;
        await updateMathInputValue({ latex: `${n}`, name: "/n", core });
        await check_items(ps[n - 1]);
    });

    it("assign names to array prop, copy with component index", async () => {
        let core = await createTestCore({
            doenetML: `
  <mathInput name="n" prefill="1" />
  
  <graph>
    <line name="l" through="(1,2) (3,4)" />
  </graph>

  $l.points{name="pts" assignNames="p1 p2"}

  <section name="sec1">
    <p>$pts[$n]{name="pt"}</p>
    <p>$pt{name="pta"}</p>
    <p>$pts[$n].xs{name="ptxs" assignNames="ptx1 ptx2"}</p>
    <p>$ptxs{name="ptxsa" assignNames="ptx1a ptx2a"}</p>
    <p>$p1.xs[$n]{name="p1xs" assignNames="p1x"}</p>
    <p>$p1xs{name="p1xsa"}</p>
    <p>$p1x{name="p1xa"}</p>
    <p>$p2.xs[$n]{name="p2xs" assignNames="p2x"}</p>
    <p>$p2xs{name="p2xsa"}</p>
    <p>$p2x{name="p2xa"}</p>
  </section>

  <section name="sec2" copySource="sec1" newNamespace />
  <section name="sec3" copySource="sec2" newNamespace />

  `,
        });

        let ptNames = [
            "/pt",
            "/pta",
            "/sec2/pt",
            "/sec2/pta",
            "/sec3/pt",
            "/sec3/pta",
        ];
        let ptx1Names = [
            "/ptx1",
            "/ptx1a",
            "/sec2/ptx1",
            "/sec2/ptx1a",
            "/sec3/ptx1",
            "/sec3/ptx1a",
        ];
        let ptx2Names = [
            "/ptx2",
            "/ptx2a",
            "/sec2/ptx2",
            "/sec2/ptx2a",
            "/sec3/ptx2",
            "/sec3/ptx2a",
        ];
        let p1xNames = [
            "/p1x",
            "/p1xa",
            "/sec2/p1x",
            "/sec2/p1xa",
            "/sec3/p1x",
            "/sec3/p1xa",
        ];
        let p2xNames = [
            "/p2x",
            "/p2xa",
            "/sec2/p2x",
            "/sec2/p2xa",
            "/sec3/p2x",
            "/sec3/p2xa",
        ];

        async function check_items(ps: number[][], n: number) {
            const stateVariables = await returnAllStateVariables(core);

            let pt = ps[n - 1];
            if (pt) {
                for (let ptName of ptNames) {
                    expect(
                        stateVariables[ptName].stateValues.xs.map(
                            (v) => v.tree,
                        ),
                    ).eqls(pt);
                }
                for (let ptx1Name of ptx1Names) {
                    expect(stateVariables[ptx1Name].stateValues.value.tree).eq(
                        pt[0],
                    );
                }
                for (let ptx2Name of ptx2Names) {
                    expect(stateVariables[ptx2Name].stateValues.value.tree).eq(
                        pt[1],
                    );
                }
            } else {
                for (let ptName of ptNames) {
                    expect(stateVariables[ptName]).be.undefined;
                }
                for (let ptx1Name of ptx1Names) {
                    expect(stateVariables[ptx1Name]).be.undefined;
                }
                for (let ptx2Name of ptx2Names) {
                    expect(stateVariables[ptx2Name]).be.undefined;
                }
            }

            if (ps[0][n - 1]) {
                for (let p1xName of p1xNames) {
                    expect(stateVariables[p1xName].stateValues.value.tree).eq(
                        ps[0][n - 1],
                    );
                }
            } else {
                for (let p1xName of p1xNames) {
                    expect(stateVariables[p1xName]).be.undefined;
                }
            }

            if (ps[1][n - 1]) {
                for (let p2xName of p2xNames) {
                    expect(stateVariables[p2xName].stateValues.value.tree).eq(
                        ps[1][n - 1],
                    );
                }
            } else {
                for (let p2xName of p2xNames) {
                    expect(stateVariables[p2xName]).be.undefined;
                }
            }
        }

        let ps = [
            [1, 2],
            [3, 4],
        ];
        let n = 1;
        await check_items(ps, n);

        // switch index
        n = 2;
        await updateMathInputValue({ latex: `${n}`, name: "/n", core });
        await check_items(ps, n);

        // switch to invalid index
        n = 3;
        await updateMathInputValue({ latex: `${n}`, name: "/n", core });
        await check_items(ps, n);

        // switch back to index 1
        n = 1;
        await updateMathInputValue({ latex: `${n}`, name: "/n", core });
        await check_items(ps, n);
    });

    //Note: the next 3 are not using assignNames anymore given changes to how copies work
    it("names can access namespace", async () => {
        let core = await createTestCore({
            doenetML: `
  <section name="section1" newNamespace>
    <subsection>
      <p name="p1" newNamespace>Hello, <text name="person">Jesse</text>!</p>
    </subsection>
    <subsection>
      <p name="p2">Hello, <text name="person">Jessica</text>!</p>
    </subsection>
  </section>

  $section1{name="a"}

  $a{name="b"}

  <p name="p1">$(section1/p1/person) $(section1/person)
$(a/p1/person) $(a/person)
$(b/p1/person) $(b/person)</p>
  `,
        });

        let names = ["/section1", "/a", "/b"];

        let stateVariables = await returnAllStateVariables(core);
        for (let name of names) {
            expect(stateVariables[`${name}/p1`].stateValues.text).eq(
                "Hello, Jesse!",
            );
            expect(stateVariables[`${name}/p1/person`].stateValues.text).eq(
                "Jesse",
            );
            expect(stateVariables[`${name}/p2`].stateValues.text).eq(
                "Hello, Jessica!",
            );
            expect(stateVariables[`${name}/person`].stateValues.text).eq(
                "Jessica",
            );
        }

        expect(stateVariables["/p1"].stateValues.text).eq(
            "Jesse Jessica\nJesse Jessica\nJesse Jessica",
        );
    });

    it("names can access namespace, across namespaces", async () => {
        let core = await createTestCore({
            doenetML: `
  <section name="hello" newNamespace><title>Hello</title>
    <p name="p1" newNamespace>Hello, <text name="person">Jesse</text>!</p>
    $p1{name="a"}
    <p name="p2">$(p1/person) $(a/person) $(../bye/a/person)</p>
  </section>

  <section name="bye" newNamespace><title>Bye</title>
   $(../hello/p1{name="a"})
    <p name="p1">$(../hello/p1/person) $(../hello/a/person) $(a/person)</p>
  </section>
  `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/hello/p1"].stateValues.text).eq(
            "Hello, Jesse!",
        );
        expect(stateVariables["/hello/p1/person"].stateValues.value).eq(
            "Jesse",
        );
        expect(stateVariables["/hello/a"].stateValues.text).eq("Hello, Jesse!");
        expect(stateVariables["/hello/a/person"].stateValues.value).eq("Jesse");
        expect(stateVariables["/hello/p2"].stateValues.text).eq(
            "Jesse Jesse Jesse",
        );
        expect(stateVariables["/bye/a"].stateValues.text).eq("Hello, Jesse!");
        expect(stateVariables["/bye/a/person"].stateValues.value).eq("Jesse");
        expect(stateVariables["/bye/p1"].stateValues.text).eq(
            "Jesse Jesse Jesse",
        );
    });

    it("names can access namespace even with math", async () => {
        let core = await createTestCore({
            doenetML: `
  <p newNamespace name="pOriginal">
    <math name="expression">
      <math name="x">x</math>+<math name="y">y</math>
    </math>
  </p>

  $pOriginal{name="pCopy"}

  <p>This grabs expression: $(pOriginal/expression{name="expressionCopy"})</p>
  <p>This grabs expression: $(pCopy/expression{name="expressionCopy2"})</p>
  <p>This grabs piece x: $(pOriginal/x{name="xCopy"})</p>
  <p>This grabs piece y: $(pOriginal/y{name="yCopy"})</p>
  <p>Should this grab piece x? $(pCopy/x{name="xCopy2"})</p>
  <p>Should this grab piece y? $(pCopy/y{name="yCopy2"})</p>

  `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(stateVariables["/pOriginal/expression"].stateValues.text).eq(
            "x + y",
        );
        expect(stateVariables["/pCopy/expression"].stateValues.text).eq(
            "x + y",
        );
        expect(stateVariables["/expressionCopy"].stateValues.text).eq("x + y");
        expect(stateVariables["/expressionCopy2"].stateValues.text).eq("x + y");
        expect(stateVariables["/xCopy"].stateValues.text).eq("x");
        expect(stateVariables["/xCopy2"].stateValues.text).eq("x");
        expect(stateVariables["/yCopy"].stateValues.text).eq("y");
        expect(stateVariables["/yCopy2"].stateValues.text).eq("y");
    });
});

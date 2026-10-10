import { afterEach, describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    moveLine,
    moveLineSegment,
    movePoint,
    movePolygon,
    movePolyline,
    moveThroughPoint,
    moveVector,
    updateBooleanInputValue,
    updateMathInputValue,
    updateTextInputValue,
} from "../utils/actions";
import { setExpressionAttributesEnabled } from "../../utils/dast/expressionAttributes";
import { createNewComponentIndices } from "../../utils/componentIndices";
import { copyOfExpressionAttribute } from "../../utils/expressionAttributeNames";
import { snapshotStillMade } from "../../utils/copySnapshot";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * A point whose coordinates are text and references (`<point>($a, 2$a)
 * </point>`) holds them itself, with no attribute component
 * (Doenet/DoenetML#2252, `utils/dast/expressionAttributes.ts`). Each document
 * here is checked against itself with the attribute components
 * (`setExpressionAttributesEnabled`): what an author sees, and what a drag
 * writes, must be the same.
 */
describe("Coordinates held by their point @group4", () => {
    afterEach(() => setExpressionAttributesEnabled(true));

    /**
     * Load `doenetML` with and without expression attributes; check that the
     * points named in `held` hold their coordinates (or, with `held`
     * empty, that none does), then, after `act`, that the `text` of each of
     * `names` is the same; with `reload`, also after saving and reloading.
     */
    async function compare({
        doenetML,
        names,
        held = [],
        numHeld,
        act,
        reload = false,
    }: {
        doenetML: string;
        names: string[];
        held?: string[];
        /** For points with no name: how many hold their coordinates. */
        numHeld?: number;
        act?: (core: any, resolvePathToNodeIdx: any) => Promise<void>;
        reload?: boolean;
    }) {
        const results: Record<string, string>[] = [];
        for (const enabled of [true, false]) {
            setExpressionAttributesEnabled(enabled);
            let { core, resolvePathToNodeIdx, scoreState } =
                await createTestCore({ doenetML });
            setExpressionAttributesEnabled(true);
            const heldNow: string[] = [];
            for (const component of Object.values<any>(
                core.core!._components,
            )) {
                if (
                    Object.values<any>(component?.attributes ?? {}).some(
                        (attribute) => attribute?.type === "expression",
                    )
                ) {
                    heldNow.push(component.componentIdx);
                }
            }
            if (enabled && numHeld !== undefined) {
                expect(heldNow.length).toBe(numHeld);
            } else if (enabled) {
                const expected = [];
                for (const name of held) {
                    expected.push(await resolvePathToNodeIdx(name));
                }
                expect(heldNow.sort()).toEqual(expected.sort());
            } else {
                expect(heldNow).toEqual([]);
            }
            if (act) {
                await act(core, resolvePathToNodeIdx);
            }
            if (reload) {
                await core.saveImmediately();
                setExpressionAttributesEnabled(enabled);
                ({ core, resolvePathToNodeIdx } = await createTestCore({
                    doenetML,
                    initialState: scoreState.state,
                }));
                setExpressionAttributesEnabled(true);
            }
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const texts: Record<string, string> = {};
            for (const name of names) {
                texts[name] =
                    stateVariables[
                        await resolvePathToNodeIdx(name)
                    ].stateValues.text;
            }
            results.push(texts);
        }
        expect(results[0]).toEqual(results[1]);
        return results[0];
    }

    function drag(name: string, x: number, y: number) {
        return async (core: any, resolvePathToNodeIdx: any) => {
            await movePoint({
                componentIdx: await resolvePathToNodeIdx(name),
                x,
                y,
                core,
            });
        };
    }

    it("coordinates read from references, and a drag writes them", async () => {
        const texts = await compare({
            doenetML: `
<number name="a">1</number>
<numberList name="l">1 2</numberList>
<graph><point name="P">($a, 2$a + $l[2])</point></graph>
<p name="p">$P $a $l $P.x $P.y</p>
`,
            names: ["p"],
            held: ["P"],
            act: drag("P", 3, 9),
        });
        // `a`, which both coordinates read, takes the drag's `x`; the `y`
        // then reads it too
        expect(texts.p).toBe("(3, 8) 3 1, 2 3 8");
    });

    it("a coordinate takes a value by changing its own text, kept through a reload", async () => {
        const texts = await compare({
            doenetML: `
<number name="a">1</number>
<graph><point name="P">($a, 0)</point></graph>
<p name="p">$P $a</p>
`,
            names: ["p"],
            held: ["P"],
            act: drag("P", 3, 7),
            reload: true,
        });
        expect(texts.p).toBe("(3, 7) 3");
    });

    it("a drag that changes the text of two coordinates keeps both, as in space", async () => {
        const texts = await compare({
            doenetML: `
<number name="a">1</number>
<point name="P">($a, 2, 3)</point>
<p name="p">$P $a</p>
`,
            names: ["p"],
            held: ["P"],
            act: async (core, resolvePathToNodeIdx) => {
                const componentIdx = await resolvePathToNodeIdx("P");
                await movePoint({ componentIdx, x: 7, y: 8, z: 9, core });
                // a later drag starts from the text as the first left it
                await movePoint({ componentIdx, x: 6, y: 5, z: 4, core });
            },
            reload: true,
        });
        expect(texts.p).toBe("(6, 5, 4) 6");
    });

    it("the text of two coordinates written by a vector's drag, or through another point", async () => {
        const texts = await compare({
            doenetML: `
<number name="a">1</number>
<vector name="v">($a, 2, 3)</vector>
<point name="P">($a, 2, 3)</point>
<point name="Q">($P.y, $P.z, 0)</point>
<p name="p">$v $P $Q $a</p>
`,
            names: ["p"],
            held: ["v", "P", "Q"],
            act: async (core, resolvePathToNodeIdx) => {
                await moveVector({
                    componentIdx: await resolvePathToNodeIdx("v"),
                    headcoords: [4, 5, 6],
                    tailcoords: [0, 0, 0],
                    core,
                });
                // writes the text of `P`'s `y` and `z` in one request
                await movePoint({
                    componentIdx: await resolvePathToNodeIdx("Q"),
                    x: 7,
                    y: 8,
                    z: 9,
                    core,
                });
            },
            reload: true,
        });
        expect(texts.p).toBe("(4, 5, 6) (4, 7, 8) (7, 8, 9) 4");
    });

    it("coordinates that read a math operator, as `$m` of a `<max>`", async () => {
        const texts = await compare({
            doenetML: `
<numberList name="l">3 8 5</numberList>
<max name="m">$l</max>
<min name="n">$l</min>
<graph><point name="P">($n, $m - 1)</point></graph>
<p name="p">$P</p>
`,
            names: ["p"],
            held: ["P"],
            act: drag("P", 6, 2),
        });
        expect(texts.p).toBe("(3, 7)");
    });

    it("a drag writes through linked copies, to a point holding its coordinates", async () => {
        const texts = await compare({
            doenetML: `
<graph>
  <point name="P1">($P2a.y, 2)</point>
  <point name="P2">($P1a.y, 1)</point>
</graph>
<graph>
  <point name="P1a" extend="$P1" />
  <point name="P2a" extend="$P2" />
</graph>
<p name="p">$P1 $P2 $P1a $P2a</p>
`,
            names: ["p"],
            held: ["P1", "P2"],
            act: drag("P1", -4, 9),
        });
        expect(texts.p).toBe("(-4, 9) (9, -4) (-4, 9) (9, -4)");
    });

    it("unlinked and linked copies of what holds the point, and a reload", async () => {
        await compare({
            doenetML: `
<number name="a">1</number>
<section name="s"><graph><point name="P">($a, 0)</point></graph></section>
<section name="s2" copy="$s" />
<section name="s3" extend="$s" />
<graph><point name="C" copy="$s.P" /></graph>
<p name="p">$a $s.P $s2.P $s3.P $C</p>
`,
            names: ["p"],
            held: ["s.P", "s2.P", "C"],
            act: async (core, resolvePathToNodeIdx) => {
                await drag("s.P", 3, 7)(core, resolvePathToNodeIdx);
                await drag("s3.P", 4, 8)(core, resolvePathToNodeIdx);
            },
            reload: true,
        });
    });

    it("each iteration of a repeat resolves its own references", async () => {
        const texts = await compare({
            doenetML: `
<repeatForSequence name="r" from="1" to="3" valueName="i">
  <p><number extend="$i" name="n" /><point name="P">($i, 2$i)</point></p>
</repeatForSequence>
<repeatForSequence name="r2" from="1" to="2" valueName="v">
  <p><point name="Q">($v, 0)</point></p>
</repeatForSequence>
<repeatForSequence name="r3" copy="$r2" />
<p name="p">$r[1].P $r[2].P $r[3].P $r2[1].Q $r2[2].Q $r3[1].Q</p>
`,
            names: ["p"],
            held: [
                "r[1].P",
                "r[2].P",
                "r[3].P",
                "r2[1].Q",
                "r2[2].Q",
                "r3[1].Q",
                "r3[2].Q",
            ],
            act: drag("r2[1].Q", 5, 6),
            reload: true,
        });
        expect(texts.p).toBe("(1, 2) (2, 4) (3, 6) (1, 6) (2, 0) (1, 6)");
    });

    it("points made for an attribute (a polygon's vertices, a label's anchor), and a vector", async () => {
        // their references resolve from where they were written, and a copy
        // of them from the copy
        const texts = await compare({
            doenetML: `
<number name="a">2</number>
<point name="P0">(0.6, 0.8)</point>
<graph>
  <polygon name="pg" vertices="($a, 1) (3, $a) ($P0.x, $P0.y)" />
  <label name="L" anchor="($P0.x/2, $a)">x</label>
  <vector name="v">($a, $P0.y)</vector>
</graph>
<repeatForSequence name="r" from="1" to="2" valueName="i">
  <graph><polygon vertices="($i, 0) (0, $i) (1, 1)" /></graph>
</repeatForSequence>
<p name="p">$pg.vertices $L.anchor $v $r[1] $r[2] $a</p>
`,
            names: ["p"],
            // the polygons' vertices with references, the anchor's point and
            // the vector
            numHeld: 9,
            act: async (core, resolvePathToNodeIdx) => {
                await core.requestAction({
                    componentIdx: await resolvePathToNodeIdx("pg"),
                    actionName: "movePolygon",
                    args: { pointCoords: { 1: [5, 4] } },
                });
            },
            reload: true,
        });
        // the vertex's `3` takes the drag's 5, and `a` its 4
        expect(texts.p).toBe(
            "(4, 1), (5, 4), (0.6, 0.8) (0.3, 4) (4, 0.8)   4",
        );
    });

    it("keeps the attribute component where a slot cannot stand in for a reference", async () => {
        // a reference with a component between the brackets of its path; a
        // coordinate with an attribute
        await compare({
            doenetML: `
<number name="a">2</number>
<numberList name="l">1 2</numberList>
<graph>
  <repeatForSequence name="r" from="1" to="2" indexName="i"><point>($l[$i], $l[$i+0])</point></repeatForSequence>
  <point name="Q">(<math simplify>$a+$a</math>, 1)</point>
</graph>
<p name="p">$r $Q</p>
`,
            names: ["p"],
            held: [],
        });
    });

    it("points made for other attributes: a line's and a circle's through, a segment's endpoints, a vector's head and tail", async () => {
        const texts = await compare({
            doenetML: `
<number name="a">1</number>
<number name="b">2</number>
<graph>
  <line name="l" through="($a, 0) (2, $b)" />
  <circle name="c" through="($a, 1) (3, $b) (0, 0)" />
  <lineSegment name="s" endpoints="($a, 2) (4, $b)" />
  <vector name="v" tail="(1, $a)">($b, 3)</vector>
  <vector name="w" head="($a, 3)" tail="(0, $b)" />
</graph>
<p name="p">$l.points $c.throughPoints $s.endpoints $v.tail $v.head $w.tail $w.head $a $b</p>
`,
            names: ["p"],
            // the points with references among the line's, circle's and
            // segment's, the vectors' head and tail, and `v` itself
            numHeld: 10,
            act: async (core, resolvePathToNodeIdx) => {
                await moveLineSegment({
                    componentIdx: await resolvePathToNodeIdx("s"),
                    point1coords: [5, 6],
                    core,
                });
                await moveVector({
                    componentIdx: await resolvePathToNodeIdx("w"),
                    headcoords: [4, 7],
                    core,
                });
                await moveThroughPoint({
                    componentIdx: await resolvePathToNodeIdx("c"),
                    throughPointInd: 1,
                    throughPoint: [3, 8],
                    core,
                });
                await moveLine({
                    componentIdx: await resolvePathToNodeIdx("l"),
                    point1coords: [6, 1],
                    point2coords: [2, 9],
                    core,
                });
            },
            reload: true,
        });
        // `a` takes the segment's drag, then the vector's, then the line's;
        // `b` the circle's, then the line's; the texts `2` and `3` take the
        // segment's and the vector's `y`, and the line's `0` its `1`
        expect(texts.p).toBe(
            "(6, 1), (2, 9) (6, 1), (3, 9), (0, 0) (6, 6), (4, 9) (1, 6) (10, 9) (0, 9) (6, 7) 6 9",
        );
    });

    it("degenerate referents: a list entry past the end of its list, and an empty number", async () => {
        const texts = await compare({
            doenetML: `
<numberList name="l">1 2</numberList>
<number name="e" />
<graph>
  <point name="P">($l[5], 1)</point>
  <point name="Q">($e, $l[1])</point>
</graph>
<p name="p">$P $Q $l $e</p>
`,
            names: ["p"],
            held: ["P", "Q"],
            act: async (core, resolvePathToNodeIdx) => {
                await drag("P", 3, 4)(core, resolvePathToNodeIdx);
                await drag("Q", 5, 6)(core, resolvePathToNodeIdx);
            },
            reload: true,
        });
        // past the end of `l`, `P`'s `x` reads nothing and takes no write;
        // `Q`'s writes `e` and the entry
        expect(texts.p).toBe("(＿, 4) (5, 6) 6, 2 5");
    });

    it("a repeat whose number of iterations grows and shrinks around a drag", async () => {
        const texts = await compare({
            doenetML: `
<mathInput name="mi" prefill="2" />
<repeatForSequence name="r" from="1" to="$mi" valueName="i">
  <p><point name="P">($i, 0)</point></p>
</repeatForSequence>
<p name="p">$r[1].P $r[2].P $r[3].P</p>
`,
            names: ["p"],
            held: ["r[1].P", "r[2].P"],
            act: async (core, resolvePathToNodeIdx) => {
                const n = async (latex: string) =>
                    updateMathInputValue({
                        latex,
                        componentIdx: await resolvePathToNodeIdx("mi"),
                        core,
                    });
                await n("3");
                await drag("r[3].P", 7, 8)(core, resolvePathToNodeIdx);
                await drag("r[2].P", 5, 6)(core, resolvePathToNodeIdx);
                await n("1");
                await n("3");
            },
            reload: true,
        });
        // `x` reads the iteration's value; the `0` takes each drag's `y`,
        // kept by the iterations withheld while the repeat is shorter
        expect(texts.p).toBe("(1, 0) (2, 6) (3, 8)");
    });

    it("boolean expressions: a hide and a case's condition, as their references change", async () => {
        const texts = await compare({
            doenetML: `
<booleanInput name="bi" />
<mathInput name="mi" prefill="1" />
<number name="a">$mi</number>
<text name="t">x</text>
<graph><point name="P" hide="not $bi">(1, 2)</point></graph>
<p name="q" hide="$t = y or $a < 0">shown</p>
<conditionalContent name="cc">
  <case condition="$a > 2"><p name="big">big</p></case>
  <else><p name="small">small</p></else>
</conditionalContent>
<p name="p">$P.hidden $q.hidden</p>
`,
            names: ["p"],
            // `P`'s and `q`'s `hide`, and the case's `condition`
            numHeld: 3,
            act: async (core, resolvePathToNodeIdx) => {
                await updateBooleanInputValue({
                    boolean: true,
                    componentIdx: await resolvePathToNodeIdx("bi"),
                    core,
                });
                await updateMathInputValue({
                    latex: "-3",
                    componentIdx: await resolvePathToNodeIdx("mi"),
                    core,
                });
            },
            reload: true,
        });
        expect(texts.p).toBe("false true");
    });

    it("math expressions: a line's equation and a curve's parMin and parMax", async () => {
        const texts = await compare({
            doenetML: `
<mathInput name="mi" prefill="1" />
<number name="a">$mi</number>
<graph>
  <line name="l" equation="y = $a x + 1" />
  <curve name="c" parMin="$a - 4" parMax="2 $a">(t, t^2)</curve>
</graph>
<p name="p">$l.equation $c.parMin $c.parMax $l.slope</p>
`,
            names: ["p"],
            held: ["l", "c"],
            act: async (core, resolvePathToNodeIdx) => {
                await updateMathInputValue({
                    latex: "3",
                    componentIdx: await resolvePathToNodeIdx("mi"),
                    core,
                });
            },
            reload: true,
        });
        expect(texts.p).toBe("y = 3 x + 1 -1 6 3");
    });

    it("boolean expressions compare as a `<boolean>` does: a missing reference, an unordered math, a text, and a feedback's condition", async () => {
        const texts = await compare({
            doenetML: `
<numberList name="l">1 2</numberList>
<math name="u" unordered>(1, 2)</math>
<textInput name="ti" prefill="x" />
<mathInput name="mi" prefill="1" />
<p name="p1" hide="$l[3] + 1 = 1 + $l[3]">one</p>
<p name="p2" hide="$u = (2, 1) and $mi > 0">two</p>
<p name="p3" hide="$ti = y">three</p>
<feedback name="fb" condition="$mi > 2"><p>big</p></feedback>
<p name="p">$p1.hidden $p2.hidden $p3.hidden $fb.hidden</p>
`,
            names: ["p"],
            held: ["p1", "p2", "p3", "fb"],
            act: async (core, resolvePathToNodeIdx) => {
                await updateMathInputValue({
                    latex: "3",
                    componentIdx: await resolvePathToNodeIdx("mi"),
                    core,
                });
                await updateTextInputValue({
                    text: "y",
                    componentIdx: await resolvePathToNodeIdx("ti"),
                    core,
                });
            },
            reload: true,
        });
        expect(texts.p).toBe("false true true false");
    });

    it("keeps the attribute component of an expression it does not hold", async () => {
        // one reference alone, which is the attribute component itself; a
        // reference with a component between the brackets of its path; a
        // math expression of an owner other than a line or curve
        await compare({
            doenetML: `
<boolean name="b">true</boolean>
<booleanList name="bl">true false</booleanList>
<number name="a">2</number>
<number name="i">2</number>
<p name="p1" hide="$b">one</p>
<p name="p2" hide="not $bl[$i]">two</p>
<function name="f" domain="(0, $a + 1)">x^2</function>
<p name="p">$p1.hidden $p2.hidden $f.domain</p>
`,
            names: ["p"],
            held: [],
        });
    });

    it("a drag of a linked copy writes the text of its source's coordinate, which the copy does not hold", async () => {
        // the source's `__xs_writes`, which the copy reads through its
        // source and does not have (`EssentialValueWriter` skips it)
        const texts = await compare({
            doenetML: `
<number name="a">1</number>
<graph>
  <point name="P">($a, 0)</point>
  <point name="Q" extend="$P" />
</graph>
<p name="p">$P $Q $a</p>
`,
            names: ["p"],
            held: ["P"],
            act: drag("Q", 3, 7),
            reload: true,
        });
        expect(texts.p).toBe("(3, 7) (3, 7) 3");
    });

    it("a diagnostic about an expression attribute is placed where it is written", async () => {
        // a `<conditionalContent>` with cases ignores its `condition`
        const doenetML = `
<number name="a">1</number>
<conditionalContent condition="$a > 0"><case condition="$a > 0"><p>x</p></case></conditionalContent>
`;
        const positions = [];
        for (const enabled of [true, false]) {
            setExpressionAttributesEnabled(enabled);
            const { core } = await createTestCore({ doenetML });
            setExpressionAttributesEnabled(true);
            const warnings = core.core!.diagnostics.filter(
                (diagnostic: any) => diagnostic.code === "doenet-w0079",
            );
            expect(warnings.length).toBe(1);
            positions.push(warnings[0].position.start);
        }
        expect(positions[0]).toEqual(positions[1]);
        expect(positions[0]).toMatchObject({ line: 3, column: 21 });
    });

    it("renumbering a copy leaves the slots of what it copied as they were", () => {
        const template = {
            type: "serialized",
            componentType: "point",
            componentIdx: 5,
            attributes: {
                xs: {
                    type: "expression",
                    name: "xs",
                    componentType: "mathList",
                    template: {},
                    slots: [
                        {
                            refResolution: {
                                nodeIdx: 2,
                                unresolvedPath: null,
                                originalPath: [{ name: "a", index: [] }],
                                nodesInResolvedPath: [5, 2],
                            },
                            readPlan: { presentedComponentType: "math" },
                        },
                    ],
                },
            },
            doenetAttributes: {},
            children: [],
            state: {},
        } as any;
        const first = createNewComponentIndices([template], 100);
        const second = createNewComponentIndices([template], 200);
        const originOf = (component: any) =>
            component.attributes.xs.slots[0].refResolution
                .nodesInResolvedPath[0];
        expect(originOf(template)).toBe(5);
        expect(originOf(first.components[0])).toBe(100);
        expect(originOf(second.components[0])).toBe(200);
    });

    it("an unlinked copy of a copy keeps the text the first copy was made with", () => {
        const attribute = {
            type: "expression",
            name: "xs",
            componentType: "mathList",
            template: {},
            slots: [],
            writes: { 2: { expressionWithCodes: 7 } },
        };
        // nothing written to the first copy itself yet
        expect(
            copyOfExpressionAttribute(attribute, { essentialState: {} }).writes,
        ).toEqual({ 2: { expressionWithCodes: 7 } });
        // what was written to it since
        expect(
            copyOfExpressionAttribute(attribute, {
                essentialState: {
                    __xs_writes: { 2: { expressionWithCodes: 9 } },
                },
            }).writes,
        ).toEqual({ 2: { expressionWithCodes: 9 } });
    });

    it("a copy snapshot whose coordinate text changed is not the same snapshot", async () => {
        const entry = (writes: any) => ({
            stateId: "s1",
            componentType: "point",
            state: {},
            expressionWrites: { xs: writes },
        });
        expect(
            await snapshotStillMade(
                [entry({ 2: { expressionWithCodes: 7 } })],
                [entry({ 2: { expressionWithCodes: 7 } })],
                () => undefined,
            ),
        ).toBe(true);
        expect(
            await snapshotStillMade(
                [entry({ 2: { expressionWithCodes: 9 } })],
                [entry({ 2: { expressionWithCodes: 7 } })],
                () => undefined,
            ),
        ).toBe(false);
    });
});

/**
 * An `<indexOf>` or `<searchSorted>` whose `target` is one reference to the
 * whole of a value list (`target="$l"`) reads the list's values itself,
 * with no attribute component and none of the components it made for each
 * entry (Doenet/DoenetML#2253, `wholeListOf` in
 * `utils/dast/expressionAttributes.ts`). Each document is checked against
 * itself with the attribute components.
 */
describe("Lists held by what searches for them @group4", () => {
    afterEach(() => setExpressionAttributesEnabled(true));

    /**
     * Load `doenetML` with and without expression attributes; check that
     * the components named in `held` hold their `target`, and no others,
     * then, after each of `acts` (and before the first), that the targets
     * and the indices found of each of `names` are the same.
     */
    async function compare({
        doenetML,
        names,
        held,
        acts = [],
    }: {
        doenetML: string;
        names: string[];
        held: string[];
        acts?: ((core: any, resolvePathToNodeIdx: any) => Promise<void>)[];
    }) {
        const results: Record<string, any>[][] = [];
        for (const enabled of [true, false]) {
            setExpressionAttributesEnabled(enabled);
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
            });
            setExpressionAttributesEnabled(true);
            const heldNow: number[] = [];
            for (const component of Object.values<any>(
                core.core!._components,
            )) {
                if (component?.attributes?.target?.type === "expression") {
                    heldNow.push(component.componentIdx);
                }
            }
            const expected: number[] = [];
            if (enabled) {
                for (const name of held) {
                    expected.push(await resolvePathToNodeIdx(name));
                }
            }
            expect(heldNow.sort()).toEqual(expected.sort());

            const read = async () => {
                const stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                const values: Record<string, any> = {};
                for (const name of names) {
                    const { stateValues } =
                        stateVariables[await resolvePathToNodeIdx(name)];
                    values[name] = {
                        targets: stateValues.comparableTargets?.map(
                            (target: any) => target.textValue,
                        ),
                        text: stateValues.text,
                    };
                }
                return values;
            };
            const steps = [await read()];
            for (const act of acts) {
                await act(core, resolvePathToNodeIdx);
                steps.push(await read());
            }
            results.push(steps);
        }
        expect(results[0]).toEqual(results[1]);
        return results[0];
    }

    it("the values of a list of each type, as the type it is searched as", async () => {
        const [values] = await compare({
            doenetML: `
<sequence name="indices" from="1" to="3" />
<numberList name="perm">2 3 1</numberList>
<indexOf name="sp" target="$indices">$perm</indexOf>
<searchSorted name="ss" target="$perm">1 2 3</searchSorted>
<indexOf name="ofOperator" target="$sp">1 2 3</indexOf>
<textList name="tl">b c</textList>
<indexOf name="asText" type="text" target="$tl">a b c</indexOf>
<indexOf name="textAsNumbers" target="$tl">a b c</indexOf>
<mathList name="ml">x 2</mathList>
<indexOf name="asMath" type="math" target="$ml">2 x</indexOf>
<booleanList name="bl">true false</booleanList>
<indexOf name="asBoolean" type="boolean" target="$bl">false true</indexOf>
<sequence name="letters" type="letters" from="b" to="d" />
<indexOf name="ofLetters" type="text" target="$letters">a b c d</indexOf>
<numberList name="extended" extend="$indices" />
<indexOf name="ofExtended" target="$extended">3</indexOf>
<numberList name="capped" maxNumber="2">3 1 2</numberList>
<indexOf name="ofCapped" target="$capped">1 2 3</indexOf>
`,
            names: [
                "sp",
                "ss",
                "ofOperator",
                "asText",
                "textAsNumbers",
                "asMath",
                "asBoolean",
                "ofLetters",
                "ofExtended",
                "ofCapped",
            ],
            held: [
                "sp",
                "ss",
                "ofOperator",
                "asText",
                "textAsNumbers",
                "asMath",
                "asBoolean",
                "ofLetters",
                "ofExtended",
                "ofCapped",
            ],
        });
        expect(values.sp.targets).toEqual(["1", "2", "3"]);
        expect(values.ofOperator.targets).toEqual(["3", "1", "2"]);
        expect(values.asText.targets).toEqual(["b", "c"]);
        expect(values.textAsNumbers.targets).toEqual(["NaN", "NaN"]);
        expect(values.asMath.targets).toEqual(["x", "2"]);
        expect(values.ofLetters.targets).toEqual(["b", "c", "d"]);
        expect(values.ofCapped.targets).toEqual(["3", "1"]);
    });

    it("follows the list as it changes, and as its referent is shown and withheld", async () => {
        const steps = await compare({
            doenetML: `
<mathInput name="mi" prefill="3" />
<numberList name="dyn">1 $mi</numberList>
<indexOf name="ofDyn" target="$dyn">1 2 3 4 5</indexOf>
<booleanInput name="bi" />
<conditionalContent name="cc" condition="$bi">
  <numberList name="shown">4 5</numberList>
</conditionalContent>
<indexOf name="ofShown" target="$cc.shown">4 5</indexOf>
<number name="n">2</number>
<repeatForSequence name="r" from="1" to="$n" valueName="v">
  <numberList name="q">$v 9</numberList>
</repeatForSequence>
<indexOf name="ofIteration" target="$r[2].q">9 2</indexOf>
<repeat name="rp" for="1 2" valueName="v">
  <numberList name="inner">$v 7</numberList>
  <indexOf name="ri" target="$inner">7 1 2</indexOf>
</repeat>
`,
            names: ["ofDyn", "ofShown", "ofIteration", "rp[1].ri", "rp[2].ri"],
            // a path through a composite (`$cc.shown`) is left to resolve
            // on it, which keeps the attribute component
            held: ["ofDyn", "rp[1].ri", "rp[2].ri"],
            acts: [
                async (core, resolvePathToNodeIdx) => {
                    await updateMathInputValue({
                        latex: "5",
                        componentIdx: await resolvePathToNodeIdx("mi"),
                        core,
                    });
                    await updateBooleanInputValue({
                        boolean: true,
                        componentIdx: await resolvePathToNodeIdx("bi"),
                        core,
                    });
                },
                async (core, resolvePathToNodeIdx) => {
                    await updateBooleanInputValue({
                        boolean: false,
                        componentIdx: await resolvePathToNodeIdx("bi"),
                        core,
                    });
                },
            ],
        });
        expect(steps[0].ofDyn.targets).toEqual(["1", "3"]);
        expect(steps[1].ofDyn.targets).toEqual(["1", "5"]);
        expect(steps[0].ofShown.targets).toEqual([]);
        expect(steps[1].ofShown.targets).toEqual(["4", "5"]);
        expect(steps[2].ofShown.targets).toEqual([]);
        expect(steps[0].ofIteration.targets).toEqual(["2", "9"]);
        expect(steps[0]["rp[1].ri"].targets).toEqual(["1", "7"]);
        expect(steps[0]["rp[2].ri"].targets).toEqual(["2", "7"]);
    });

    it("reads no values of a list withheld with the iteration that holds it", async () => {
        const doenetML = `
<mathInput name="mi" prefill="2" />
<repeatForSequence name="r" from="1" to="$mi" valueName="v">
  <numberList name="q">$v 9</numberList>
  <indexOf name="io" target="$q">9 1 2</indexOf>
</repeatForSequence>
<number name="x" extend="$r[2].io" />
`;
        const setTo =
            (latex: string) => async (core: any, resolvePathToNodeIdx: any) =>
                updateMathInputValue({
                    latex,
                    componentIdx: await resolvePathToNodeIdx("mi"),
                    core,
                });
        const steps = await compare({
            doenetML,
            names: ["r[1].io", "x"],
            held: ["r[1].io", "r[2].io"],
            acts: [setTo("1"), setTo("2")],
        });
        expect(steps.map((step) => step.x.text)).toEqual(["3", "NaN", "3"]);

        // while the iteration is withheld, the `<indexOf>` in it reads no
        // values of its list (the attribute component kept those of the
        // list's entries that remained), which no reader sees
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });
        await setTo("1")(core, resolvePathToNodeIdx);
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("r[2].io")].stateValues
                .comparableTargets,
        ).toEqual([]);
    });

    it("copies of what holds the list resolve it from where they are", async () => {
        const [values] = await compare({
            doenetML: `
<numberList name="l">3 1</numberList>
<indexOf name="io" target="$l">1 2 3</indexOf>
<indexOf name="linked" extend="$io" />
<indexOf name="unlinked" copy="$io" />
<repeat name="rp" for="1 2" valueName="v">
  <numberList name="l">$v 5</numberList>
  <indexOf name="copied" copy="$io" />
</repeat>
`,
            names: ["io", "linked", "unlinked", "rp[1].copied", "rp[2].copied"],
            held: ["io", "unlinked", "rp[1].copied", "rp[2].copied"],
        });
        expect(values.linked.targets).toEqual(["3", "1"]);
        expect(values.unlinked.targets).toEqual(["3", "1"]);
        // pasted in an iteration, `$l` names the iteration's list
        expect(values["rp[1].copied"].targets).toEqual(["1", "5"]);
        expect(values["rp[2].copied"].targets).toEqual(["2", "5"]);
    });

    it("keeps the attribute component of a target that is not one whole value list", async () => {
        await compare({
            doenetML: `
<numberList name="l">3 1</numberList>
<number name="i">2</number>
<graph><point name="P">(1, 2)</point></graph>
<repeat name="r" for="1 2" valueName="v"><number>$v</number></repeat>
<indexOf name="entry" target="$l[2]">1 2 3</indexOf>
<indexOf name="indexed" target="$l[$i]">1 2 3</indexOf>
<indexOf name="withText" target="2 $l">1 2 3</indexOf>
<indexOf name="twoLists" target="$l $l">1 2 3</indexOf>
<indexOf name="point" target="$P">1 2 3</indexOf>
<indexOf name="composite" target="$r">1 2 3</indexOf>
<indexOf name="literal" target="2">1 2 3</indexOf>
<indexOf name="missing" target="$nothing">1 2 3</indexOf>
`,
            names: [
                "entry",
                "indexed",
                "withText",
                "twoLists",
                "point",
                "composite",
                "literal",
                "missing",
            ],
            held: [],
        });
    });
});

/**
 * A `<polyline>` or `<polygon>` whose `vertices` is one reference to the
 * whole of a list of points (`vertices="$points"`, a `<pointList>` or a
 * repeat of points made a list) reads the list itself, with no attribute
 * component and no linked copy of the list (Doenet/DoenetML#2253,
 * `wholeListOf` in `utils/dast/expressionAttributes.ts`). Each document is
 * checked against itself with the attribute components.
 */
describe("Lists of points held by a polyline @group4", () => {
    afterEach(() => setExpressionAttributesEnabled(true));

    /**
     * Load `doenetML` with and without expression attributes; check that
     * the components named in `held` hold their `vertices`, and no others,
     * then, after each of `acts` (and before the first), that the vertices
     * of each of `names` are the same.
     */
    async function compare({
        doenetML,
        names,
        held,
        acts = [],
    }: {
        doenetML: string;
        names: string[];
        held: string[];
        acts?: ((core: any, resolvePathToNodeIdx: any) => Promise<void>)[];
    }) {
        const results: Record<string, any>[][] = [];
        for (const enabled of [true, false]) {
            setExpressionAttributesEnabled(enabled);
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
            });
            setExpressionAttributesEnabled(true);
            const heldNow: number[] = [];
            for (const component of Object.values<any>(
                core.core!._components,
            )) {
                if (component?.attributes?.vertices?.type === "expression") {
                    heldNow.push(component.componentIdx);
                }
            }
            const expected: number[] = [];
            if (enabled) {
                for (const name of held) {
                    expected.push(await resolvePathToNodeIdx(name));
                }
            }
            expect(heldNow.sort()).toEqual(expected.sort());

            const read = async () => {
                const stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                const values: Record<string, any> = {};
                for (const name of names) {
                    const { stateValues } =
                        stateVariables[await resolvePathToNodeIdx(name)];
                    values[name] = (
                        stateValues.vertices ?? stateValues.points
                    ).map((vertex: any[]) => vertex.map((x) => x.tree));
                }
                return values;
            };
            const steps = [await read()];
            for (const act of acts) {
                await act(core, resolvePathToNodeIdx);
                steps.push(await read());
            }
            results.push(steps);
        }
        expect(results[0]).toEqual(results[1]);
        return results[0];
    }

    it("reads a list of points, and a drag writes it", async () => {
        const steps = await compare({
            doenetML: `
<graph>
  <pointList name="L">(1,2) (3,4) (5,6)</pointList>
  <polygon name="pg" vertices="$L" />
  <polyline name="pl" vertices="$L" />
  <pointList name="L3">(1,2,3) (3,4,5)</pointList>
  <polyline name="three" vertices="$L3" />
  <pointList name="L1">(1) (3)</pointList>
  <polyline name="one" vertices="$L1" />
  <pointList name="Le"></pointList>
  <polyline name="empty" vertices="$Le" />
  <pointList name="Lf" fixed>(1,2) (3,4)</pointList>
  <polyline name="ofFixed" vertices="$Lf" />
  <pointList name="Lfl" fixLocation>(1,2) (3,4)</pointList>
  <polyline name="ofFixLocation" vertices="$Lfl" />
</graph>
`,
            names: [
                "L",
                "pg",
                "pl",
                "three",
                "one",
                "empty",
                "ofFixed",
                "ofFixLocation",
            ],
            held: [
                "pg",
                "pl",
                "three",
                "one",
                "empty",
                "ofFixed",
                "ofFixLocation",
            ],
            acts: [
                async (core, resolvePathToNodeIdx) => {
                    await movePolygon({
                        componentIdx: await resolvePathToNodeIdx("pg"),
                        pointCoords: { 0: [20, 21], 1: [22, 23], 2: [24, 25] },
                        core,
                    });
                },
                async (core, resolvePathToNodeIdx) => {
                    await movePolyline({
                        componentIdx: await resolvePathToNodeIdx("pl"),
                        pointCoords: { 1: [7, 8] },
                        core,
                    });
                    for (const name of ["ofFixed", "ofFixLocation", "three"]) {
                        await movePolyline({
                            componentIdx: await resolvePathToNodeIdx(name),
                            pointCoords: { 0: [9, 9] },
                            core,
                        });
                    }
                },
            ],
        });
        expect(steps[0].pg).toEqual([
            [1, 2],
            [3, 4],
            [5, 6],
        ]);
        expect(steps[0].three).toEqual([
            [1, 2, 3],
            [3, 4, 5],
        ]);
        expect(steps[0].empty).toEqual([]);
        expect(steps[1].L).toEqual([
            [20, 21],
            [22, 23],
            [24, 25],
        ]);
        expect(steps[2].L[1]).toEqual([7, 8]);
        expect(steps[2].pg[1]).toEqual([7, 8]);
        expect(steps[2].ofFixed).toEqual([
            [1, 2],
            [3, 4],
        ]);
        expect(steps[2].ofFixLocation).toEqual([
            [1, 2],
            [3, 4],
        ]);
    });

    it("follows a repeat of points made a list as it grows and shrinks", async () => {
        const steps = await compare({
            doenetML: `
<mathInput name="mi" prefill="3" />
<number name="n">$mi</number>
<graph>
  <repeatForSequence name="S" from="1" to="$n" valueName="v">
    <point>($v, $v^2)</point>
  </repeatForSequence>
  <polyline name="pl" vertices="$S" />
</graph>
`,
            names: ["pl"],
            held: ["pl"],
            acts: [
                async (core, resolvePathToNodeIdx) => {
                    await updateMathInputValue({
                        latex: "4",
                        componentIdx: await resolvePathToNodeIdx("mi"),
                        core,
                    });
                },
                async (core, resolvePathToNodeIdx) => {
                    await updateMathInputValue({
                        latex: "1",
                        componentIdx: await resolvePathToNodeIdx("mi"),
                        core,
                    });
                },
            ],
        });
        expect(steps[1].pl).toEqual([
            [1, 1],
            [2, 4],
            [3, 9],
            [4, 16],
        ]);
        expect(steps[2].pl).toEqual([[1, 1]]);
    });

    it("reads the points a `<collect>` made a list holds, which are dragged as their sources", async () => {
        const steps = await compare({
            doenetML: `
<graph name="g1">
  <point name="A">(1,2)</point>
  <point name="B">(3,4)</point>
</graph>
<graph name="g2">
  <collect componentType="point" from="$g1" name="c" />
  <polygon name="pg" vertices="$c" />
</graph>
`,
            names: ["pg"],
            held: ["pg"],
            acts: [
                async (core, resolvePathToNodeIdx) => {
                    await movePolygon({
                        componentIdx: await resolvePathToNodeIdx("pg"),
                        pointCoords: { 0: [5, 6], 1: [7, 8] },
                        core,
                    });
                },
            ],
        });
        // `numPoints` of a collected list is read as `numComponents`: an
        // alias is looked up by type, which every collected list shares
        expect(steps[0].pg).toEqual([
            [1, 2],
            [3, 4],
        ]);
        expect(steps[1].pg).toEqual([
            [5, 6],
            [7, 8],
        ]);
    });

    it("copies of what holds the list resolve it from where they are", async () => {
        const [values] = await compare({
            doenetML: `
<graph>
  <pointList name="L">(1,2) (3,4)</pointList>
  <polygon name="pg" vertices="$L" />
  <polygon name="linked" extend="$pg" />
  <polygon name="unlinked" copy="$pg" />
</graph>
<repeat name="rp" for="1 2" valueName="v">
  <graph>
    <pointList name="L">($v,0) (0,$v)</pointList>
    <polygon name="copied" copy="$pg" />
  </graph>
</repeat>
`,
            names: ["linked", "unlinked", "rp[1].copied", "rp[2].copied"],
            held: ["pg", "unlinked", "rp[1].copied", "rp[2].copied"],
        });
        expect(values.unlinked).toEqual([
            [1, 2],
            [3, 4],
        ]);
        // pasted in an iteration, `$L` names the iteration's list
        expect(values["rp[2].copied"]).toEqual([
            [2, 0],
            [0, 2],
        ]);
    });

    it("keeps the attribute component of vertices that are not one whole list of points", async () => {
        await compare({
            doenetML: `
<graph>
  <point name="A">(7,7)</point>
  <point name="B">(8,9)</point>
  <pointList name="L">(1,2) (3,4)</pointList>
  <repeat name="r" for="1 2" valueName="v"><point>($v, 1)</point><point>(1, $v)</point></repeat>
  <polyline name="points" vertices="$A $B" />
  <polyline name="literal" vertices="(0,0) (1,1)" />
  <polyline name="listAndPoint" vertices="$L $A" />
  <polyline name="composite" vertices="$r" />
  <polyline name="missing" vertices="$nothing" />
</graph>
`,
            names: [
                "points",
                "literal",
                "listAndPoint",
                "composite",
                "missing",
            ],
            held: [],
        });
    });
});

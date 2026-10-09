import { afterEach, describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    moveLine,
    moveLineSegment,
    movePoint,
    moveThroughPoint,
    moveVector,
    updateMathInputValue,
} from "../utils/actions";
import { setExpressionAttributesEnabled } from "../../utils/dast/expressionAttributes";
import { createNewComponentIndices } from "../../utils/componentIndices";
import { copyOfExpressionAttribute } from "../../utils/expressionAttributeNames";

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
                if (component?.attributes?.xs?.type === "expression") {
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
});

import { afterEach, describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    moveRay,
    moveVector,
    movePoint,
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";
import { setExpressionAttributesEnabled } from "../../utils/dast/expressionAttributes";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * An unlinked copy (`copy=`) of an `extend` behaves as the DoenetML of what
 * the `extend` names, pasted where the copy is: its references stay live,
 * and what it holds is held as it was when copied. Each document is checked
 * with the coordinates of points held either way, by the point
 * (`utils/dast/expressionAttributes.ts`) or by attribute components.
 */
describe("An unlinked copy of an extend @group4", () => {
    afterEach(() => setExpressionAttributesEnabled(true));

    /** Load `doenetML` both ways; `check` sees the same in each. */
    async function bothWays(
        doenetML: string,
        check: (core: any, resolvePathToNodeIdx: any) => Promise<void>,
    ) {
        for (const enabled of [true, false]) {
            setExpressionAttributesEnabled(enabled);
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
            });
            setExpressionAttributesEnabled(true);
            await check(core, resolvePathToNodeIdx);
        }
    }

    async function treeOf(
        core: any,
        resolvePathToNodeIdx: any,
        name: string,
        variable: string,
    ) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        const value =
            stateVariables[await resolvePathToNodeIdx(name)].stateValues[
                variable
            ];
        return Array.isArray(value)
            ? value.map((x: any) => x.tree)
            : value.tree;
    }

    it("a point's coordinates read references, which the copy follows and writes", async () => {
        await bothWays(
            `
<mathInput name="mi" prefill="1" />
<number name="a">$mi</number>
<graph>
  <point name="P">($a, 0)</point>
  <point name="Q" extend="$P" />
  <point name="C" copy="$Q" />
</graph>
`,
            async (core, resolvePathToNodeIdx) => {
                const xs = (name: string) =>
                    treeOf(core, resolvePathToNodeIdx, name, "xs");

                // the text `P` writes to its `0` is `P`'s: the copy was
                // made before, as `($a, 0)`
                await movePoint({
                    componentIdx: await resolvePathToNodeIdx("P"),
                    x: 1,
                    y: 7,
                    core,
                });
                expect(await xs("P")).eqls([1, 7]);
                expect(await xs("C")).eqls([1, 0]);

                await updateMathInputValue({
                    latex: "5",
                    componentIdx: await resolvePathToNodeIdx("mi"),
                    core,
                });
                expect(await xs("C")).eqls([5, 0]);

                // the copy's `$a` writes `a`, as a pasted `($a, 0)` does
                await movePoint({
                    componentIdx: await resolvePathToNodeIdx("C"),
                    x: 9,
                    y: 3,
                    core,
                });
                expect(await xs("C")).eqls([9, 3]);
                expect(await xs("P")).eqls([9, 7]);
            },
        );
    });

    it("a point with no references is copied as the value it has", async () => {
        await bothWays(
            `
<graph>
  <point name="R">(4, 4)</point>
  <point name="S" extend="$R" />
  <point name="T" copy="$S" />
</graph>
`,
            async (core, resolvePathToNodeIdx) => {
                await movePoint({
                    componentIdx: await resolvePathToNodeIdx("R"),
                    x: 6,
                    y: 6,
                    core,
                });
                expect(
                    await treeOf(core, resolvePathToNodeIdx, "T", "xs"),
                ).eqls([4, 4]);
            },
        );
    });

    it("a vector's coordinates read references, which the copy follows and writes", async () => {
        await bothWays(
            `
<mathInput name="mi" prefill="3" />
<number name="a">$mi</number>
<graph>
  <vector name="V">($a, 2)</vector>
  <vector name="W" extend="$V" />
  <vector name="X" copy="$W" />
</graph>
`,
            async (core, resolvePathToNodeIdx) => {
                const head = (name: string) =>
                    treeOf(core, resolvePathToNodeIdx, name, "head");

                expect(await head("X")).eqls([3, 2]);
                await updateMathInputValue({
                    latex: "5",
                    componentIdx: await resolvePathToNodeIdx("mi"),
                    core,
                });
                expect(await head("X")).eqls([5, 2]);

                // the text `V` writes to its `2` is `V`'s: the copy was
                // made before, as `($a, 2)`
                await moveVector({
                    componentIdx: await resolvePathToNodeIdx("V"),
                    headcoords: [5, 7],
                    core,
                });
                expect(await head("V")).eqls([5, 7]);
                expect(await head("X")).eqls([5, 2]);

                // the copy's `$a` writes `a`, as a pasted `($a, 2)` does
                await moveVector({
                    componentIdx: await resolvePathToNodeIdx("X"),
                    headcoords: [9, 4],
                    core,
                });
                expect(await head("X")).eqls([9, 4]);
                expect(await head("V")).eqls([9, 7]);
            },
        );
    });

    it("a copy of a linked copy of a vector builds, with the tail and head it has", async () => {
        await bothWays(
            `
<graph>
  <vector name="w" tail="(1,1)" head="(4,3)" />
  <vector name="w2" extend="$w" />
  <vector name="w3" copy="$w2" />
</graph>
<graph>
  <vector name="u" tail="(1,1)">(2,3)</vector>
  <vector name="v" tail="(0,2)">(1,1)</vector>
</graph>
<sort name="s" sortByProp="x">$u $v</sort>
<graph><vector name="c" copy="$s[1]" /></graph>
<graph>
  <vector name="p">(1, 2)</vector>
  <vector name="p2" extend="$p" />
  <vector name="p3" copy="$p2" />
</graph>
`,
            async (core, resolvePathToNodeIdx) => {
                const tree = (name: string, variable: string) =>
                    treeOf(core, resolvePathToNodeIdx, name, variable);
                expect(await tree("w3", "tail")).eqls([1, 1]);
                expect(await tree("w3", "head")).eqls([4, 3]);
                expect(await tree("c", "tail")).eqls([0, 2]);
                expect(await tree("c", "head")).eqls([1, 3]);
                expect(await tree("p3", "tail")).eqls([0, 0]);
                expect(await tree("p3", "head")).eqls([1, 2]);
            },
        );
    });

    it("a copy of a linked copy of a ray builds, with the endpoint and through point it has", async () => {
        // a ray's `direction` and `endpoint` hold their essential values as
        // `direction2` and `endpoint2`, as `directionShadow` and
        // `endpointShadow` hold theirs as `direction` and `endpoint`
        await bothWays(
            `
<graph>
  <ray name="r" endpoint="(1,2)" through="(3,5)" />
  <ray name="r2" extend="$r" />
  <ray name="r3" copy="$r2" />
  <ray name="s" through="(3,5)" direction="(1,1)" />
  <ray name="s2" extend="$s" />
  <ray name="s3" copy="$s2" />
  <ray name="t" endpoint="(1,2)" direction="(1,1)" />
  <ray name="t2" extend="$t" />
  <ray name="t3" copy="$t2" />
</graph>
`,
            async (core, resolvePathToNodeIdx) => {
                const tree = (name: string, variable: string) =>
                    treeOf(core, resolvePathToNodeIdx, name, variable);
                expect(await tree("r3", "endpoint")).eqls([1, 2]);
                expect(await tree("r3", "through")).eqls([3, 5]);
                expect(await tree("s3", "endpoint")).eqls([2, 4]);
                expect(await tree("s3", "through")).eqls([3, 5]);
                expect(await tree("t3", "endpoint")).eqls([1, 2]);
                expect(await tree("t3", "through")).eqls([2, 3]);
            },
        );
    });

    it("a copy of a repeat of vectors and rays builds, with the values they were moved to", async () => {
        // a `<repeat copy>` takes the essential state of each replacement
        // (`copyStateFromUnlinkedSource`), held under the same names
        await bothWays(
            `
<booleanInput name="b" />
<graph>
  <repeat name="r" for="1 2" valueName="t">
    <vector name="v" />
    <ray name="w" endpoint="(1,2)" through="(3,5)" />
  </repeat>
</graph>
<conditionalContent name="cc" condition="$b">
  <graph><repeat name="r2" copy="$r" /></graph>
</conditionalContent>
`,
            async (core, resolvePathToNodeIdx) => {
                const tree = (name: string, variable: string) =>
                    treeOf(core, resolvePathToNodeIdx, name, variable);
                await moveVector({
                    componentIdx: await resolvePathToNodeIdx("r[1].v"),
                    headcoords: [6, 7],
                    tailcoords: [3, 3],
                    core,
                });
                await moveRay({
                    componentIdx: await resolvePathToNodeIdx("r[1].w"),
                    endpointcoords: [-1, -1],
                    throughcoords: [4, 0],
                    core,
                });
                await updateBooleanInputValue({
                    boolean: true,
                    componentIdx: await resolvePathToNodeIdx("b"),
                    core,
                });
                expect(await tree("cc.r2[1].v", "tail")).eqls([3, 3]);
                expect(await tree("cc.r2[1].v", "head")).eqls([6, 7]);
                expect(await tree("cc.r2[1].w", "endpoint")).eqls([-1, -1]);
                expect(await tree("cc.r2[1].w", "through")).eqls([4, 0]);
                expect(await tree("cc.r2[2].v", "head")).eqls([1, 0]);
                expect(await tree("cc.r2[2].w", "through")).eqls([3, 5]);
            },
        );
    });
});

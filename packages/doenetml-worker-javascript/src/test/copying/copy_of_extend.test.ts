import { afterEach, describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { movePoint, updateMathInputValue } from "../utils/actions";
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

    it("a vector's coordinates read references, which the copy follows", async () => {
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
                expect(
                    await treeOf(core, resolvePathToNodeIdx, "X", "head"),
                ).eqls([3, 2]);
                await updateMathInputValue({
                    latex: "5",
                    componentIdx: await resolvePathToNodeIdx("mi"),
                    core,
                });
                expect(
                    await treeOf(core, resolvePathToNodeIdx, "X", "head"),
                ).eqls([5, 2]);
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
});

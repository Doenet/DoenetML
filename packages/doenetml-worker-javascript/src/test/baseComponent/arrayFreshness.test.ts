import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { movePoint, updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * An array state variable counts its fresh keys (`numFreshKeys`), so the
 * freshness of the whole array is read without building its keys
 * (Doenet/DoenetML#2261).
 */
describe("Array freshness tests @group4", async () => {
    // a polyline through a repeat of points that all read `$a`, and a
    // spreadsheet whose cells read the same values
    const doenetML = `
<setup>
  <math name="a">1</math>
  <math name="n">20</math>
  <repeatForSequence name="Ps" from="1" to="$n" indexName="i">
    <point>($i, $a $i)</point>
  </repeatForSequence>
</setup>
<mathInput name="ai" bindValueTo="$a" />
<mathInput name="ni" bindValueTo="$n" />
<graph>
  <polyline name="pl" vertices="$Ps" />
  <point name="A" x="0" y="$a" />
</graph>
<spreadsheet name="s">
  <row><cell><number>$a</number></cell><cell><number>$a+1</number></cell></row>
  <row><cell><number>2$a</number></cell><cell><number>2$a+1</number></cell></row>
</spreadsheet>
`;

    /** Every array of `components` whose count disagrees with its keys. */
    function miscountedArrays(components: any[]) {
        const miscounted: string[] = [];
        for (const component of components) {
            if (!component) {
                continue;
            }
            for (const [varName, stateVarObj] of Object.entries<any>(
                component.state,
            )) {
                const freshnessInfo = stateVarObj?.freshnessInfo;
                if (!stateVarObj?.isArray || !freshnessInfo?.freshByKey) {
                    continue;
                }
                const numKeys = Object.keys(freshnessInfo.freshByKey).length;
                if (freshnessInfo.numFreshKeys !== numKeys) {
                    miscounted.push(
                        `${component.componentType}.${varName}: counted ${freshnessInfo.numFreshKeys}, has ${numKeys}`,
                    );
                }
            }
        }
        return miscounted;
    }

    async function verticesOf(core: any, plIdx: number) {
        const pl = core.core!.components![plIdx];
        return await pl.stateValues.numericalVertices;
    }

    it("the count of fresh keys matches the keys marked fresh, and values follow changes", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });
        const components = core.core!.components!;
        const plIdx = await resolvePathToNodeIdx("pl");
        const sIdx = await resolvePathToNodeIdx("s");

        async function check(a: number, n: number) {
            const vertices = await verticesOf(core, plIdx);
            expect(vertices).toEqual(
                Array.from({ length: n }, (_, i) => [i + 1, a * (i + 1)]),
            );
            const cells = await components[sIdx].stateValues.cells;
            expect(cells.slice(0, 2).map((r: any[]) => r.slice(0, 2))).toEqual([
                [String(a), String(a + 1)],
                [String(2 * a), String(2 * a + 1)],
            ]);
            expect(miscountedArrays(components)).toEqual([]);
        }

        await check(1, 20);

        // invalidate every entry, several times over, through a drag and
        // through an input
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A"),
            x: 0,
            y: 3,
            core,
        });
        await check(3, 20);
        await updateMathInputValue({
            latex: "-2",
            componentIdx: await resolvePathToNodeIdx("ai"),
            core,
        });
        await check(-2, 20);

        // the arrays shrink and grow
        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("ni"),
            core,
        });
        await check(-2, 5);
        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("ai"),
            core,
        });
        await check(4, 5);
        await updateMathInputValue({
            latex: "12",
            componentIdx: await resolvePathToNodeIdx("ni"),
            core,
        });
        await check(4, 12);
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A"),
            x: 0,
            y: 7,
            core,
        });
        await check(7, 12);
    });

    it("invalidating an array entry by entry does not build its keys each time", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });
        const components = core.core!.components!;
        const plIdx = await resolvePathToNodeIdx("pl");
        await verticesOf(core, plIdx);

        const vertices = components[plIdx].state.vertices;
        const getAllArrayKeys = vertices.getAllArrayKeys;
        let numCalls = 0;
        vertices.getAllArrayKeys = function (...args: any[]) {
            numCalls++;
            return getAllArrayKeys.apply(this, args);
        };

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A"),
            x: 0,
            y: 3,
            core,
        });

        // Each of the 20 vertices goes stale separately, and the whole
        // array's freshness is checked each time. Building the keys for
        // each check made 85 calls in this drag; recomputing the vertices
        // makes 1.
        expect(numCalls).toBeLessThan(10);
        expect(await verticesOf(core, plIdx)).toEqual(
            Array.from({ length: 20 }, (_, i) => [i + 1, 3 * (i + 1)]),
        );
    });
});

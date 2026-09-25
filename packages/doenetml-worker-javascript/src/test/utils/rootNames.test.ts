import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "./test-core";
import { updateMathInputValue } from "./actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Root names @group4", async () => {
    it("root names patched from the resolver match a full recalculation as a document changes", async () => {
        const { core, rustCore, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="n" prefill="5" />
    <repeatForSequence name="r" length="$n" valueName="v">
      <group name="g"><p name="p">$v</p><math name="m">$v^2</math></group>
    </repeatForSequence>
    <group name="h">$r</group>
    <p name="q">$r[3].g.p</p>
    <collect name="c" componentType="math" from="$r" />
    <select name="s" numToSelect="2">
      <option><text>a</text></option>
      <option><text>b</text></option>
      <option><text>c</text></option>
    </select>
    <conditionalContent>
      <case condition="$n > 3"><text name="big">big</text></case>
      <else><text name="small">small</text></else>
    </conditionalContent>
    `,
        });

        const jsCore = core.core!;

        /** The root names the resolver would calculate from scratch, keyed like `core.rootNames` */
        function calculatedRootNames() {
            const names: (string | null | undefined)[] =
                rustCore.calculate_root_names().names;
            return Object.fromEntries(
                names.flatMap((name, idx) =>
                    name == null ? [] : [[idx, name]],
                ),
            );
        }

        expect(jsCore.rootNames).toEqual(calculatedRootNames());
        const initialCount = Object.keys(jsCore.rootNames).length;

        const counts: number[] = [];
        const nIdx = await resolvePathToNodeIdx("n");
        for (const n of ["8", "2", "0", "6", "1"]) {
            await updateMathInputValue({ latex: n, componentIdx: nIdx, core });
            // Force the replacements to be updated
            await core.returnAllStateVariables(false, true);
            expect(jsCore.rootNames).toEqual(calculatedRootNames());
            counts.push(Object.keys(jsCore.rootNames).length);
        }

        // Growing the repeat added root names, and shrinking it removed them
        expect(counts[0]).greaterThan(initialCount);
        expect(counts[2]).lessThan(initialCount);
    });
});

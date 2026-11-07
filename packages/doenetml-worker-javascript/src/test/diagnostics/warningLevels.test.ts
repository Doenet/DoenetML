import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * A diagnostic's level follows where its condition comes from (D35, DIAG-1,
 * DIAG-2, #2422): a warning when what the author wrote causes it, and an
 * info when a value that can change does, which appears and goes away with
 * the value (B33).
 */

async function setup(doenetML: string) {
    const { core, resolvePathToNodeIdx } = await createTestCore({
        doenetML,
    });

    /** The diagnostics with `code` now, as type and line, by line. */
    function diagnostics(code: string) {
        return (core as any).core.diagnostics
            .filter((d: any) => d.code === code)
            .map((d: any) => ({
                type: d.type,
                line: d.position?.start.line,
            }))
            .sort((a: any, b: any) => a.line - b.line);
    }

    async function setMath(name: string, latex: string) {
        await updateMathInputValue({
            latex,
            componentIdx: await resolvePathToNodeIdx(name),
            core,
        });
        // diagnostics are decided again when what shows them is
        await core.returnAllStateVariables(false, true);
    }

    return { core, diagnostics, setMath };
}

describe("Warning levels by the source of the condition", () => {
    it("w0027: a circle through a non-numerical point", async () => {
        const { diagnostics, setMath } = await setup(`
<graph>
  <circle through="(x,1) (2,3) (4,1)"/>
</graph>
<mathInput name="a"/>
<graph>
  <circle through="($a,1) (2,3) (4,1)"/>
</graph>
`);
        expect(diagnostics("doenet-w0027")).eqls([
            { type: "warning", line: 3 },
            { type: "info", line: 7 },
        ]);

        await setMath("a", "5");
        expect(diagnostics("doenet-w0027")).eqls([
            { type: "warning", line: 3 },
        ]);

        await setMath("a", "");
        expect(diagnostics("doenet-w0027")).eqls([
            { type: "warning", line: 3 },
            { type: "info", line: 7 },
        ]);
    });

    it("w0144: a bar chart's value that is not a number", async () => {
        const { diagnostics, setMath } = await setup(`
<chart type="bar">4 x</chart>
<mathInput name="m"/>
<chart type="bar">4 $m</chart>
`);
        expect(diagnostics("doenet-w0144")).eqls([
            { type: "warning", line: 2 },
            { type: "info", line: 4 },
        ]);

        await setMath("m", "3");
        expect(diagnostics("doenet-w0144")).eqls([
            { type: "warning", line: 2 },
        ]);
    });

    it("w0143: a bar width out of range", async () => {
        const { diagnostics, setMath } = await setup(`
<chart type="bar" barWidth="5">4</chart>
<mathInput name="w" prefill="5"/>
<chart type="bar" barWidth="$w">4</chart>
`);
        expect(diagnostics("doenet-w0143")).eqls([
            { type: "warning", line: 2 },
            { type: "info", line: 4 },
        ]);

        await setMath("w", "0.5");
        expect(diagnostics("doenet-w0143")).eqls([
            { type: "warning", line: 2 },
        ]);
    });

    it("w0141: decreasing cut points of a binCounts", async () => {
        const { diagnostics, setMath } = await setup(`
<binCounts bins="0 5 2">1</binCounts>
<mathInput name="b" prefill="2"/>
<binCounts bins="0 5 $b">1</binCounts>
`);
        expect(diagnostics("doenet-w0141")).eqls([
            { type: "warning", line: 2 },
            { type: "info", line: 4 },
        ]);

        await setMath("b", "7");
        expect(diagnostics("doenet-w0141")).eqls([
            { type: "warning", line: 2 },
        ]);
    });

    it("w0164: values of a searchSorted out of order", async () => {
        const { diagnostics, setMath } = await setup(`
<searchSorted target="2">3 1</searchSorted>
<mathInput name="m" prefill="3"/>
<searchSorted target="2">$m 1</searchSorted>
`);
        expect(diagnostics("doenet-w0164")).eqls([
            { type: "warning", line: 2 },
            { type: "info", line: 4 },
        ]);

        await setMath("m", "0");
        expect(diagnostics("doenet-w0164")).eqls([
            { type: "warning", line: 2 },
        ]);
    });

    it("w0104: an index that names nothing", async () => {
        const { diagnostics, setMath } = await setup(`
<mathList name="l">a b c</mathList>
<p>$l[0]</p>
<mathInput name="i" prefill="0"/>
<p>$l[$i]</p>
<repeat name="r" for="1 2" valueName="v"><p>$v</p></repeat>
<p>$r[$i]</p>
`);
        expect(diagnostics("doenet-w0104")).eqls([
            { type: "warning", line: 3 },
            { type: "info", line: 5 },
            { type: "info", line: 7 },
        ]);

        await setMath("i", "1");
        expect(diagnostics("doenet-w0104")).eqls([
            { type: "warning", line: 3 },
        ]);

        await setMath("i", "0");
        expect(diagnostics("doenet-w0104")).eqls([
            { type: "warning", line: 3 },
            { type: "info", line: 5 },
            { type: "info", line: 7 },
        ]);
    });

    it("w0100: an index into a value that is a scalar", async () => {
        const { diagnostics, setMath } = await setup(`
<math name="m">5</math>
<p>$m[2]</p>
<mathInput name="a" prefill="5"/>
<math name="m2">$a</math>
<p>$m2[2]</p>
`);
        expect(diagnostics("doenet-w0100")).eqls([
            { type: "warning", line: 3 },
            { type: "info", line: 6 },
        ]);

        await setMath("a", "(1,2)");
        expect(diagnostics("doenet-w0100")).eqls([
            { type: "warning", line: 3 },
        ]);
    });
});

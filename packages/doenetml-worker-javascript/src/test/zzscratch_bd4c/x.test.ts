import { appendFileSync } from "fs";
import { describe, expect, it } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
const cases = [
    `<mathInput name="n" prefill="1"/>
<group name="g"><setup><collect name="ps" componentType="p" from="$g"/></setup><p>one</p><p name="q">hi [$ps[$n]]</p></group>
<group name="g2" copy="$g"/>`,
    `<mathInput name="n" prefill="1"/>
<group name="g"><p>one</p><p name="q">hi [$ps[$n]]</p></group>
<collect name="ps" componentType="p" from="$g"/>
<group name="g2" copy="$g"/>`,
    `<mathInput name="n" prefill="1"/>
<group name="g"><text>one</text><p name="q">hi [$ps[$n]]</p></group>
<collect name="ps" componentType="text" from="$g"/>
<group name="g2" copy="$g"/>`,
];
describe("x", () => {
    for (const [i, d] of cases.entries())
        it("c" + i, async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: d,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const out = [];
            for (const p of ["g.q", "g2.q"]) {
                const idx = await resolvePathToNodeIdx(p);
                out.push(idx === -1 ? "NA" : sv[idx].stateValues.text);
            }
            const dg = getDiagnosticsByType(core);
            appendFileSync(
                "/tmp/claude-0/-home-user-DoenetML/bd4cbbe6-4ed6-51a2-83fb-6b915565790c/scratchpad/out.txt",
                [
                    "CASE",
                    i,
                    JSON.stringify(out),
                    JSON.stringify(
                        [...dg.errors, ...dg.warnings].map(
                            (e: any) => e.code + " " + e.message,
                        ),
                    ),
                ].join(" ") + "\n",
            );
        });
});

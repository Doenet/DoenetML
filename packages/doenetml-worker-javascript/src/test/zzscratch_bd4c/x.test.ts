import { appendFileSync } from "fs";
import { describe, it } from "vitest";
import { createTestCore, updateMathInputValue } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { takeErrorsReportedAfterLoad } from "../utils/errorsAfterLoad";
const log = (...a: any[]) =>
    appendFileSync(
        "/tmp/claude-0/-home-user-DoenetML/bd4cbbe6-4ed6-51a2-83fb-6b915565790c/scratchpad/out.txt",
        a
            .map((x) => (typeof x === "string" ? x : JSON.stringify(x)))
            .join(" ") + "\n",
    );
const cases = [
    `<mathInput name="n" prefill="1"/>
<group name="g"><text>one</text><p name="q">hi [<repeatForSequence length="1" name="r"><text>[]</text></repeatForSequence>]</p></group>
<group name="g2" copy="$g"/>`,
    `<mathInput name="n" prefill="1"/>
<group name="g"><sort name="s"><text>one</text><p name="q">hi [$s[$n]]</p></sort></group>
<group name="g2" copy="$g"/>`,
    `<mathInput name="n" prefill="1"/>
<group name="g"><shuffle name="s" numToShuffle="0"/><repeatForSequence name="r" length="2" valueName="v"><conditionalContent><case condition="$v=1"><text>one</text></case><else><p name="q">hi [$r[$n]]</p></else></conditionalContent></repeatForSequence></group>`,
];
describe("x", () => {
    for (const [i, d] of cases.entries())
        it("c" + i, async () => {
            try {
                const { core, resolvePathToNodeIdx } = await createTestCore({
                    doenetML: d,
                });
                async function show(tag: string) {
                    const sv = await core.returnAllStateVariables(false, true);
                    const out = [];
                    for (const p of ["g.q", "g2.q", "g.s[2]", "g.r[2].q"]) {
                        const idx = await resolvePathToNodeIdx(p);
                        out.push(idx === -1 ? "NA" : sv[idx]?.stateValues.text);
                    }
                    const dg = getDiagnosticsByType(core);
                    log(
                        "CASE",
                        i,
                        tag,
                        out,
                        [...dg.errors, ...dg.warnings].map(
                            (e: any) => e.code + " " + e.message,
                        ),
                    );
                }
                await show("n=1");
                await updateMathInputValue({
                    latex: "2",
                    componentIdx: await resolvePathToNodeIdx("n"),
                    core,
                });
                await show("n=2");
                log(
                    "after",
                    takeErrorsReportedAfterLoad().map((e: any) => e.code),
                );
            } catch (e: any) {
                log("CASE", i, "THROW", e.message);
            }
        });
});

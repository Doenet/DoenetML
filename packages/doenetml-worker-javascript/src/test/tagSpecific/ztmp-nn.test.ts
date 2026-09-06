import { describe, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { writeFileSync } from "fs";
const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");
const out: string[] = [];
async function probe(tag: string, doenetML: string) {
    const { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });
    const sv = await core.returnAllStateVariables(false, true);
    const d = getDiagnosticsByType(core);
    out.push(
        `@@ ${tag} => ${JSON.stringify(sv[await resolvePathToNodeIdx("p")].stateValues.text)} warn=${JSON.stringify(d.warnings.map((w: any) => w.message.slice(0, 70)))}`,
    );
}
describe("nn", () => {
    it("probes", async () => {
        await probe(
            "malformed number among numbers",
            `<p name="p"><binCounts bins="0 1 2"><number>x</number><number>0.5</number><number>1.5</number></binCounts></p>`,
        );
        await probe(
            "text child among numbers",
            `<p name="p"><binCounts bins="0 1 2"><text>apple</text><number>0.5</number><number>1.5</number></binCounts></p>`,
        );
        await probe(
            "boolean child among numbers",
            `<p name="p"><binCounts bins="0 1 2"><boolean>true</boolean><number>0.5</number><number>1.5</number></binCounts></p>`,
        );
        await probe(
            "outside range only",
            `<p name="p"><binCounts bins="0 1 2">0.5 1.5 9</binCounts></p>`,
        );
        writeFileSync(
            "/tmp/claude-1000/-home-nykamp-src-DoenetML3/a10f523c-22a1-4021-b516-6ec07daf99f4/scratchpad/nn.txt",
            out.join("\n"),
        );
    });
});

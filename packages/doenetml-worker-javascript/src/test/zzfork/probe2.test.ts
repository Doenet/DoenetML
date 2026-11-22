import { it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
vi.stubGlobal("postMessage", vi.fn());
vi.mock("hyperformula");
it("probe2", async () => {
    const { core } = await createTestCore({
        doenetML: `<group name="r2"><group name="r"><repeatForSequence name="r" from="1" to="2" valueName="v"><math>$v</math></repeatForSequence></group></group><group name="q" extend="$r2" /><p>$q.r[1]</p>`,
    });
    console.log(
        core
            .core!.diagnostics.filter(
                (d: any) => !d.code?.startsWith("doenet-a"),
            )
            .map((d: any) => `${d.code}: ${d.message}`),
    );
});

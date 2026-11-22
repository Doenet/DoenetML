import { it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
vi.stubGlobal("postMessage", vi.fn());
vi.mock("hyperformula");
it("probe2", async () => {
    const { core } = await createTestCore({
        doenetML: `<math name="m">x</math><p name="before">$e.h $e.k</p>
    <mathList name="l"><math name="h" extend="$m" /><math name="k" copy="$m" /> 2</mathList>
    <mathList name="e" extend="$l" />`,
    });
    console.log(
        core
            .core!.diagnostics.filter(
                (d: any) => !d.code?.startsWith("doenet-a"),
            )
            .map((d: any) => `${d.code}: ${d.message}`),
    );
});

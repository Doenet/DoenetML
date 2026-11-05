import { expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateMathInputValue } from "../utils/actions";
import * as fs from "fs";
const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");
it("probe", async () => {
    const cfg = JSON.parse(fs.readFileSync(process.env.PROBE!, "utf8"));
    const { core, resolvePathToNodeIdx } = await createTestCore({
        doenetML: cfg.doenetML,
    });
    const dump = async (label: string) => {
        const sv = await core.returnAllStateVariables(false, true);
        const out: string[] = [];
        for (const n of cfg.names) {
            const idx = await resolvePathToNodeIdx(n);
            const c = sv[idx];
            out.push(
                `${n}: ${c?.componentType} miss=${c?.stateValues?.valueMissing} dmiss=${(core as any).core._components[idx]?.doenetAttributes?.missing} rend=${(core as any).core._components[idx]?.rendererType} text=${JSON.stringify(c?.stateValues?.text ?? c?.stateValues?.value?.tree ?? c?.stateValues?.value)}`,
            );
        }
        fs.appendFileSync(
            process.env.PROBE + ".out",
            "\n" + `--- ${label}\n` + out.join("\n"),
        );
    };
    await dump("init");
    for (const s of cfg.steps ?? []) {
        await updateMathInputValue({
            latex: s.latex,
            componentIdx: await resolvePathToNodeIdx(s.mi),
            core,
        });
        await dump(`${s.mi}=${s.latex}`);
    }
    for (const d of (core as any).core.diagnostics)
        fs.appendFileSync(
            process.env.PROBE + ".out",
            "\n" + "DIAG",
            d.type,
            d.code,
            d.message,
        );
});

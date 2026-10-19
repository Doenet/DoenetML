// In-browser DoenetML parsing via the existing TypeScript parser, for the
// textarea in the UI. Benchmarks use pre-parsed fixtures instead. Each
// stage is a step of the load trace (`trace.ts`).
import { encodeDast } from "@doenet/cells-core/cdast-encode";
import { step, stepAsync } from "./trace";

export async function parseDoenetML(source: string): Promise<Uint8Array> {
    const { lezerToDast, normalizeDocumentDast } = await stepAsync(
        "parse/import",
        () => import("@doenet/parser"),
    );
    const raw = step("parse/lezerToDast", () => lezerToDast(source), {
        chars: source.length,
    });
    const dast = step("parse/normalize", () => normalizeDocumentDast(raw));
    const bytes = step("parse/encode", () => encodeDast(dast));
    return bytes;
}

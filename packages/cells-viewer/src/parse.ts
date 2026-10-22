// In-browser DoenetML parsing via the existing TypeScript parser, for the
// editor in the UI. Benchmarks use pre-parsed fixtures instead. Each
// stage is a step of the load trace (`trace.ts`).
import { encodeDast } from "@doenet/cells-core/cdast-encode";
import { originsCollector, type NodeOrigins } from "./identity";
import { step, stepAsync } from "./trace";

type Parser = typeof import("@doenet/parser");

let parser: Parser | null = null;
let parserLoad: Promise<Parser> | null = null;

/** Load the parser's chunk, once per page: the step `parser import`.
 * Called at boot (`dev/main.tsx`), so the chunk arrives while the page
 * renders and the document's text is fetched, instead of after. */
export function preloadParser(): Promise<Parser> {
    return (parserLoad ??= (async () => {
        const m = await stepAsync(
            "parser import",
            () => import("@doenet/parser"),
        );
        parser = m;
        return m;
    })());
}

/** The wire-format bytes of `source`, and where each of their nodes came
 * from in it (`identity.ts`). */
export async function parseDoenetML(
    source: string,
): Promise<{ bytes: Uint8Array; origins: NodeOrigins }> {
    // With the parser in hand there is no import to wait for, and no task
    // boundary between the call and the parse: a Refresh parses and loads
    // before React's next render.
    const { lezerToDast, normalizeDocumentDast } =
        parser ?? (await stepAsync("parse/import", preloadParser));
    const raw = step("parse/lezerToDast", () => lezerToDast(source), {
        chars: source.length,
    });
    const dast = step("parse/normalize", () => normalizeDocumentDast(raw));
    const origins = originsCollector(source);
    let nNodes = 0;
    const bytes = step("parse/encode", () =>
        encodeDast(dast, (id, n) => {
            origins.onNode(id, n);
            nNodes = Math.max(nNodes, id + 1);
        }),
    );
    // The root the encoder adds (node 0) has no origin.
    return { bytes, origins: origins.finish(nNodes) };
}

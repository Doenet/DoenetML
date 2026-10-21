// In-browser DoenetML parsing via the existing TypeScript parser, for the
// textarea in the UI. Benchmarks use pre-parsed fixtures instead. Each
// stage is a step of the load trace (`trace.ts`).
import { encodeDast } from "@doenet/cells-core/cdast-encode";
import { step, stepAsync } from "./trace";

type Parser = typeof import("@doenet/parser");

let parser: Parser | null = null;
let parserLoad: Promise<Parser> | null = null;

/** Load the parser's chunk, once per page: the step `parser import`.
 * Called at boot (`dev/main.tsx`), so the chunk arrives while the page
 * renders and the document's text is fetched, instead of after. */
export function preloadParser(): Promise<Parser> {
    return (parserLoad ??= stepAsync(
        "parser import",
        () => import("@doenet/parser"),
    ).then((m) => (parser = m)));
}

export async function parseDoenetML(source: string): Promise<Uint8Array> {
    // With the parser in hand there is no import to wait for, and no task
    // boundary between the call and the parse: a Refresh parses and loads
    // before React's next render.
    const { lezerToDast, normalizeDocumentDast } =
        parser ?? (await stepAsync("parse/import", preloadParser));
    const raw = step("parse/lezerToDast", () => lezerToDast(source), {
        chars: source.length,
    });
    const dast = step("parse/normalize", () => normalizeDocumentDast(raw));
    const bytes = step("parse/encode", () => encodeDast(dast));
    return bytes;
}

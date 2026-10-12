// In-browser DoenetML parsing via the existing TypeScript parser, for the
// textarea in the UI. Benchmarks use pre-parsed fixtures instead.
export async function parseDoenetML(source: string): Promise<Uint8Array> {
    const { lezerToDast, normalizeDocumentDast, encodeBinaryDast } =
        await import("@doenet/parser");
    const dast = normalizeDocumentDast(lezerToDast(source));
    return encodeBinaryDast(dast);
}

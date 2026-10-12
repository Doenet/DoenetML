// In-browser DoenetML parsing via the existing TypeScript parser, for the
// textarea in the UI. Benchmarks use pre-parsed fixtures instead.
import { encodeDast } from "../../scripts/cdast-encode.mjs";

export async function parseDoenetML(source: string): Promise<Uint8Array> {
  const { lezerToDast, normalizeDocumentDast } = await import("@doenet/parser");
  const dast = normalizeDocumentDast(lezerToDast(source));
  return encodeDast(dast);
}

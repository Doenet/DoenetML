// Type shim for the DoenetML parser imported by path alias (see vite.config.ts).
declare module "@doenet/parser" {
  export function lezerToDast(source: string): unknown;
  export function normalizeDocumentDast(dast: unknown): unknown;
}

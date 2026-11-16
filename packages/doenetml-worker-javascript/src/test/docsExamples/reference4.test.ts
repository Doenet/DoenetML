import { vi } from "vitest";
import { describeDocsExamples, examplesOfShard } from "./docsExamples";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

// `reference/` has most of the examples, so it is cut into four files, which
// run in parallel (`docsExamples.ts`).
describeDocsExamples(
    "Docs examples in reference, part 4 of 4",
    examplesOfShard("reference", 4, 4),
);

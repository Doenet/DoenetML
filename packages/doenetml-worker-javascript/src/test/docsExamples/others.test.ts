import { vi } from "vitest";
import {
    describeDocsExamples,
    docsFiles,
    examplesInFiles,
} from "./docsExamples";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

// Every docs example outside `reference/`: the concepts, guides, tutorials
// and any other folder (`docsExamples.ts`).
describeDocsExamples(
    "Docs examples outside reference",
    examplesInFiles(
        docsFiles().filter((file) => !file.startsWith("reference/")),
    ),
);

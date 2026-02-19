import * as fs from "node:fs/promises";
import * as path from "node:path";

import type { CompletionSnippet } from "../src/completion-snippets.js";

const COMPLETION_SNIPPETS: Record<string, CompletionSnippet> = {
    "multiple-choice-answer": {
        element: "answer",
        snippet: `
<answer name="mcq" inline="false" shuffleOrder="false">
  <choice credit="1"></choice>
  <choice></choice>
  <choice></choice>
  <choice></choice>
  <choice></choice>
</answer>`,
        description: "Multiple choice answer template",
    },
    "multiple-choice-select-multiple-answer": {
        element: "answer",
        snippet: `
<answer name="mcq" selectMultiple inline="false" shuffleOrder="false">
  <choice credit="1"></choice>
  <choice credit="1"></choice>
  <choice></choice>
  <choice></choice>
  <choice></choice>
</answer>`,
        description: "Multiple choice select-multiple answer template",
    },
    "if-at-(immediate-feedback-assessment-technique)-answer": {
        element: "answer",
        snippet: `
<answer name="ifat" disableWrongChoices creditByAttempt="1 0.7 0.5" inline="false" shuffleOrder="false">
  <choice credit="1"></choice>
  <choice></choice>
  <choice></choice>
  <choice></choice>
  <choice></choice>
</answer>`,
        description:
            "IF-AT (Immediate Feedback Assessment Technique) answer template",
    },
    "table-with-tabular": {
        element: "table",
        snippet: `
<table name="table1">
  <title></title>
  <tabular>
    <row header>
      <cell></cell>
      <cell></cell>
    </row>
    <row>
      <cell></cell>
      <cell></cell>
    </row>
  </tabular>
</table>`,
        description: "Table with tabular template",
    },
};

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const file = path.join(
    __dirname,
    "..",
    "src",
    "generated",
    "completion-snippets.json",
);
const out = JSON.stringify(COMPLETION_SNIPPETS, null, 4) + "\n";

console.log("Writing", out.length / 1024, "KB to", file);

await fs.writeFile(file, out, "utf-8");

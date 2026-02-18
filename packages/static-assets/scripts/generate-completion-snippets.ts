import * as fs from "node:fs/promises";
import * as path from "node:path";

import { CompletionSnippet } from "../src/completion-snippets.js";

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
    "table-with-tabular": {
        element: "table",
        snippet: `
<table>
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
    "just-some-text": {
        element: "string",
        snippet: `Hello, this is just some text with no DoenetML elements.`,
        description: "Just some text",
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

fs.writeFile(file, out, "utf-8");

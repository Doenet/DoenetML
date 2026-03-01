import * as fs from "node:fs/promises";
import * as path from "node:path";

import type { CompletionSnippet } from "../src/completion-snippets.js";

const COMPLETION_SNIPPETS: Record<string, CompletionSnippet> = {
    "multiple-choice-answer": {
        element: "answer",
        snippet: `
<answer name="mcq" inline="false" shuffleOrder="false">
  <label></label>
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
  <label></label>
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
<answer name="ifat" disableWrongChoices creditByAttempt="1 0.7 0.5" disableAfterCorrect shuffleOrder="false">
  <label></label>
  <choice credit="1"></choice>
  <choice></choice>
  <choice></choice>
  <choice></choice>
  <choice></choice>
</answer>`,
        description:
            "IF-AT (Immediate Feedback Assessment Technique) answer template",
    },
    "answer-labeled": {
        element: "answer",
        snippet: `
<answer name="answer1">
  <label></label>
</answer>`,
        description: "answer with label (for accessibility)",
    },
    "pretzel-06": {
        element: "answer",
        snippet: `
<pretzel name="pretzel" maxNumColumns="2">

  <!-- problem 1 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>

  <!-- problem 2 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>

  <!-- problem 3 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>

  <!-- problem 4 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>

  <!-- problem 5 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>

  <!-- problem 6 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>
  
</pretzel>`,
        description: "Pretzel template with 6 problems",
    },
    "pretzel-08": {
        element: "answer",
        snippet: `
<pretzel name="pretzel" maxNumColumns="2">

  <!-- problem 1 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>

  <!-- problem 2 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>

  <!-- problem 3 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>

  <!-- problem 4 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>

  <!-- problem 5 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>

  <!-- problem 6 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>

  <!-- problem 7 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>

  <!-- problem 8 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>
  
</pretzel>`,
        description: "Pretzel template with 8 problems",
    },
    "pretzel-10": {
        element: "answer",
        snippet: `
<pretzel name="pretzel" maxNumColumns="2">

  <!-- problem 1 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>

  <!-- problem 2 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>

  <!-- problem 3 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>

  <!-- problem 4 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>

  <!-- problem 5 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>

  <!-- problem 6 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>

  <!-- problem 7 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>

  <!-- problem 8 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>

  <!-- problem 9 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>

  <!-- problem 10 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>
  
</pretzel>`,
        description: "Pretzel template with 10 problems",
    },
    "pretzel-12": {
        element: "answer",
        snippet: `
<pretzel name="pretzel" maxNumColumns="2">

  <!-- problem 1 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>

  <!-- problem 2 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>

  <!-- problem 3 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>

  <!-- problem 4 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>

  <!-- problem 5 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>

  <!-- problem 6 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>

  <!-- problem 7 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>

  <!-- problem 8 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>

  <!-- problem 9 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>

  <!-- problem 10 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>

  <!-- problem 11 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>

  <!-- problem 12 -->
  <problem>
    <statement>
      
    </statement>
    <answer>
      
    </answer>
  </problem>
  
</pretzel>`,
        description: "Pretzel template with 12 problems",
    },
    "table-with-tabular": {
        element: "table",
        snippet: `
<table name="table">
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
    "video-watched-credit": {
        element: "video",
        snippet: `
<video name="video1" youtube="" ></video>
<answer name="video1Watched" type="videoWatched" video="$video1" />

`,
        description: "Video that gives credit when watched",
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

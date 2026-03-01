import * as fs from "node:fs/promises";
import * as path from "node:path";

// `completion-snippets` provides snippet catalog shape.
import type { CompletionSnippet } from "../src/completion-snippets.js";
// `completion-snippet-protocol` provides cursor metadata protocol types.
import type { CompletionSnippetCursor } from "../src/completion-snippet-protocol.js";

type RawCompletionSnippet = Omit<CompletionSnippet, "cursor"> & {
    cursor?: CompletionSnippetCursor | "markers";
};

const CURSOR_TOKEN = "__CURSOR__";
const SELECTION_START_TOKEN = "__SEL_START__";
const SELECTION_END_TOKEN = "__SEL_END__";

/**
 * Snippet authoring notes:
 * - Set `cursor: "markers"` on a snippet to derive cursor metadata from marker tokens.
 * - Use `__CURSOR__` for a single caret position after insertion.
 * - Use `__SEL_START__` + `__SEL_END__` to create an initial selected range.
 * - Marker tokens are stripped from emitted snippet text.
 * - If markers are missing/invalid, no cursor metadata is emitted and the editor
 *   falls back to placing the caret at the end of the inserted snippet.
 */

/**
 * Strip marker tokens from snippet text and extract optional cursor metadata.
 */
function processMarkerTokens(snippet: string): {
    snippet: string;
    cursor?: CompletionSnippetCursor;
    warnings: string[];
} {
    let output = "";
    let cursorOffset: number | undefined;
    let selectionStartOffset: number | undefined;
    let selectionEndOffset: number | undefined;
    let cursorTokenCount = 0;
    let selectionStartTokenCount = 0;
    let selectionEndTokenCount = 0;

    for (let index = 0; index < snippet.length; ) {
        if (snippet.startsWith(SELECTION_START_TOKEN, index)) {
            selectionStartTokenCount += 1;
            selectionStartOffset = output.length;
            index += SELECTION_START_TOKEN.length;
            continue;
        }
        if (snippet.startsWith(SELECTION_END_TOKEN, index)) {
            selectionEndTokenCount += 1;
            selectionEndOffset = output.length;
            index += SELECTION_END_TOKEN.length;
            continue;
        }
        if (snippet.startsWith(CURSOR_TOKEN, index)) {
            cursorTokenCount += 1;
            cursorOffset = output.length;
            index += CURSOR_TOKEN.length;
            continue;
        }

        output += snippet[index];
        index += 1;
    }

    const warnings: string[] = [];

    if (cursorTokenCount > 1) {
        warnings.push(
            `found ${cursorTokenCount} ${CURSOR_TOKEN} markers; expected at most 1`,
        );
    }
    if (selectionStartTokenCount > 1) {
        warnings.push(
            `found ${selectionStartTokenCount} ${SELECTION_START_TOKEN} markers; expected at most 1`,
        );
    }
    if (selectionEndTokenCount > 1) {
        warnings.push(
            `found ${selectionEndTokenCount} ${SELECTION_END_TOKEN} markers; expected at most 1`,
        );
    }
    if (selectionStartTokenCount !== selectionEndTokenCount) {
        warnings.push(
            `found mismatched selection markers: ${SELECTION_START_TOKEN}=${selectionStartTokenCount}, ${SELECTION_END_TOKEN}=${selectionEndTokenCount}`,
        );
    }

    const hasSingleSelectionMarkers =
        selectionStartTokenCount === 1 && selectionEndTokenCount === 1;
    const hasSingleCaretMarker = cursorTokenCount === 1;

    if (
        hasSingleSelectionMarkers &&
        hasSingleCaretMarker &&
        selectionStartOffset != null &&
        selectionEndOffset != null
    ) {
        warnings.push(
            `found both selection and caret markers; selection markers take precedence`,
        );
    }

    if (
        hasSingleSelectionMarkers &&
        selectionStartOffset != null &&
        selectionEndOffset != null
    ) {
        if (selectionStartOffset > selectionEndOffset) {
            warnings.push(
                `selection marker order is invalid; ${SELECTION_START_TOKEN} appears after ${SELECTION_END_TOKEN}`,
            );
        } else {
            return {
                snippet: output,
                cursor: {
                    selectionStartOffset,
                    selectionEndOffset,
                },
                warnings,
            };
        }
    }

    if (hasSingleCaretMarker && cursorOffset != null) {
        return {
            snippet: output,
            cursor: {
                caretOffset: cursorOffset,
            },
            warnings,
        };
    }

    if (
        selectionStartTokenCount > 0 ||
        selectionEndTokenCount > 0 ||
        cursorTokenCount > 0
    ) {
        warnings.push(
            `ignoring marker metadata due to invalid marker usage; default cursor placement will be used`,
        );
    }

    return { snippet: output, warnings };
}

/**
 * Convert a raw snippet to the emitted shape, optionally parsing marker tokens.
 */
function resolveSnippet(
    key: string,
    snippet: RawCompletionSnippet,
): CompletionSnippet {
    if (snippet.cursor === "markers") {
        const processed = processMarkerTokens(snippet.snippet);
        for (const warning of processed.warnings) {
            console.warn(`Snippet "${key}": ${warning}`);
        }
        return {
            element: snippet.element,
            snippet: processed.snippet,
            description: snippet.description,
            ...(processed.cursor ? { cursor: processed.cursor } : {}),
        };
    }

    return {
        element: snippet.element,
        snippet: snippet.snippet,
        description: snippet.description,
        ...(snippet.cursor ? { cursor: snippet.cursor } : {}),
    };
}

const RAW_COMPLETION_SNIPPETS: Record<string, RawCompletionSnippet> = {
    "multiple-choice-answer": {
        element: "answer",
        snippet: `
<answer name="__SEL_START__mcq__SEL_END__" inline="false" shuffleOrder="false">
  <label></label>
  <choice credit="1"></choice>
  <choice></choice>
  <choice></choice>
  <choice></choice>
  <choice></choice>
</answer>`,
        description: "Multiple choice answer template",
        cursor: "markers",
    },
    "multiple-choice-select-multiple-answer": {
        element: "answer",
        snippet: `
<answer name="__SEL_START__mcq__SEL_END__" selectMultiple inline="false" shuffleOrder="false">
  <label></label>
  <choice credit="1"></choice>
  <choice credit="1"></choice>
  <choice></choice>
  <choice></choice>
  <choice></choice>
</answer>`,
        description: "Multiple choice select-multiple answer template",
        cursor: "markers",
    },
    "if-at-(immediate-feedback-assessment-technique)-answer": {
        element: "answer",
        snippet: `
<answer name="__SEL_START__ifat__SEL_END__" disableWrongChoices creditByAttempt="1 0.7 0.5" disableAfterCorrect shuffleOrder="false">
  <label></label>
  <choice credit="1"></choice>
  <choice></choice>
  <choice></choice>
  <choice></choice>
  <choice></choice>
</answer>`,
        description:
            "IF-AT (Immediate Feedback Assessment Technique) answer template",
        cursor: "markers",
    },
    "answer-labeled": {
        element: "answer",
        snippet: `
<answer name="__SEL_START__answer1__SEL_END__">
  <label></label>
</answer>`,
        description: "answer with label (for accessibility)",
        cursor: "markers",
    },
    "pretzel-06": {
        element: "answer",
        snippet: `
<pretzel name="__SEL_START__pretzel1__SEL_END__" maxNumColumns="2">

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
        cursor: "markers",
    },
    "pretzel-08": {
        element: "answer",
        snippet: `
<pretzel name="__SEL_START__pretzel1__SEL_END__" maxNumColumns="2">

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
        cursor: "markers",
    },
    "pretzel-10": {
        element: "answer",
        snippet: `
<pretzel name="__SEL_START__pretzel1__SEL_END__" maxNumColumns="2">

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
        cursor: "markers",
    },
    "pretzel-12": {
        element: "answer",
        snippet: `
<pretzel name="__SEL_START__pretzel1__SEL_END__" maxNumColumns="2">

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
        cursor: "markers",
    },
    "table-with-tabular": {
        element: "table",
        snippet: `
<table name="__SEL_START__table1__SEL_END__">
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
        cursor: "markers",
    },
    "video-watched-credit": {
        element: "video",
        snippet: `
<video name="__SEL_START__video1__SEL_END__" youtube="" >
  <shortDescription></shortDescription>
</video>
<answer name="video1Watched" type="videoWatched" video="$video1" />
`,
        description: "Video that gives credit when watched",
        cursor: "markers",
    },
};

const COMPLETION_SNIPPETS: Record<string, CompletionSnippet> =
    Object.fromEntries(
        Object.entries(RAW_COMPLETION_SNIPPETS).map(([key, snippet]) => [
            key,
            resolveSnippet(key, snippet),
        ]),
    );

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

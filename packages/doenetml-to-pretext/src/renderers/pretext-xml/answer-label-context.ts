import React from "react";

/**
 * The label an enclosing `<answer>` has already rendered, or `""` when there is none —
 * either because the answer had no label or because the input is written outside any
 * answer.
 *
 * An input inherits `label` from the `<answer>` around it, the same way it inherits
 * `expanded`, so an input that rendered the inherited label would print the question
 * twice. The answer is the one that keeps it: an expanded input is replaced by writing
 * space before export (see `utils/pretext/writing-space.ts`), and the label has to survive
 * that.
 *
 * A label written on the input itself rather than on the answer — `<answer><mathInput>
 * <label>…</label></mathInput></answer>` — does not reach the answer, so it differs from
 * this value and the input still renders it. Comparing the two is what tells the inherited
 * label apart from the input's own.
 */
export const AnswerLabelContext = React.createContext("");

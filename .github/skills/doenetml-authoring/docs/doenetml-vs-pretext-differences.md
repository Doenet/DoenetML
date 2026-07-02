# DoenetML vs PreTeXt Differences

## Primary Goal

- DoenetML: interactive web activity execution.
- PreTeXt: structured publishing across output formats.

## Core Mechanism

- DoenetML: runtime component state and reactive references (`$name`).
- PreTeXt: semantic XML structure and cross-reference (`xml:id`, `<xref>`).

## Assessment Workflow

- DoenetML: immediate validation and feedback from `<answer>` logic.
- PreTeXt: authored exercises with optional hint/answer/solution for reading/assignment workflows.

## Math Focus

- DoenetML: computation and transformation behavior in components.
- PreTeXt: high-quality mathematical presentation for publication.

## Conversion Warning

When translating content:

- Do not flatten DoenetML interactions into static prose unless explicitly desired.
- Do not inject DoenetML runtime idioms into PreTeXt documents.
- Preserve pedagogy while adapting to each system's strengths.

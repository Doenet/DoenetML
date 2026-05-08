# Deferred missing descriptions

After the rest of the schema-coverage work, the only remaining gaps are
**125 property instances across 14 unique names**: every one is a property
whose state-variable definition is
`{ isAlias: true, targetVariableName: "..." }` aliasing an **array entry**
of an array state variable (e.g. `xs`, `rhss`, `currentResponses`,
`feedbacks`, `selectedValues`). The schema generator's alias-resolution path
constructs an `arrayEntryDescription` from the parent array's metadata and
does not propagate the parent's `description` field into it, so adding text
to the parent array's `description` doesn't reach the alias.

To fix these, the schema generator (`packages/static-assets/scripts/get-schema.ts`,
around the `aliasTargetName.substring(0, prefix.length) === prefix` branch)
should copy `arrayStateVarDescription.description` (or a per-entry description
if one is added) into the synthesized `arrayEntryDescription` before passing
it to `propFromDescription`. Once that change lands, just adding `description`
to the parent array state variables (or per-entry descriptors) will pick up
correctly for these aliases.

## Properties (alias to array entry)

| Property | Component(s) | Aliases to |
|---|---|---|
| `x`, `y`, `z` | 36 components each (point, vector, endpoint, …) | `x1`, `x2`, `x3` array entries of `xs` |
| `variable` | 6 function-family components | `variables1` array entry of `variables` |
| `f` | `equilibriumCurve`, `curve` | `f1` array entry of `fs` |
| `rhs`, `righthandside` | `odeSystem` | `rhs1` array entry of `rhss` |
| `initialCondition` | `odeSystem` | `initialCondition1` array entry of `initialConditions` |
| `numericalSolution` | `odeSystem` | `numericalSolution1` array entry |
| `currentResponse` | `answer` | `currentResponse1` array entry of `currentResponses` |
| `submittedResponse` | `answer` | `submittedResponse1` array entry of `submittedResponses` |
| `feedback` | `award` | `feedback1` array entry of `feedbacks` |
| `selectedIndex` | `choiceInput` | `selectedIndex1` array entry of `selectedIndices` |
| `selectedValue` | `choiceInput` | `selectedValue1` array entry of `selectedValues` |

## Suggested follow-up

1. Update `singlePropFromDescription`/`propFromDescription` (or the array-entry
   alias branch in `getSchema`) so the synthesized array-entry property
   inherits the parent array's description (and/or look up a sibling
   `<entryName>Description` field on the array state variable).
2. Once the generator change is in, add `description` text to the parent
   array state variables (`xs`, `variables`, `fs`, `rhss`, `initialConditions`,
   `currentResponses`, `submittedResponses`, `feedbacks`, `selectedIndices`,
   `selectedValues`) so each alias picks up a meaningful description.

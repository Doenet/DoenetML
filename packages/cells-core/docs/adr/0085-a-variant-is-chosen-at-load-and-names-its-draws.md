# A variant is chosen at load and names its draws

Status: proposed 2026-11-25. The user put document variants in scope for
sweep 4. Builds on ADR 0009 (choices split by timing; variant naming was
out of scope there), ADR 0037 (a load-time choice reads constants) and ADR
0059 (a copy shares its referent's draw).

## Context

The current core gives a document a *variant*: a test or a page asks for
`requestedVariantIndex`, which `<variantControl>` (`numVariants`,
`variantNames`, `seeds`, `variantsToInclude`, `variantsToExclude`,
`uniqueVariants`) maps to an index, a name and a seed
(`document.sharedParameters`). Without `uniqueVariants="false"`, and where
every select, selection from a sequence, shuffle and shuffled choice input
can be counted from literal attributes, each variant index names a
distinct combination of their picks (`utils/variants.ts`, each type's
`determineNumberOfUniqueVariants` and `getUniqueVariant`, the
`enumerateCombinations` family of `@doenet/utils`). A `<problem>` or
`<section>` with a control has variants of its own; a document whose one
child is such a section takes the section's; an `<option
selectForVariants>` is picked for the variant it names.

The cells core had none of this: the adapter passed the requested index
as the document seed, so every draw changed with the index but nothing
named the variant, two indices could pick alike, and `<variantControl>`
was an unsupported tag.

## Decision

1. **The variants are worked out when compiled.** `compile/variants.rs`
   runs right after outlining, over outlining's elements and the source's
   literal attributes, as the current core runs over its serialized
   components. What a type is to the variants is said beside the types
   (`ComponentType::creates_variants`, a `VariantDecl`, ADR 0038): the
   document, a section, a select and its options, a selection from a
   sequence, a shuffle, a choice input, a group, a repeat or a
   conditional content, a sampler. The analysis gathers the variant
   components under the document, counts each one's unique variants by
   the current core's rules, and makes the document's (and each
   controlled section's) variant names, seeds and unique combinations
   (`determineVariantsForSection`, with `getNumVariants`'s single-section
   rule). It reads every `<variantControl>`'s attributes, so they are
   accepted; `<variantControl>` is a type that builds nothing and is not
   rendered.
2. **A load names a variant.** `LoadOptions::variant` (the wasm
   constructor's fifth argument) is the requested index, taken as the
   current core takes it: rounded, wrapped into the variants, 1 when not
   finite. The chosen variant (`ChosenVariant`: index, name, seed, every
   possible variant, the unique combination) is the session's, and its
   seed's text, hashed, is the document seed every draw starts from, so
   two variants with one seed draw alike and an edit elsewhere in the
   document does not move them. A load with no variant is a load at a raw
   seed, as before, which the viewer uses.
3. **A sampler the variant does not determine draws from the load.** A
   `<sampleRandomNumbers>`, `<samplePrimeNumbers>` or
   `<sampleMultivariateRandomNumber>` without `variantDeterminesSeed`
   draws from the load's own seed (the raw seed and the index as
   requested), as the current core draws such samples anew on each load;
   with it, from the variant's. The analysis reads the attribute, which
   decides only that and whether the variants can be counted.
4. **With unique variants, the variant names the picks.** The unique
   combination is resolved to a tree of picks (`Desired`, the current
   core's `desiredVariant`) at load, by the current core's algorithms
   ported exactly (`enumerateCombinations`,
   `enumerateSelectionCombinations`, `countOptions`, the select's walk
   over combinations, lexicographic permutations). Each build hands it
   down as it expands: a select picks the options it names and hands each
   pick's part to the picked option's components in the pick's scope; a
   selection's or a shuffle's draw is a **forced draw**, a number below 0
   naming the picks (`-(1 + the picks in base n)`), which `SequencePick`,
   `Draws` and `Shuffle` read in place of a draw in `[0, 1)`, only where
   the build's operands are as many as the analysis counted. The program
   and the check are unchanged: a draw is still a scope constant.
5. **A section with a control has a variant of its own.** Its index is the
   one the document's picks give it, else one drawn from what holds it,
   and its seed replaces the document's for every draw inside it. An
   option with `selectForVariants` is picked for the name of the variant
   it sits in: its section's, else the document's.
6. **The order of the unique combinations is the cells core's.** The
   current core shuffles the combinations with its own generator
   (`seedrandom.alea("0")`); the cells core shuffles with splitmix64 from
   a fixed seed, the same partial Fisher and Yates, so a document asking
   for more variants keeps the ones it had. Variant *k* of a document
   names a combination in each core, but not the same one, as every draw
   already differs between the cores (ADR 0037).

## Considered options

- **Keep the requested index as the seed.** Rejected: it names no
  variant, and indices collide.
- **Port the current core's generator** (`seedrandom`'s alea), for the
  combination order and every draw, so variant *k* shows what it shows in
  the current core. Not taken: a decision for the user (open question
  below).
- **Store the picks in the plan or as cells.** Rejected: a variant is a
  load's, the compile depends on the source alone (ADR 0015), and a forced
  draw keeps every instruction and the check as they are.

## Consequences

- The parity adapter loads each test document as its requested variant
  and reads `document.sharedParameters` from `Core.variant_json()` and
  `document.generatedVariantInfo` from `Core.generated_variant_json()`
  (`Document::generated_variant`), which reports the picks of a selection
  from a sequence of literal parameters and nothing else yet.
- Not done: a section's `sharedParameters` and `generatedVariantInfo` (the
  build keeps a section's variant only while it expands), and a select's
  or a shuffle's `generatedVariantInfo`; a select's `selectForVariants`
  errors (a name no option has); unique variants of a `type="math"`
  selection, of `<selectPrimeNumbers>` and of a conditional content's
  branches (counted as not countable, or as one when every component
  under it has one).
- Open question for the user: should variant *k* show in the cells core
  what it shows in the current core? That needs the current core's
  generator in Rust: at least for the order of unique combinations, where
  one test (`uniqueVariants.test.ts` "limit variants") asks that the first
  ten of 1296 combinations show more than four letters in each place,
  which the current core's order happens to give and this one's does not;
  and, for the same draws too, its draw order in every sampler.

## Migration

1. Done: `compile/variants.rs`, `<variantControl>`, `VariantDecl`,
   `LoadOptions::variant`, forced draws, `selectForVariants`, section
   seeds, the load's sampler seed; `tests/variants.rs`; the adapter's
   `sharedParameters` and `generatedVariantInfo`.

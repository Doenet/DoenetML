# A text answer types into an input it makes, and compares texts as the current core does

Status: proposed 2026-11-24. Follows ADR 0053 (text in the tick: an
operator reads strings, a join makes the one string a tick may make) and
ADR 0038 (what the core makes without a tag is a role). Records two
operators that read text, which the tag sweep of 2026-11-24 needed for
`<answer type="text">` and `<summaryStatistics>`.

## Context

The cells core planned a text answer only as `<answer type="text">` with
one `<textInput>` child and `<award>`s of literal text, compared by string
id: `" yes"` was not `"yes"`. The current core (`Answer.js`,
`utils/booleanLogic.js`) also:

- makes a `<textInput>` for a text answer that has none, as a math answer
  makes a `<mathInput>`;
- takes the answer's own content as what is correct (`<answer
  type="text">hello there</answer>`), literal text, references, or both
  (`$h there`, `$h $t`), and an award's `<text>` child as its content;
- infers a text answer from a lone `<text>` child (`<answer><text>hello
  there</text></answer>`);
- compares each text trimmed, with its first run of white space made one
  space (`trim().replace(/\s+/, " ")`, without the `g`: only the first
  run), lower-cased with `caseInsensitiveMatch`.

`<summaryStatistics>` summarizes its children's numbers; a `<text>` among
them is data when it reads as a number (`<text>88</text>`), missing data
otherwise.

## Decision

1. **An implicit text input is a role.** `Role::ImplicitTextInput`, played
   by `<textInput>`: outlining adds one, first among the answer's
   children, to a text answer with no input child, as it adds the
   `Role::ImplicitInput` `<mathInput>` to a math answer; the answer's
   planner plans it (an unbound input holding the empty text).
2. **A text answer is `type="text"`, or one `<text>` child and nothing
   else** (`SourceReader::answer_text_child`); the `<text>` child's content
   is then the answer's. An `<award>`'s `<text>` child is its content, for a
   text answer; a math answer's award refuses one rather than compare it as
   math.
3. **Texts compare in the tick, reading the strings.**
   `SymKind::TextEquals { case_insensitive }` reads two string ids and
   compares them as the current core does (`program::texts::answer_text`).
   It makes no string, so it is within ADR 0053's first rule (an operator
   may read the strings). A text award compares with it too, so the
   current core's white space rule holds for awards as for the answer's
   content.
4. **Text and references together are a concatenation, a join.** The
   content `$h there` is `SymKind::JoinWith` with `Sep::Empty` over its
   pieces (a literal piece a given text, a reference what it names), the
   white space between them kept: the text-valued "concatenation" the
   user's amendment to ADR 0053 allows. A lone reference among white space
   is the reference.
5. **A text read as a number is an operator that reads text.**
   `SymKind::TextNumber`: the number a string writes, trimmed, else NaN,
   which `<summaryStatistics>` passes over as missing data. It makes no
   string.
6. **A statistic of a column passes over what is not a finite number.**
   `Reduction::Statistic(Statistic)`, one per statistic the current core
   reports, not strict in the missing value (a missing operand is missing
   data, as a NaN or an infinity is). The quartiles interpolate as
   math.js's `quantileSeq` does, the median halves the sum unless it
   overflows, the variance is two-pass. Which statistics a renderer shows
   is a mask, `statisticsShown`, from the literal `statisticsToDisplay`.
7. **A multivariate draw is a draw of several values over trailing
   parameters.** `<sampleMultivariateRandomNumber type="hypergeometric">`
   is `VecOp::Draws` of `Dist::MultivariateHypergeometric`: `numDraws`,
   then the categories' sizes where a sequence's excludes go, one value
   per category, drawn item by item from the draw's stream (ADR 0037,
   0059: constants, a copy shares the draw). Parameters that describe no
   population give no value, as in the current core; a type other than
   `hypergeometric`, or none, is refused rather than drawn as nothing.

## Consequences

- A typed text equals the expected one as the current core says: `"hello
  there"`, `" hello there "` and `"hello  there"` alike.
- The comparison reads strings at every tick its inputs change, as a sort
  of texts does; nothing new is interned.
- `matchPartial`, a `<textList>` in an answer or award, `<when>`s over
  texts beyond `=`, and a `<text>` mixed with other content in an answer
  remain refused.

## Migration

- *Done 2026-11-24:* the implicit text input, the inferred text answer,
  `TextEquals` (answers and awards), `caseInsensitiveMatch` on a text
  answer, content of text and references (`Sep::Empty`), `TextNumber`,
  `Reduction::Statistic` and `<summaryStatistics>`;
  `<sampleMultivariateRandomNumber>` with `numCategories`, `numTotal` and
  `numDraws`.
- *Open:* the multivariate sample's `means` and `variances`, two
  sequences of one value per category beside its list: a type declares
  one companion sequence today (ADR 0053), so this waits on a type
  declaring more than one.
- *Open:* `<summaryStatistics>` over a `<repeatForSequence>` child (a list
  of a dynamic count among a list's children), and a reference to one of
  its statistics carrying its display settings (`$s.mean` rounded as the
  table is).

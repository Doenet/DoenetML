# Kpelle diagnostics catalog: errors and warnings surfaced to the reader or
# author. Selected by `uiLocale`, not `documentLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for the family, the agreement finding, the
# `LOCALE_NAME_FALLBACKS` reasoning, and the pairing with `locales/lom`. This
# file is the largest in the batch and leans hardest on calque, since almost
# none of this register (attribute names, component names, parser and schema
# errors) exists in any published Kpelle text, or in the Loma text this seed
# otherwise leans on; within `locales/kpe` itself, this file most needs a
# speaker's review.
#
# DoenetML identifiers — tag names, attribute names, component names — are
# never translated, exactly as the English header requires.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } n'a jate-lɛ ni kɛlɛ feere lɔni
       *[other] { $attributes } n'a jate-lɛ ni kɛlɛ feere lɔni
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } n'a jate-lɛ ni kɛlɛ nda tɛgɛma-kɛlɛ lɔni fɔlɔ
       *[other] { $attributes } n'a jate-lɛ ni kɛlɛ nda tɛgɛma-kɛlɛ lɔni fɔlɔ
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset ma nɔɔ si yen gaa ni tɛgɛma-kɛlɛ si yen gaa

## `<line>`

line-points-undetermined-dimensions = Tan kɛlɛ-ŋa ma lɔn se gaa kwaa lɔn se gaa.

line-points-too-few-dimensions = Tan ka kɛ kɛlɛ-ŋa la minnu ka kwaa feere wa lɔn.

line-points-depend-on-variables = Tan ka kɛ kɛlɛ-ŋa la minnu bɛ falen-fɛn-ŋa ma lɔn: { $variables }.

line-equation-invalid-format = Tan-sɛbɛ-kwaa sɔsɔi falen-fɛn { $variable1 } nda { $variable2 } ma.

## `<ray>`

ray-overprescribed-through = Tan-bin lɔni kɛlɛ, kɛlɛ-kɔmɔ nda sila-kwaa ma. Kɛlɛ lɔni n'a jate-lɛ.

ray-dimension-mismatch = numDimensions ma bɛnna gaa tan-bin nda.

## `<vector>`

vector-overprescribed-head = Tan-kwaa lɔni a kunfɔlɔ, a kɔfɛ nda a lamaga-kwaa ma. A kunfɔlɔ lɔni n'a jate-lɛ.

vector-dimension-mismatch = numDimensions ma bɛnna gaa tan-kwaa nda.

## Attracting and constraining

attract-to-without-nearest-point = A se gaa ka bɛn `<{ $component }>` ma, kanko nearestPoint kwaa si yen gaa a ma.

constrain-to-without-nearest-point = A se gaa ka lɔn `<{ $component }>` ma, kanko nearestPoint kwaa si yen gaa a ma.

constrain-to-interior-without-nearest-point = A se gaa ka lɔn `<{ $component }>` kɔnɔ ma, kanko nearestPoint kwaa si yen gaa a ma.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition n'a jate-lɛ ni choiceInput kɛ inline kwaa ti.

## Ordering children by index

choice-input-indices-count-mismatch = Indices lɔni-ŋa n'a jate-lɛ choiceInput ma, kanko indices jate ma bɛn sugandi-denw jate ma.

pretzel-indices-count-mismatch = Indices lɔni-ŋa n'a jate-lɛ ɲininka ma, kanko indices jate ma bɛn ɲininka-denw jate ma.

shuffle-indices-count-mismatch = Indices lɔni-ŋa n'a jate-lɛ shuffle ma, kanko indices jate ma bɛn fan-denw jate ma.

indices-ignored-out-of-range = Indices lɔni-ŋa n'a jate-lɛ { $component } ma, kanko indices dɔ-ŋa bɔli kwaa-tila ye.

pretzel-indices-repeated = Indices lɔni-ŋa n'a jate-lɛ ɲininka ma, kanko indices dɔ-ŋa segin-segin.

pretzel-circuit-first-index = Indices lɔni-ŋa n'a jate-lɛ ɲininka ma mode circuit nda, kanko index fɔlɔ ka kɛ 1 ti.

## `<shuffle>` and `<sort>`

string-children-need-type = Walasa `<{ $component }>` ka wale-i sɛbɛ-den-ŋa nda, type sugandi-kwaa ka lɔn.

invalid-type-defaulting-to-math = Type { $type } sɔsɔi { $component } ma. A ka kɛ math, text, number, wala boolean kwaa ti. A bɛ ta math kwaa la.

string-not-valid-component-to-arrange = Sɛbɛ "{ $value }" te fan lɔni ti { $component } ma. A n'a jate-lɛ.

## Types and variables

invalid-type-defaulting-to-number = Type { $type } sɔsɔi, a bɛ ta number kwaa la.

invalid-variable-value = Falen-fɛn kwaa sɔsɔi: `{ $value }`

## Variants

variant-index-must-be-number = Yɛlɛma-fan-index { $index } ka kɛ jate-kwaa ti

variant-index-must-be-integer = Yɛlɛma-fan-index { $index } ka kɛ jate-tɔɔ ti

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` n'a se-i gaa kwaa-jate lɔni-ŋa la. Gbagba-ŋa bɛ ta yɛlɛma-kwaa la.

side-by-side-absolute-margins = `<{ $component }>` n'a se-i gaa kwaa-jate lɔni-ŋa la. Kanda-ŋa bɛ ta yɛlɛma-kwaa la.

side-by-side-no-block-child = `<{ $component }>` sɔsɔi: a ka kɛ den tao la minnu ka kɛ block ti.

## `<label>`

label-for-ignored-on-graphical = `for` sugandi-kwaa n'a jate-lɛ `<label>` ja-kwaa la.

label-for-must-resolve-to-one = `for` sugandi-kwaa `<label>` la ka lɔn fan tao ma.

label-for-unresolved = `for` sugandi-kwaa `<label>` la se gaa ka lɔn fan kwaa ma.

label-for-answer-with-authored-inputs = `for` sugandi-kwaa `<label>` la ye lasigi-fan `<answer>` ma min sugandi-ŋa sɛbɛlen. Sugandi-kwaa lasigi kelenkelen.

label-for-answer-without-input = `for` sugandi-kwaa `<label>` la ye lasigi-fan `<answer>` ma min sugandi si yen gaa.

label-for-must-reference-input-or-answer = `for` sugandi-kwaa `<label>` la ka lasigi sugandi-kwaa wala jaabi-kwaa ma.

## Accessibility

accessibility-short-description-or-decorative = Aksɛsibiliti ma, `<{ $component }>` ka kɛ jɛnjɛn-kunkun la wala a ka jira decorative kwaa ti.

accessibility-video-short-description = Aksɛsibiliti ma, `<video>` ka kɛ jɛnjɛn-kunkun la.

accessibility-input-short-description-or-label = Aksɛsibiliti ma, `<{ $component }>` ka kɛ jɛnjɛn-kunkun wala tɔgɔ-kwaa la.

accessibility-answer-input-short-description-or-label = Aksɛsibiliti ma, sugandi-kwaa min `<answer>` ye a da, a ka kɛ jɛnjɛn-kunkun wala tɔgɔ-kwaa la.

accessibility-short-description-contains-math = Jɛnjɛn-kunkun ka kɛ math-fan-ŋa ti minnu bɛ `<{ $component }>` ti. Math-kwaa bɛɛ sɛbɛ kuma-ŋa la.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ma se-i gaa yɔrɔ-baa tɔgɔ-sɛbɛ ma (dibi-nɔɔ) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a ka { $threshold }:1 wa sɔrɔ).
       *[other] { $colorName } ma se-i gaa yɔrɔ-baa tɔgɔ-sɛbɛ ma ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a ka { $threshold }:1 wa sɔrɔ).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` kɛlɛ { $count } kwaa ma se-i gaa halisa ni kɛlɛ-ŋa jate-kwaa si yen gaa.

circle-too-many-through-points = A se gaa ka kulundu jate kɛlɛ 3 tɛmɛni ma.

circle-overprescribed-radius-center-points = A se gaa ka kulundu jate ni kwaa-tɛgɛma, tɛgɛma-kɛlɛ nda kɛlɛ-ŋa lɔni bɛɛ ti.

circle-center-with-multiple-points = A se gaa ka kulundu jate ni tɛgɛma-kɛlɛ lɔni kɛlɛ tao tɛmɛni ti.

circle-radius-too-small = A se gaa ka kulundu jate: kɛlɛ feere kwaa-tila { $distance }, kwaa-tɛgɛma lɔni { $radius } dɔgɔ kojugu.

circle-radius-with-many-points = A se gaa ka kulundu da kɛlɛ feere tɛmɛni na ni kwaa-tɛgɛma lɔni ti.

circle-invalid-center-or-through-points = Kulundu tɛgɛma-kɛlɛ wala kɛlɛ-ŋa sɔsɔi.

circle-radius-center-with-multiple-points = A se gaa ka kulundu kwaa-tɛgɛma jate ni tɛgɛma-kɛlɛ lɔni kɛlɛ tao tɛmɛni ti.

circle-change-radius-non-numerical = A se gaa ka kulundu kwaa-tɛgɛma falɛ ni kɛlɛ-ŋa si jate-kwaa la gaa.

circle-radius-with-points-non-numerical = A se gaa ka kulundu da kɛlɛ tao tɛmɛni na ni kwaa-tɛgɛma lɔni ti ni jate-kwaa si yen gaa.

circle-change-center-non-numerical = A n'a se-i gaa kwaa ka kulundu tɛgɛma-kɛlɛ falɛ ni kɛlɛ-ŋa si jate-kwaa la gaa.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Kɛli ma kwaa-jate wa lɔn a ma nɔɔ ma. Nɔɔ-kwaa kɛ tila-yɔrɔ { $intervals } la, kɔni kɛli sugandi-kwaa { $inputs ->
            [one] { $inputs } kwaa
           *[other] { $inputs } kwaa-ŋa
        } wa.
       *[other] Kɛli ma kwaa-jate wa lɔn a ma nɔɔ ma. Nɔɔ-kwaa kɛ tila-yɔrɔ { $intervals } la, kɔni kɛli sugandi-kwaa { $inputs ->
            [one] { $inputs } kwaa
           *[other] { $inputs } kwaa-ŋa
        } wa.
    }

function-domain-invalid-format = Kɛli nɔɔ-kwaa kwaa-lɔn sɔsɔi.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Kɛli sanfɛ-tɛgɛma sɔsɔi n'a jate-lɛ.
        [minimum] Kɛli dugumafɛ-tɛgɛma sɔsɔi n'a jate-lɛ.
        [extremum] Kɛli lasi-tɛgɛma sɔsɔi n'a jate-lɛ.
        [point] Kɛli kɛlɛ sɔsɔi n'a jate-lɛ.
        [slope] Kɛli gbaali-kwaa sɔsɔi n'a jate-lɛ.
       *[other] Kɛli { $type } sɔsɔi n'a jate-lɛ.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Kɛli sanfɛ-tɛgɛma ɓoyi n'a jate-lɛ.
        [minimum] Kɛli dugumafɛ-tɛgɛma ɓoyi n'a jate-lɛ.
        [extremum] Kɛli lasi-tɛgɛma ɓoyi n'a jate-lɛ.
        [point] Kɛli kɛlɛ ɓoyi n'a jate-lɛ.
       *[other] Kɛli { $type } ɓoyi n'a jate-lɛ.
    }

function-points-too-close = Kɛli ye kɛlɛ feere la minnu yɔrɔ bɛnna kojugu. A se gaa ka kɛli lɔn.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Kɛli-segin-segin se-i dɔrɔn ni kɛli sugandi-kwaa jate bɛnna a bɔ-kwaa jate ma. Kɛli nin { $inputs } sugandi-kwaa wa nda { $outputs ->
            [one] { $outputs } bɔ-kwaa
           *[other] { $outputs } bɔ-kwaa-ŋa
        } wa.
       *[other] Kɛli-segin-segin se-i dɔrɔn ni kɛli sugandi-kwaa jate bɛnna a bɔ-kwaa jate ma. Kɛli nin { $inputs } sugandi-kwaa-ŋa wa nda { $outputs ->
            [one] { $outputs } bɔ-kwaa
           *[other] { $outputs } bɔ-kwaa-ŋa
        } wa.
    }

## `<sequence>`

sequence-invalid-length = Sɔɔlin waa-kwaa sɔsɔi. A ka kɛ jate-tɔɔ ti min si dɔgɔ gaa ɓoyi la.

sequence-invalid-step = Sɔɔlin sila-kwaa sɔsɔi. A ka kɛ jate-kwaa ti sɔɔlin nɔɔ { $type } ma.

sequence-invalid-endpoint-number = "{ $attribute }" sɔsɔi jate-sɔɔlin ma. A ka kɛ jate-kwaa ti.

sequence-invalid-endpoint-letters = "{ $attribute }" sɔsɔi sɛbɛ-mama-sɔɔlin ma. A ka kɛ sɛbɛ-mama-lajɛlen ti.

sequence-invalid-endpoint = "{ $attribute }" sɔsɔi sɔɔlin ma.

select-from-sequence-coprime-not-numbers = coprime n'a jate-lɛ, kanko jate-kwaa si sugandilen gaa

select-from-sequence-coprime-with-exclude-combinations = coprime n'a jate-lɛ, kanko excludeCombinations lɔni

## Resolving a `target`

target-not-found = target sɔsɔi `<{ $source }>` ma: a se gaa ka lɔn.

target-state-variable-not-found = target sɔsɔi `<{ $source }>` ma: falen-kwaa "{ $property }" tɔgɔ-kwaa se gaa ka lɔn `<{ $component }>` ma.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` falen-fɛn-ŋa ka kɛ kwaa ɲɔgɔn ti, ka gbansan falen-fɛn-kwaa ye.

ode-system-duplicate-variable-names = A se gaa ka ODE-kɛli-jaabi lɔn ni falen-fɛn tɔgɔ segin-segin ti.

ode-system-rhs-function-error = A se gaa ka ODE-kɛli-jaabi lɔn. Sɔsɔ-kwaa sɔrɔla mathjs kɛli da.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = A se gaa ka kolongboo-kwaa lɔn tan { $count } cɛ

angle-invalid-through-point = Kɛlɛ sɔsɔi `<angle>` kwaa-sila ma

parabola-vertex-too-many-points = A n'a se-i gaa kwaa ka parabola lɔn ni a kunfɔlɔ kɛlɛ tao tɛmɛni la.

parabola-too-many-points = A n'a se-i gaa kwaa ka parabola lɔn kɛlɛ 3 tɛmɛni na.

intersection-too-many-items = A n'a se-i gaa kwaa ka bɛn-yɔrɔ lɔn fɛn feere tɛmɛni ma.

## Other math components

ionic-compound-not-two-ions = A n'a se-i gaa kwaa ka yɛlɛma-fan lɔn ni fɛn gbɛtɛ ti feere kɔ.

ionic-compound-needs-cation-and-anion = Yɛlɛma-fan se-i dɔrɔn ni yɛlɛma-kwaa tao nda yɛlɛma-kwaa gbɛtɛ tao ti.

solve-equations-cannot-evaluate = A se gaa ka sɛbɛ-kwaa jaabi lɔn kanko a se gaa ka jate: { $equation }

math-operators-operand-number-required = operandNumber ka lɔn ni math-kwaa dɔ bɛ bɔ.

eigen-decomposition-failed = A se gaa ka matrix eigenvalue-ŋa jate.

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: sugandi-kwaa { $parameters } si yen gaa kwaa-nɔɔ la, a bɛ ɓoyi bɛn tuma bɛɛ.
       *[other] `<matchesPattern>`: sugandi-kwaa { $parameters } si yen gaa kwaa-nɔɔ la, a bɛ ɓoyi bɛn tuma bɛɛ.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: a se gaa ka grid="{ $grid }" faamu. A ka kɛ none, medium, dense, wala jate-kwaa feere lajɛlen ti tao ti, i n'a fɔ grid="1 0.5". Grid si sɛbɛ gaa.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" n'a se-i gaa prefigure jirala nda; kininfɛ-yɔrɔ-kwaa bɛ ta.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" n'a se-i gaa prefigure jirala nda; sanfɛ-yɔrɔ-kwaa bɛ ta.

prefigure-invalid-axis-bounds = `<graph>`: prefigure yɛlɛma kwaa-tila sɔsɔi; fɔlɔ-bbox bɛ ta (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: prefigure yɛlɛma gbagba-kwaa sɔsɔi; fɔlɔ-ja-gbagba 425 bɛ ta.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure yɛlɛma aspectRatio sɔsɔi; fɔlɔ-kwaa-tila 1 bɛ ta.

prefigure-grid-spacing-too-fine = `<graph>`: grid tila-yɔrɔ dɔgɔ kojugu kwaa-tila-ŋa ma; grid n'a jira-i prefigure jirala nda.

prefigure-annotations-not-rendered = `<graph>`: annotations si jira-i gaa ni PreFigure jirala si ta-i gaa.

multiple-annotations-children = `<annotations>` den caa sɔrɔla `<graph>` kɔnɔ; bɛɛ n'a jate-lɛ fo dɔ lasɔsɔlen.

## Referring to other components

copy-unrecognized-component-type = A se gaa ka fan kwaa-nɔɔ min si lɔn gaa lasegin wala kopi: { $type }.

copy-prop-not-found = Sugandi { $property } se gaa ka lɔn fan { $component } nɔɔ la min ma.

collect-no-source = collect ma bɔ-yɔrɔ si yen gaa.

collect-invalid-component-type = A se gaa ka `<{ $component }>` fan-ŋa lajɛ, kanko a te fan-nɔɔ lɔni ti.

reference-index-unavailable = A se gaa ka index `{ $reference }` lasigi

## `<callAction>`

component-action-unavailable = A se gaa ka { $action } woye-lɛ fan `{ $reference }` ma

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Kwaa-ŋa sɔsɔi kwaa-jɛnjɛn la. Laa-ŋa jate ma bɛn ɲɔgɔn ma. A sɔrɔla componentIdx :{ $componentIdx } la

data-frame-duplicate-column-names = Kwaa-ŋa ye kolo-tɔgɔ segin-segin. A sɔrɔla componentIdx :{ $componentIdx } la

data-frame-missing-column-name = Kwaa-ŋa kolo-tɔgɔ si yen gaa. A sɔrɔla componentIdx :{ $componentIdx } la

## `<answer>` and scoring

answer-award-depends-on-own-response = jaabi nin a kwaa-jaabi kɛlɛ nin `<answer>` ma cilen kwaa la, a bɛ falɛ min si lasi-lɛ gaa.

answer-max-num-attempts-in-section-wide-check-work = maxNumAttempts lɔnni `<answer>` ma kɛ min kɔnɔ nin sectionWideCheckWork wa, a nɔɔ si yen gaa, kanko kɛcogo jate lɔni kɔnɔ-kwaa bɛ ta. maxNumAttempts lɔn kɔnɔ-kwaa ma.

nested-section-wide-check-work-max-num-attempts = maxNumAttempts lɔnni kɔnɔ-kwaa ma min kɛ min gbɛtɛ kɔnɔ nin sectionWideCheckWork wa, a nɔɔ si yen gaa, kanko kɛcogo jate lɔni sanfɛ-kɔnɔ-kwaa bɛ ta. maxNumAttempts lɔn sanfɛ-kɔnɔ-kwaa ma.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] { $attributes } sugandi-kwaa nɔɔ si yen gaa ni symbolicEquality si lɔn gaa.
       *[other] { $attributes } sugandi-kwaa-ŋa nɔɔ si yen gaa ni symbolicEquality si lɔn gaa.
    }

answer-invalid-type = Jaabi type sɔsɔi: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` fan si tɔgɔ la gaa, a se gaa ka wale-i module sugandi-kwaa ti

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` se gaa ka wale-i module sugandi-kwaa ti, kanko `<module>` fan-nɔɔ ye "{ $name }" sugandi-kwaa lɔn kaban

conditional-content-condition-ignored = `condition` sugandi-kwaa n'a jate-lɛ `<conditionalContent>` fan la min ye case wala else den-ŋa wa.

slider-markers-type-mismatch = Markers type ma bɛn slider type ma.

pretzel-problem-needs-statement-and-answer = Ɲininka sɔsɔi: `<problem>` kwaa tao-tao ka kɛ `<statement>` tao nda `<answer>` tao la.

pretzel-circuit-first-problem-distractor = Ɲininka sɔsɔi: mode="circuit" nda, `<problem>` fɔlɔ te distractor kwaa ti.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Kwaa { $values } sɔsɔi sugandi-kwaa `{ $attribute }` ma; n'a jate-lɛ.
       *[other] Kwaa-ŋa { $values } sɔsɔi sugandi-kwaa `{ $attribute }` ma; n'a jate-lɛ.
    }

attribute-must-be-references = Kwaa `{ $value }` sɔsɔi sugandi-kwaa `{ $attribute }` ma. Sugandi-kwaa ka kɛ lasigi-fan-ŋa la minnu damina `$` ti.

math-input-invalid-function-names = <mathInput>: kɛli-tɔgɔ sɔsɔi n'a jate-lɛ { $attribute } nɔɔ: { $names }. Tɔgɔ kwaa bɛɛ ka kɛ sɛbɛ-mama feere fɔlɔ ti (sɛbɛ-mama wala tɛgɛli); a se-i `|<mathspeak yɛlɛma-kwaa>` la a kɔfɛ.

## Building components from the source

component-type-invalid = Fan-nɔɔ sɔsɔi: `<{ $componentType }>`

attribute-repeated = A se gaa ka sugandi-kwaa { $attribute } segin.

attribute-invalid-for-component = Sugandi-kwaa "{ $attribute }" sɔsɔi fan `<{ $componentType }>` ma.

## Style definition contrast

style-definition-insufficient-contrast =
    Kwaa-lɔn { $styleNumber } ma se-i gaa kwaa-kwaa-tila { $context ->
        [text-on-background] sɛbɛ-kolo nda kpogbo-kolo cɛ
        [high-contrast] kwaa-gbagba-kolo nda ja-yɔrɔ cɛ
        [line] tan-kolo nda ja-yɔrɔ cɛ
        [marker] taamaa-kolo nda ja-yɔrɔ cɛ
       *[text-on-canvas] sɛbɛ-kolo nda ja-yɔrɔ cɛ
    }{ $mode ->
        [dark] { " (dibi-nɔɔ)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a ka { $threshold }:1 wa sɔrɔ).

style-definition-dark-mode-text-background-contrast =
    Hali kwaa-lɔn { $styleNumber } ye kolo-ŋa lɔn minnu se-i kayei-nɔɔ ma, dibi-nɔɔ kolo-ŋa bɔli kwaa-ŋa la ma se-i gaa sɛbɛ-kolo nda kpogbo-kolo cɛ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a ka { $threshold }:1 wa sɔrɔ). { $suggestion ->
        [available] Walasa dibi-nɔɔ kwaa-tila ka se-i, i ka kayei-nɔɔ kwaa-tila lasɔ (i n'a fɔ { $lightAttribute }="{ $lightColor }" lɔn) wala i ka dibi-nɔɔ kolo falɛ (i n'a fɔ { $darkAttribute }="{ $darkColor }" lɔn).
       *[none] Walasa dibi-nɔɔ kwaa-tila ka se-i, i ka kayei-nɔɔ kwaa-tila lasɔ wala i ka kolo bɔli-ŋa falɛ ni textColorDarkMode nda/wala backgroundColorDarkMode ti.
    }

style-definition-dark-mode-text-canvas-contrast =
    Hali kwaa-lɔn { $styleNumber } ye sɛbɛ-kolo lɔn min se-i kayei-nɔɔ ma, dibi-nɔɔ sɛbɛ-kolo bɔli kwaa la ma se-i gaa ja-yɔrɔ ma ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a ka { $threshold }:1 wa sɔrɔ). { $suggestion ->
        [available] Walasa dibi-nɔɔ kwaa-tila ka se-i, i ka kayei-nɔɔ kwaa-tila lasɔ (i n'a fɔ textColor="{ $lightColor }" lɔn) wala i ka dibi-nɔɔ kolo falɛ (i n'a fɔ textColorDarkMode="{ $darkColor }" lɔn).
       *[none] Walasa dibi-nɔɔ kwaa-tila ka se-i, i ka kayei-nɔɔ kwaa-tila lasɔ wala i ka kolo bɔli falɛ ni textColorDarkMode ti.
    }

section-multiple-style-palettes = Yɔrɔ-baa se-i dɔrɔn ka <stylePalette> tao sugandi; a laban-kwaa bɛ ta.

## Unique variants

variant-num-to-select-not-non-negative-integer = a se gaa ka { $component } yɛlɛma-fan lɔni-ŋa lɔn kanko numToSelect te jate-tɔɔ ti min dɔgɔ gaa ɓoyi la.

variant-num-to-select-not-constant-number = a se gaa ka { $component } yɛlɛma-fan lɔni-ŋa lɔn kanko numToSelect te jate-kwaa ti min si falɛ gaa.

variant-with-replacement-not-constant-boolean = a se gaa ka { $component } yɛlɛma-fan lɔni-ŋa lɔn kanko withReplacement te boolean-kwaa ti min si falɛ gaa.

variant-select-weight-disables-unique = Yɛlɛma-fan lɔni-ŋa si se-i gaa select ma ni sugandi-kwaa dɔ ye selectWeight wala selectForVariants lɔn

variant-coprime-undetermined = a se gaa ka { $component } yɛlɛma-fan lɔni-ŋa lɔn kanko a se gaa ka lɔn coprime bɛ kɛ ɓoyi ti tuma bɛɛ.

variant-attribute-not-constant = a se gaa ka { $component } yɛlɛma-fan lɔni-ŋa lɔn kanko { $attribute } te kwaa ti min si falɛ gaa.

variant-attribute-not-number = a se gaa ka { $component } yɛlɛma-fan lɔni-ŋa lɔn kanko { $attribute } te jate-kwaa ti.

variant-attribute-wrong-type-for-sequence =
    a se gaa ka { $component } yɛlɛma-fan lɔni-ŋa lɔn sɔɔlin nɔɔ { $type } la kanko { $attribute } te { $expected ->
        [letters-combination] sɛbɛ-mama-lajɛlen ti
        [math-expression] math-kuma lɔni ti
        [integer] jate-tɔɔ ti
       *[number] jate-kwaa ti
    } gaa.

variant-length-not-integer = a se gaa ka { $component } yɛlɛma-fan lɔni-ŋa lɔn kanko waa-kwaa te jate-tɔɔ ti.

variant-sort-not-implemented = a n'a se-i gaa kwaa ka { $component } yɛlɛma-fan lɔni-ŋa lɔn ni sort ti

variant-exclude-combinations-not-implemented = a n'a se-i gaa kwaa ka { $component } yɛlɛma-fan lɔni-ŋa lɔn ni excludeCombinations ti

variant-math-exclude-not-implemented = a n'a se-i gaa kwaa ka { $component } yɛlɛma-fan lɔni-ŋa lɔn min type math ye ni exclude ti

variant-non-constant-exclude-not-implemented = a n'a se-i gaa kwaa ka { $component } yɛlɛma-fan lɔni-ŋa lɔn ni exclude ti min si falɛ gaa

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: a n'a se-i gaa graph prefigure jirala nda; den n'a jate-lɛ.

prefigure-descendant-invalid-geometry = { $subject }: kwaa-nɔɔ ɓoyi wala ma dafa; den n'a jate-lɛ.

prefigure-curve-label-omitted = { $subject }: tɔgɔ-ŋa n'a se-i gaa tan-gbaali fan-ŋa la minnu falenna; tɔgɔ n'a jate-lɛ.

prefigure-curve-unsupported-definition-type = { $subject }: tan-gbaali kɛli-fɔlɔ-kwaa nɔɔ '{ $definitionType }' n'a se-i gaa; den n'a jate-lɛ.

prefigure-region-flip-functions-unsupported = { $subject }: flipFunctions sugandi-kwaa n'a se-i gaa regionBetweenCurves la; den n'a jate-lɛ.

prefigure-region-non-formula-child = { $subject }: kɛli-den-ŋa dɔrɔn minnu type formula ye n'a se-i regionBetweenCurves la; den gbɛtɛ-ŋa n'a jate-lɛ.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' n'a se-i gaa { $labelKind ->
        [line-family] tan-kwaa tɔgɔ ma
       *[point] kɛlɛ tɔgɔ ma
    }; PreFigure fɔlɔ-lɔnni bɛ ta.

prefigure-fill-style-unsupported = { $subject }: fanla-kwaa '{ $fillStyle }' n'a se-i gaa PreFigure la; fanla-lɔni bɛ ta.

prefigure-line-style-unknown = { $subject }: tan-kwaa '{ $lineStyle }' si lɔn gaa; a n'a jate-lɛ PreFigure bɔ-kwaa la.

prefigure-marker-style-mapped-to-diamond = { $subject }: taamaa-kwaa '{ $markerStyle }' bɛ ta PreFigure 'diamond' kwaa la.

prefigure-marker-style-unsupported = { $subject }: taamaa-kwaa '{ $markerStyle }' n'a se-i gaa PreFigure la; kwaa-lɔni bɛ ta.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` sɔsɔi; a se gaa ka lɔn. Annotation n'a jate-lɛ.

annotation-ref-multiple-targets = `<annotation>`: `ref` lɔnna fɛn caa ma; fɔlɔ-kwaa bɛ ta.

annotation-ref-outside-graph = `<annotation>`: `ref` sɔsɔi; a kwaa-fan bɔli graph kɔnɔ. Annotation n'a jate-lɛ.

annotation-ref-unsupported-target = `<annotation>`: `ref` sɔsɔi; a kwaa-fan te fan lɔni ti prefigure kwaa-la. Annotation n'a jate-lɛ.

annotation-text-missing = `<annotation>`: `text` si yen gaa wala a ɓoyi; sɛbɛ-kwaa ɓoyi bɛ bɔ.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Fan-ŋa lɔni kwaa-kwaa ma sɔrɔla.
       *[other] Fan-ŋa lɔni kwaa-kwaa ma sɔrɔla `<{ $componentType }>` fan nda.
    }

reference-no-referent = Lasigi-fan si sɔrɔ gaa: `{ $reference }`

reference-multiple-referents = Lasigi-fan caa sɔrɔla: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Sugandi-kwaa { $attribute } nɔɔ sɔsɔi `<{ $componentType }>` ma.

children-invalid = Den-ŋa sɔsɔi `<{ $componentType }>` ma: den sɔsɔi-ŋa sɔrɔla: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Kwaa `{ $value }` sɔsɔi sugandi-kwaa `{ $attribute }` ma, kwaa `{ $default }` bɛ ta

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML yɛlɛma-fan { $version } si sɔrɔ gaa.
       *[other] DoenetML yɛlɛma-fan { $version } si sɔrɔ gaa. Yɛlɛma-fan { $fallback } bɛ ta
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML sɔsɔi: { $content }

parse-tag-missing-close-tag = DoenetML sɔsɔi: taamaa `{ $tag }` si tugu-taamaa la gaa. A ka kɛ taamaa kwaa-tugulen ti wala `</{ $tagName }>` ti.

parse-tag-error = DoenetML sɔsɔi: fele sɔrɔla taamaa `<{ $tagName }>` la

parse-attribute-missing-value = DoenetML sɔsɔi: sugandi-kwaa sɔsɔi `{ $attribute }` a kwaa si yen gaa.

parse-attribute-invalid = DoenetML sɔsɔi: sugandi-kwaa sɔsɔi `{ $attribute }`

parse-attribute-value-invalid = DoenetML sɔsɔi: kwaa sɔsɔi `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML sɔsɔi: kwaa sɔsɔi `{ $value }`. Sɛbɛ-taamaa-ŋa ma bɛn ɲɔgɔn ma. A bɛ ɓɔ i la `{ $quote }` kwaa

parse-open-tag-name-missing = DoenetML sɔsɔi: taamaa sɔrɔla min tɔgɔ si yen gaa, i n'a fɔ `<`

parse-tag-not-closed = DoenetML sɔsɔi: taamaa `{ $tag }` ma tugu-lɛ (`>` bɛ ɓɔ i la n'a fɔ).

parse-self-closing-tag-name-missing = DoenetML sɔsɔi: taamaa sɔrɔla min tɔgɔ si yen gaa `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML sɔsɔi: taamaa `{ $tag }` ma tugu-lɛ (`/>` bɛ ɓɔ i la n'a fɔ).

parse-tag-invalid-attributes = DoenetML sɔsɔi: taamaa `{ $tag }` te lɔni ti. A sugandi-ŋa si tɔɔ gaa.

parse-close-tag-name-missing = DoenetML sɔsɔi: tugu-taamaa sɔrɔla min tɔgɔ si yen gaa, i n'a fɔ `</`

parse-attribute-value-unquoted = Kwaa-ŋa ka kɛ sɛbɛ-taamaa kɔnɔ: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML sɔsɔi: tugu-taamaa sɔrɔla `{ $tag }`, kɔni wuli-taamaa kwaa-bɛn si yen gaa

parse-close-tag-mismatched = DoenetML sɔsɔi: tugu-taamaa ma bɛn ɲɔgɔn ma. `</{ $expected }>` kwaa bɛ da. `{ $found }` sɔrɔla

parser-node-unconvertible = Node { $node } se gaa ka falɛ Dast node ti.

## Names

name-attribute-invalid =
    Tɔgɔ-kwaa sɔsɔi name='{ $name }'. { $reason ->
        [characters] Tɔgɔ-ŋa ka kɛ sɛbɛ-mama-ŋa, jate-ŋa, kanda-taamaa wala tan-kunkun dɔrɔn la.
       *[start] Tɔgɔ-ŋa ka damina sɛbɛ-mama la.
    }

component-name-invalid-start = Fan-tɔgɔ sɔsɔi "{ $name }". Tɔgɔ-ŋa ka damina sɛbɛ-mama la.

## `<answer>` sugar

answer-video-watched-missing-video = Jaabi min type videoWatched ye, a ka video sugandi-kwaa la

answer-video-watched-video-not-reference = Jaabi min type videoWatched ye, a video sugandi-kwaa ka kɛ lasigi-fan ti

answer-name-not-single-text = Jaabi tɔgɔ sugandi-kwaa ka kɛ sɛbɛ-den tao la

## Referencing another document

external-doenetml-recursion-limit = A se gaa ka DoenetML bɔ kɛlɛ tɛmɛni la, kanko a segin-segin caa kojugu. Fan-ŋa bɛ ɲɔgɔn kwaa?

external-doenetml-unavailable = A se gaa ka DoenetML bɔ { $attribute }="{ $uri }" la

external-doenetml-type-mismatch = DoenetML bɔli sɔsɔi { $attribute }="{ $uri }" la: a ma bɛn fan-nɔɔ "{ $componentType }" ma

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Sugandi-kwaa `{ $from }` ma ta-i tuguni; `{ $to }` kwaa bɛ ta a nɔɔ la.
       *[other] [deprecation] Sugandi-kwaa `{ $from }` `<{ $component }>` la ma ta-i tuguni; `{ $to }` kwaa bɛ ta a nɔɔ la.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Sugandi-kwaa `{ $from }` ma ta-i tuguni, a n'a jate-lɛ kanko `{ $to }` lɔnna woye.
       *[other] [deprecation] Sugandi-kwaa `{ $from }` `<{ $component }>` la ma ta-i tuguni, a n'a jate-lɛ kanko `{ $to }` lɔnna woye.
    }

deprecated-attribute-ignored = [deprecation] Sugandi-kwaa `{ $attribute }` `<{ $component }>` la ma ta-i tuguni, a n'a jate-lɛ.

deprecated-attribute-to-child = [deprecation] Sugandi-kwaa `{ $attribute }` `<{ $component }>` la ma ta-i tuguni; `<{ $child }>` den kwaa bɛ ta a nɔɔ la.

deprecated-attribute-value-renamed = [deprecation] Kwaa `{ $value }` sugandi-kwaa `{ $attribute }` la `<{ $component }>` la ma ta-i tuguni; `{ $to }` kwaa bɛ ta a nɔɔ la.


## Language coverage

pluralize-english-only = `<pluralize>` se-i dɔrɔn Angilɛ-kuma la, a bɛ to kwaa-kwaa la sɛbɛ nin min sɛbɛlen { $locale } la. Sɛbɛ-mama caa-kwaa sɛbɛ kelenkelen, wala a lɔn ni `pluralForm` sugandi-kwaa ti.


## Checking against the schema

schema-element-unrecognized = Fan `<{ $tag }>` te Doenet fan lɔni ti.

schema-element-not-allowed-at-root = Fan `<{ $tag }>` n'a se-i gaa sɛbɛ kunfɔlɔ la.

schema-element-not-allowed-inside = Fan `<{ $tag }>` n'a se-i gaa `<{ $parent }>` kɔnɔ.

schema-attribute-unrecognized = Fan `<{ $tag }>` si sugandi-kwaa la gaa min tɔgɔ ye `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Sugandi-kwaa `{ $attribute }` fan `<{ $tag }>` la ka kɛ kwaa-lajɛlen ti min fɛn-ŋa bɛɛ kɛ nin tao ti: { $allowed }
       *[other] Sugandi-kwaa `{ $attribute }` fan `<{ $tag }>` la ka kɛ nin tao ti: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Yɛlɛma-fan tɔgɔ sɔsɔi select ma. Yɛlɛma-fan tɔgɔ { $variantName } sɔrɔla sugandi { $numOptions } la, kɔni jate lɔni sugandi-kwaa ye { $numToSelect }.

select-variant-name-without-options = Yɛlɛma-fan dɔ-ŋa lɔnna select ma, kɔni sugandi si yen gaa yɛlɛma-fan tɔgɔ { $variantName } ma.

select-variant-name-not-possible = Yɛlɛma-fan tɔgɔ { $variantName } lɔni select ma te yɛlɛma-fan tɔgɔ se-i ti.

select-too-few-options = A se gaa ka { $numToSelect } sugandi { $numOptions } dɔrɔn na.

select-from-sequence-too-few-values = A se gaa ka { $numToSelect } kwaa sɔɔlin { $length } waa la.

select-from-sequence-indices-count-mismatch = Indices jate lɔni select ma ka bɛn sugandi jate ma

select-from-sequence-indices-not-integers = Indices lɔni-ŋa select ma ka kɛ jate-tɔɔ ti bɛɛ

select-from-sequence-index-excluded = Selectfromsequence index lɔni min bɔli

select-from-sequence-indices-excluded-combination = Selectfromsequence indices lɔni-ŋa minnu bɔli kwaa-lajɛlen na

select-from-sequence-coprime-not-positive-integers = A se gaa ka coprime lajɛlen-ŋa sugandi, kanko jate-tɔɔ sanfɛ-ŋa si sugandilen gaa.

select-from-sequence-coprime-common-factor = A se gaa ka coprime jate-ŋa sugandi. Kwaa-ŋa bɛɛ ye jate tao lajɛlen la. (Kwaa lɔni-ŋa "from" wala "to" ma ka coprime kɛ "step" ye.)

select-from-sequence-coprime-single-number = A se gaa ka coprime lajɛlen-ŋa sugandi jate tao na min te 1 ti.

select-from-sequence-excluded-too-many-combinations = Lajɛlen-ŋa 70% tɛmɛni bɔli selectFromSequence la

select-from-sequence-coprime-none-found = A se gaa ka coprime jate-ŋa sugandi. Kwaa-ŋa bɛɛ ye jate tao lajɛlen la.

select-from-sequence-too-few-unique-values = A se gaa ka { $numToSelect } kwaa kwaa-tao sɔɔlin { $numPossibleValues } waa la sugandi

select-prime-numbers-too-few-values = A se gaa ka { $numToSelect } kwaa prime jate-lajɛlen { $numValues } waa la sugandi

select-prime-numbers-values-count-mismatch = Kwaa jate lɔni-ŋa select ma ka bɛn jate lɔni sugandi-kwaa ma

select-prime-numbers-values-not-prime = Kwaa lɔni-ŋa bɛɛ select prime jate ma ka kɛ prime jate-lajɛlen kɔnɔ

select-prime-numbers-values-excluded-combination = Kwaa lɔni-ŋa selectPrimeNumbers ma bɔli kwaa-lajɛlen la

select-prime-numbers-excluded-too-many-combinations = Lajɛlen-ŋa 70% tɛmɛni bɔli selectPrimeNumbers la

select-random-combination-fluke = Ni fɛn nyɛtaa kojugu bɛ, a se gaa ka kwaa-lajɛlen kolonkolon sugandi

select-random-value-fluke = Ni fɛn nyɛtaa kojugu bɛ, a se gaa ka kwaa kolonkolon sugandi

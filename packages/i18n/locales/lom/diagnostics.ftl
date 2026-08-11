# Loma diagnostics catalog: errors and warnings surfaced to the reader or
# author. Selected by `uiLocale`, not `documentLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for the family, the agreement finding, the
# `LOCALE_NAME_FALLBACKS` reasoning, and the pairing with `locales/kpe`. This
# file is the largest in the batch and leans hardest on calque, since almost
# none of this register (attribute names, component names, parser and schema
# errors) exists in any published Loma text; a speaker's review is worth the
# most here.
#
# DoenetML identifiers — tag names, attribute names, component names — are
# never translated, exactly as the English header requires.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } n'a jate-lɛ ni kɛlɛ fila lɔnlen
       *[other] { $attributes } n'a jate-lɛ ni kɛlɛ fila lɔnlen
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } n'a jate-lɛ ni kɛlɛ nun tɛgɛma-kɛlɛ lɔnlen fɔlɔ
       *[other] { $attributes } n'a jate-lɛ ni kɛlɛ nun tɛgɛma-kɛlɛ lɔnlen fɔlɔ
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset ma nɔɔ si yen gaa ni tɛgɛma-kɛlɛ si yen gaa

## `<line>`

line-points-undetermined-dimensions = Tan kɛlɛ-nu ma lɔn se gaa woo lɔn se gaa.

line-points-too-few-dimensions = Tan ka kɛ kɛlɛ-nu la minnu ka woo fila wa lɔn.

line-points-depend-on-variables = Tan ka kɛ kɛlɛ-nu la minnu bɛ falen-fɛn-nu ma lɔn: { $variables }.

line-equation-invalid-format = Tan-sɛbɛ-woo sɔsɔlen falen-fɛn { $variable1 } nun { $variable2 } ma.

## `<ray>`

ray-overprescribed-through = Tan-bin lɔnlen kɛlɛ, kɛlɛ-kɔmɔ nun sila-woo ma. Kɛlɛ lɔnlen n'a jate-lɛ.

ray-dimension-mismatch = numDimensions ma bɛnna gaa tan-bin nun.

## `<vector>`

vector-overprescribed-head = Tan-woo lɔnlen a kunfɔlɔ, a kɔfɛ nun a lamaga-woo ma. A kunfɔlɔ lɔnlen n'a jate-lɛ.

vector-dimension-mismatch = numDimensions ma bɛnna gaa tan-woo nun.

## Attracting and constraining

attract-to-without-nearest-point = A se gaa ka bɛn `<{ $component }>` ma, kanko nearestPoint woo si yen gaa a ma.

constrain-to-without-nearest-point = A se gaa ka lɔn `<{ $component }>` ma, kanko nearestPoint woo si yen gaa a ma.

constrain-to-interior-without-nearest-point = A se gaa ka lɔn `<{ $component }>` kɔnɔ ma, kanko nearestPoint woo si yen gaa a ma.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition n'a jate-lɛ ni choiceInput kɛ inline woo ti.

## Ordering children by index

choice-input-indices-count-mismatch = Indices lɔnlen-nu n'a jate-lɛ choiceInput ma, kanko indices jate ma bɛn sugandi-denw jate ma.

pretzel-indices-count-mismatch = Indices lɔnlen-nu n'a jate-lɛ ɲininka ma, kanko indices jate ma bɛn ɲininka-denw jate ma.

shuffle-indices-count-mismatch = Indices lɔnlen-nu n'a jate-lɛ shuffle ma, kanko indices jate ma bɛn fan-denw jate ma.

indices-ignored-out-of-range = Indices lɔnlen-nu n'a jate-lɛ { $component } ma, kanko indices dɔ-nu bɔlen woo-tila ye.

pretzel-indices-repeated = Indices lɔnlen-nu n'a jate-lɛ ɲininka ma, kanko indices dɔ-nu segin-segin.

pretzel-circuit-first-index = Indices lɔnlen-nu n'a jate-lɛ ɲininka ma mode circuit nun, kanko index fɔlɔ ka kɛ 1 ti.

## `<shuffle>` and `<sort>`

string-children-need-type = Walasa `<{ $component }>` ka wale-lɛ sɛbɛ-den-nu nun, type sugandi-woo ka lɔn.

invalid-type-defaulting-to-math = Type { $type } sɔsɔlen { $component } ma. A ka kɛ math, text, number, wala boolean woo ti. A bɛ ta math woo la.

string-not-valid-component-to-arrange = Sɛbɛ "{ $value }" te fan lɔnlen ti { $component } ma. A n'a jate-lɛ.

## Types and variables

invalid-type-defaulting-to-number = Type { $type } sɔsɔlen, a bɛ ta number woo la.

invalid-variable-value = Falen-fɛn woo sɔsɔlen: `{ $value }`

## Variants

variant-index-must-be-number = Yɛlɛma-fan-index { $index } ka kɛ jate-woo ti

variant-index-must-be-integer = Yɛlɛma-fan-index { $index } ka kɛ jate-mɛni ti

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` n'a se-lɛ gaa woo-jate lɔnlen-nu la. Gbagba-nu bɛ ta yɛlɛma-woo la.

side-by-side-absolute-margins = `<{ $component }>` n'a se-lɛ gaa woo-jate lɔnlen-nu la. Kanda-nu bɛ ta yɛlɛma-woo la.

side-by-side-no-block-child = `<{ $component }>` sɔsɔlen: a ka kɛ den kelen la minnu ka kɛ block ti.

## `<label>`

label-for-ignored-on-graphical = `for` sugandi-woo n'a jate-lɛ `<label>` ja-woo la.

label-for-must-resolve-to-one = `for` sugandi-woo `<label>` la ka lɔn fan kelen ma.

label-for-unresolved = `for` sugandi-woo `<label>` la se gaa ka lɔn fan woo ma.

label-for-answer-with-authored-inputs = `for` sugandi-woo `<label>` la ye lasigi-fan `<answer>` ma min sugandi-nu sɛbɛlen. Sugandi-woo lasigi kelenkelen.

label-for-answer-without-input = `for` sugandi-woo `<label>` la ye lasigi-fan `<answer>` ma min sugandi si yen gaa.

label-for-must-reference-input-or-answer = `for` sugandi-woo `<label>` la ka lasigi sugandi-woo wala jaabi-woo ma.

## Accessibility

accessibility-short-description-or-decorative = Sekokɔrɔ ma, `<{ $component }>` ka kɛ jɛnjɛn-kunkun la wala a ka jira decorative woo ti.

accessibility-video-short-description = Sekokɔrɔ ma, `<video>` ka kɛ jɛnjɛn-kunkun la.

accessibility-input-short-description-or-label = Sekokɔrɔ ma, `<{ $component }>` ka kɛ jɛnjɛn-kunkun wala tɔgɔ-woo la.

accessibility-answer-input-short-description-or-label = Sekokɔrɔ ma, sugandi-woo min `<answer>` ye a da, a ka kɛ jɛnjɛn-kunkun wala tɔgɔ-woo la.

accessibility-short-description-contains-math = Jɛnjɛn-kunkun ka kɛ math-fan-nu ti minnu bɛ `<{ $component }>` ti. Math-woo bɛɛ sɛbɛ kuma-nu la.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ma se-lɛ gaa yɔrɔ-baa tɔgɔ-sɛbɛ ma (dibi-nɔɔ) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a ka { $threshold }:1 wa sɔrɔ).
       *[other] { $colorName } ma se-lɛ gaa yɔrɔ-baa tɔgɔ-sɛbɛ ma ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a ka { $threshold }:1 wa sɔrɔ).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` kɛlɛ { $count } woo ma se-lɛ gaa halisa ni kɛlɛ-nu jate-woo si yen gaa.

circle-too-many-through-points = A se gaa ka kulundu jate kɛlɛ 3 tɛmɛnen ma.

circle-overprescribed-radius-center-points = A se gaa ka kulundu jate ni woo-tɛgɛma, tɛgɛma-kɛlɛ nun kɛlɛ-nu lɔnlen bɛɛ ti.

circle-center-with-multiple-points = A se gaa ka kulundu jate ni tɛgɛma-kɛlɛ lɔnlen kɛlɛ kelen tɛmɛnen ti.

circle-radius-too-small = A se gaa ka kulundu jate: kɛlɛ fila woo-tila { $distance }, woo-tɛgɛma lɔnlen { $radius } dɔgɔ kojugu.

circle-radius-with-many-points = A se gaa ka kulundu da kɛlɛ fila tɛmɛnen na ni woo-tɛgɛma lɔnlen ti.

circle-invalid-center-or-through-points = Kulundu tɛgɛma-kɛlɛ wala kɛlɛ-nu sɔsɔlen.

circle-radius-center-with-multiple-points = A se gaa ka kulundu woo-tɛgɛma jate ni tɛgɛma-kɛlɛ lɔnlen kɛlɛ kelen tɛmɛnen ti.

circle-change-radius-non-numerical = A se gaa ka kulundu woo-tɛgɛma falɛ ni kɛlɛ-nu si jate-woo la gaa.

circle-radius-with-points-non-numerical = A se gaa ka kulundu da kɛlɛ kelen tɛmɛnen na ni woo-tɛgɛma lɔnlen ti ni jate-woo si yen gaa.

circle-change-center-non-numerical = A n'a se-lɛ gaa woo ka kulundu tɛgɛma-kɛlɛ falɛ ni kɛlɛ-nu si jate-woo la gaa.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Kɛli ma woo-jate wa lɔn a ma nɔɔ ma. Nɔɔ-woo kɛ tila-yɔrɔ { $intervals } la, kɔni kɛli sugandi-woo { $inputs ->
            [one] { $inputs } woo
           *[other] { $inputs } woo-nu
        } wa.
       *[other] Kɛli ma woo-jate wa lɔn a ma nɔɔ ma. Nɔɔ-woo kɛ tila-yɔrɔ { $intervals } la, kɔni kɛli sugandi-woo { $inputs ->
            [one] { $inputs } woo
           *[other] { $inputs } woo-nu
        } wa.
    }

function-domain-invalid-format = Kɛli nɔɔ-woo woo-lɔn sɔsɔlen.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Kɛli sanfɛ-tɛgɛma sɔsɔlen n'a jate-lɛ.
        [minimum] Kɛli dugumafɛ-tɛgɛma sɔsɔlen n'a jate-lɛ.
        [extremum] Kɛli lasi-tɛgɛma sɔsɔlen n'a jate-lɛ.
        [point] Kɛli kɛlɛ sɔsɔlen n'a jate-lɛ.
        [slope] Kɛli gbaalen-woo sɔsɔlen n'a jate-lɛ.
       *[other] Kɛli { $type } sɔsɔlen n'a jate-lɛ.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Kɛli sanfɛ-tɛgɛma ɓoyi n'a jate-lɛ.
        [minimum] Kɛli dugumafɛ-tɛgɛma ɓoyi n'a jate-lɛ.
        [extremum] Kɛli lasi-tɛgɛma ɓoyi n'a jate-lɛ.
        [point] Kɛli kɛlɛ ɓoyi n'a jate-lɛ.
       *[other] Kɛli { $type } ɓoyi n'a jate-lɛ.
    }

function-points-too-close = Kɛli ye kɛlɛ fila la minnu yɔrɔ bɛnna kojugu. A se gaa ka kɛli lɔn.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Kɛli-segin-segin se-lɛ dɔrɔn ni kɛli sugandi-woo jate bɛnna a bɔ-woo jate ma. Kɛli nin { $inputs } sugandi-woo wa nun { $outputs ->
            [one] { $outputs } bɔ-woo
           *[other] { $outputs } bɔ-woo-nu
        } wa.
       *[other] Kɛli-segin-segin se-lɛ dɔrɔn ni kɛli sugandi-woo jate bɛnna a bɔ-woo jate ma. Kɛli nin { $inputs } sugandi-woo-nu wa nun { $outputs ->
            [one] { $outputs } bɔ-woo
           *[other] { $outputs } bɔ-woo-nu
        } wa.
    }

## `<sequence>`

sequence-invalid-length = Sɔɔlin waa-woo sɔsɔlen. A ka kɛ jate-mɛni ti min si dɔgɔ gaa ɓoyi la.

sequence-invalid-step = Sɔɔlin sila-woo sɔsɔlen. A ka kɛ jate-woo ti sɔɔlin nɔɔ { $type } ma.

sequence-invalid-endpoint-number = "{ $attribute }" sɔsɔlen jate-sɔɔlin ma. A ka kɛ jate-woo ti.

sequence-invalid-endpoint-letters = "{ $attribute }" sɔsɔlen sɛbɛ-mama-sɔɔlin ma. A ka kɛ sɛbɛ-mama-lajɛlen ti.

sequence-invalid-endpoint = "{ $attribute }" sɔsɔlen sɔɔlin ma.

select-from-sequence-coprime-not-numbers = coprime n'a jate-lɛ, kanko jate-woo si sugandilen gaa

select-from-sequence-coprime-with-exclude-combinations = coprime n'a jate-lɛ, kanko excludeCombinations lɔnlen

## Resolving a `target`

target-not-found = target sɔsɔlen `<{ $source }>` ma: a se gaa ka lɔn.

target-state-variable-not-found = target sɔsɔlen `<{ $source }>` ma: falen-woo "{ $property }" tɔgɔ-woo se gaa ka lɔn `<{ $component }>` ma.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` falen-fɛn-nu ka kɛ woo ɲɔgɔn ti, ka gbansan falen-fɛn-woo ye.

ode-system-duplicate-variable-names = A se gaa ka ODE-kɛli-jaabi lɔn ni falen-fɛn tɔgɔ segin-segin ti.

ode-system-rhs-function-error = A se gaa ka ODE-kɛli-jaabi lɔn. Sɔsɔ-woo sɔrɔla mathjs kɛli da.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = A se gaa ka kolongboo-woo lɔn tan { $count } cɛ

angle-invalid-through-point = Kɛlɛ sɔsɔlen `<angle>` woo-sila ma

parabola-vertex-too-many-points = A n'a se-lɛ gaa woo ka parabola lɔn ni a kunfɔlɔ kɛlɛ kelen tɛmɛnen la.

parabola-too-many-points = A n'a se-lɛ gaa woo ka parabola lɔn kɛlɛ 3 tɛmɛnen na.

intersection-too-many-items = A n'a se-lɛ gaa woo ka bɛn-yɔrɔ lɔn fɛn fila tɛmɛnen ma.

## Other math components

ionic-compound-not-two-ions = A n'a se-lɛ gaa woo ka yɛlɛma-fan lɔn ni fɛn gbɛtɛ ti fila kɔ.

ionic-compound-needs-cation-and-anion = Yɛlɛma-fan se-lɛ dɔrɔn ni yɛlɛma-woo kelen nun yɛlɛma-woo gbɛtɛ kelen ti.

solve-equations-cannot-evaluate = A se gaa ka sɛbɛ-woo jaabi lɔn kanko a se gaa ka jate: { $equation }

math-operators-operand-number-required = operandNumber ka lɔn ni math-woo dɔ bɛ bɔ.

eigen-decomposition-failed = A se gaa ka matrix eigenvalue-nu jate.

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: sugandi-woo { $parameters } si yen gaa woo-nɔɔ la, a bɛ ɓoyi bɛn tuma bɛɛ.
       *[other] `<matchesPattern>`: sugandi-woo { $parameters } si yen gaa woo-nɔɔ la, a bɛ ɓoyi bɛn tuma bɛɛ.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: a se gaa ka grid="{ $grid }" faamu. A ka kɛ none, medium, dense, wala jate-woo fila lajɛlen ti kelen ti, i n'a fɔ grid="1 0.5". Grid si sɛbɛ gaa.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" n'a se-lɛ gaa prefigure jirala nun; kininfɛ-yɔrɔ-woo bɛ ta.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" n'a se-lɛ gaa prefigure jirala nun; sanfɛ-yɔrɔ-woo bɛ ta.

prefigure-invalid-axis-bounds = `<graph>`: prefigure yɛlɛma woo-tila sɔsɔlen; fɔlɔ-bbox bɛ ta (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: prefigure yɛlɛma gbagba-woo sɔsɔlen; fɔlɔ-ja-gbagba 425 bɛ ta.

prefigure-invalid-aspect-ratio = `<graph>`: prefigure yɛlɛma aspectRatio sɔsɔlen; fɔlɔ-woo-tila 1 bɛ ta.

prefigure-grid-spacing-too-fine = `<graph>`: grid tila-yɔrɔ dɔgɔ kojugu woo-tila-nu ma; grid n'a jira-lɛ prefigure jirala nun.

prefigure-annotations-not-rendered = `<graph>`: annotations si jira-lɛ gaa ni PreFigure jirala si ta-lɛ gaa.

multiple-annotations-children = `<annotations>` den caa sɔrɔla `<graph>` kɔnɔ; bɛɛ n'a jate-lɛ fo dɔ lasɔsɔlen.

## Referring to other components

copy-unrecognized-component-type = A se gaa ka fan woo-nɔɔ min si lɔn gaa lasegin wala kopi: { $type }.

copy-prop-not-found = Sugandi { $property } se gaa ka lɔn fan { $component } nɔɔ la min ma.

collect-no-source = collect ma bɔ-yɔrɔ si yen gaa.

collect-invalid-component-type = A se gaa ka `<{ $component }>` fan-nu lajɛ, kanko a te fan-nɔɔ lɔnlen ti.

reference-index-unavailable = A se gaa ka index `{ $reference }` lasigi

## `<callAction>`

component-action-unavailable = A se gaa ka { $action } woye-lɛ fan `{ $reference }` ma

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Woo-nu sɔsɔlen woo-jɛnjɛn la. Laa-nu jate ma bɛn ɲɔgɔn ma. A sɔrɔla componentIdx :{ $componentIdx } la

data-frame-duplicate-column-names = Woo-nu ye kolo-tɔgɔ segin-segin. A sɔrɔla componentIdx :{ $componentIdx } la

data-frame-missing-column-name = Woo-nu kolo-tɔgɔ si yen gaa. A sɔrɔla componentIdx :{ $componentIdx } la

## `<answer>` and scoring

answer-award-depends-on-own-response = jaabi nin a woo-jaabi kɛlɛ nin `<answer>` ma cilen woo la, a bɛ falɛ min si lasi-lɛ gaa.

answer-max-num-attempts-in-section-wide-check-work = maxNumAttempts lɔnni `<answer>` ma kɛ min kɔnɔ nin sectionWideCheckWork wa, a nɔɔ si yen gaa, kanko kɛcogo jate lɔnlen kɔnɔ-woo bɛ ta. maxNumAttempts lɔn kɔnɔ-woo ma.

nested-section-wide-check-work-max-num-attempts = maxNumAttempts lɔnni kɔnɔ-woo ma min kɛ min gbɛtɛ kɔnɔ nin sectionWideCheckWork wa, a nɔɔ si yen gaa, kanko kɛcogo jate lɔnlen sanfɛ-kɔnɔ-woo bɛ ta. maxNumAttempts lɔn sanfɛ-kɔnɔ-woo ma.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] { $attributes } sugandi-woo nɔɔ si yen gaa ni symbolicEquality si lɔn gaa.
       *[other] { $attributes } sugandi-woo-nu nɔɔ si yen gaa ni symbolicEquality si lɔn gaa.
    }

answer-invalid-type = Jaabi type sɔsɔlen: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` fan si tɔgɔ la gaa, a se gaa ka wale-lɛ module sugandi-woo ti

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` se gaa ka wale-lɛ module sugandi-woo ti, kanko `<module>` fan-nɔɔ ye "{ $name }" sugandi-woo lɔn kaban

conditional-content-condition-ignored = `condition` sugandi-woo n'a jate-lɛ `<conditionalContent>` fan la min ye case wala else den-nu wa.

slider-markers-type-mismatch = Markers type ma bɛn slider type ma.

pretzel-problem-needs-statement-and-answer = Ɲininka sɔsɔlen: `<problem>` woo kelen-kelen ka kɛ `<statement>` kelen nun `<answer>` kelen la.

pretzel-circuit-first-problem-distractor = Ɲininka sɔsɔlen: mode="circuit" nun, `<problem>` fɔlɔ te distractor woo ti.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Woo { $values } sɔsɔlen sugandi-woo `{ $attribute }` ma; n'a jate-lɛ.
       *[other] Woo-nu { $values } sɔsɔlen sugandi-woo `{ $attribute }` ma; n'a jate-lɛ.
    }

attribute-must-be-references = Woo `{ $value }` sɔsɔlen sugandi-woo `{ $attribute }` ma. Sugandi-woo ka kɛ lasigi-fan-nu la minnu damina `$` ti.

math-input-invalid-function-names = <mathInput>: kɛli-tɔgɔ sɔsɔlen n'a jate-lɛ { $attribute } nɔɔ: { $names }. Tɔgɔ woo bɛɛ ka kɛ sɛbɛ-mama fila fɔlɔ ti (sɛbɛ-mama wala tɛgɛlen); a se-lɛ `|<mathspeak yɛlɛma-woo>` la a kɔfɛ.

## Building components from the source

component-type-invalid = Fan-nɔɔ sɔsɔlen: `<{ $componentType }>`

attribute-repeated = A se gaa ka sugandi-woo { $attribute } segin.

attribute-invalid-for-component = Sugandi-woo "{ $attribute }" sɔsɔlen fan `<{ $componentType }>` ma.

## Style definition contrast

style-definition-insufficient-contrast =
    Woo-lɔn { $styleNumber } ma se-lɛ gaa woo-woo-tila { $context ->
        [text-on-background] sɛbɛ-kolo nun kpogbo-kolo cɛ
        [high-contrast] woo-gbagba-kolo nun ja-yɔrɔ cɛ
        [line] tan-kolo nun ja-yɔrɔ cɛ
        [marker] taamaa-kolo nun ja-yɔrɔ cɛ
       *[text-on-canvas] sɛbɛ-kolo nun ja-yɔrɔ cɛ
    }{ $mode ->
        [dark] { " (dibi-nɔɔ)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a ka { $threshold }:1 wa sɔrɔ).

style-definition-dark-mode-text-background-contrast =
    Hali woo-lɔn { $styleNumber } ye kolo-nu lɔn minnu se-lɛ kayei-nɔɔ ma, dibi-nɔɔ kolo-nu bɔlen woo-nu la ma se-lɛ gaa sɛbɛ-kolo nun kpogbo-kolo cɛ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a ka { $threshold }:1 wa sɔrɔ). { $suggestion ->
        [available] Walasa dibi-nɔɔ woo-tila ka se-lɛ, i ka kayei-nɔɔ woo-tila lasɔ (i n'a fɔ { $lightAttribute }="{ $lightColor }" lɔn) wala i ka dibi-nɔɔ kolo falɛ (i n'a fɔ { $darkAttribute }="{ $darkColor }" lɔn).
       *[none] Walasa dibi-nɔɔ woo-tila ka se-lɛ, i ka kayei-nɔɔ woo-tila lasɔ wala i ka kolo bɔlen-nu falɛ ni textColorDarkMode nun/wala backgroundColorDarkMode ti.
    }

style-definition-dark-mode-text-canvas-contrast =
    Hali woo-lɔn { $styleNumber } ye sɛbɛ-kolo lɔn min se-lɛ kayei-nɔɔ ma, dibi-nɔɔ sɛbɛ-kolo bɔlen woo la ma se-lɛ gaa ja-yɔrɔ ma ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a ka { $threshold }:1 wa sɔrɔ). { $suggestion ->
        [available] Walasa dibi-nɔɔ woo-tila ka se-lɛ, i ka kayei-nɔɔ woo-tila lasɔ (i n'a fɔ textColor="{ $lightColor }" lɔn) wala i ka dibi-nɔɔ kolo falɛ (i n'a fɔ textColorDarkMode="{ $darkColor }" lɔn).
       *[none] Walasa dibi-nɔɔ woo-tila ka se-lɛ, i ka kayei-nɔɔ woo-tila lasɔ wala i ka kolo bɔlen falɛ ni textColorDarkMode ti.
    }

section-multiple-style-palettes = Yɔrɔ-baa se-lɛ dɔrɔn ka <stylePalette> kelen sugandi; a laban-woo bɛ ta.

## Unique variants

variant-num-to-select-not-non-negative-integer = a se gaa ka { $component } yɛlɛma-fan lɔnlen-nu lɔn kanko numToSelect te jate-mɛni ti min dɔgɔ gaa ɓoyi la.

variant-num-to-select-not-constant-number = a se gaa ka { $component } yɛlɛma-fan lɔnlen-nu lɔn kanko numToSelect te jate-woo ti min si falɛ gaa.

variant-with-replacement-not-constant-boolean = a se gaa ka { $component } yɛlɛma-fan lɔnlen-nu lɔn kanko withReplacement te boolean-woo ti min si falɛ gaa.

variant-select-weight-disables-unique = Yɛlɛma-fan lɔnlen-nu si se-lɛ gaa select ma ni sugandi-woo dɔ ye selectWeight wala selectForVariants lɔn

variant-coprime-undetermined = a se gaa ka { $component } yɛlɛma-fan lɔnlen-nu lɔn kanko a se gaa ka lɔn coprime bɛ kɛ ɓoyi ti tuma bɛɛ.

variant-attribute-not-constant = a se gaa ka { $component } yɛlɛma-fan lɔnlen-nu lɔn kanko { $attribute } te woo ti min si falɛ gaa.

variant-attribute-not-number = a se gaa ka { $component } yɛlɛma-fan lɔnlen-nu lɔn kanko { $attribute } te jate-woo ti.

variant-attribute-wrong-type-for-sequence =
    a se gaa ka { $component } yɛlɛma-fan lɔnlen-nu lɔn sɔɔlin nɔɔ { $type } la kanko { $attribute } te { $expected ->
        [letters-combination] sɛbɛ-mama-lajɛlen ti
        [math-expression] math-kuma lɔnlen ti
        [integer] jate-mɛni ti
       *[number] jate-woo ti
    } gaa.

variant-length-not-integer = a se gaa ka { $component } yɛlɛma-fan lɔnlen-nu lɔn kanko waa-woo te jate-mɛni ti.

variant-sort-not-implemented = a n'a se-lɛ gaa woo ka { $component } yɛlɛma-fan lɔnlen-nu lɔn ni sort ti

variant-exclude-combinations-not-implemented = a n'a se-lɛ gaa woo ka { $component } yɛlɛma-fan lɔnlen-nu lɔn ni excludeCombinations ti

variant-math-exclude-not-implemented = a n'a se-lɛ gaa woo ka { $component } yɛlɛma-fan lɔnlen-nu lɔn min type math ye ni exclude ti

variant-non-constant-exclude-not-implemented = a n'a se-lɛ gaa woo ka { $component } yɛlɛma-fan lɔnlen-nu lɔn ni exclude ti min si falɛ gaa

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: a n'a se-lɛ gaa graph prefigure jirala nun; den n'a jate-lɛ.

prefigure-descendant-invalid-geometry = { $subject }: woo-nɔɔ ɓoyi wala ma dafa; den n'a jate-lɛ.

prefigure-curve-label-omitted = { $subject }: tɔgɔ-nu n'a se-lɛ gaa tan-gbaalen fan-nu la minnu falenna; tɔgɔ n'a jate-lɛ.

prefigure-curve-unsupported-definition-type = { $subject }: tan-gbaalen kɛli-fɔlɔ-woo nɔɔ '{ $definitionType }' n'a se-lɛ gaa; den n'a jate-lɛ.

prefigure-region-flip-functions-unsupported = { $subject }: flipFunctions sugandi-woo n'a se-lɛ gaa regionBetweenCurves la; den n'a jate-lɛ.

prefigure-region-non-formula-child = { $subject }: kɛli-den-nu dɔrɔn minnu type formula ye n'a se-lɛ regionBetweenCurves la; den gbɛtɛ-nu n'a jate-lɛ.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' n'a se-lɛ gaa { $labelKind ->
        [line-family] tan-woo tɔgɔ ma
       *[point] kɛlɛ tɔgɔ ma
    }; PreFigure fɔlɔ-lɔnni bɛ ta.

prefigure-fill-style-unsupported = { $subject }: fanla-woo '{ $fillStyle }' n'a se-lɛ gaa PreFigure la; fanla-lɔnlen bɛ ta.

prefigure-line-style-unknown = { $subject }: tan-woo '{ $lineStyle }' si lɔn gaa; a n'a jate-lɛ PreFigure bɔ-woo la.

prefigure-marker-style-mapped-to-diamond = { $subject }: taamaa-woo '{ $markerStyle }' bɛ ta PreFigure 'diamond' woo la.

prefigure-marker-style-unsupported = { $subject }: taamaa-woo '{ $markerStyle }' n'a se-lɛ gaa PreFigure la; woo-lɔnlen bɛ ta.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` sɔsɔlen; a se gaa ka lɔn. Annotation n'a jate-lɛ.

annotation-ref-multiple-targets = `<annotation>`: `ref` lɔnna fɛn caa ma; fɔlɔ-woo bɛ ta.

annotation-ref-outside-graph = `<annotation>`: `ref` sɔsɔlen; a woo-fan bɔlen graph kɔnɔ. Annotation n'a jate-lɛ.

annotation-ref-unsupported-target = `<annotation>`: `ref` sɔsɔlen; a woo-fan te fan lɔnlen ti prefigure woo-la. Annotation n'a jate-lɛ.

annotation-text-missing = `<annotation>`: `text` si yen gaa wala a ɓoyi; sɛbɛ-woo ɓoyi bɛ bɔ.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Fan-nu lɔnlen woo-woo ma sɔrɔla.
       *[other] Fan-nu lɔnlen woo-woo ma sɔrɔla `<{ $componentType }>` fan nun.
    }

reference-no-referent = Lasigi-fan si sɔrɔ gaa: `{ $reference }`

reference-multiple-referents = Lasigi-fan caa sɔrɔla: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Sugandi-woo { $attribute } nɔɔ sɔsɔlen `<{ $componentType }>` ma.

children-invalid = Den-nu sɔsɔlen `<{ $componentType }>` ma: den sɔsɔlen-nu sɔrɔla: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Woo `{ $value }` sɔsɔlen sugandi-woo `{ $attribute }` ma, woo `{ $default }` bɛ ta

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML yɛlɛma-fan { $version } si sɔrɔ gaa.
       *[other] DoenetML yɛlɛma-fan { $version } si sɔrɔ gaa. Yɛlɛma-fan { $fallback } bɛ ta
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML sɔsɔlen: { $content }

parse-tag-missing-close-tag = DoenetML sɔsɔlen: taamaa `{ $tag }` si tugu-taamaa la gaa. A ka kɛ taamaa woo-tugulen ti wala `</{ $tagName }>` ti.

parse-tag-error = DoenetML sɔsɔlen: fele sɔrɔla taamaa `<{ $tagName }>` la

parse-attribute-missing-value = DoenetML sɔsɔlen: sugandi-woo sɔsɔlen `{ $attribute }` a woo si yen gaa.

parse-attribute-invalid = DoenetML sɔsɔlen: sugandi-woo sɔsɔlen `{ $attribute }`

parse-attribute-value-invalid = DoenetML sɔsɔlen: woo sɔsɔlen `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML sɔsɔlen: woo sɔsɔlen `{ $value }`. Sɛbɛ-taamaa-nu ma bɛn ɲɔgɔn ma. A bɛ ɓɔ i la `{ $quote }` woo

parse-open-tag-name-missing = DoenetML sɔsɔlen: taamaa sɔrɔla min tɔgɔ si yen gaa, i n'a fɔ `<`

parse-tag-not-closed = DoenetML sɔsɔlen: taamaa `{ $tag }` ma tugu-lɛ (`>` bɛ ɓɔ i la n'a fɔ).

parse-self-closing-tag-name-missing = DoenetML sɔsɔlen: taamaa sɔrɔla min tɔgɔ si yen gaa `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML sɔsɔlen: taamaa `{ $tag }` ma tugu-lɛ (`/>` bɛ ɓɔ i la n'a fɔ).

parse-tag-invalid-attributes = DoenetML sɔsɔlen: taamaa `{ $tag }` te lɔnlen ti. A sugandi-nu si mɛni gaa.

parse-close-tag-name-missing = DoenetML sɔsɔlen: tugu-taamaa sɔrɔla min tɔgɔ si yen gaa, i n'a fɔ `</`

parse-attribute-value-unquoted = Woo-nu ka kɛ sɛbɛ-taamaa kɔnɔ: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML sɔsɔlen: tugu-taamaa sɔrɔla `{ $tag }`, kɔni wuli-taamaa woo-bɛn si yen gaa

parse-close-tag-mismatched = DoenetML sɔsɔlen: tugu-taamaa ma bɛn ɲɔgɔn ma. `</{ $expected }>` woo bɛ da. `{ $found }` sɔrɔla

parser-node-unconvertible = Node { $node } se gaa ka falɛ Dast node ti.

## Names

name-attribute-invalid =
    Tɔgɔ-woo sɔsɔlen name='{ $name }'. { $reason ->
        [characters] Tɔgɔ-nu ka kɛ sɛbɛ-mama-nu, jate-nu, kanda-taamaa wala tan-kunkun dɔrɔn la.
       *[start] Tɔgɔ-nu ka damina sɛbɛ-mama la.
    }

component-name-invalid-start = Fan-tɔgɔ sɔsɔlen "{ $name }". Tɔgɔ-nu ka damina sɛbɛ-mama la.

## `<answer>` sugar

answer-video-watched-missing-video = Jaabi min type videoWatched ye, a ka video sugandi-woo la

answer-video-watched-video-not-reference = Jaabi min type videoWatched ye, a video sugandi-woo ka kɛ lasigi-fan ti

answer-name-not-single-text = Jaabi tɔgɔ sugandi-woo ka kɛ sɛbɛ-den kelen la

## Referencing another document

external-doenetml-recursion-limit = A se gaa ka DoenetML bɔ kɛlɛ tɛmɛnen la, kanko a segin-segin caa kojugu. Fan-nu bɛ ɲɔgɔn woo?

external-doenetml-unavailable = A se gaa ka DoenetML bɔ { $attribute }="{ $uri }" la

external-doenetml-type-mismatch = DoenetML bɔlen sɔsɔlen { $attribute }="{ $uri }" la: a ma bɛn fan-nɔɔ "{ $componentType }" ma

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Sugandi-woo `{ $from }` ma ta-lɛ tuguni; `{ $to }` woo bɛ ta a nɔɔ la.
       *[other] [deprecation] Sugandi-woo `{ $from }` `<{ $component }>` la ma ta-lɛ tuguni; `{ $to }` woo bɛ ta a nɔɔ la.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Sugandi-woo `{ $from }` ma ta-lɛ tuguni, a n'a jate-lɛ kanko `{ $to }` lɔnna woye.
       *[other] [deprecation] Sugandi-woo `{ $from }` `<{ $component }>` la ma ta-lɛ tuguni, a n'a jate-lɛ kanko `{ $to }` lɔnna woye.
    }

deprecated-attribute-ignored = [deprecation] Sugandi-woo `{ $attribute }` `<{ $component }>` la ma ta-lɛ tuguni, a n'a jate-lɛ.

deprecated-attribute-to-child = [deprecation] Sugandi-woo `{ $attribute }` `<{ $component }>` la ma ta-lɛ tuguni; `<{ $child }>` den woo bɛ ta a nɔɔ la.

deprecated-attribute-value-renamed = [deprecation] Woo `{ $value }` sugandi-woo `{ $attribute }` la `<{ $component }>` la ma ta-lɛ tuguni; `{ $to }` woo bɛ ta a nɔɔ la.


## Language coverage

pluralize-english-only = `<pluralize>` se-lɛ dɔrɔn Angilɛ-kuma la, a bɛ to woo-woo la sɛbɛ nin min sɛbɛlen { $locale } la. Sɛbɛ-mama caa-woo sɛbɛ kelenkelen, wala a lɔn ni `pluralForm` sugandi-woo ti.


## Checking against the schema

schema-element-unrecognized = Fan `<{ $tag }>` te Doenet fan lɔnlen ti.

schema-element-not-allowed-at-root = Fan `<{ $tag }>` n'a se-lɛ gaa sɛbɛ kunfɔlɔ la.

schema-element-not-allowed-inside = Fan `<{ $tag }>` n'a se-lɛ gaa `<{ $parent }>` kɔnɔ.

schema-attribute-unrecognized = Fan `<{ $tag }>` si sugandi-woo la gaa min tɔgɔ ye `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Sugandi-woo `{ $attribute }` fan `<{ $tag }>` la ka kɛ woo-lajɛlen ti min fɛn-nu bɛɛ kɛ nin kelen ti: { $allowed }
       *[other] Sugandi-woo `{ $attribute }` fan `<{ $tag }>` la ka kɛ nin kelen ti: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Yɛlɛma-fan tɔgɔ sɔsɔlen select ma. Yɛlɛma-fan tɔgɔ { $variantName } sɔrɔla sugandi { $numOptions } la, kɔni jate lɔnlen sugandi-woo ye { $numToSelect }.

select-variant-name-without-options = Yɛlɛma-fan dɔ-nu lɔnna select ma, kɔni sugandi si yen gaa yɛlɛma-fan tɔgɔ { $variantName } ma.

select-variant-name-not-possible = Yɛlɛma-fan tɔgɔ { $variantName } lɔnlen select ma te yɛlɛma-fan tɔgɔ se-lɛ ti.

select-too-few-options = A se gaa ka { $numToSelect } sugandi { $numOptions } dɔrɔn na.

select-from-sequence-too-few-values = A se gaa ka { $numToSelect } woo sɔɔlin { $length } waa la.

select-from-sequence-indices-count-mismatch = Indices jate lɔnlen select ma ka bɛn sugandi jate ma

select-from-sequence-indices-not-integers = Indices lɔnlen-nu select ma ka kɛ jate-mɛni ti bɛɛ

select-from-sequence-index-excluded = Selectfromsequence index lɔnlen min bɔlen

select-from-sequence-indices-excluded-combination = Selectfromsequence indices lɔnlen-nu minnu bɔlen woo-lajɛlen na

select-from-sequence-coprime-not-positive-integers = A se gaa ka coprime lajɛlen-nu sugandi, kanko jate-mɛni sanfɛ-nu si sugandilen gaa.

select-from-sequence-coprime-common-factor = A se gaa ka coprime jate-nu sugandi. Woo-nu bɛɛ ye jate kelen lajɛlen la. (Woo lɔnlen-nu "from" wala "to" ma ka coprime kɛ "step" ye.)

select-from-sequence-coprime-single-number = A se gaa ka coprime lajɛlen-nu sugandi jate kelen na min te 1 ti.

select-from-sequence-excluded-too-many-combinations = Lajɛlen-nu 70% tɛmɛnen bɔlen selectFromSequence la

select-from-sequence-coprime-none-found = A se gaa ka coprime jate-nu sugandi. Woo-nu bɛɛ ye jate kelen lajɛlen la.

select-from-sequence-too-few-unique-values = A se gaa ka { $numToSelect } woo woo-kelen sɔɔlin { $numPossibleValues } waa la sugandi

select-prime-numbers-too-few-values = A se gaa ka { $numToSelect } woo prime jate-lajɛlen { $numValues } waa la sugandi

select-prime-numbers-values-count-mismatch = Woo jate lɔnlen-nu select ma ka bɛn jate lɔnlen sugandi-woo ma

select-prime-numbers-values-not-prime = Woo lɔnlen-nu bɛɛ select prime jate ma ka kɛ prime jate-lajɛlen kɔnɔ

select-prime-numbers-values-excluded-combination = Woo lɔnlen-nu selectPrimeNumbers ma bɔlen woo-lajɛlen la

select-prime-numbers-excluded-too-many-combinations = Lajɛlen-nu 70% tɛmɛnen bɔlen selectPrimeNumbers la

select-random-combination-fluke = Ni fɛn nyɛtaa kojugu bɛ, a se gaa ka woo-lajɛlen kolonkolon sugandi

select-random-value-fluke = Ni fɛn nyɛtaa kojugu bɛ, a se gaa ka woo kolonkolon sugandi

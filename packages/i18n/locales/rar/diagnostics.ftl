# Rarotongan / Cook Islands Māori (Te reo Māori Kūki ʻĀirani) diagnostics.
# Translated from `locales/en/diagnostics.ftl`, which is the source of truth:
# `lint:i18n` rejects a key that does not exist there, and reports a key that
# exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# The variety this is written in (the Rarotonga standard), the orthography,
# the amata character (U+02BB), the correspondence table against `locales/mi`
# and `locales/ty`, and the loan policy are set out once in the header of
# `chrome.ftl`. The vocabulary for the things the core draws — line, point,
# region, curve — is `content.ftl`'s `noun` table and is not re-decided here.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence`, `styleNumber` — are part of the language, not prose,
# and stay in English exactly as written. So does anything quoted back from
# the author's own source, and so do `WCAG AA`, `PreFigure`, `DoenetML`,
# `mathjs` and `Dast`.
#
# **The recurring frame words are fixed here so that one English term does not
# come out two ways.** Several are coinages and are marked as such:
#
#   «tū»                    attribute (coinage, from *tū* manner, character)
#   «ʻapinga»               component
#   «tau»                   value
#   «rārangi»               line
#   «ira»                   point
#   «ingoa»                 name
#   «numero»                number
#   «taui»                  variable (coinage, from *taui* to change)
#   «rahiʻanga»             dimension (coinage)
#   «tuatua ʻaiteite»       equation (coinage)
#   «tāʻiriʻanga»           reference (coinage, from *tāʻiri* to point at)
#   «kua ʻakarukeʻia»       is ignored
#   «kāre e rauka»          cannot
#   «kāre rai i ʻakatupuʻia» has not been implemented
#   «tano kore»             invalid
#   «kua kiteʻa»            was found
#   «e tau kia»             must
#
# **Number.** A Rarotongan noun takes no ending for number and a numeral in
# front of one leaves it alone, so every message where English's two branches
# differ only in the noun's number carries a **single unselected form** here.
# `Intl.PluralRules("rar")` has no CLDR data and resolves against the
# runtime's default locale, so a `[two]`, `[few]` or `[many]` branch would be
# text nothing could select. Where English selects on a **symbolic** key —
# `$reason`, `$context`, `$mode`, `$expected`, `$type`, `$suggestion`,
# `$labelKind`, `$isList`, `$fallback`, `$componentType`, `$alternative`,
# `$span` — every branch is kept and the keys are copied letter for letter,
# because the core matches against them.
#
# **What this seed could not do, said once.** The four `field-function-*` and
# `function-*` messages that count two things inside one sentence keep
# English's nested shape with the noun unmarked, which is right for
# Rarotongan and costs nothing. The three `style-definition-*` messages are
# long and technical and are the place a reviewer's time is worst spent
# first; the parser messages (`parse-*`) are where it is best spent, because a
# beginner meets those before anything else.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = Kua ʻakarukeʻia { $attributes } me ʻakatakaʻia te pito e rua

line-segment-attributes-ignored-with-endpoint-and-midpoint = Kua ʻakarukeʻia { $attributes } me ʻakatakaʻia tāokotaʻi te pito e te ira waenga

line-segment-midpoint-offset-without-midpoint = Kāre e aʻo o te midpointOffset me kāre e ira waenga

## `<line>`

line-points-undetermined-dimensions = Rārangi nā roto i te au ira kāre i kiteʻa tō rātou rahiʻanga.

line-points-too-few-dimensions = E tau kia nā roto te rārangi i te au ira e rua tō rātou rahiʻanga i te iti roa.

line-points-depend-on-variables = Tē nā roto nei te rārangi i te au ira e tāʻaki ki runga i te au taui: { $variables }.

line-equation-invalid-format = Tano kore te tū o te tuatua ʻaiteite o te rārangi i roto i te au taui { $variable1 } e { $variable2 }.

## `<ray>`

ray-overprescribed-through = Kua ʻakatakaʻia te ʻiʻi e te through, te endpoint e te direction. Kua ʻakarukeʻia te through i ʻakatakaʻia.

ray-dimension-mismatch = Kāre e ʻaiteite te numDimensions i roto i te ʻiʻi.

## `<vector>`

vector-overprescribed-head = Kua ʻakatakaʻia te vector e te head, te tail e te displacement. Kua ʻakarukeʻia te head i ʻakatakaʻia.

vector-dimension-mismatch = Kāre e ʻaiteite te numDimensions i roto i te vector.

## Attracting and constraining

attract-to-without-nearest-point = Kāre e rauka i te ʻakapiri ki tētai `<{ $component }>` no te mea kāre ōna nearestPoint state variable.

constrain-to-without-nearest-point = Kāre e rauka i te tāpū ki tētai `<{ $component }>` no te mea kāre ōna nearestPoint state variable.

constrain-to-interior-without-nearest-point = Kāre e rauka i te tāpū ki roto i tētai `<{ $component }>` no te mea kāre ōna nearestPoint state variable.

## `<choiceInput>`

choice-input-label-position-ignored = Kua ʻakarukeʻia te labelPosition nō te choiceInput kāre i te inline

## Ordering children by index

choice-input-indices-count-mismatch = Kua ʻakarukeʻia te au indices i ʻakatakaʻia nō te choiceInput no te mea kāre e ʻaiteite te maʻataʻanga o te indices ki te maʻataʻanga o te au tamariki choice.

pretzel-indices-count-mismatch = Kua ʻakarukeʻia te au indices i ʻakatakaʻia nō te problem no te mea kāre e ʻaiteite te maʻataʻanga o te indices ki te maʻataʻanga o te au tamariki problem.

shuffle-indices-count-mismatch = Kua ʻakarukeʻia te au indices i ʻakatakaʻia nō te shuffle no te mea kāre e ʻaiteite te maʻataʻanga o te indices ki te maʻataʻanga o te au ʻapinga.

indices-ignored-out-of-range = Kua ʻakarukeʻia te au indices i ʻakatakaʻia nō te { $component } no te mea tē vai nei te indices i vaʻo ake i te ānga.

pretzel-indices-repeated = Kua ʻakarukeʻia te au indices i ʻakatakaʻia nō te pretzel no te mea kua ʻakaʻou ʻia tētai indices.

pretzel-circuit-first-index = Kua ʻakarukeʻia te au indices i ʻakatakaʻia nō te pretzel i te tū circuit no te mea e tau kia 1 te index mua.

## `<shuffle>` and `<sort>`

string-children-need-type = Kia angaʻanga te `<{ $component }>` ma te au tamariki string, e tau kia ʻakatakaʻia tētai tū `type`.

invalid-type-defaulting-to-math = Tano kore te type { $type } nō te ʻapinga { $component }. E tau kia math, text, number, me kore boolean. Kua ʻoki ki te math.

string-not-valid-component-to-arrange = Kāre te string "{ $value }" e ʻapinga tano nō te { $component }. Kua ʻakarukeʻia.

## Types and variables

invalid-type-defaulting-to-number = Tano kore te type { $type }, kua ʻakanoo ʻia te type ki te number.

invalid-variable-value = Tano kore te tau o tētai taui: `{ $value }`

## Variants

variant-index-must-be-number = E tau kia numero te variant index { $index }

variant-index-must-be-integer = E tau kia numero katoa te variant index { $index }

## `<sideBySide>`

side-by-side-absolute-widths = Kāre te `<{ $component }>` i ʻakatupuʻia nō te au ʻāitoʻanga tāpū. Kua ʻakanoo ʻia te au ʻāʻano ki te tū tāʻaki.

side-by-side-absolute-margins = Kāre te `<{ $component }>` i ʻakatupuʻia nō te au ʻāitoʻanga tāpū. Kua ʻakanoo ʻia te au tapa ki te tū tāʻaki.

side-by-side-no-block-child = Tano kore te `<{ $component }>`: e tau kia vai tētai tamaiti block i te iti roa.

## `<label>`

label-for-ignored-on-graphical = Kua ʻakarukeʻia te tū `for` i runga i te `<label>` tūtū.

label-for-must-resolve-to-one = E tau kia tae te tū `for` i runga i te `<label>` ki tētai uaʻorāi ʻapinga.

label-for-unresolved = Kāre te tū `for` i runga i te `<label>` i tae ki tētai ʻapinga.

label-for-answer-with-authored-inputs = Tē tāʻiri nei te tū `for` i runga i te `<label>` ki tētai `<answer>` tei ʻakanoo ʻia tāna au input; e tāʻiri tika ki te input.

label-for-answer-without-input = Tē tāʻiri nei te tū `for` i runga i te `<label>` ki tētai `<answer>` kāre āna input ei tāpaʻo.

label-for-must-reference-input-or-answer = E tau kia tāʻiri te tū `for` i runga i te `<label>` ki tētai input me kore tētai answer.

## Accessibility

accessibility-short-description-or-decorative = Nō te urunga, e tau kia vai tētai ʻakamāramaʻanga poto i te `<{ $component }>`, me kore kia ʻakatakaʻia ei ʻakamanea ua.

accessibility-video-short-description = Nō te urunga, e tau kia vai tētai ʻakamāramaʻanga poto i te `<video>`.

accessibility-input-short-description-or-label = Nō te urunga, e tau kia vai tētai ʻakamāramaʻanga poto me kore tētai label i te `<{ $component }>`.

accessibility-answer-input-short-description-or-label = Nō te urunga, e tau kia vai tētai ʻakamāramaʻanga poto me kore tētai label i tētai `<answer>` tē anga nei i tētai input.

accessibility-short-description-contains-math = Kāre e tau kia vai te au ʻapinga numero mei te `<{ $component }>` i roto i te au ʻakamāramaʻanga poto. E tātā i te numero ki te tuatua.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Kāre e ravea te tāʻokotaʻiʻanga tae o te { $colorName } nō te tuatua ʻupoko tuʻanga (tū pōiri) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e tau kia { $threshold }:1 i te iti roa).
       *[other] Kāre e ravea te tāʻokotaʻiʻanga tae o te { $colorName } nō te tuatua ʻupoko tuʻanga ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e tau kia { $threshold }:1 i te iti roa).
    }

## `<circle>`

circle-through-points-non-numerical = Kāre rai i ʻakatupuʻia te `<circle>` nā roto i te { $count } ira me kāre e tau numero tō te au ira.

circle-too-many-through-points = Kāre e rauka i te tatau i te porotaka nā roto i te ira maʻata atu i te 3.

circle-overprescribed-radius-center-points = Kāre e rauka i te tatau i te porotaka ma te radius, te waenga e te au ira i ʻakatakaʻia.

circle-center-with-multiple-points = Kāre e rauka i te tatau i te porotaka ma te waenga i ʻakatakaʻia nā roto i te ira maʻata atu i te 1.

circle-radius-too-small = Kāre e rauka i te tatau i te porotaka: no te mea ko { $distance } te mamao i rotopū i te ira e rua, e ririki roa te radius { $radius } i ʻakatakaʻia.

circle-radius-with-many-points = Kāre e rauka i te anga porotaka nā roto i te ira maʻata atu i te rua ma te radius i ʻakatakaʻia.

circle-invalid-center-or-through-points = Tano kore te waenga me kore te au ira o te porotaka.

circle-radius-center-with-multiple-points = Kāre e rauka i te tatau i te radius o te porotaka ma te waenga i ʻakatakaʻia nā roto i te ira maʻata atu i te 1.

circle-change-radius-non-numerical = Kāre e rauka i te taui i te radius o te porotaka me kāre e tau numero tō te au ira

circle-radius-with-points-non-numerical = Kāre e rauka i te anga porotaka nā roto i te ira maʻata atu i te tai ma te radius i ʻakatakaʻia me kāre e tau numero.

circle-change-center-non-numerical = Kāre rai i ʻakatupuʻia te tauiʻanga i te waenga o te porotaka nā roto i te au ira kāre e tau numero.

## `<function>`

# No select: neither «vā» nor «input» takes an ending for number, so English's
# four combinations are one sentence here.
function-domain-insufficient-dimensions = Kāre e ravea te rahiʻanga o te domain nō te function. E { $intervals } vā tō te domain, ā, e { $inputs } input tō te function.

function-domain-invalid-format = Tano kore te tū o te domain nō te function.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Kua ʻakarukeʻia te maximum kāre e numero o te function.
        [minimum] Kua ʻakarukeʻia te minimum kāre e numero o te function.
        [extremum] Kua ʻakarukeʻia te extremum kāre e numero o te function.
        [point] Kua ʻakarukeʻia te ira kāre e numero o te function.
        [slope] Kua ʻakarukeʻia te slope kāre e numero o te function.
       *[other] Kua ʻakarukeʻia te { $type } kāre e numero o te function.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Kua ʻakarukeʻia te maximum kāreā o te function.
        [minimum] Kua ʻakarukeʻia te minimum kāreā o te function.
        [extremum] Kua ʻakarukeʻia te extremum kāreā o te function.
        [point] Kua ʻakarukeʻia te ira kāreā o te function.
       *[other] Kua ʻakarukeʻia te { $type } kāreā o te function.
    }

function-points-too-close = Tē vai nei i roto i te function te ira e rua e vaitata roa tō rāua ngāʻi. Kāre e rauka i te ʻakataka i te function.

function-iterates-input-output-mismatch = Ka rauka ua te function iterates me ʻaiteite te maʻataʻanga o te input o te function ki te maʻataʻanga o te output. E { $inputs } input tō teia function, ā, e { $outputs } output.

## `<sequence>`

sequence-invalid-length = Tano kore te roa o te sequence. E tau kia numero katoa kāre e ririki i te kore.

sequence-invalid-step = Tano kore te step o te sequence. E tau kia numero nō te sequence tū { $type }.

sequence-invalid-endpoint-number = Tano kore te "{ $attribute }" o te sequence numero. E tau kia numero.

sequence-invalid-endpoint-letters = Tano kore te "{ $attribute }" o te sequence reta. E tau kia tāʻokotaʻiʻanga reta.

sequence-invalid-endpoint = Tano kore te "{ $attribute }" o te sequence.

select-from-sequence-coprime-not-numbers = Kua ʻakarukeʻia te coprime no te mea kāre e numero tē ʻikiʻia nei

select-from-sequence-coprime-with-exclude-combinations = Kua ʻakarukeʻia te coprime no te mea kua ʻakatakaʻia te excludeCombinations

## Resolving a `target`

target-not-found = Tano kore te target nō te `<{ $source }>`: kāre e rauka i te kite i te target.

target-state-variable-not-found = Tano kore te target nō te `<{ $source }>`: kāre e rauka i te kite i tētai state variable tōna ingoa ko "{ $property }" i runga i tētai `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = E tau kia ke te au taui o te `<odeSystem>` mei te taui tuʻatua kē.

ode-system-duplicate-variable-names = Kāre e rauka i te ʻakataka i te au function ODE RHS ma te au ingoa taui ʻakaʻou.

ode-system-rhs-function-error = Kāre e rauka i te ʻakataka i te function ODE RHS. Kua tarevake te angaʻanga i te function mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Kāre e rauka i te ʻakataka i tētai kokoʻanga i rotopū i te { $count } rārangi

angle-invalid-through-point = Tano kore te ira i roto i te through o te `<angle>`

parabola-vertex-too-many-points = Kāre rai i ʻakatupuʻia te parabola ma te vertex nā roto i te ira maʻata atu i te 1.

parabola-too-many-points = Kāre rai i ʻakatupuʻia te parabola nā roto i te ira maʻata atu i te 3.

intersection-too-many-items = Kāre rai i ʻakatupuʻia te tūtakiʻanga nō te ʻapinga maʻata atu i te rua

## Other math components

ionic-compound-not-two-ions = Kāre rai i ʻakatupuʻia te ʻakakāʻiroʻanga ionika nō tētai mea ke atu i te ion e rua.

ionic-compound-needs-cation-and-anion = Kua ʻakatupuʻia ua te ʻakakāʻiroʻanga ionika nō te cation okotaʻi e te anion okotaʻi.

solve-equations-cannot-evaluate = Kāre e rauka i te ʻakatika i te tuatua ʻaiteite no te mea kāre i rauka i te tatau: { $equation }

math-operators-operand-number-required = E tau kia ʻakatakaʻia tētai operandNumber me ʻiriti i tētai math operand.

eigen-decomposition-failed = Kāre i rauka i te tatau i te au eigenvalue o te matrix

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: kāre te parameter { $parameters } i roto i te pattern, no reira ka ʻaiteite ua te reira ki tētai vā.

## `<graph>`

graph-grid-invalid = `<graph>`: kāre e rauka i te mārama i te grid="{ $grid }". E tau kia none, medium, dense, me kore e rua numero maʻata atu i te kore i tāʻokotaʻiʻia e tētai vā, mei te grid="1 0.5". Kāre e grid i tātāʻia.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    Tē anoano nei te `<{ $component }>` i tētai function ma { $expected ->
        [one] te output okotaʻi, ko te slope y' i te au ira, mei te `y - x`
       *[other] te output e rua, ko te vector i te au ira, mei te `(y, -x)`
    }, inārā e { $found } output tō te function i ʻōronga ʻia ki te reira. { $alternative ->
        [none] Kāre e mea i tātāʻia.
       *[other] Ko te `<{ $alternative }>` te ʻapinga nō taua function ra. Kāre e mea i tātāʻia.
    }

field-function-attribute-ignored-with-child = Kua ʻakarukeʻia te tū `function` no te mea kua ʻōronga katoaʻia te function i roto i te ʻapinga; kua ʻāʻā ʻia tei roto. E ʻōronga i te function nā tētai ua o te au mataara e rua.

field-variables-ignored =
    `<{ $component }>`: tē tāpaʻo nei te tū `variables` i te au taui o tētai tuatua i tātāʻia tika i roto i te ʻapinga. { $reason ->
        [function-child] Kua ʻōronga ʻia te function i konei ei tamaiti `<function>`, tē tāpaʻo nei i tāna au taui uaʻorāi, no reira kua ʻakarukeʻia te `variables`.
       *[no-expression] Kāre e tuatua pērā i ʻōronga ʻia i konei, no reira kua ʻakarukeʻia te `variables`.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: kāre te xLabelPosition="left" i tauturuʻia i roto i te prefigure renderer; tē ʻāʻā nei i te tū right-position.

prefigure-y-label-position-unsupported = `<graph>`: kāre te yLabelPosition="bottom" i tauturuʻia i roto i te prefigure renderer; tē ʻāʻā nei i te tū top-position.

prefigure-invalid-axis-bounds = `<graph>`: tano kore te au ānga axis nō te tauiʻanga prefigure; tē ʻāʻā nei i te bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: tano kore te ʻāʻano nō te tauiʻanga prefigure; tē ʻāʻā nei i te ʻāʻano tūtū 425.

prefigure-invalid-aspect-ratio = `<graph>`: tano kore te aspectRatio nō te tauiʻanga prefigure; tē ʻāʻā nei i te aspect ratio 1.

prefigure-grid-spacing-too-fine = `<graph>`: e ririki roa te vā i rotopū i te au rārangi ānga nō te au katoʻanga axis; kua ʻakarukeʻia te au rārangi ānga i roto i te prefigure renderer.

prefigure-annotations-not-rendered = `<graph>`: kāre te au annotation e tātāʻia me kāre e ʻāʻā ʻia te PreFigure renderer.

multiple-annotations-children = Kua kiteʻa te au tamariki `<annotations>` maʻata i roto i te `<graph>`; kua ʻakarukeʻia te katoa, ko tei ʻopenga ua tei ʻāʻā ʻia.

## Referring to other components

copy-unrecognized-component-type = Kāre e rauka i te ʻāʻā me kore i te kāpi i tētai tū ʻapinga kāre i kiteʻa: { $type }.

copy-prop-not-found = Kāre i rauka i te kite i te prop { $property } i runga i tētai ʻapinga tūʻanga { $component }

collect-no-source = Kāre e tumu i kiteʻa nō te collect.

collect-invalid-component-type = Kāre e rauka i te ʻakaputu i te au ʻapinga tūʻanga `<{ $component }>` no te mea e tū ʻapinga tano kore.

reference-index-unavailable = Kāre e rauka i te tāʻiri ki te index `{ $reference }`

## `<callAction>`

component-action-unavailable = Kāre e rauka i te kāpiki i te { $action } i runga i te ʻapinga `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Tano kore te tū o te data. Kāre e ʻaiteite te roa o te au rārangi. Kua kiteʻa i te componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Tē vai nei te au ingoa rārangi tū ʻakaʻou i roto i te data. Kua kiteʻa i te componentIdx :{ $componentIdx }

data-frame-missing-column-name = Kua ngaro tētai ingoa rārangi tū i roto i te data. Kua kiteʻa i te componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Tē tāʻaki nei tētai award nō teia answer ki runga i te pauʻanga i tukuʻia e te answer tag uaʻorāi, ka ʻaere kē te tū o te reira.

answer-max-num-attempts-in-section-wide-check-work = Kāre e aʻo o te ʻakanooʻanga i te `maxNumAttempts` i runga i tētai `<answer>` i roto i tētai ʻapinga ma te `sectionWideCheckWork`, no te mea nā te ʻapinga rāʻui e ʻakataka i te maʻataʻanga o te tāmataʻanga. E ʻakanoo i te `maxNumAttempts` i runga i te ʻapinga rāʻui.

nested-section-wide-check-work-max-num-attempts = Kāre e aʻo o te ʻakanooʻanga i te `maxNumAttempts` i runga i tētai ʻapinga rāʻui ma te `sectionWideCheckWork` tei roto i tētai ʻapinga rāʻui ke ma te `sectionWideCheckWork`, no te mea nā te ʻapinga rāʻui i vaʻo e ʻakataka i te maʻataʻanga o te tāmataʻanga. E ʻakanoo i te `maxNumAttempts` i runga i te ʻapinga rāʻui i vaʻo.

answer-attributes-need-symbolic-equality = Kāre e aʻo o te tū { $attributes } me kāre e ʻakanoo ʻia te symbolicEquality.

answer-invalid-type = Tano kore te tū nō te answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = No te mea kāre e ingoa tō te ʻapinga `<{ $component }>`, kāre e rauka i te ʻāʻā i te reira ei tū module

module-attribute-name-already-defined = Kāre e rauka i te ʻāʻā i te ʻapinga `<{ $component } name="{ $name }">` ei tū nō tētai module no te mea kua ʻakatakaʻia ʻāna tētai tū "{ $name }" e te tū ʻapinga `<module>`.

conditional-content-condition-ignored = Kua ʻakarukeʻia te tū `condition` i runga i tētai ʻapinga `<conditionalContent>` ma te au tamariki case me kore else.

slider-markers-type-mismatch = Kāre e ʻaiteite te tū o te au marker ki te tū o te slider.

pretzel-problem-needs-statement-and-answer = Tano kore te pretzel: e tau kia vai tētai `<statement>` okotaʻi e tētai `<answer>` okotaʻi i roto i tēnā `<problem>`.

pretzel-circuit-first-problem-distractor = Tano kore te pretzel: i te mode="circuit", kāre e rauka i te `<problem>` mua i te riro ei distractor.

## Attribute values

attribute-invalid-values = Tano kore te tau { $values } nō te tū `{ $attribute }`; kua ʻakarukeʻia.

attribute-must-be-references = Tano kore te tau `{ $value }` nō te tū `{ $attribute }`. E tau kia anga ʻia te tū ki te au tāʻiriʻanga tē ʻakamata ki tētai `$`.

math-input-invalid-function-names = <mathInput>: kua ʻakarukeʻia te au ingoa function tano kore i roto i te { $attribute }: { $names }. E tau kia rua reta i te iti roa te tuʻanga ʻakaʻite o tēnā ingoa (reta me kore ʻaka); e ka rauka i tētai `|<mathspeak alternative>` i muri iā ia.

## Building components from the source

component-type-invalid = Tano kore te tū ʻapinga: `<{ $componentType }>`

attribute-repeated = Kāre e rauka i te ʻakaʻou i te tū { $attribute }.

attribute-invalid-for-component = Tano kore te tū "{ $attribute }" nō tētai ʻapinga tūʻanga `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Kāre e ravea te tāʻokotaʻiʻanga tae o te style definition { $styleNumber } nō te { $context ->
        [text-on-background] tae tuatua ki mua i te tae papa muri
        [high-contrast] tae tāʻokotaʻi maʻata ki mua i te papa
        [line] tae rārangi ki mua i te papa
        [marker] tae marker ki mua i te papa
       *[text-on-canvas] tae tuatua ki mua i te papa
    }{ $mode ->
        [dark] { " (tū pōiri)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e tau kia { $threshold }:1 i te iti roa).

style-definition-dark-mode-text-background-contrast =
    Noatu e kua ʻakataka te style definition { $styleNumber } i te au tae e ravea ana te tāʻokotaʻiʻanga nō te tū mārama, kāre e ravea te tāʻokotaʻiʻanga o te tae tuatua ki mua i te tae papa muri nō te au tae tū pōiri i ʻōronga ʻia mei taua au tau ra ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e tau kia { $threshold }:1 i te iti roa). { $suggestion ->
        [available] Kia ravea te tāʻokotaʻiʻanga i te tū pōiri, e ʻakamaʻata i te tāʻokotaʻiʻanga o te tū mārama (ei ʻakaraʻanga, e ʻakanoo i te { $lightAttribute }="{ $lightColor }") me kore e taui i te tae tū pōiri (ei ʻakaraʻanga, e ʻakanoo i te { $darkAttribute }="{ $darkColor }").
       *[none] Kia ravea te tāʻokotaʻiʻanga i te tū pōiri, e ʻakamaʻata i te tāʻokotaʻiʻanga o te tū mārama me kore e taui i te au tae i ʻōronga ʻia ki te textColorDarkMode me kore te backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Noatu e kua ʻakataka te style definition { $styleNumber } i tētai tae tuatua e ravea ana te tāʻokotaʻiʻanga nō te tū mārama, kāre e ravea te tāʻokotaʻiʻanga o te tae tuatua tū pōiri i ʻōronga ʻia mei taua tau ra ki mua i te papa ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; e tau kia { $threshold }:1 i te iti roa). { $suggestion ->
        [available] Kia ravea te tāʻokotaʻiʻanga i te tū pōiri, e ʻakamaʻata i te tāʻokotaʻiʻanga o te tū mārama (ei ʻakaraʻanga, e ʻakanoo i te textColor="{ $lightColor }") me kore e taui i te tae tū pōiri (ei ʻakaraʻanga, e ʻakanoo i te textColorDarkMode="{ $darkColor }").
       *[none] Kia ravea te tāʻokotaʻiʻanga i te tū pōiri, e ʻakamaʻata i te tāʻokotaʻiʻanga o te tū mārama me kore e taui i te tae i ʻōronga ʻia ki te textColorDarkMode.
    }

section-multiple-style-palettes = E rauka ua i tētai tuʻanga i te ʻiki i te <stylePalette> okotaʻi; tē ʻāʻā nei i tei ʻopenga.

## Unique variants

variant-num-to-select-not-non-negative-integer = kāre e rauka i te ʻakataka i te au unique variant o te { $component } no te mea kāre te numToSelect i te numero katoa kāre e ririki i te kore.

variant-num-to-select-not-constant-number = kāre e rauka i te ʻakataka i te au unique variant o te { $component } no te mea kāre te numToSelect i te numero tumau.

variant-with-replacement-not-constant-boolean = kāre e rauka i te ʻakataka i te au unique variant o te { $component } no te mea kāre te withReplacement i te boolean tumau.

variant-select-weight-disables-unique = Kua ʻakakore ʻia te au unique variant nō te select me vai tētai option ma te selectWeight me kore te selectForVariants i ʻakatakaʻia

variant-coprime-undetermined = kāre e rauka i te ʻakataka i te au unique variant o te { $component } no te mea kāre e rauka i te ʻakataka e e mou tumau ana te coprime i te kore.

variant-attribute-not-constant = kāre e rauka i te ʻakataka i te au unique variant o te { $component } no te mea kāre te { $attribute } i te mea tumau.

variant-attribute-not-number = kāre e rauka i te ʻakataka i te au unique variant o te { $component } no te mea kāre te { $attribute } i te numero.

variant-attribute-wrong-type-for-sequence =
    kāre e rauka i te ʻakataka i te au unique variant o te { $component } tūʻanga { $type } no te mea kāre te { $attribute } i te { $expected ->
        [letters-combination] tāʻokotaʻiʻanga reta
        [math-expression] tuatua numero tano
        [integer] numero katoa
       *[number] numero
    }.

variant-length-not-integer = kāre e rauka i te ʻakataka i te au unique variant o te { $component } no te mea kāre te length i te numero katoa.

variant-sort-not-implemented = kāre rai i ʻakatupuʻia te au unique variant o tētai { $component } ma te sort

variant-exclude-combinations-not-implemented = kāre rai i ʻakatupuʻia te au unique variant o tētai { $component } ma te excludeCombinations

variant-math-exclude-not-implemented = kāre rai i ʻakatupuʻia te au unique variant o tētai { $component } tūʻanga math ma te exclude

variant-non-constant-exclude-not-implemented = kāre rai i ʻakatupuʻia te au unique variant o tētai { $component } ma te exclude kāre e tumau

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: kāre i tauturuʻia i roto i te graph prefigure renderer; kua ʻakarukeʻia te uānga.

prefigure-descendant-invalid-geometry = { $subject }: kāre e ʻopenga te tū me kore kāre i oti; kua ʻakarukeʻia te uānga.

prefigure-curve-label-omitted = { $subject }: kāre te au label i tauturuʻia i runga i te au ʻapinga piʻo i tauiʻia; kua ʻakarukeʻia te label.

prefigure-curve-unsupported-definition-type = { $subject }: kāre te tū ʻakatakaʻanga piʻo '{ $definitionType }' i tauturuʻia; kua ʻakarukeʻia te uānga.

prefigure-region-flip-functions-unsupported = { $subject }: kāre te tū flipFunctions i runga i te regionBetweenCurves i tauturuʻia; kua ʻakarukeʻia te uānga.

prefigure-region-non-formula-child = { $subject }: ko te au tamariki function tūʻanga formula ua tei tauturuʻia i runga i te regionBetweenCurves; kua ʻakarukeʻia te uānga.

prefigure-label-position-unsupported =
    { $subject }: kāre te labelPosition '{ $labelPosition }' i tauturuʻia nō te { $labelKind ->
        [line-family] label o te kōpū rārangi
       *[point] label ira
    }; kua ʻāʻā ʻia te tāʻokotaʻiʻanga PreFigure.

prefigure-fill-style-unsupported = { $subject }: kāre te fill style '{ $fillStyle }' i tauturuʻia e te PreFigure; kua ʻoki ki tētai kīʻanga ʻaiteite.

prefigure-line-style-unknown = { $subject }: kāre i kiteʻa te line style '{ $lineStyle }', kua ʻakarukeʻia mei roto i te PreFigure output.

prefigure-marker-style-mapped-to-diamond = { $subject }: kua tauiʻia te marker style '{ $markerStyle }' ki te PreFigure style 'diamond'.

prefigure-marker-style-unsupported = { $subject }: kāre te marker style '{ $markerStyle }' i tauturuʻia e te PreFigure; kua ʻāʻā ʻia te style tumau.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: tano kore te `ref`; kāre e rauka i te kite i te target. Kua ʻakarukeʻia te annotation.

annotation-ref-multiple-targets = `<annotation>`: kua tae te `ref` ki te au target maʻata; tē ʻāʻā nei i te target mua.

annotation-ref-outside-graph = `<annotation>`: tano kore te `ref`; tē vai nei te target i vaʻo ake i te graph. Kua ʻakarukeʻia te annotation.

annotation-ref-unsupported-target = `<annotation>`: tano kore te `ref`; kāre te target i te ʻapinga tūtū tei tauturuʻia i roto i te tauiʻanga prefigure. Kua ʻakarukeʻia te annotation.

annotation-text-missing = `<annotation>`: kua ngaro me kore kāreā te `text`; tē tuku nei i te tuatua kāreā.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Kua kiteʻa tētai tāʻakiʻanga takamiri.
       *[other] Kua kiteʻa tētai tāʻakiʻanga takamiri e ʻapai ana i te ʻapinga `<{ $componentType }>`.
    }

reference-no-referent = Kāre e mea i kiteʻa nō te tāʻiriʻanga: `{ $reference }`

reference-multiple-referents = E maʻata te mea i kiteʻa nō te tāʻiriʻanga: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Tano kore te tū o te { $attribute } o te `<{ $componentType }>`.

children-invalid = Tano kore te au tamariki o te `<{ $componentType }>`: kua kiteʻa te au tamariki tano kore: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Tano kore te tau `{ $value }` nō te tū `{ $attribute }`, tē ʻāʻā nei i te tau `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Kāre i kiteʻa te DoenetML version { $version }.
       *[other] Kāre i kiteʻa te DoenetML version { $version }. Tē ʻoki nei ki te version { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML tano kore: { $content }

parse-tag-missing-close-tag = DoenetML tano kore: Kāre e tag ʻōpani tō te tag `{ $tag }`. E tau kia tag ʻōpani iāia uaʻorāi me kore kia vai tētai tag `</{ $tagName }>`.

parse-tag-error = DoenetML tano kore: Kua tarevake i roto i te tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML tano kore: Te tū tano kore `{ $attribute }`, mei te mea rā kua ngaro tōna tau.

parse-attribute-invalid = DoenetML tano kore: Te tū tano kore `{ $attribute }`

parse-attribute-value-invalid = DoenetML tano kore: Te tau tū tano kore `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML tano kore: Te tau tū tano kore `{ $value }`. Kāre e ʻaiteite te au tāpaʻo tuatua. Mei te mea rā kua ngaro tētai `{ $quote }`

parse-open-tag-name-missing = DoenetML tano kore: Kua kiteʻa tētai tag kāre ōna ingoa tag, mei te `<`

parse-tag-not-closed = DoenetML tano kore: Kāre te tag `{ $tag }` i ʻōpani ʻia (mei te mea rā kua ngaro tētai `>`).

parse-self-closing-tag-name-missing = DoenetML tano kore: Kua kiteʻa tētai tag kāre ōna ingoa tag `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML tano kore: Kāre te tag `{ $tag }` i ʻōpani ʻia (mei te mea rā kua ngaro tētai `/>`).

parse-tag-invalid-attributes = DoenetML tano kore: Tano kore te tag `{ $tag }`. Penei e tū tarevake tōna.

parse-close-tag-name-missing = DoenetML tano kore: Kua kiteʻa tētai tag ʻōpani kāre ōna ingoa tag, mei te `</`

parse-attribute-value-unquoted = E tau kia noo te au tau tū i roto i te au tāpaʻo tuatua: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML tano kore: Kua kiteʻa te tag ʻōpani `{ $tag }`, inārā kāre e tag ʻuaki e tau ana ki te reira

parse-close-tag-mismatched = DoenetML tano kore: Kāre e ʻaiteite te tag ʻōpani. E tau kia `</{ $expected }>`. Kua kiteʻa `{ $found }`

parser-node-unconvertible = Kāre i rauka i te taui i te node { $node } ki tētai Dast node.

## Names

name-attribute-invalid =
    Tano kore te tū name='{ $name }'. { $reason ->
        [characters] E rauka ua i te au ingoa i te ʻapai reta, numero, ʻakatārere raro me kore ʻaka.
       *[start] E tau kia ʻakamata te au ingoa ki tētai reta.
    }

component-name-invalid-start = Tano kore te ingoa ʻapinga "{ $name }". E tau kia ʻakamata te au ingoa ki tētai reta.

## `<answer>` sugar

answer-video-watched-missing-video = E tau kia vai tētai tū video i te answer tūʻanga videoWatched

answer-video-watched-video-not-reference = E tau kia riro te tū video o te answer tūʻanga videoWatched ei tāʻiriʻanga

answer-name-not-single-text = E tau kia vai tētai tamaiti text okotaʻi i te tū name o te answer

## Referencing another document

external-doenetml-recursion-limit = Kāre e rauka i te tiki i te DoenetML i vaʻo no te mea e maʻata roa te au ʻāʻaiʻanga. E tāʻiriʻanga takamiri ainei tē vai ra?

external-doenetml-unavailable = Kāre e rauka i te tiki i te DoenetML mei te { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Tano kore te DoenetML i tikiʻia mei te { $attribute }="{ $uri }": kāre i ʻaiteite ki te tū ʻapinga "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Kua ʻakaruke ʻia te tū `{ $from }`; e ʻāʻā i te `{ $to }`.
       *[other] [deprecation] Kua ʻakaruke ʻia te tū `{ $from }` i runga i te `<{ $component }>`; e ʻāʻā i te `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Kua ʻakaruke ʻia te tū `{ $from }` e kua ʻakarukeʻia no te mea kua ʻakatakaʻia katoa te `{ $to }`.
       *[other] [deprecation] Kua ʻakaruke ʻia te tū `{ $from }` i runga i te `<{ $component }>` e kua ʻakarukeʻia no te mea kua ʻakatakaʻia katoa te `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Kua ʻakaruke ʻia te tū `{ $attribute }` i runga i te `<{ $component }>` e kua ʻakarukeʻia.

deprecated-attribute-to-child = [deprecation] Kua ʻakaruke ʻia te tū `{ $attribute }` i runga i te `<{ $component }>`; e ʻāʻā i tētai tamaiti `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Kua ʻakaruke ʻia te tau `{ $value }` o te tū `{ $attribute }` i runga i te `<{ $component }>`; e ʻāʻā i te `{ $to }`.


## Language coverage

pluralize-english-only = E rauka ua i te `<pluralize>` i te ʻakamaʻata i te reo Peretāne, no reira kāre tāna tuatua e tauiʻia i roto i tētai tātāʻanga i tātāʻia ki te { $locale }. E tātā tika i te tū maʻata, me kore e ʻakanoo i te reira ki te tū `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Kāre te element `<{ $tag }>` i te element Doenet i kiteʻa.

schema-element-not-allowed-at-root = Kāre e tikaʻia te element `<{ $tag }>` i te tumu o te tātāʻanga.

schema-element-not-allowed-inside = Kāre e tikaʻia te element `<{ $tag }>` i roto i te `<{ $parent }>`.

schema-attribute-unrecognized = Kāre e tū tōna ingoa ko `{ $attribute }` tō te element `<{ $tag }>`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] E tau kia riro te tū `{ $attribute }` o te element `<{ $tag }>` ei tāpura tei anga ʻia ki tētai o te au mea nei: { $allowed }
       *[other] E tau kia riro te tū `{ $attribute }` o te element `<{ $tag }>` ei tētai o te au mea nei: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Tano kore te variant name nō te select. Tē vai nei te variant name { $variantName } i roto i te { $numOptions } option, inārā ko { $numToSelect } te maʻataʻanga ka ʻikiʻia.

select-variant-name-without-options = Kua ʻakatakaʻia tētai au variant nō te select inārā kāre e option i ʻakatakaʻia nō te variant name ka rauka: { $variantName }.

select-variant-name-not-possible = Kāre te variant name { $variantName } i ʻakatakaʻia nō te select i te variant name ka rauka.

select-too-few-options = Kāre e rauka i te ʻiki i te { $numToSelect } ʻapinga mei roto ua i te { $numOptions }.

select-from-sequence-too-few-values = Kāre e rauka i te ʻiki i te { $numToSelect } tau mei roto i tētai sequence tōna roa ko { $length }.

select-from-sequence-indices-count-mismatch = E tau kia ʻaiteite te maʻataʻanga o te indices i ʻakatakaʻia nō te select ki te maʻataʻanga ka ʻikiʻia

select-from-sequence-indices-not-integers = E tau kia numero katoa te au indices katoa i ʻakatakaʻia nō te select

select-from-sequence-index-excluded = Kua ʻakatakaʻia tētai index o te selectfromsequence tei ʻakaruke ʻia

select-from-sequence-indices-excluded-combination = Kua ʻakatakaʻia te au indices o te selectfromsequence tei riro ei tāʻokotaʻiʻanga i ʻakaruke ʻia

select-from-sequence-coprime-not-positive-integers = Kāre e rauka i te ʻiki i te au tāʻokotaʻiʻanga coprime no te mea kāre e numero katoa maʻata atu i te kore tē ʻikiʻia nei.

select-from-sequence-coprime-common-factor = Kāre e rauka i te ʻiki i te au numero coprime. Tē ʻapai nei te au tau katoa ka rauka i tētai factor ʻaiteite. (E tau kia coprime te au tau o te "from" me kore te "to" ki te "step".)

select-from-sequence-coprime-single-number = Kāre e rauka i te ʻiki i te au tāʻokotaʻiʻanga coprime mei roto i te numero okotaʻi kāre i te 1.

select-from-sequence-excluded-too-many-combinations = Kua ʻakaruke ʻia i runga ake i te 70% o te au tāʻokotaʻiʻanga i roto i te selectFromSequence

select-from-sequence-coprime-none-found = Kāre i rauka i te ʻiki i te au numero coprime. Tē ʻapai nei te au tau katoa ka rauka i tētai factor ʻaiteite.

select-from-sequence-too-few-unique-values = Kāre e rauka i te ʻiki i te { $numToSelect } tau tāʻokotaʻi mei roto i tētai sequence tōna roa ko { $numPossibleValues }

select-prime-numbers-too-few-values = Kāre e rauka i te ʻiki i te { $numToSelect } tau mei roto i tētai tāpura numero prime tōna roa ko { $numValues }

select-prime-numbers-values-count-mismatch = E tau kia ʻaiteite te maʻataʻanga o te au tau i ʻakatakaʻia nō te select ki te maʻataʻanga ka ʻikiʻia

select-prime-numbers-values-not-prime = E tau kia vai te au tau katoa i ʻakatakaʻia nō te select prime number i roto i te tāpura numero prime

select-prime-numbers-values-excluded-combination = Kua riro te au tau i ʻakatakaʻia o te selectPrimeNumbers ei tāʻokotaʻiʻanga i ʻakaruke ʻia

select-prime-numbers-excluded-too-many-combinations = Kua ʻakaruke ʻia i runga ake i te 70% o te au tāʻokotaʻiʻanga i roto i te selectPrimeNumbers

select-random-combination-fluke = Nā tētai tupuʻanga ʻiti roa, kāre i rauka i te ʻiki i tētai tāʻokotaʻiʻanga o te au tau tāviriviri

select-random-value-fluke = Nā tētai tupuʻanga ʻiti roa, kāre i rauka i te ʻiki i tētai tau tāviriviri

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    Kāre te `<{ $component }>` i tātāʻia i roto i te numero; kua tuatuʻi ʻia te tuatua numero mei tōna tū mua ake i te rauka ʻanga o te au input i roto. { $reason ->
        [not-inline] Ko te choice input `inline` ua tē tau ki roto i tētai tuatua numero; me kāre e `inline`, e ʻāpai pātana te reira.
        [expanded] E pouaka rārangi maʻata te text input `expanded`, e maʻata roa te reira nō roto i tētai tuatua numero.
        [on-graph] I runga i tētai graph, kua tātāʻia te tuatua numero ei tūtū okotaʻi, kāre ōna vā nō tētai ʻapinga tāmata.
       *[relative-width] E tāʻaki tōna `width` (e pāsene me kore e `em`), kāre ōna mea ei ʻāito i roto i tētai tuatua numero. E ʻōronga i te ʻāʻano ki te au ʻāitoʻanga tāpū, mei te `px`.
    }

# Pangasinan (Salitan Pangasinan) diagnostics. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography: the modernised spelling**, as `chrome.ftl`'s header sets out.
# The older Spanish-influenced spelling is a respelling, not a retranslation;
# convert all four files at once or none.
#
# **The frames.** This file is some 220 sentences built out of a dozen
# recurring frames, and reading the frames is the fastest way to review it:
#
#     Ag-uusaren …         it is ignored — rendered literally as 'is not used'
#     Ag ayari a …         cannot / is not possible
#     Nepeg a …            must / is required
#     Aliwan …             invalid …
#     Ag naromog …         not found
#     Anggapoy …           there is no …
#     Walay …              there is …
#     Anggapoy epekto to   has no effect
#     Ag ni nagagawa …     has not been implemented
#     lapud …              because …
#     … a nibaga           … that was specified
#     … so uusaren         … is used
#
# «Ag-uusaren» is worth naming because it is a **paraphrase, not a
# translation**: the seed found no Pangasinan verb for 'ignore' it could vouch
# for, so every "is ignored" in this file reads 'is not used'. That is the
# first thing a speaker should replace, and replacing it is one search.
#
# **Loans, declared.** The technical nouns are the Spanish-derived vocabulary
# Philippine schooling carries — «komponente», «atributo», «balor», «tipo»,
# «bersyon», «indeks», «matriks», «ekspresyon», «dimensyon», «punsion»,
# «rehyon», «kolor», «linya», «punto» — plus a handful of English words the
# code itself uses (`renderer`, `input`, `list`, `default`, `mode`). What is
# Pangasinan is the frame around them.
#
# **No plural-category branches.** CLDR has no plural data for `pag`, so a
# `[one]` branch would be text selected by English's rules; and Pangasinan
# leaves a noun unmarked after a numeral anyway, so one form is correct.
# Every `$…Count` and `$count` select is collapsed to a single `*[other]`.
# The explicit numeric literals English forks on are kept where the branch is
# a real distinction rather than a plural rule.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
       *[other] ag-uusaren so { $attributes } no duaran endpoint so nibaga
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
       *[other] ag-uusaren so { $attributes } no nibaga so endpoint tan midpoint ya dua
    }

line-segment-midpoint-offset-without-midpoint = anggapoy epekto na midpointOffset no anggapoy midpoint

## `<line>`

line-points-undetermined-dimensions = Linya ya ondalan ed saray punto ya ag nadeterminaan so dimensyon da.

line-points-too-few-dimensions = Nepeg ya ondalan so linya ed saray punto ya duara nid dimensyon da.

line-points-depend-on-variables = Ondadalan so linya ed saray punto ya akadepende ed saray baryable: { $variables }.

line-equation-invalid-format = Aliwan format na ekwasyon na linya ed saray baryable ya { $variable1 } tan { $variable2 }.

## `<ray>`

ray-overprescribed-through = Say sinag et nibaga ed through, endpoint, tan direction.  Ag-uusaren so nibagan through.

ray-dimension-mismatch = Ag manpaparaan so numDimensions ed sinag.

## `<vector>`

vector-overprescribed-head = Say bektor et nibaga ed head, tail, tan displacement.  Ag-uusaren so nibagan head.

vector-dimension-mismatch = Ag manpaparaan so numDimensions ed bektor.

## Attracting and constraining

attract-to-without-nearest-point = Ag ayari ya iyasingger ed `<{ $component }>` lapud anggapoy nearestPoint a state variable to.

constrain-to-without-nearest-point = Ag ayari ya ipasen ya nasesengeg ed `<{ $component }>` lapud anggapoy nearestPoint a state variable to.

constrain-to-interior-without-nearest-point = Ag ayari ya ipasen ya nasesengeg ed loob na `<{ $component }>` lapud anggapoy nearestPoint a state variable to.

## `<choiceInput>`

choice-input-label-position-ignored = ag-uusaren so labelPosition parad choiceInput ya aliwan inline

## Ordering children by index

choice-input-indices-count-mismatch = Ag-uusaren iray indeks a nibaga parad choiceInput lapud ag manpaparaan so bilang na indeks tan say bilang na saray anak a choice.

pretzel-indices-count-mismatch = Ag-uusaren iray indeks a nibaga parad problem lapud ag manpaparaan so bilang na indeks tan say bilang na saray anak a problem.

shuffle-indices-count-mismatch = Ag-uusaren iray indeks a nibaga parad shuffle lapud ag manpaparaan so bilang na indeks tan say bilang na saray komponente.

indices-ignored-out-of-range = Ag-uusaren iray indeks a nibaga parad { $component } lapud walaray indeks ya paway ed sakop.

pretzel-indices-repeated = Ag-uusaren iray indeks a nibaga parad pretzel lapud walaray indeks ya inulit.

pretzel-circuit-first-index = Ag-uusaren iray indeks a nibaga parad pretzel ed circuit mode lapud nepeg a 1 so unonan indeks.

## `<shuffle>` and `<sort>`

string-children-need-type = Pian ondalan so `<{ $component }>` ed saray anak a string, nepeg a nibaga so atributon `type`.

invalid-type-defaulting-to-math = Aliwan tipo { $type } parad komponenten { $component }. Nepeg a sakey ed math, text, number, odino boolean. Say math so uusaren.

string-not-valid-component-to-arrange = Say string ya "{ $value }" et aliwan komponente ya nayarin { $component }. Ag-uusaren.

## Types and variables

invalid-type-defaulting-to-number = Aliwan tipo { $type }, number so iyan a tipo.

invalid-variable-value = Aliwan balor na sakey a baryable: `{ $value }`

## Variants

variant-index-must-be-number = Nepeg a bilang so indeks na baryante ya { $index }

variant-index-must-be-integer = Nepeg a integer so indeks na baryante ya { $index }

## `<sideBySide>`

side-by-side-absolute-widths = Ag ni nagagawa so `<{ $component }>` parad saray absoluton sukat. Relatibo so iyan a kaawang.

side-by-side-absolute-margins = Ag ni nagagawa so `<{ $component }>` parad saray absoluton sukat. Relatibo so iyan a margin.

side-by-side-no-block-child = Aliwan `<{ $component }>`: nepeg a walay sakey ya anak ton block.

## `<label>`

label-for-ignored-on-graphical = Ag-uusaren so atributon `for` ed grapikon `<label>`.

label-for-must-resolve-to-one = Say atributon `for` ed `<label>` et nepeg ya ontukoy ed sakey labat a komponente.

label-for-unresolved = Ag ayari ya ipatukoy ed sakey a komponente so atributon `for` ed `<label>`.

label-for-answer-with-authored-inputs = Say atributon `for` ed `<label>` et ontutukoy ed `<answer>` ya walaay saray input a sinulat na autor; say input a mismo so tukoyen.

label-for-answer-without-input = Say atributon `for` ed `<label>` et ontutukoy ed `<answer>` ya anggapoy input ya nalabelan.

label-for-must-reference-input-or-answer = Say atributon `for` ed `<label>` et nepeg ya ontukoy ed sakey ya input odino ed sakey ya answer.

## Accessibility

accessibility-short-description-or-decorative = Parad aksesibilidad, nepeg a walaay antikey a deskripsyon so `<{ $component }>` odino nibaga a dekoratibo.

accessibility-video-short-description = Parad aksesibilidad, nepeg a walaay antikey a deskripsyon so `<video>`.

accessibility-input-short-description-or-label = Parad aksesibilidad, nepeg a walaay antikey a deskripsyon odino label so `<{ $component }>`.

accessibility-answer-input-short-description-or-label = Parad aksesibilidad, say `<answer>` ya manggagawa na input et nepeg a walaay antikey a deskripsyon odino label.

accessibility-short-description-contains-math = Ag nepeg a walaay komponente na matematika a singa `<{ $component }>` ed saray antikey a deskripsyon. Isulat ed salita so anggan anton matematika.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Ag magenap so kontraste na { $colorName } parad teksto na ulo na seksion (dark mode) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nepeg a { $threshold }:1 nid).
       *[other] Ag magenap so kontraste na { $colorName } parad teksto na ulo na seksion ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nepeg a { $threshold }:1 nid).
    }

## `<circle>`

circle-through-points-non-numerical = Ag ni nagagawa so `<circle>` ya ondalan ed { $count } a punto sano anggapoy numeron balor da.

circle-too-many-through-points = Ag ayari ya kalkuloen so sirkulo ya ondalan ed masulok ya 3 a punto.

circle-overprescribed-radius-center-points = Ag ayari ya kalkuloen so sirkulo ya walaay nibagan radius, sentro, tan saray punto ya dalanen.

circle-center-with-multiple-points = Ag ayari ya kalkuloen so sirkulo ya walaay nibagan sentro tan ondalan ed masulok ya 1 a punto.

circle-radius-too-small = Ag ayari ya kalkuloen so sirkulo: lapud say kaarawi na duaran punto et { $distance }, say nibagan radius ya { $radius } et masyadon melag.

circle-radius-with-many-points = Ag ayari ya gawaen so sirkulo ya ondalan ed masulok ya duaran punto tan walaay nibagan radius.

circle-invalid-center-or-through-points = Aliwan sentro odino saray punto ya dalanen na sirkulo.

circle-radius-center-with-multiple-points = Ag ayari ya kalkuloen so radius na sirkulo ya walaay nibagan sentro tan ondalan ed masulok ya 1 a punto.

circle-change-radius-non-numerical = Ag ayari ya umanen so radius na sirkulo ya aliwan numero iray punto ya dalanen to

circle-radius-with-points-non-numerical = Ag ayari ya gawaen so sirkulo ya ondalan ed masulok ya sakey a punto tan walaay nibagan radius sano anggapoy numeron balor da.

circle-change-center-non-numerical = Ag ni nagagawa so pangaman ed sentro na sirkulo ya ondalan ed saray punto ya aliwan numero.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
       *[other] Ag magenap so dimensyon na domain na punsion. Say domain et walaay { $intervals } ya interbalo, balet say punsion et walaay { $inputs ->
           *[other] { $inputs } ya input
        }.
    }

function-domain-invalid-format = Aliwan format na domain na punsion.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ag-uusaren so maximum na punsion ya aliwan numero.
        [minimum] Ag-uusaren so minimum na punsion ya aliwan numero.
        [extremum] Ag-uusaren so extremum na punsion ya aliwan numero.
        [point] Ag-uusaren so punto na punsion ya aliwan numero.
        [slope] Ag-uusaren so slope na punsion ya aliwan numero.
       *[other] Ag-uusaren so { $type } na punsion ya aliwan numero.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Ag-uusaren so maximum na punsion ya anggapoy karga.
        [minimum] Ag-uusaren so minimum na punsion ya anggapoy karga.
        [extremum] Ag-uusaren so extremum na punsion ya anggapoy karga.
        [point] Ag-uusaren so punto na punsion ya anggapoy karga.
       *[other] Ag-uusaren so { $type } na punsion ya anggapoy karga.
    }

function-points-too-close = Walaray duaran punto na punsion ya masyadon maasingger so pasen da. Ag ayari ya nadeterminaan so punsion.

function-iterates-input-output-mismatch =
    { $inputs ->
       *[other] Say pangiter ed punsion et nayari labat no say bilang na input to et parehon parehod bilang na output to. Sayan punsion et walaay { $inputs } ya input tan { $outputs ->
           *[other] { $outputs } ya output
        }.
    }

## `<sequence>`

sequence-invalid-length = Aliwan kaandukey na sequence.  Nepeg ya integer ya aliwan negatibo.

sequence-invalid-step = Aliwan step na sequence.  Nepeg a numero parad sequence ya tipon { $type }.

sequence-invalid-endpoint-number = Aliwan "{ $attribute }" na sequence na numero.  Nepeg a numero.

sequence-invalid-endpoint-letters = Aliwan "{ $attribute }" na sequence na letra.  Nepeg a kombinasyon na letra.

sequence-invalid-endpoint = Aliwan "{ $attribute }" na sequence.

select-from-sequence-coprime-not-numbers = ag-uusaren so coprime lapud aliwan numero so pipilien

select-from-sequence-coprime-with-exclude-combinations = ag-uusaren so coprime lapud nibaga so excludeCombinations

## Resolving a `target`

target-not-found = Aliwan target parad `<{ $source }>`: ag naromog so target.

target-state-variable-not-found = Aliwan target parad `<{ $source }>`: ag naromog so state variable ya manngaran na "{ $property }" ed sakey a `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Saray baryable na `<odeSystem>` et nepeg a duma ed independent variable.

ode-system-duplicate-variable-names = Ag ayari ya nadeterminaan iray punsion na ODE RHS ya walaay parehon ngaran na dependent variable.

ode-system-rhs-function-error = Ag ayari ya nadeterminaan so punsion na ODE RHS.  Walay lingo ed panggawa na punsion a mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ag ayari ya nadeterminaan so anggulo ed baetan na { $count } a linya

angle-invalid-through-point = Aliwan punto ed through na `<angle>`

parabola-vertex-too-many-points = Ag ni nagagawa so parabola ya walaay vertex tan ondalan ed masulok ya 1 a punto.

parabola-too-many-points = Ag ni nagagawa so parabola ya ondalan ed masulok ya 3 a punto.

intersection-too-many-items = Ag ni nagagawa so intersection parad masulok ya duaran bengatla

## Other math components

ionic-compound-not-two-ions = Ag ni nagagawa so kompuesto ya ioniko ya aliwan duaran ion.

ionic-compound-needs-cation-and-anion = Say kompuesto ya ioniko et nagagawa labat parad sakey a cation tan sakey ya anion.

solve-equations-cannot-evaluate = Ag ayari ya solbaren so ekwasyon lapud ag ayari ya ebalwaren: { $equation }

math-operators-operand-number-required = Nepeg a nibaga so operandNumber no mangala na operand a matematika.

eigen-decomposition-failed = Ag ayari ya kalkuloen iray eigenvalue na matriks

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
       *[other] `<matchesPattern>`: say parametro ya { $parameters } et ag onaalagey ed pattern, kanian naynay a blangko so natumbok to.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: ag ayari ya natalosan so grid="{ $grid }". Nepeg a none, medium, dense, odino duaran positibon numero ya nisian na espasyo, singa grid="1 0.5". Anggapoy grid ya niyanak.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    Say `<{ $component }>` et mankaukolan na punsion ya walaay { $expected ->
        [1] sakey ya output, say slope ya y' ed kada punto, singa `y - x`
       *[other] duaran output, say bektor ed kada punto, singa `(y, -x)`
    }, balet say inter ya punsion et walaay { $found ->
       *[other] { $found } ya output
    }. { $alternative ->
        [none] Anggapoy niyanak.
       *[other] Say `<{ $alternative }>` so komponente parad satan a punsion. Anggapoy niyanak.
    }

field-function-attribute-ignored-with-child = Ag-uusaren so atributon `function` lapud say punsion et niiter met ed loob na komponente; say walad loob so uusaren. Sakey labat ed saduara so panggawaan na punsion.

field-variables-ignored =
    `<{ $component }>`: say atributon `variables` et manngaran ed saray baryable na ekspresyon ya insulat ed mismon loob na komponente. { $reason ->
        [function-child] Say punsion dia et niiter bilang anak a `<function>`, ya manngaran ed dilin baryable to, kanian ag-uusaren so `variables`.
       *[no-expression] Anggapoy ontan ya ekspresyon dia, kanian ag-uusaren so `variables`.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: ag suportado so xLabelPosition="left" ed prefigure renderer; say kagagawa na right-position so uusaren.

prefigure-y-label-position-unsupported = `<graph>`: ag suportado so yLabelPosition="bottom" ed prefigure renderer; say kagagawa na top-position so uusaren.

prefigure-invalid-axis-bounds = `<graph>`: aliwan saray ketegan na axis parad panagsalat ed prefigure; say default a bbox (-10,-10,10,10) so uusaren.

prefigure-invalid-width = `<graph>`: aliwan kaawang parad panagsalat ed prefigure; say default a kaawang na diagram ya 425 so uusaren.

prefigure-invalid-aspect-ratio = `<graph>`: aliwan aspectRatio parad panagsalat ed prefigure; say default ya aspect ratio ya 1 so uusaren.

prefigure-grid-spacing-too-fine = `<graph>`: masyadon maliit so espasyo na grid parad saray ketegan na axis; ag-uusaren so grid ed prefigure renderer.

prefigure-annotations-not-rendered = `<graph>`: ag niyanak iray annotation no aliwan PreFigure renderer so uusaren.

multiple-annotations-children = Dakel so anak ya `<annotations>` ya naromog ed `<graph>`; ag-uusaren so amin likud ed sampot.

## Referring to other components

copy-unrecognized-component-type = Ag ayari ya paatagayen odino kopyaen so ag abirbir a tipo na komponente: { $type }.

copy-prop-not-found = Ag naromog so prop ya { $property } ed sakey a komponenten tipon { $component }

collect-no-source = Anggapoy naromog a source parad collect.

collect-invalid-component-type = Ag ayari ya tiponen iray komponente ya tipon `<{ $component }>` lapud aliwan tipo na komponente.

reference-index-unavailable = Ag ayari ya tukoyen so indeks ya `{ $reference }`

## `<callAction>`

component-action-unavailable = Ag ayari ya tawagen so { $action } ed komponenten `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Aliwan porma na datos.  Ag manpaparaan so kaandukey na saray hilera. Naromog ed componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Walaray parehon ngaran na kolumna ed datos.  Naromog ed componentIdx :{ $componentIdx }

data-frame-missing-column-name = Anggapoy ngaran na sakey a kolumna ed datos.  Naromog ed componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Say sakey ya award parad sayan answer et akabase ed dilin ebat ya inpawit na mismon answer tag, tan mansumpal itan ed ag iilaloan a kagagawa.

answer-max-num-attempts-in-section-wide-check-work = Anggapoy epekto na pangiyan na `maxNumAttempts` ed sakey ya `<answer>` ya walad loob na kontenedor ya walaay `sectionWideCheckWork`, lapud say kontenedor so mangokontrol ed bilang na sali. Say kontenedor so pangiyanan na `maxNumAttempts`.

nested-section-wide-check-work-max-num-attempts = Anggapoy epekto na pangiyan na `maxNumAttempts` ed kontenedor ya walaay `sectionWideCheckWork` ya walad loob na sananey a kontenedor ya walaay `sectionWideCheckWork`, lapud say paway a kontenedor so mangokontrol ed bilang na sali. Say paway a kontenedor so pangiyanan na `maxNumAttempts`.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
       *[other] Anggapoy epekto na atributon { $attributes } no ag niyan so symbolicEquality.
    }

answer-invalid-type = Aliwan tipo parad answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Lapud anggapoy ngaran na komponenten `<{ $component }>`, ag itan nayarin usaren bilang atributo na module

module-attribute-name-already-defined = Ag nayarin usaren so komponenten `<{ $component } name="{ $name }">` bilang atributo na module lapud say tipon `<module>` et walaan lay atributon "{ $name }".

conditional-content-condition-ignored = Ag-uusaren so atributon `condition` ed sakey a komponenten `<conditionalContent>` ya walaay anak a case odino else.

slider-markers-type-mismatch = Ag manpaparaan so tipo na saray marker tan say tipo na slider.

pretzel-problem-needs-statement-and-answer = Aliwan pretzel: nepeg a walaay sakey a `<statement>` tan sakey a `<answer>` so kada `<problem>`.

pretzel-circuit-first-problem-distractor = Aliwan pretzel: diad mode="circuit", ag nayarin distractor so unonan `<problem>`.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
       *[other] Aliwan balor ya { $values } parad atributon `{ $attribute }`; ag-uusaren.
    }

attribute-must-be-references = Aliwan balor ya `{ $value }` parad atributon `{ $attribute }`. Nepeg ya nagawa so atributo ed saray reference ya ongagapo ed `$`.

math-input-invalid-function-names = <mathInput>: ag-uusaren iray aliwan ngaran na punsion ed { $attribute }: { $names }. Nepeg a duara nid karakter so segment ya nanengneng na kada ngaran (letra odino gitlingan); nayarin ontumbok so `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Aliwan tipo na komponente: `<{ $componentType }>`

attribute-repeated = Ag nayarin uliten so atributon { $attribute }.

attribute-invalid-for-component = Aliwan atributon "{ $attribute }" parad sakey a komponenten tipon `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Say style definition ya { $styleNumber } et ag magenap so kontraste to parad { $context ->
        [text-on-background] kolor na teksto sumpad kolor na beneg
        [high-contrast] kolor ya atagey so kontraste sumpad canvas
        [line] kolor na linya sumpad canvas
        [marker] kolor na marker sumpad canvas
       *[text-on-canvas] kolor na teksto sumpad canvas
    }{ $mode ->
        [dark] { " (dark mode)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nepeg a { $threshold }:1 nid).

style-definition-dark-mode-text-background-contrast =
    Anggaman ta say style definition ya { $styleNumber } et walaay saray kolor ya magenap so kontraste da parad light mode, saray kolor ed dark mode ya nanlapud saraya et ag magenap so kontraste na kolor na teksto sumpad kolor na beneg ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nepeg a { $threshold }:1 nid). { $suggestion ->
        [available] Pian magenap so kontraste ed dark mode, paatagayen so kontraste ed light mode (alimbawa, iyan so { $lightAttribute }="{ $lightColor }") odino salatan so kolor ed dark mode (alimbawa, iyan so { $darkAttribute }="{ $darkColor }").
       *[none] Pian magenap so kontraste ed dark mode, paatagayen so kontraste ed light mode odino salatan iray nanlapuan a kolor ed textColorDarkMode tan/odino backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Anggaman ta say style definition ya { $styleNumber } et walaay kolor na teksto ya magenap so kontraste to parad light mode, say kolor na teksto ed dark mode ya nanlapud satan et ag magenap so kontraste to sumpad canvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nepeg a { $threshold }:1 nid). { $suggestion ->
        [available] Pian magenap so kontraste ed dark mode, paatagayen so kontraste ed light mode (alimbawa, iyan so textColor="{ $lightColor }") odino salatan so kolor ed dark mode (alimbawa, iyan so textColorDarkMode="{ $darkColor }").
       *[none] Pian magenap so kontraste ed dark mode, paatagayen so kontraste ed light mode odino salatan so nanlapuan a kolor ed textColorDarkMode.
    }

section-multiple-style-palettes = Sakey labat a <stylePalette> so nayarin pilien na sakey a seksion; say sampot so uusaren.

## Unique variants

variant-num-to-select-not-non-negative-integer = ag nadeterminaan iray unique variant na { $component } lapud say numToSelect et aliwan integer ya ag negatibo.

variant-num-to-select-not-constant-number = ag nadeterminaan iray unique variant na { $component } lapud say numToSelect et aliwan konstante a numero.

variant-with-replacement-not-constant-boolean = ag nadeterminaan iray unique variant na { $component } lapud say withReplacement et aliwan konstante a boolean.

variant-select-weight-disables-unique = Ag ayari iray unique variant parad select no walay opsyon ya walaay nibagan selectWeight odino selectForVariants

variant-coprime-undetermined = ag nadeterminaan iray unique variant na { $component } lapud ag nadeterminaan no naynay a false so coprime.

variant-attribute-not-constant = ag nadeterminaan iray unique variant na { $component } lapud say { $attribute } et aliwan konstante.

variant-attribute-not-number = ag nadeterminaan iray unique variant na { $component } lapud say { $attribute } et aliwan numero.

variant-attribute-wrong-type-for-sequence =
    ag nadeterminaan iray unique variant na { $component } ya tipon { $type } lapud say { $attribute } et aliwan { $expected ->
        [letters-combination] kombinasyon na letra
        [math-expression] duga ya ekspresyon a matematika
        [integer] integer
       *[number] numero
    }.

variant-length-not-integer = ag nadeterminaan iray unique variant na { $component } lapud say length et aliwan integer.

variant-sort-not-implemented = ag ni nagagawa iray unique variant na sakey a { $component } ya walaay sort

variant-exclude-combinations-not-implemented = ag ni nagagawa iray unique variant na sakey a { $component } ya walaay excludeCombinations

variant-math-exclude-not-implemented = ag ni nagagawa iray unique variant na sakey a { $component } ya tipon math ya walaay exclude

variant-non-constant-exclude-not-implemented = ag ni nagagawa iray unique variant na sakey a { $component } ya aliwan konstante so exclude

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ag suportado ed graph prefigure renderer; nilaktawan so kabiangan.

prefigure-descendant-invalid-geometry = { $subject }: ag naanggaan odino ag nasumpal a geometriya; nilaktawan so kabiangan.

prefigure-curve-label-omitted = { $subject }: ag suportado iray label ed saray asalatan a curve; ag-uusaren so label.

prefigure-curve-unsupported-definition-type = { $subject }: ag suportadon tipo na definition na curve ya '{ $definitionType }'; nilaktawan so kabiangan.

prefigure-region-flip-functions-unsupported = { $subject }: ag suportadon atributon flipFunctions ed regionBetweenCurves; nilaktawan so kabiangan.

prefigure-region-non-formula-child = { $subject }: saray anak a punsion ya tipon formula labat so suportado ed regionBetweenCurves; nilaktawan so kabiangan.

prefigure-label-position-unsupported =
    { $subject }: ag suportadon labelPosition ya '{ $labelPosition }' parad { $labelKind ->
        [line-family] label na pamilya na linya
       *[point] label na punto
    }; say default a pakaparaan na PreFigure so uusaren.

prefigure-fill-style-unsupported = { $subject }: ag suportado na PreFigure so fill style ya '{ $fillStyle }'; solidon punoan so uusaren.

prefigure-line-style-unknown = { $subject }: ag kabat a line style ya '{ $lineStyle }'; ag-uusaren ed output na PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: say marker style ya '{ $markerStyle }' et niyalis ed style na PreFigure ya 'diamond'.

prefigure-marker-style-unsupported = { $subject }: ag suportado na PreFigure so marker style ya '{ $markerStyle }'; say default a style so uusaren.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: aliwan `ref`; ag ayari ya naromog so target. Ag-uusaren so annotation.

annotation-ref-multiple-targets = `<annotation>`: dakel so naromog a target na `ref`; say unonan target so uusaren.

annotation-ref-outside-graph = `<annotation>`: aliwan `ref`; say target et paway ed graph ya kaiba to. Ag-uusaren so annotation.

annotation-ref-unsupported-target = `<annotation>`: aliwan `ref`; say target et aliwan suportadon grapikon bengatla ed panagsalat ed prefigure. Ag-uusaren so annotation.

annotation-text-missing = `<annotation>`: anggapo odino blangko so `text`; blangkon teksto so niyanak.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Walay naromog ya sirkular a dependency.
       *[other] Walay naromog ya sirkular a dependency ya akaiba so komponenten `<{ $componentType }>`.
    }

reference-no-referent = Anggapoy naromog a tutukoyen na reference: `{ $reference }`

reference-multiple-referents = Dakel so naromog a tutukoyen na reference: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Aliwan format na atributon { $attribute } na `<{ $componentType }>`.

children-invalid = Aliwan anak parad `<{ $componentType }>`: Naromog iray aliwan anak: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Aliwan balor ya `{ $value }` parad atributon `{ $attribute }`, say balor ya `{ $default }` so uusaren

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Ag naromog so bersyon na DoenetML ya { $version }.
       *[other] Ag naromog so bersyon na DoenetML ya { $version }. Say bersyon ya { $fallback } so uusaren
    }

## Reading the DoenetML

parse-invalid-doenetml = Aliwan DoenetML: { $content }

parse-tag-missing-close-tag = Aliwan DoenetML: Anggapoy panagsara na tag ya `{ $tag }`. Nepeg a sakey a self-closing a tag odino sakey a `</{ $tagName }>` a tag.

parse-tag-error = Aliwan DoenetML: Walay lingo ed tag ya `<{ $tagName }>`

parse-attribute-missing-value = Aliwan DoenetML: Say aliwan atributon `{ $attribute }` et singa anggapoy balor to.

parse-attribute-invalid = Aliwan DoenetML: Aliwan atributon `{ $attribute }`

parse-attribute-value-invalid = Aliwan DoenetML: Aliwan balor na atributon `{ $value }`

parse-attribute-value-quote-mismatch = Aliwan DoenetML: Aliwan balor na atributon `{ $value }`. Ag manpaparaan iray marka na sipi. Singa anggapoy sakey a `{ $quote }`

parse-open-tag-name-missing = Aliwan DoenetML: Walay naromog a tag ya anggapoy ngaran to, alimbawa `<`

parse-tag-not-closed = Aliwan DoenetML: Ag asaraan so tag ya `{ $tag }` (singa anggapoy `>`).

parse-self-closing-tag-name-missing = Aliwan DoenetML: Walay naromog a tag ya anggapoy ngaran to `<{ $content }>`

parse-self-closing-tag-not-closed = Aliwan DoenetML: Ag asaraan so tag ya `{ $tag }` (singa anggapoy `/>`).

parse-tag-invalid-attributes = Aliwan DoenetML: Aliwa so tag ya `{ $tag }`. Nayarin aliwa iray atributo to.

parse-close-tag-name-missing = Aliwan DoenetML: Walay naromog a panagsara ya tag ya anggapoy ngaran to, alimbawa `</`

parse-attribute-value-unquoted = Nepeg ya walad loob na sipi iray balor na atributo: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Aliwan DoenetML: Naromog so panagsara ya tag ya `{ $tag }`, balet anggapoy toon panaglukas a tag

parse-close-tag-mismatched = Aliwan DoenetML: Ag manpaparaan so panagsara ya tag. Say ilaloan et `</{ $expected }>`. Say naromog et `{ $found }`

parser-node-unconvertible = Ag ayari ya salatan so node ya { $node } bilang Dast node.

## Names

name-attribute-invalid =
    Aliwan atributon name='{ $name }'. { $reason ->
        [characters] Saray ngaran et nayarin walaay letra, numero, underscore odino gitlingan labat.
       *[start] Nepeg ya ongapo ed letra iray ngaran.
    }

component-name-invalid-start = Aliwan ngaran na komponente ya "{ $name }". Nepeg ya ongapo ed letra iray ngaran.

## `<answer>` sugar

answer-video-watched-missing-video = Say answer ya tipon videoWatched et nepeg a walaay atributon video

answer-video-watched-video-not-reference = Say answer ya tipon videoWatched et nepeg a say atributon video to et sakey a reference

answer-name-not-single-text = Say atributon name na answer et nepeg a walaay sakey labat ya anak a text

## Referencing another document

external-doenetml-recursion-limit = Ag ayari ya naala so paway a DoenetML lapud masyadon dakel so lebel na rekursion. Kasin walay sirkular a reference?

external-doenetml-unavailable = Ag ayari ya naala so DoenetML manlapud { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Aliwan DoenetML so naala manlapud { $attribute }="{ $uri }": ag manpaparaan ed tipo na komponenten "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Deprecated lay atributon `{ $from }`; say `{ $to }` so usaren.
       *[other] [deprecation] Deprecated lay atributon `{ $from }` ed `<{ $component }>`; say `{ $to }` so usaren.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Deprecated lay atributon `{ $from }` tan ag-uusaren lapud nibaga met so `{ $to }`.
       *[other] [deprecation] Deprecated lay atributon `{ $from }` ed `<{ $component }>` tan ag-uusaren lapud nibaga met so `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Deprecated lay atributon `{ $attribute }` ed `<{ $component }>` tan ag-uusaren.

deprecated-attribute-to-child = [deprecation] Deprecated lay atributon `{ $attribute }` ed `<{ $component }>`; sakey ya anak a `<{ $child }>` so usaren.

deprecated-attribute-value-renamed = [deprecation] Deprecated lay balor ya `{ $value }` na atributon `{ $attribute }` ed `<{ $component }>`; say `{ $to }` so usaren.


## Language coverage

pluralize-english-only = Say `<pluralize>` et nayarin manggawa na pangaruman labat ed Ingles, kanian ag nauman so teksto to ed sakey a dokumento ya insulat ed { $locale }. Isulat a mismo so porman dakel, odino iyan itan ed atributon `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Say elementon `<{ $tag }>` et aliwan abirbir ya elemento na Doenet.

schema-element-not-allowed-at-root = Ag abuloyan so elementon `<{ $tag }>` ed lamot na dokumento.

schema-element-not-allowed-inside = Ag abuloyan so elementon `<{ $tag }>` ed loob na `<{ $parent }>`.

schema-attribute-unrecognized = Say elementon `<{ $tag }>` et anggapoy atributo ton manngaran na `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Say atributon `{ $attribute }` na elementon `<{ $tag }>` et nepeg a sakey a lista ya kada item to et sakey ed: { $allowed }
       *[other] Say atributon `{ $attribute }` na elementon `<{ $tag }>` et nepeg a sakey ed: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Aliwan ngaran na baryante parad select.  Say ngaran na baryante ya { $variantName } et onaalagey ed { $numOptions } ya opsyon balet say bilang ya pilien et { $numToSelect }.

select-variant-name-without-options = Walaray baryante ya nibaga parad select balet anggapoy opsyon ya nibaga parad posiblin ngaran na baryante: { $variantName }.

select-variant-name-not-possible = Say ngaran na baryante ya { $variantName } ya nibaga parad select et aliwan posiblin ngaran na baryante.

select-too-few-options = Ag ayari ya pilien so { $numToSelect } a komponente ed { $numOptions } labat.

select-from-sequence-too-few-values = Ag ayari ya pilien so { $numToSelect } a balor ed sequence ya { $length } so kaandukey to.

select-from-sequence-indices-count-mismatch = Nepeg a manpaparaan so bilang na indeks a nibaga parad select tan say bilang ya pilien

select-from-sequence-indices-not-integers = Nepeg ya integer so amin ya indeks a nibaga parad select

select-from-sequence-index-excluded = Nibaga so indeks na selectfromsequence ya niekal

select-from-sequence-indices-excluded-combination = Nibaga iray indeks na selectfromsequence ya niekal a kombinasyon

select-from-sequence-coprime-not-positive-integers = Ag ayari ya pilien iray coprime a kombinasyon lapud aliwan positibon integer so pipilien.

select-from-sequence-coprime-common-factor = Ag ayari ya pilien iray coprime a numero. Amin a posiblin balor et walaay parehon paktor. (Nepeg a coprime ed "step" iray nibagan balor na "from" odino "to".)

select-from-sequence-coprime-single-number = Ag ayari ya pilien iray coprime a kombinasyon ed sakey a numero ya aliwan 1.

select-from-sequence-excluded-too-many-combinations = Niekal so masulok ya 70% na saray kombinasyon ed selectFromSequence

select-from-sequence-coprime-none-found = Ag ayari ya nipili iray coprime a numero. Amin a posiblin balor et walaay parehon paktor.

select-from-sequence-too-few-unique-values = Ag ayari ya pilien so { $numToSelect } a bukbukor a balor ed sequence ya { $numPossibleValues } so kaandukey to

select-prime-numbers-too-few-values = Ag ayari ya pilien so { $numToSelect } a balor ed lista na saray prime ya { $numValues } so kaandukey to

select-prime-numbers-values-count-mismatch = Nepeg a manpaparaan so bilang na balor a nibaga parad select tan say bilang ya pilien

select-prime-numbers-values-not-prime = Nepeg a walad lista na saray prime so amin a balor a nibaga parad select prime number

select-prime-numbers-values-excluded-combination = Nibaga iray balor na selectPrimeNumbers ya niekal a kombinasyon

select-prime-numbers-excluded-too-many-combinations = Niekal so masulok ya 70% na saray kombinasyon ed selectPrimeNumbers

select-random-combination-fluke = Lapud alay-bengat ya suerte, ag ayari ya nipili so kombinasyon na saray random a balor

select-random-value-fluke = Lapud alay-bengat ya suerte, ag ayari ya nipili so random a balor

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] Ag nipanengneng iyan `<{ $component }>` lapud walad loob na matematika tan aliwan `inline`. Iyarum so `inline` pian magmaliw a drop-down list, ya onkasi ed loob na sakey ya ekspresyon.
        [expanded] Ag nipanengneng iyan `<{ $component }>` lapud walad loob na matematika tan `expanded`. Ekalen so `expanded`; ag onkasi ed loob na sakey ya ekspresyon so kahon ya dakel so linya to.
        [on-graph] Ag nipanengneng iyan `<{ $component }>` lapud walad loob na matematika ya niyanak ed sakey a graph, ya anggapoy pasen parad input.
       *[relative-width] Ag nipanengneng iyan `<{ $component }>` lapud walad loob na matematika tan relatibo so kaawang to. Iyan so kaawang ed absoluton sukat, singa `px`.
    }

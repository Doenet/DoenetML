# Northern Frisian (Nordfriisk) diagnostics, in the **Mooring** variety
# (Frasch, Bökingharde). Translated from `locales/en/diagnostics.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and orthography.** Latin script. **`frr` is a tag over a cluster of
# dialects, not one language with one spelling**: Mooring, Fering, Öömrang,
# Sölring and the Halligfrasch, Wiedingharder and Karrharder varieties each
# have their own orthography and lexicon. This file is **Mooring** throughout,
# following the *Frasch-Tjüsch Uurdebök* (Sjölin, Århammar & Wilts, Nordfriisk
# Instituut) and the Mooring school grammar, because Mooring is the variety
# with the fullest published dictionary and grammar. See `chrome.ftl` for the
# full note.
#
# **What is the language's own**: «as» / «san» for the copula, the negator
# **«ai»**, «nian» for *no/none*, «nönt» for *nothing*, «än» for *and*, «of»
# for *or*, «wan» for *if*, «wiil» for *because*, «mötj» for *must*, «koon ai»
# for *cannot*, «fäler» for *error*, «riege» for *line*, «taal» for *number*,
# «bookstoowe» for *letter*, «noome» for *name*, «wäärd» for *value*, «ai
# jülti» for *invalid*.
#
# **What is borrowed, and from where**: every mathematical and computing noun
# — «komponänt», «atribut», «wariable», «interwaal», «matriks», «funktjoon»,
# «tustånswariable» — is German, respelled to Mooring. Northern Frisian has no
# technical register of its own, and German is the language a North Frisian
# speaker is schooled in and reads mathematics in. That is the weakest part of
# this catalog and where a reviewer should start; after that, the participle
# and word order in the long sentences.
#
# **Counts.** CLDR has **no plural data for `frr` at all**, so no plural
# category can be selected here. This file writes **no** `[zero]`, `[two]`,
# `[few]` or `[many]` branch anywhere, and the English singular/plural splits
# are collapsed into one form — `line-segment-attributes-ignored-*`,
# `matches-pattern-parameter-not-in-pattern`, `attribute-invalid-values`,
# `answer-attributes-need-symbolic-equality`, the two `function-*` counts. The
# **one** `[one]` branch that is kept is in `field-function-wrong-num-outputs`,
# on `$expected`: that selector is not a plural at all but a two-way choice
# between two different components — a slope field wants one output, a vector
# field two — and the branches say different things rather than the same thing
# in two numbers. Dropping it would lose the message.
#
# **Digits.** Every number renders in Latin digits, so the digits written into
# prose here are Latin digits too.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `styleNumber`,
# `selectFromSequence`, `<answer>`, `maxNumAttempts`, `sectionWideCheckWork` —
# are part of the language, not prose, and stay in English exactly as written.
# So does anything quoted back from the author's own source, and so do
# `WCAG AA`, `DoenetML`, `PreFigure`, `prefigure`, `XML`, `mathjs` and `Dast`,
# which are names. Every **symbolic** selector — `$type`, `$mode`, `$reason`,
# `$context`, `$suggestion`, `$alternative`, `$fallback`, `$expected`,
# `$labelKind`, `$isList`, `$componentType` — is kept byte for byte from
# English, keys included.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } woort ouerseen, wan twäär äänepunkte önjdeen san

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } woort ouerseen, wan en äänepunkt än en madelpunkt bede önjdeen san

line-segment-midpoint-offset-without-midpoint = midpointOffset hää nian wirking sunner en madelpunkt

## `<line>`

line-points-undetermined-dimensions = Räägd troch punkte ma ai fäästleiden dimensioone.

line-points-too-few-dimensions = Jü räägd mötj troch punkte ma tumänst twäär dimensioone gunge.

line-points-depend-on-variables = Jü räägd gungt troch punkte, wat foon wariable ouhinge: { $variables }.

line-equation-invalid-format = Ai jülti formaat för jü gliking foon jü räägd önj da wariable { $variable1 } än { $variable2 }.

## `<ray>`

ray-overprescribed-through = Di strool as troch through, endpoint än direction fäästleit.  Dåt önjdiene through woort ouerseen.

ray-dimension-mismatch = numDimensions paset önj di strool ai toop.

## `<vector>`

vector-overprescribed-head = Di wektoor as troch head, tail än displacement fäästleit.  Dåt önjdiene head woort ouerseen.

vector-dimension-mismatch = numDimensions paset önj di wektoor ai toop.

## Attracting and constraining

attract-to-without-nearest-point = Koon ai üüb en `<{ $component }>` täägen wårde, wiil dåt nian nearestPoint-tustånswariable hää.

constrain-to-without-nearest-point = Koon ai üüb en `<{ $component }>` iinjgränset wårde, wiil dåt nian nearestPoint-tustånswariable hää.

constrain-to-interior-without-nearest-point = Koon ai üüb dåt inerst foon en `<{ $component }>` iinjgränset wårde, wiil dåt nian nearestPoint-tustånswariable hää.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition woort bai en ai-inline choiceInput ouerseen

## Ordering children by index

choice-input-indices-count-mismatch = Da indekse för choiceInput wårde ouerseen, wiil dåt taal foon da indekse ai tu dåt taal foon da ütsääke-bjarne paset.

pretzel-indices-count-mismatch = Da indekse för problem wårde ouerseen, wiil dåt taal foon da indekse ai tu dåt taal foon da problem-bjarne paset.

shuffle-indices-count-mismatch = Da indekse för shuffle wårde ouerseen, wiil dåt taal foon da indekse ai tu dåt taal foon da komponänte paset.

indices-ignored-out-of-range = Da indekse för { $component } wårde ouerseen, wiil sam indekse bütenouer dåt gebiit san.

pretzel-indices-repeated = Da indekse för pretzel wårde ouerseen, wiil sam indekse dubelt san.

pretzel-circuit-first-index = Da indekse för pretzel önj di circuit-moodus wårde ouerseen, wiil di iarst indeks 1 weese mötj.

## `<shuffle>` and `<sort>`

string-children-need-type = Dåt `<{ $component }>` ma tiikenkääde-bjarne wirket, mötj en `type`-atribut önjdeen weese.

invalid-type-defaulting-to-math = Ai jülti type { $type } för di komponänt { $component }. Mötj ån foon math, text, number of boolean weese. Der woort math nümen.

string-not-valid-component-to-arrange = Jü tiikenkääde "{ $value }" as nian jülti komponänt för { $component }. Woort ouerseen.

## Types and variables

invalid-type-defaulting-to-number = Ai jülti type { $type }, di slach woort üüb number saat.

invalid-variable-value = Ai jülti wäärd foon en wariable: `{ $value }`

## Variants

variant-index-must-be-number = Di wariant-indeks { $index } mötj en taal weese

variant-index-must-be-integer = Di wariant-indeks { $index } mötj en hialtaal weese

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` as för absoluute mååte ai ümsaat. Jü brääde woort üüb relatiif saat.

side-by-side-absolute-margins = `<{ $component }>` as för absoluute mååte ai ümsaat. Da roone wårde üüb relatiif saat.

side-by-side-no-block-child = Ai jülti `<{ $component }>`: dåt mötj tumänst ån blok-bjarn hääwe.

## `<label>`

label-for-ignored-on-graphical = Dåt `for`-atribut bai en grafisk `<label>` woort ouerseen.

label-for-must-resolve-to-one = Dåt `for`-atribut bai en `<label>` mötj krååk ån komponänt jeewe.

label-for-unresolved = Dåt `for`-atribut bai en `<label>` hää ai üüb en komponänt aptäält wårde koon.

label-for-answer-with-authored-inputs = Dåt `for`-atribut bai en `<label>` wiset üüb en `<answer>` ma ütdrükelk schrewene iinjgoowe; wise diräkt üüb jü iinjgoow.

label-for-answer-without-input = Dåt `for`-atribut bai en `<label>` wiset üüb en `<answer>` sunner iinjgoow tu't beeteekenen.

label-for-must-reference-input-or-answer = Dåt `for`-atribut bai en `<label>` mötj üüb en iinjgoow of en answer wise.

## Accessibility

accessibility-short-description-or-decorative = För jü tugöngelkhaid mötj `<{ $component }>` of en kurt beeschriwing hääwe of as dekoratiif önjdeen weese.

accessibility-video-short-description = För jü tugöngelkhaid mötj `<video>` en kurt beeschriwing hääwe.

accessibility-input-short-description-or-label = För jü tugöngelkhaid mötj `<{ $component }>` en kurt beeschriwing of en label hääwe.

accessibility-answer-input-short-description-or-label = För jü tugöngelkhaid mötj en `<answer>`, wat en iinjgoow måget, en kurt beeschriwing of en label hääwe.

accessibility-short-description-contains-math = Kurt beeschriwinge schul nian mate-komponänte as `<{ $component }>` deerin hääwe. Schriiw jü matematiik ma wurde üt.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } hää tu min kontrast för di täkst foon di afsnit-tiitel (jüster moodus) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ferloonget tumänst { $threshold }:1).
       *[other] { $colorName } hää tu min kontrast för di täkst foon di afsnit-tiitel ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ferloonget tumänst { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = En `<circle>` troch { $count } punkte as ai ümsaat för di fål, wobai da punkte nian numeerisk wäärde hääwe.

circle-too-many-through-points = En sirkel troch mör as 3 punkte koon ai reeknet wårde.

circle-overprescribed-radius-center-points = En sirkel ma önjdiene radius, madelpunkt än troochgungspunkte koon ai reeknet wårde.

circle-center-with-multiple-points = En sirkel ma önjdiene madelpunkt troch mör as 1 punkt koon ai reeknet wårde.

circle-radius-too-small = Di sirkel koon ai reeknet wårde: wiil di ouston twasken da twäär punkte { $distance } as, as di önjdiene radius { $radius } tu latj.

circle-radius-with-many-points = En sirkel troch mör as twäär punkte ma en önjdiene radius koon ai måget wårde.

circle-invalid-center-or-through-points = Ai jülti madelpunkt of ai jülti troochgungspunkte foon di sirkel.

circle-radius-center-with-multiple-points = Di radius foon en sirkel ma önjdiene madelpunkt troch mör as 1 punkt koon ai reeknet wårde.

circle-change-radius-non-numerical = Di radius foon en sirkel ma ai-numeerisk troochgungspunkte koon ai feroonered wårde

circle-radius-with-points-non-numerical = En sirkel troch mör as ån punkt ma en önjdiene radius koon ai måget wårde, wan der nian numeerisk wäärde san.

circle-change-center-non-numerical = Dåt feroonern foon di madelpunkt foon en sirkel troch punkte sunner numeerisk wäärde as ai ümsaat.

## `<function>`

# CLDR has no plural rules for `frr`, so the two counts read with one form.
function-domain-insufficient-dimensions = Tu min dimensioone för dåt definitjoonsgebiit foon jü funktjoon. Dåt gebiit hää { $intervals } interwaale, man jü funktjoon hää { $inputs } iinjgoowe.

function-domain-invalid-format = Ai jülti formaat för dåt definitjoonsgebiit foon jü funktjoon.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Dåt ai-numeerisk maksimum foon jü funktjoon woort ouerseen.
        [minimum] Dåt ai-numeerisk minimum foon jü funktjoon woort ouerseen.
        [extremum] Dåt ai-numeerisk ekstreemum foon jü funktjoon woort ouerseen.
        [point] Di ai-numeerisk punkt foon jü funktjoon woort ouerseen.
        [slope] Jü ai-numeerisk stiginge foon jü funktjoon woort ouerseen.
       *[other] Dåt ai-numeerisk { $type } foon jü funktjoon woort ouerseen.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Dåt lääsi maksimum foon jü funktjoon woort ouerseen.
        [minimum] Dåt lääsi minimum foon jü funktjoon woort ouerseen.
        [extremum] Dåt lääsi ekstreemum foon jü funktjoon woort ouerseen.
        [point] Di lääsi punkt foon jü funktjoon woort ouerseen.
       *[other] Dåt lääsi { $type } foon jü funktjoon woort ouerseen.
    }

function-points-too-close = Jü funktjoon hää twäär punkte, wat tu tächt bianuur lade. Jü funktjoon koon ai fäästleit wårde.

# One form for both counts: CLDR has no plural rules for `frr`.
function-iterates-input-output-mismatch = Iteratsjoone foon en funktjoon san bloot müügelk, wan dåt taal foon da iinjgoowe glik as dåt taal foon da ütgoowe. Jüdeer funktjoon hää { $inputs } iinjgoowe än { $outputs } ütgoowe.

## `<sequence>`

sequence-invalid-length = Ai jülti loongde foon jü riege.  Mötj en ai-negatiif hialtaal weese.

sequence-invalid-step = Ai jülti stap foon jü riege.  Mötj en taal weese för en riege foon di slach { $type }.

sequence-invalid-endpoint-number = Ai jülti "{ $attribute }" foon en taalriege.  Mötj en taal weese.

sequence-invalid-endpoint-letters = Ai jülti "{ $attribute }" foon en bookstoowenriege.  Mötj en bookstoowen-kombinatsjoon weese.

sequence-invalid-endpoint = Ai jülti "{ $attribute }" foon jü riege.

select-from-sequence-coprime-not-numbers = coprime woort ouerseen, wiil der nian taale ütsäked wårde

select-from-sequence-coprime-with-exclude-combinations = coprime woort ouerseen, wiil excludeCombinations önjdeen as

## Resolving a `target`

target-not-found = Ai jülti target för `<{ $source }>`: dåt mäl koon ai fünen wårde.

target-state-variable-not-found = Ai jülti target för `<{ $source }>`: der jeft nian tustånswariable ma di noome "{ $property }" bai en `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Da wariable foon en `<odeSystem>` mötje uur weese as jü unouhinge wariable.

ode-system-duplicate-variable-names = ODE-RHS-funktjoone ma dubelt ouhinge wariablennoome koone ai fäästleit wårde.

ode-system-rhs-function-error = Jü ODE-RHS-funktjoon koon ai fäästleit wårde.  Fäler bai't måågen foon jü mathjs-funktjoon.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = En hörn twasken { $count } räägde koon ai fäästleit wårde

angle-invalid-through-point = Ai jülti punkt önj dåt through foon en `<angle>`

parabola-vertex-too-many-points = En parabel ma en toppunkt troch mör as 1 punkt as ai ümsaat.

parabola-too-many-points = En parabel troch mör as 3 punkte as ai ümsaat.

intersection-too-many-items = Di snit foon mör as twäär elemente as ai ümsaat

## Other math components

ionic-compound-not-two-ions = Ioonferbininge ma hocht ööders as twäär ioone san ai ümsaat.

ionic-compound-needs-cation-and-anion = Jü ioonferbining as bloot för ån katioon än ån anioon ümsaat.

solve-equations-cannot-evaluate = Jü gliking koon ai lööst wårde, wiil jü ai ütwäärded wårde küüs: { $equation }

math-operators-operand-number-required = Der mötj en operandNumber önjdeen wårde, wan en mate-operand ütnümen woort.

eigen-decomposition-failed = Da äigenwäärde foon jü matriks hääwe ai reeknet wårde koon

## `<matchesPattern>`

# One form for the count: CLDR has no plural rules for `frr`.
matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: { $parameters } kaamt önj dåt muster ai föör, deeruum paset dåt åltensen üüb en lek.

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" koon ai üttjüded wårde. Dåt mötj none, medium, dense of twäär positiif taale ma en lääsitiiken deertwasken weese, tu't biispal grid="1 0.5". Der woort nian gater teegend.

## `<slopeField>` and `<vectorField>`

# The `$expected` branch is kept even though CLDR has no plural rules for
# `frr`: it is not a plural but a two-way choice between two components — a
# slope field wants one output, a vector field two — and the two branches say
# different things. The `$found` count, which is a real plural, reads with one
# form.
field-function-wrong-num-outputs =
    `<{ $component }>` bruket en funktjoon ma { $expected ->
        [one] ån ütgoow, jü stiginge y' bai arken punkt, tu't biispal `y - x`
       *[other] twäär ütgoowe, di wektoor bai arken punkt, tu't biispal `(y, -x)`
    }, man jü diene funktjoon hää { $found } ütgoowe. { $alternative ->
        [none] Der woort nönt teegend.
       *[other] `<{ $alternative }>` as di komponänt för jüdeer funktjoon. Der woort nönt teegend.
    }

field-function-attribute-ignored-with-child = Dåt `function`-atribut woort ouerseen, wiil jü funktjoon uk önjbinen di komponänt dien as; jü inerst woort nümen. Dii jü funktjoon bloot üüb ån foon da twäär wise.

field-variables-ignored =
    `<{ $component }>`: dåt `variables`-atribut näämt da wariable foon en ütdrük, wat diräkt önjbinen di komponänt schrewen as. { $reason ->
        [function-child] Jü funktjoon as hir as `<function>`-bjarn dien, wat sin äine wariable näämt, deeruum woort `variables` ouerseen.
       *[no-expression] Der jeft hir nian süken ütdrük, deeruum woort `variables` ouerseen.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" woort önj di prefigure-renderer ai understaad; der woort dåt önjhoolen foon jü rachter positsjoon nümen.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" woort önj di prefigure-renderer ai understaad; der woort dåt önjhoolen foon jü böögest positsjoon nümen.

prefigure-invalid-axis-bounds = `<graph>`: ai jülti askegränse för jü prefigure-ümsätang; der woort jü standard-bbox (-10,-10,10,10) nümen.

prefigure-invalid-width = `<graph>`: ai jülti brääde för jü prefigure-ümsätang; der woort jü standard-diagrambrääde 425 nümen.

prefigure-invalid-aspect-ratio = `<graph>`: ai jülti aspectRatio för jü prefigure-ümsätang; der woort dåt standard-sidjenferhölnis 1 nümen.

prefigure-grid-spacing-too-fine = `<graph>`: jü gaterwidj as tu fin för da askegränse; dåt gater woort önj di prefigure-renderer wächleeten.

prefigure-annotations-not-rendered = `<graph>`: beemerkinge wårde ai wiset, wan ai di PreFigure-renderer nümen woort.

multiple-annotations-children = Der san moor `<annotations>`-bjarne önj dåt `<graph>` fünen wurden; ål bütentu dåt lääst wårde ouerseen.

## Referring to other components

copy-unrecognized-component-type = En unbekäänd komponänt-slach koon ai ütwidered of kopiard wårde: { $type }.

copy-prop-not-found = Di prop { $property } as bai en komponänt foon di slach { $component } ai fünen wurden

collect-no-source = För collect as nian kwäl fünen wurden.

collect-invalid-component-type = Komponänte foon di slach `<{ $component }>` koone ai samled wårde, wiil dåt nian jülti komponänt-slach as.

reference-index-unavailable = Di indeks `{ $reference }` koon ai referensiard wårde

## `<callAction>`

component-action-unavailable = { $action } koon bai di komponänt `{ $reference }` ai anroopen wårde

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Da daate hääwe en ai jülti form.  Da riege hääwe uungliike loongde. Fünen önj componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Da daate hääwe dubelt spooltnoome.  Fünen önj componentIdx :{ $componentIdx }

data-frame-missing-column-name = Da daate mangelt en spooltnoome.  Fünen önj componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = En award foon jüdeer aantwurd bauet üüb jü äine stjüürde aantwurd foon dåt answer-tag ap, wat tu unferwååchtet önjhoolen fiart.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` bai en `<answer>` önjbinen en behuulder ma `sectionWideCheckWork` tu säten hää nian wirking, wiil dåt taal foon da försäke foon di behuulder stjüürd woort. Sat `maxNumAttempts` deerför bai di behuulder.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` bai en behuulder ma `sectionWideCheckWork`, wat önjbinen en uur behuulder ma `sectionWideCheckWork` as, tu säten hää nian wirking, wiil dåt taal foon da försäke foon di bütenst behuulder stjüürd woort. Sat `maxNumAttempts` deerför bai di bütenst behuulder.

# One form for the count: CLDR has no plural rules for `frr`.
answer-attributes-need-symbolic-equality = { $attributes } hää nian wirking, wan symbolicEquality ai saat as.

answer-invalid-type = Ai jülti slach för jü aantwurd: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Wiil di komponänt `<{ $component }>` nian noome hää, koon hi ai för en moduul-atribut nümen wårde

module-attribute-name-already-defined = Di komponänt `<{ $component } name="{ $name }">` koon ai as atribut för en moduul nümen wårde, wiil di komponänt-slach `<module>` al en atribut "{ $name }" fäästleit hää.

conditional-content-condition-ignored = Dåt atribut `condition` woort bai en `<conditionalContent>` ma case- of else-bjarne ouerseen.

slider-markers-type-mismatch = Di slach foon da markiare paset ai tu di slach foon di schüwer.

pretzel-problem-needs-statement-and-answer = Ai jülti pretzel: arken `<problem>` mötj ån `<statement>` än ån `<answer>` hääwe.

pretzel-circuit-first-problem-distractor = Ai jülti pretzel: önj mode="circuit" koon dåt iarst `<problem>` nian distraktoor weese.

## Attribute values

# One form for the count: CLDR has no plural rules for `frr`.
attribute-invalid-values = Ai jülti wäärd { $values } för dåt atribut `{ $attribute }`; woort ouerseen.

attribute-must-be-references = Ai jülti wäärd `{ $value }` för dåt atribut `{ $attribute }`. Dåt atribut mötj üt referense bestunge, wat ma en `$` ounfånge.

math-input-invalid-function-names = <mathInput>: ai jülti funktjoonsnoome önj { $attribute } san ouerseen wurden: { $names }. Arken noome mötj önj di wiset dial tumänst 2 tiikene hääwe (bookstoowe of streke); der koon en fräiwilli `|<mathspeak alternative>`-önjhang efterkääme.

## Building components from the source

component-type-invalid = Ai jülti komponänt-slach: `<{ $componentType }>`

attribute-repeated = Dåt atribut { $attribute } koon ai weederhååld wårde.

attribute-invalid-for-component = Ai jülti atribut "{ $attribute }" för en komponänt foon di slach `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Jü stiildefinitjoon { $styleNumber } hää tu min kontrast för { $context ->
        [text-on-background] jü täkstklöör juun jü aftergrünjklöör
        [high-contrast] jü klöör ma hooch kontrast juun jü teegenflååke
        [line] jü lineklöör juun jü teegenflååke
        [marker] jü markiareklöör juun jü teegenflååke
       *[text-on-canvas] jü täkstklöör juun jü teegenflååke
    }{ $mode ->
        [dark] { " (jüster moodus)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ferloonget tumänst { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Uk wan jü stiildefinitjoon { $styleNumber } klööre önjdeen hää, wat önj di lachte moodus näi kontrast hääwe, hääwe da deerüt ouliidede klööre för di jüster moodus tu min kontrast foon jü täkstklöör juun jü aftergrünjklöör ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ferloonget tumänst { $threshold }:1). { $suggestion ->
        [available] För näi kontrast önj di jüster moodus of di kontrast önj di lachte moodus hööge (t. b. { $lightAttribute }="{ $lightColor }" säte) of jü klöör för di jüster moodus ouerschriuwe (t. b. { $darkAttribute }="{ $darkColor }" säte).
       *[none] För näi kontrast önj di jüster moodus di kontrast önj di lachte moodus hööge of da ouliidede klööre ma textColorDarkMode än/of backgroundColorDarkMode ouerschriuwe.
    }

style-definition-dark-mode-text-canvas-contrast =
    Uk wan jü stiildefinitjoon { $styleNumber } en täkstklöör önjdeen hää, wat önj di lachte moodus näi kontrast hää, hää jü deerüt ouliidede täkstklöör för di jüster moodus tu min kontrast juun jü teegenflååke ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ferloonget tumänst { $threshold }:1). { $suggestion ->
        [available] För näi kontrast önj di jüster moodus of di kontrast önj di lachte moodus hööge (t. b. textColor="{ $lightColor }" säte) of jü klöör för di jüster moodus ouerschriuwe (t. b. textColorDarkMode="{ $darkColor }" säte).
       *[none] För näi kontrast önj di jüster moodus di kontrast önj di lachte moodus hööge of jü ouliidede klöör ma textColorDarkMode ouerschriuwe.
    }

section-multiple-style-palettes = En afsnit koon bloot ån <stylePalette> ütsääke; der woort jü lääst nümen.

## Unique variants

variant-num-to-select-not-non-negative-integer = da äänsidiie wariante foon { $component } koone ai fäästleit wårde, wiil numToSelect nian ai-negatiif hialtaal as.

variant-num-to-select-not-constant-number = da äänsidiie wariante foon { $component } koone ai fäästleit wårde, wiil numToSelect nian konstant taal as.

variant-with-replacement-not-constant-boolean = da äänsidiie wariante foon { $component } koone ai fäästleit wårde, wiil withReplacement nian konstant boolean as.

variant-select-weight-disables-unique = Äänsidiie wariante för select san ütschaid, wan der en optsjoon ma selectWeight of selectForVariants önjdeen as

variant-coprime-undetermined = da äänsidiie wariante foon { $component } koone ai fäästleit wårde, wiil ai fäästleit wårde koon, of coprime åltensen falsch as.

variant-attribute-not-constant = da äänsidiie wariante foon { $component } koone ai fäästleit wårde, wiil { $attribute } nian konstant as.

variant-attribute-not-number = da äänsidiie wariante foon { $component } koone ai fäästleit wårde, wiil { $attribute } nian taal as.

variant-attribute-wrong-type-for-sequence =
    da äänsidiie wariante foon { $component } foon di slach { $type } koone ai fäästleit wårde, wiil { $attribute } ai { $expected ->
        [letters-combination] en kombinatsjoon foon bookstoowe
        [math-expression] en jülti matemaatisk ütdrük
        [integer] en hialtaal
       *[number] en taal
    } as.

variant-length-not-integer = da äänsidiie wariante foon { $component } koone ai fäästleit wårde, wiil length nian hialtaal as.

variant-sort-not-implemented = äänsidiie wariante foon en { $component } ma sort san ai ümsaat

variant-exclude-combinations-not-implemented = äänsidiie wariante foon en { $component } ma excludeCombinations san ai ümsaat

variant-math-exclude-not-implemented = äänsidiie wariante foon en { $component } foon di slach math ma exclude san ai ümsaat

variant-non-constant-exclude-not-implemented = äänsidiie wariante foon en { $component } ma ai-konstant exclude san ai ümsaat

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: woort önj di prefigure-renderer foon dåt graph ai understaad; di efterkoomling woort ouersprüngen.

prefigure-descendant-invalid-geometry = { $subject }: ai-äänelk of unfulstääni geometrii; di efterkoomling woort ouersprüngen.

prefigure-curve-label-omitted = { $subject }: beeteekninge wårde bai ümsaate kurve-elemente ai understaad; dåt label woort wächleeten.

prefigure-curve-unsupported-definition-type = { $subject }: di definitjoonsslach '{ $definitionType }' foon jü kurvefunktjoon woort ai understaad; di efterkoomling woort ouersprüngen.

prefigure-region-flip-functions-unsupported = { $subject }: dåt flipFunctions-atribut bai regionBetweenCurves woort ai understaad; di efterkoomling woort ouersprüngen.

prefigure-region-non-formula-child = { $subject }: bai regionBetweenCurves wårde bloot bjarnfunktjoone foon di slach formel understaad; di efterkoomling woort ouersprüngen.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' woort för en { $labelKind ->
        [line-family] label üt jü räägde-familii
       *[point] punkt-label
    } ai understaad; der woort jü standard-ütrachting foon PreFigure nümen.

prefigure-fill-style-unsupported = { $subject }: di fülstiil '{ $fillStyle }' woort foon PreFigure ai understaad; der woort üüb en ful fülang tobääggripen.

prefigure-line-style-unknown = { $subject }: di unbekäänd linestiil '{ $lineStyle }' woort önj jü PreFigure-ütgoow wächleeten.

prefigure-marker-style-mapped-to-diamond = { $subject }: di markiarestiil '{ $markerStyle }' as üüb di PreFigure-stiil 'diamond' oubilded wurden.

prefigure-marker-style-unsupported = { $subject }: di markiarestiil '{ $markerStyle }' woort foon PreFigure ai understaad; der woort di standardstiil nümen.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: ai jülti `ref`; dåt mäl koon ai aptäält wårde. Jü beemerking woort wächleeten.

annotation-ref-multiple-targets = `<annotation>`: `ref` hää moor mäler jeewen; der woort dåt iarst nümen.

annotation-ref-outside-graph = `<annotation>`: ai jülti `ref`; dåt mäl as bütenouer dåt ümjoowende graph. Jü beemerking woort wächleeten.

annotation-ref-unsupported-target = `<annotation>`: ai jülti `ref`; dåt mäl as önj jü prefigure-ümsätang nian understaadet grafisk objäkt. Jü beemerking woort wächleeten.

annotation-text-missing = `<annotation>`: `text` mangelt of as lääsi; der woort lääsi täkst jeewen.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Der as en sirkelder ouhingihaid fünen wurden.
       *[other] Der as en sirkelder ouhingihaid ma en `<{ $componentType }>`-komponänt fünen wurden.
    }

reference-no-referent = Nian betäägen för jü referens fünen: `{ $reference }`

reference-multiple-referents = Moor betäägen för jü referens fünen: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Ai jülti formaat för dåt atribut { $attribute } foon en `<{ $componentType }>`.

children-invalid = Ai jülti bjarne för `<{ $componentType }>`: ai jülti bjarne fünen: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Ai jülti wäärd `{ $value }` för dåt atribut `{ $attribute }`, der woort di wäärd `{ $default }` nümen

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Jü DoenetML-wersjoon { $version } as ai fünen wurden.
       *[other] Jü DoenetML-wersjoon { $version } as ai fünen wurden. Der woort üüb jü wersjoon { $fallback } tobääggripen
    }

## Reading the DoenetML

parse-invalid-doenetml = Ai jülti DoenetML: { $content }

parse-tag-missing-close-tag = Ai jülti DoenetML: Dåt tag `{ $tag }` hää nian sletetag. Ferwååchtet as en sallefsletend tag of en `</{ $tagName }>`-tag.

parse-tag-error = Ai jülti DoenetML: Fäler önj dåt tag `<{ $tagName }>`

parse-attribute-missing-value = Ai jülti DoenetML: Dåt ai jülti atribut `{ $attribute }` mangelt bliksis en wäärd.

parse-attribute-invalid = Ai jülti DoenetML: Ai jülti atribut `{ $attribute }`

parse-attribute-value-invalid = Ai jülti DoenetML: Ai jülti atributwäärd `{ $value }`

parse-attribute-value-quote-mismatch = Ai jülti DoenetML: Ai jülti atributwäärd `{ $value }`. Da åuntiikene pase ai toop. Der mangelt bliksis en `{ $quote }`

parse-open-tag-name-missing = Ai jülti DoenetML: Der as en tag sunner tag-noome fünen wurden, tu't biispal `<`

parse-tag-not-closed = Ai jülti DoenetML: Dåt tag `{ $tag }` as ai sletet wurden (en `>` mangelt bliksis).

parse-self-closing-tag-name-missing = Ai jülti DoenetML: Der as en tag sunner tag-noome fünen wurden `<{ $content }>`

parse-self-closing-tag-not-closed = Ai jülti DoenetML: Dåt tag `{ $tag }` as ai sletet wurden (`/>` mangelt bliksis).

parse-tag-invalid-attributes = Ai jülti DoenetML: Dåt tag `{ $tag }` as ai jülti. Fliit hääwe da atribute fälern.

parse-close-tag-name-missing = Ai jülti DoenetML: Der as en sletetag sunner tag-noome fünen wurden, tu't biispal `</`

parse-attribute-value-unquoted = Atributwäärde mötje önj åuntiikene stunge: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Ai jülti DoenetML: Dåt sletetag `{ $tag }` as fünen wurden, man der jeft nian tuuhiarend iepentag

parse-close-tag-mismatched = Ai jülti DoenetML: Dåt sletetag paset ai. Ferwååchtet as `</{ $expected }>`. Fünen as `{ $found }`

parser-node-unconvertible = Di knööp { $node } hää ai önj en Dast-knööp ümsaat wårde koon.

## Names

name-attribute-invalid =
    Ai jülti atributnoome name='{ $name }'. { $reason ->
        [characters] Noome mötje bloot bookstoowe, taale, unerstreke of streke hääwe.
       *[start] Noome mötje ma en bookstoowe ounfånge.
    }

component-name-invalid-start = Ai jülti komponäntnoome "{ $name }". Noome mötje ma en bookstoowe ounfånge.

## `<answer>` sugar

answer-video-watched-missing-video = En aantwurd foon di slach videoWatched mötj en video-atribut hääwe

answer-video-watched-video-not-reference = En aantwurd foon di slach videoWatched mötj en video-atribut hääwe, wat en referens as

answer-name-not-single-text = Dåt name-atribut foon en aantwurd mötj krååk ån täkst-bjarn hääwe

## Referencing another document

external-doenetml-recursion-limit = Dåt bütenst DoenetML hää wint tu föler rekursjoonsstoope ai hååld wårde koon. Jeft dåt hir en sirkelder referens?

external-doenetml-unavailable = Dåt DoenetML foon { $attribute }="{ $uri }" hää ai hååld wårde koon

external-doenetml-type-mismatch = Ai jülti DoenetML foon { $attribute }="{ $uri }" hååld: dåt paset ai tu di komponänt-slach "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Dåt atribut `{ $from }` as feroolered; nääm deerför `{ $to }`.
       *[other] [deprecation] Dåt atribut `{ $from }` bai `<{ $component }>` as feroolered; nääm deerför `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Dåt atribut `{ $from }` as feroolered än woort ouerseen, wiil uk `{ $to }` önjdeen as.
       *[other] [deprecation] Dåt atribut `{ $from }` bai `<{ $component }>` as feroolered än woort ouerseen, wiil uk `{ $to }` önjdeen as.
    }

deprecated-attribute-ignored = [deprecation] Dåt atribut `{ $attribute }` bai `<{ $component }>` as feroolered än woort ouerseen.

deprecated-attribute-to-child = [deprecation] Dåt atribut `{ $attribute }` bai `<{ $component }>` as feroolered; nääm deerför en `<{ $child }>`-bjarn.

deprecated-attribute-value-renamed = [deprecation] Di wäärd `{ $value }` foon dåt atribut `{ $attribute }` bai `<{ $component }>` as feroolered; nääm deerför `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` koon bloot ängelsk önj jü määrtaal säte, deeruum blift di täkst önj en dokument üüb { $locale } so, as di autoor him schrewen hää. Schriiw jü määrtaalform diräkt hän of sat jü ma dåt `pluralForm`-atribut.


## Checking against the schema

schema-element-unrecognized = Dåt element `<{ $tag }>` as nian bekäänd Doenet-element.

schema-element-not-allowed-at-root = Dåt element `<{ $tag }>` as bai jü wörtel foon dåt dokument ai tuulätj.

schema-element-not-allowed-inside = Dåt element `<{ $tag }>` as önjbinen `<{ $parent }>` ai tuulätj.

schema-attribute-unrecognized = Dåt element `<{ $tag }>` hää nian atribut ma di noome `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Dåt atribut `{ $attribute }` foon dåt element `<{ $tag }>` mötj en lasst weese, wobai arken element ån foon jüdeer as: { $allowed }
       *[other] Dåt atribut `{ $attribute }` foon dåt element `<{ $tag }>` mötj ån foon jüdeer weese: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Ai jülti wariantnoome för select.  Di wariantnoome { $variantName } kaamt önj { $numOptions } optsjoone föör, man dåt taal tu't ütsääken as { $numToSelect }.

select-variant-name-without-options = För select san wariante önjdeen, man för di müügelk wariantnoome { $variantName } jeft dåt nian optsjoone.

select-variant-name-not-possible = Di wariantnoome { $variantName }, wat för select önjdeen as, as nian müügelk wariantnoome.

select-too-few-options = { $numToSelect } komponänte koone ai üt bloot { $numOptions } ütsäked wårde.

select-from-sequence-too-few-values = { $numToSelect } wäärde koone ai üt en riege foon jü loongde { $length } ütsäked wårde.

select-from-sequence-indices-count-mismatch = Dåt taal foon da för select önjdiene indekse mötj tu dåt taal tu't ütsääken pase

select-from-sequence-indices-not-integers = Ål för select önjdiene indekse mötje hialtaale weese

select-from-sequence-index-excluded = Der as en indeks foon selectfromsequence önjdeen, wat ütsletet as

select-from-sequence-indices-excluded-combination = Der san indekse foon selectfromsequence önjdeen, wat en ütsletene kombinatsjoon san

select-from-sequence-coprime-not-positive-integers = Diilerframe kombinatsjoone koone ai ütsäked wårde, wiil der nian positiif hialtaale ütsäked wårde.

select-from-sequence-coprime-common-factor = Diilerframe taale koone ai ütsäked wårde. Ål müügelke wäärde hääwe en gemeensoome diiler. (Da önjdiene wäärde foon "from" of "to" mötje diilerfram tu "step" weese.)

select-from-sequence-coprime-single-number = Diilerframe kombinatsjoone koone ai üt en äänelk taal ütsäked wårde, wat ai 1 as.

select-from-sequence-excluded-too-many-combinations = Auer 70 % foon da kombinatsjoone önj selectFromSequence san ütsletet

select-from-sequence-coprime-none-found = Diilerframe taale hääwe ai ütsäked wårde koon. Ål müügelke wäärde hääwe en gemeensoome diiler.

select-from-sequence-too-few-unique-values = { $numToSelect } äänsidiie wäärde koone ai üt en riege foon jü loongde { $numPossibleValues } ütsäked wårde

select-prime-numbers-too-few-values = { $numToSelect } wäärde koone ai üt en lasst foon primtaale foon jü loongde { $numValues } ütsäked wårde

select-prime-numbers-values-count-mismatch = Dåt taal foon da för select önjdiene wäärde mötj tu dåt taal tu't ütsääken pase

select-prime-numbers-values-not-prime = Ål wäärde, wat för select prime number önjdeen san, mötje önj jü lasst foon da primtaale weese

select-prime-numbers-values-excluded-combination = Da önjdiene wäärde foon selectPrimeNumbers san en ütsletene kombinatsjoon

select-prime-numbers-excluded-too-many-combinations = Auer 70 % foon da kombinatsjoone önj selectPrimeNumbers san ütsletet

select-random-combination-fluke = Troch en bütenouerdiinelk unwoorschiinelk toufål hää nian kombinatsjoon foon toufälie wäärde ütsäked wårde koon

select-random-value-fluke = Troch en bütenouerdiinelk unwoorschiinelk toufål hää nian toufäli wäärd ütsäked wårde koon

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] Dåt `<{ $component }>` woort ai wiset, wiil dåt önjbinen jü matematiik as än ai `inline` as. Fäie `inline` tu, dåt der en ütsääkelasst üt woort, wat önjbinen en ütdrük pased.
        [expanded] Dåt `<{ $component }>` woort ai wiset, wiil dåt önjbinen jü matematiik as än `expanded` as. Nääm `expanded` wäch; en määrriegi fialt paset ai önjbinen en ütdrük.
        [on-graph] Dåt `<{ $component }>` woort ai wiset, wiil dåt önjbinen matematiik as, wat üüb en graph teegend woort än nian ruumte för en iinjgoow hää.
       *[relative-width] Dåt `<{ $component }>` woort ai wiset, wiil dåt önjbinen jü matematiik as än en relatiif brääde hää. Dii jü brääde önj absoluute äänhaide oun, tu't biispal `px`.
    }

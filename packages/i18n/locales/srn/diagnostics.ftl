# Sranan Tongo (Sranantongo) diagnostics. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence`, `[deprecation]`, `PreFigure` — are part of the
# language, not prose, and stay in English exactly as written. So does anything
# quoted back from the author's own source, and so do the backticks, angle
# brackets and quote marks around them.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The **1986 official Surinamese orthography** — «taki»,
# «wan», «sma», «tu», «puru», «sroto», «koloku». `u` for /u/ and never «oe»,
# `y` for the glide and never «j», `dy` for the voiced affricate, `ky` and `gy`
# for the palatalized stops, and vowel length written with a single letter
# rather than a doubled one. The pre-1986 Dutch-influenced spellings appear
# nowhere in these four files and must not be mixed into them. The system is
# phonemic Latin with no diacritics at all, so an accented character here would
# be an error. `chrome.ftl` sets the differences out point by point.
#
# **Number.** `Intl.PluralRules("srn")` has no CLDR data of its own for `srn`:
# it resolves to `en-US` and answers `['one', 'other']`. A Sranan noun after a
# numeral is unmarked — «tu punt», not a pluralized noun — so English's `one`
# and `other` branches would be word-for-word identical here, and each is
# written as **a single unselected form**. No count-driven select appears
# anywhere in these four files. The selects that remain — `$mode`, `$type`,
# `$reason`, `$expected`, `$isList`, `$labelKind`, `$suggestion`,
# `$componentType`, `$fallback`, `$context`, `$component`, `$alternative` — are
# not plural selects, and every branch of each is translated.
#
# **Loans and grammar.** The technical nouns are Dutch- and English-derived,
# spelled in the 1986 orthography: «funksi», «vektor», «matriks», «komponent»,
# «atribut», «interval», «variant», «sekwensi», «formaat», «kontras»,
# «dimensi», «koordinaat», «referensi». The grammar around them is Sranan: the
# preverbal «e / ben / sa / musu», «no» for negation, «fu» for possession and
# purpose, «di» and «te» for the subordinate clauses, «na» as the copula. Two
# renderings recur and a reviewer should judge them once rather than
# ninety times: «no e teri» for *is ignored*, and «Wi no meki … ete» for
# *haven't implemented*. The technical vocabulary here is a **lexifier loan
# set**, Dutch- and English-mediated, carried in Sranan Tongo's own grammar and
# written in the 1986 orthography: these loans are the words the language
# actually uses, and the sentences built around them are Sranan, not Dutch.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } no e teri te tu endpoint poti

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } no e teri te wan endpoint nanga wan midpoint poti alatu

line-segment-midpoint-offset-without-midpoint = midpointOffset no abi krakti sondro wan midpoint

## `<line>`

line-points-undetermined-dimensions = Wan lin di e psa punt di no abi wan sabi dimensi.

line-points-too-few-dimensions = A lin musu psa punt di abi tumusi tu dimensi.

line-points-depend-on-variables = A lin e psa punt di e anga na variabele: { $variables }.

line-equation-invalid-format = A formaat fu a lin-vergelijking nanga variabele { $variable1 } nanga { $variable2 } no bun.

## `<ray>`

ray-overprescribed-through = A strali kisi through, endpoint nanga direction alamala.  A through di poti no e teri.

ray-dimension-mismatch = A numDimensions no e kruderi na ini a strali.

## `<vector>`

vector-overprescribed-head = A vektor kisi head, tail nanga displacement alamala.  A head di poti no e teri.

vector-dimension-mismatch = A numDimensions no e kruderi na ini a vektor.

## Attracting and constraining

attract-to-without-nearest-point = No man hari go na wan `<{ $component }>`, bika a no abi wan nearestPoint stat-variabele.

constrain-to-without-nearest-point = No man tai na wan `<{ $component }>`, bika a no abi wan nearestPoint stat-variabele.

constrain-to-interior-without-nearest-point = No man tai na inisei fu wan `<{ $component }>`, bika a no abi wan nearestPoint stat-variabele.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition no e teri gi wan choiceInput di no de inline

## Ordering children by index

choice-input-indices-count-mismatch = Den indeks di poti gi choiceInput no e teri, bika a nomru fu indeks no e kruderi nanga a nomru fu choice-pikin.

pretzel-indices-count-mismatch = Den indeks di poti gi problem no e teri, bika a nomru fu indeks no e kruderi nanga a nomru fu problem-pikin.

shuffle-indices-count-mismatch = Den indeks di poti gi shuffle no e teri, bika a nomru fu indeks no e kruderi nanga a nomru fu komponent.

indices-ignored-out-of-range = Den indeks di poti gi { $component } no e teri, bika son indeks de dorosei fu a reiki.

pretzel-indices-repeated = Den indeks di poti gi pretzel no e teri, bika son indeks kon tu leisi.

pretzel-circuit-first-index = Den indeks di poti gi pretzel na ini circuit-modus no e teri, bika a fosi indeks musu de 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Fu `<{ $component }>` man wroko nanga string-pikin, wan `type` atribut musu poti.

invalid-type-defaulting-to-math = A type { $type } no bun gi a komponent { $component }. A musu de wan fu math, text, number noso boolean. Wi e teki math.

string-not-valid-component-to-arrange = A string "{ $value }" na no wan bun komponent fu { $component }. A no e teri.

## Types and variables

invalid-type-defaulting-to-number = A type { $type } no bun, a type e poti tapu number.

invalid-variable-value = A waarde fu wan variabele no bun: `{ $value }`

## Variants

variant-index-must-be-number = A variant-indeks { $index } musu de wan nomru

variant-index-must-be-integer = A variant-indeks { $index } musu de wan heri nomru

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` no meki gi absolute marki. Den bradi e poti tapu relatief.

side-by-side-absolute-margins = `<{ $component }>` no meki gi absolute marki. Den kanti e poti tapu relatief.

side-by-side-no-block-child = A `<{ $component }>` no bun: a musu abi tumusi wan blok-pikin.

## `<label>`

label-for-ignored-on-graphical = A `for` atribut tapu wan grafiek `<label>` no e teri.

label-for-must-resolve-to-one = A `for` atribut tapu `<label>` musu sori soifri wan komponent.

label-for-unresolved = A `for` atribut tapu `<label>` no man sori wan komponent.

label-for-answer-with-authored-inputs = A `for` atribut tapu `<label>` e sori wan `<answer>` di abi inputu di a skrifiman srefi skrifi; sori a inputu srefi.

label-for-answer-without-input = A `for` atribut tapu `<label>` e sori wan `<answer>` di no abi wan inputu fu poti wan nen tapu.

label-for-must-reference-input-or-answer = A `for` atribut tapu `<label>` musu sori wan inputu noso wan answer.

## Accessibility

accessibility-short-description-or-decorative = Fu aksesibiliteit ede, `<{ $component }>` musu abi wan syatu tekst noso a musu poti leki decorative.

accessibility-video-short-description = Fu aksesibiliteit ede, `<video>` musu abi wan syatu tekst.

accessibility-input-short-description-or-label = Fu aksesibiliteit ede, `<{ $component }>` musu abi wan syatu tekst noso wan nen.

accessibility-answer-input-short-description-or-label = Fu aksesibiliteit ede, wan `<answer>` di e meki wan inputu musu abi wan syatu tekst noso wan nen.

accessibility-short-description-contains-math = Wan syatu tekst no musu abi matematika-komponent leki `<{ $component }>` na ini. Skrifi a matematika nanga wortu.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } no abi nofo kontras gi a tekst fu a seksi-ede (dark mode) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a abi fanowdu tumusi { $threshold }:1).
       *[other] { $colorName } no abi nofo kontras gi a tekst fu a seksi-ede ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a abi fanowdu tumusi { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Wi no meki wan `<circle>` di e psa { $count } punt ete, te den punt no abi nomru-waarde.

circle-too-many-through-points = No man bereken wan lontu di e psa moro leki 3 punt.

circle-overprescribed-radius-center-points = No man bereken wan lontu di abi wan radius, wan mindripunt nanga through-punt alamala.

circle-center-with-multiple-points = No man bereken wan lontu nanga wan mindripunt di e psa moro leki 1 punt.

circle-radius-too-small = No man bereken a lontu: a langa fu tu punt na { $distance }, so a radius { $radius } di poti pikin tumsi.

circle-radius-with-many-points = No man meki wan lontu di e psa moro leki tu punt nanga wan radius di poti.

circle-invalid-center-or-through-points = A mindripunt noso den through-punt fu a lontu no bun.

circle-radius-center-with-multiple-points = No man bereken a radius fu wan lontu nanga wan mindripunt di e psa moro leki 1 punt.

circle-change-radius-non-numerical = No man kenki a radius fu wan lontu di e psa punt di no abi nomru-waarde

circle-radius-with-points-non-numerical = No man meki wan lontu di e psa moro leki wan punt nanga wan radius di poti, te no wan nomru-waarde no de.

circle-change-center-non-numerical = Wi no meki wan fasi ete fu kenki a mindripunt fu wan lontu di e psa punt sondro nomru-waarde.

## `<function>`

function-domain-insufficient-dimensions = A domein no abi nofo dimensi gi a funksi. A domein abi { $intervals } interval ma a funksi abi { $inputs } inputu.

function-domain-invalid-format = A formaat fu a domein fu a funksi no bun.

function-ignoring-non-numerical =
    { $type ->
        [maximum] A moro hei punt fu a funksi no abi wan nomru-waarde, so a no e teri.
        [minimum] A moro lagi punt fu a funksi no abi wan nomru-waarde, so a no e teri.
        [extremum] A extremum fu a funksi no abi wan nomru-waarde, so a no e teri.
        [point] A punt fu a funksi no abi wan nomru-waarde, so a no e teri.
        [slope] A heling fu a funksi no abi wan nomru-waarde, so a no e teri.
       *[other] A { $type } fu a funksi no abi wan nomru-waarde, so a no e teri.
    }

function-ignoring-empty =
    { $type ->
        [maximum] A moro hei punt fu a funksi leigi, so a no e teri.
        [minimum] A moro lagi punt fu a funksi leigi, so a no e teri.
        [extremum] A extremum fu a funksi leigi, so a no e teri.
        [point] A punt fu a funksi leigi, so a no e teri.
       *[other] A { $type } fu a funksi leigi, so a no e teri.
    }

function-points-too-close = A funksi abi tu punt di de tumsi krosbei fu makandra. No man meki a funksi.

function-iterates-input-output-mismatch = Funksi-iterasi de nomo te a nomru fu inputu fu a funksi de a srefi leki a nomru fu outputu. A funksi disi abi { $inputs } inputu nanga { $outputs } outputu.

## `<sequence>`

sequence-invalid-length = A langa fu a sekwensi no bun.  A musu de wan heri nomru di no de ondro nul.

sequence-invalid-step = A step fu a sekwensi no bun.  A musu de wan nomru gi wan sekwensi fu type { $type }.

sequence-invalid-endpoint-number = A "{ $attribute }" fu a nomru-sekwensi no bun.  A musu de wan nomru.

sequence-invalid-endpoint-letters = A "{ $attribute }" fu a letter-sekwensi no bun.  A musu de wan tyapu letter.

sequence-invalid-endpoint = A "{ $attribute }" fu a sekwensi no bun.

select-from-sequence-coprime-not-numbers = coprime no e teri bika no nomru e teki

select-from-sequence-coprime-with-exclude-combinations = coprime no e teri bika excludeCombinations poti

## Resolving a `target`

target-not-found = A target gi `<{ $source }>` no bun: no man feni a target.

target-state-variable-not-found = A target gi `<{ $source }>` no bun: no man feni wan stat-variabele nanga a nen "{ $property }" tapu wan `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Den variabele fu `<odeSystem>` musu de tra fasi leki a onafhankelijk variabele.

ode-system-duplicate-variable-names = No man meki ODE RHS funksi te den afhankelijk variabele abi a srefi nen tu leisi.

ode-system-rhs-function-error = No man meki a ODE RHS funksi.  Wan fowtu psa di a mathjs funksi ben e meki.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = No man meki wan uku na mindri { $count } lin

angle-invalid-through-point = A punt na ini a through fu `<angle>` no bun

parabola-vertex-too-many-points = Wi no meki wan parabola nanga wan tapupunt di e psa moro leki 1 punt ete.

parabola-too-many-points = Wi no meki wan parabola di e psa moro leki 3 punt ete.

intersection-too-many-items = Wi no meki wan krosipasi gi moro leki tu sani ete

## Other math components

ionic-compound-not-two-ions = Wi no meki wan ioni-verbinding gi wan sani di no abi tu ioni ete.

ionic-compound-needs-cation-and-anion = A ioni-verbinding meki gi wan kation nanga wan anion nomo.

solve-equations-cannot-evaluate = No man lusu a vergelijking bika no man rekenu en: { $equation }

math-operators-operand-number-required = Wan operandNumber musu poti te wan matematika-operand e puru.

eigen-decomposition-failed = No man bereken den eigenwaarde fu a matriks

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: a parameter { $parameters } no de na ini a patron, so a sa fiti wan leigi presi ala ten.

## `<graph>`

graph-grid-invalid = `<graph>`: no man frustan grid="{ $grid }". A musu de none, medium, dense, noso tu positief nomru nanga wan spasi na mindri, leki grid="1 0.5". No wan grid no e teken.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` abi fanowdu wan funksi nanga { $expected ->
        [one] wan outputu, a heling y' na ibri punt, leki `y - x`
       *[other] tu outputu, a vektor na ibri punt, leki `(y, -x)`
    }, ma a funksi di a kisi abi { $found } outputu. { $alternative ->
        [none] No wan sani no e teken.
       *[other] `<{ $alternative }>` na a komponent gi a funksi dati. No wan sani no e teken.
    }

field-function-attribute-ignored-with-child = A `function` atribut no e teri bika a funksi de na inisei fu a komponent tu; a wan na inisei e wroko. Gi a funksi na wan fasi nomo.

field-variables-ignored =
    `<{ $component }>`: a `variables` atribut e kari den variabele fu wan ekspresi di skrifi leti na inisei fu a komponent. { $reason ->
        [function-child] A funksi dyaso gi leki wan `<function>` pikin, di e kari den variabele fu ensrefi, so `variables` no e teri.
       *[no-expression] No so wan ekspresi no de dyaso, so `variables` no e teri.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" no e wroko na ini a prefigure renderer; a e wroko leki right.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" no e wroko na ini a prefigure renderer; a e wroko leki top.

prefigure-invalid-axis-bounds = `<graph>`: den grens fu den as no bun gi a prefigure-kenki; a standard bbox (-10,-10,10,10) e teki.

prefigure-invalid-width = `<graph>`: a bradi no bun gi a prefigure-kenki; a standard bradi 425 e teki.

prefigure-invalid-aspect-ratio = `<graph>`: a aspectRatio no bun gi a prefigure-kenki; a standard aspect ratio 1 e teki.

prefigure-grid-spacing-too-fine = `<graph>`: den lin fu a grid de tumsi krosbei fu makandra gi den grens fu den as; a grid e libi na baka na ini a prefigure renderer.

prefigure-annotations-not-rendered = `<graph>`: den annotation no sa teken te a PreFigure renderer no e wroko.

multiple-annotations-children = Moro leki wan `<annotations>` pikin feni na ini `<graph>`; ala fu den boiti a lasti wan no e teri.

## Referring to other components

copy-unrecognized-component-type = No man tyari noso kopi wan komponent-type di wi no sabi: { $type }.

copy-prop-not-found = No man feni a prop { $property } tapu wan komponent fu type { $component }

collect-no-source = No wan source no feni gi collect.

collect-invalid-component-type = No man tyari komponent fu type `<{ $component }>` kon makandra, bika a komponent-type no bun.

reference-index-unavailable = No man teki a indeks `{ $reference }`

## `<callAction>`

component-action-unavailable = No man kari { $action } tapu a komponent `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = A data abi wan fasi di no bun.  Den rei no abi a srefi langa. Feni na ini componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = A data abi kolom nanga a srefi nen tu leisi.  Feni na ini componentIdx :{ $componentIdx }

data-frame-missing-column-name = Wan kolom fu a data no abi wan nen.  Feni na ini componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Wan award fu a piki disi e anga na a piki di a answer-tag srefi seni, en dati sa meki sani psa di yu no ben fruwakti.

answer-max-num-attempts-in-section-wide-check-work = Te yu e poti `maxNumAttempts` tapu wan `<answer>` na ini wan bakisi nanga `sectionWideCheckWork`, dati no abi krakti, bika a bakisi e basi a nomru fu proberi. Poti `maxNumAttempts` tapu a bakisi.

nested-section-wide-check-work-max-num-attempts = Te yu e poti `maxNumAttempts` tapu wan bakisi nanga `sectionWideCheckWork` di de na ini wan tra bakisi nanga `sectionWideCheckWork`, dati no abi krakti, bika a bakisi na dorosei e basi a nomru fu proberi. Poti `maxNumAttempts` tapu a bakisi na dorosei.

answer-attributes-need-symbolic-equality = A { $attributes } atribut no sa abi krakti sondro symbolicEquality.

answer-invalid-type = A type gi a piki no bun: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Bika a komponent `<{ $component }>` no abi wan nen, a no man gebroiki leki wan module-atribut

module-attribute-name-already-defined = A komponent `<{ $component } name="{ $name }">` no man gebroiki leki wan atribut fu wan module, bika a `<module>` komponent-type abi wan "{ $name }" atribut kaba.

conditional-content-condition-ignored = A atribut `condition` no e teri tapu wan `<conditionalContent>` komponent di abi case- noso else-pikin.

slider-markers-type-mismatch = A type fu den marki no e kruderi nanga a type fu a slider.

pretzel-problem-needs-statement-and-answer = A pretzel no bun: ibri `<problem>` musu abi wan `<statement>` nanga wan `<answer>`.

pretzel-circuit-first-problem-distractor = A pretzel no bun: na ini mode="circuit", a fosi `<problem>` no man de wan distractor.

## Attribute values

attribute-invalid-values = A waarde { $values } gi a atribut `{ $attribute }` no bun; a no e teri.

attribute-must-be-references = A waarde `{ $value }` gi a atribut `{ $attribute }` no bun. A atribut musu meki fu referensi di e bigin nanga wan `$`.

math-input-invalid-function-names = <mathInput>: den funksi-nen di no bun na ini { $attribute } no e teri: { $names }. A sori-pisi fu ibri nen musu abi tumusi 2 marki (letter noso koto-lin); wan `|<mathspeak alternative>` kan kon na baka efu yu wani.

## Building components from the source

component-type-invalid = A komponent-type no bun: `<{ $componentType }>`

attribute-repeated = No man skrifi a atribut { $attribute } tu leisi.

attribute-invalid-for-component = A atribut "{ $attribute }" no bun gi wan komponent fu type `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    A stail-definisi { $styleNumber } no abi nofo kontras gi { $context ->
        [text-on-background] a tekst-kloru teige a bakagron-kloru
        [high-contrast] a hei-kontras kloru teige a kanfasi
        [line] a lin-kloru teige a kanfasi
        [marker] a marki-kloru teige a kanfasi
       *[text-on-canvas] a tekst-kloru teige a kanfasi
    }{ $mode ->
        [dark] { " (dark mode)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a abi fanowdu tumusi { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Aladi a stail-definisi { $styleNumber } abi kloru di e gi nofo kontras gi light mode, den dark-mode kloru di kmoto fu den waarde disi no abi nofo kontras gi a tekst-kloru teige a bakagron-kloru ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a abi fanowdu tumusi { $threshold }:1). { $suggestion ->
        [available] Fu abi nofo kontras na ini dark mode, meki a kontras fu light mode moro bigi (leki, poti { $lightAttribute }="{ $lightColor }") noso kenki a dark-mode kloru srefi (leki, poti { $darkAttribute }="{ $darkColor }").
       *[none] Fu abi nofo kontras na ini dark mode, meki a kontras fu light mode moro bigi noso kenki den kloru di kmoto fu den, nanga textColorDarkMode noso backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Aladi a stail-definisi { $styleNumber } abi wan tekst-kloru di e gi nofo kontras gi light mode, a dark-mode tekst-kloru di kmoto fu a waarde disi no abi nofo kontras teige a kanfasi ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a abi fanowdu tumusi { $threshold }:1). { $suggestion ->
        [available] Fu abi nofo kontras na ini dark mode, meki a kontras fu light mode moro bigi (leki, poti textColor="{ $lightColor }") noso kenki a dark-mode kloru srefi (leki, poti textColorDarkMode="{ $darkColor }").
       *[none] Fu abi nofo kontras na ini dark mode, meki a kontras fu light mode moro bigi noso kenki a kloru di kmoto fu en, nanga textColorDarkMode.
    }

section-multiple-style-palettes = Wan seksi man teki wan <stylePalette> nomo; a lasti wan e wroko.

## Unique variants

variant-num-to-select-not-non-negative-integer = no man sabi den aparti variant fu { $component } bika numToSelect no de wan heri nomru di no de ondro nul.

variant-num-to-select-not-constant-number = no man sabi den aparti variant fu { $component } bika numToSelect no de wan fasti nomru.

variant-with-replacement-not-constant-boolean = no man sabi den aparti variant fu { $component } bika withReplacement no de wan fasti boolean.

variant-select-weight-disables-unique = Den aparti variant gi select e tapu te wan option abi selectWeight noso selectForVariants

variant-coprime-undetermined = no man sabi den aparti variant fu { $component } bika no man sabi efu coprime de falsi ala ten.

variant-attribute-not-constant = no man sabi den aparti variant fu { $component } bika { $attribute } no de wan fasti sani.

variant-attribute-not-number = no man sabi den aparti variant fu { $component } bika { $attribute } no de wan nomru.

variant-attribute-wrong-type-for-sequence =
    no man sabi den aparti variant fu { $component } fu type { $type } bika { $attribute } no de { $expected ->
        [letters-combination] wan tyapu letter
        [math-expression] wan bun matematika-ekspresi
        [integer] wan heri nomru
       *[number] wan nomru
    }.

variant-length-not-integer = no man sabi den aparti variant fu { $component } bika length no de wan heri nomru.

variant-sort-not-implemented = wi no meki den aparti variant fu wan { $component } nanga sort ete

variant-exclude-combinations-not-implemented = wi no meki den aparti variant fu wan { $component } nanga excludeCombinations ete

variant-math-exclude-not-implemented = wi no meki den aparti variant fu wan { $component } fu type math nanga exclude ete

variant-non-constant-exclude-not-implemented = wi no meki den aparti variant fu wan { $component } nanga wan exclude di no fasti ete

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: no e wroko na ini a graph prefigure renderer; a pikin e libi na baka.

prefigure-descendant-invalid-geometry = { $subject }: a geometri no de heri noso a no abi wan grens; a pikin e libi na baka.

prefigure-curve-label-omitted = { $subject }: nen no e wroko tapu kroktu lin di kenki; a nen e libi na baka.

prefigure-curve-unsupported-definition-type = { $subject }: a sortu funksi-definisi '{ $definitionType }' gi a kroktu lin no e wroko; a pikin e libi na baka.

prefigure-region-flip-functions-unsupported = { $subject }: a flipFunctions atribut tapu regionBetweenCurves no e wroko; a pikin e libi na baka.

prefigure-region-non-formula-child = { $subject }: soso funksi-pikin fu a formula-type e wroko tapu regionBetweenCurves; a pikin e libi na baka.

prefigure-label-position-unsupported =
    { $subject }: a labelPosition '{ $labelPosition }' no e wroko gi { $labelKind ->
        [line-family] wan nen fu a lin-famiri
       *[point] wan nen fu wan punt
    }; a standard PreFigure fasi e teki.

prefigure-fill-style-unsupported = { $subject }: a furu-stail '{ $fillStyle }' no e wroko na ini PreFigure; wan heri furu e teki.

prefigure-line-style-unknown = { $subject }: a lin-stail '{ $lineStyle }' no bekenti en a e libi na baka fu a PreFigure outputu.

prefigure-marker-style-mapped-to-diamond = { $subject }: a marki-stail '{ $markerStyle }' e kenki go na a PreFigure stail 'diamond'.

prefigure-marker-style-unsupported = { $subject }: a marki-stail '{ $markerStyle }' no e wroko na ini PreFigure; a standard stail e teki.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: a `ref` no bun; no man feni a target. A annotation e libi na baka.

annotation-ref-multiple-targets = `<annotation>`: a `ref` e sori moro leki wan target; a fosi wan e teki.

annotation-ref-outside-graph = `<annotation>`: a `ref` no bun; a target de dorosei fu a graph. A annotation e libi na baka.

annotation-ref-unsupported-target = `<annotation>`: a `ref` no bun; a target no de wan grafiek sani di e wroko na ini a prefigure-kenki. A annotation e libi na baka.

annotation-text-missing = `<annotation>`: a `text` no de noso a leigi; wan leigi tekst e seni.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Wan lontu dependensi feni.
       *[other] Wan lontu dependensi feni di abi wan `<{ $componentType }>` komponent na ini.
    }

reference-no-referent = No wan sani no feni gi a referensi: `{ $reference }`

reference-multiple-referents = Moro leki wan sani feni gi a referensi: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = A formaat fu a atribut { $attribute } fu `<{ $componentType }>` no bun.

children-invalid = Den pikin fu `<{ $componentType }>` no bun: den pikin di no bun na: { $children }

## Falling back to a default

attribute-value-invalid-using-default = A waarde `{ $value }` gi a atribut `{ $attribute }` no bun, a waarde `{ $default }` e teki

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] A DoenetML versi { $version } no feni.
       *[other] A DoenetML versi { $version } no feni. A versi { $fallback } e teki na en presi
    }

## Reading the DoenetML

parse-invalid-doenetml = Invalid DoenetML: { $content }

parse-tag-missing-close-tag = Invalid DoenetML: A tag `{ $tag }` no abi wan tapu-tag. Wan tag di e tapu ensrefi noso wan `</{ $tagName }>` tag ben de fanowdu.

parse-tag-error = Invalid DoenetML: Wan fowtu na ini a tag `<{ $tagName }>`

parse-attribute-missing-value = Invalid DoenetML: A atribut `{ $attribute }` no bun; a gersi leki a no abi wan waarde.

parse-attribute-invalid = Invalid DoenetML: A atribut `{ $attribute }` no bun

parse-attribute-value-invalid = Invalid DoenetML: A atribut-waarde `{ $value }` no bun

parse-attribute-value-quote-mismatch = Invalid DoenetML: A atribut-waarde `{ $value }` no bun. Den kotomarki no e kruderi. A gersi leki wan `{ $quote }` e misi

parse-open-tag-name-missing = Invalid DoenetML: Wan tag sondro wan tag-nen feni, leki `<`

parse-tag-not-closed = Invalid DoenetML: A tag `{ $tag }` no tapu (a gersi leki wan `>` e misi).

parse-self-closing-tag-name-missing = Invalid DoenetML: Wan tag sondro wan tag-nen feni `<{ $content }>`

parse-self-closing-tag-not-closed = Invalid DoenetML: A tag `{ $tag }` no tapu (a gersi leki wan `/>` e misi).

parse-tag-invalid-attributes = Invalid DoenetML: A tag `{ $tag }` no bun. Kande den atribut fu en no bun.

parse-close-tag-name-missing = Invalid DoenetML: Wan tapu-tag sondro wan tag-nen feni, leki `</`

parse-attribute-value-unquoted = Atribut-waarde musu de na ini kotomarki: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Invalid DoenetML: A tapu-tag `{ $tag }` feni, ma no wan opo-tag di e go nanga en no de

parse-close-tag-mismatched = Invalid DoenetML: A tapu-tag no e kruderi. `</{ $expected }>` ben de fanowdu. `{ $found }` feni

parser-node-unconvertible = No man kenki a node { $node } go na wan Dast node.

## Names

name-attribute-invalid =
    A atribut name='{ $name }' no bun. { $reason ->
        [characters] Wan nen man abi soso letter, nomru, ondro-lin noso koto-lin.
       *[start] Wan nen musu bigin nanga wan letter.
    }

component-name-invalid-start = A komponent-nen "{ $name }" no bun. Wan nen musu bigin nanga wan letter.

## `<answer>` sugar

answer-video-watched-missing-video = Wan answer fu type videoWatched musu abi wan video atribut

answer-video-watched-video-not-reference = Wan answer fu type videoWatched musu abi wan video atribut di na wan referensi

answer-name-not-single-text = A name atribut fu wan answer musu abi wan text-pikin nomo

## Referencing another document

external-doenetml-recursion-limit = No man kisi a DoenetML fu dorosei bika tumsi furu nivo fu rekursi. Kande wan lontu referensi de?

external-doenetml-unavailable = No man kisi a DoenetML fu { $attribute }="{ $uri }"

external-doenetml-type-mismatch = A DoenetML di kisi fu { $attribute }="{ $uri }" no bun: a no e kruderi nanga a komponent-type "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] A atribut `{ $from }` no e gebroiki moro; gebroiki `{ $to }` na en presi.
       *[other] [deprecation] A atribut `{ $from }` tapu `<{ $component }>` no e gebroiki moro; gebroiki `{ $to }` na en presi.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] A atribut `{ $from }` no e gebroiki moro en a no e teri bika `{ $to }` poti tu.
       *[other] [deprecation] A atribut `{ $from }` tapu `<{ $component }>` no e gebroiki moro en a no e teri bika `{ $to }` poti tu.
    }

deprecated-attribute-ignored = [deprecation] A atribut `{ $attribute }` tapu `<{ $component }>` no e gebroiki moro en a no e teri.

deprecated-attribute-to-child = [deprecation] A atribut `{ $attribute }` tapu `<{ $component }>` no e gebroiki moro; gebroiki wan `<{ $child }>` pikin na en presi.

deprecated-attribute-value-renamed = [deprecation] A waarde `{ $value }` fu a atribut `{ $attribute }` tapu `<{ $component }>` no e gebroiki moro; gebroiki `{ $to }` na en presi.


## Language coverage

pluralize-english-only = `<pluralize>` man meki soso Ingrisi wortu kon furu, so a tekst fu en e tan a srefi na ini wan dokumenti di skrifi na ini { $locale }. Skrifi a furu-fasi srefi, noso poti en nanga a `pluralForm` atribut.


## Checking against the schema

schema-element-unrecognized = A elementi `<{ $tag }>` no de wan Doenet elementi di wi sabi.

schema-element-not-allowed-at-root = A elementi `<{ $tag }>` no mag de na a rutu fu a dokumenti.

schema-element-not-allowed-inside = A elementi `<{ $tag }>` no mag de na ini `<{ $parent }>`.

schema-attribute-unrecognized = A elementi `<{ $tag }>` no abi wan atribut nanga a nen `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] A atribut `{ $attribute }` fu a elementi `<{ $tag }>` musu de wan lisi pe ibri item na wan fu: { $allowed }
       *[other] A atribut `{ $attribute }` fu a elementi `<{ $tag }>` musu de wan fu: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = A variant-nen gi select no bun.  A variant-nen { $variantName } e kon na ini { $numOptions } option ma a nomru fu teki na { $numToSelect }.

select-variant-name-without-options = Son variant poti gi select ma no wan option no poti gi a variant-nen di kan de: { $variantName }.

select-variant-name-not-possible = A variant-nen { $variantName } di poti gi select no de wan variant-nen di kan de.

select-too-few-options = No man teki { $numToSelect } komponent fu soso { $numOptions }.

select-from-sequence-too-few-values = No man teki { $numToSelect } waarde fu wan sekwensi di langa { $length }.

select-from-sequence-indices-count-mismatch = A nomru fu indeks di poti gi select musu kruderi nanga a nomru fu teki

select-from-sequence-indices-not-integers = Ala indeks di poti gi select musu de heri nomru

select-from-sequence-index-excluded = A indeks di poti gi selectfromsequence ben puru kaba

select-from-sequence-indices-excluded-combination = Den indeks di poti gi selectfromsequence ben meki wan kombinasi di puru kaba

select-from-sequence-coprime-not-positive-integers = No man teki coprime kombinasi bika no positief heri nomru e teki.

select-from-sequence-coprime-common-factor = No man teki coprime nomru. Ala waarde di kan de abi a srefi faktor. (Den waarde di poti gi "from" noso "to" musu de coprime nanga "step".)

select-from-sequence-coprime-single-number = No man teki coprime kombinasi fu wan enkri nomru di no de 1.

select-from-sequence-excluded-too-many-combinations = Moro leki 70% fu den kombinasi na ini selectFromSequence puru

select-from-sequence-coprime-none-found = No man teki coprime nomru. Ala waarde di kan de abi a srefi faktor.

select-from-sequence-too-few-unique-values = No man teki { $numToSelect } aparti waarde fu wan sekwensi di langa { $numPossibleValues }

select-prime-numbers-too-few-values = No man teki { $numToSelect } waarde fu wan lisi fu priem-nomru di langa { $numValues }

select-prime-numbers-values-count-mismatch = A nomru fu waarde di poti gi select musu kruderi nanga a nomru fu teki

select-prime-numbers-values-not-prime = Ala waarde di poti gi select prime number musu de na ini a lisi fu priem-nomru

select-prime-numbers-values-excluded-combination = Den waarde di poti gi selectPrimeNumbers ben meki wan kombinasi di puru kaba

select-prime-numbers-excluded-too-many-combinations = Moro leki 70% fu den kombinasi na ini selectPrimeNumbers puru

select-random-combination-fluke = Fu wan sani di no e psa noiti, no man teki wan kombinasi fu waarde di teki nanga koloku

select-random-value-fluke = Fu wan sani di no e psa noiti, no man teki wan waarde nanga koloku

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` no e teken na ini a matematika; a ekspresi e seti neleki a ben de bifo inputu ben man kon na ini. { $reason ->
        [not-inline] Soso wan `inline` choice input e fiti na ini wan ekspresi; sondro `inline` a de wan blok fu knopu.
        [expanded] Wan `expanded` text input de wan bakisi nanga furu lin, di bigi tumsi fu sidon na ini wan ekspresi.
        [on-graph] Tapu wan graph a ekspresi e teken leki wan enkri prenki, di no abi presi gi wan knopu.
       *[relative-width] A `width` fu en de relatief (wan prosenti noso `em`), en dati no abi noti fu meti teige na ini wan ekspresi. Gi a bradi na ini absolute marki, leki `px`.
    }

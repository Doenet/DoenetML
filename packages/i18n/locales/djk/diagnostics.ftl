# Aukan / Ndyuka (Okanisi tongo) diagnostics: the errors and warnings the
# worker, the parser and the language server put in front of whoever is looking
# at the screen. Translated from `locales/en/diagnostics.ftl`, which is the
# source of truth; the ids are reached by diagnostic code and are never
# translated.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The SIL Ndyuka orthography: a doubled vowel writes length
# («puu», «wooko», «gaan»), there are no consonant + `r` clusters at all
# («kiin», «taa», «gaantangi», «pooberi»), «u» never «oe», «y» never «j», and
# **tone is not written** — Ndyuka is a tone language and this orthography
# leaves tone unmarked, as the dictionary and the scriptures do. Sranan Tongo
# and Saramaccan spellings are not mixed into these files; `chrome.ftl`'s
# header sets the system out point by point.
#
# **DoenetML identifiers stay in English.** Tag names, attribute names and
# attribute values — `through`, `endpoint`, `midpointOffset`, `numDimensions`,
# `maxNumAttempts`, `symbolicEquality`, `math`, `text`, `number`, `boolean`,
# `none`, `medium`, `dense`, `from`, `to`, `step` — are the language, not
# prose, and are written here exactly as English writes them, as is the
# `[deprecation]` marker.
#
# **Number.** `Intl.PluralRules("djk")` has no CLDR data for `djk` and falls
# back to English. A Ndyuka noun after a numeral does not inflect, so every
# message English selects on a count — `line-segment-attributes-ignored-*`,
# `function-domain-insufficient-dimensions`,
# `function-iterates-input-output-mismatch`,
# `matches-pattern-parameter-not-in-pattern`,
# `answer-attributes-need-symbolic-equality`, `attribute-invalid-values` — is
# written here as **one unselected form**. The one remaining `[one]` branch,
# in `field-function-wrong-num-outputs`, is not a plural: it picks between two
# different sentences about what a slope field and a vector field each need,
# and dropping it would drop the advice.
#
# **Loans.** Dutch and English reshaped to Ndyuka phonology: «komponenti»,
# «atribut», «waarde», «dokumenti», «vesi», «vaariant», «indeksi»,
# «palamita», «ekispresi», «funsi», «matriksi», «sekwensi», «dimensi»,
# «kontlasi», «anotasi», «sikema», «refeensi», «fowtu». Ndyuka's own words
# carry the sentences: «no man» (*cannot*), «mu» (*must*), «feni» (*find*),
# «teki», «poti», «puu», «sori», «teli» (*count*), «bun» / «no bun».
#
# **Confidence.** Ndyuka has no written technical prose of this kind, so every
# loan above is a shape derived by rule rather than one found in use. What a
# reviewer should read for is the grammar: the preverbal «e» / «be» / «o» /
# «sa» / «mu», the negator «no» in front of them, and «anga» for *and*.
# Nothing here was left in English.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } no e teli te tu endpoint poti

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } no e teli te wan endpoint anga wan midpoint poti ala tu

line-segment-midpoint-offset-without-midpoint = midpointOffset no e du noti efu no wan midpoint no de

## `<line>`

line-points-undetermined-dimensions = A lin e go pasa punt di wi no sabi omeni dimensi den abi.

line-points-too-few-dimensions = A lin mu pasa punt di abi tu dimensi efu moo.

line-points-depend-on-variables = A lin e pasa punt di e anga den vaariabel ya: { $variables }.

line-equation-invalid-format = A foomati fu a ekwasi fu a lin a ini den vaariabel { $variable1 } anga { $variable2 } no bun.

## `<ray>`

ray-overprescribed-through = A sitaali poti anga through, endpoint anga direction.  Wi no e teli a through di poti.

ray-dimension-mismatch = A numDimensions no e fiti a ini a sitaali.

## `<vector>`

vector-overprescribed-head = A vekitoo poti anga head, tail anga displacement.  Wi no e teli a head di poti.

vector-dimension-mismatch = A numDimensions no e fiti a ini a vekitoo.

## Attracting and constraining

attract-to-without-nearest-point = Wi no man hali go a wan `<{ $component }>` bika a no abi wan nearestPoint stati-vaariabel.

constrain-to-without-nearest-point = Wi no man tai go a wan `<{ $component }>` bika a no abi wan nearestPoint stati-vaariabel.

constrain-to-interior-without-nearest-point = Wi no man tai go a ini wan `<{ $component }>` bika a no abi wan nearestPoint stati-vaariabel.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition no e teli a wan choiceInput di a no inline

## Ordering children by index

choice-input-indices-count-mismatch = Wi no e teli den indices di poti gi a choiceInput bika a nomu fu den indices no e fiti a nomu fu den choice pikin.

pretzel-indices-count-mismatch = Wi no e teli den indices di poti gi a problem bika a nomu fu den indices no e fiti a nomu fu den problem pikin.

shuffle-indices-count-mismatch = Wi no e teli den indices di poti gi a shuffle bika a nomu fu den indices no e fiti a nomu fu den komponenti.

indices-ignored-out-of-range = Wi no e teli den indices di poti gi { $component } bika son fu den de a doo fu a peesi.

pretzel-indices-repeated = Wi no e teli den indices di poti gi a pretzel bika son fu den de tu leisi.

pretzel-circuit-first-index = Wi no e teli den indices di poti gi a pretzel a ini circuit fasi bika a fosi indeksi mu de 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Fu `<{ $component }>` sa wooko anga sitringi pikin, i mu poti wan `type` atribut.

invalid-type-defaulting-to-math = A type { $type } no bun gi wan { $component } komponenti. A mu de math, text, number efuso boolean. Wi o teki math.

string-not-valid-component-to-arrange = A sitringi "{ $value }" a no wan bun komponenti fu { $component }. Wi no e teli en.

## Types and variables

invalid-type-defaulting-to-number = A type { $type } no bun, da wi e seti a type na number.

invalid-variable-value = A waarde fu wan vaariabel no bun: `{ $value }`

## Variants

variant-index-must-be-number = A vaariant-indeksi { $index } mu de wan nomu

variant-index-must-be-integer = A vaariant-indeksi { $index } mu de wan hii nomu

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` no meki gi abesoluut marki. Wi e seti den bereedi na relatif.

side-by-side-absolute-margins = `<{ $component }>` no meki gi abesoluut marki. Wi e seti den kanti na relatif.

side-by-side-no-block-child = A `<{ $component }>` ya no bun: a mu abi wan blaka pikin efu moo.

## `<label>`

label-for-ignored-on-graphical = A `for` atribut no e teli a wan gaafiki `<label>`.

label-for-must-resolve-to-one = A `for` atribut a wan `<label>` mu sori soso wan komponenti.

label-for-unresolved = A `for` atribut a wan `<label>` no man feni no wan komponenti.

label-for-answer-with-authored-inputs = A `for` atribut a wan `<label>` e sori wan `<answer>` di abi en eigi inputu sikiifi; sori a inputu srefi.

label-for-answer-without-input = A `for` atribut a wan `<label>` e sori wan `<answer>` di no abi no wan inputu fu neen.

label-for-must-reference-input-or-answer = A `for` atribut a wan `<label>` mu sori wan inputu efuso wan answer.

## Accessibility

accessibility-short-description-or-decorative = Fu a aksesibiliteiti, wan `<{ $component }>` mu abi wan syatu deskipsi efuso a mu poti enke decorative.

accessibility-video-short-description = Fu a aksesibiliteiti, wan `<video>` mu abi wan syatu deskipsi.

accessibility-input-short-description-or-label = Fu a aksesibiliteiti, wan `<{ $component }>` mu abi wan syatu deskipsi efuso wan neen.

accessibility-answer-input-short-description-or-label = Fu a aksesibiliteiti, wan `<answer>` di e meki wan inputu mu abi wan syatu deskipsi efuso wan neen.

accessibility-short-description-contains-math = Syatu deskipsi no mu abi matematika-komponenti enke `<{ $component }>` a ini. Sikiifi a matematika anga wowtu.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } no abi nofo kontlasi gi a seksi-edeneen tekisi (dark fasi) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a abi fanowdu { $threshold }:1 efu moo).
       *[other] { $colorName } no abi nofo kontlasi gi a seksi-edeneen tekisi ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a abi fanowdu { $threshold }:1 efu moo).
    }

## `<circle>`

circle-through-points-non-numerical = Wi no meki wan `<circle>` di e pasa { $count } punt ete gi a situwasi pe den punt no abi nomu-waarde.

circle-too-many-through-points = Wi no man wooko wan lontu di e pasa moo enke 3 punt.

circle-overprescribed-radius-center-points = Wi no man wooko wan lontu te radius, center anga through-punt poti ala dii.

circle-center-with-multiple-points = Wi no man wooko wan lontu anga wan center di poti di e pasa moo enke 1 punt.

circle-radius-too-small = Wi no man wooko a lontu: a pasi tuka den tu punt na { $distance }, da a radius { $radius } di poti pikin tumusi.

circle-radius-with-many-points = Wi no man meki wan lontu di e pasa moo enke tu punt anga wan radius di poti.

circle-invalid-center-or-through-points = A center efuso den through-punt fu a lontu no bun.

circle-radius-center-with-multiple-points = Wi no man wooko a radius fu wan lontu anga wan center di poti di e pasa moo enke 1 punt.

circle-change-radius-non-numerical = Wi no man kenki a radius fu wan lontu di abi through-punt di no abi nomu-waarde

circle-radius-with-points-non-numerical = Wi no man meki wan lontu di e pasa moo enke wan punt anga wan radius di poti te den punt no abi nomu-waarde.

circle-change-center-non-numerical = Wi no meki wan fasi ete fu kenki a center fu wan lontu di e pasa punt di no abi nomu-waarde.

## `<function>`

function-domain-insufficient-dimensions = A domein no abi nofo dimensi gi a funsi. A domein abi { $intervals } intavalu ma a funsi abi { $inputs } inputu.

function-domain-invalid-format = A foomati fu a domein fu a funsi no bun.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Wi no e teli a moo hei punt fu a funsi bika a no wan nomu.
        [minimum] Wi no e teli a moo lagi punt fu a funsi bika a no wan nomu.
        [extremum] Wi no e teli a ekisteemu fu a funsi bika a no wan nomu.
        [point] Wi no e teli a punt fu a funsi bika a no wan nomu.
        [slope] Wi no e teli a helin fu a funsi bika a no wan nomu.
       *[other] Wi no e teli a { $type } fu a funsi bika a no wan nomu.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Wi no e teli a moo hei punt fu a funsi bika a leigi.
        [minimum] Wi no e teli a moo lagi punt fu a funsi bika a leigi.
        [extremum] Wi no e teli a ekisteemu fu a funsi bika a leigi.
        [point] Wi no e teli a punt fu a funsi bika a leigi.
       *[other] Wi no e teli a { $type } fu a funsi bika a leigi.
    }

function-points-too-close = A funsi abi tu punt di de tumusi koosube fu makandii. Wi no man meki a funsi.

function-iterates-input-output-mismatch = Funsi-iterasi sa wooko soso efu a nomu fu den inputu de a srefi enke a nomu fu den outputu. A funsi ya abi { $inputs } inputu anga { $outputs } outputu.

## `<sequence>`

sequence-invalid-length = A langa fu a sekwensi no bun.  A mu de wan hii nomu di no negatif.

sequence-invalid-step = A step fu a sekwensi no bun.  A mu de wan nomu gi wan sekwensi fu type { $type }.

sequence-invalid-endpoint-number = A "{ $attribute }" fu a nomu-sekwensi no bun.  A mu de wan nomu.

sequence-invalid-endpoint-letters = A "{ $attribute }" fu a letu-sekwensi no bun.  A mu de wan mokisi fu letu.

sequence-invalid-endpoint = A "{ $attribute }" fu a sekwensi no bun.

select-from-sequence-coprime-not-numbers = wi no e teli coprime bika wi no e teki nomu

select-from-sequence-coprime-with-exclude-combinations = wi no e teli coprime bika excludeCombinations poti

## Resolving a `target`

target-not-found = A target gi `<{ $source }>` no bun: wi no man feni a target.

target-state-variable-not-found = A target gi `<{ $source }>` no bun: wi no man feni no wan stati-vaariabel di nen "{ $property }" a wan `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Den vaariabel fu wan `<odeSystem>` mu de taa fasi enke a onafanki vaariabel.

ode-system-duplicate-variable-names = Wi no man meki ODE RHS funsi anga a srefi dependenti vaariabel-neen tu leisi.

ode-system-rhs-function-error = Wi no man meki a ODE RHS funsi.  Fowtu di wi be e meki a mathjs funsi.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Wi no man meki wan uku tuka { $count } lin

angle-invalid-through-point = A punt a ini a through fu a `<angle>` no bun

parabola-vertex-too-many-points = Wi no meki wan palabola anga wan vertex di e pasa moo enke 1 punt ete.

parabola-too-many-points = Wi no meki wan palabola di e pasa moo enke 3 punt ete.

intersection-too-many-items = Wi no meki intaseksi gi moo enke tu sani ete

## Other math components

ionic-compound-not-two-ions = Wi no meki no ioniki mokisani gi wan taa sani boiti tu ion ete.

ionic-compound-needs-cation-and-anion = Wi meki ioniki mokisani soso gi wan kation anga wan anion.

solve-equations-cannot-evaluate = Wi no man lusu a ekwasi bika wi no man wooko en: { $equation }

math-operators-operand-number-required = I mu poti wan operandNumber te i e puu wan matematika-operanti.

eigen-decomposition-failed = Wi no man wooko den eigenwaarde fu a matriksi

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: a palamita { $parameters } no de a ini a patoon, da a o fiti wan leigi peesi ala ten.

## `<graph>`

graph-grid-invalid = `<graph>`: wi no man fusutan grid="{ $grid }". A mu de none, medium, dense, efuso tu positif nomu anga wan peesi tuka den, enke grid="1 0.5". Wi no e teke no wan grid.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` abi fanowdu wan funsi anga { $expected ->
        [one] wan outputu, a helin y' a ibii punt, enke `y - x`
       *[other] tu outputu, a vekitoo a ibii punt, enke `(y, -x)`
    }, ma a funsi di a kisi abi { $found } outputu. { $alternative ->
        [none] Wi no e teke no wan sani.
       *[other] `<{ $alternative }>` na a komponenti gi a funsi dati. Wi no e teke no wan sani.
    }

field-function-attribute-ignored-with-child = Wi no e teli a `function` atribut bika a funsi de a ini a komponenti tu; wi e teki a wan di de a ini. Gi a funsi soso wan fu den tu fasi.

field-variables-ignored =
    `<{ $component }>`: a `variables` atribut e nen den vaariabel fu wan ekispresi di sikiifi a ini a komponenti srefi. { $reason ->
        [function-child] A funsi ya gi enke wan `<function>` pikin, di e nen en eigi vaariabel, da wi no e teli `variables`.
       *[no-expression] No wan sowan ekispresi no de ya, da wi no e teli `variables`.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: a prefigure renderer no e teki xLabelPosition="left"; wi o wooko enke right.

prefigure-y-label-position-unsupported = `<graph>`: a prefigure renderer no e teki yLabelPosition="bottom"; wi o wooko enke top.

prefigure-invalid-axis-bounds = `<graph>`: den asi-marki no bun gi a prefigure kenki; wi o teki a difoolti bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: a bereedi no bun gi a prefigure kenki; wi o teki a difoolti diagram-bereedi 425.

prefigure-invalid-aspect-ratio = `<graph>`: a aspectRatio no bun gi a prefigure kenki; wi o teki a difoolti aspek-ratio 1.

prefigure-grid-spacing-too-fine = `<graph>`: a grid-peesi fini tumusi gi den asi-marki; wi e libi a grid a doo a ini a prefigure renderer.

prefigure-annotations-not-rendered = `<graph>`: wi no o teke no wan anotasi efu wi no e wooko anga a PreFigure renderer.

multiple-annotations-children = Wi feni moo enke wan `<annotations>` pikin a ini a `<graph>`; wi no e teli den ala boiti a laste wan.

## Referring to other components

copy-unrecognized-component-type = Wi no man langa efuso kopi wan komponenti-sortu di wi no sabi: { $type }.

copy-prop-not-found = Wi no man feni a prop { $property } a wan komponenti fu sortu { $component }

collect-no-source = Wi no feni no wan source gi a collect.

collect-invalid-component-type = Wi no man kolekiti komponenti fu sortu `<{ $component }>` bika dati a no wan bun komponenti-sortu.

reference-index-unavailable = Wi no man sori a indeksi `{ $reference }`

## `<callAction>`

component-action-unavailable = Wi no man kai { $action } a a komponenti `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = A fomu fu a data no bun.  Den lei no abi a srefi langa. Feni a ini componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = A data abi a srefi kolon-neen tu leisi.  Feni a ini componentIdx :{ $componentIdx }

data-frame-missing-column-name = Wan kolon-neen mankei a ini a data.  Feni a ini componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Wan award gi a piki ya e anga a answer tag en eigi piki di seni, da sani o pasa di yu no o fusutan.

answer-max-num-attempts-in-section-wide-check-work = Efu i seti `maxNumAttempts` a wan `<answer>` a ini wan bakisi di abi `sectionWideCheckWork`, a no e du noti, bika a bakisi e tii a nomu fu den pooberi. Seti `maxNumAttempts` a a bakisi.

nested-section-wide-check-work-max-num-attempts = Efu i seti `maxNumAttempts` a wan bakisi di abi `sectionWideCheckWork` di de a ini wan taa bakisi di abi `sectionWideCheckWork`, a no e du noti, bika a bakisi a doose e tii a nomu fu den pooberi. Seti `maxNumAttempts` a a bakisi a doose.

answer-attributes-need-symbolic-equality = A { $attributes } atribut no o du noti efu symbolicEquality no seti.

answer-invalid-type = A sortu gi a piki no bun: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Bika a komponenti `<{ $component }>` no abi no wan neen, wi no man wooko en gi wan module atribut

module-attribute-name-already-defined = Wi no man wooko a komponenti `<{ $component } name="{ $name }">` enke wan atribut gi wan module bika a `<module>` komponenti-sortu abi wan "{ $name }" atribut kaba.

conditional-content-condition-ignored = A atribut `condition` no e teli a wan `<conditionalContent>` komponenti di abi case efuso else pikin.

slider-markers-type-mismatch = A maiki-sortu no e fiti a slider-sortu.

pretzel-problem-needs-statement-and-answer = A pretzel ya no bun: ibii `<problem>` mu abi wan `<statement>` anga wan `<answer>`.

pretzel-circuit-first-problem-distractor = A pretzel ya no bun: a ini mode="circuit", a fosi `<problem>` no man de wan distractor.

## Attribute values

attribute-invalid-values = A waarde { $values } gi a atribut `{ $attribute }` no bun; wi no e teli en.

attribute-must-be-references = A waarde `{ $value }` gi a atribut `{ $attribute }` no bun. A atribut mu meki fu refeensi di e bigin anga wan `$`.

math-input-invalid-function-names = <mathInput>: wi no e teli funsi-neen di no bun a ini { $attribute }: { $names }. Ibii neen en sori-pisi mu abi tu tekin efu moo (letu efuso sitreki); wan `|<mathspeak alternative>` sa kon baka en efu i wani.

## Building components from the source

component-type-invalid = A komponenti-sortu ya no bun: `<{ $componentType }>`

attribute-repeated = I no man poti a atribut { $attribute } tu leisi.

attribute-invalid-for-component = A atribut "{ $attribute }" no bun gi wan komponenti fu sortu `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Sitali-definisi { $styleNumber } no abi nofo kontlasi gi { $context ->
        [text-on-background] a tekisi-kula agensi a bakagoon-kula
        [high-contrast] a hei-kontlasi kula agensi a kanvasi
        [line] a lin-kula agensi a kanvasi
        [marker] a maiki-kula agensi a kanvasi
       *[text-on-canvas] a tekisi-kula agensi a kanvasi
    }{ $mode ->
        [dark] { " (dark fasi)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a abi fanowdu { $threshold }:1 efu moo).

style-definition-dark-mode-text-background-contrast =
    Aladi sitali-definisi { $styleNumber } poti kula di abi nofo kontlasi gi light fasi, den dark-fasi kula di kon fu den no abi nofo kontlasi gi a tekisi-kula agensi a bakagoon-kula ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a abi fanowdu { $threshold }:1 efu moo). { $suggestion ->
        [available] Fu abi nofo kontlasi a ini dark fasi, meki a light-fasi kontlasi moo gaan (fu eksempee, seti { $lightAttribute }="{ $lightColor }") efuso kenki a dark-fasi kula (fu eksempee, seti { $darkAttribute }="{ $darkColor }").
       *[none] Fu abi nofo kontlasi a ini dark fasi, meki a light-fasi kontlasi moo gaan efuso kenki den kula di kon fu den anga textColorDarkMode anga/efuso backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Aladi sitali-definisi { $styleNumber } poti wan tekisi-kula di abi nofo kontlasi gi light fasi, a dark-fasi tekisi-kula di kon fu en no abi nofo kontlasi agensi a kanvasi ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; a abi fanowdu { $threshold }:1 efu moo). { $suggestion ->
        [available] Fu abi nofo kontlasi a ini dark fasi, meki a light-fasi kontlasi moo gaan (fu eksempee, seti textColor="{ $lightColor }") efuso kenki a dark-fasi kula (fu eksempee, seti textColorDarkMode="{ $darkColor }").
       *[none] Fu abi nofo kontlasi a ini dark fasi, meki a light-fasi kontlasi moo gaan efuso kenki a kula di kon fu en anga textColorDarkMode.
    }

section-multiple-style-palettes = Wan seksi sa teki soso wan <stylePalette>; wi e teki a laste wan.

## Unique variants

variant-num-to-select-not-non-negative-integer = wi no man wooko den apaiti vaariant fu { $component } bika numToSelect a no wan hii nomu di no negatif.

variant-num-to-select-not-constant-number = wi no man wooko den apaiti vaariant fu { $component } bika numToSelect a no wan konstanti nomu.

variant-with-replacement-not-constant-boolean = wi no man wooko den apaiti vaariant fu { $component } bika withReplacement a no wan konstanti boolean.

variant-select-weight-disables-unique = Den apaiti vaariant gi select e tapu efu wan opsi abi selectWeight efuso selectForVariants poti

variant-coprime-undetermined = wi no man wooko den apaiti vaariant fu { $component } bika wi no man sabi efu coprime na falisi ala ten.

variant-attribute-not-constant = wi no man wooko den apaiti vaariant fu { $component } bika { $attribute } a no konstanti.

variant-attribute-not-number = wi no man wooko den apaiti vaariant fu { $component } bika { $attribute } a no wan nomu.

variant-attribute-wrong-type-for-sequence =
    wi no man wooko den apaiti vaariant fu { $component } fu { $type } sortu bika { $attribute } a no { $expected ->
        [letters-combination] wan mokisi fu letu
        [math-expression] wan bun matematika-ekispresi
        [integer] wan hii nomu
       *[number] wan nomu
    }.

variant-length-not-integer = wi no man wooko den apaiti vaariant fu { $component } bika a length a no wan hii nomu.

variant-sort-not-implemented = wi no meki apaiti vaariant gi wan { $component } anga sort ete

variant-exclude-combinations-not-implemented = wi no meki apaiti vaariant gi wan { $component } anga excludeCombinations ete

variant-math-exclude-not-implemented = wi no meki apaiti vaariant gi wan { $component } fu sortu math anga exclude ete

variant-non-constant-exclude-not-implemented = wi no meki apaiti vaariant gi wan { $component } anga wan exclude di no konstanti ete

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: a graph prefigure renderer no e teki disi; wi e pasa a bakapikin.

prefigure-descendant-invalid-geometry = { $subject }: a jometri no finiti efuso a no kaba; wi e pasa a bakapikin.

prefigure-curve-label-omitted = { $subject }: neen no e wooko a kookotu lin di kenki; wi e libi a neen a doo.

prefigure-curve-unsupported-definition-type = { $subject }: wi no e teki a kookotu-lin funsi-definisi sortu '{ $definitionType }'; wi e pasa a bakapikin.

prefigure-region-flip-functions-unsupported = { $subject }: wi no e teki a flipFunctions atribut a regionBetweenCurves; wi e pasa a bakapikin.

prefigure-region-non-formula-child = { $subject }: soso fomula-sortu pikin funsi e wooko a regionBetweenCurves; wi e pasa a bakapikin.

prefigure-label-position-unsupported =
    { $subject }: wi no e teki labelPosition '{ $labelPosition }' gi wan { $labelKind ->
        [line-family] lin-famii neen
       *[point] punt-neen
    }; wi e teki a difoolti PreFigure fasi.

prefigure-fill-style-unsupported = { $subject }: PreFigure no e teki a fuu-sitali '{ $fillStyle }'; wi o teki wan sodoo fuu.

prefigure-line-style-unknown = { $subject }: wi e libi a lin-sitali '{ $lineStyle }' di wi no sabi a doo fu a PreFigure outputu.

prefigure-marker-style-mapped-to-diamond = { $subject }: wi kenki a maiki-sitali '{ $markerStyle }' go a ini a PreFigure sitali 'diamond'.

prefigure-marker-style-unsupported = { $subject }: PreFigure no e teki a maiki-sitali '{ $markerStyle }'; wi e teki a difoolti sitali.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: a `ref` no bun; wi no man feni a target. Wi e libi a anotasi a doo.

annotation-ref-multiple-targets = `<annotation>`: a `ref` e sori moo enke wan target; wi e teki a fosi wan.

annotation-ref-outside-graph = `<annotation>`: a `ref` no bun; a target de a doose fu a graph. Wi e libi a anotasi a doo.

annotation-ref-unsupported-target = `<annotation>`: a `ref` no bun; a target a no wan gaafiki sani di a prefigure kenki e teki. Wi e libi a anotasi a doo.

annotation-text-missing = `<annotation>`: a `text` mankei efuso a leigi; wi o puu leigi tekisi.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Wi feni wan lontu dependensi.
       *[other] Wi feni wan lontu dependensi di e anga wan `<{ $componentType }>` komponenti.
    }

reference-no-referent = Wi no feni no wan sani di a refeensi ya e sori: `{ $reference }`

reference-multiple-referents = Wi feni moo enke wan sani di a refeensi ya e sori: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = A foomati fu a atribut { $attribute } fu `<{ $componentType }>` no bun.

children-invalid = Den pikin gi `<{ $componentType }>` no bun: wi feni pikin di no bun: { $children }

## Falling back to a default

attribute-value-invalid-using-default = A waarde `{ $value }` gi a atribut `{ $attribute }` no bun, da wi e teki a waarde `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Wi no feni DoenetML vesi { $version }.
       *[other] Wi no feni DoenetML vesi { $version }. Wi o teki vesi { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = A DoenetML ya no bun: { $content }

parse-tag-missing-close-tag = A DoenetML ya no bun: A tag `{ $tag }` no abi no wan tapu-tag. Wi be e fuuwakiti wan tag di e tapu ensrefi efuso wan `</{ $tagName }>` tag.

parse-tag-error = A DoenetML ya no bun: Fowtu a ini a tag `<{ $tagName }>`

parse-attribute-missing-value = A DoenetML ya no bun: A atribut `{ $attribute }` no bun — a gei taki wan waarde mankei.

parse-attribute-invalid = A DoenetML ya no bun: A atribut `{ $attribute }` no bun

parse-attribute-value-invalid = A DoenetML ya no bun: A atribut-waarde `{ $value }` no bun

parse-attribute-value-quote-mismatch = A DoenetML ya no bun: A atribut-waarde `{ $value }` no bun. Den koti-maiki no e fiti makandii. A gei taki wan `{ $quote }` mankei.

parse-open-tag-name-missing = A DoenetML ya no bun: Wi feni wan tag sondee tag-neen, enke `<`

parse-tag-not-closed = A DoenetML ya no bun: A tag `{ $tag }` no tapu (a gei taki wan `>` mankei).

parse-self-closing-tag-name-missing = A DoenetML ya no bun: Wi feni wan tag sondee tag-neen `<{ $content }>`

parse-self-closing-tag-not-closed = A DoenetML ya no bun: A tag `{ $tag }` no tapu (a gei taki `/>` mankei).

parse-tag-invalid-attributes = A DoenetML ya no bun: A tag `{ $tag }` no bun. A sa abi fowtu atribut.

parse-close-tag-name-missing = A DoenetML ya no bun: Wi feni wan tapu-tag sondee tag-neen, enke `</`

parse-attribute-value-unquoted = Atribut-waarde mu de a ini koti-maiki: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = A DoenetML ya no bun: Wi feni a tapu-tag `{ $tag }`, ma no wan opo-tag no de gi en

parse-close-tag-mismatched = A DoenetML ya no bun: A tapu-tag no e fiti. Wi be e fuuwakiti `</{ $expected }>`. Wi feni `{ $found }`

parser-node-unconvertible = Wi no man kenki a nodu { $node } go a wan Dast nodu.

## Names

name-attribute-invalid =
    A atribut name='{ $name }' no bun. { $reason ->
        [characters] Neen sa abi soso letu, nomu, ondooteki efuso sitreki.
       *[start] Neen mu bigin anga wan letu.
    }

component-name-invalid-start = A komponenti-neen "{ $name }" no bun. Neen mu bigin anga wan letu.

## `<answer>` sugar

answer-video-watched-missing-video = Wan answer fu sortu videoWatched mu abi wan video atribut

answer-video-watched-video-not-reference = Wan answer fu sortu videoWatched mu abi wan video atribut di na wan refeensi

answer-name-not-single-text = A answer name atribut mu abi soso wan tekisi-pikin

## Referencing another document

external-doenetml-recursion-limit = Wi no man kisi a doosee DoenetML bika tumusi somen lo fu rekursi. Wan lontu refeensi de?

external-doenetml-unavailable = Wi no man kisi no wan DoenetML fu { $attribute }="{ $uri }"

external-doenetml-type-mismatch = A DoenetML di wi kisi fu { $attribute }="{ $uri }" no bun: a no e fiti a komponenti-sortu "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] A atribut `{ $from }` no e wooko moo; wooko `{ $to }` a en peesi.
       *[other] [deprecation] A atribut `{ $from }` a `<{ $component }>` no e wooko moo; wooko `{ $to }` a en peesi.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] A atribut `{ $from }` no e wooko moo, da wi no e teli en, bika `{ $to }` poti tu.
       *[other] [deprecation] A atribut `{ $from }` a `<{ $component }>` no e wooko moo, da wi no e teli en, bika `{ $to }` poti tu.
    }

deprecated-attribute-ignored = [deprecation] A atribut `{ $attribute }` a `<{ $component }>` no e wooko moo, da wi no e teli en.

deprecated-attribute-to-child = [deprecation] A atribut `{ $attribute }` a `<{ $component }>` no e wooko moo; wooko wan `<{ $child }>` pikin a en peesi.

deprecated-attribute-value-renamed = [deprecation] A waarde `{ $value }` fu a atribut `{ $attribute }` a `<{ $component }>` no e wooko moo; wooko `{ $to }` a en peesi.


## Language coverage

pluralize-english-only = `<pluralize>` sa meki soso Ingiisi wowtu kon somen, da a tekisi fu en e tan a srefi a ini wan dokumenti di sikiifi a ini { $locale }. Sikiifi a somen-fasi srefi, efuso poti en anga a `pluralForm` atribut.


## Checking against the schema

schema-element-unrecognized = A elementi `<{ $tag }>` a no wan Doenet elementi di wi sabi.

schema-element-not-allowed-at-root = A elementi `<{ $tag }>` no man de a a lutu fu a dokumenti.

schema-element-not-allowed-inside = A elementi `<{ $tag }>` no man de a ini `<{ $parent }>`.

schema-attribute-unrecognized = A elementi `<{ $tag }>` no abi no wan atribut di nen `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] A atribut `{ $attribute }` fu a elementi `<{ $tag }>` mu de wan lisi pe ibii sani na wan fu den ya: { $allowed }
       *[other] A atribut `{ $attribute }` fu a elementi `<{ $tag }>` mu de wan fu den ya: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = A vaariant-neen gi a select no bun.  A vaariant-neen { $variantName } de a ini { $numOptions } opsi ma a nomu fu teki na { $numToSelect }.

select-variant-name-without-options = Son vaariant poti gi a select ma no wan opsi no poti gi a vaariant-neen: { $variantName }.

select-variant-name-not-possible = A vaariant-neen { $variantName } di poti gi a select a no wan vaariant-neen di sa de.

select-too-few-options = Wi no man teki { $numToSelect } komponenti fu soso { $numOptions }.

select-from-sequence-too-few-values = Wi no man teki { $numToSelect } waarde fu wan sekwensi di langa { $length }.

select-from-sequence-indices-count-mismatch = A nomu fu den indices di poti gi a select mu fiti a nomu fu teki

select-from-sequence-indices-not-integers = Ala den indices di poti gi a select mu de hii nomu

select-from-sequence-index-excluded = Wan indeksi fu selectfromsequence poti di be puu a doo

select-from-sequence-indices-excluded-combination = Den indices fu selectfromsequence di poti be na wan mokisi di puu a doo

select-from-sequence-coprime-not-positive-integers = Wi no man teki koopime mokisi bika wi no e teki positif hii nomu.

select-from-sequence-coprime-common-factor = Wi no man teki koopime nomu. Ala den waarde abi a srefi fakitoo. (Den waarde di poti gi "from" efuso "to" mu de koopime anga "step".)

select-from-sequence-coprime-single-number = Wi no man teki koopime mokisi fu wan enkii nomu di a no 1.

select-from-sequence-excluded-too-many-combinations = Moo enke 70% fu den mokisi a ini selectFromSequence be puu a doo

select-from-sequence-coprime-none-found = Wi no man teki koopime nomu. Ala den waarde abi a srefi fakitoo.

select-from-sequence-too-few-unique-values = Wi no man teki { $numToSelect } apaiti waarde fu wan sekwensi di langa { $numPossibleValues }

select-prime-numbers-too-few-values = Wi no man teki { $numToSelect } waarde fu wan lisi fu paim nomu di langa { $numValues }

select-prime-numbers-values-count-mismatch = A nomu fu den waarde di poti gi a select mu fiti a nomu fu teki

select-prime-numbers-values-not-prime = Ala den waarde di poti gi select paim nomu mu de a ini a lisi fu paim nomu

select-prime-numbers-values-excluded-combination = Den waarde fu selectPrimeNumbers di poti be na wan mokisi di puu a doo

select-prime-numbers-excluded-too-many-combinations = Moo enke 70% fu den mokisi a ini selectPrimeNumbers be puu a doo

select-random-combination-fluke = Anga wan kansi di haadi haadi e pasa, wi no man teki wan mokisi fu lukiluki waarde

select-random-value-fluke = Anga wan kansi di haadi haadi e pasa, wi no man teki wan lukiluki waarde

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    Wi no e teke a `<{ $component }>` a ini a matematika; wi e seti a ekispresi enke fa a be de fosi inputu be sa go a ini. { $reason ->
        [not-inline] Soso wan `inline` choice inputu e fiti a ini wan ekispresi; sondee `inline` a na wan blaka fu kanapu.
        [expanded] Wan `expanded` tekisi inputu na wan bokisi anga moo enke wan lin, da a bigi tumusi fu sidon a ini wan ekispresi.
        [on-graph] A wan graph, wi e teke a ekispresi enke wan enkii peentje, da no wan peesi no de gi wan kanapu.
       *[relative-width] En `width` na relatif (wan pesenti efuso `em`), da noti no de fu marki en agensi a ini wan ekispresi. Gi a bereedi a ini abesoluut marki, enke `px`.
    }

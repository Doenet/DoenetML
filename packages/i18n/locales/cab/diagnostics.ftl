# Garifuna diagnostics: the errors and warnings the core, the parser and the
# language server report about a document. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage. Message ids are never translated — only the
# text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Element names, attribute names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence`, `styleNumber` — are part of the language rather than
# prose and stay in English exactly as written, as does anything quoted back
# from the author's own source. Every `{ $identifier }` placeable is left
# spelled exactly as English spells it, and no Garifuna affix is ever welded
# onto one.
#
# **Orthography.** The standard Latin orthography of Honduras, Belize,
# Guatemala and Nicaragua: `a b ch d e f g h i k l m n ñ o p r s t u ü w y`.
# **`ü` is a letter of its own**, the high central vowel, written with the
# diaeresis everywhere it occurs and not interchangeable with `u`. **The
# falling tone is not written**: Garifuna distinguishes tone and the standard
# orthography leaves it unmarked, so an acute here is the Spanish-style stress
# accent Honduran practice uses on some words, not a tone mark — a reviewer
# should not read the absence of accents as an error. `c`, `j`, `q`, `v`, `x`
# and `z` are not in the alphabet, so every loan below is respelled around
# them: «bekitoru», «matrisi», «sekuensia», «funsion», «konbinasion»,
# «kontraste».
#
# **Number.** `Intl.PluralRules` has no CLDR data for `cab`; it falls back to
# the default locale and reports `one` and `other`, categories Garifuna does not
# select. Every place English writes a `[one]`/`[other]` pair is written here as
# **one unselected form**, keeping the count placeable where English has it —
# Garifuna does not mark a noun for number after a numeral, so the two English
# branches would have been identical anyway. Selects on non-numeric variables
# (`$mode`, `$type`, `$reason`, `$expected`, `$suggestion`, `$fallback`,
# `$component`, `$componentType`, `$isList`, `$labelKind`, `$context`) are not
# plural selects and keep every branch English has, with the same branch keys.
# `NUMBER(...)` calls are kept exactly as English writes them.
#
# **This file is a loan register in a Garifuna frame.** Garifuna has no written
# register for compiler diagnostics: there is no school subject, no manual and
# no body of technical prose in the language to draw the vocabulary from, and a
# Garifuna speaker who reads an error message today reads it in **Spanish**, or
# in **English** in Belize. This catalog therefore keeps that loan register
# rather than inventing a Garifuna one. The technical nouns are Spanish loans
# respelled to the Garifuna alphabet — «atributu», «balu», «númeru»,
# «bekitoru», «komponente», «funsion», «matrisi», «barianti», «sekuensia»,
# «referensia», «interbalu», «kordenada», «entéru» — and the sentence frame
# around them is Garifuna:
#
#   * «siñá» — cannot. It opens every "Cannot …" message.
#   * «lunti lan» — must be. It opens every "Must be a …" message.
#   * «mabuiti» — the privative of «buiti», *good*. It follows the noun and
#     carries every "Invalid …": «atributu mabuiti», «balu mabuiti».
#   * «úati» — there is none; «anihein» — there is.
#   * «mama» — the negative copula.
#   * «mádügün wamá» — we have not made it, for "Haven't implemented".
#   * «ignorarúati» — it is ignored; «Ignorarúa» — ignoring. A Spanish verb
#     stem carrying Garifuna verbal morphology, which is what this register
#     does in speech.
#
# It is a usable frame; it is not yet settled Garifuna technical prose, and a
# speaker should overwrite it freely. A Belizean reader may prefer the English
# loan in every noun slot here.
#
# **Confidence, and it is low.** Garifuna is the least-documented of the four
# languages in this batch. «buiti»/«mabuiti», «siñá», «úati», «anihein» and
# «lunti» carry the whole file and are the words to check first, together with
# «ígirúati» (it is left out), «aráfaguati» (it is found) and «gabáñabei» (it
# has), which recur in dozens of sentences. All 220 keys are written; nothing
# in this file falls back to English. Nothing here is a translation of the
# mathematics — the notation, the identifiers and the author's own quoted words
# stand as they are; it is a translation of the sentence around them.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = ignorarúati { $attributes } danme ichugúwa biama puntu lagumuhóun
line-segment-attributes-ignored-with-endpoint-and-midpoint = ignorarúati { $attributes } danme ichugúwa ában puntu lagumuhóun luma ában puntu lidan lanigi
line-segment-midpoint-offset-without-midpoint = úati lidiseti midpointOffset danme úati ában puntu lidan lanigi

## `<line>`

line-points-undetermined-dimensions = Línia luagu puntu mama subudiwati hadimension.
line-points-too-few-dimensions = Lunti lan línia luagu puntu to gadimensionti biama o ámuñegu.
line-points-depend-on-variables = Línia luagu puntu to lasandiragubei bariable: { $variables }.
line-equation-invalid-format = Fórmatu mabuiti lun ekuasion línia lidan bariable { $variable1 } luma { $variable2 }.

## `<ray>`

ray-overprescribed-through = Ichugúwati rayu luma through, endpoint luma direction.  Ignorarúa through.
ray-dimension-mismatch = Mama lafuriaruni numDimensions lidan rayu.

## `<vector>`

vector-overprescribed-head = Ichugúwati bekitoru luma head, tail luma displacement.  Ignorarúa head.
vector-dimension-mismatch = Mama lafuriaruni numDimensions lidan bekitoru.

## Attracting and constraining

attract-to-without-nearest-point = Siñá latraerun luagu ában `<{ $component }>`, ladüga úati lubaránigi nearestPoint.
constrain-to-without-nearest-point = Siñá lakonstreñirún luagu ában `<{ $component }>`, ladüga úati lubaránigi nearestPoint.
constrain-to-interior-without-nearest-point = Siñá lakonstreñirún lidan tidoun ában `<{ $component }>`, ladüga úati lubaránigi nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = ignorarúati labelPosition lun ában choiceInput mama inline

## Ordering children by index

choice-input-indices-count-mismatch = Ignorarúa índise ichugúwati lun choiceInput, ladüga mama lafuriaruni haruweiri índise luma haruweiri choice.
pretzel-indices-count-mismatch = Ignorarúa índise ichugúwati lun problem, ladüga mama lafuriaruni haruweiri índise luma haruweiri problem.
shuffle-indices-count-mismatch = Ignorarúa índise ichugúwati lun shuffle, ladüga mama lafuriaruni haruweiri índise luma haruweiri komponente.
indices-ignored-out-of-range = Ignorarúa índise ichugúwati lun { $component }, ladüga anihein índise lagüdübei lubéi.
pretzel-indices-repeated = Ignorarúa índise ichugúwati lun pretzel, ladüga anihein índise abürühóuti biama wéyaasu.
pretzel-circuit-first-index = Ignorarúa índise ichugúwati lun pretzel lidan circuit, ladüga lunti lan 1 lan índise furumiñeti.

## `<shuffle>` and `<sort>`

string-children-need-type = Lun ladagimarun `<{ $component }>` luma isaani string, lunti lan ichugúwa ában atributu `type`.
invalid-type-defaulting-to-math = Tipu mabuiti { $type } lun komponente { $component }. Lunti lan ában lidan math, text, number o boolean. Lásiruna math.
string-not-valid-component-to-arrange = String "{ $value }" mama ában komponente buiti lun { $component }. Ignorarúa.

## Types and variables

invalid-type-defaulting-to-number = Tipu mabuiti { $type }, lásiruna number.
invalid-variable-value = Balu mabuiti lun ában bariable: `{ $value }`

## Variants

variant-index-must-be-number = Lunti lan númeru lan índise barianti { $index }
variant-index-must-be-integer = Lunti lan entéru lan índise barianti { $index }

## `<sideBySide>`

side-by-side-absolute-widths = Mádügün wamá `<{ $component }>` lun medida absoluta. Lásiruna anchura relatiba.
side-by-side-absolute-margins = Mádügün wamá `<{ $component }>` lun medida absoluta. Lásiruna marhen relatiba.
side-by-side-no-block-child = `<{ $component }>` mabuiti: lunti lan gabáñabei ában isaani block.

## `<label>`

label-for-ignored-on-graphical = ignorarúati atributu `for` luagu ában `<label>` gráfiku.
label-for-must-resolve-to-one = Lunti lan atributu `for` luagu `<label>` larihín ában komponente lubéi.
label-for-unresolved = Siñá larihín ában komponente lun atributu `for` luagu `<label>`.
label-for-answer-with-authored-inputs = Atributu `for` luagu `<label>` labahüdaña ában `<answer>` gabáñabei entrada abürühóuti; babahüda entrada lungua.
label-for-answer-without-input = Atributu `for` luagu `<label>` labahüdaña ában `<answer>` úati lentrada lun letiketun.
label-for-must-reference-input-or-answer = Lunti lan atributu `for` luagu `<label>` labahüdüni ában entrada o ában respuesta.

## Accessibility

accessibility-short-description-or-decorative = Lun aksesibilidá, lunti lan gabáñabei `<{ $component }>` ában deskripsion gürigüwati o abürühóun keisi decorative.
accessibility-video-short-description = Lun aksesibilidá, lunti lan gabáñabei `<video>` ában deskripsion gürigüwati.
accessibility-input-short-description-or-label = Lun aksesibilidá, lunti lan gabáñabei `<{ $component }>` ában deskripsion gürigüwati o ában etiketa.
accessibility-answer-input-short-description-or-label = Lun aksesibilidá, lunti lan gabáñabei ában `<answer>` ladügübei ában entrada ában deskripsion gürigüwati o ában etiketa.
accessibility-short-description-contains-math = Mabuiti lan gabáñabei deskripsion gürigüwati komponente matemátika keisi `<{ $component }>`. Babüriha matemátika lau dimurei.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Úati lubéi lakontrastun { $colorName } lun uganu lidan iri seksion (lidan modu wuriti) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; lunti lan { $threshold }:1 lubéi).
       *[other] Úati lubéi lakontrastun { $colorName } lun uganu lidan iri seksion ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; lunti lan { $threshold }:1 lubéi).
    }

## `<circle>`

circle-through-points-non-numerical = Mádügün wamá `<circle>` luagu { $count } puntu danme úati hanúmeru puntu.
circle-too-many-through-points = Siñá lakalkularun sírkulu luagu ámuñegu darí 3 puntu.
circle-overprescribed-radius-center-points = Siñá lakalkularun sírkulu luma radiu, sentru luma puntu ichugúwati.
circle-center-with-multiple-points = Siñá lakalkularun sírkulu luma sentru ichugúwati luagu ámuñegu darí 1 puntu.
circle-radius-too-small = Siñá lakalkularun sírkulu: ladüga { $distance } lan lidise biama puntu, mürüsün lan radiu ichugúwati { $radius }.
circle-radius-with-many-points = Siñá ladügün sírkulu luagu ámuñegu darí biama puntu luma ában radiu ichugúwati.
circle-invalid-center-or-through-points = Sentru o puntu mabuiti lun sírkulu.
circle-radius-center-with-multiple-points = Siñá lakalkularun radiu lun sírkulu luma sentru ichugúwati luagu ámuñegu darí 1 puntu.
circle-radius-with-points-non-numerical = Siñá lakambiarun radiu lun sírkulu luagu puntu úati hanúmeru
circle-change-radius-non-numerical = Siñá lakambiarun radiu lun sírkulu luagu puntu úati hanúmeru
circle-change-center-non-numerical = Mádügün wamá lakambiarun sentru lun sírkulu luagu puntu úati hanúmeru.

## `<function>`

function-domain-insufficient-dimensions = Úati lubéi dimension lun dominiu lun funsion. Gabáñabei dominiu { $intervals } interbalu, gama lumoun gabáñabei funsion { $inputs } entrada.
function-domain-invalid-format = Fórmatu mabuiti lun dominiu lun funsion.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ignorarúa máksimu úati lanúmeru lun funsion.
        [minimum] Ignorarúa mínimu úati lanúmeru lun funsion.
        [extremum] Ignorarúa estremu úati lanúmeru lun funsion.
        [point] Ignorarúa puntu úati lanúmeru lun funsion.
        [slope] Ignorarúa pendiente úati lanúmeru lun funsion.
       *[other] Ignorarúa { $type } úati lanúmeru lun funsion.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Ignorarúa máksimu bagante lun funsion.
        [minimum] Ignorarúa mínimu bagante lun funsion.
        [extremum] Ignorarúa estremu bagante lun funsion.
        [point] Ignorarúa puntu bagante lun funsion.
       *[other] Ignorarúa { $type } bagante lun funsion.
    }

function-points-too-close = Gabáñabei funsion biama puntu yarafa lun ában ában. Siñá ladügün funsion.
function-iterates-input-output-mismatch = Gayarabei literarun funsion sun dan lubéi ában lan haruweiri entrada luma haruweiri salida. Gabáñabei funsion le { $inputs } entrada luma { $outputs } salida.

## `<sequence>`

sequence-invalid-length = Lunguti mabuiti lun sekuensia.  Lunti lan entéru mama mürüsünti darí 0.
sequence-invalid-step = Pasu mabuiti lun sekuensia.  Lunti lan númeru lun sekuensia tipu { $type }.
sequence-invalid-endpoint-number = "{ $attribute }" mabuiti lun sekuensia númeru.  Lunti lan númeru.
sequence-invalid-endpoint-letters = "{ $attribute }" mabuiti lun sekuensia lediha.  Lunti lan ában dagaruni lediha.
sequence-invalid-endpoint = "{ $attribute }" mabuiti lun sekuensia.
select-from-sequence-coprime-not-numbers = ignorarúati coprime, ladüga mama númeru lanúadirún
select-from-sequence-coprime-with-exclude-combinations = ignorarúati coprime, ladüga ichugúwati excludeCombinations

## Resolving a `target`

target-not-found = Target mabuiti lun `<{ $source }>`: siñá larihín target.
target-state-variable-not-found = Target mabuiti lun `<{ $source }>`: siñá larihín ában bariable liri "{ $property }" luagu ában `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Lunti lan ámu lan hariñagun bariable lun `<odeSystem>` luma bariable independiente.
ode-system-duplicate-variable-names = Siñá ladügün funsion RHS lun ODE luma iri bariable abürühóuti biama wéyaasu.
ode-system-rhs-function-error = Siñá ladügün funsion RHS lun ODE.  Anihein erroru lidan ladügǘn funsion mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Siñá ladügün ában ángulu lidan { $count } línia
angle-invalid-through-point = Puntu mabuiti lidan through lun `<angle>`
parabola-vertex-too-many-points = Mádügün wamá parábola luma bértise luagu ámuñegu darí 1 puntu.
parabola-too-many-points = Mádügün wamá parábola luagu ámuñegu darí 3 puntu.
intersection-too-many-items = Mádügün wamá intersekesion lun ámuñegu darí biama katei

## Other math components

ionic-compound-not-two-ions = Mádügün wamá konpuestu ióniku lun ámu katei ma biama ion.
ionic-compound-needs-cation-and-anion = Adügüwati konpuestu ióniku lun ában katión luma ában anión lumuti.
solve-equations-cannot-evaluate = Siñá larasurun ekuasion, ladüga siñá lakalkularun ekuasion: { $equation }
math-operators-operand-number-required = Lunti lan ichugúwa ában operandNumber danme lanúadirún ában operandu matemátika.
eigen-decomposition-failed = Siñá lakalkularun balu propiu lun matrisi

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: úati parámetru { $parameters } lidan patrón, ligía lasüdiragunbei ában bagante súnwandan.

## `<graph>`

graph-grid-invalid = `<graph>`: siñá lasubudirún grid="{ $grid }". Lunti lan none, medium, dense, o biama númeru mama mürüsünti darí 0 dagarǘwati luma ában espasiu, keisi grid="1 0.5". Úati grid abürühóun.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    Mégeiti `<{ $component }>` ában funsion luma { $expected ->
        [one] ában salida, pendiente y' lidan kada puntu, keisi `y - x`
       *[other] biama salida, bekitoru lidan kada puntu, keisi `(y, -x)`
    }, gama lumoun gabáñabei funsion ichugúwati { $found } salida. { $alternative ->
        [none] Úati katei abürühóun.
       *[other] `<{ $alternative }>` lan komponente lun funsion ligía. Úati katei abürühóun.
    }

field-function-attribute-ignored-with-child = ignorarúati atributu `function`, ladüga ichugúwati funsion tidan komponente giñe; lidan tidoun lan layusurúa. Bíchiga funsion lidan ában lubéi lidangiñe biama.

field-variables-ignored =
    `<{ $component }>`: labahüdaña atributu `variables` bariable lun ában espresion abürühóuti tidan komponente. { $reason ->
        [function-child] Ichugúwati funsion ya keisi ában isaani `<function>`, labahüdaña ligía hariñagun bariable lungua, ligía lignorarúnbei `variables`.
       *[no-expression] Úati espresion ligía ya, ligía lignorarúnbei `variables`.
    }

## PreFigure renderer
##
## `prefigure` and `PreFigure` are the renderer's own name and stay in English,
## as do the attribute names and the example values quoted back at the author.

prefigure-x-label-position-unsupported = `<graph>`: mígirunti xLabelPosition="left" lidan renderisadóru prefigure; layusurúa lubéi luagu ligibugiñe.
prefigure-y-label-position-unsupported = `<graph>`: mígirunti yLabelPosition="bottom" lidan renderisadóru prefigure; layusurúa lubéi luagu lidügübei.
prefigure-invalid-axis-bounds = `<graph>`: mabuiti lan lagumuhóun ehe lun lakambiarún lun prefigure; layusurúa bbox (-10,-10,10,10).
prefigure-invalid-width = `<graph>`: mabuiti lan anchura lun lakambiarún lun prefigure; layusurúa anchura 425.
prefigure-invalid-aspect-ratio = `<graph>`: mabuiti lan aspectRatio lun lakambiarún lun prefigure; layusurúa aspectRatio 1.
prefigure-grid-spacing-too-fine = `<graph>`: mürüsün lan lidise grid lun lagumuhóun ehe; ígirúati grid lidan renderisadóru prefigure.
prefigure-annotations-not-rendered = `<graph>`: siñá labürühóun anotasion danme mama layusurún renderisadóru PreFigure.

multiple-annotations-children = Aráfaguati saragu isaani `<annotations>` lidan `<graph>`; ignorarúati sun ma lagumuhóun.

## PreFigure conversion
##
## `{ $subject }` holds only a tag name, a component name and punctuation, and
## is composed in code; it stays exactly as it arrives.

prefigure-descendant-unsupported = { $subject }: mígirunti lidan renderisadóru prefigure lun graph; ígirúati isaani.
prefigure-descendant-invalid-geometry = { $subject }: heometría mabuiti o mama gumuhóuti; ígirúati isaani.
prefigure-curve-label-omitted = { $subject }: mígirunti etiketa luagu elementu curve kambiarúati; ígirúati etiketa.
prefigure-curve-unsupported-definition-type = { $subject }: mígirunti tipu definision curve '{ $definitionType }'; ígirúati isaani.
prefigure-region-flip-functions-unsupported = { $subject }: mígirunti atributu flipFunctions luagu regionBetweenCurves; ígirúati isaani.
prefigure-region-non-formula-child = { $subject }: funsion tipu formula lumuti lan gayarabei luagu regionBetweenCurves; ígirúati isaani.

prefigure-label-position-unsupported =
    { $subject }: mígirunti labelPosition '{ $labelPosition }' lun { $labelKind ->
        [line-family] etiketa lun ában línia
       *[point] etiketa lun ában puntu
    }; layusurúa lubéi lidan PreFigure.

prefigure-fill-style-unsupported = { $subject }: mígirunti estilu yenu '{ $fillStyle }' lidan PreFigure; layusurúa ában yenu buiti.
prefigure-line-style-unknown = { $subject }: mama subudiwati lan estilu línia '{ $lineStyle }'; ígirúati lídangiñe PreFigure.
prefigure-marker-style-mapped-to-diamond = { $subject }: kambiarúati estilu marka '{ $markerStyle }' lun estilu PreFigure 'diamond'.
prefigure-marker-style-unsupported = { $subject }: mígirunti estilu marka '{ $markerStyle }' lidan PreFigure; layusurúa lubéi.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` mabuiti; siñá larihín target. Ígirúati anotasion.
annotation-ref-multiple-targets = `<annotation>`: aráfaguati saragu target lun `ref`; layusurúa furumiñeti.
annotation-ref-outside-graph = `<annotation>`: `ref` mabuiti; lárigiñe graph lan target. Ígirúati anotasion.
annotation-ref-unsupported-target = `<annotation>`: `ref` mabuiti; mama ában katei gráfiku gayarabei lan target lidan lakambiarún lun prefigure. Ígirúati anotasion.
annotation-text-missing = `<annotation>`: úati o bagante lan `text`; abürühóuti uganu bagante.

## Referring to other components

copy-unrecognized-component-type = Siñá lakopiarun ában tipu komponente mama subudiwati: { $type }.
copy-prop-not-found = Siñá larihín prop { $property } luagu ában komponente tipu { $component }
collect-no-source = Úati fuente lun collect.
collect-invalid-component-type = Siñá lakolektarun komponente tipu `<{ $component }>`, ladüga tipu mabuiti lan.
reference-index-unavailable = Siñá labahüdün índise `{ $reference }`

## `<callAction>`

component-action-unavailable = Siñá layusurún { $action } luagu komponente `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Fórma mabuiti lun datu.  Mama lafuriaruni lunguti fila. Aráfaguati lidan componentIdx :{ $componentIdx }
data-frame-duplicate-column-names = Anihein iri kolumna abürühóuti biama wéyaasu.  Aráfaguati lidan componentIdx :{ $componentIdx }
data-frame-missing-column-name = Úati liri ában kolumna lidan datu.  Aráfaguati lidan componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Ában award lun respuesta to lasandiragubei lungua respuesta ichugúwati lun answer, ligía ladügübei katei mama emeragúati.
answer-max-num-attempts-in-section-wide-check-work = Úati lidiseti lichugún `maxNumAttempts` luagu ában `<answer>` tidan ában kontenedóru luma `sectionWideCheckWork`, ladüga kontenedóru lan lanügübei haruweiri intentu. Bíchiga `maxNumAttempts` luagu kontenedóru lubéi.
nested-section-wide-check-work-max-num-attempts = Úati lidiseti lichugún `maxNumAttempts` luagu ában kontenedóru luma `sectionWideCheckWork` tidan ámu kontenedóru luma `sectionWideCheckWork`, ladüga kontenedóru tidoungiñe lan lanügübei haruweiri intentu. Bíchiga `maxNumAttempts` luagu kontenedóru tidoungiñe.
answer-attributes-need-symbolic-equality = Úati lidiseti atributu { $attributes } danme mama ichugúwa symbolicEquality.
answer-invalid-type = Tipu mabuiti lun respuesta: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Ladüga úati liri komponente `<{ $component }>`, siñá layusurún keisi ában atributu lun ában module
module-attribute-name-already-defined = Siñá layusurún komponente `<{ $component } name="{ $name }">` keisi ában atributu lun ában module, ladüga gabáñabei komponente `<module>` ában atributu "{ $name }" giñe.
conditional-content-condition-ignored = ignorarúati atributu `condition` luagu ában komponente `<conditionalContent>` gabáñabei isaani case o else.
slider-markers-type-mismatch = Mama lafuriaruni tipu markers luma tipu slider.
pretzel-problem-needs-statement-and-answer = Pretzel mabuiti: lunti lan gabáñabei kada `<problem>` ában `<statement>` luma ában `<answer>`.
pretzel-circuit-first-problem-distractor = Pretzel mabuiti: lidan mode="circuit", siñá lan distractor lan `<problem>` furumiñeti.

## Attribute values

attribute-invalid-values = Balu mabuiti { $values } lun atributu `{ $attribute }`; ignorarúa.
attribute-must-be-references = Balu mabuiti `{ $value }` lun atributu `{ $attribute }`. Lunti lan adügǘwa atributu luma referensia to lagumeserubei luma ában `$`.
math-input-invalid-function-names = <mathInput>: ignorarúati iri funsion mabuiti lidan { $attribute }: { $names }. Lunti lan gabáñabei liri kada ában biama lediha lubéi (lediha o guión); gayarabei lárigiñe ában `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Tipu komponente mabuiti: `<{ $componentType }>`
attribute-repeated = Siñá labürühóun atributu { $attribute } biama wéyaasu.
attribute-invalid-for-component = Atributu mabuiti "{ $attribute }" lun ában komponente tipu `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Úati lubéi lakontrastun estilu { $styleNumber } lun { $context ->
        [text-on-background] kolor uganu luagu kolor fondu
        [high-contrast] kolor kontraste wéiriti luagu liensu
        [line] kolor línia luagu liensu
        [marker] kolor marka luagu liensu
       *[text-on-canvas] kolor uganu luagu liensu
    }{ $mode ->
        [dark] { " (lidan modu wuriti)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; lunti lan { $threshold }:1 lubéi).

style-definition-dark-mode-text-background-contrast =
    Ában lubéi buiti lan lakontrastun kolor ichugúwati lun estilu { $styleNumber } lidan modu haruti, úati lubéi lakontrastun kolor uganu luagu kolor fondu lidan modu wuriti adügüwati lídangiñe balu ligía ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; lunti lan { $threshold }:1 lubéi). { $suggestion ->
        [available] Lun lubéi lan kontraste lidan modu wuriti, o bawéiriduagüda kontraste lidan modu haruti (keisi { $lightAttribute }="{ $lightColor }") o basánsira kolor lidan modu wuriti (keisi { $darkAttribute }="{ $darkColor }").
       *[none] Lun lubéi lan kontraste lidan modu wuriti, bawéiriduagüda kontraste lidan modu haruti o basánsira kolor adügüwati luma textColorDarkMode o backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Ában lubéi buiti lan lakontrastun kolor uganu ichugúwati lun estilu { $styleNumber } lidan modu haruti, úati lubéi lakontrastun kolor uganu lidan modu wuriti adügüwati lídangiñe balu ligía luagu liensu ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; lunti lan { $threshold }:1 lubéi). { $suggestion ->
        [available] Lun lubéi lan kontraste lidan modu wuriti, o bawéiriduagüda kontraste lidan modu haruti (keisi textColor="{ $lightColor }") o basánsira kolor lidan modu wuriti (keisi textColorDarkMode="{ $darkColor }").
       *[none] Lun lubéi lan kontraste lidan modu wuriti, bawéiriduagüda kontraste lidan modu haruti o basánsira kolor adügüwati luma textColorDarkMode.
    }

section-multiple-style-palettes = Gayarabei lanúadirún ában seksion ában <stylePalette> lumuti; layusurúa lagumuhóun.

## Unique variants

variant-num-to-select-not-non-negative-integer = siñá lasubudirún barianti lumuti lun { $component }, ladüga mama entéru mama mürüsünti darí 0 lan numToSelect.
variant-num-to-select-not-constant-number = siñá lasubudirún barianti lumuti lun { $component }, ladüga mama númeru mama kambiaruati lan numToSelect.
variant-with-replacement-not-constant-boolean = siñá lasubudirún barianti lumuti lun { $component }, ladüga mama boolean mama kambiaruati lan withReplacement.
variant-select-weight-disables-unique = Úati barianti lumuti lun select danme anihein ában opsion luma selectWeight o selectForVariants ichugúwati
variant-coprime-undetermined = siñá lasubudirún barianti lumuti lun { $component }, ladüga siñá lasubudirún mama inarüni lan coprime súnwandan.
variant-attribute-not-constant = siñá lasubudirún barianti lumuti lun { $component }, ladüga mama kambiaruati lan { $attribute }.
variant-attribute-not-number = siñá lasubudirún barianti lumuti lun { $component }, ladüga mama númeru lan { $attribute }.

variant-attribute-wrong-type-for-sequence =
    siñá lasubudirún barianti lumuti lun { $component } tipu { $type }, ladüga mama { $expected ->
        [letters-combination] ában dagaruni lediha
        [math-expression] ában espresion matemátika buiti
        [integer] ában entéru
       *[number] ában númeru
    } lan { $attribute }.

variant-length-not-integer = siñá lasubudirún barianti lumuti lun { $component }, ladüga mama entéru lan length.
variant-sort-not-implemented = mádügün wamá barianti lumuti lun ában { $component } luma sort
variant-exclude-combinations-not-implemented = mádügün wamá barianti lumuti lun ában { $component } luma excludeCombinations
variant-math-exclude-not-implemented = mádügün wamá barianti lumuti lun ában { $component } tipu math luma exclude
variant-non-constant-exclude-not-implemented = mádügün wamá barianti lumuti lun ában { $component } luma exclude kambiaruati

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Aráfaguati ában dependensia sirkular.
       *[other] Aráfaguati ában dependensia sirkular luma komponente `<{ $componentType }>`.
    }

reference-no-referent = Úati katei lun referensia: `{ $reference }`
reference-multiple-referents = Saragu katei lun referensia: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Fórmatu mabuiti lun atributu { $attribute } lun `<{ $componentType }>`.
children-invalid = Isaani mabuiti lun `<{ $componentType }>`: aráfaguati isaani mabuiti: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Balu mabuiti `{ $value }` lun atributu `{ $attribute }`, layusurúa balu `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Siñá larihín bersion DoenetML { $version }.
       *[other] Siñá larihín bersion DoenetML { $version }. Layusurúa bersion { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML mabuiti: { $content }
parse-tag-missing-close-tag = DoenetML mabuiti: Úati letiketu lagumuhóun etiketa `{ $tag }`. Lunti lan ában etiketa lagumeirubei lungua o ában etiketa `</{ $tagName }>`.
parse-tag-error = DoenetML mabuiti: Anihein erroru lidan etiketa `<{ $tagName }>`
parse-attribute-missing-value = DoenetML mabuiti: Úati lubalu atributu mabuiti `{ $attribute }`.
parse-attribute-invalid = DoenetML mabuiti: Atributu mabuiti `{ $attribute }`
parse-attribute-value-invalid = DoenetML mabuiti: Balu atributu mabuiti `{ $value }`
parse-attribute-value-quote-mismatch = DoenetML mabuiti: Balu atributu mabuiti `{ $value }`. Mama lafuriaruni marka komiya. Ában lubéi bun ában `{ $quote }`
parse-open-tag-name-missing = DoenetML mabuiti: Aráfaguati ában etiketa úati liri, keisi `<`
parse-tag-not-closed = DoenetML mabuiti: Mama lagumuhóun etiketa `{ $tag }` (ában lubéi bun ában `>`).
parse-self-closing-tag-name-missing = DoenetML mabuiti: Aráfaguati ában etiketa úati liri `<{ $content }>`
parse-self-closing-tag-not-closed = DoenetML mabuiti: Mama lagumuhóun etiketa `{ $tag }` (ában lubéi bun `/>`).
parse-tag-invalid-attributes = DoenetML mabuiti: Mabuiti lan etiketa `{ $tag }`. Gayarabei lan mabuiti lan latributu.
parse-close-tag-name-missing = DoenetML mabuiti: Aráfaguati ában etiketa lagumuhóun úati liri, keisi `</`
parse-attribute-value-unquoted = Lunti lan lidan marka komiya lan balu atributu: `{ $attribute }="{ $value }"`
parse-close-tag-without-open-tag = DoenetML mabuiti: Aráfaguati etiketa lagumuhóun `{ $tag }`, gama lumoun úati letiketu lagumeserubei
parse-close-tag-mismatched = DoenetML mabuiti: Mama lafuriaruni etiketa lagumuhóun. Lunti lan `</{ $expected }>`. Aráfaguati `{ $found }`
parser-node-unconvertible = Siñá lakambiarun nodu { $node } lun ában nodu Dast.

## Names

name-attribute-invalid =
    Iri mabuiti name='{ $name }'. { $reason ->
        [characters] Gayarabei gabáñabei iri lediha, númeru, guión lidoungiñe o guión lumuti.
       *[start] Lunti lan lagumeserun iri luma ában lediha.
    }

component-name-invalid-start = Iri komponente mabuiti "{ $name }". Lunti lan lagumeserun iri luma ában lediha.

## `<answer>` sugar

answer-video-watched-missing-video = Lunti lan gabáñabei ában respuesta tipu videoWatched ában atributu video
answer-video-watched-video-not-reference = Lunti lan referensia lan atributu video lun ában respuesta tipu videoWatched
answer-name-not-single-text = Lunti lan gabáñabei atributu name lun respuesta ában isaani text lumuti

## Referencing another document

external-doenetml-recursion-limit = Siñá larihín DoenetML lídangiñe fiyeigiñe, ladüga saragu lan lanügün lungua. Anihein san ában referensia sirkular?
external-doenetml-unavailable = Siñá larihín DoenetML lídangiñe { $attribute }="{ $uri }"
external-doenetml-type-mismatch = DoenetML mabuiti larihín lídangiñe { $attribute }="{ $uri }": mama lafuriaruni luma tipu komponente "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Wéiyaasu lan atributu `{ $from }`; bayusura `{ $to }` lubéi.
       *[other] [deprecation] Wéiyaasu lan atributu `{ $from }` luagu `<{ $component }>`; bayusura `{ $to }` lubéi.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Wéiyaasu lan atributu `{ $from }`, ignorarúati ladüga ichugúwati `{ $to }` giñe.
       *[other] [deprecation] Wéiyaasu lan atributu `{ $from }` luagu `<{ $component }>`, ignorarúati ladüga ichugúwati `{ $to }` giñe.
    }

deprecated-attribute-ignored = [deprecation] Wéiyaasu lan atributu `{ $attribute }` luagu `<{ $component }>`, ignorarúati.
deprecated-attribute-to-child = [deprecation] Wéiyaasu lan atributu `{ $attribute }` luagu `<{ $component }>`; bayusura ában isaani `<{ $child }>` lubéi.
deprecated-attribute-value-renamed = [deprecation] Wéiyaasu lan balu `{ $value }` lun atributu `{ $attribute }` luagu `<{ $component }>`; bayusura `{ $to }` lubéi.


## Language coverage

pluralize-english-only = Gayarabei ladügün `<pluralize>` plural lidan inglisi lumuti, ligía lígirunbei luganu keisi lan lidan ában dokumentu abürühóuti lidan { $locale }. Babüriha fórma plural lungua, o bíchiga lau atributu `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Mama ában elementu Doenet subudiwati `<{ $tag }>`.
schema-element-not-allowed-at-root = Mígirunti elementu `<{ $tag }>` lidan lidügübei dokumentu.
schema-element-not-allowed-inside = Mígirunti elementu `<{ $tag }>` tidan `<{ $parent }>`.
schema-attribute-unrecognized = Úati ában atributu liri `{ $attribute }` luagu elementu `<{ $tag }>`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Lunti lan ában lista lan atributu `{ $attribute }` lun elementu `<{ $tag }>`, ában lidan to lubéi kada katei: { $allowed }
       *[other] Lunti lan ában lidan to lubéi atributu `{ $attribute }` lun elementu `<{ $tag }>`: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Iri barianti mabuiti lun select.  Aráfaguati iri barianti { $variantName } lidan { $numOptions } opsion, gama lumoun { $numToSelect } lan haruweiri lanúadirún.
select-variant-name-without-options = Ichugúwati barianti lun select, gama lumoun úati opsion lun iri barianti gayarabei: { $variantName }.
select-variant-name-not-possible = Mama ában iri barianti gayarabei iri barianti { $variantName } ichugúwati lun select.
select-too-few-options = Siñá lanúadirún { $numToSelect } komponente lídangiñe { $numOptions } lumuti.
select-from-sequence-too-few-values = Siñá lanúadirún { $numToSelect } balu lídangiñe ában sekuensia lunguti { $length }.
select-from-sequence-indices-count-mismatch = Lunti lan lafuriaruni haruweiri índise ichugúwati lun select luma haruweiri lanúadirún
select-from-sequence-indices-not-integers = Lunti lan entéru lan sun índise ichugúwati lun select
select-from-sequence-index-excluded = Ichugúwati ában índise lun selectfromsequence úati lubéi
select-from-sequence-indices-excluded-combination = Ichugúwati índise lun selectfromsequence ában konbinasion úati lubéi
select-from-sequence-coprime-not-positive-integers = Siñá lanúadirún konbinasion coprime, ladüga mama entéru wéiriti darí 0 lanúadirún.
select-from-sequence-coprime-common-factor = Siñá lanúadirún númeru coprime. Gabáñabei sun balu gayarabei ában faktóru ában. (Lunti lan coprime lan balu ichugúwati lun "from" o "to" luma "step".)
select-from-sequence-coprime-single-number = Siñá lanúadirún konbinasion coprime lídangiñe ában númeru lumuti mama 1 lan.
select-from-sequence-excluded-too-many-combinations = Úati lubéi ámuñegu darí 70% konbinasion lidan selectFromSequence
select-from-sequence-coprime-none-found = Siñá lanúadirún númeru coprime. Gabáñabei sun balu gayarabei ában faktóru ában.
select-from-sequence-too-few-unique-values = Siñá lanúadirún { $numToSelect } balu lumuti lídangiñe ában sekuensia lunguti { $numPossibleValues }
select-prime-numbers-too-few-values = Siñá lanúadirún { $numToSelect } balu lídangiñe ában lista númeru primu lunguti { $numValues }
select-prime-numbers-values-count-mismatch = Lunti lan lafuriaruni haruweiri balu ichugúwati lun select luma haruweiri lanúadirún
select-prime-numbers-values-not-prime = Lunti lan tidan lista númeru primu lan sun balu ichugúwati lun select
select-prime-numbers-values-excluded-combination = Ichugúwati balu lun selectPrimeNumbers ában konbinasion úati lubéi
select-prime-numbers-excluded-too-many-combinations = Úati lubéi ámuñegu darí 70% konbinasion lidan selectPrimeNumbers
select-random-combination-fluke = Lidan ában katei mama emeragúati, siñá lanúadirún ában konbinasion balu asaruwati
select-random-value-fluke = Lidan ában katei mama emeragúati, siñá lanúadirún ában balu asaruwati

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    Mama labürühóun `<{ $component }>` tidan matemátika; abürühóuti espresion keisi lan lubaragiñe. { $reason ->
        [not-inline] Ában choice input `inline` lumuti lan lasandirubei tidan ában espresion; danme úati `inline`, ában dagaruni butón lan.
        [expanded] Ában text input `expanded` ában kaha saragu-línia lan, wéiri lan lun lasandirun tidan ában espresion.
        [on-graph] Luagu ában graph, abürühóuti espresion keisi ában dibuhu lumuti, úati lubéi espasiu lun ában kontrol.
       *[relative-width] Relatiba lan `width` (ában porsientu o `em`), úati katei lun lamesurarún tidan ában espresion. Bíchiga anchura lidan medida absoluta, keisi `px`.
    }

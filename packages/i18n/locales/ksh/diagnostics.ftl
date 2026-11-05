# Colognian (Kölsch) diagnostics: the errors and warnings surfaced to the
# reader or the author. Translated from `locales/en/diagnostics.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The Akademie för uns Kölsche Sproch convention; see
# `chrome.ftl` for the note on «ß», the doubled vowels marking length, and the
# «j» where Standard German writes «g» — «jroß», «jelade», «jefunge».
#
# **Do not edit this toward Standard German**: «nit» and not «nicht», «kütt»
# and not «kommt», «Sigg» and not «Seite», «Beld» and not «Bild», «Fähler» and
# not «Fehler», «däm» and not «dem». See `chrome.ftl`.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `styleNumber`,
# `selectFromSequence`, `<answer>`, `maxNumAttempts`, `sectionWideCheckWork` —
# are part of the language, not prose, and stay in English exactly as written.
# So does anything quoted back from the author's own source, and so do the
# names `WCAG AA`, `DoenetML`, `PreFigure`, `prefigure`, `XML`, `mathjs` and
# `Dast`.
#
# **Number.** CLDR gives `ksh` the categories `zero`, `one` and `other`. This
# file writes `one` and `other` only: nothing counted here reaches an author at
# zero — a list of ignored attributes, a count of found outputs — so a `[zero]`
# branch would be dead text. The one genuine `[zero]` in this catalog is in
# `editor.ftl`, and `chrome.ftl`'s header sets out the whole distinction
# between an explicit `[0]` literal and a CLDR `[zero]` category. `[two]`,
# `[few]` and `[many]` are never written: `ksh` has none of them.
#
# Every **symbolic** selector — `$type`, `$mode`, `$reason`, `$context`,
# `$suggestion`, `$alternative`, `$fallback`, `$expected`, `$labelKind`,
# `$isList`, `$componentType`, `$span` — is kept byte for byte from English,
# keys included.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } weed nit beaach, wann zwei endpoints aanjejovve sin
       *[other] { $attributes } wääde nit beaach, wann zwei endpoints aanjejovve sin
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } weed nit beaach, wann ene endpoint un ene midpoint zesamme aanjejovve sin
       *[other] { $attributes } wääde nit beaach, wann ene endpoint un ene midpoint zesamme aanjejovve sin
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset bewirk nix ohne ene midpoint

## `<line>`

line-points-undetermined-dimensions = Linie döör Pünkte, wo de Zahl vun de Dimensione nit ze bestemme es.

line-points-too-few-dimensions = En Linie moß döör Pünkte jonn, di winnichstens zwei Dimensione han.

line-points-depend-on-variables = De Linie jeiht döör Pünkte, di vun Variable avhänge: { $variables }.

line-equation-invalid-format = Ungültich Form för de Jliechung vun der Linie en de Variable { $variable1 } un { $variable2 }.

## `<ray>`

ray-overprescribed-through = Dä Strahl es döör through, endpoint un direction festjelaat.  Dat aanjejovve through weed nit beaach.

ray-dimension-mismatch = numDimensions paß nit zesamme em Strahl.

## `<vector>`

vector-overprescribed-head = Dä Vektor es döör head, tail un displacement festjelaat.  Dat aanjejovve head weed nit beaach.

vector-dimension-mismatch = numDimensions paß nit zesamme em Vektor.

## Attracting and constraining

attract-to-without-nearest-point = Et kann nit op e `<{ $component }>` aanjetrocke wääde, weil dat kei nearestPoint als Zoostandsvariabel hät.

constrain-to-without-nearest-point = Et kann nit op e `<{ $component }>` bejrenz wääde, weil dat kei nearestPoint als Zoostandsvariabel hät.

constrain-to-interior-without-nearest-point = Et kann nit op et Enndere vun enem `<{ $component }>` bejrenz wääde, weil dat kei nearestPoint als Zoostandsvariabel hät.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition weed bei enem choiceInput, dat nit inline es, nit beaach

## Ordering children by index

choice-input-indices-count-mismatch = De för choiceInput aanjejovve Indize wääde nit beaach, weil de Zahl vun de Indize nit zo der Zahl vun de choice-Kinder paß.

pretzel-indices-count-mismatch = De för problem aanjejovve Indize wääde nit beaach, weil de Zahl vun de Indize nit zo der Zahl vun de problem-Kinder paß.

shuffle-indices-count-mismatch = De för shuffle aanjejovve Indize wääde nit beaach, weil de Zahl vun de Indize nit zo der Zahl vun de Komponente paß.

indices-ignored-out-of-range = De för { $component } aanjejovve Indize wääde nit beaach, weil e paar Indize usserhalv vum Bereich läje.

pretzel-indices-repeated = De för pretzel aanjejovve Indize wääde nit beaach, weil e paar Indize doppelt sin.

pretzel-circuit-first-index = De för pretzel em circuit-Modus aanjejovve Indize wääde nit beaach, weil dä eetste Index 1 sin moß.

## `<shuffle>` and `<sort>`

string-children-need-type = Domet `<{ $component }>` met Zeichekedde-Kinder läuf, moß e `type`-Attribut aanjejovve wääde.

invalid-type-defaulting-to-math = Ungültije type { $type } för de Komponent { $component }. Et moß math, text, number odder boolean sin. Et weed math jenomme.

string-not-valid-component-to-arrange = De Zeichekedd "{ $value }" es kein jültije Komponent för { $component }. Weed nit beaach.

## Types and variables

invalid-type-defaulting-to-number = Ungültije type { $type }, type weed op number jesatz.

invalid-variable-value = Ungültije Wäät vun ener Variabel: `{ $value }`

## Variants

variant-index-must-be-number = Dä Variant-Index { $index } moß en Zahl sin

variant-index-must-be-integer = Dä Variant-Index { $index } moß en janze Zahl sin

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` es för absolute Mooße nit ömjesatz. De Breite wääde relativ jesatz.

side-by-side-absolute-margins = `<{ $component }>` es för absolute Mooße nit ömjesatz. De Rändere wääde relativ jesatz.

side-by-side-no-block-child = Ungültich `<{ $component }>`: et moß winnichstens ei Block-Kind han.

## `<label>`

label-for-ignored-on-graphical = Dat `for`-Attribut aan enem jrafische `<label>` weed nit beaach.

label-for-must-resolve-to-one = Dat `for`-Attribut aan enem `<label>` moß op jenau ein Komponent zeije.

label-for-unresolved = Dat `for`-Attribut aan enem `<label>` kunnt op kein Komponent opjelöß wääde.

label-for-answer-with-authored-inputs = Dat `for`-Attribut aan enem `<label>` zeig op e `<answer>` met selvs jeschrevve Enjabe; zeich leever direk op der Enjab.

label-for-answer-without-input = Dat `for`-Attribut aan enem `<label>` zeig op e `<answer>` ohne ene Enjab, dä ze beschrefte wöhr.

label-for-must-reference-input-or-answer = Dat `for`-Attribut aan enem `<label>` moß op ene Enjab odder op en Antwood zeije.

## Accessibility

accessibility-short-description-or-decorative = För de Barrierefreiheit moß `<{ $component }>` entweder en koote Beschrievung han odder als decorative jekennzeichent sin.

accessibility-video-short-description = För de Barrierefreiheit moß `<video>` en koote Beschrievung han.

accessibility-input-short-description-or-label = För de Barrierefreiheit moß `<{ $component }>` en koote Beschrievung odder e Label han.

accessibility-answer-input-short-description-or-label = För de Barrierefreiheit moß e `<answer>`, dat ene Enjab aanläht, en koote Beschrievung odder e Label han.

accessibility-short-description-contains-math = En koote Beschrievung sollt kein Mathe-Komponente wie `<{ $component }>` enthalde. Schriev de Mathe met Wööt uus.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } hät ze winnich Kontras för der Tex vun der Övverschreff (dunkle Modus) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nüdich sin winnichstens { $threshold }:1).
       *[other] { $colorName } hät ze winnich Kontras för der Tex vun der Övverschreff ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nüdich sin winnichstens { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = E `<circle>` döör { $count } Pünkte es för der Fall, dat de Pünkte kein Zahlewääte han, nit ömjesatz.

circle-too-many-through-points = Ene Kreis döör mieh wie 3 Pünkte kann nit berechent wääde.

circle-overprescribed-radius-center-points = Ene Kreis met aanjejovvem Radius, Meddelpunk un through-Pünkte kann nit berechent wääde.

circle-center-with-multiple-points = Ene Kreis met aanjejovvem Meddelpunk döör mieh wie 1 Punk kann nit berechent wääde.

circle-radius-too-small = Dä Kreis kann nit berechent wääde: dä Avstand zwesche de zwei Pünkte es { $distance }, un dä aanjejovve Radius { $radius } es doför ze klein.

circle-radius-with-many-points = Ene Kreis döör mieh wie zwei Pünkte met enem aanjejovve Radius kann nit aanjelaat wääde.

circle-invalid-center-or-through-points = Ungültije Meddelpunk odder ungültije through-Pünkte vum Kreis.

circle-radius-center-with-multiple-points = Dä Radius vun enem Kreis met aanjejovvem Meddelpunk döör mieh wie 1 Punk kann nit berechent wääde.

circle-change-radius-non-numerical = Dä Radius vun enem Kreis met through-Pünkte ohne Zahlewääte kann nit jeändert wääde

circle-radius-with-points-non-numerical = Ene Kreis döör mieh wie ei Punk met enem aanjejovve Radius kann nit aanjelaat wääde, wann kein Zahlewääte do sin.

circle-change-center-non-numerical = Der Meddelpunk vun enem Kreis döör Pünkte ohne Zahlewääte ze ändere, es nit ömjesatz.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Ze winnich Dimensione för der Definizjohnsbereich vun der Funkzjohn. Dä Bereich hät { $intervals } Intervall, ävver de Funkzjohn hät { $inputs ->
            [one] { $inputs } Enjab
           *[other] { $inputs } Enjabe
        }.
       *[other] Ze winnich Dimensione för der Definizjohnsbereich vun der Funkzjohn. Dä Bereich hät { $intervals } Intervalle, ävver de Funkzjohn hät { $inputs ->
            [one] { $inputs } Enjab
           *[other] { $inputs } Enjabe
        }.
    }

function-domain-invalid-format = Ungültich Form för der Definizjohnsbereich vun der Funkzjohn.

function-ignoring-non-numerical =
    { $type ->
        [maximum] E Maximum vun der Funkzjohn ohne Zahlewäät weed nit beaach.
        [minimum] E Minimum vun der Funkzjohn ohne Zahlewäät weed nit beaach.
        [extremum] E Extremum vun der Funkzjohn ohne Zahlewäät weed nit beaach.
        [point] Ene Punk vun der Funkzjohn ohne Zahlewäät weed nit beaach.
        [slope] En Steijung vun der Funkzjohn ohne Zahlewäät weed nit beaach.
       *[other] { $type } vun der Funkzjohn ohne Zahlewäät weed nit beaach.
    }

function-ignoring-empty =
    { $type ->
        [maximum] E leddich Maximum vun der Funkzjohn weed nit beaach.
        [minimum] E leddich Minimum vun der Funkzjohn weed nit beaach.
        [extremum] E leddich Extremum vun der Funkzjohn weed nit beaach.
        [point] Ene leddije Punk vun der Funkzjohn weed nit beaach.
       *[other] E leddich { $type } vun der Funkzjohn weed nit beaach.
    }

function-points-too-close = De Funkzjohn hät zwei Pünkte, di ze deech beienander läje. De Funkzjohn kann nit bestemp wääde.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Iterazjohne vun ener Funkzjohn sin blos möjelich, wann de Zahl vun de Enjabe jenau su jroß es wie de Zahl vun de Uusjabe. Di Funkzjohn hät { $inputs } Enjab un { $outputs ->
            [one] { $outputs } Uusjab
           *[other] { $outputs } Uusjabe
        }.
       *[other] Iterazjohne vun ener Funkzjohn sin blos möjelich, wann de Zahl vun de Enjabe jenau su jroß es wie de Zahl vun de Uusjabe. Di Funkzjohn hät { $inputs } Enjabe un { $outputs ->
            [one] { $outputs } Uusjab
           *[other] { $outputs } Uusjabe
        }.
    }

## `<sequence>`

sequence-invalid-length = Ungültije Läng vun der Folch.  Et moß en janze Zahl sin, di nit nejativ es.

sequence-invalid-step = Ungültije Schredd vun der Folch.  För en Folch vum Typ { $type } moß dat en Zahl sin.

sequence-invalid-endpoint-number = Ungültich "{ $attribute }" vun ener Zahlefolch.  Et moß en Zahl sin.

sequence-invalid-endpoint-letters = Ungültich "{ $attribute }" vun ener Bochstavefolch.  Et moß en Kombinazjohn vun Bochstave sin.

sequence-invalid-endpoint = Ungültich "{ $attribute }" vun der Folch.

select-from-sequence-coprime-not-numbers = coprime weed nit beaach, weil kein Zahle usjesök wääde

select-from-sequence-coprime-with-exclude-combinations = coprime weed nit beaach, weil excludeCombinations aanjejovve es

## Resolving a `target`

target-not-found = Ungültich target för `<{ $source }>`: dat Ziel es nit ze fenge.

target-state-variable-not-found = Ungültich target för `<{ $source }>`: en Zoostandsvariabel met däm Naam "{ $property }" es aan enem `<{ $component }>` nit ze fenge.

## `<odeSystem>`

ode-system-variables-match-independent = De Variable vun enem `<odeSystem>` müsse andere sin wie de unavhängije Variabel.

ode-system-duplicate-variable-names = ODE-RHS-Funkzjohne met doppelte Naame för avhängije Variable künne nit bestemp wääde.

ode-system-rhs-function-error = De ODE-RHS-Funkzjohn kann nit bestemp wääde.  Fähler beim Aanläje vun der mathjs-Funkzjohn.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ene Wenkel zwesche { $count } Linie kann nit bestemp wääde

angle-invalid-through-point = Ungültije Punk em through vun enem `<angle>`

parabola-vertex-too-many-points = En Parabel met Scheitelpunk döör mieh wie 1 Punk es nit ömjesatz.

parabola-too-many-points = En Parabel döör mieh wie 3 Pünkte es nit ömjesatz.

intersection-too-many-items = Ene Schnett vun mieh wie zwei Saache es nit ömjesatz

## Other math components

ionic-compound-not-two-ions = En Ionevebendung us jet anderem wie zwei Ione es nit ömjesatz.

ionic-compound-needs-cation-and-anion = En Ionevebendung es blos för ei Kazjohn un ei Anjohn ömjesatz.

solve-equations-cannot-evaluate = De Jliechung kann nit jelöß wääde, weil se nit uuszerechne wor: { $equation }

math-operators-operand-number-required = Beim Eruusnemme vun enem Mathe-Operand moß e operandNumber aanjejovve wääde.

eigen-decomposition-failed = De Eijewääte vun der Matrix kunnte nit berechent wääde

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: dä Parameter { $parameters } kütt em Muster nit vör, dröm paß hä emmer op e Leddiges.
       *[other] `<matchesPattern>`: de Parameter { $parameters } kumme em Muster nit vör, dröm passe se emmer op e Leddiges.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" es nit ze deute. Et moß none, medium, dense odder zwei positive Zahle met enem Leerzeiche dozwesche sin, wie grid="1 0.5". Et weed kei Jetter jezeichent.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` bruch en Funkzjohn met { $expected ->
        [one] einer Uusjab, dä Steijung y' aan jedem Punk, wie `y - x`
       *[other] zwei Uusjabe, däm Vektor aan jedem Punk, wie `(y, -x)`
    }, ävver de Funkzjohn, di hä krät hät, hät { $found ->
        [one] { $found } Uusjab
       *[other] { $found } Uusjabe
    }. { $alternative ->
        [none] Et weed nix jezeichent.
       *[other] `<{ $alternative }>` es de Komponent för su en Funkzjohn. Et weed nix jezeichent.
    }

field-function-attribute-ignored-with-child = Dat `function`-Attribut weed nit beaach, weil de Funkzjohn och binne en der Komponent aanjejovve es; jenomme weed di vun binne. Jiv de Funkzjohn blos op ein vun de zwei Aate aan.

field-variables-ignored =
    `<{ $component }>`: dat `variables`-Attribut nenk de Variable vun enem Ussdrock, dä direk binne en der Komponent jeschrevve es. { $reason ->
        [function-child] De Funkzjohn es hee als `<function>`-Kind jejovve, un dat nenk sing Variable selvs, dröm weed `variables` nit beaach.
       *[no-expression] Su ene Ussdrock es hee nit jejovve, dröm weed `variables` nit beaach.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" weed vum prefigure-Renderer nit ongerstöz; et weed wie bei der rääschte Posizjohn jemaat.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" weed vum prefigure-Renderer nit ongerstöz; et weed wie bei der bovveschte Posizjohn jemaat.

prefigure-invalid-axis-bounds = `<graph>`: ungültije Achsejrenze för de prefigure-Ömwandlung; et weed de Standard-bbox (-10,-10,10,10) jenomme.

prefigure-invalid-width = `<graph>`: ungültije Breit för de prefigure-Ömwandlung; et weed de Standardbreit 425 jenomme.

prefigure-invalid-aspect-ratio = `<graph>`: ungültich aspectRatio för de prefigure-Ömwandlung; et weed dat Standardvehältnis 1 jenomme.

prefigure-grid-spacing-too-fine = `<graph>`: dat Jetter es för de Achsejrenze ze fing; em prefigure-Renderer weed et fottjelosse.

prefigure-annotations-not-rendered = `<graph>`: Aanmerkunge wääde nit jezeichent, wann nit dä PreFigure-Renderer jebruch weed.

multiple-annotations-children = En `<graph>` sin mieh `<annotations>`-Kinder jefunge woode; ußer däm letzte weed keins beaach.

## Referring to other components

copy-unrecognized-component-type = Ene onbekannte Komponente-Typ kann nit erwiggert odder kopeet wääde: { $type }.

copy-prop-not-found = De Eijeschaff { $property } es aan ener Komponent vum Typ { $component } nit ze fenge

collect-no-source = Kei source för collect jefunge.

collect-invalid-component-type = Komponente vum Typ `<{ $component }>` künne nit jesammelt wääde, weil dat kei jültije Komponente-Typ es.

reference-index-unavailable = Dä Index `{ $reference }` kann nit aanjesproche wääde

## `<callAction>`

component-action-unavailable = { $action } kann aan der Komponent `{ $reference }` nit opjeroofe wääde

## `<dataFrame>`

data-frame-inconsistent-row-lengths = De Date han en ungültije Form.  De Reije han onjliche Längde. Jefunge en componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = De Date han doppelte Spaltenaame.  Jefunge en componentIdx :{ $componentIdx }

data-frame-missing-column-name = De Date han ene fählende Spaltenaam.  Jefunge en componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = E award för di Antwood bezeiht sich op de eijene jescheckte Antwood vum answer-Tag, un dat föhrt zo Saache, di keiner erwaade deiht.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` aan enem `<answer>` en enem Behälter met `sectionWideCheckWork` bewirk nix, weil de Zahl vun de Versöök vum Behälter jesteuert weed. Setz `maxNumAttempts` leever aan der Behälter.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` aan enem Behälter met `sectionWideCheckWork`, dä en enem andere Behälter met `sectionWideCheckWork` sitz, bewirk nix, weil de Zahl vun de Versöök vum bovveschte Behälter jesteuert weed. Setz `maxNumAttempts` leever aan dä bovveschte Behälter.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Dat Attribut { $attributes } bewirk nix, wann symbolicEquality nit jesatz es.
       *[other] De Attribute { $attributes } bewirke nix, wann symbolicEquality nit jesatz es.
    }

answer-invalid-type = Ungültije Typ för de Antwood: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Weil de Komponent `<{ $component }>` keine Naam hät, kann se nit als Attribut vun enem Modul jebruch wääde

module-attribute-name-already-defined = De Komponent `<{ $component } name="{ $name }">` kann nit als Attribut vun enem Modul jebruch wääde, weil dä Komponente-Typ `<module>` ald e Attribut met däm Naam "{ $name }" hät.

conditional-content-condition-ignored = Dat Attribut `condition` weed aan ener `<conditionalContent>`-Komponent met case- odder else-Kinder nit beaach.

slider-markers-type-mismatch = Dä Typ vun de Marke paß nit zom Typ vum Schiever.

pretzel-problem-needs-statement-and-answer = Ungültije pretzel: jedes `<problem>` moß ei `<statement>` un ei `<answer>` enthalde.

pretzel-circuit-first-problem-distractor = Ungültije pretzel: em mode="circuit" darf dat eetste `<problem>` kei Aavlenkung sin.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Ungültije Wäät { $values } för dat Attribut `{ $attribute }`; weed nit beaach.
       *[other] Ungültije Wääte { $values } för dat Attribut `{ $attribute }`; wääde nit beaach.
    }

attribute-must-be-references = Ungültije Wäät `{ $value }` för dat Attribut `{ $attribute }`. Dat Attribut moß us Verwiese bestonn, di met enem `$` aanfange.

math-input-invalid-function-names = <mathInput>: ungültije Funkzjohnsnaame en { $attribute } nit beaach: { $names }. Jeder Naam moß em aanjezeichte Deil winnichstens 2 Zeiche han (Bochstave odder Streche); ene freiwillije Aanhang `|<mathspeak alternative>` kann dernoh kumme.

## Building components from the source

component-type-invalid = Ungültije Komponente-Typ: `<{ $componentType }>`

attribute-repeated = Dat Attribut { $attribute } darf nit doppelt kumme.

attribute-invalid-for-component = Ungültich Attribut "{ $attribute }" för en Komponent vum Typ `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    De Stilfestlääjung { $styleNumber } hät ze winnich Kontras för { $context ->
        [text-on-background] de Texfarv jäjen de Hingerjrundfarv
        [high-contrast] de kontrasstarke Farv jäjen de Zeichefläch
        [line] de Linjefarv jäjen de Zeichefläch
        [marker] de Markefarv jäjen de Zeichefläch
       *[text-on-canvas] de Texfarv jäjen de Zeichefläch
    }{ $mode ->
        [dark] { " (dunkle Modus)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nüdich sin winnichstens { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    De Stilfestlääjung { $styleNumber } hät zwar Farve aanjejovve, di em helle Modus jenoch Kontras han, ävver de doruus avjeleite Farve för der dunkle Modus han ze winnich Kontras vun der Texfarv jäjen de Hingerjrundfarv ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nüdich sin winnichstens { $threshold }:1). { $suggestion ->
        [available] Domet och em dunkle Modus jenoch Kontras do es, maach entweder der Kontras em helle Modus jrößer (zom Beispell { $lightAttribute }="{ $lightColor }") odder setz de Farv för der dunkle Modus selvs (zom Beispell { $darkAttribute }="{ $darkColor }").
       *[none] Domet och em dunkle Modus jenoch Kontras do es, maach der Kontras em helle Modus jrößer odder setz de avjeleite Farve selvs met textColorDarkMode un/odder backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    De Stilfestlääjung { $styleNumber } hät zwar en Texfarv aanjejovve, di em helle Modus jenoch Kontras hät, ävver de doruus avjeleite Texfarv för der dunkle Modus hät ze winnich Kontras jäjen de Zeichefläch ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; nüdich sin winnichstens { $threshold }:1). { $suggestion ->
        [available] Domet och em dunkle Modus jenoch Kontras do es, maach entweder der Kontras em helle Modus jrößer (zom Beispell textColor="{ $lightColor }") odder setz de Farv för der dunkle Modus selvs (zom Beispell textColorDarkMode="{ $darkColor }").
       *[none] Domet och em dunkle Modus jenoch Kontras do es, maach der Kontras em helle Modus jrößer odder setz de avjeleite Farv selvs met textColorDarkMode.
    }

section-multiple-style-palettes = Ene Avschnett kann blos ein <stylePalette> usnemme; jenomme weed di letzte.

## Unique variants

variant-num-to-select-not-non-negative-integer = de eijene Variante vun { $component } sin nit ze bestemme, weil numToSelect kein janze Zahl es, di nit nejativ es.

variant-num-to-select-not-constant-number = de eijene Variante vun { $component } sin nit ze bestemme, weil numToSelect kein feste Zahl es.

variant-with-replacement-not-constant-boolean = de eijene Variante vun { $component } sin nit ze bestemme, weil withReplacement kei feste Wohrheitswäät es.

variant-select-weight-disables-unique = Eijene Variante för select sin avjeschalt, wann en Opzjohn met selectWeight odder selectForVariants aanjejovve es

variant-coprime-undetermined = de eijene Variante vun { $component } sin nit ze bestemme, weil nit ze bestemme es, ov coprime emmer falsch es.

variant-attribute-not-constant = de eijene Variante vun { $component } sin nit ze bestemme, weil { $attribute } nit fes es.

variant-attribute-not-number = de eijene Variante vun { $component } sin nit ze bestemme, weil { $attribute } kein Zahl es.

variant-attribute-wrong-type-for-sequence =
    de eijene Variante vun { $component } vum Typ { $type } sin nit ze bestemme, weil { $attribute } nit { $expected ->
        [letters-combination] en Kombinazjohn vun Bochstave
        [math-expression] ene jültije mathematische Ussdrock
        [integer] en janze Zahl
       *[number] en Zahl
    } es.

variant-length-not-integer = de eijene Variante vun { $component } sin nit ze bestemme, weil de Läng kein janze Zahl es.

variant-sort-not-implemented = eijene Variante vun enem { $component } met sort sin nit ömjesatz

variant-exclude-combinations-not-implemented = eijene Variante vun enem { $component } met excludeCombinations sin nit ömjesatz

variant-math-exclude-not-implemented = eijene Variante vun enem { $component } vum Typ math met exclude sin nit ömjesatz

variant-non-constant-exclude-not-implemented = eijene Variante vun enem { $component } met enem exclude, dat nit fes es, sin nit ömjesatz

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: em prefigure-Renderer vum graph nit ongerstöz; dat Ongerelement weed övversprunge.

prefigure-descendant-invalid-geometry = { $subject }: de Jeometrie es nit endlich odder nit vollständich; dat Ongerelement weed övversprunge.

prefigure-curve-label-omitted = { $subject }: aan ömjewandelte Kurve-Elemente sin kein Labels ongerstöz; dat Label weed fottjelosse.

prefigure-curve-unsupported-definition-type = { $subject }: dä Typ '{ $definitionType }' för de Festlääjung vun der Kurvefunkzjohn es nit ongerstöz; dat Ongerelement weed övversprunge.

prefigure-region-flip-functions-unsupported = { $subject }: dat Attribut flipFunctions es aan regionBetweenCurves nit ongerstöz; dat Ongerelement weed övversprunge.

prefigure-region-non-formula-child = { $subject }: aan regionBetweenCurves sin blos Kindfunkzjohne vum Typ formula ongerstöz; dat Ongerelement weed övversprunge.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' es för { $labelKind ->
        [line-family] e Label us der Linjefamilich
       *[point] e Punk-Label
    } nit ongerstöz; et weed de Standard-Uusrichtung vun PreFigure jenomme.

prefigure-fill-style-unsupported = { $subject }: dä Föllstil '{ $fillStyle }' weed vun PreFigure nit ongerstöz; et weed en volle Föllung jenomme.

prefigure-line-style-unknown = { $subject }: dä onbekannte Linjestil '{ $lineStyle }' weed en der PreFigure-Uusjab fottjelosse.

prefigure-marker-style-mapped-to-diamond = { $subject }: dä Markestil '{ $markerStyle }' es op der PreFigure-Stil 'diamond' avjebild.

prefigure-marker-style-unsupported = { $subject }: dä Markestil '{ $markerStyle }' weed vun PreFigure nit ongerstöz; et weed dä Standardstil jenomme.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: ungültich `ref`; dat Ziel es nit ze fenge. De Aanmerkung weed fottjelosse.

annotation-ref-multiple-targets = `<annotation>`: `ref` zeig op mieh Ziele; jenomme weed dat eetste.

annotation-ref-outside-graph = `<annotation>`: ungültich `ref`; dat Ziel litt usserhalv vum ömjevende graph. De Aanmerkung weed fottjelosse.

annotation-ref-unsupported-target = `<annotation>`: ungültich `ref`; dat Ziel es bei der prefigure-Ömwandlung kei ongerstöz jrafisch Objek. De Aanmerkung weed fottjelosse.

annotation-text-missing = `<annotation>`: `text` fählt odder es leddich; et weed leddije Tex uusjejovve.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] En em Kreis laufende Avhängichkeit jefunge.
       *[other] En em Kreis laufende Avhängichkeit jefunge, aan der en `<{ $componentType }>`-Komponent bedeilich es.
    }

reference-no-referent = Nix jefunge, wo dä Verwies drop zeije däät: `{ $reference }`

reference-multiple-referents = Mieh wie ein Saach jefunge, wo dä Verwies drop zeije künnt: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Ungültije Form för dat Attribut { $attribute } vun `<{ $componentType }>`.

children-invalid = Ungültije Kinder för `<{ $componentType }>`: ungültije Kinder jefunge: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Ungültije Wäät `{ $value }` för dat Attribut `{ $attribute }`, et weed dä Wäät `{ $default }` jenomme

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] De DoenetML-Version { $version } es nit ze fenge.
       *[other] De DoenetML-Version { $version } es nit ze fenge. Et weed op de Version { $fallback } zeröckjejange
    }

## Reading the DoenetML

parse-invalid-doenetml = Ungültich DoenetML: { $content }

parse-tag-missing-close-tag = Ungültich DoenetML: Dä Tag `{ $tag }` hät keine Schlußtag. Erwaad wor ene selvs schleßende Tag odder ene `</{ $tagName }>`-Tag.

parse-tag-error = Ungültich DoenetML: Fähler em Tag `<{ $tagName }>`

parse-attribute-missing-value = Ungültich DoenetML: Däm ungültije Attribut `{ $attribute }` schingk ene Wäät ze fähle.

parse-attribute-invalid = Ungültich DoenetML: Ungültich Attribut `{ $attribute }`

parse-attribute-value-invalid = Ungültich DoenetML: Ungültije Attributwäät `{ $value }`

parse-attribute-value-quote-mismatch = Ungültich DoenetML: Ungültije Attributwäät `{ $value }`. De Aanföhrungszeiche passe nit zesamme. Do schingk e `{ $quote }` ze fähle

parse-open-tag-name-missing = Ungültich DoenetML: Ene Tag ohne Tag-Naam jefunge, zom Beispell `<`

parse-tag-not-closed = Ungültich DoenetML: Dä Tag `{ $tag }` es nit zojemaat woode (e `>` schingk ze fähle).

parse-self-closing-tag-name-missing = Ungültich DoenetML: Ene Tag ohne Tag-Naam jefunge `<{ $content }>`

parse-self-closing-tag-not-closed = Ungültich DoenetML: Dä Tag `{ $tag }` es nit zojemaat woode (`/>` schingk ze fähle).

parse-tag-invalid-attributes = Ungültich DoenetML: Dä Tag `{ $tag }` es nit jültich. Villeich sin de Attribute verkiehrt.

parse-close-tag-name-missing = Ungültich DoenetML: Ene Schlußtag ohne Tag-Naam jefunge, zom Beispell `</`

parse-attribute-value-unquoted = Attributwääte müsse en Aanföhrungszeiche stonn: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Ungültich DoenetML: Dä Schlußtag `{ $tag }` es jefunge, ävver et jitt keine passende Aanfangstag

parse-close-tag-mismatched = Ungültich DoenetML: Dä Schlußtag paß nit. Erwaad wor `</{ $expected }>`. Jefunge wor `{ $found }`

parser-node-unconvertible = Dä Knöttche { $node } kunnt nit en ene Dast-Knöttche ömjewandelt wääde.

## Names

name-attribute-invalid =
    Ungültich Attribut name='{ $name }'. { $reason ->
        [characters] Naame dürfe blos Bochstave, Zahle, Ongerstreche odder Bindestreche enthalde.
       *[start] Naame müsse met enem Bochstav aanfange.
    }

component-name-invalid-start = Ungültije Komponentenaam "{ $name }". Naame müsse met enem Bochstav aanfange.

## `<answer>` sugar

answer-video-watched-missing-video = En Antwood vum Typ videoWatched moß e video-Attribut han

answer-video-watched-video-not-reference = En Antwood vum Typ videoWatched moß e video-Attribut han, dat ene Verwies es

answer-name-not-single-text = Dat name-Attribut vun ener Antwood moß jenau ei Tex-Kind han

## Referencing another document

external-doenetml-recursion-limit = Extern DoenetML kunnt nit jehollt wääde, weil et ze vill Rekursjohnsevvene sin. Litt do ene em Kreis laufende Verwies vör?

external-doenetml-unavailable = DoenetML kunnt vun { $attribute }="{ $uri }" nit jehollt wääde

external-doenetml-type-mismatch = Ungültich DoenetML vun { $attribute }="{ $uri }" jehollt: et paß nit zom Komponente-Typ "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Dat Attribut `{ $from }` es veralt; nemm leever `{ $to }`.
       *[other] [deprecation] Dat Attribut `{ $from }` aan `<{ $component }>` es veralt; nemm leever `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Dat Attribut `{ $from }` es veralt un weed nit beaach, weil `{ $to }` och aanjejovve es.
       *[other] [deprecation] Dat Attribut `{ $from }` aan `<{ $component }>` es veralt un weed nit beaach, weil `{ $to }` och aanjejovve es.
    }

deprecated-attribute-ignored = [deprecation] Dat Attribut `{ $attribute }` aan `<{ $component }>` es veralt un weed nit beaach.

deprecated-attribute-to-child = [deprecation] Dat Attribut `{ $attribute }` aan `<{ $component }>` es veralt; nemm leever e `<{ $child }>`-Kind.

deprecated-attribute-value-renamed = [deprecation] Dä Wäät `{ $value }` vum Attribut `{ $attribute }` aan `<{ $component }>` es veralt; nemm leever `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` kann blos Englisch en de Mehrzahl setze, dröm bliev dä Tex en enem Dokemänt op { $locale } su, wie hä es. Schriev de Mehrzahl direk hin odder setz se met däm Attribut `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Dat Element `<{ $tag }>` es kei bekannt Doenet-Element.

schema-element-not-allowed-at-root = Dat Element `<{ $tag }>` es janz bovve em Dokemänt nit ählaub.

schema-element-not-allowed-inside = Dat Element `<{ $tag }>` es binne en `<{ $parent }>` nit ählaub.

schema-attribute-unrecognized = Dat Element `<{ $tag }>` hät kei Attribut met däm Naam `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Dat Attribut `{ $attribute }` vum Element `<{ $tag }>` moß en Leß sin, wo jeder Endraach eins hievun es: { $allowed }
       *[other] Dat Attribut `{ $attribute }` vum Element `<{ $tag }>` moß eins hievun sin: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Ungültije Variantenaam för select.  Dä Variantenaam { $variantName } kütt en { $numOptions } Opzjohne vör, ävver uusjesök wääde solle { $numToSelect }.

select-variant-name-without-options = För select sin e paar Variante aanjejovve, ävver för dä möjelije Variantenaam { $variantName } sin kein Opzjohne aanjejovve.

select-variant-name-not-possible = Dä Variantenaam { $variantName }, dä för select aanjejovve es, es kei möjelije Variantenaam.

select-too-few-options = { $numToSelect } Komponente künne nit us blos { $numOptions } uusjesök wääde.

select-from-sequence-too-few-values = { $numToSelect } Wääte künne nit us ener Folch vun der Läng { $length } uusjesök wääde.

select-from-sequence-indices-count-mismatch = De Zahl vun de för select aanjejovve Indize moß zo der Zahl passe, di uusjesök wääde soll

select-from-sequence-indices-not-integers = All Indize, di för select aanjejovve sin, müsse janze Zahle sin

select-from-sequence-index-excluded = Ene Index vun selectfromsequence aanjejovve, dä usjeschlosse wor

select-from-sequence-indices-excluded-combination = Indize vun selectfromsequence aanjejovve, di en usjeschlosse Kombinazjohn wore

select-from-sequence-coprime-not-positive-integers = Teilerfremde Kombinazjohne künne nit uusjesök wääde, weil kein positive janze Zahle uusjesök wääde.

select-from-sequence-coprime-common-factor = Teilerfremde Zahle künne nit uusjesök wääde. All möjelije Wääte han ene jemeinsame Teiler. (De aanjejovve Wääte vun "from" odder "to" müsse teilerfremd zo "step" sin.)

select-from-sequence-coprime-single-number = Teilerfremde Kombinazjohne künne nit us ener eizije Zahl uusjesök wääde, di nit 1 es.

select-from-sequence-excluded-too-many-combinations = En selectFromSequence sin övver 70 % vun de Kombinazjohne usjeschlosse

select-from-sequence-coprime-none-found = Teilerfremde Zahle kunnte nit uusjesök wääde. All möjelije Wääte han ene jemeinsame Teiler.

select-from-sequence-too-few-unique-values = { $numToSelect } eijene Wääte künne nit us ener Folch vun der Läng { $numPossibleValues } uusjesök wääde

select-prime-numbers-too-few-values = { $numToSelect } Wääte künne nit us ener Leß vun Primzahle vun der Läng { $numValues } uusjesök wääde

select-prime-numbers-values-count-mismatch = De Zahl vun de för select aanjejovve Wääte moß zo der Zahl passe, di uusjesök wääde soll

select-prime-numbers-values-not-prime = All Wääte, di för select prime number aanjejovve sin, müsse en der Leß vun de Primzahle stonn

select-prime-numbers-values-excluded-combination = De aanjejovve Wääte vun selectPrimeNumbers wore en usjeschlosse Kombinazjohn

select-prime-numbers-excluded-too-many-combinations = En selectPrimeNumbers sin övver 70 % vun de Kombinazjohne usjeschlosse

select-random-combination-fluke = Döör ene janz onwahrscheinlije Zofall kunnt kein Kombinazjohn vun Zofallswääte uusjesök wääde

select-random-value-fluke = Döör ene janz onwahrscheinlije Zofall kunnt kei Zofallswäät uusjesök wääde

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` weed nit binne en der Mathe jezeichent; dä Ussdrock weed su jesatz, wie dat wor, ihr Enjabe dren stonn kunnte. { $reason ->
        [not-inline] Blos ene `inline` choice input paß binne en ene Ussdrock; ohne `inline` es et ene Block vun Knöpp.
        [expanded] Ene `expanded` text input es ene Kaste övver mieh Reije, un dä es ze jroß för binne en ene Ussdrock.
        [on-graph] Op enem Jraf weed dä Ussdrock als ei Beld jezeichent, un do es kei Plaz för ene Bedeenelement.
       *[relative-width] Sing `width` es relativ (e Prozent odder `em`), un do es binne en enem Ussdrock nix, wo dat jäjen jemesse wääde künnt. Jiv de Breit leever en absolute Einheite aan, wie `px`.
    }

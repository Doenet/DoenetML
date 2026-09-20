# Papiamentu (Kòrsou/Boneiru) diagnostics. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence`, `styleNumber`, `WCAG AA`, `PreFigure`,
# `[deprecation]` — are part of the language, not prose, and stay in English
# exactly as written. So does anything quoted back from the author's own
# source.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** This catalog is written in the **phonological orthography
# of Curaçao and Bonaire** — Papiamentu, spelled «kas», «yu», «skol», «bèk»,
# «buki», «hende». The **etymological orthography of Aruba** — Papiamento,
# «cas», «hoben», «trece» — is a real and equally official alternative and is
# deliberately **not** mixed into any of these four files. A reviewer from
# Aruba would **respell** this catalog rather than retranslate it: the words
# are the same, the spelling system is not. `chrome.ftl`'s header sets out the
# letters that carry the distinction — `k` and `s` for etymological
# `c`/`qu`/`z`, `y` for `j`/`ll`, and the vowel letters `è ò ù`. Papiamentu
# also writes an acute accent for irregular stress and tone («kámbia»; the
# «paña» / «pañá» pattern), and this seed marks stress only where the standard
# orthography requires it, so a reviewer should check accent placement
# specifically.
#
# **Number.** `Intl.PluralRules("pap")` resolves to `pap` and reports
# `['one','other']`. A Papiamentu noun after a numeral is unmarked — «dos
# purbamentu», never «dos purbamentunan» — so English's `one` and `other`
# branches would be word-for-word identical here, and each such message is
# written as **one unselected form**. No count-driven select appears in this
# file. The selects that remain (`$reason`, `$mode`, `$type`, `$expected`,
# `$isList`, `$suggestion`, `$context`, `$labelKind`, `$componentType`,
# `$fallback`, `$component`, `$alternative`) are not plural selects and every
# branch of them is translated.
#
# **Register.** Papiamentu takes its technical nouns from Dutch and Spanish
# and this seed keeps them — «funshon», «vektor», «matriz», «komponente»,
# «atributo», «sekuensia», «intervalo», «kontraste», «variante» — but the
# grammar around them is Papiamentu throughout: «ta / a / lo / tabata» before
# the verb, «no por» for inability, «mester» for obligation, «di» for
# possession, «pa» for purpose. No sentence here is Dutch or Spanish.
#
# **Confidence.** Every key of the English file is covered. The technical
# noun phrases are the seed's own composition rather than terms attested in a
# published Papiamentu mathematics register, so a reviewer should read them as
# proposals: «pendiente» (slope), «semirekta» (ray), «autovalor»
# (eigenvalue), «koprimo» (coprime) and «kuadrikula» (grid) are the five to
# check first.
#
# **The technical vocabulary here is a lexifier loan set.** Every technical
# noun in this file is a Dutch- or Spanish-mediated loan — those are the words
# Papiamentu actually uses, not a substitute for a native term — carried in
# Papiamentu's own orthography and Papiamentu's own grammar. The sentences
# around the loans are Papiamentu, not Dutch and not Spanish.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = { $attributes } ta ser ignorá ora dos punto final ta spesifiká

line-segment-attributes-ignored-with-endpoint-and-midpoint = { $attributes } ta ser ignorá ora tantu un punto final komo un punto medio ta spesifiká

line-segment-midpoint-offset-without-midpoint = midpointOffset no tin efekto sin un punto medio

## `<line>`

line-points-undetermined-dimensions = Liña pa punto ku dimenshon indeterminá.

line-points-too-few-dimensions = Liña mester pasa pa punto di por lo ménos dos dimenshon.

line-points-depend-on-variables = Liña ta pasa pa punto ku ta dependé di variabel: { $variables }.

line-equation-invalid-format = Fòrmato inválido pa ekuashon di liña den variabel { $variable1 } i { $variable2 }.

## `<ray>`

ray-overprescribed-through = Semirekta ta spesifiká pa through, endpoint i direction.  Ta ignorá e through spesifiká.

ray-dimension-mismatch = numDimensions no ta kuadra den e semirekta.

## `<vector>`

vector-overprescribed-head = Vektor ta spesifiká pa head, tail i displacement.  Ta ignorá e head spesifiká.

vector-dimension-mismatch = numDimensions no ta kuadra den e vektor.

## Attracting and constraining

attract-to-without-nearest-point = No por atraé na un `<{ $component }>` pasobra e no tin un variabel di estado nearestPoint.

constrain-to-without-nearest-point = No por limitá na un `<{ $component }>` pasobra e no tin un variabel di estado nearestPoint.

constrain-to-interior-without-nearest-point = No por limitá na interior di un `<{ $component }>` pasobra e no tin un variabel di estado nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ta ser ignorá pa un choiceInput ku no ta inline

## Ordering children by index

choice-input-indices-count-mismatch = Ta ignorá e índisenan spesifiká pa choiceInput pasobra e kantidat di índise no ta kuadra ku e kantidat di yu choice.

pretzel-indices-count-mismatch = Ta ignorá e índisenan spesifiká pa problem pasobra e kantidat di índise no ta kuadra ku e kantidat di yu problem.

shuffle-indices-count-mismatch = Ta ignorá e índisenan spesifiká pa shuffle pasobra e kantidat di índise no ta kuadra ku e kantidat di komponente.

indices-ignored-out-of-range = Ta ignorá e índisenan spesifiká pa { $component } pasobra algun índise ta fuera di rango.

pretzel-indices-repeated = Ta ignorá e índisenan spesifiká pa pretzel pasobra algun índise ta repetí.

pretzel-circuit-first-index = Ta ignorá e índisenan spesifiká pa pretzel den modo circuit pasobra e promé índise mester ta 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Pa `<{ $component }>` funshoná ku yu di tipo string, mester spesifiká un atributo `type`.

invalid-type-defaulting-to-math = Tipo { $type } inválido pa e komponente { $component }. Mester ta math, text, number of boolean. Ta usa math komo balor por defekto.

string-not-valid-component-to-arrange = E string "{ $value }" no ta un komponente válido pa { $component }. Ta ignorá.

## Types and variables

invalid-type-defaulting-to-number = Tipo { $type } inválido, ta pone tipo riba number.

invalid-variable-value = Balor inválido di un variabel: `{ $value }`

## Variants

variant-index-must-be-number = Índise di variante { $index } mester ta un number

variant-index-must-be-integer = Índise di variante { $index } mester ta un number entero

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` no ta implementá pa midí absoluto. Ta pone e anchonan relativo.

side-by-side-absolute-margins = `<{ $component }>` no ta implementá pa midí absoluto. Ta pone e marchennan relativo.

side-by-side-no-block-child = `<{ $component }>` inválido: e mester tin por lo ménos un yu di tipo block.

## `<label>`

label-for-ignored-on-graphical = E atributo `for` riba un `<label>` gráfiko ta ser ignorá.

label-for-must-resolve-to-one = E atributo `for` riba `<label>` mester resolvé na eksaktamente un komponente.

label-for-unresolved = E atributo `for` riba `<label>` no por a resolvé na un komponente.

label-for-answer-with-authored-inputs = E atributo `for` riba `<label>` ta referí na un `<answer>` ku input skirbí pa e outor; referí direktamente na e input.

label-for-answer-without-input = E atributo `for` riba `<label>` ta referí na un `<answer>` sin un input pa etiketá.

label-for-must-reference-input-or-answer = E atributo `for` riba `<label>` mester referí na un input of na un answer.

## Accessibility

accessibility-short-description-or-decorative = Pa aksesibilidat, `<{ $component }>` mester tin un deskripshon kòrtiku of mester ta spesifiká komo dekorativo.

accessibility-video-short-description = Pa aksesibilidat, `<video>` mester tin un deskripshon kòrtiku.

accessibility-input-short-description-or-label = Pa aksesibilidat, `<{ $component }>` mester tin un deskripshon kòrtiku of un etiketa.

accessibility-answer-input-short-description-or-label = Pa aksesibilidat, un `<answer>` ku ta krea un input mester tin un deskripshon kòrtiku of un etiketa.

accessibility-short-description-contains-math = Deskripshon kòrtiku no mester kontené komponente matemátiko manera `<{ $component }>`. Skirbi tur matemátika ku palabra.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } tin kontraste insufisiente pa e teksto di título di seksion (modo skur) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; mester ta por lo ménos { $threshold }:1).
       *[other] { $colorName } tin kontraste insufisiente pa e teksto di título di seksion ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; mester ta por lo ménos { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = No a implementá `<circle>` pa { $count } punto den kaso ku e puntonan no tin balor numériko.

circle-too-many-through-points = No por kalkulá un sirkulo pa mas ku 3 punto.

circle-overprescribed-radius-center-points = No por kalkulá un sirkulo ku radio, sentro i punto tur spesifiká.

circle-center-with-multiple-points = No por kalkulá un sirkulo ku sentro spesifiká pa mas ku 1 punto.

circle-radius-too-small = No por kalkulá e sirkulo: siendo ku e distansia entre e dos puntonan ta { $distance }, e radio spesifiká { $radius } ta muchu chikitu.

circle-radius-with-many-points = No por krea un sirkulo pa mas ku dos punto ku un radio spesifiká.

circle-invalid-center-or-through-points = Sentro of punto di paso inválido di e sirkulo.

circle-radius-center-with-multiple-points = No por kalkulá e radio di un sirkulo ku sentro spesifiká pa mas ku 1 punto.

circle-change-radius-non-numerical = No por kambia e radio di un sirkulo ku punto di paso no numériko

circle-radius-with-points-non-numerical = No por krea un sirkulo pa mas ku un punto ku radio spesifiká ora no tin balor numériko.

circle-change-center-non-numerical = No a implementá kambio di sentro di un sirkulo pa punto ku balor no numériko.

## `<function>`

function-domain-insufficient-dimensions = Dimenshon insufisiente pa e dominio di e funshon. E dominio tin { $intervals } intervalo pero e funshon tin { $inputs } input.

function-domain-invalid-format = Fòrmato inválido pa e dominio di e funshon.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ta ignorá máksimo no numériko di e funshon.
        [minimum] Ta ignorá mínimo no numériko di e funshon.
        [extremum] Ta ignorá ekstremo no numériko di e funshon.
        [point] Ta ignorá punto no numériko di e funshon.
        [slope] Ta ignorá pendiente no numériko di e funshon.
       *[other] Ta ignorá { $type } no numériko di e funshon.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Ta ignorá máksimo bashí di e funshon.
        [minimum] Ta ignorá mínimo bashí di e funshon.
        [extremum] Ta ignorá ekstremo bashí di e funshon.
        [point] Ta ignorá punto bashí di e funshon.
       *[other] Ta ignorá { $type } bashí di e funshon.
    }

function-points-too-close = E funshon tin dos punto ku ta muchu serka otro. No por definí e funshon.

function-iterates-input-output-mismatch = Iterashon di funshon ta posibel solamente si e kantidat di input di e funshon ta meskos ku e kantidat di output. E funshon aki tin { $inputs } input i { $outputs } output.

## `<sequence>`

sequence-invalid-length = Largura inválido di e sekuensia.  Mester ta un number entero no negativo.

sequence-invalid-step = Paso inválido di e sekuensia.  Mester ta un number pa un sekuensia di tipo { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" inválido di un sekuensia di number.  Mester ta un number.

sequence-invalid-endpoint-letters = "{ $attribute }" inválido di un sekuensia di lèter.  Mester ta un kombinashon di lèter.

sequence-invalid-endpoint = "{ $attribute }" inválido di e sekuensia.

select-from-sequence-coprime-not-numbers = coprime ta ser ignorá pasobra no ta selektá number

select-from-sequence-coprime-with-exclude-combinations = coprime ta ser ignorá pasobra excludeCombinations ta spesifiká

## Resolving a `target`

target-not-found = Target inválido pa `<{ $source }>`: no por hañ'é.

target-state-variable-not-found = Target inválido pa `<{ $source }>`: no por haña un variabel di estado ku nòmber "{ $property }" riba un `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = E variabelnan di `<odeSystem>` mester ta diferente for di e variabel independiente.

ode-system-duplicate-variable-names = No por definí funshon RHS di ODE ku nòmber di variabel dependiente duplicá.

ode-system-rhs-function-error = No por definí e funshon RHS di ODE.  Eror ora di krea e funshon mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = No por definí un angulo entre { $count } liña

angle-invalid-through-point = Punto inválido den e through di `<angle>`

parabola-vertex-too-many-points = No a implementá parabola ku vértise pa mas ku 1 punto.

parabola-too-many-points = No a implementá parabola pa mas ku 3 punto.

intersection-too-many-items = No a implementá interseshon pa mas ku dos elemento

## Other math components

ionic-compound-not-two-ions = No a implementá kompuesto ióniko pa nada otro ku dos ion.

ionic-compound-needs-cation-and-anion = Kompuesto ióniko ta implementá solamente pa un kation i un anion.

solve-equations-cannot-evaluate = No por resolvé e ekuashon pasobra no por a evaluá e ekuashon: { $equation }

math-operators-operand-number-required = Mester spesifiká un operandNumber ora di saka un operando matemátiko.

eigen-decomposition-failed = No por a kalkulá e autovalornan di e matriz

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: e parámetro { $parameters } no ta aparesé den e patronchi, p'esei semper e lo kuadra ku un blanko.

## `<graph>`

graph-grid-invalid = `<graph>`: no por interpretá grid="{ $grid }". Mester ta none, medium, dense, of dos number positivo separá pa un spasi, manera grid="1 0.5". No ta dibuhá kuadrikula.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` mester tin un funshon ku { $expected ->
        [one] un output, e pendiente y' na kada punto, manera `y - x`
       *[other] dos output, e vektor na kada punto, manera `(y, -x)`
    }, pero e funshon ku el a haña tin { $found } output. { $alternative ->
        [none] No ta dibuhá nada.
       *[other] `<{ $alternative }>` ta e komponente pa e funshon ei. No ta dibuhá nada.
    }

field-function-attribute-ignored-with-child = E atributo `function` ta ser ignorá pasobra e funshon ta duná tambe paden di e komponente; ta usa esun paden. Duna e funshon di ún di e dos manera so.

field-variables-ignored =
    `<{ $component }>`: e atributo `variables` ta nombra e variabelnan di un ekspreshon skirbí direktamente paden di e komponente. { $reason ->
        [function-child] E funshon akinan ta duná komo un yu `<function>`, ku ta nombra su mes variabelnan, p'esei `variables` ta ser ignorá.
       *[no-expression] No tin tal ekspreshon akinan, p'esei `variables` ta ser ignorá.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" no ta soportá den e renderisadó prefigure; ta usa e komportashon di posishon na drechi.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" no ta soportá den e renderisadó prefigure; ta usa e komportashon di posishon ariba.

prefigure-invalid-axis-bounds = `<graph>`: límite di ehe inválido pa e konvershon prefigure; ta usa e bbox por defekto (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: anchura inválido pa e konvershon prefigure; ta usa e anchura di diagrama por defekto 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio inválido pa e konvershon prefigure; ta usa e proporshon por defekto 1.

prefigure-grid-spacing-too-fine = `<graph>`: e spasio di e kuadrikula ta muchu fini pa e límitenan di ehe; e kuadrikula ta ser omití den e renderisadó prefigure.

prefigure-annotations-not-rendered = `<graph>`: anotashon lo no ser renderisá ora no ta usa e renderisadó PreFigure.

multiple-annotations-children = A haña vários yu `<annotations>` den `<graph>`; tur menos e último ta ser ignorá.

## Referring to other components

copy-unrecognized-component-type = No por ekstendé ni kopia un tipo di komponente no rekonosí: { $type }.

copy-prop-not-found = No por a haña e prop { $property } riba un komponente di tipo { $component }

collect-no-source = No a haña fuente pa collect.

collect-invalid-component-type = No por kolektá komponente di tipo `<{ $component }>` pasobra e ta un tipo di komponente inválido.

reference-index-unavailable = No por referí na e índise `{ $reference }`

## `<callAction>`

component-action-unavailable = No por yama { $action } riba e komponente `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = E dato tin forma inválido.  E filanan tin largura inkonsistente. Hañá den componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = E dato tin nòmber di kolumna duplicá.  Hañá den componentIdx :{ $componentIdx }

data-frame-missing-column-name = E dato ta falta un nòmber di kolumna.  Hañá den componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Un award di e answer aki ta basá riba e mes kontesta mandá di e tag answer, i esei lo hiba na komportashon inesperá.

answer-max-num-attempts-in-section-wide-check-work = Pone `maxNumAttempts` riba un `<answer>` paden di un kontenedor ku `sectionWideCheckWork` no tin efekto, pasobra e kontenedor ta kontrolá e kantidat di purbamentu. Pone `maxNumAttempts` riba e kontenedor mes.

nested-section-wide-check-work-max-num-attempts = Pone `maxNumAttempts` riba un kontenedor ku `sectionWideCheckWork` ku ta paden di un otro kontenedor ku `sectionWideCheckWork` no tin efekto, pasobra e kontenedor di pafó ta kontrolá e kantidat di purbamentu. Pone `maxNumAttempts` riba e kontenedor di pafó.

answer-attributes-need-symbolic-equality = E atributo { $attributes } lo no tin efekto sin symbolicEquality poní.

answer-invalid-type = Tipo inválido pa answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Komo e komponente `<{ $component }>` no tin nòmber, e no por ser usá pa un atributo di module

module-attribute-name-already-defined = E komponente `<{ $component } name="{ $name }">` no por ser usá komo atributo di un module pasobra e tipo di komponente `<module>` ya tin un atributo "{ $name }" definí.

conditional-content-condition-ignored = E atributo `condition` ta ser ignorá riba un komponente `<conditionalContent>` ku yu case of else.

slider-markers-type-mismatch = E tipo di marker no ta kuadra ku e tipo di slider.

pretzel-problem-needs-statement-and-answer = Pretzel inválido: kada `<problem>` mester kontené un `<statement>` i un `<answer>`.

pretzel-circuit-first-problem-distractor = Pretzel inválido: den mode="circuit", e promé `<problem>` no por ta un distraktor.

## Attribute values

attribute-invalid-values = Balor inválido { $values } pa e atributo `{ $attribute }`; ta ignorá.

attribute-must-be-references = Balor `{ $value }` inválido pa e atributo `{ $attribute }`. E atributo mester ta kompuesto di referensia ku ta kuminsá ku un `$`.

math-input-invalid-function-names = <mathInput>: a ignorá nòmber di funshon inválido den { $attribute }: { $names }. Kada nòmber su segmento di mustra mester tin por lo ménos 2 karakter (lèter of strepi); un sufiho opshonal `|<mathspeak alternative>` por sigui.

## Building components from the source

component-type-invalid = Tipo di komponente inválido: `<{ $componentType }>`

attribute-repeated = No por repetí e atributo { $attribute }.

attribute-invalid-for-component = Atributo "{ $attribute }" inválido pa un komponente di tipo `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    E definishon di estilo { $styleNumber } tin kontraste insufisiente pa { $context ->
        [text-on-background] koló di teksto kontra koló di fondo
        [high-contrast] koló di kontraste haltu kontra e kanvas
        [line] koló di liña kontra e kanvas
        [marker] koló di marker kontra e kanvas
       *[text-on-canvas] koló di teksto kontra e kanvas
    }{ $mode ->
        [dark] { " (modo skur)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; mester ta por lo ménos { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Ounke e definishon di estilo { $styleNumber } tin koló spesifiká ku ta duna kontraste sufisiente pa modo kla, e kolónan di modo skur derivá for di e balornan ei tin kontraste insufisiente pa e koló di teksto kontra e koló di fondo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; mester ta por lo ménos { $threshold }:1). { $suggestion ->
        [available] Pa garantisá kontraste sufisiente den modo skur, of oumentá e kontraste di modo kla (p.e., pone { $lightAttribute }="{ $lightColor }") of kambia e koló di modo skur (p.e., pone { $darkAttribute }="{ $darkColor }").
       *[none] Pa garantisá kontraste sufisiente den modo skur, oumentá e kontraste di modo kla of kambia e kolónan derivá ku textColorDarkMode i/of backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Ounke e definishon di estilo { $styleNumber } tin un koló di teksto spesifiká ku ta duna kontraste sufisiente pa modo kla, e koló di teksto di modo skur derivá for di e balor ei tin kontraste insufisiente kontra e kanvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; mester ta por lo ménos { $threshold }:1). { $suggestion ->
        [available] Pa garantisá kontraste sufisiente den modo skur, of oumentá e kontraste di modo kla (p.e., pone textColor="{ $lightColor }") of kambia e koló di modo skur (p.e., pone textColorDarkMode="{ $darkColor }").
       *[none] Pa garantisá kontraste sufisiente den modo skur, oumentá e kontraste di modo kla of kambia e koló derivá ku textColorDarkMode.
    }

section-multiple-style-palettes = Un seksion por selektá ún <stylePalette> so; ta usa e último.

## Unique variants

variant-num-to-select-not-non-negative-integer = no por determiná e variantenan úniko di { $component } pasobra numToSelect no ta un number entero no negativo.

variant-num-to-select-not-constant-number = no por determiná e variantenan úniko di { $component } pasobra numToSelect no ta un number konstante.

variant-with-replacement-not-constant-boolean = no por determiná e variantenan úniko di { $component } pasobra withReplacement no ta un boolean konstante.

variant-select-weight-disables-unique = Variante úniko pa select ta desaktivá si tin un opshon ku selectWeight of selectForVariants spesifiká

variant-coprime-undetermined = no por determiná e variantenan úniko di { $component } pasobra no por determiná ku coprime semper ta falsu.

variant-attribute-not-constant = no por determiná e variantenan úniko di { $component } pasobra { $attribute } no ta un konstante.

variant-attribute-not-number = no por determiná e variantenan úniko di { $component } pasobra { $attribute } no ta un number.

variant-attribute-wrong-type-for-sequence =
    no por determiná e variantenan úniko di { $component } di tipo { $type } pasobra { $attribute } no ta { $expected ->
        [letters-combination] un kombinashon di lèter
        [math-expression] un ekspreshon matemátiko válido
        [integer] un number entero
       *[number] un number
    }.

variant-length-not-integer = no por determiná e variantenan úniko di { $component } pasobra length no ta un number entero.

variant-sort-not-implemented = no a implementá variante úniko di un { $component } ku sort

variant-exclude-combinations-not-implemented = no a implementá variante úniko di un { $component } ku excludeCombinations

variant-math-exclude-not-implemented = no a implementá variante úniko di un { $component } di tipo math ku exclude

variant-non-constant-exclude-not-implemented = no a implementá variante úniko di un { $component } ku exclude no konstante

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: no ta soportá den e renderisadó prefigure di graph; e desendiente ta ser saltá.

prefigure-descendant-invalid-geometry = { $subject }: geometria no finito of inkompleto; e desendiente ta ser saltá.

prefigure-curve-label-omitted = { $subject }: etiketa no ta soportá riba elemento di kurva konvertí; e etiketa ta ser omití.

prefigure-curve-unsupported-definition-type = { $subject }: tipo di definishon di funshon di kurva '{ $definitionType }' no ta soportá; e desendiente ta ser saltá.

prefigure-region-flip-functions-unsupported = { $subject }: atributo flipFunctions no ta soportá riba regionBetweenCurves; e desendiente ta ser saltá.

prefigure-region-non-formula-child = { $subject }: solamente funshon yu di tipo formula ta soportá riba regionBetweenCurves; e desendiente ta ser saltá.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' no ta soportá pa { $labelKind ->
        [line-family] un etiketa di famia di liña
       *[point] un etiketa di punto
    }; ta usa e alineashon PreFigure por defekto.

prefigure-fill-style-unsupported = { $subject }: e estilo di yena '{ $fillStyle }' no ta soportá pa PreFigure; ta bolbe na un yena sólido.

prefigure-line-style-unknown = { $subject }: estilo di liña deskonosí '{ $lineStyle }' omití for di e salida PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: estilo di marker '{ $markerStyle }' konvertí na e estilo PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: estilo di marker '{ $markerStyle }' no ta soportá pa PreFigure; ta usa e estilo por defekto.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` inválido; no por resolvé e target. E anotashon ta ser omití.

annotation-ref-multiple-targets = `<annotation>`: `ref` a resolvé na vários target; ta usa e promé target.

annotation-ref-outside-graph = `<annotation>`: `ref` inválido; e target ta pafó di e graph ku ta kontené. E anotashon ta ser omití.

annotation-ref-unsupported-target = `<annotation>`: `ref` inválido; e target no ta un opheto gráfiko soportá den e konvershon prefigure. E anotashon ta ser omití.

annotation-text-missing = `<annotation>`: `text` ta falta of ta bashí; ta pone teksto bashí.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] A detektá un dependensia sirkular.
       *[other] A detektá un dependensia sirkular ku ta enbolbé un komponente `<{ $componentType }>`.
    }

reference-no-referent = No a haña referente pa e referensia: `{ $reference }`

reference-multiple-referents = A haña vários referente pa e referensia: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Fòrmato inválido pa e atributo { $attribute } di `<{ $componentType }>`.

children-invalid = Yu inválido pa `<{ $componentType }>`: A haña yu inválido: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Balor `{ $value }` inválido pa e atributo `{ $attribute }`, ta usa e balor `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] No a haña e vershon { $version } di DoenetML.
       *[other] No a haña e vershon { $version } di DoenetML. Ta bolbe na e vershon { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML inválido: { $content }

parse-tag-missing-close-tag = DoenetML inválido: E tag `{ $tag }` no tin tag di sera. Tabata spera un tag ku ta sera su mes of un tag `</{ $tagName }>`.

parse-tag-error = DoenetML inválido: Eror den e tag `<{ $tagName }>`

parse-attribute-missing-value = DoenetML inválido: Parse ku e atributo inválido `{ $attribute }` ta falta un balor.

parse-attribute-invalid = DoenetML inválido: Atributo inválido `{ $attribute }`

parse-attribute-value-invalid = DoenetML inválido: Balor di atributo inválido `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML inválido: Balor di atributo inválido `{ $value }`. E kòmanan no ta kuadra. Ta parse ku ta falta un `{ $quote }`

parse-open-tag-name-missing = DoenetML inválido: A haña un tag sin nòmber di tag, p.e. `<`

parse-tag-not-closed = DoenetML inválido: E tag `{ $tag }` no a ser será (ta parse ku ta falta un `>`).

parse-self-closing-tag-name-missing = DoenetML inválido: A haña un tag sin nòmber di tag `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML inválido: E tag `{ $tag }` no a ser será (ta parse ku ta falta un `/>`).

parse-tag-invalid-attributes = DoenetML inválido: E tag `{ $tag }` no ta válido. Podisé e tin atributo robes.

parse-close-tag-name-missing = DoenetML inválido: A haña un tag di sera sin nòmber di tag, p.e. `</`

parse-attribute-value-unquoted = Balor di atributo mester ta entre kòma: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML inválido: A haña e tag di sera `{ $tag }`, pero niun tag di habri korespondiente

parse-close-tag-mismatched = DoenetML inválido: Tag di sera ku no ta kuadra. Tabata spera `</{ $expected }>`. A haña `{ $found }`

parser-node-unconvertible = No por a konvertí e nodo { $node } na un nodo Dast.

## Names

name-attribute-invalid =
    Nòmber di atributo inválido name='{ $name }'. { $reason ->
        [characters] Un nòmber por kontené lèter, number, streki abou of strepi so.
       *[start] Un nòmber mester kuminsá ku un lèter.
    }

component-name-invalid-start = Nòmber di komponente inválido "{ $name }". Un nòmber mester kuminsá ku un lèter.

## `<answer>` sugar

answer-video-watched-missing-video = Un answer di tipo videoWatched mester tin un atributo video

answer-video-watched-video-not-reference = Un answer di tipo videoWatched mester tin un atributo video ku ta un referensia

answer-name-not-single-text = E atributo name di un answer mester tin un solo yu di tipo text

## Referencing another document

external-doenetml-recursion-limit = No por a haña e DoenetML eksterno pa motibu di muchu nivel di rekurshon. Tin un referensia sirkular?

external-doenetml-unavailable = No por a haña DoenetML for di { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML inválido hañá for di { $attribute }="{ $uri }": e no a kuadra ku e tipo di komponente "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] E atributo `{ $from }` ta obsoleto; usa `{ $to }` na su luga.
       *[other] [deprecation] E atributo `{ $from }` riba `<{ $component }>` ta obsoleto; usa `{ $to }` na su luga.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] E atributo `{ $from }` ta obsoleto i ta ser ignorá pasobra `{ $to }` ta spesifiká tambe.
       *[other] [deprecation] E atributo `{ $from }` riba `<{ $component }>` ta obsoleto i ta ser ignorá pasobra `{ $to }` ta spesifiká tambe.
    }

deprecated-attribute-ignored = [deprecation] E atributo `{ $attribute }` riba `<{ $component }>` ta obsoleto i ta ser ignorá.

deprecated-attribute-to-child = [deprecation] E atributo `{ $attribute }` riba `<{ $component }>` ta obsoleto; usa un yu `<{ $child }>` na su luga.

deprecated-attribute-value-renamed = [deprecation] E balor `{ $value }` di e atributo `{ $attribute }` riba `<{ $component }>` ta obsoleto; usa `{ $to }` na su luga.


## Language coverage

pluralize-english-only = `<pluralize>` por pone solamente ingles den plural, p'esei su teksto ta keda manera e ta den un dokumento skirbí na { $locale }. Skirbi e forma plural direktamente, of pon'é ku e atributo `pluralForm`.


## Checking against the schema

schema-element-unrecognized = E elemento `<{ $tag }>` no ta un elemento Doenet rekonosí.

schema-element-not-allowed-at-root = E elemento `<{ $tag }>` no ta permití na e rais di e dokumento.

schema-element-not-allowed-inside = E elemento `<{ $tag }>` no ta permití paden di `<{ $parent }>`.

schema-attribute-unrecognized = E elemento `<{ $tag }>` no tin un atributo ku yama `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] E atributo `{ $attribute }` di e elemento `<{ $tag }>` mester ta un lista ku kada elemento ta ún di: { $allowed }
       *[other] E atributo `{ $attribute }` di e elemento `<{ $tag }>` mester ta ún di: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nòmber di variante inválido pa select.  E nòmber di variante { $variantName } ta aparesé den { $numOptions } opshon pero e kantidat pa selektá ta { $numToSelect }.

select-variant-name-without-options = Tin variante spesifiká pa select pero no tin opshon spesifiká pa e posibel nòmber di variante: { $variantName }.

select-variant-name-not-possible = E nòmber di variante { $variantName } ku ta spesifiká pa select no ta un nòmber di variante posibel.

select-too-few-options = No por selektá { $numToSelect } komponente for di solamente { $numOptions }.

select-from-sequence-too-few-values = No por selektá { $numToSelect } balor for di un sekuensia di largura { $length }.

select-from-sequence-indices-count-mismatch = E kantidat di índise spesifiká pa select mester kuadra ku e kantidat pa selektá

select-from-sequence-indices-not-integers = Tur índise spesifiká pa select mester ta number entero

select-from-sequence-index-excluded = A spesifiká un índise di selectfromsequence ku tabata ekskluí

select-from-sequence-indices-excluded-combination = A spesifiká índise di selectfromsequence ku tabata un kombinashon ekskluí

select-from-sequence-coprime-not-positive-integers = No por selektá kombinashon koprimo pasobra no ta selektá number entero positivo.

select-from-sequence-coprime-common-factor = No por selektá number koprimo. Tur balor posibel ta kompartí un faktor komun. (E balornan spesifiká di "from" of "to" mester ta koprimo ku "step".)

select-from-sequence-coprime-single-number = No por selektá kombinashon koprimo for di un solo number ku no ta 1.

select-from-sequence-excluded-too-many-combinations = A ekskluí mas ku 70% di e kombinashonnan den selectFromSequence

select-from-sequence-coprime-none-found = No por a selektá number koprimo. Tur balor posibel ta kompartí un faktor komun.

select-from-sequence-too-few-unique-values = No por selektá { $numToSelect } balor úniko for di un sekuensia di largura { $numPossibleValues }

select-prime-numbers-too-few-values = No por selektá { $numToSelect } balor for di un lista di number primo di largura { $numValues }

select-prime-numbers-values-count-mismatch = E kantidat di balor spesifiká pa select mester kuadra ku e kantidat pa selektá

select-prime-numbers-values-not-prime = Tur balor spesifiká pa select di number primo mester ta den e lista di number primo

select-prime-numbers-values-excluded-combination = E balornan spesifiká di selectPrimeNumbers tabata un kombinashon ekskluí

select-prime-numbers-excluded-too-many-combinations = A ekskluí mas ku 70% di e kombinashonnan den selectPrimeNumbers

select-random-combination-fluke = Pa un kasualidat masha improbabel, no por a selektá un kombinashon di balor aleatorio

select-random-value-fluke = Pa un kasualidat masha improbabel, no por a selektá un balor aleatorio

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` no ta ser dibuhá paden di e matemátika; e ekspreshon ta ser skirbí manera e tabata promé ku por a pone input paden. { $reason ->
        [not-inline] Solamente un choice input `inline` ta kaba paden di un ekspreshon; sin `inline` e ta un blòki di bòter.
        [expanded] Un text input `expanded` ta un kaha di vários liña, ku ta muchu grandi pa kaba paden di un ekspreshon.
        [on-graph] Riba un graph e ekspreshon ta ser dibuhá komo un solo prenchi, ku no tin espasio pa un kontrol.
       *[relative-width] Su `width` ta relativo (un porsentahe of `em`), ku no tin nada pa midi kontra dje paden di un ekspreshon. Duna e anchura den unidat absoluto, manera `px`, na su luga.
    }

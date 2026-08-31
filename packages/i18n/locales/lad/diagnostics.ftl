# Ladino / Judeo-Spanish (djudeoespanyol) diagnostics. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script.** Latin script in the **Aki Yerushalayim** orthography. Ladino was
# written in Hebrew (Rashi, solitreo) letters for four centuries; the Latin
# Aki Yerushalayim spelling is what a reader meets today, so this catalog lays
# out **left to right**. ⟨k⟩ always for /k/, ⟨s⟩ for Spanish ⟨c⟩ / ⟨z⟩, ⟨sh⟩
# ⟨ch⟩ ⟨j⟩ ⟨dj⟩, ⟨y⟩ for Spanish ⟨ll⟩, ⟨ny⟩ for /ɲ/, ⟨v⟩ for intervocalic
# ⟨b⟩, no accents. See `chrome.ftl`. Numbers render in Latin digits.
#
# **What makes these sentences Ladino rather than Spanish respelt** is «no se
# puede», «deve» for *must*, «tiene» and «ay», «se topa» for *is found*,
# «trokar» for *to change*, «kitar» for *to remove*, «dainda no» for *not
# yet*, «ma» for *but*, «i» for *and*, «dingun / ninguna», «munchos», «kada»,
# and «yerro» for *error*. A sentence in this file without one of those
# markers is very likely still Spanish in Aki Yerushalayim clothing, and that
# is the quickest check a reviewer has.
#
# **What is borrowed.** The whole technical register — «atributo»,
# «komponente», «varyavle de estado», «matris», «dominio», «intervalo»,
# «sekuensia», «koprimo», «kontrasto» — is the Spanish learned Romance
# vocabulary respelt into Aki Yerushalayim. It is borrowed openly. Ladino has
# no computing or higher-mathematics register of its own: a speaker's own
# words for these things are **Hebrew** or **Turkish**, and neither can be
# spliced into a Romance sentence.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence`, `styleNumber` — are part of the language, not prose,
# and stay in English exactly as written. So does anything quoted back from the
# author's own source, and so do `WCAG AA`, `DoenetML`, `PreFigure` and
# `prefigure`, which are names.
#
# **Counts.** CLDR has **no plural data for `lad`**, so `Intl.PluralRules`
# falls back to root, where the only category is `other`. This catalog
# therefore writes **no** `[one]`, `[zero]`, `[two]`, `[few]` or `[many]`
# branch anywhere: wherever English selects on a count —
# `$attributesCount`, `$valuesCount`, `$parametersCount`, `$intervals`,
# `$inputs`, `$outputs`, `$found` — one form is written that reads for any
# number, with the impersonal «se» construction so that the verb need not
# agree.
#
# The one place a distinction was worth keeping is
# `field-function-wrong-num-outputs`, where one output and two outputs are not
# a grammatical difference but two different pieces of advice. There it is
# written as the **numeric literal branch `[1]`** — an exact-value match, a
# different mechanism from a plural category, and legal in every locale.
#
# Every **symbolic** selector — `$type`, `$mode`, `$reason`, `$context`,
# `$suggestion`, `$alternative`, `$fallback`, `$expected`, `$labelKind`,
# `$isList`, `$componentType` — is kept byte for byte from English, keys
# included.
#
# **Weakest first.** The periphrases for *cannot* and *have not implemented*
# («no se puede», «dainda no se izo») repeat a hundred times; changing them
# changes the tone of the whole file.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = Se inyora { $attributes } kuando se dan dos kavos

line-segment-attributes-ignored-with-endpoint-and-midpoint = Se inyora { $attributes } kuando se dan un kavo i un punto medio

line-segment-midpoint-offset-without-midpoint = midpointOffset no aze nada sin un punto medio

## `<line>`

line-points-undetermined-dimensions = Linya por puntos de dimensiones no determinadas.

line-points-too-few-dimensions = La linya deve pasar por puntos de al manko dos dimensiones.

line-points-depend-on-variables = La linya pasa por puntos ke dependen de las varyavles: { $variables }.

line-equation-invalid-format = Formato no valido para la ekuasion de la linya en las varyavles { $variable1 } i { $variable2 }.

## `<ray>`

ray-overprescribed-through = La semirekta esta definida por through, endpoint i direction.  Se inyora el through dado.

ray-dimension-mismatch = numDimensions no kuadra en la semirekta.

## `<vector>`

vector-overprescribed-head = El vektor esta definido por head, tail i displacement.  Se inyora el head dado.

vector-dimension-mismatch = numDimensions no kuadra en el vektor.

## Attracting and constraining

attract-to-without-nearest-point = No se puede atirar verso un `<{ $component }>`, porke no tiene la varyavle de estado nearestPoint.

constrain-to-without-nearest-point = No se puede restrinjir a un `<{ $component }>`, porke no tiene la varyavle de estado nearestPoint.

constrain-to-interior-without-nearest-point = No se puede restrinjir al adientro de un `<{ $component }>`, porke no tiene la varyavle de estado nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = Se inyora labelPosition en un choiceInput ke no es inline

## Ordering children by index

choice-input-indices-count-mismatch = Se inyoran los indises dados para choiceInput porke el numero de indises no kuadra kon el numero de ijos choice.

pretzel-indices-count-mismatch = Se inyoran los indises dados para problem porke el numero de indises no kuadra kon el numero de ijos problem.

shuffle-indices-count-mismatch = Se inyoran los indises dados para shuffle porke el numero de indises no kuadra kon el numero de komponentes.

indices-ignored-out-of-range = Se inyoran los indises dados para { $component } porke algunos indises estan afuera del rango.

pretzel-indices-repeated = Se inyoran los indises dados para pretzel porke algunos indises estan repetidos.

pretzel-circuit-first-index = Se inyoran los indises dados para pretzel en modo circuit porke el primer indise deve ser 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Para ke `<{ $component }>` funksione kon ijos de teksto, se deve dar un atributo `type`.

invalid-type-defaulting-to-math = Tipo { $type } no valido para el komponente { $component }. Deve ser uno de estos: math, text, number o boolean. Se uza math.

string-not-valid-component-to-arrange = La kadena "{ $value }" no es un komponente valido para { $component }. Se inyora.

## Types and variables

invalid-type-defaulting-to-number = Tipo { $type } no valido, se pone el tipo a number.

invalid-variable-value = Valor no valido de una varyavle: `{ $value }`

## Variants

variant-index-must-be-number = El indise de varyante { $index } deve ser un numero

variant-index-must-be-integer = El indise de varyante { $index } deve ser un numero entero

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` no esta echo para midas absolutas. Se ponen las anchuras en relativas.

side-by-side-absolute-margins = `<{ $component }>` no esta echo para midas absolutas. Se ponen los marjenes en relativos.

side-by-side-no-block-child = `<{ $component }>` no valido: deve tener al manko un ijo de bloko.

## `<label>`

label-for-ignored-on-graphical = Se inyora el atributo `for` en una `<label>` grafika.

label-for-must-resolve-to-one = El atributo `for` en `<label>` deve rezolverse en un solo komponente.

label-for-unresolved = El atributo `for` en `<label>` no se pudo rezolver en un komponente.

label-for-answer-with-authored-inputs = El atributo `for` en `<label>` aze referensia a un `<answer>` kon entradas eskritas por el autor; aze referensia direktamente a la entrada.

label-for-answer-without-input = El atributo `for` en `<label>` aze referensia a un `<answer>` sin ninguna entrada ke etiketar.

label-for-must-reference-input-or-answer = El atributo `for` en `<label>` deve azer referensia a una entrada o a una repuesta.

## Accessibility

accessibility-short-description-or-decorative = Para la aksesibilidad, `<{ $component }>` deve tener una deskripsion kurta o ser markado komo dekorativo.

accessibility-video-short-description = Para la aksesibilidad, `<video>` deve tener una deskripsion kurta.

accessibility-input-short-description-or-label = Para la aksesibilidad, `<{ $component }>` deve tener una deskripsion kurta o una etiketa.

accessibility-answer-input-short-description-or-label = Para la aksesibilidad, un `<answer>` ke kria una entrada deve tener una deskripsion kurta o una etiketa.

accessibility-short-description-contains-math = Las deskripsiones kurtas no deven tener komponentes matematikos komo `<{ $component }>`. Eskrive la matematika kon palavras.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } no tiene kontrasto sufisiente para el teksto del titolo de la seksion (modo eskuro) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; se kere al manko { $threshold }:1).
       *[other] { $colorName } no tiene kontrasto sufisiente para el teksto del titolo de la seksion ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; se kere al manko { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Dainda no se izo un `<circle>` por { $count } puntos en el kavzo ke los puntos no tengan valores numerikos.

circle-too-many-through-points = No se puede kalkular un sirkolo por mas de 3 puntos.

circle-overprescribed-radius-center-points = No se puede kalkular un sirkolo kon radio, sentro i puntos de pasaje dados.

circle-center-with-multiple-points = No se puede kalkular un sirkolo kon el sentro dado ke pase por mas de 1 punto.

circle-radius-too-small = No se puede kalkular el sirkolo: dado ke la distansia entre los dos puntos es { $distance }, el radio dado { $radius } es muy chiko.

circle-radius-with-many-points = No se puede kriar un sirkolo por mas de dos puntos kon un radio dado.

circle-invalid-center-or-through-points = Sentro o puntos de pasaje del sirkolo no validos.

circle-radius-center-with-multiple-points = No se puede kalkular el radio de un sirkolo kon el sentro dado ke pase por mas de 1 punto.

circle-change-radius-non-numerical = No se puede trokar el radio de un sirkolo kon puntos de pasaje no numerikos

circle-radius-with-points-non-numerical = No se puede kriar un sirkolo por mas de un punto kon un radio dado kuando no ay valores numerikos.

circle-change-center-non-numerical = Dainda no se izo el troko del sentro de un sirkolo por puntos kon valores no numerikos.

## `<function>`

# CLDR has no plural data for `lad`, so the interval and input counts are not
# selected on: one form is written that reads for any number.
function-domain-insufficient-dimensions = Dimensiones no sufisientes para el dominio de la funksion. El dominio tiene { $intervals } intervalos ma la funksion tiene { $inputs } entradas.

function-domain-invalid-format = Formato no valido para el dominio de la funksion.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Se inyora un maksimo no numeriko de la funksion.
        [minimum] Se inyora un minimo no numeriko de la funksion.
        [extremum] Se inyora un ekstremo no numeriko de la funksion.
        [point] Se inyora un punto no numeriko de la funksion.
        [slope] Se inyora una pendiente no numerika de la funksion.
       *[other] Se inyora un { $type } no numeriko de la funksion.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Se inyora un maksimo vaziyo de la funksion.
        [minimum] Se inyora un minimo vaziyo de la funksion.
        [extremum] Se inyora un ekstremo vaziyo de la funksion.
        [point] Se inyora un punto vaziyo de la funksion.
       *[other] Se inyora un { $type } vaziyo de la funksion.
    }

function-points-too-close = La funksion tiene dos puntos muy serka uno del otro. No se puede definir la funksion.

function-iterates-input-output-mismatch = Las iterasiones de una funksion solo son posivles si el numero de entradas es igual al numero de salidas. Esta funksion tiene { $inputs } entradas i { $outputs } salidas.

## `<sequence>`

sequence-invalid-length = Longor no valido de la sekuensia.  Deve ser un numero entero no negativo.

sequence-invalid-step = Paso no valido de la sekuensia.  Deve ser un numero para una sekuensia de tipo { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" no valido de una sekuensia de numeros.  Deve ser un numero.

sequence-invalid-endpoint-letters = "{ $attribute }" no valido de una sekuensia de letras.  Deve ser una kombinasion de letras.

sequence-invalid-endpoint = "{ $attribute }" de la sekuensia no valido.

select-from-sequence-coprime-not-numbers = se inyora coprime porke no se eskojen numeros

select-from-sequence-coprime-with-exclude-combinations = se inyora coprime porke se dio excludeCombinations

## Resolving a `target`

target-not-found = target no valido para `<{ $source }>`: no se topa el destino.

target-state-variable-not-found = target no valido para `<{ $source }>`: no se topa ninguna varyavle de estado yamada "{ $property }" en un `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Las varyavles de `<odeSystem>` deven ser diferentes de la varyavle independiente.

ode-system-duplicate-variable-names = No se pueden definir las funksiones RHS de la EDO kon nombres de varyavles dependientes repetidos.

ode-system-rhs-function-error = No se puede definir la funksion RHS de la EDO.  Yerro kriando la funksion mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = No se puede definir un angolo entre { $count } linyas

angle-invalid-through-point = Punto no valido en through de `<angle>`

parabola-vertex-too-many-points = Dainda no se izo una parabola kon vertise por mas de 1 punto.

parabola-too-many-points = Dainda no se izo una parabola por mas de 3 puntos.

intersection-too-many-items = Dainda no se izo la interseksion de mas de dos elementos

## Other math components

ionic-compound-not-two-ions = Dainda no se izo un kompuesto ioniko de otra koza ke dos iones.

ionic-compound-needs-cation-and-anion = El kompuesto ioniko esta echo solo para un kation i un anion.

solve-equations-cannot-evaluate = No se puede rezolver la ekuasion porke no se pudo evaluar: { $equation }

math-operators-operand-number-required = Se deve dar un operandNumber para sakar un operando matematiko.

eigen-decomposition-failed = No se pudieron kalkular los valores propios de la matris

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: { $parameters } no aparesen en el modelo, ansi ke siempre van a kuadrar kon un vaziyo.

## `<graph>`

graph-grid-invalid = `<graph>`: no se puede entender grid="{ $grid }". Deve ser none, medium, dense o dos numeros pozitivos apartados por un espasio, komo grid="1 0.5". No se dibuja ninguna kuadrikula.

## `<slopeField>` and `<vectorField>`

# `$expected` is a count, but CLDR has no plural data for `lad`, so it is
# matched as the numeric literal `[1]` rather than as the plural category
# `[one]`: the two branches carry different advice, not a different word shape.
field-function-wrong-num-outputs =
    `<{ $component }>` kere una funksion kon { $expected ->
        [1] una salida, la pendiente y' en kada punto, komo `y - x`
       *[other] dos salidas, el vektor en kada punto, komo `(y, -x)`
    }, ma la funksion ke se le dio tiene { $found } salidas. { $alternative ->
        [none] No se dibuja nada.
       *[other] `<{ $alternative }>` es el komponente para esa funksion. No se dibuja nada.
    }

field-function-attribute-ignored-with-child = Se inyora el atributo `function` porke la funksion se da tambien adientro del komponente; se uza la de adientro. Da la funksion solo de una de las dos maneras.

field-variables-ignored =
    `<{ $component }>`: el atributo `variables` nombra las varyavles de una ekspresion eskrita direktamente adientro del komponente. { $reason ->
        [function-child] Aki la funksion se da komo ijo `<function>`, ke nombra sus propias varyavles, ansi ke se inyora `variables`.
       *[no-expression] Aki no se da ninguna ekspresion de esas, ansi ke se inyora `variables`.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" no esta sostenido en el renderizador prefigure; se uza el komportamiento de la pozision a la derecha.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" no esta sostenido en el renderizador prefigure; se uza el komportamiento de la pozision de arriva.

prefigure-invalid-axis-bounds = `<graph>`: limites de los ejes no validos para la konversion prefigure; se uza el bbox por defekto (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: anchura no valida para la konversion prefigure; se uza la anchura por defekto del diagrama 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio no valido para la konversion prefigure; se uza la proporsion por defekto 1.

prefigure-grid-spacing-too-fine = `<graph>`: el espasio de la kuadrikula es muy fino para los limites de los ejes; la kuadrikula se desha afuera en el renderizador prefigure.

prefigure-annotations-not-rendered = `<graph>`: las anotasiones no se dibujan kuando no se uza el renderizador PreFigure.

multiple-annotations-children = Se toparon munchos ijos `<annotations>` en `<graph>`; se inyoran todos afuera del ultimo.

## Referring to other components

copy-unrecognized-component-type = No se puede estender o kopiar un tipo de komponente no konosido: { $type }.

copy-prop-not-found = No se topo la propiedad { $property } en un komponente de tipo { $component }

collect-no-source = No se topo ninguna fuente para collect.

collect-invalid-component-type = No se pueden arrekojer komponentes de tipo `<{ $component }>` porke es un tipo de komponente no valido.

reference-index-unavailable = No se puede azer referensia al indise `{ $reference }`

## `<callAction>`

component-action-unavailable = No se puede yamar { $action } en el komponente `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Los datos tienen una forma no valida.  Las filas tienen longores diferentes. Topado en componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Los datos tienen nombres de kolona repetidos.  Topado en componentIdx :{ $componentIdx }

data-frame-missing-column-name = A los datos les manka un nombre de kolona.  Topado en componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Un premio de esta repuesta se baza en la repuesta mandada por la mizma etiketa answer, i esto va a yevar a un komportamiento no asperado.

answer-max-num-attempts-in-section-wide-check-work = Poner `maxNumAttempts` en un `<answer>` adientro de un kontenedor kon `sectionWideCheckWork` no aze nada, porke el numero de provas lo kontrola el kontenedor. Pon `maxNumAttempts` en el kontenedor.

nested-section-wide-check-work-max-num-attempts = Poner `maxNumAttempts` en un kontenedor kon `sectionWideCheckWork` ke esta adientro de otro kontenedor kon `sectionWideCheckWork` no aze nada, porke el numero de provas lo kontrola el kontenedor de afuera. Pon `maxNumAttempts` en el kontenedor de afuera.

answer-attributes-need-symbolic-equality = { $attributes } no van a azer nada sin symbolicEquality dado.

answer-invalid-type = Tipo no valido para la repuesta: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Komo el komponente `<{ $component }>` no tiene nombre, no se puede uzar komo atributo de un modulo

module-attribute-name-already-defined = El komponente `<{ $component } name="{ $name }">` no se puede uzar komo atributo de un modulo porke el tipo de komponente `<module>` ya tiene un atributo "{ $name }" definido.

conditional-content-condition-ignored = Se inyora el atributo `condition` en un komponente `<conditionalContent>` kon ijos case o else.

slider-markers-type-mismatch = El tipo de los markadores no kuadra kon el tipo del slider.

pretzel-problem-needs-statement-and-answer = pretzel no valido: kada `<problem>` deve tener un `<statement>` i un `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel no valido: en mode="circuit", el primer `<problem>` no puede ser un distraktor.

## Attribute values

attribute-invalid-values = { $values } no son valores validos para el atributo `{ $attribute }`; se inyoran.

attribute-must-be-references = Valor no valido `{ $value }` para el atributo `{ $attribute }`. El atributo deve estar echo de referensias ke empesen kon un `$`.

math-input-invalid-function-names = <mathInput>: se inyoraron nombres de funksion no validos en { $attribute }: { $names }. El pedaso ke se amostra de kada nombre deve tener al manko 2 karakteres (letras o gionés); despues puede venir un sufikso opsional `|<alternativa mathspeak>`.

## Building components from the source

component-type-invalid = Tipo de komponente no valido: `<{ $componentType }>`

attribute-repeated = No se puede repetir el atributo { $attribute }.

attribute-invalid-for-component = Atributo "{ $attribute }" no valido para un komponente de tipo `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    La definision de estilo { $styleNumber } no tiene kontrasto sufisiente para { $context ->
        [text-on-background] el kolor del teksto kontra el kolor del fondo
        [high-contrast] el kolor de alto kontrasto kontra la tela
        [line] el kolor de la linya kontra la tela
        [marker] el kolor del markador kontra la tela
       *[text-on-canvas] el kolor del teksto kontra la tela
    }{ $mode ->
        [dark] { " (modo eskuro)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; se kere al manko { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Aunke la definision de estilo { $styleNumber } tenga kolores ke dan kontrasto sufisiente para el modo klaro, los kolores para el modo eskuro sakados de estos valores no tienen kontrasto sufisiente entre el kolor del teksto i el kolor del fondo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; se kere al manko { $threshold }:1). { $suggestion ->
        [available] Para tener kontrasto sufisiente en el modo eskuro, o suve el kontrasto del modo klaro (p. eg. pon { $lightAttribute }="{ $lightColor }") o sobreeskrive el kolor del modo eskuro (p. eg. pon { $darkAttribute }="{ $darkColor }").
       *[none] Para tener kontrasto sufisiente en el modo eskuro, suve el kontrasto del modo klaro o sobreeskrive los kolores sakados kon textColorDarkMode i/o backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Aunke la definision de estilo { $styleNumber } tenga un kolor de teksto ke da kontrasto sufisiente para el modo klaro, el kolor del teksto para el modo eskuro sakado de este valor no tiene kontrasto sufisiente kontra la tela ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; se kere al manko { $threshold }:1). { $suggestion ->
        [available] Para tener kontrasto sufisiente en el modo eskuro, o suve el kontrasto del modo klaro (p. eg. pon textColor="{ $lightColor }") o sobreeskrive el kolor del modo eskuro (p. eg. pon textColorDarkMode="{ $darkColor }").
       *[none] Para tener kontrasto sufisiente en el modo eskuro, suve el kontrasto del modo klaro o sobreeskrive el kolor sakado kon textColorDarkMode.
    }

section-multiple-style-palettes = Una seksion solo puede eskojer un <stylePalette>; se uza el ultimo.

## Unique variants

variant-num-to-select-not-non-negative-integer = no se pueden determinar las varyantes unikas de { $component } porke numToSelect no es un numero entero no negativo.

variant-num-to-select-not-constant-number = no se pueden determinar las varyantes unikas de { $component } porke numToSelect no es un numero konstante.

variant-with-replacement-not-constant-boolean = no se pueden determinar las varyantes unikas de { $component } porke withReplacement no es un boolean konstante.

variant-select-weight-disables-unique = Las varyantes unikas para select se dezaktivan si alguna opsion tiene selectWeight o selectForVariants dado

variant-coprime-undetermined = no se pueden determinar las varyantes unikas de { $component } porke no se puede determinar ke coprime sea siempre falso.

variant-attribute-not-constant = no se pueden determinar las varyantes unikas de { $component } porke { $attribute } no es una konstante.

variant-attribute-not-number = no se pueden determinar las varyantes unikas de { $component } porke { $attribute } no es un numero.

variant-attribute-wrong-type-for-sequence =
    no se pueden determinar las varyantes unikas de { $component } de tipo { $type } porke { $attribute } no es { $expected ->
        [letters-combination] una kombinasion de letras
        [math-expression] una ekspresion matematika valida
        [integer] un numero entero
       *[number] un numero
    }.

variant-length-not-integer = no se pueden determinar las varyantes unikas de { $component } porke length no es un numero entero.

variant-sort-not-implemented = dainda no se izieron las varyantes unikas de un { $component } kon sort

variant-exclude-combinations-not-implemented = dainda no se izieron las varyantes unikas de un { $component } kon excludeCombinations

variant-math-exclude-not-implemented = dainda no se izieron las varyantes unikas de un { $component } de tipo math kon exclude

variant-non-constant-exclude-not-implemented = dainda no se izieron las varyantes unikas de un { $component } kon un exclude no konstante

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: no esta sostenido en el renderizador prefigure de la grafika; se salta el desendiente.

prefigure-descendant-invalid-geometry = { $subject }: jeometria no finita o inkompleta; se salta el desendiente.

prefigure-curve-label-omitted = { $subject }: las etiketas no estan sostenidas en los elementos de kurva konvertidos; se desha afuera la etiketa.

prefigure-curve-unsupported-definition-type = { $subject }: tipo de definision de kurva '{ $definitionType }' no sostenido; se salta el desendiente.

prefigure-region-flip-functions-unsupported = { $subject }: atributo flipFunctions no sostenido en regionBetweenCurves; se salta el desendiente.

prefigure-region-non-formula-child = { $subject }: solo estan sostenidas las funksiones ijas de tipo formula en regionBetweenCurves; se salta el desendiente.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' no sostenido para { $labelKind ->
        [line-family] una etiketa de la famiya de las linyas
       *[point] una etiketa de punto
    }; se uza la alineasion por defekto de PreFigure.

prefigure-fill-style-unsupported = { $subject }: el estilo de reyeno '{ $fillStyle }' no esta sostenido por PreFigure; se torna a un reyeno yeno.

prefigure-line-style-unknown = { $subject }: estilo de linya no konosido '{ $lineStyle }' deshado afuera de la salida de PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: el estilo de markador '{ $markerStyle }' se mapeo al estilo PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: el estilo de markador '{ $markerStyle }' no esta sostenido por PreFigure; se uza el estilo por defekto.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` no valido; no se puede rezolver el destino. Se desha afuera la anotasion.

annotation-ref-multiple-targets = `<annotation>`: `ref` se rezolvio en munchos destinos; se uza el primero.

annotation-ref-outside-graph = `<annotation>`: `ref` no valido; el destino esta afuera de la grafika ke lo kontiene. Se desha afuera la anotasion.

annotation-ref-unsupported-target = `<annotation>`: `ref` no valido; el destino no es un objekto grafiko sostenido en la konversion prefigure. Se desha afuera la anotasion.

annotation-text-missing = `<annotation>`: `text` manka o esta vaziyo; se da teksto vaziyo.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Se detekto una dependensia sirkular.
       *[other] Se detekto una dependensia sirkular ke mete de por medio un komponente `<{ $componentType }>`.
    }

reference-no-referent = No se topo dingun referente para la referensia: `{ $reference }`

reference-multiple-referents = Se toparon munchos referentes para la referensia: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Formato no valido para el atributo { $attribute } de `<{ $componentType }>`.

children-invalid = Ijos no validos para `<{ $componentType }>`: se toparon ijos no validos: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valor no valido `{ $value }` para el atributo `{ $attribute }`, se uza el valor `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] No se topo la versyon de DoenetML { $version }.
       *[other] No se topo la versyon de DoenetML { $version }. Se torna a la versyon { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML no valido: { $content }

parse-tag-missing-close-tag = DoenetML no valido: La etiketa `{ $tag }` no tiene etiketa de serradura. Se asperava una etiketa ke se sierre eya mizma o una etiketa `</{ $tagName }>`.

parse-tag-error = DoenetML no valido: Yerro en la etiketa `<{ $tagName }>`

parse-attribute-missing-value = DoenetML no valido: Parese ke al atributo no valido `{ $attribute }` le manka un valor.

parse-attribute-invalid = DoenetML no valido: Atributo no valido `{ $attribute }`

parse-attribute-value-invalid = DoenetML no valido: Valor de atributo no valido `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML no valido: Valor de atributo no valido `{ $value }`. Las komiyas no kuadran. Parese ke te manka un `{ $quote }`

parse-open-tag-name-missing = DoenetML no valido: Se topo una etiketa sin nombre de etiketa, p. eg. `<`

parse-tag-not-closed = DoenetML no valido: La etiketa `{ $tag }` no se serro (parese ke manka un `>`).

parse-self-closing-tag-name-missing = DoenetML no valido: Se topo una etiketa sin nombre de etiketa `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML no valido: La etiketa `{ $tag }` no se serro (parese ke manka `/>`).

parse-tag-invalid-attributes = DoenetML no valido: La etiketa `{ $tag }` no es valida. Puede ke tenga atributos no korrektos.

parse-close-tag-name-missing = DoenetML no valido: Se topo una etiketa de serradura sin nombre de etiketa, p. eg. `</`

parse-attribute-value-unquoted = Los valores de los atributos deven ir entre komiyas: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML no valido: Se topo la etiketa de serradura `{ $tag }`, ma ninguna etiketa de avertura ke le koresponda

parse-close-tag-mismatched = DoenetML no valido: Etiketa de serradura ke no kuadra. Se asperava `</{ $expected }>`. Se topo `{ $found }`

parser-node-unconvertible = No se pudo konvertir el nodo { $node } en un nodo Dast.

## Names

name-attribute-invalid =
    Atributo no valido name='{ $name }'. { $reason ->
        [characters] Los nombres solo pueden tener letras, numeros, giones bashos o giones.
       *[start] Los nombres deven empesar kon una letra.
    }

component-name-invalid-start = Nombre de komponente no valido "{ $name }". Los nombres deven empesar kon una letra.

## `<answer>` sugar

answer-video-watched-missing-video = Una repuesta de tipo videoWatched deve tener un atributo video

answer-video-watched-video-not-reference = Una repuesta de tipo videoWatched deve tener un atributo video ke sea una referensia

answer-name-not-single-text = El atributo name de la repuesta deve tener un solo ijo de teksto

## Referencing another document

external-doenetml-recursion-limit = No se puede tomar el DoenetML de afuera por demaziados niveles de rekursion. ¿Ay alguna referensia sirkular?

external-doenetml-unavailable = No se puede tomar el DoenetML de { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML no valido tomado de { $attribute }="{ $uri }": no kuadrava kon el tipo de komponente "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] El atributo `{ $from }` es viejo; uza `{ $to }`.
       *[other] [deprecation] El atributo `{ $from }` en `<{ $component }>` es viejo; uza `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] El atributo `{ $from }` es viejo i se inyora porke tambien se dio `{ $to }`.
       *[other] [deprecation] El atributo `{ $from }` en `<{ $component }>` es viejo i se inyora porke tambien se dio `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] El atributo `{ $attribute }` en `<{ $component }>` es viejo i se inyora.

deprecated-attribute-to-child = [deprecation] El atributo `{ $attribute }` en `<{ $component }>` es viejo; uza en su lugar un ijo `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] El valor `{ $value }` del atributo `{ $attribute }` en `<{ $component }>` es viejo; uza `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` solo puede poner en plural el inglez, ansi ke su teksto se desha komo esta en un dokumento eskrito en { $locale }. Eskrive la forma del plural direktamente, o ponla kon el atributo `pluralForm`.


## Checking against the schema

schema-element-unrecognized = El elemento `<{ $tag }>` no es un elemento de Doenet konosido.

schema-element-not-allowed-at-root = El elemento `<{ $tag }>` no esta permetido en la raiz del dokumento.

schema-element-not-allowed-inside = El elemento `<{ $tag }>` no esta permetido adientro de `<{ $parent }>`.

schema-attribute-unrecognized = El elemento `<{ $tag }>` no tiene dingun atributo yamado `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] El atributo `{ $attribute }` del elemento `<{ $tag }>` deve ser una lista onde kada elemento sea uno de estos: { $allowed }
       *[other] El atributo `{ $attribute }` del elemento `<{ $tag }>` deve ser uno de estos: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nombre de varyante no valido para select.  El nombre de varyante { $variantName } aparese en { $numOptions } opsiones ma el numero ke eskojer es { $numToSelect }.

select-variant-name-without-options = Se dieron algunas varyantes para select ma ninguna opsion para el nombre de varyante posivle: { $variantName }.

select-variant-name-not-possible = El nombre de varyante { $variantName } dado para select no es un nombre de varyante posivle.

select-too-few-options = No se pueden eskojer { $numToSelect } komponentes de solo { $numOptions }.

select-from-sequence-too-few-values = No se pueden eskojer { $numToSelect } valores de una sekuensia de longor { $length }.

select-from-sequence-indices-count-mismatch = El numero de indises dados para select deve kuadrar kon el numero ke eskojer

select-from-sequence-indices-not-integers = Todos los indises dados para select deven ser numeros enteros

select-from-sequence-index-excluded = El indise dado de selectfromsequence estava eskluido

select-from-sequence-indices-excluded-combination = Los indises dados de selectfromsequence eran una kombinasion eskluida

select-from-sequence-coprime-not-positive-integers = No se pueden eskojer kombinasiones koprimas porke no se eskojen numeros enteros pozitivos.

select-from-sequence-coprime-common-factor = No se pueden eskojer numeros koprimos. Todos los valores posivles komparten un faktor komun. (Los valores dados de "from" o "to" deven ser koprimos kon "step".)

select-from-sequence-coprime-single-number = No se pueden eskojer kombinasiones koprimas de un solo numero ke no sea 1.

select-from-sequence-excluded-too-many-combinations = Se eskluyo mas del 70% de las kombinasiones en selectFromSequence

select-from-sequence-coprime-none-found = No se pudieron eskojer numeros koprimos. Todos los valores posivles komparten un faktor komun.

select-from-sequence-too-few-unique-values = No se pueden eskojer { $numToSelect } valores unikos de una sekuensia de longor { $numPossibleValues }

select-prime-numbers-too-few-values = No se pueden eskojer { $numToSelect } valores de una lista de numeros primos de longor { $numValues }

select-prime-numbers-values-count-mismatch = El numero de valores dados para select deve kuadrar kon el numero ke eskojer

select-prime-numbers-values-not-prime = Todos los valores dados para eskojer numeros primos deven estar en la lista de numeros primos

select-prime-numbers-values-excluded-combination = Los valores dados de selectPrimeNumbers eran una kombinasion eskluida

select-prime-numbers-excluded-too-many-combinations = Se eskluyo mas del 70% de las kombinasiones en selectPrimeNumbers

select-random-combination-fluke = Por una kazualidad ekstraordinariamente improbavle, no se pudo eskojer una kombinasion de valores al azar

select-random-value-fluke = Por una kazualidad ekstraordinariamente improbavle, no se pudo eskojer un valor al azar

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] Este `<{ $component }>` no se amostra porke esta adientro de la matematika i no es `inline`. Adjusta `inline` para ke se torne una lista desplegavle, ke kave adientro de una ekspresion.
        [expanded] Este `<{ $component }>` no se amostra porke esta adientro de la matematika i es `expanded`. Kita `expanded`; una kasha de munchas linyas no kave adientro de una ekspresion.
        [on-graph] Este `<{ $component }>` no se amostra porke esta adientro de la matematika dibujada en una grafika, ke no tiene lugar para una entrada.
       *[relative-width] Este `<{ $component }>` no se amostra porke esta adientro de la matematika i tiene una anchura relativa. Da la anchura en unidades absolutas, komo `px`.
    }

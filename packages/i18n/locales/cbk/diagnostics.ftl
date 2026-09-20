# Chavacano (Chabacano de Zamboanga) diagnostics. Translated from
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
# **Zamboangueño**, in the traditional Spanish-based spelling and with no
# accent marks. `chrome.ftl`'s header sets out the variety, the grammar and
# the orthography, and names what a Caviteño or Ternateño reader should expect
# to differ. Respell all four files at once or none.
#
# **The frames.** This file is some 220 sentences built out of a dozen
# recurring frames, and reading the frames is the fastest way to review it:
#
#     Ta ignora el …           … is ignored
#     Hende puede …            cannot / is not possible
#     Debe …                   must / is required
#     Invalido …               invalid …
#     No hay encontrao …       not found
#     No hay …                 there is no …
#     Tiene …                  there is …
#     No hay efecto …          has no effect
#     Hende pa implementao …   has not been implemented
#     porque …                 because …
#     … que ya especifica      … that was specified
#     Ta usa el …              … is used
#
# The aspect particles are doing real work in these: «ya especifica» is a
# completed act by the author, «ta ignora» an ongoing state of the system, and
# «hende puede» a present incapacity. A reviewer replacing a frame should
# replace the particle with it.
#
# **Loans, declared.** The technical nouns are Spanish-lexifier where
# Chavacano has them — «componente», «atributo», «valor», «tipo», «version»,
# «indice», «matriz», «expresion», «dimension», «funcion», «region», «color»,
# «linea», «punto», «fila», «columna» — and English outright where it does not:
# `renderer`, `input`, `output`, `slope`, `grid`, `default`, `mode`, `list`,
# `state variable`. Nothing was coined.
#
# **No plural-category branches.** CLDR has no plural data for `cbk`, so a
# `[one]` branch would be text selected by English's rules; and the noun after
# a numeral is unmarked in Chavacano, so one form is correct anyway. Every
# `$…Count` and `$count` select is collapsed to a single `*[other]`. The
# explicit numeric literals English forks on are kept where the branch is a
# real distinction rather than a plural rule.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
       *[other] ta ignora el { $attributes } si dos endpoint el ya especifica
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
       *[other] ta ignora el { $attributes } si un endpoint y un midpoint ambos el ya especifica
    }

line-segment-midpoint-offset-without-midpoint = no hay efecto el midpointOffset si no hay midpoint

## `<line>`

line-points-undetermined-dimensions = Linea que ta pasa na maga punto que hende determinao el dimension.

line-points-too-few-dimensions = Debe pasa el linea na maga punto que dos dimension al menos.

line-points-depend-on-variables = Ta pasa el linea na maga punto que ta depende na maga variable: { $variables }.

line-equation-invalid-format = Invalido formato del ecuacion del linea na maga variable { $variable1 } y { $variable2 }.

## `<ray>`

ray-overprescribed-through = El rayo ya especifica con through, endpoint, y direction.  Ta ignora el through que ya especifica.

ray-dimension-mismatch = Hende ta cuadra el numDimensions na rayo.

## `<vector>`

vector-overprescribed-head = El vector ya especifica con head, tail, y displacement.  Ta ignora el head que ya especifica.

vector-dimension-mismatch = Hende ta cuadra el numDimensions na vector.

## Attracting and constraining

attract-to-without-nearest-point = Hende puede atrae na un `<{ $component }>` porque no hay ese nearestPoint state variable.

constrain-to-without-nearest-point = Hende puede limita na un `<{ $component }>` porque no hay ese nearestPoint state variable.

constrain-to-interior-without-nearest-point = Hende puede limita na adentro de un `<{ $component }>` porque no hay ese nearestPoint state variable.

## `<choiceInput>`

choice-input-label-position-ignored = ta ignora el labelPosition para na choiceInput que hende inline

## Ordering children by index

choice-input-indices-count-mismatch = Ta ignora el maga indice que ya especifica para na choiceInput porque hende ta cuadra el numero de indice con el numero del maga hijo choice.

pretzel-indices-count-mismatch = Ta ignora el maga indice que ya especifica para na problem porque hende ta cuadra el numero de indice con el numero del maga hijo problem.

shuffle-indices-count-mismatch = Ta ignora el maga indice que ya especifica para na shuffle porque hende ta cuadra el numero de indice con el numero del maga componente.

indices-ignored-out-of-range = Ta ignora el maga indice que ya especifica para na { $component } porque tiene indice que fuera del rango.

pretzel-indices-repeated = Ta ignora el maga indice que ya especifica para na pretzel porque tiene indice que ya repiti.

pretzel-circuit-first-index = Ta ignora el maga indice que ya especifica para na pretzel na circuit mode porque debe 1 el primer indice.

## `<shuffle>` and `<sort>`

string-children-need-type = Para funciona el `<{ $component }>` con maga hijo string, debe especifica un atributo `type`.

invalid-type-defaulting-to-math = Invalido tipo { $type } para na componente { $component }. Debe uno entre math, text, number, o boolean. Ta usa el math.

string-not-valid-component-to-arrange = El string "{ $value }" hende valido componente para { $component }. Ta ignora.

## Types and variables

invalid-type-defaulting-to-number = Invalido tipo { $type }, ta pone el tipo na number.

invalid-variable-value = Invalido valor de un variable: `{ $value }`

## Variants

variant-index-must-be-number = El indice de variante { $index } debe numero

variant-index-must-be-integer = El indice de variante { $index } debe entero

## `<sideBySide>`

side-by-side-absolute-widths = Hende pa implementao el `<{ $component }>` para na maga medida absoluto. Ta pone el maga ancho na relativo.

side-by-side-absolute-margins = Hende pa implementao el `<{ $component }>` para na maga medida absoluto. Ta pone el maga margen na relativo.

side-by-side-no-block-child = Invalido `<{ $component }>`: debe tiene al menos un hijo que block.

## `<label>`

label-for-ignored-on-graphical = Ta ignora el atributo `for` na un `<label>` que grafico.

label-for-must-resolve-to-one = El atributo `for` na `<label>` debe apunta na un componente lang.

label-for-unresolved = Hende puede apunta na un componente el atributo `for` na `<label>`.

label-for-answer-with-authored-inputs = El atributo `for` na `<label>` ta apunta na un `<answer>` que tiene maga input ya escribi del autor; apunta na el mismo input.

label-for-answer-without-input = El atributo `for` na `<label>` ta apunta na un `<answer>` que no hay input para pone letrero.

label-for-must-reference-input-or-answer = El atributo `for` na `<label>` debe apunta na un input o na un answer.

## Accessibility

accessibility-short-description-or-decorative = Para na accesibilidad, el `<{ $component }>` debe tiene corto descripcion o debe especifica como decorativo.

accessibility-video-short-description = Para na accesibilidad, el `<video>` debe tiene corto descripcion.

accessibility-input-short-description-or-label = Para na accesibilidad, el `<{ $component }>` debe tiene corto descripcion o letrero.

accessibility-answer-input-short-description-or-label = Para na accesibilidad, un `<answer>` que ta hace un input debe tiene corto descripcion o letrero.

accessibility-short-description-contains-math = Hende debe tiene componente matematico como el `<{ $component }>` na maga corto descripcion. Escribi con palabra el matematica.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Hende bastante el contraste del { $colorName } para na texto del titulo de seccion (dark mode) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; necesita al menos { $threshold }:1).
       *[other] Hende bastante el contraste del { $colorName } para na texto del titulo de seccion ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; necesita al menos { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Hende pa implementao el `<circle>` que ta pasa na { $count } punto si no hay numerico valor el maga punto.

circle-too-many-through-points = Hende puede calcula el circulo que ta pasa na mas de 3 punto.

circle-overprescribed-radius-center-points = Hende puede calcula el circulo que tiene ya especificao radius, centro, y maga punto para pasa.

circle-center-with-multiple-points = Hende puede calcula el circulo que tiene ya especificao centro y ta pasa na mas de 1 punto.

circle-radius-too-small = Hende puede calcula el circulo: cay el distancia entre el dos punto { $distance }, muy chiquito el radius { $radius } que ya especifica.

circle-radius-with-many-points = Hende puede hace circulo que ta pasa na mas de dos punto con un radius que ya especifica.

circle-invalid-center-or-through-points = Invalido centro o maga punto para pasa del circulo.

circle-radius-center-with-multiple-points = Hende puede calcula el radius del circulo que tiene ya especificao centro y ta pasa na mas de 1 punto.

circle-change-radius-non-numerical = Hende puede cambia el radius del circulo si hende numerico el maga punto para pasa

circle-radius-with-points-non-numerical = Hende puede hace circulo que ta pasa na mas de un punto con un radius que ya especifica si no hay numerico valor.

circle-change-center-non-numerical = Hende pa implementao el cambia del centro de un circulo que ta pasa na maga punto que hende numerico.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
       *[other] Hende bastante el dimension del domain para na funcion. El domain tiene { $intervals } intervalo pero el funcion tiene { $inputs ->
           *[other] { $inputs } input
        }.
    }

function-domain-invalid-format = Invalido formato del domain para na funcion.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ta ignora el maximum del funcion que hende numerico.
        [minimum] Ta ignora el minimum del funcion que hende numerico.
        [extremum] Ta ignora el extremum del funcion que hende numerico.
        [point] Ta ignora el punto del funcion que hende numerico.
        [slope] Ta ignora el slope del funcion que hende numerico.
       *[other] Ta ignora el { $type } del funcion que hende numerico.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Ta ignora el maximum del funcion que vacio.
        [minimum] Ta ignora el minimum del funcion que vacio.
        [extremum] Ta ignora el extremum del funcion que vacio.
        [point] Ta ignora el punto del funcion que vacio.
       *[other] Ta ignora el { $type } del funcion que vacio.
    }

function-points-too-close = Tiene dos punto el funcion que muy cerca el lugar. Hende puede determina el funcion.

function-iterates-input-output-mismatch =
    { $inputs ->
       *[other] Puede lang hace maga iterate del funcion si igual el numero de input y el numero de output. Este funcion tiene { $inputs } input y { $outputs ->
           *[other] { $outputs } output
        }.
    }

## `<sequence>`

sequence-invalid-length = Invalido largo del sequence.  Debe entero que hende negativo.

sequence-invalid-step = Invalido step del sequence.  Debe numero para na sequence que tipo { $type }.

sequence-invalid-endpoint-number = Invalido "{ $attribute }" del sequence de numero.  Debe numero.

sequence-invalid-endpoint-letters = Invalido "{ $attribute }" del sequence de letra.  Debe combinacion de letra.

sequence-invalid-endpoint = Invalido "{ $attribute }" del sequence.

select-from-sequence-coprime-not-numbers = ta ignora el coprime porque hende maga numero el ta escoge

select-from-sequence-coprime-with-exclude-combinations = ta ignora el coprime porque ya especifica el excludeCombinations

## Resolving a `target`

target-not-found = Invalido target para na `<{ $source }>`: hende puede encontra el target.

target-state-variable-not-found = Invalido target para na `<{ $source }>`: hende puede encontra un state variable que nombre "{ $property }" na un `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = El maga variable del `<odeSystem>` debe diferente del independent variable.

ode-system-duplicate-variable-names = Hende puede determina maga funcion ODE RHS que igual el nombre del dependent variable.

ode-system-rhs-function-error = Hende puede determina el funcion ODE RHS.  Tiene error na hacer del funcion mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Hende puede determina un angulo entre { $count } linea

angle-invalid-through-point = Invalido punto na through del `<angle>`

parabola-vertex-too-many-points = Hende pa implementao el parabola que tiene vertex y ta pasa na mas de 1 punto.

parabola-too-many-points = Hende pa implementao el parabola que ta pasa na mas de 3 punto.

intersection-too-many-items = Hende pa implementao el intersection para na mas de dos cosa

## Other math components

ionic-compound-not-two-ions = Hende pa implementao el compuesto ionico si hende dos ion.

ionic-compound-needs-cation-and-anion = Implementao lang el compuesto ionico para na un cation y un anion.

solve-equations-cannot-evaluate = Hende puede resolve el ecuacion porque hende puede evalua: { $equation }

math-operators-operand-number-required = Debe especifica un operandNumber si ta saca un operando matematico.

eigen-decomposition-failed = Hende puede calcula el maga eigenvalue del matriz

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
       *[other] `<matchesPattern>`: el parametro { $parameters } no hay na pattern, asi que siempre un blanco el ay cuadra con ese.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: hende puede entende el grid="{ $grid }". Debe none, medium, dense, o dos numero positivo que separao con un espacio, como el grid="1 0.5". No hay grid ya dibuja.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    El `<{ $component }>` necesita un funcion que tiene { $expected ->
        [1] un output, el slope y' na cada punto, como el `y - x`
       *[other] dos output, el vector na cada punto, como el `(y, -x)`
    }, pero el funcion que ya dale tiene { $found ->
       *[other] { $found } output
    }. { $alternative ->
        [none] No hay ya dibuja.
       *[other] El `<{ $alternative }>` el componente para na ese funcion. No hay ya dibuja.
    }

field-function-attribute-ignored-with-child = Ta ignora el atributo `function` porque ya dale tambien el funcion adentro del componente; el adentro el ta usa. Dale el funcion na uno lang entre el dos.

field-variables-ignored =
    `<{ $component }>`: el atributo `variables` ta nombra el maga variable de un expresion que ya escribi mismo adentro del componente. { $reason ->
        [function-child] El funcion aqui ya dale como un hijo `<function>`, que ta nombra el de suyo maga variable, asi que ta ignora el `variables`.
       *[no-expression] No hay tal expresion aqui, asi que ta ignora el `variables`.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: hende suportao el xLabelPosition="left" na prefigure renderer; ta usa el comportamiento del right-position.

prefigure-y-label-position-unsupported = `<graph>`: hende suportao el yLabelPosition="bottom" na prefigure renderer; ta usa el comportamiento del top-position.

prefigure-invalid-axis-bounds = `<graph>`: invalido maga limite del axis para na conversion na prefigure; ta usa el default bbox (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: invalido ancho para na conversion na prefigure; ta usa el default ancho de diagrama 425.

prefigure-invalid-aspect-ratio = `<graph>`: invalido aspectRatio para na conversion na prefigure; ta usa el default aspect ratio 1.

prefigure-grid-spacing-too-fine = `<graph>`: muy junto el espacio del cuadricula para na maga limite del axis; ta quita el cuadricula na prefigure renderer.

prefigure-annotations-not-rendered = `<graph>`: hende ay dibuja el maga annotation si hende PreFigure renderer el ta usa.

multiple-annotations-children = Muchos hijo `<annotations>` ya encontra na `<graph>`; ta ignora todo menos el ultimo.

## Referring to other components

copy-unrecognized-component-type = Hende puede extende o copia un tipo de componente que hende reconocido: { $type }.

copy-prop-not-found = Hende puede encontra el prop { $property } na un componente que tipo { $component }

collect-no-source = No hay encontrao source para na collect.

collect-invalid-component-type = Hende puede recogi maga componente que tipo `<{ $component }>` porque invalido tipo de componente ese.

reference-index-unavailable = Hende puede apunta na indice `{ $reference }`

## `<callAction>`

component-action-unavailable = Hende puede llama el { $action } na componente `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Invalido forma del data.  Hende igual el largo del maga fila. Ya encontra na componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Tiene igual nombre de columna el data.  Ya encontra na componentIdx :{ $componentIdx }

data-frame-missing-column-name = Falta un nombre de columna na data.  Ya encontra na componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Un award para na este answer ta basa na el mismo respuesta que ya manda del answer tag, y ay resulta ese na comportamiento que hende esperao.

answer-max-num-attempts-in-section-wide-check-work = No hay efecto el pone `maxNumAttempts` na un `<answer>` que adentro de un contenedor que tiene `sectionWideCheckWork`, porque el contenedor el ta controla el numero de intento. Pone el `maxNumAttempts` na el contenedor.

nested-section-wide-check-work-max-num-attempts = No hay efecto el pone `maxNumAttempts` na un contenedor que tiene `sectionWideCheckWork` y que adentro de otro contenedor que tiene `sectionWideCheckWork`, porque el contenedor de fuera el ta controla el numero de intento. Pone el `maxNumAttempts` na el contenedor de fuera.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
       *[other] No hay efecto el atributo { $attributes } si hende ya pone el symbolicEquality.
    }

answer-invalid-type = Invalido tipo para na answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Como no hay nombre el componente `<{ $component }>`, hende puede usa ese para atributo de un module

module-attribute-name-already-defined = Hende puede usa el componente `<{ $component } name="{ $name }">` para atributo de un module porque tiene ya el tipo `<module>` un atributo "{ $name }".

conditional-content-condition-ignored = Ta ignora el atributo `condition` na un componente `<conditionalContent>` que tiene hijo case o else.

slider-markers-type-mismatch = Hende ta cuadra el tipo del maga marker con el tipo del slider.

pretzel-problem-needs-statement-and-answer = Invalido pretzel: cada `<problem>` debe tiene un `<statement>` y un `<answer>`.

pretzel-circuit-first-problem-distractor = Invalido pretzel: na mode="circuit", hende puede distractor el primer `<problem>`.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
       *[other] Invalido valor { $values } para na atributo `{ $attribute }`; ta ignora.
    }

attribute-must-be-references = Invalido valor `{ $value }` para na atributo `{ $attribute }`. Debe hecho el atributo de maga reference que ta principia con un `$`.

math-input-invalid-function-names = <mathInput>: ta ignora el maga invalido nombre de funcion na { $attribute }: { $names }. El parte que ta sale de cada nombre debe dos caracter al menos (letra o guion); puede sigui un `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Invalido tipo de componente: `<{ $componentType }>`

attribute-repeated = Hende puede repiti el atributo { $attribute }.

attribute-invalid-for-component = Invalido atributo "{ $attribute }" para na un componente que tipo `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    El style definition { $styleNumber } hende bastante el contraste para na { $context ->
        [text-on-background] color del texto contra el color del fondo
        [high-contrast] color de alto contraste contra el canvas
        [line] color del linea contra el canvas
        [marker] color del marker contra el canvas
       *[text-on-canvas] color del texto contra el canvas
    }{ $mode ->
        [dark] { " (dark mode)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; necesita al menos { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Maskin tiene el style definition { $styleNumber } maga color que bastante el contraste para na light mode, el maga color de dark mode que ya sale de estos hende bastante el contraste del color del texto contra el color del fondo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; necesita al menos { $threshold }:1). { $suggestion ->
        [available] Para bastante el contraste na dark mode, o aumenta el contraste na light mode (ejemplo, pone { $lightAttribute }="{ $lightColor }") o cambia el color de dark mode (ejemplo, pone { $darkAttribute }="{ $darkColor }").
       *[none] Para bastante el contraste na dark mode, aumenta el contraste na light mode o cambia el maga color que ya sale con textColorDarkMode y/o backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Maskin tiene el style definition { $styleNumber } un color de texto que bastante el contraste para na light mode, el color de texto na dark mode que ya sale de ese hende bastante el contraste contra el canvas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; necesita al menos { $threshold }:1). { $suggestion ->
        [available] Para bastante el contraste na dark mode, o aumenta el contraste na light mode (ejemplo, pone textColor="{ $lightColor }") o cambia el color de dark mode (ejemplo, pone textColorDarkMode="{ $darkColor }").
       *[none] Para bastante el contraste na dark mode, aumenta el contraste na light mode o cambia el color que ya sale con textColorDarkMode.
    }

section-multiple-style-palettes = Puede escoge un <stylePalette> lang el un seccion; ta usa el ultimo.

## Unique variants

variant-num-to-select-not-non-negative-integer = hende puede determina el maga unique variant del { $component } porque hende entero que hende negativo el numToSelect.

variant-num-to-select-not-constant-number = hende puede determina el maga unique variant del { $component } porque hende constante numero el numToSelect.

variant-with-replacement-not-constant-boolean = hende puede determina el maga unique variant del { $component } porque hende constante boolean el withReplacement.

variant-select-weight-disables-unique = Ta apaga el maga unique variant para na select si tiene un opcion que ya especifica el selectWeight o el selectForVariants

variant-coprime-undetermined = hende puede determina el maga unique variant del { $component } porque hende puede determina si siempre false el coprime.

variant-attribute-not-constant = hende puede determina el maga unique variant del { $component } porque hende constante el { $attribute }.

variant-attribute-not-number = hende puede determina el maga unique variant del { $component } porque hende numero el { $attribute }.

variant-attribute-wrong-type-for-sequence =
    hende puede determina el maga unique variant del { $component } que tipo { $type } porque hende { $expected ->
        [letters-combination] un combinacion de letra
        [math-expression] un valido expresion matematico
        [integer] un entero
       *[number] un numero
    } el { $attribute }.

variant-length-not-integer = hende puede determina el maga unique variant del { $component } porque hende entero el length.

variant-sort-not-implemented = hende pa implementao el maga unique variant de un { $component } que tiene sort

variant-exclude-combinations-not-implemented = hende pa implementao el maga unique variant de un { $component } que tiene excludeCombinations

variant-math-exclude-not-implemented = hende pa implementao el maga unique variant de un { $component } que tipo math y que tiene exclude

variant-non-constant-exclude-not-implemented = hende pa implementao el maga unique variant de un { $component } que hende constante el exclude

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: hende suportao na graph prefigure renderer; ya salta el descendiente.

prefigure-descendant-invalid-geometry = { $subject }: geometria que hende finito o hende completo; ya salta el descendiente.

prefigure-curve-label-omitted = { $subject }: hende suportao el maga letrero na maga elemento curve que ya converti; ya quita el letrero.

prefigure-curve-unsupported-definition-type = { $subject }: hende suportao el tipo de definition de curve '{ $definitionType }'; ya salta el descendiente.

prefigure-region-flip-functions-unsupported = { $subject }: hende suportao el atributo flipFunctions na regionBetweenCurves; ya salta el descendiente.

prefigure-region-non-formula-child = { $subject }: maga hijo funcion que tipo formula lang el suportao na regionBetweenCurves; ya salta el descendiente.

prefigure-label-position-unsupported =
    { $subject }: hende suportao el labelPosition '{ $labelPosition }' para na { $labelKind ->
        [line-family] letrero del familia de linea
       *[point] letrero de punto
    }; ta usa el default alineacion del PreFigure.

prefigure-fill-style-unsupported = { $subject }: hende suportao del PreFigure el fill style '{ $fillStyle }'; ta usa un solido relleno.

prefigure-line-style-unknown = { $subject }: hende conocido el line style '{ $lineStyle }'; ya quita na output del PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: el marker style '{ $markerStyle }' ya converti na style 'diamond' del PreFigure.

prefigure-marker-style-unsupported = { $subject }: hende suportao del PreFigure el marker style '{ $markerStyle }'; ta usa el default style.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: invalido `ref`; hende puede encontra el target. Ya quita el annotation.

annotation-ref-multiple-targets = `<annotation>`: muchos target el ya sale del `ref`; ta usa el primer target.

annotation-ref-outside-graph = `<annotation>`: invalido `ref`; fuera el target del graph que ta contiene con ese. Ya quita el annotation.

annotation-ref-unsupported-target = `<annotation>`: invalido `ref`; hende suportao objeto grafico el target na conversion na prefigure. Ya quita el annotation.

annotation-text-missing = `<annotation>`: falta o vacio el `text`; ta sale vacio texto.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Ya detecta un circular dependency.
       *[other] Ya detecta un circular dependency que ta envolve el componente `<{ $componentType }>`.
    }

reference-no-referent = No hay encontrao referente para na reference: `{ $reference }`

reference-multiple-referents = Muchos referente ya encontra para na reference: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Invalido formato del atributo { $attribute } del `<{ $componentType }>`.

children-invalid = Invalido maga hijo para na `<{ $componentType }>`: Ya encontra maga invalido hijo: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Invalido valor `{ $value }` para na atributo `{ $attribute }`, ta usa el valor `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] No hay encontrao el version { $version } del DoenetML.
       *[other] No hay encontrao el version { $version } del DoenetML. Ta usa el version { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = Invalido DoenetML: { $content }

parse-tag-missing-close-tag = Invalido DoenetML: No hay closing tag el tag `{ $tag }`. Debe un self-closing tag o un `</{ $tagName }>` tag.

parse-tag-error = Invalido DoenetML: Tiene error na tag `<{ $tagName }>`

parse-attribute-missing-value = Invalido DoenetML: Parece falta el valor del invalido atributo `{ $attribute }`.

parse-attribute-invalid = Invalido DoenetML: Invalido atributo `{ $attribute }`

parse-attribute-value-invalid = Invalido DoenetML: Invalido valor de atributo `{ $value }`

parse-attribute-value-quote-mismatch = Invalido DoenetML: Invalido valor de atributo `{ $value }`. Hende ta cuadra el maga comilla. Parece falta un `{ $quote }`

parse-open-tag-name-missing = Invalido DoenetML: Ya encontra un tag que no hay nombre, ejemplo `<`

parse-tag-not-closed = Invalido DoenetML: Hende ya cerra el tag `{ $tag }` (parece falta un `>`).

parse-self-closing-tag-name-missing = Invalido DoenetML: Ya encontra un tag que no hay nombre `<{ $content }>`

parse-self-closing-tag-not-closed = Invalido DoenetML: Hende ya cerra el tag `{ $tag }` (parece falta un `/>`).

parse-tag-invalid-attributes = Invalido DoenetML: Hende valido el tag `{ $tag }`. Puede incorrecto el maga atributo.

parse-close-tag-name-missing = Invalido DoenetML: Ya encontra un closing tag que no hay nombre, ejemplo `</`

parse-attribute-value-unquoted = Debe pone adentro de comilla el maga valor de atributo: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Invalido DoenetML: Ya encontra el closing tag `{ $tag }`, pero no hay correspondiente opening tag

parse-close-tag-mismatched = Invalido DoenetML: Hende ta cuadra el closing tag. Ta espera `</{ $expected }>`. Ya encontra `{ $found }`

parser-node-unconvertible = Hende puede converti el node { $node } na Dast node.

## Names

name-attribute-invalid =
    Invalido atributo name='{ $name }'. { $reason ->
        [characters] Puede tiene lang letra, numero, underscore o guion el maga nombre.
       *[start] Debe principia na un letra el maga nombre.
    }

component-name-invalid-start = Invalido nombre de componente "{ $name }". Debe principia na un letra el maga nombre.

## `<answer>` sugar

answer-video-watched-missing-video = El answer que tipo videoWatched debe tiene un atributo video

answer-video-watched-video-not-reference = El answer que tipo videoWatched debe tiene un atributo video que un reference

answer-name-not-single-text = El atributo name del answer debe tiene un hijo text lang

## Referencing another document

external-doenetml-recursion-limit = Hende puede saca el DoenetML de fuera cay muchos el nivel de recursion. Tiene ba circular reference?

external-doenetml-unavailable = Hende puede saca el DoenetML de { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Invalido DoenetML el ya saca de { $attribute }="{ $uri }": hende ya cuadra con el tipo de componente "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Deprecated ya el atributo `{ $from }`; usa el `{ $to }`.
       *[other] [deprecation] Deprecated ya el atributo `{ $from }` na `<{ $component }>`; usa el `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Deprecated ya el atributo `{ $from }` y ta ignora porque ya especifica tambien el `{ $to }`.
       *[other] [deprecation] Deprecated ya el atributo `{ $from }` na `<{ $component }>` y ta ignora porque ya especifica tambien el `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Deprecated ya el atributo `{ $attribute }` na `<{ $component }>` y ta ignora.

deprecated-attribute-to-child = [deprecation] Deprecated ya el atributo `{ $attribute }` na `<{ $component }>`; usa un hijo `<{ $child }>`.

deprecated-attribute-value-renamed = [deprecation] Deprecated ya el valor `{ $value }` del atributo `{ $attribute }` na `<{ $component }>`; usa el `{ $to }`.


## Language coverage

pluralize-english-only = Puede lang hace plural el `<pluralize>` na Ingles, asi que hende ta cambia el de suyo texto na un documento que ya escribi na { $locale }. Escribi mismo el forma plural, o pone ese con el atributo `pluralForm`.


## Checking against the schema

schema-element-unrecognized = El elemento `<{ $tag }>` hende reconocido elemento del Doenet.

schema-element-not-allowed-at-root = Hende permitido el elemento `<{ $tag }>` na raiz del documento.

schema-element-not-allowed-inside = Hende permitido el elemento `<{ $tag }>` adentro del `<{ $parent }>`.

schema-attribute-unrecognized = No hay atributo que nombre `{ $attribute }` el elemento `<{ $tag }>`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] El atributo `{ $attribute }` del elemento `<{ $tag }>` debe un lista que cada item uno entre: { $allowed }
       *[other] El atributo `{ $attribute }` del elemento `<{ $tag }>` debe uno entre: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Invalido nombre de variante para na select.  El nombre de variante { $variantName } ta sale na { $numOptions } opcion pero { $numToSelect } el numero para escoge.

select-variant-name-without-options = Tiene maga variante que ya especifica para na select pero no hay opcion que ya especifica para na posible nombre de variante: { $variantName }.

select-variant-name-not-possible = El nombre de variante { $variantName } que ya especifica para na select hende posible nombre de variante.

select-too-few-options = Hende puede escoge { $numToSelect } componente de { $numOptions } lang.

select-from-sequence-too-few-values = Hende puede escoge { $numToSelect } valor de un sequence que { $length } el largo.

select-from-sequence-indices-count-mismatch = Debe cuadra el numero de indice que ya especifica para na select con el numero para escoge

select-from-sequence-indices-not-integers = Debe entero todo el maga indice que ya especifica para na select

select-from-sequence-index-excluded = Ya especifica un indice del selectfromsequence que ya excluyi

select-from-sequence-indices-excluded-combination = Ya especifica maga indice del selectfromsequence que un combinacion que ya excluyi

select-from-sequence-coprime-not-positive-integers = Hende puede escoge maga combinacion coprime porque hende maga positivo entero el ta escoge.

select-from-sequence-coprime-common-factor = Hende puede escoge maga numero coprime. Todo el posible valor tiene igual factor. (Debe coprime con el "step" el maga valor que ya especifica na "from" o "to".)

select-from-sequence-coprime-single-number = Hende puede escoge maga combinacion coprime de un solo numero que hende 1.

select-from-sequence-excluded-too-many-combinations = Ya excluyi mas del 70% del maga combinacion na selectFromSequence

select-from-sequence-coprime-none-found = Hende puede escoge maga numero coprime. Todo el posible valor tiene igual factor.

select-from-sequence-too-few-unique-values = Hende puede escoge { $numToSelect } unico valor de un sequence que { $numPossibleValues } el largo

select-prime-numbers-too-few-values = Hende puede escoge { $numToSelect } valor de un lista de primo que { $numValues } el largo

select-prime-numbers-values-count-mismatch = Debe cuadra el numero de valor que ya especifica para na select con el numero para escoge

select-prime-numbers-values-not-prime = Debe na lista del maga primo todo el valor que ya especifica para na select prime number

select-prime-numbers-values-excluded-combination = Ya especifica maga valor del selectPrimeNumbers que un combinacion que ya excluyi

select-prime-numbers-excluded-too-many-combinations = Ya excluyi mas del 70% del maga combinacion na selectPrimeNumbers

select-random-combination-fluke = Por un casualidad bien raro, hende ya puede escoge combinacion de maga random valor

select-random-value-fluke = Por un casualidad bien raro, hende ya puede escoge random valor

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] Hende ta sale este `<{ $component }>` porque adentro ese del matematica y hende `inline`. Pone el `inline` para queda un drop-down list, que ta cabe adentro de un expresion.
        [expanded] Hende ta sale este `<{ $component }>` porque adentro ese del matematica y `expanded`. Quita el `expanded`; hende ta cabe adentro de un expresion un caja que muchos linea.
        [on-graph] Hende ta sale este `<{ $component }>` porque adentro ese del matematica que ya dibuja na un graph, y no hay lugar alli para un input.
       *[relative-width] Hende ta sale este `<{ $component }>` porque adentro ese del matematica y relativo el ancho. Dale el ancho na absoluto unidad, como el `px`.
    }

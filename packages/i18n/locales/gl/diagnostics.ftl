# Galician diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# Galician counts in the same two categories English does, so every selection
# below keeps both branches.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] ignórase { $attributes } cando se especifican dous extremos
       *[other] ignóranse { $attributes } cando se especifican dous extremos
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] ignórase { $attributes } cando se especifican á vez un extremo e un punto medio
       *[other] ignóranse { $attributes } cando se especifican á vez un extremo e un punto medio
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset non ten ningún efecto sen un punto medio

## `<line>`

line-points-undetermined-dimensions = Liña que pasa por puntos de dimensións indeterminadas.

line-points-too-few-dimensions = A liña debe pasar por puntos de polo menos dúas dimensións.

line-points-depend-on-variables = A liña pasa por puntos que dependen de variables: { $variables }.

line-equation-invalid-format = Formato non válido para a ecuación da liña nas variables { $variable1 } e { $variable2 }.

## `<ray>`

ray-overprescribed-through = A semirrecta está determinada por through, endpoint e direction.  Ignórase o through especificado.

ray-dimension-mismatch = Discrepancia de numDimensions na semirrecta.

## `<vector>`

vector-overprescribed-head = O vector está determinado por head, tail e displacement.  Ignórase o head especificado.

vector-dimension-mismatch = Discrepancia de numDimensions no vector.

## Attracting and constraining

attract-to-without-nearest-point = Non se pode atraer cara a `<{ $component }>` porque non ten a variable de estado nearestPoint.

constrain-to-without-nearest-point = Non se pode restrinxir a `<{ $component }>` porque non ten a variable de estado nearestPoint.

constrain-to-interior-without-nearest-point = Non se pode restrinxir ao interior de `<{ $component }>` porque non ten a variable de estado nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = Ignórase labelPosition nun choiceInput que non é inline

## Ordering children by index

choice-input-indices-count-mismatch = Ignóranse os índices especificados para choiceInput porque o seu número non coincide co número de fillos choice.

pretzel-indices-count-mismatch = Ignóranse os índices especificados para problem porque o seu número non coincide co número de fillos problem.

shuffle-indices-count-mismatch = Ignóranse os índices especificados para shuffle porque o seu número non coincide co número de compoñentes.

indices-ignored-out-of-range = Ignóranse os índices especificados para { $component } porque algúns quedan fóra do intervalo.

pretzel-indices-repeated = Ignóranse os índices especificados para pretzel porque algúns están repetidos.

pretzel-circuit-first-index = Ignóranse os índices especificados para pretzel en modo circuit porque o primeiro índice debe ser 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Para que `<{ $component }>` funcione con fillos de tipo cadea, cómpre especificar o atributo `type`.

invalid-type-defaulting-to-math = Tipo non válido { $type } para o compoñente { $component }. Debe ser un de math, text, number ou boolean. Emprégase math.

string-not-valid-component-to-arrange = A cadea "{ $value }" non é un compoñente válido para { $component }. Ignórase.

## Types and variables

invalid-type-defaulting-to-number = Tipo non válido { $type }, establécese o tipo a number.

invalid-variable-value = Valor non válido dunha variable: `{ $value }`

## Variants

variant-index-must-be-number = O índice de variante { $index } debe ser un número

variant-index-must-be-integer = O índice de variante { $index } debe ser un número enteiro

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` non está implementado para medidas absolutas. Establécense as anchuras como relativas.

side-by-side-absolute-margins = `<{ $component }>` non está implementado para medidas absolutas. Establécense as marxes como relativas.

side-by-side-no-block-child = `<{ $component }>` non válido: debe ter polo menos un fillo de bloque.

## `<label>`

label-for-ignored-on-graphical = Ignórase o atributo `for` nun `<label>` gráfico.

label-for-must-resolve-to-one = O atributo `for` dun `<label>` debe resolverse exactamente a un compoñente.

label-for-unresolved = Non se puido resolver o atributo `for` dun `<label>` a ningún compoñente.

label-for-answer-with-authored-inputs = O atributo `for` dun `<label>` fai referencia a un `<answer>` con entradas escritas explicitamente; faga referencia directamente á entrada.

label-for-answer-without-input = O atributo `for` dun `<label>` fai referencia a un `<answer>` sen ningunha entrada que etiquetar.

label-for-must-reference-input-or-answer = O atributo `for` dun `<label>` debe facer referencia a unha entrada ou a unha resposta.

## Accessibility

accessibility-short-description-or-decorative = Por accesibilidade, `<{ $component }>` debe ter unha descrición breve ou estar especificado como decorativo.

accessibility-video-short-description = Por accesibilidade, `<video>` debe ter unha descrición breve.

accessibility-input-short-description-or-label = Por accesibilidade, `<{ $component }>` debe ter unha descrición breve ou unha etiqueta.

accessibility-answer-input-short-description-or-label = Por accesibilidade, un `<answer>` que crea unha entrada debe ter unha descrición breve ou unha etiqueta.

accessibility-short-description-contains-math = As descricións breves non deberían conter compoñentes matemáticos como `<{ $component }>`. Escriba calquera matemática con palabras.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } non ten contraste abondo para o texto do título da sección (modo escuro) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; cómpre polo menos { $threshold }:1).
       *[other] { $colorName } non ten contraste abondo para o texto do título da sección ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; cómpre polo menos { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` a través de { $count } puntos non está implementado cando os puntos non teñen valores numéricos.

circle-too-many-through-points = Non se pode calcular un círculo que pase por máis de 3 puntos.

circle-overprescribed-radius-center-points = Non se pode calcular un círculo con raio, centro e puntos especificados á vez.

circle-center-with-multiple-points = Non se pode calcular un círculo cun centro especificado que pase por máis dun punto.

circle-radius-too-small = Non se pode calcular o círculo: dado que a distancia entre os dous puntos é { $distance }, o raio especificado { $radius } é pequeno de máis.

circle-radius-with-many-points = Non se pode crear un círculo que pase por máis de dous puntos cun raio especificado.

circle-invalid-center-or-through-points = Centro ou puntos do círculo non válidos.

circle-radius-center-with-multiple-points = Non se pode calcular o raio dun círculo cun centro especificado que pase por máis dun punto.

circle-change-radius-non-numerical = Non se pode cambiar o raio dun círculo cando os puntos non teñen valores numéricos

circle-radius-with-points-non-numerical = Non se pode crear un círculo que pase por máis dun punto cun raio especificado cando non hai valores numéricos.

circle-change-center-non-numerical = Non se implementou cambiar o centro dun círculo que pasa por puntos sen valores numéricos.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Dimensións insuficientes para o dominio da función. O dominio ten { $intervals } intervalo pero a función ten { $inputs ->
            [one] { $inputs } entrada
           *[other] { $inputs } entradas
        }.
       *[other] Dimensións insuficientes para o dominio da función. O dominio ten { $intervals } intervalos pero a función ten { $inputs ->
            [one] { $inputs } entrada
           *[other] { $inputs } entradas
        }.
    }

function-domain-invalid-format = Formato non válido para o dominio da función.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ignórase o máximo non numérico da función.
        [minimum] Ignórase o mínimo non numérico da función.
        [extremum] Ignórase o extremo non numérico da función.
        [point] Ignórase o punto non numérico da función.
        [slope] Ignórase a pendente non numérica da función.
       *[other] Ignórase { $type } non numérico da función.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Ignórase o máximo baleiro da función.
        [minimum] Ignórase o mínimo baleiro da función.
        [extremum] Ignórase o extremo baleiro da función.
        [point] Ignórase o punto baleiro da función.
       *[other] Ignórase { $type } baleiro da función.
    }

function-points-too-close = A función contén dous puntos próximos de máis entre si. Non se pode definir a función.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] As iteracións dunha función só son posibles se o número de entradas é igual ao número de saídas. Esta función ten { $inputs } entrada e { $outputs ->
            [one] { $outputs } saída
           *[other] { $outputs } saídas
        }.
       *[other] As iteracións dunha función só son posibles se o número de entradas é igual ao número de saídas. Esta función ten { $inputs } entradas e { $outputs ->
            [one] { $outputs } saída
           *[other] { $outputs } saídas
        }.
    }

## `<sequence>`

sequence-invalid-length = Lonxitude de secuencia non válida.  Debe ser un enteiro non negativo.

sequence-invalid-step = Paso de secuencia non válido.  Debe ser un número para unha secuencia de tipo { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" non válido dunha secuencia de números.  Debe ser un número.

sequence-invalid-endpoint-letters = "{ $attribute }" non válido dunha secuencia de letras.  Debe ser unha combinación de letras.

sequence-invalid-endpoint = "{ $attribute }" non válido dunha secuencia.

select-from-sequence-coprime-not-numbers = ignórase coprime porque non se están seleccionando números

select-from-sequence-coprime-with-exclude-combinations = ignórase coprime porque se especificou excludeCombinations

## Resolving a `target`

target-not-found = target non válido para `<{ $source }>`: non se atopa o obxectivo.

target-state-variable-not-found = target non válido para `<{ $source }>`: non se atopa ningunha variable de estado chamada "{ $property }" nun `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = As variables de `<odeSystem>` deben ser distintas da variable independente.

ode-system-duplicate-variable-names = Non se poden definir as funcións RHS da ODE con nomes de variables dependentes duplicados.

ode-system-rhs-function-error = Non se pode definir a función RHS da ODE.  Erro ao crear a función mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Non se pode definir un ángulo entre { $count } liñas

angle-invalid-through-point = Punto non válido en through dun `<angle>`

parabola-vertex-too-many-points = Non se implementou unha parábola con vértice que pase por máis dun punto.

parabola-too-many-points = Non se implementou unha parábola que pase por máis de 3 puntos.

intersection-too-many-items = Non se implementou a intersección de máis de dous elementos

## Other math components

ionic-compound-not-two-ions = O composto iónico só se implementou para dous ións.

ionic-compound-needs-cation-and-anion = O composto iónico só se implementou para un catión e un anión.

solve-equations-cannot-evaluate = Non se pode resolver a ecuación porque non se puido avaliar: { $equation }

math-operators-operand-number-required = Cómpre especificar operandNumber ao extraer un operando matemático.

eigen-decomposition-failed = Non se puideron calcular os autovalores da matriz

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: o parámetro { $parameters } non aparece no patrón, polo que sempre coincidirá cun oco.
       *[other] `<matchesPattern>`: os parámetros { $parameters } non aparecen no patrón, polo que sempre coincidirán cun oco.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: non se pode interpretar grid="{ $grid }". Debe ser none, medium, dense, ou dous números positivos separados por un espazo, como grid="1 0.5". Non se debuxa ningunha grade.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" non se admite no renderizador prefigure; emprégase o comportamento da posición dereita.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" non se admite no renderizador prefigure; emprégase o comportamento da posición superior.

prefigure-invalid-axis-bounds = `<graph>`: límites de eixe non válidos para a conversión prefigure; emprégase o bbox predeterminado (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: anchura non válida para a conversión prefigure; emprégase a anchura de diagrama predeterminada 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio non válido para a conversión prefigure; emprégase a relación de aspecto predeterminada 1.

prefigure-grid-spacing-too-fine = `<graph>`: o espazamento da grade é fino de máis para os límites do eixe; omítese a grade no renderizador prefigure.

prefigure-annotations-not-rendered = `<graph>`: as anotacións non se renderizan se non se emprega o renderizador PreFigure.

multiple-annotations-children = Atopáronse varios fillos `<annotations>` dentro dun `<graph>`; ignóranse todos agás o último.

## Referring to other components

copy-unrecognized-component-type = Non se pode estender nin copiar un tipo de compoñente descoñecido: { $type }.

copy-prop-not-found = Non se atopou a propiedade { $property } nun compoñente de tipo { $component }

collect-no-source = Non se atopou ningunha fonte para collect.

collect-invalid-component-type = Non se poden recoller compoñentes de tipo `<{ $component }>` porque é un tipo de compoñente non válido.

reference-index-unavailable = Non se pode facer referencia ao índice `{ $reference }`

## `<callAction>`

component-action-unavailable = Non se pode chamar { $action } no compoñente `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Os datos teñen unha forma non válida.  As filas teñen lonxitudes inconsistentes. Atopado en componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Os datos teñen nomes de columna duplicados.  Atopado en componentIdx :{ $componentIdx }

data-frame-missing-column-name = Aos datos fáltalles un nome de columna.  Atopado en componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Un premio desta resposta baséase na resposta enviada pola propia etiqueta answer, o que provocará un comportamento inesperado.

answer-max-num-attempts-in-section-wide-check-work = Establecer `maxNumAttempts` nun `<answer>` dentro dun contedor con `sectionWideCheckWork` non ten ningún efecto, porque é o contedor quen controla o número de intentos. Estableza `maxNumAttempts` no contedor.

nested-section-wide-check-work-max-num-attempts = Establecer `maxNumAttempts` nun contedor con `sectionWideCheckWork` que está dentro doutro contedor con `sectionWideCheckWork` non ten ningún efecto, porque é o contedor exterior quen controla o número de intentos. Estableza `maxNumAttempts` no contedor exterior.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] O atributo { $attributes } non terá ningún efecto sen symbolicEquality establecido.
       *[other] Os atributos { $attributes } non terán ningún efecto sen symbolicEquality establecido.
    }

answer-invalid-type = Tipo non válido para a resposta: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Como o compoñente `<{ $component }>` non ten nome, non se pode empregar como atributo dun módulo

module-attribute-name-already-defined = O compoñente `<{ $component } name="{ $name }">` non se pode empregar como atributo dun módulo porque o tipo de compoñente `<module>` xa ten definido un atributo "{ $name }".

conditional-content-condition-ignored = Ignórase o atributo `condition` nun compoñente `<conditionalContent>` con fillos case ou else.

slider-markers-type-mismatch = O tipo dos marcadores non coincide co tipo do control desprazable.

pretzel-problem-needs-statement-and-answer = pretzel non válido: cada `<problem>` debe conter un `<statement>` e un `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel non válido: en mode="circuit", o primeiro `<problem>` non pode ser un distractor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Valor non válido { $values } para o atributo `{ $attribute }`; ignórase.
       *[other] Valores non válidos { $values } para o atributo `{ $attribute }`; ignóranse.
    }

attribute-must-be-references = Valor non válido `{ $value }` para o atributo `{ $attribute }`. O atributo debe estar formado por referencias que comecen por `$`.

math-input-invalid-function-names = <mathInput>: ignoráronse nomes de función non válidos en { $attribute }: { $names }. O segmento visible de cada nome debe ter polo menos 2 caracteres (letras ou guións); opcionalmente pode seguir un sufixo `|<mathspeak alternative>`.

## Building components from the source

component-type-invalid = Tipo de compoñente non válido: `<{ $componentType }>`

attribute-repeated = Non se pode repetir o atributo { $attribute }.

attribute-invalid-for-component = Atributo "{ $attribute }" non válido para un compoñente de tipo `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    A definición de estilo { $styleNumber } non ten contraste abondo para { $context ->
        [text-on-background] a cor do texto fronte á cor do fondo
        [high-contrast] a cor de alto contraste fronte ao lenzo
        [line] a cor da liña fronte ao lenzo
        [marker] a cor do marcador fronte ao lenzo
       *[text-on-canvas] a cor do texto fronte ao lenzo
    }{ $mode ->
        [dark] { " (modo escuro)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; cómpre polo menos { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Aínda que a definición de estilo { $styleNumber } especifica cores con contraste abondo para o modo claro, as cores do modo escuro derivadas deses valores non teñen contraste abondo entre a cor do texto e a cor do fondo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; cómpre polo menos { $threshold }:1). { $suggestion ->
        [available] Para garantir contraste abondo no modo escuro, aumente o contraste do modo claro (p. ex. estableza { $lightAttribute }="{ $lightColor }") ou sobrescriba a cor do modo escuro (p. ex. estableza { $darkAttribute }="{ $darkColor }").
       *[none] Para garantir contraste abondo no modo escuro, aumente o contraste do modo claro ou sobrescriba as cores derivadas con textColorDarkMode e/ou backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Aínda que a definición de estilo { $styleNumber } especifica unha cor de texto con contraste abondo para o modo claro, a cor de texto do modo escuro derivada dese valor non ten contraste abondo fronte ao lenzo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; cómpre polo menos { $threshold }:1). { $suggestion ->
        [available] Para garantir contraste abondo no modo escuro, aumente o contraste do modo claro (p. ex. estableza textColor="{ $lightColor }") ou sobrescriba a cor do modo escuro (p. ex. estableza textColorDarkMode="{ $darkColor }").
       *[none] Para garantir contraste abondo no modo escuro, aumente o contraste do modo claro ou sobrescriba a cor derivada con textColorDarkMode.
    }

section-multiple-style-palettes = Unha sección só pode seleccionar un <stylePalette>; emprégase o último.

## Unique variants

variant-num-to-select-not-non-negative-integer = non se poden determinar as variantes únicas de { $component } porque numToSelect non é un enteiro non negativo.

variant-num-to-select-not-constant-number = non se poden determinar as variantes únicas de { $component } porque numToSelect non é un número constante.

variant-with-replacement-not-constant-boolean = non se poden determinar as variantes únicas de { $component } porque withReplacement non é un booleano constante.

variant-select-weight-disables-unique = As variantes únicas de select desactívanse se hai unha opción con selectWeight ou selectForVariants especificado

variant-coprime-undetermined = non se poden determinar as variantes únicas de { $component } porque non se pode determinar que coprime sexa sempre falso.

variant-attribute-not-constant = non se poden determinar as variantes únicas de { $component } porque { $attribute } non é constante.

variant-attribute-not-number = non se poden determinar as variantes únicas de { $component } porque { $attribute } non é un número.

variant-attribute-wrong-type-for-sequence =
    non se poden determinar as variantes únicas de { $component } de tipo { $type } porque { $attribute } non é { $expected ->
        [letters-combination] unha combinación de letras
        [math-expression] unha expresión matemática válida
        [integer] un enteiro
       *[number] un número
    }.

variant-length-not-integer = non se poden determinar as variantes únicas de { $component } porque length non é un enteiro.

variant-sort-not-implemented = non se implementaron as variantes únicas dun { $component } con sort

variant-exclude-combinations-not-implemented = non se implementaron as variantes únicas dun { $component } con excludeCombinations

variant-math-exclude-not-implemented = non se implementaron as variantes únicas dun { $component } de tipo math con exclude

variant-non-constant-exclude-not-implemented = non se implementaron as variantes únicas dun { $component } cun exclude non constante

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: non se admite no renderizador prefigure do gráfico; omitiuse o descendente.

prefigure-descendant-invalid-geometry = { $subject }: xeometría non finita ou incompleta; omitiuse o descendente.

prefigure-curve-label-omitted = { $subject }: non se admiten etiquetas en elementos de curva convertidos; omitiuse a etiqueta.

prefigure-curve-unsupported-definition-type = { $subject }: tipo de definición de función de curva non admitido '{ $definitionType }'; omitiuse o descendente.

prefigure-region-flip-functions-unsupported = { $subject }: o atributo flipFunctions non se admite en regionBetweenCurves; omitiuse o descendente.

prefigure-region-non-formula-child = { $subject }: en regionBetweenCurves só se admiten funcións fillas de tipo formula; omitiuse o descendente.

prefigure-label-position-unsupported =
    { $subject }: labelPosition non admitido '{ $labelPosition }' para { $labelKind ->
        [line-family] unha etiqueta da familia das liñas
       *[point] unha etiqueta de punto
    }; empregouse o aliñamento predeterminado de PreFigure.

prefigure-fill-style-unsupported = { $subject }: PreFigure non admite o estilo de recheo '{ $fillStyle }'; recórrese a un recheo sólido.

prefigure-line-style-unknown = { $subject }: omitiuse o estilo de liña descoñecido '{ $lineStyle }' da saída de PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: o estilo de marcador '{ $markerStyle }' asignouse ao estilo 'diamond' de PreFigure.

prefigure-marker-style-unsupported = { $subject }: PreFigure non admite o estilo de marcador '{ $markerStyle }'; empregouse o estilo predeterminado.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` non válido; non se pode resolver o obxectivo. Omitiuse a anotación.

annotation-ref-multiple-targets = `<annotation>`: `ref` resolveuse a varios obxectivos; emprégase o primeiro.

annotation-ref-outside-graph = `<annotation>`: `ref` non válido; o obxectivo está fóra do gráfico que o contén. Omitiuse a anotación.

annotation-ref-unsupported-target = `<annotation>`: `ref` non válido; o obxectivo non é un obxecto gráfico admitido na conversión prefigure. Omitiuse a anotación.

annotation-text-missing = `<annotation>`: `text` ausente ou baleiro; emítese texto baleiro.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Detectouse unha dependencia circular.
       *[other] Detectouse unha dependencia circular que implica un compoñente `<{ $componentType }>`.
    }

reference-no-referent = Non se atopou ningún referente para a referencia: `{ $reference }`

reference-multiple-referents = Atopáronse varios referentes para a referencia: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Formato non válido para o atributo { $attribute } de `<{ $componentType }>`.

children-invalid = Fillos non válidos para `<{ $componentType }>`: Atopáronse fillos non válidos: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valor non válido `{ $value }` para o atributo `{ $attribute }`, emprégase o valor `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Non se atopou a versión { $version } de DoenetML.
       *[other] Non se atopou a versión { $version } de DoenetML. Recórrese á versión { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML non válido: { $content }

parse-tag-missing-close-tag = DoenetML non válido: A etiqueta `{ $tag }` non ten etiqueta de peche. Agardábase unha etiqueta autopechada ou unha etiqueta `</{ $tagName }>`.

parse-tag-error = DoenetML non válido: Erro na etiqueta `<{ $tagName }>`

parse-attribute-missing-value = DoenetML non válido: Semella que ao atributo non válido `{ $attribute }` fáltalle un valor.

parse-attribute-invalid = DoenetML non válido: Atributo non válido `{ $attribute }`

parse-attribute-value-invalid = DoenetML non válido: Valor de atributo non válido `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML non válido: Valor de atributo non válido `{ $value }`. As comiñas non coinciden. Semella que lle falta unha `{ $quote }`

parse-open-tag-name-missing = DoenetML non válido: Atopouse unha etiqueta sen nome, p. ex. `<`

parse-tag-not-closed = DoenetML non válido: A etiqueta `{ $tag }` non se pechou (semella que falta un `>`).

parse-self-closing-tag-name-missing = DoenetML non válido: Atopouse unha etiqueta sen nome `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML non válido: A etiqueta `{ $tag }` non se pechou (semella que falta un `/>`).

parse-tag-invalid-attributes = DoenetML non válido: A etiqueta `{ $tag }` non é válida. Pode ter atributos incorrectos.

parse-close-tag-name-missing = DoenetML non válido: Atopouse unha etiqueta de peche sen nome, p. ex. `</`

parse-attribute-value-unquoted = Os valores dos atributos deben ir entre comiñas: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML non válido: Atopouse a etiqueta de peche `{ $tag }`, pero ningunha etiqueta de apertura correspondente

parse-close-tag-mismatched = DoenetML non válido: Etiqueta de peche non coincidente. Agardábase `</{ $expected }>`. Atopouse `{ $found }`

parser-node-unconvertible = Non se puido converter o nodo { $node } nun nodo Dast.

## Names

name-attribute-invalid =
    Nome de atributo non válido name='{ $name }'. { $reason ->
        [characters] Os nomes só poden conter letras, cifras, guións baixos ou guións.
       *[start] Os nomes deben comezar por unha letra.
    }

component-name-invalid-start = Nome de compoñente non válido "{ $name }". Os nomes deben comezar por unha letra.

## `<answer>` sugar

answer-video-watched-missing-video = Unha resposta de tipo videoWatched debe ter un atributo video

answer-video-watched-video-not-reference = O atributo video dunha resposta de tipo videoWatched debe ser unha referencia

answer-name-not-single-text = O atributo name da resposta debe ter un único fillo de texto

## Referencing another document

external-doenetml-recursion-limit = Non se puido recuperar o DoenetML externo por demasiados niveis de recursión. Hai algunha referencia circular?

external-doenetml-unavailable = Non se puido recuperar o DoenetML de { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML non válido recuperado de { $attribute }="{ $uri }": non coincide co tipo de compoñente "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] O atributo `{ $from }` está obsoleto; empregue `{ $to }` no seu lugar.
       *[other] [deprecation] O atributo `{ $from }` de `<{ $component }>` está obsoleto; empregue `{ $to }` no seu lugar.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] O atributo `{ $from }` está obsoleto e ignórase porque tamén se especificou `{ $to }`.
       *[other] [deprecation] O atributo `{ $from }` de `<{ $component }>` está obsoleto e ignórase porque tamén se especificou `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] O atributo `{ $attribute }` de `<{ $component }>` está obsoleto e ignórase.


## Language coverage

pluralize-english-only = `<pluralize>` só pode poñer en plural o inglés, polo que o seu texto déixase sen cambios nun documento escrito en { $locale }. Escriba a forma plural directamente, ou estabelézaa co atributo `pluralForm`.


## Checking against the schema

schema-element-unrecognized = O elemento `<{ $tag }>` non é un elemento de Doenet recoñecido.

schema-element-not-allowed-at-root = O elemento `<{ $tag }>` non se permite na raíz do documento.

schema-element-not-allowed-inside = O elemento `<{ $tag }>` non se permite dentro de `<{ $parent }>`.

schema-attribute-unrecognized = O elemento `<{ $tag }>` non ten ningún atributo chamado `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] O atributo `{ $attribute }` do elemento `<{ $tag }>` debe ser unha lista na que cada elemento sexa un de: { $allowed }
       *[other] O atributo `{ $attribute }` do elemento `<{ $tag }>` debe ser un de: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nome de variante non válido para select.  O nome de variante { $variantName } aparece en { $numOptions } opcións pero o número a seleccionar é { $numToSelect }.

select-variant-name-without-options = Especificáronse variantes para select pero non se especificou ningunha opción para o posible nome de variante: { $variantName }.

select-variant-name-not-possible = O nome de variante { $variantName } especificado para select non é un nome de variante posible.

select-too-few-options = Non se poden seleccionar { $numToSelect } compoñentes de só { $numOptions }.

select-from-sequence-too-few-values = Non se poden seleccionar { $numToSelect } valores dunha secuencia de lonxitude { $length }.

select-from-sequence-indices-count-mismatch = O número de índices especificados para select debe coincidir co número a seleccionar

select-from-sequence-indices-not-integers = Todos os índices especificados para select deben ser enteiros

select-from-sequence-index-excluded = Especificouse un índice de selectfromsequence que estaba excluído

select-from-sequence-indices-excluded-combination = Especificáronse índices de selectfromsequence que formaban unha combinación excluída

select-from-sequence-coprime-not-positive-integers = Non se poden seleccionar combinacións coprimas porque non se están seleccionando enteiros positivos.

select-from-sequence-coprime-common-factor = Non se poden seleccionar números coprimos. Todos os valores posibles comparten un factor común. (Os valores especificados de "from" ou "to" deben ser coprimos con "step".)

select-from-sequence-coprime-single-number = Non se poden seleccionar combinacións coprimas a partir dun único número que non sexa 1.

select-from-sequence-excluded-too-many-combinations = Excluíuse máis do 70% das combinacións en selectFromSequence

select-from-sequence-coprime-none-found = Non se puideron seleccionar números coprimos. Todos os valores posibles comparten un factor común.

select-from-sequence-too-few-unique-values = Non se poden seleccionar { $numToSelect } valores únicos dunha secuencia de lonxitude { $numPossibleValues }

select-prime-numbers-too-few-values = Non se poden seleccionar { $numToSelect } valores dunha lista de números primos de lonxitude { $numValues }

select-prime-numbers-values-count-mismatch = O número de valores especificados para select debe coincidir co número a seleccionar

select-prime-numbers-values-not-prime = Todos os valores especificados para select prime number deben estar na lista de números primos

select-prime-numbers-values-excluded-combination = Os valores especificados de selectPrimeNumbers formaban unha combinación excluída

select-prime-numbers-excluded-too-many-combinations = Excluíuse máis do 70% das combinacións en selectPrimeNumbers

select-random-combination-fluke = Por unha casualidade extremadamente improbable, non se puido seleccionar ningunha combinación de valores aleatorios

select-random-value-fluke = Por unha casualidade extremadamente improbable, non se puido seleccionar ningún valor aleatorio

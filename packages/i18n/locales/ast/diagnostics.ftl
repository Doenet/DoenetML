# Asturian diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
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


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } inórase cuando se conseñen dambos estremos
       *[other] { $attributes } inórense cuando se conseñen dambos estremos
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } inórase cuando se conseñen un estremu y un puntu mediu
       *[other] { $attributes } inórense cuando se conseñen un estremu y un puntu mediu
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset nun tien efeutu ensin un puntu mediu

## `<line>`

line-points-undetermined-dimensions = Recta que pasa per puntos de dimensiones indetermináes.

line-points-too-few-dimensions = La recta tien de pasar per puntos de polo menos dos dimensiones.

line-points-depend-on-variables = La recta pasa per puntos que dependen de variables: { $variables }.

line-equation-invalid-format = Formatu inválidu pa la ecuación d'una recta nes variables { $variable1 } y { $variable2 }.

## `<ray>`

ray-overprescribed-through = La semirrecta ta determinada por through, endpoint y direction. Inórase'l through conseñáu.

ray-dimension-mismatch = numDimensions nun concasa en ray.

## `<vector>`

vector-overprescribed-head = El vector ta determináu por head, tail y displacement. Inórase'l head conseñáu.

vector-dimension-mismatch = numDimensions nun concasa en vector.

## Attracting and constraining

attract-to-without-nearest-point = Nun se pue atrayer a un `<{ $component }>` porque nun tien la variable d'estáu nearestPoint.

constrain-to-without-nearest-point = Nun se pue restrinxir a un `<{ $component }>` porque nun tien la variable d'estáu nearestPoint.

constrain-to-interior-without-nearest-point = Nun se pue restrinxir al interior d'un `<{ $component }>` porque nun tien la variable d'estáu nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition inórase nun choiceInput que nun ye inline

## Ordering children by index

choice-input-indices-count-mismatch = Inórense los índices conseñaos pa choiceInput porque'l so númberu nun concasa col númberu de fíos choice.

pretzel-indices-count-mismatch = Inórense los índices conseñaos pa problem porque'l so númberu nun concasa col númberu de fíos problem.

shuffle-indices-count-mismatch = Inórense los índices conseñaos pa shuffle porque'l so númberu nun concasa col númberu de componentes.

indices-ignored-out-of-range = Inórense los índices conseñaos pa { $component } porque dalgunos tán fuera de rangu.

pretzel-indices-repeated = Inórense los índices conseñaos pa pretzel porque dalgunos repítense.

pretzel-circuit-first-index = Inórense los índices conseñaos pa pretzel en mode="circuit" porque'l primer índiz tien de ser 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Pa que `<{ $component }>` funcione con fíos de testu, tien de conseñase un atributu `type`.

invalid-type-defaulting-to-math = type { $type } inválidu pal componente { $component }. Tien de ser math, text, number o boolean. Ponse en math.

string-not-valid-component-to-arrange = El testu "{ $value }" nun ye un componente válidu pa { $component }. Inórase.

## Types and variables

invalid-type-defaulting-to-number = type { $type } inválidu, type ponse en number.

invalid-variable-value = Valor inválidu d'una variable: `{ $value }`

## Variants

variant-index-must-be-number = L'índiz de variante { $index } tien de ser un númberu

variant-index-must-be-integer = L'índiz de variante { $index } tien de ser un enteru

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` nun ta implementáu pa midíes absolutes. Los anchores pónense en relativu.

side-by-side-absolute-margins = `<{ $component }>` nun ta implementáu pa midíes absolutes. Los márxenes pónense en relativu.

side-by-side-no-block-child = `<{ $component }>` inválidu: tien de tener polo menos un fíu de bloque.

## `<label>`

label-for-ignored-on-graphical = L'atributu `for` nun `<label>` gráficu inórase.

label-for-must-resolve-to-one = L'atributu `for` en `<label>` tien de resolvese n'exautamente un componente.

label-for-unresolved = L'atributu `for` en `<label>` nun se pudo resolver nun componente.

label-for-answer-with-authored-inputs = L'atributu `for` en `<label>` fai referencia a un `<answer>` con campos d'entrada escritos a costa; fai referencia al campu direutamente.

label-for-answer-without-input = L'atributu `for` en `<label>` fai referencia a un `<answer>` ensin campu d'entrada qu'etiquetar.

label-for-must-reference-input-or-answer = L'atributu `for` en `<label>` tien de facer referencia a un campu d'entrada o a un answer.

## Accessibility

accessibility-short-description-or-decorative = Pola accesibilidá, `<{ $component }>` tien de tener una descripción curtia o conseñase como decorativu.

accessibility-video-short-description = Pola accesibilidá, `<video>` tien de tener una descripción curtia.

accessibility-input-short-description-or-label = Pola accesibilidá, `<{ $component }>` tien de tener una descripción curtia o una etiqueta.

accessibility-answer-input-short-description-or-label = Pola accesibilidá, un `<answer>` que crea un campu d'entrada tien de tener una descripción curtia o una etiqueta.

accessibility-short-description-contains-math = Les descripciones curties nun tendríen de contener componentes matemáticos como `<{ $component }>`. Escribi les matemátiques con pallabres.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } nun tien contraste bastante pal testu del títulu de seición (mou escuru) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ríquense polo menos { $threshold }:1).
       *[other] { $colorName } nun tien contraste bastante pal testu del títulu de seición ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ríquense polo menos { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` que pasa per { $count } puntos nun ta implementáu cuando los puntos nun tienen valores numbéricos.

circle-too-many-through-points = Nun se pue calcular un círculu que pase per más de 3 puntos.

circle-overprescribed-radius-center-points = Nun se pue calcular un círculu con radiu, centru y puntos conseñaos.

circle-center-with-multiple-points = Nun se pue calcular un círculu con centru conseñáu que pase per más d'1 puntu.

circle-radius-too-small = Nun se pue calcular el círculu: como la distancia ente los dos puntos ye { $distance }, el radiu conseñáu { $radius } ye perpequeñu.

circle-radius-with-many-points = Nun se pue crear un círculu que pase per más de dos puntos con un radiu conseñáu.

circle-invalid-center-or-through-points = Centru o puntos de pasu del círculu inválidos.

circle-radius-center-with-multiple-points = Nun se pue calcular el radiu d'un círculu con centru conseñáu que pase per más d'1 puntu.

circle-change-radius-non-numerical = Nun se pue camudar el radiu d'un círculu con puntos non numbéricos

circle-radius-with-points-non-numerical = Nun se pue crear un círculu que pase per más d'un puntu con un radiu conseñáu cuando los valores nun son numbéricos.

circle-change-center-non-numerical = El camudar el centru d'un círculu que pasa per puntos con valores non numbéricos nun ta implementao.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Dimensiones insuficientes pal dominiu de la función. El dominiu tien { $intervals } intervalu pero la función tien { $inputs ->
            [one] { $inputs } entrada
           *[other] { $inputs } entraes
        }.
       *[other] Dimensiones insuficientes pal dominiu de la función. El dominiu tien { $intervals } intervalos pero la función tien { $inputs ->
            [one] { $inputs } entrada
           *[other] { $inputs } entraes
        }.
    }

function-domain-invalid-format = Formatu inválidu pal dominiu de la función.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Inórase'l máximu non numbéricu de la función.
        [minimum] Inórase'l mínimu non numbéricu de la función.
        [extremum] Inórase l'estremu non numbéricu de la función.
        [point] Inórase'l puntu non numbéricu de la función.
        [slope] Inórase la pendiente non numbérica de la función.
       *[other] Inórase'l { $type } non numbéricu de la función.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Inórase'l máximu baleru de la función.
        [minimum] Inórase'l mínimu baleru de la función.
        [extremum] Inórase l'estremu baleru de la función.
        [point] Inórase'l puntu baleru de la función.
       *[other] Inórase'l { $type } baleru de la función.
    }

function-points-too-close = La función contién dos puntos abondo averaos ente ellos. Nun se pue definir la función.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Les iteraciones d'una función namás son posibles si'l númberu d'entraes ye igual al de salíes. Esta función tien { $inputs } entrada y { $outputs ->
            [one] { $outputs } salida
           *[other] { $outputs } salíes
        }.
       *[other] Les iteraciones d'una función namás son posibles si'l númberu d'entraes ye igual al de salíes. Esta función tien { $inputs } entraes y { $outputs ->
            [one] { $outputs } salida
           *[other] { $outputs } salíes
        }.
    }

## `<sequence>`

sequence-invalid-length = Llonxitú inválida de la secuencia. Tien de ser un enteru non negativu.

sequence-invalid-step = Pasu inválidu de la secuencia. Tien de ser un númberu pa una secuencia de triba { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" inválidu d'una secuencia de númberos. Tien de ser un númberu.

sequence-invalid-endpoint-letters = "{ $attribute }" inválidu d'una secuencia de lletres. Tien de ser una combinación de lletres.

sequence-invalid-endpoint = "{ $attribute }" inválidu de la secuencia.

select-from-sequence-coprime-not-numbers = coprime inórase porque nun se tán escoyendo númberos

select-from-sequence-coprime-with-exclude-combinations = coprime inórase porque ta conseñáu excludeCombinations

## Resolving a `target`

target-not-found = target inválidu pa `<{ $source }>`: nun s'alcuentra l'oxetivu.

target-state-variable-not-found = target inválidu pa `<{ $source }>`: nun s'alcuentra denguna variable d'estáu nomada "{ $property }" nun `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Les variables de `<odeSystem>` tienen de ser distintes de la variable independiente.

ode-system-duplicate-variable-names = Nun se puen definir les funciones del miembru drechu de la EDO con nomes de variables dependientes repitíos.

ode-system-rhs-function-error = Nun se pue definir la función del miembru drechu de la EDO. Error al crear la función mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Nun se pue definir un ángulu ente { $count } rectes

angle-invalid-through-point = Puntu inválidu nel through de `<angle>`

parabola-vertex-too-many-points = Una parábola con vértiz que pase per más d'1 puntu nun ta implementada.

parabola-too-many-points = Una parábola que pase per más de 3 puntos nun ta implementada.

intersection-too-many-items = La intersección de más de dos oxetos nun ta implementada

## Other math components

ionic-compound-not-two-ions = Un compuestu iónicu nun ta implementáu pa otra cosa que dos iones.

ionic-compound-needs-cation-and-anion = Un compuestu iónicu ta implementáu namás pa un catión y un anión.

solve-equations-cannot-evaluate = Nun se pue resolver la ecuación porque nun se pudo evaluar: { $equation }

math-operators-operand-number-required = Hai que conseñar un operandNumber al estrayer un operandu matemáticu.

eigen-decomposition-failed = Nun se pudieron calcular los autovalores de la matriz

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: el parámetru { $parameters } nun apaez nel patrón, asina que va concasar siempres con un baleru.
       *[other] `<matchesPattern>`: los parámetros { $parameters } nun apaecen nel patrón, asina que van concasar siempres con un baleru.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: nun se pue interpretar grid="{ $grid }". Tien de ser none, medium, dense o dos númberos positivos separtaos por un espaciu, por exemplu grid="1 0.5". Nun se dibuxa denguna rexella.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" nun ta sofitáu nel motor prefigure; úsase'l comportamientu de la posición drecha.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" nun ta sofitáu nel motor prefigure; úsase'l comportamientu de la posición superior.

prefigure-invalid-axis-bounds = `<graph>`: llímites d'exes inválidos pa la conversión a prefigure; úsase la bbox por defeutu (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: anchor inválidu pa la conversión a prefigure; úsase l'anchor por defeutu 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio inválidu pa la conversión a prefigure; úsase la proporción por defeutu 1.

prefigure-grid-spacing-too-fine = `<graph>`: l'espaciáu de la rexella ye percenciellu pa los llímites de les exes; la rexella omítese nel motor prefigure.

prefigure-annotations-not-rendered = `<graph>`: les anotaciones nun se van amosar cuando nun s'use'l motor PreFigure.

multiple-annotations-children = Alcontróse más d'un fíu `<annotations>` en `<graph>`; inórense toos sacante l'últimu.

## Referring to other components

copy-unrecognized-component-type = Nun se pue estender nin copiar una triba de componente desconocida: { $type }.

copy-prop-not-found = Nun s'alcontró la propiedá { $property } nun componente de triba { $component }

collect-no-source = Nun s'alcontró denguna fonte pa collect.

collect-invalid-component-type = Nun se puen recoyer componentes de triba `<{ $component }>` porque ye una triba de componente inválida.

reference-index-unavailable = Nun se pue facer referencia al índiz `{ $reference }`

## `<callAction>`

component-action-unavailable = Nun se pue llamar { $action } nel componente `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Los datos tienen una forma inválida. Les fileres tienen llonxitúes distintes. Alcontráu en componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Los datos tienen nomes de columna repitíos. Alcontráu en componentIdx :{ $componentIdx }

data-frame-missing-column-name = A los datos fáltalos un nome de columna. Alcontráu en componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Un award d'esta rempuesta básase na propia rempuesta unviada de la etiqueta answer, lo que va llevar a un comportamientu inesperáu.

answer-max-num-attempts-in-section-wide-check-work = Poner `maxNumAttempts` nun `<answer>` dientro d'un contenedor con `sectionWideCheckWork` nun tien efeutu, porque'l númberu d'intentos contrólalu'l contenedor. Pon `maxNumAttempts` nel contenedor.

nested-section-wide-check-work-max-num-attempts = Poner `maxNumAttempts` nun contenedor con `sectionWideCheckWork` que ta dientro d'otru contenedor con `sectionWideCheckWork` nun tien efeutu, porque'l númberu d'intentos contrólalu'l contenedor esterior. Pon `maxNumAttempts` nel contenedor esterior.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] L'atributu { $attributes } nun va tener efeutu ensin symbolicEquality.
       *[other] Los atributos { $attributes } nun van tener efeutu ensin symbolicEquality.
    }

answer-invalid-type = Triba inválida pa la rempuesta: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Como'l componente `<{ $component }>` nun tien nome, nun se pue usar como atributu d'un módulu

module-attribute-name-already-defined = El componente `<{ $component } name="{ $name }">` nun se pue usar como atributu d'un módulu porque la triba de componente `<module>` yá tien un atributu "{ $name }".

conditional-content-condition-ignored = L'atributu `condition` inórase nun componente `<conditionalContent>` con fíos case o else.

slider-markers-type-mismatch = La triba de los marcadores nun concasa cola triba del eslizador.

pretzel-problem-needs-statement-and-answer = pretzel inválidu: cada `<problem>` tien de contener un `<statement>` y un `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel inválidu: en mode="circuit", el primer `<problem>` nun pue ser un distractor.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Valor inválidu { $values } pal atributu `{ $attribute }`; inórase.
       *[other] Valores inválidos { $values } pal atributu `{ $attribute }`; inórense.
    }

attribute-must-be-references = Valor inválidu `{ $value }` pal atributu `{ $attribute }`. L'atributu tien de tar compuestu de referencies qu'entamen por un `$`.

math-input-invalid-function-names = <mathInput>: inoráronse nomes de función inválidos en { $attribute }: { $names }. La parte visible de cada nome tien de tener polo menos 2 caráuteres (lletres o guiones); pue siguir un sufixu opcional `|<mathspeak alternativa>`.

## Building components from the source

component-type-invalid = Triba de componente inválida: `<{ $componentType }>`

attribute-repeated = Nun se pue repitir l'atributu { $attribute }.

attribute-invalid-for-component = Atributu "{ $attribute }" inválidu pa un componente de triba `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    La definición d'estilu { $styleNumber } nun tien contraste bastante { $context ->
        [text-on-background] pal color del testu escontra'l color de fondu
        [high-contrast] pal color d'altu contraste escontra'l llenzu
        [line] pal color de la llinia escontra'l llenzu
        [marker] pal color del marcador escontra'l llenzu
       *[text-on-canvas] pal color del testu escontra'l llenzu
    }{ $mode ->
        [dark] { " (mou escuru)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ríquense polo menos { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Anque la definición d'estilu { $styleNumber } conseña colores con contraste bastante pal mou claru, los colores del mou escuru derivaos d'esos valores nun tienen contraste bastante ente'l color del testu y el color de fondu ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ríquense polo menos { $threshold }:1). { $suggestion ->
        [available] P'asegurar contraste bastante nel mou escuru, aumenta'l contraste del mou claru (por exemplu { $lightAttribute }="{ $lightColor }") o sustitúi el color del mou escuru (por exemplu { $darkAttribute }="{ $darkColor }").
       *[none] P'asegurar contraste bastante nel mou escuru, aumenta'l contraste del mou claru o sustitúi los colores derivaos con textColorDarkMode y/o backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Anque la definición d'estilu { $styleNumber } conseña un color de testu con contraste bastante pal mou claru, el color de testu del mou escuru deriváu d'esi valor nun tien contraste bastante escontra'l llenzu ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ríquense polo menos { $threshold }:1). { $suggestion ->
        [available] P'asegurar contraste bastante nel mou escuru, aumenta'l contraste del mou claru (por exemplu textColor="{ $lightColor }") o sustitúi el color del mou escuru (por exemplu textColorDarkMode="{ $darkColor }").
       *[none] P'asegurar contraste bastante nel mou escuru, aumenta'l contraste del mou claru o sustitúi el color deriváu con textColorDarkMode.
    }

section-multiple-style-palettes = Una seición pue escoyer namás una <stylePalette>; úsase la última.

## Unique variants

variant-num-to-select-not-non-negative-integer = nun se puen determinar les variantes úniques de { $component } porque numToSelect nun ye un enteru non negativu.

variant-num-to-select-not-constant-number = nun se puen determinar les variantes úniques de { $component } porque numToSelect nun ye un númberu constante.

variant-with-replacement-not-constant-boolean = nun se puen determinar les variantes úniques de { $component } porque withReplacement nun ye un boolean constante.

variant-select-weight-disables-unique = Les variantes úniques pa select desactívense si una opción tien conseñáu selectWeight o selectForVariants

variant-coprime-undetermined = nun se puen determinar les variantes úniques de { $component } porque nun se pue determinar que coprime seya siempres falsu.

variant-attribute-not-constant = nun se puen determinar les variantes úniques de { $component } porque { $attribute } nun ye una constante.

variant-attribute-not-number = nun se puen determinar les variantes úniques de { $component } porque { $attribute } nun ye un númberu.

variant-attribute-wrong-type-for-sequence =
    nun se puen determinar les variantes úniques de { $component } de triba { $type } porque { $attribute } nun ye { $expected ->
        [letters-combination] una combinación de lletres
        [math-expression] una espresión matemática válida
        [integer] un enteru
       *[number] un númberu
    }.

variant-length-not-integer = nun se puen determinar les variantes úniques de { $component } porque length nun ye un enteru.

variant-sort-not-implemented = les variantes úniques d'un { $component } con sort nun tán implementaes

variant-exclude-combinations-not-implemented = les variantes úniques d'un { $component } con excludeCombinations nun tán implementaes

variant-math-exclude-not-implemented = les variantes úniques d'un { $component } de triba math con exclude nun tán implementaes

variant-non-constant-exclude-not-implemented = les variantes úniques d'un { $component } con un exclude non constante nun tán implementaes

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: nun ta sofitáu nel motor prefigure de la gráfica; sáltase'l descendiente.

prefigure-descendant-invalid-geometry = { $subject }: xeometría non finita o incompleta; sáltase'l descendiente.

prefigure-curve-label-omitted = { $subject }: les etiquetes nun tán sofitaes nos elementos de curva convertíos; omítese la etiqueta.

prefigure-curve-unsupported-definition-type = { $subject }: triba de definición de función de curva non sofitada '{ $definitionType }'; sáltase'l descendiente.

prefigure-region-flip-functions-unsupported = { $subject }: atributu flipFunctions non sofitáu en regionBetweenCurves; sáltase'l descendiente.

prefigure-region-non-formula-child = { $subject }: en regionBetweenCurves namás se sofiten les funciones fíes definíes por una fórmula; sáltase'l descendiente.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' non sofitáu pa { $labelKind ->
        [line-family] una etiqueta de la familia de les llinies
       *[point] una etiqueta de puntu
    }; úsase l'alliniamientu PreFigure por defeutu.

prefigure-fill-style-unsupported = { $subject }: l'estilu de rellenu '{ $fillStyle }' nun ta sofitáu por PreFigure; vuélvese a un rellenu sólidu.

prefigure-line-style-unknown = { $subject }: estilu de llinia desconocíu '{ $lineStyle }' omitíu de la salida PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: l'estilu de marcador '{ $markerStyle }' convirtióse nel estilu PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: l'estilu de marcador '{ $markerStyle }' nun ta sofitáu por PreFigure; úsase l'estilu por defeutu.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` inválidu; nun se pue resolver l'oxetivu. Omítese l'anotación.

annotation-ref-multiple-targets = `<annotation>`: `ref` resolvióse en dellos oxetivos; úsase'l primeru.

annotation-ref-outside-graph = `<annotation>`: `ref` inválidu; l'oxetivu ta fuera de la gráfica que lu contién. Omítese l'anotación.

annotation-ref-unsupported-target = `<annotation>`: `ref` inválidu; l'oxetivu nun ye un oxetu gráficu sofitáu na conversión prefigure. Omítese l'anotación.

annotation-text-missing = `<annotation>`: falta `text` o ta baleru; emítese un testu baleru.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Deteutóse una dependencia circular.
       *[other] Deteutóse una dependencia circular qu'implica un componente `<{ $componentType }>`.
    }

reference-no-referent = Nun s'alcontró dengún referente pa la referencia: `{ $reference }`

reference-multiple-referents = Alcontróse más d'un referente pa la referencia: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Formatu inválidu pal atributu { $attribute } de `<{ $componentType }>`.

children-invalid = Fíos inválidos pa `<{ $componentType }>`: alcontráronse fíos inválidos: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valor inválidu `{ $value }` pal atributu `{ $attribute }`, úsase'l valor `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Nun s'alcontró la versión { $version } de DoenetML.
       *[other] Nun s'alcontró la versión { $version } de DoenetML. Vuélvese a la versión { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML inválidu: { $content }

parse-tag-missing-close-tag = DoenetML inválidu: la etiqueta `{ $tag }` nun tien etiqueta de zarru. Esperábase una etiqueta autozarrada o una etiqueta `</{ $tagName }>`.

parse-tag-error = DoenetML inválidu: error na etiqueta `<{ $tagName }>`

parse-attribute-missing-value = DoenetML inválidu: paez que-y falta un valor al atributu inválidu `{ $attribute }`.

parse-attribute-invalid = DoenetML inválidu: atributu inválidu `{ $attribute }`

parse-attribute-value-invalid = DoenetML inválidu: valor d'atributu inválidu `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML inválidu: valor d'atributu inválidu `{ $value }`. Les comines nun concasen. Paez que falta una `{ $quote }`

parse-open-tag-name-missing = DoenetML inválidu: alcontróse una etiqueta ensin nome, por exemplu `<`

parse-tag-not-closed = DoenetML inválidu: la etiqueta `{ $tag }` nun se zarró (paez que falta un `>`).

parse-self-closing-tag-name-missing = DoenetML inválidu: alcontróse una etiqueta ensin nome `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML inválidu: la etiqueta `{ $tag }` nun se zarró (paez que falta `/>`).

parse-tag-invalid-attributes = DoenetML inválidu: la etiqueta `{ $tag }` nun ye válida. Pue tener atributos incorreutos.

parse-close-tag-name-missing = DoenetML inválidu: alcontróse una etiqueta de zarru ensin nome, por exemplu `</`

parse-attribute-value-unquoted = Los valores d'atributu tienen de dir ente comines: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML inválidu: alcontróse la etiqueta de zarru `{ $tag }`, pero nun hai etiqueta d'apertura correspondiente

parse-close-tag-mismatched = DoenetML inválidu: etiqueta de zarru que nun concasa. Esperábase `</{ $expected }>`. Alcontróse `{ $found }`

parser-node-unconvertible = Nun se pudo convertir el nodu { $node } nun nodu Dast.

## Names

name-attribute-invalid =
    Atributu name='{ $name }' inválidu. { $reason ->
        [characters] Los nomes namás puen contener lletres, númberos, guiones baxos o guiones.
       *[start] Los nomes tienen d'entamar por una lletra.
    }

component-name-invalid-start = Nome de componente "{ $name }" inválidu. Los nomes tienen d'entamar por una lletra.

## `<answer>` sugar

answer-video-watched-missing-video = Un answer de triba videoWatched tien de tener un atributu video

answer-video-watched-video-not-reference = Un answer de triba videoWatched tien de tener un atributu video que seya una referencia

answer-name-not-single-text = L'atributu name d'un answer tien de tener un solu fíu de testu

## Referencing another document

external-doenetml-recursion-limit = Nun se pue recuperar el DoenetML esternu por demasiaos niveles de recursión. ¿Hai una referencia circular?

external-doenetml-unavailable = Nun se pue recuperar DoenetML dende { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML inválidu recuperáu dende { $attribute }="{ $uri }": nun concasó cola triba de componente "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] L'atributu `{ $from }` ta obsoletu; usa `{ $to }` nel so llugar.
       *[other] [deprecation] L'atributu `{ $from }` en `<{ $component }>` ta obsoletu; usa `{ $to }` nel so llugar.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] L'atributu `{ $from }` ta obsoletu ya inórase porque tamién se conseñó `{ $to }`.
       *[other] [deprecation] L'atributu `{ $from }` en `<{ $component }>` ta obsoletu ya inórase porque tamién se conseñó `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] L'atributu `{ $attribute }` en `<{ $component }>` ta obsoletu ya inórase.

deprecated-attribute-to-child = [deprecation] L'atributu `{ $attribute }` en `<{ $component }>` ta obsoletu; usa un fíu `<{ $child }>` nel so llugar.

deprecated-attribute-value-renamed = [deprecation] El valor `{ $value }` del atributu `{ $attribute }` en `<{ $component }>` ta obsoletu; usa `{ $to }` nel so llugar.


## Language coverage

pluralize-english-only = `<pluralize>` namás pue poner en plural l'inglés, asina que'l so testu queda ensin camudar nun documentu escritu en { $locale }. Escribi la forma plural direutamente, o conséñala col atributu `pluralForm`.


## Checking against the schema

schema-element-unrecognized = L'elementu `<{ $tag }>` nun ye un elementu Doenet reconocíu.

schema-element-not-allowed-at-root = L'elementu `<{ $tag }>` nun se permite na raíz del documentu.

schema-element-not-allowed-inside = L'elementu `<{ $tag }>` nun se permite dientro de `<{ $parent }>`.

schema-attribute-unrecognized = L'elementu `<{ $tag }>` nun tien dengún atributu nomáu `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] L'atributu `{ $attribute }` del elementu `<{ $tag }>` tien de ser una llista onde cada elementu seya unu d'estos: { $allowed }
       *[other] L'atributu `{ $attribute }` del elementu `<{ $tag }>` tien de ser unu d'estos: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nome de variante inválidu pa select. El nome de variante { $variantName } apaez en { $numOptions } opciones pero'l númberu a escoyer ye { $numToSelect }.

select-variant-name-without-options = Conseñáronse delles variantes pa select pero nun se conseñó denguna opción pal nome de variante posible: { $variantName }.

select-variant-name-not-possible = El nome de variante { $variantName } conseñáu pa select nun ye un nome de variante posible.

select-too-few-options = Nun se puen escoyer { $numToSelect } componentes de namás { $numOptions }.

select-from-sequence-too-few-values = Nun se puen escoyer { $numToSelect } valores d'una secuencia de llonxitú { $length }.

select-from-sequence-indices-count-mismatch = El númberu d'índices conseñaos pa select tien de concasar col númberu a escoyer

select-from-sequence-indices-not-integers = Tolos índices conseñaos pa select tienen de ser enteros

select-from-sequence-index-excluded = Un índiz conseñáu de selectfromsequence taba escluyíu

select-from-sequence-indices-excluded-combination = Los índices conseñaos de selectfromsequence yeren una combinación escluyida

select-from-sequence-coprime-not-positive-integers = Nun se puen escoyer combinaciones coprimes porque nun se tán escoyendo enteros positivos.

select-from-sequence-coprime-common-factor = Nun se puen escoyer númberos coprimos. Tolos valores posibles tienen un factor común. (Los valores conseñaos de "from" o "to" tienen de ser coprimos con "step".)

select-from-sequence-coprime-single-number = Nun se puen escoyer combinaciones coprimes d'un solu númberu que nun ye 1.

select-from-sequence-excluded-too-many-combinations = Escluyóse más del 70% de les combinaciones en selectFromSequence

select-from-sequence-coprime-none-found = Nun se pudieron escoyer númberos coprimos. Tolos valores posibles tienen un factor común.

select-from-sequence-too-few-unique-values = Nun se puen escoyer { $numToSelect } valores únicos d'una secuencia de llonxitú { $numPossibleValues }

select-prime-numbers-too-few-values = Nun se puen escoyer { $numToSelect } valores d'una llista de númberos primos de llonxitú { $numValues }

select-prime-numbers-values-count-mismatch = El númberu de valores conseñaos pa select tien de concasar col númberu a escoyer

select-prime-numbers-values-not-prime = Tolos valores conseñaos pa escoyer númberos primos tienen de tar na llista de númberos primos

select-prime-numbers-values-excluded-combination = Los valores conseñaos de selectPrimeNumbers yeren una combinación escluyida

select-prime-numbers-excluded-too-many-combinations = Escluyóse más del 70% de les combinaciones en selectPrimeNumbers

select-random-combination-fluke = Por una casualidá perimprobable, nun se pudo escoyer denguna combinación de valores al debalu

select-random-value-fluke = Por una casualidá perimprobable, nun se pudo escoyer dengún valor al debalu

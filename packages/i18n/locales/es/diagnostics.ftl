# Advertencias y errores mostrados a quien lee o escribe el documento.
# Seleccionados por `uiLocale`.
#
# Los nombres de atributos y componentes de DoenetML (`through`, `endpoint`,
# `numDimensions`, …) forman parte del lenguaje y se dejan en inglés.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } se ignora cuando se especifican los dos extremos
       *[other] { $attributes } se ignoran cuando se especifican los dos extremos
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } se ignora cuando se especifican un extremo y el punto medio
       *[other] { $attributes } se ignoran cuando se especifican un extremo y el punto medio
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset no tiene efecto sin un punto medio

## `<line>`

# «Recta», no «línea», aunque `noun.line` en content.ftl diga «línea»: no es
# una incoherencia, sino la diferencia entre describir el trazo dibujado («una
# línea azul gruesa») y hablar del objeto geométrico, que en matemáticas es
# una recta —de ahí «la ecuación de la recta».

line-points-undetermined-dimensions = La recta pasa por puntos de dimensiones indeterminadas.

line-points-too-few-dimensions = La recta debe pasar por puntos de al menos dos dimensiones.

line-points-depend-on-variables = La recta pasa por puntos que dependen de las variables: { $variables }.

# Enumeradas con coma en vez de «y»: las variables de <line> son `x` e `y` por
# omisión, y «en las variables x y y» sería a la vez incorrecto (ante el sonido
# /i/ la conjunción es «e») e ilegible. La coma es correcta sea cual sea el
# nombre de la variable, que aquí no se conoce de antemano.
line-equation-invalid-format = Formato no válido para la ecuación de la recta en las variables { $variable1 }, { $variable2 }.

## `<ray>`

ray-overprescribed-through = La semirrecta está determinada por through, endpoint y direction. Se ignora el through especificado.

ray-dimension-mismatch = Discrepancia de numDimensions en la semirrecta.

## `<vector>`

vector-overprescribed-head = El vector está determinado por head, tail y displacement. Se ignora el head especificado.

vector-dimension-mismatch = Discrepancia de numDimensions en el vector.

## Atraer y restringir

attract-to-without-nearest-point = No se puede atraer a un `<{ $component }>` porque no tiene la variable de estado nearestPoint.

constrain-to-without-nearest-point = No se puede restringir a un `<{ $component }>` porque no tiene la variable de estado nearestPoint.

constrain-to-interior-without-nearest-point = No se puede restringir al interior de un `<{ $component }>` porque no tiene la variable de estado nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition se ignora en un choiceInput que no es inline

## Ordenar hijos por índice

choice-input-indices-count-mismatch = Se ignoran los índices especificados para choiceInput porque su cantidad no coincide con la cantidad de hijos choice.

pretzel-indices-count-mismatch = Se ignoran los índices especificados para problem porque su cantidad no coincide con la cantidad de hijos problem.

shuffle-indices-count-mismatch = Se ignoran los índices especificados para shuffle porque su cantidad no coincide con la cantidad de componentes.

indices-ignored-out-of-range = Se ignoran los índices especificados para { $component } porque algunos están fuera de rango.

pretzel-indices-repeated = Se ignoran los índices especificados para pretzel porque algunos están repetidos.

pretzel-circuit-first-index = Se ignoran los índices especificados para pretzel en modo circuit porque el primer índice debe ser 1.

## `<shuffle>` y `<sort>`

string-children-need-type = Para que `<{ $component }>` funcione con hijos de texto, se debe especificar el atributo `type`.

invalid-type-defaulting-to-math = Tipo no válido { $type } para el componente { $component }. Debe ser math, text, number o boolean. Se usa math.

string-not-valid-component-to-arrange = La cadena "{ $value }" no es un componente válido para { $component }. Se ignora.

## Tipos y variables

invalid-type-defaulting-to-number = Tipo no válido { $type }, se establece el tipo en number.

invalid-variable-value = Valor no válido de una variable: `{ $value }`

## Variantes

variant-index-must-be-number = El índice de variante { $index } debe ser un número

variant-index-must-be-integer = El índice de variante { $index } debe ser un número entero

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` no está implementado para medidas absolutas. Los anchos se establecen como relativos.

side-by-side-absolute-margins = `<{ $component }>` no está implementado para medidas absolutas. Los márgenes se establecen como relativos.

side-by-side-no-block-child = `<{ $component }>` no es válido: debe tener al menos un hijo de bloque.

## `<label>`

label-for-ignored-on-graphical = Se ignora el atributo `for` en un `<label>` gráfico.

label-for-must-resolve-to-one = El atributo `for` de `<label>` debe corresponder exactamente a un componente.

label-for-unresolved = No se pudo resolver el atributo `for` de `<label>` a un componente.

label-for-answer-with-authored-inputs = El atributo `for` de `<label>` hace referencia a un `<answer>` con entradas escritas explícitamente; haz referencia a la entrada directamente.

label-for-answer-without-input = El atributo `for` de `<label>` hace referencia a un `<answer>` que no tiene ninguna entrada que etiquetar.

label-for-must-reference-input-or-answer = El atributo `for` de `<label>` debe hacer referencia a una entrada o a un `<answer>`.

## Accesibilidad

accessibility-short-description-or-decorative = Por accesibilidad, `<{ $component }>` debe tener una descripción breve o estar marcado como decorativo.

accessibility-video-short-description = Por accesibilidad, `<video>` debe tener una descripción breve.

accessibility-input-short-description-or-label = Por accesibilidad, `<{ $component }>` debe tener una descripción breve o una etiqueta.

accessibility-answer-input-short-description-or-label = Por accesibilidad, la entrada creada por un `<answer>` debe tener una descripción breve o una etiqueta.

accessibility-short-description-contains-math = Las descripciones breves no deben contener componentes matemáticos como `<{ $component }>`. Expresa las matemáticas con palabras.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } no tiene suficiente contraste con el texto del encabezado de sección (modo oscuro) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; se requiere al menos { $threshold }:1).
       *[other] { $colorName } no tiene suficiente contraste con el texto del encabezado de sección ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; se requiere al menos { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = No está implementado un `<circle>` que pase por { $count } puntos cuando los puntos no tienen valores numéricos.

circle-too-many-through-points = No se puede calcular una circunferencia que pase por más de 3 puntos.

circle-overprescribed-radius-center-points = No se puede calcular una circunferencia con radio, centro y puntos de paso especificados a la vez.

circle-center-with-multiple-points = No se puede calcular una circunferencia con centro especificado que pase por más de 1 punto.

circle-radius-too-small = No se puede calcular la circunferencia: dado que la distancia entre los dos puntos es { $distance }, el radio especificado { $radius } es demasiado pequeño.

circle-radius-with-many-points = No se puede crear una circunferencia que pase por más de dos puntos con un radio especificado.

circle-invalid-center-or-through-points = El centro o los puntos de paso de la circunferencia no son válidos.

circle-radius-center-with-multiple-points = No se puede calcular el radio de una circunferencia con centro especificado que pase por más de 1 punto.

circle-change-radius-non-numerical = No se puede cambiar el radio de una circunferencia con puntos de paso no numéricos

circle-radius-with-points-non-numerical = No se puede crear una circunferencia que pase por más de un punto con un radio especificado cuando no hay valores numéricos.

circle-change-center-non-numerical = No está implementado cambiar el centro de una circunferencia que pasa por puntos con valores no numéricos.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Dimensiones insuficientes para el dominio de la función. El dominio tiene { $intervals } intervalo pero la función tiene { $inputs ->
            [one] { $inputs } entrada
           *[other] { $inputs } entradas
        }.
       *[other] Dimensiones insuficientes para el dominio de la función. El dominio tiene { $intervals } intervalos pero la función tiene { $inputs ->
            [one] { $inputs } entrada
           *[other] { $inputs } entradas
        }.
    }

function-domain-invalid-format = Formato no válido para el dominio de la función.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Se ignora el máximo no numérico de la función.
        [minimum] Se ignora el mínimo no numérico de la función.
        [extremum] Se ignora el extremo no numérico de la función.
        [point] Se ignora el punto no numérico de la función.
        [slope] Se ignora la pendiente no numérica de la función.
       *[other] Se ignora { $type } no numérico de la función.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Se ignora el máximo vacío de la función.
        [minimum] Se ignora el mínimo vacío de la función.
        [extremum] Se ignora el extremo vacío de la función.
        [point] Se ignora el punto vacío de la función.
       *[other] Se ignora { $type } vacío de la función.
    }

function-points-too-close = La función contiene dos puntos demasiado próximos entre sí. No se puede definir la función.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Las iteraciones de una función solo son posibles si el número de entradas es igual al número de salidas. Esta función tiene { $inputs } entrada y { $outputs ->
            [one] { $outputs } salida
           *[other] { $outputs } salidas
        }.
       *[other] Las iteraciones de una función solo son posibles si el número de entradas es igual al número de salidas. Esta función tiene { $inputs } entradas y { $outputs ->
            [one] { $outputs } salida
           *[other] { $outputs } salidas
        }.
    }

## `<sequence>`

sequence-invalid-length = Longitud de la secuencia no válida. Debe ser un entero no negativo.

sequence-invalid-step = Paso de la secuencia no válido. Debe ser un número para una secuencia de tipo { $type }.

sequence-invalid-endpoint-number = El valor de "{ $attribute }" de la secuencia numérica no es válido. Debe ser un número.

sequence-invalid-endpoint-letters = El valor de "{ $attribute }" de la secuencia de letras no es válido. Debe ser una combinación de letras.

sequence-invalid-endpoint = El valor de "{ $attribute }" de la secuencia no es válido.

select-from-sequence-coprime-not-numbers = Se ignora coprime porque no se están seleccionando números

select-from-sequence-coprime-with-exclude-combinations = Se ignora coprime porque se especificó excludeCombinations

## Resolución de `target`

target-not-found = Destino no válido para `<{ $source }>`: no se encuentra el destino.

target-state-variable-not-found = Destino no válido para `<{ $source }>`: no se encuentra una variable de estado llamada "{ $property }" en un `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Las variables de `<odeSystem>` deben ser distintas de la variable independiente.

ode-system-duplicate-variable-names = No se pueden definir las funciones del lado derecho de la EDO con nombres de variables dependientes repetidos.

ode-system-rhs-function-error = No se puede definir la función del lado derecho de la EDO. Error al crear la función de mathjs.

## `<angle>`, `<parabola>` e `<intersection>`

angle-too-many-lines = No se puede definir un ángulo entre { $count } rectas

angle-invalid-through-point = Punto no válido en through de `<angle>`

parabola-vertex-too-many-points = No está implementada una parábola con vértice que pase por más de 1 punto.

parabola-too-many-points = No está implementada una parábola que pase por más de 3 puntos.

intersection-too-many-items = No está implementada la intersección de más de dos objetos

## Otros componentes matemáticos

ionic-compound-not-two-ions = No está implementado el compuesto iónico para algo distinto de dos iones.

ionic-compound-needs-cation-and-anion = El compuesto iónico solo está implementado para un catión y un anión.

solve-equations-cannot-evaluate = No se puede resolver la ecuación porque no se pudo evaluar: { $equation }

math-operators-operand-number-required = Se debe especificar operandNumber al extraer un operando matemático.

eigen-decomposition-failed = No se pudieron calcular los valores propios de la matriz

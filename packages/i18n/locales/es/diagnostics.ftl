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

## Renderizador PreFigure

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" no es compatible con el renderizador prefigure; se usa el comportamiento de posición derecha.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" no es compatible con el renderizador prefigure; se usa el comportamiento de posición superior.

prefigure-invalid-axis-bounds = `<graph>`: los límites de los ejes no son válidos para la conversión a prefigure; se usa el bbox predeterminado (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: el ancho no es válido para la conversión a prefigure; se usa el ancho de diagrama predeterminado 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio no es válido para la conversión a prefigure; se usa la relación de aspecto predeterminada 1.

prefigure-annotations-not-rendered = `<graph>`: las anotaciones no se representan si no se usa el renderizador PreFigure.

multiple-annotations-children = Se encontraron varios hijos `<annotations>` en `<graph>`; se ignoran todos menos el último.

## Referencias a otros componentes

copy-unrecognized-component-type = No se puede extender ni copiar un tipo de componente desconocido: { $type }.

copy-prop-not-found = No se encontró la propiedad { $property } en un componente de tipo { $component }

collect-no-source = No se encontró ninguna fuente para collect.

collect-invalid-component-type = No se pueden recolectar componentes de tipo `<{ $component }>` porque no es un tipo de componente válido.

reference-index-unavailable = No se puede referenciar el índice `{ $reference }`

## `<callAction>`

component-action-unavailable = No se puede llamar a { $action } en el componente `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Los datos tienen una forma no válida.  Las filas tienen longitudes distintas. Encontrado en componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Los datos tienen nombres de columna repetidos.  Encontrado en componentIdx :{ $componentIdx }

data-frame-missing-column-name = A los datos les falta el nombre de una columna.  Encontrado en componentIdx :{ $componentIdx }

## `<answer>` y puntuación

answer-award-depends-on-own-response = Un award de esta respuesta depende de la respuesta enviada por el propio answer, lo que provocará un comportamiento inesperado.

answer-max-num-attempts-in-section-wide-check-work = Establecer `maxNumAttempts` en un `<answer>` dentro de un contenedor con `sectionWideCheckWork` no tiene efecto, porque el número de intentos lo controla el contenedor. Establece `maxNumAttempts` en el contenedor.

nested-section-wide-check-work-max-num-attempts = Establecer `maxNumAttempts` en un contenedor con `sectionWideCheckWork` que está dentro de otro contenedor con `sectionWideCheckWork` no tiene efecto, porque el número de intentos lo controla el contenedor exterior. Establece `maxNumAttempts` en el contenedor exterior.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] El atributo { $attributes } no tendrá efecto si no se establece symbolicEquality.
       *[other] Los atributos { $attributes } no tendrán efecto si no se establece symbolicEquality.
    }

answer-invalid-type = Tipo no válido para answer: { $type }

## `<module>`, `<conditionalContent>`, `<slider>` y pretzel

module-attribute-child-needs-name = Como el componente `<{ $component }>` no tiene nombre, no se puede usar como atributo de módulo

module-attribute-name-already-defined = El componente `<{ $component } name="{ $name }">` no se puede usar como atributo de un módulo porque el tipo de componente `<module>` ya tiene definido un atributo "{ $name }".

conditional-content-condition-ignored = Se ignora el atributo `condition` en un `<conditionalContent>` que tiene hijos case o else.

slider-markers-type-mismatch = El tipo de los marcadores no coincide con el tipo del slider.

pretzel-problem-needs-statement-and-answer = Pretzel no válido: cada `<problem>` debe contener un `<statement>` y un `<answer>`.

pretzel-circuit-first-problem-distractor = Pretzel no válido: en mode="circuit", el primer `<problem>` no puede ser un distractor.

## Valores de atributos

attribute-invalid-values =
    { $valuesCount ->
        [one] Valor no válido { $values } para el atributo `{ $attribute }`; se ignora.
       *[other] Valores no válidos { $values } para el atributo `{ $attribute }`; se ignoran.
    }

attribute-must-be-references = Valor no válido `{ $value }` para el atributo `{ $attribute }`. El atributo debe estar compuesto de referencias que empiecen por `$`.

math-input-invalid-function-names = <mathInput>: se ignoran nombres de función no válidos en { $attribute }: { $names }. El segmento visible de cada nombre debe tener al menos 2 caracteres (letras o guiones); puede añadirse un sufijo opcional `|<alternativa de mathspeak>`.

## Construcción de componentes a partir del código fuente

component-type-invalid = Tipo de componente no válido: `<{ $componentType }>`

attribute-repeated = No se puede repetir el atributo { $attribute }.

attribute-invalid-for-component = Atributo "{ $attribute }" no válido para un componente de tipo `<{ $componentType }>`.

## Contraste de las definiciones de estilo

style-definition-insufficient-contrast =
    La definición de estilo { $styleNumber } no tiene suficiente contraste para { $context ->
        [text-on-background] el color del texto sobre el color de fondo
        [high-contrast] el color de alto contraste sobre el lienzo
        [line] el color de las líneas sobre el lienzo
        [marker] el color de los marcadores sobre el lienzo
       *[text-on-canvas] el color del texto sobre el lienzo
    }{ $mode ->
        [dark] { " (modo oscuro)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; se requiere al menos { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Aunque la definición de estilo { $styleNumber } especifica colores con suficiente contraste en modo claro, los colores de modo oscuro derivados de esos valores no tienen suficiente contraste entre el color del texto y el color de fondo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; se requiere al menos { $threshold }:1). { $suggestion ->
        [available] Para lograr suficiente contraste en modo oscuro, aumenta el contraste en modo claro (por ejemplo, con { $lightAttribute }="{ $lightColor }") o define el color de modo oscuro (por ejemplo, con { $darkAttribute }="{ $darkColor }").
       *[none] Para lograr suficiente contraste en modo oscuro, aumenta el contraste en modo claro o sustituye los colores derivados mediante textColorDarkMode o backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Aunque la definición de estilo { $styleNumber } especifica un color de texto con suficiente contraste en modo claro, el color de texto de modo oscuro derivado de ese valor no tiene suficiente contraste sobre el lienzo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; se requiere al menos { $threshold }:1). { $suggestion ->
        [available] Para lograr suficiente contraste en modo oscuro, aumenta el contraste en modo claro (por ejemplo, con textColor="{ $lightColor }") o define el color de modo oscuro (por ejemplo, con textColorDarkMode="{ $darkColor }").
       *[none] Para lograr suficiente contraste en modo oscuro, aumenta el contraste en modo claro o sustituye el color derivado mediante textColorDarkMode.
    }

section-multiple-style-palettes = Una sección solo puede seleccionar un <stylePalette>; se usará el último.

## Variantes únicas

variant-num-to-select-not-non-negative-integer = no se pueden determinar las variantes únicas de { $component } porque numToSelect no es un entero no negativo.

variant-num-to-select-not-constant-number = no se pueden determinar las variantes únicas de { $component } porque numToSelect no es un número constante.

variant-with-replacement-not-constant-boolean = no se pueden determinar las variantes únicas de { $component } porque withReplacement no es un booleano constante.

variant-select-weight-disables-unique = Las variantes únicas quedan desactivadas en select si alguna opción especifica selectWeight o selectForVariants

variant-coprime-undetermined = no se pueden determinar las variantes únicas de { $component } porque no se puede determinar si coprime es siempre falso.

variant-attribute-not-constant = no se pueden determinar las variantes únicas de { $component } porque { $attribute } no es constante.

variant-attribute-not-number = no se pueden determinar las variantes únicas de { $component } porque { $attribute } no es un número.

variant-attribute-wrong-type-for-sequence =
    no se pueden determinar las variantes únicas de { $component } de tipo { $type } porque { $attribute } no es { $expected ->
        [letters-combination] una combinación de letras
        [math-expression] una expresión matemática válida
        [integer] un entero
       *[number] un número
    }.

variant-length-not-integer = no se pueden determinar las variantes únicas de { $component } porque length no es un entero.

variant-sort-not-implemented = no se han implementado las variantes únicas de un { $component } con sort

variant-exclude-combinations-not-implemented = no se han implementado las variantes únicas de un { $component } con excludeCombinations

variant-math-exclude-not-implemented = no se han implementado las variantes únicas de un { $component } de tipo math con exclude

variant-non-constant-exclude-not-implemented = no se han implementado las variantes únicas de un { $component } con exclude no constante

## Conversión a PreFigure

prefigure-descendant-unsupported = { $subject }: no se admite en el renderizador prefigure de gráficos; se omite el descendiente.

prefigure-descendant-invalid-geometry = { $subject }: geometría no finita o incompleta; se omite el descendiente.

prefigure-curve-label-omitted = { $subject }: las etiquetas no se admiten en los elementos de curva convertidos; se omite la etiqueta.

prefigure-curve-unsupported-definition-type = { $subject }: tipo de definición de función de curva no admitido '{ $definitionType }'; se omite el descendiente.

prefigure-region-flip-functions-unsupported = { $subject }: atributo flipFunctions no admitido en regionBetweenCurves; se omite el descendiente.

prefigure-region-non-formula-child = { $subject }: en regionBetweenCurves solo se admiten funciones hijas de tipo fórmula; se omite el descendiente.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' no admitido para { $labelKind ->
        [line-family] una etiqueta de la familia de líneas
       *[point] una etiqueta de punto
    }; se usa la alineación predeterminada de PreFigure.

prefigure-fill-style-unsupported = { $subject }: PreFigure no admite el estilo de relleno '{ $fillStyle }'; se usa un relleno sólido.

prefigure-line-style-unknown = { $subject }: estilo de línea desconocido '{ $lineStyle }'; se omite de la salida de PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: el estilo de marcador '{ $markerStyle }' se asigna al estilo 'diamond' de PreFigure.

prefigure-marker-style-unsupported = { $subject }: PreFigure no admite el estilo de marcador '{ $markerStyle }'; se usa el estilo predeterminado.

## Anotaciones de PreFigure

annotation-ref-unresolvable = `<annotation>`: `ref` no válido; no se puede resolver el destino. Se omite la anotación.

annotation-ref-multiple-targets = `<annotation>`: `ref` se resolvió a varios destinos; se usa el primero.

annotation-ref-outside-graph = `<annotation>`: `ref` no válido; el destino está fuera del gráfico que lo contiene. Se omite la anotación.

annotation-ref-unsupported-target = `<annotation>`: `ref` no válido; el destino no es un objeto gráfico admitido en la conversión a prefigure. Se omite la anotación.

annotation-text-missing = `<annotation>`: falta `text` o está vacío; se emite texto vacío.

## Composites y referencias

composite-circular-dependency =
    { $componentType ->
        [none] Se detectó una dependencia circular.
       *[other] Se detectó una dependencia circular en la que participa un componente `<{ $componentType }>`.
    }

reference-no-referent = No se encontró ningún referente para la referencia: `{ $reference }`

reference-multiple-referents = Se encontraron varios referentes para la referencia: `{ $reference }`

## Hijos que no coinciden

children-invalid-attribute-format = Formato no válido para el atributo { $attribute } de `<{ $componentType }>`.

children-invalid = Hijos no válidos para `<{ $componentType }>`: se encontraron hijos no válidos: { $children }

## Se recurre a un valor predeterminado

attribute-value-invalid-using-default = Valor no válido `{ $value }` para el atributo `{ $attribute }`; se usa el valor `{ $default }`

## Carga de una versión de DoenetML

doenetml-version-not-found =
    { $fallback ->
        [none] No se encontró la versión { $version } de DoenetML.
       *[other] No se encontró la versión { $version } de DoenetML. Se recurrirá a la versión { $fallback }
    }

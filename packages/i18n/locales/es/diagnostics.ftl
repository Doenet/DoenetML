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

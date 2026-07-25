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

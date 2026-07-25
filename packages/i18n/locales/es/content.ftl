# Spanish content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# Spanish inflects. Adjectives follow their noun and agree with it in gender,
# so every adjective below selects on `$gender`, the gender of the noun it
# describes, and the composition messages put the noun first. Neither is
# expressible by substituting into the English word order, which is why the
# catalog controls the order and not the code.


## Vocabulario de estilos

color =
    .black =
        { $gender ->
            [f] negra
           *[m] negro
        }
    .white =
        { $gender ->
            [f] blanca
           *[m] blanco
        }
    .gray = gris
    .red =
        { $gender ->
            [f] roja
           *[m] rojo
        }
    .orange = naranja
    .yellow =
        { $gender ->
            [f] amarilla
           *[m] amarillo
        }
    .green = verde
    .cyan = cian
    .blue = azul
    .purple =
        { $gender ->
            [f] morada
           *[m] morado
        }
    .pink = rosa
    .brown = marrón

line-width =
    .thick =
        { $gender ->
            [f] gruesa
           *[m] grueso
        }
    .thin =
        { $gender ->
            [f] delgada
           *[m] delgado
        }

line-style =
    .dashed =
        { $gender ->
            [f] discontinua
           *[m] discontinuo
        }
    .dotted =
        { $gender ->
            [f] punteada
           *[m] punteado
        }

# Sintagmas nominales: van detrás de «con» y no concuerdan con nada.
fill-style =
    .horizontal = líneas horizontales
    .vertical = líneas verticales
    .diagonal = líneas diagonales
    .backdiagonal = líneas diagonales inversas
    .dots = puntos
    .diamonds = rombos

noun =
    .line = línea
    .line-segment = segmento
    .ray = semirrecta
    .vector = vector
    .curve = curva
    .function = función
    .parabola = parábola
    .polyline = polilínea
    .polygon = polígono
    .triangle = triángulo
    .rectangle = rectángulo
    .circle = círculo
    .region = región
    .point = punto
    .square = cuadrado
    .diamond = rombo
    .cross = cruz
    .plus = signo más

noun-regular-polygon = polígono regular de { $numSides } lados

# Además de los nombres de arriba, `$noun` puede ser el núcleo de un sintagma
# que no se nombra en la descripción: «border», «fill», «text» y «background».
noun-gender =
    { $noun ->
        [line] f
        [ray] f
        [curve] f
        [function] f
        [parabola] f
        [polyline] f
        [region] f
        [cross] f
       *[other] m
    }


## Composición de estilos

style-stroke =
    { $parts ->
        [width-style-color] { $lineStyle } { $width } { $color }
        [width-color] { $width } { $color }
        [style-color] { $lineStyle } { $color }
        [width-style] { $lineStyle } { $width }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }

# El nombre va delante y los adjetivos detrás: «línea discontinua gruesa roja».
style-with-noun = { $noun } { $description }

style-filled-word =
    { $gender ->
        [f] rellena
       *[m] relleno
    }

style-filled =
    { $parts ->
        [pattern] { $color } { $filled } con { $pattern }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $color } { $filled } con { $pattern }
       *[plain] { $noun } { $color } { $filled }
    }

# «borde» es masculino, así que los adjetivos del borde concuerdan con él y no
# con la figura que rodea.
style-border-clause =
    { $parts ->
        [with-article] con un borde { $border }
        [and] y borde { $border }
        [and-article] y un borde { $border }
       *[with] con borde { $border }
    }

# «de color» evita tener que concordar el color con un patrón en plural.
style-fill =
    { $parts ->
        [pattern] { $pattern } de color { $color }
       *[plain] { $color }
    }

style-unfilled = sin relleno

style-text =
    { $parts ->
        [background] { $color } con un fondo { $background }
       *[plain] { $color }
    }

style-background-none = ninguno

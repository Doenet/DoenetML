# Spanish content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Spanish inflects. Adjectives follow their noun and agree with it in gender,
# so every adjective below selects on `$gender`, the gender of the noun it
# describes, and the composition messages put the noun first. Neither is
# expressible by substituting into the English word order, which is why the
# catalog controls the order and not the code.


## Style vocabulary

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
# Noun phrases: they follow «con» and agree with nothing.
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
# The noun splits: «polígono regular» takes the adjectives and «de 5 lados»
# closes the phrase behind them. Were the complement to come first, the
# adjectives would be stranded away from the noun they agree with («polígono
# regular de 5 lados grueso rojo»).
noun-regular-polygon =
    { $part ->
        [tail] de { $numSides } lados
       *[head] polígono regular
    }
# Besides the nouns above, `$noun` can be `regular-polygon` (the noun
# `noun-regular-polygon` composes) or the head of a phrase the description
# never names: `border`, `fill`, `text`, `background`. All of those are
# masculine in Spanish — polígono, borde, relleno, texto, fondo — so they fall
# to the default case.
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

## Style composition

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
# The noun comes first and the adjectives after it: «línea discontinua gruesa
# roja». The noun's complement, where there is one, closes the phrase:
# «polígono regular grueso rojo de 5 lados».
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
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
# Here the complement sits against the noun rather than at the end, as it does
# in `style-with-noun`: «relleno de …» reads as «lleno de …», so «relleno de 5
# lados» would say something else. «Polígono regular de 5 lados azul relleno».
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $color } { $filled } con { $pattern }
        [plain-tail] { $noun } { $nounTail } { $color } { $filled }
        [pattern-tail] { $noun } { $nounTail } { $color } { $filled } con { $pattern }
       *[plain] { $noun } { $color } { $filled }
    }
# «borde» is masculine, so the border's adjectives agree with it rather than
# with the shape it surrounds.
style-border-clause =
    { $parts ->
        [with-article] con un borde { $border }
        [and] y borde { $border }
        [and-article] y un borde { $border }
       *[with] con borde { $border }
    }
# «de color» avoids having to agree the color with a plural pattern.
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

## Boolean words
##
## `true` and `false` are still DoenetML syntax and are not translated; only
## the word the reader sees is translated here.

boolean-true = verdadero
boolean-false = falso

## Answer buttons

answer-submit-label = Revisar
answer-submit-label-no-correctness = Enviar respuesta

## Sectional blocks

section-name =
    .activity = Actividad
    .aside = Nota al margen
    .cascade = Cascada
    .definition = Definición
    .example = Ejemplo
    .exercise = Ejercicio
    .exercises = Ejercicios
    .given-answer = Respuesta
    .note = Nota
    .objectives = Objetivos
    .paragraphs = Párrafos
    .part = Parte
    .problem = Problema
    .problems = Problemas
    .proof = Demostración
    .question = Pregunta
    .section = Sección
    .solution = Solución
    .task = Tarea
    .theorem = Teorema
# Spanish separates the title with a period after a bare number, as English
# does, and with a colon when the word leads.
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Pista

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabla { $enumeration }
        [numbered-title] Tabla { $enumeration }{ ": " }
        [unnumbered-title] Tabla{ ": " }
       *[unnumbered] Tabla
    }
figure-name =
    { $parts ->
        [numbered] Figura { $enumeration }
        [numbered-caption] Figura { $enumeration }{ ": " }
        [unnumbered-caption] Figura{ ": " }
       *[unnumbered] Figura
    }

## Paginator controls

paginator-previous = Anterior
paginator-next = Siguiente
paginator-page = Página
paginator-page-status = { $pageLabel } { $currentPage } de { $numPages }

## Piecewise functions

piecewise-condition-or = o
piecewise-condition-if = si
piecewise-condition-otherwise = en otro caso

## Chemistry
##
## Symbols, formulas, and anything an `<award>` compares against are not
## translated; only the words a reader sees are here.

element-name =
    .h = Hidrógeno
    .he = Helio
    .li = Litio
    .be = Berilio
    .b = Boro
    .c = Carbono
    .n = Nitrógeno
    .o = Oxígeno
    .f = Flúor
    .ne = Neón
    .na = Sodio
    .mg = Magnesio
    .al = Aluminio
    .si = Silicio
    .p = Fósforo
    .s = Azufre
    .cl = Cloro
    .ar = Argón
    .k = Potasio
    .ca = Calcio
    .sc = Escandio
    .ti = Titanio
    .v = Vanadio
    .cr = Cromo
    .mn = Manganeso
    .fe = Hierro
    .co = Cobalto
    .ni = Níquel
    .cu = Cobre
    .zn = Zinc
    .ga = Galio
    .ge = Germanio
    .as = Arsénico
    .se = Selenio
    .br = Bromo
    .kr = Kriptón
    .rb = Rubidio
    .sr = Estroncio
    .y = Itrio
    .zr = Circonio
    .nb = Niobio
    .mo = Molibdeno
    .tc = Tecnecio
    .ru = Rutenio
    .rh = Rodio
    .pd = Paladio
    .ag = Plata
    .cd = Cadmio
    .in = Indio
    .sn = Estaño
    .sb = Antimonio
    .te = Telurio
    .i = Yodo
    .xe = Xenón
    .cs = Cesio
    .ba = Bario
    .la = Lantano
    .ce = Cerio
    .pr = Praseodimio
    .nd = Neodimio
    .pm = Prometio
    .sm = Samario
    .eu = Europio
    .gd = Gadolinio
    .tb = Terbio
    .dy = Disprosio
    .ho = Holmio
    .er = Erbio
    .tm = Tulio
    .yb = Iterbio
    .lu = Lutecio
    .hf = Hafnio
    .ta = Tantalio
    .w = Wolframio
    .re = Renio
    .os = Osmio
    .ir = Iridio
    .pt = Platino
    .au = Oro
    .hg = Mercurio
    .tl = Talio
    .pb = Plomo
    .bi = Bismuto
    .po = Polonio
    .at = Astato
    .rn = Radón
    .fr = Francio
    .ra = Radio
    .ac = Actinio
    .th = Torio
    .pa = Protactinio
    .u = Uranio
    .np = Neptunio
    .pu = Plutonio
    .am = Americio
    .cm = Curio
    .bk = Berkelio
    .cf = Californio
    .es = Einsteinio
    .fm = Fermio
    .md = Mendelevio
    .no = Nobelio
    .lr = Lawrencio
    .rf = Rutherfordio
    .db = Dubnio
    .sg = Seaborgio
    .bh = Bohrio
    .hs = Hasio
    .mt = Meitnerio
    .ds = Darmstadtio
    .rg = Roentgenio
    .cn = Copernicio
    .nh = Nihonio
    .fl = Flerovio
    .mc = Moscovio
    .lv = Livermorio
    .ts = Teneso
    .og = Oganesón
element-anion-name =
    .h = Hidruro
    .c = Carburo
    .n = Nitruro
    .o = Óxido
    .f = Fluoruro
    .p = Fosfuro
    .s = Sulfuro
    .cl = Cloruro
    .br = Bromuro
    .i = Yoduro
    .at = Astaturo
    .ts = Tenesuro
ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Símbolo químico no válido
chemistry-invalid-ionic-compound = Compuesto iónico no válido

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

# El nombre se parte: «polígono regular» lleva los adjetivos y «de 5 lados»
# cierra el sintagma detrás de ellos. Si el complemento fuera delante, los
# adjetivos quedarían separados del nombre con el que concuerdan («polígono
# regular de 5 lados grueso rojo»).
noun-regular-polygon =
    { $part ->
        [tail] de { $numSides } lados
       *[head] polígono regular
    }

# Además de los nombres de arriba, `$noun` puede ser «regular-polygon» (el
# nombre que compone `noun-regular-polygon`) o el núcleo de un sintagma que no
# se nombra en la descripción: «border», «fill», «text» y «background». Todos
# ellos son masculinos en español —polígono, borde, relleno, texto, fondo—, así
# que caen en el caso por defecto.
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
# El complemento del nombre, si lo hay, cierra el sintagma: «polígono regular
# grueso rojo de 5 lados».
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

# Aquí el complemento va pegado al nombre, y no al final como en
# `style-with-noun`: «relleno de …» se lee como «lleno de …», así que «relleno
# de 5 lados» diría otra cosa. «Polígono regular de 5 lados azul relleno».
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $color } { $filled } con { $pattern }
        [plain-tail] { $noun } { $nounTail } { $color } { $filled }
        [pattern-tail] { $noun } { $nounTail } { $color } { $filled } con { $pattern }
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


## Palabras booleanas
##
## `true` y `false` siguen siendo sintaxis de DoenetML y no se traducen; aquí
## solo se traduce la palabra que lee quien usa el documento.

boolean-true = verdadero
boolean-false = falso


## Botones de respuesta

answer-submit-label = Revisar
answer-submit-label-no-correctness = Enviar respuesta


## Bloques seccionales

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

# El español separa el título con un punto tras un número solo, igual que el
# inglés, y con dos puntos cuando la palabra encabeza.
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


## Tablas y figuras

table-name =
    { $parts ->
        [numbered] Tabla { $enumeration }
       *[unnumbered] Tabla
    }

figure-name =
    { $parts ->
        [numbered] Figura { $enumeration }
       *[unnumbered] Figura
    }


## Controles de paginación

paginator-previous = Anterior
paginator-next = Siguiente
paginator-page = Página

paginator-page-status = { $pageLabel } { $currentPage } de { $numPages }


## Funciones definidas a trozos

piecewise-condition-or = o
piecewise-condition-if = si
piecewise-condition-otherwise = en otro caso


## Química
##
## Los símbolos, las fórmulas y todo aquello con lo que un `<award>` compara no
## se traducen; aquí solo están las palabras que se leen.

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

periodic-group-name =
    .alkali-metal = Metal alcalino
    .alkaline-earth-metal = Metal alcalinotérreo
    .chalcogen = Calcógeno
    .halogen = Halógeno
    .noble-gas = Gas noble
    .rare-earth-metal = Metal de tierras raras
    .transition-metal = Metal de transición

chemistry-invalid-symbol = Símbolo químico no válido
chemistry-invalid-ionic-compound = Compuesto iónico no válido

# Galician content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Two genders and no case, so every describing word that inflects selects on
# `$gender` and nothing selects on `$role` — the shape `locales/es`,
# `locales/pt` and `locales/ca` already have. Adjectives follow their noun, so
# the composition messages are reordered from the English and the noun leads.
#
# «gris», «laranxa», «verde», «cian», «azul», «rosa» and «marrón» are
# invariable, so each is written once rather than as a select. That is Galician
# spelling and not an untranslated string.
#
# «cun» in the border and background clauses is «con» plus the article «un»,
# written as one word — so `with-article` differs from `with` by a letter,
# while `and-article` carries the article as the separate word «un».


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] negra
           *[m] negro
        }
    .white =
        { $gender ->
            [f] branca
           *[m] branco
        }
    .gray = gris
    .red =
        { $gender ->
            [f] vermella
           *[m] vermello
        }
    .orange = laranxa
    .yellow =
        { $gender ->
            [f] amarela
           *[m] amarelo
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
            [f] grosa
           *[m] groso
        }
    .thin =
        { $gender ->
            [f] fina
           *[m] fino
        }
line-style =
    .dashed =
        { $gender ->
            [f] descontinua
           *[m] descontinuo
        }
    .dotted =
        { $gender ->
            [f] punteada
           *[m] punteado
        }
# Noun phrases standing behind «con». They modify nothing and take no gender.
fill-style =
    .horizontal = liñas horizontais
    .vertical = liñas verticais
    .diagonal = liñas diagonais
    .backdiagonal = liñas diagonais inversas
    .dots = puntos
    .diamonds = rombos
noun =
    .line = liña
    .line-segment = segmento
    .ray = semirrecta
    .vector = vector
    .curve = curva
    .function = función
    .parabola = parábola
    .polyline = poligonal
    .polygon = polígono
    .triangle = triángulo
    .rectangle = rectángulo
    .circle = círculo
    .region = rexión
    .point = punto
    .square = cadrado
    .diamond = rombo
    .cross = cruz
    .plus = máis
# The side count follows the style adjectives so that they stay beside the noun
# they agree with.
noun-regular-polygon =
    { $part ->
        [tail] de { $numSides } lados
       *[head] polígono regular
    }
# Besides the nouns above, `$noun` can be `regular-polygon` (polígono, m) or
# the head of a phrase the description never names: `border` (bordo, m), `fill`
# (recheo, m), `text` (texto, m), `background` (fondo, m).
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

# The adjectives follow their noun, and the colour closes the run. The dash
# word comes ahead of the width word — «liña descontinua grosa vermella» —
# which is the order `locales/es` and `locales/pt` take and not the English
# one; `locales/ca` is the Romance catalog that keeps width first. Do not
# reorder these to match the English or Catalan.
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
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
style-filled-word =
    { $gender ->
        [f] chea
       *[m] cheo
    }
style-filled =
    { $parts ->
        [pattern] { $color } { $filled } con { $pattern }
       *[plain] { $color } { $filled }
    }
# The complement stays beside its own noun rather than at the end: «cheo de 5
# lados» would read as «full of 5 sides». «Polígono regular de 5 lados azul
# cheo».
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $color } { $filled } con { $pattern }
        [plain-tail] { $noun } { $nounTail } { $color } { $filled }
        [pattern-tail] { $noun } { $nounTail } { $color } { $filled } con { $pattern }
       *[plain] { $noun } { $color } { $filled }
    }
# «bordo» is masculine, so the border's adjectives agree with it and not with
# the shape it surrounds.
style-border-clause =
    { $parts ->
        [with-article] cun bordo { $border }
        [and] e bordo { $border }
        [and-article] e un bordo { $border }
       *[with] con bordo { $border }
    }
# Naming «recheo» keeps the colour agreeing with a masculine singular noun the
# catalog writes, instead of with the plural pattern word beside it: «recheo
# azul con rombos» rather than «rombos azuis».
style-fill =
    { $parts ->
        [pattern] recheo { $color } con { $pattern }
       *[plain] { $color }
    }
style-unfilled = sen recheo
style-text =
    { $parts ->
        [background] { $color } cun fondo { $background }
       *[plain] { $color }
    }
style-background-none = ningún

## Boolean words

boolean-true = verdadeiro
boolean-false = falso

## Answer buttons

answer-submit-label = Comprobar
answer-submit-label-no-correctness = Enviar a resposta

## Sectional blocks

section-name =
    .activity = Actividade
    .aside = Nota á marxe
    .cascade = Cascada
    .definition = Definición
    .example = Exemplo
    .exercise = Exercicio
    .exercises = Exercicios
    .given-answer = Resposta
    .note = Nota
    .objectives = Obxectivos
    .paragraphs = Parágrafos
    .part = Parte
    .problem = Problema
    .problems = Problemas
    .proof = Demostración
    .question = Pregunta
    .section = Sección
    .solution = Solución
    .task = Tarefa
    .theorem = Teorema
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
        [numbered] Táboa { $enumeration }
        [numbered-title] Táboa { $enumeration }{ ": " }
        [unnumbered-title] Táboa{ ": " }
       *[unnumbered] Táboa
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
paginator-next = Seguinte
paginator-page = Páxina
paginator-page-status = { $pageLabel } { $currentPage } de { $numPages }

## Piecewise functions

piecewise-condition-or = ou
piecewise-condition-if = se
piecewise-condition-otherwise = noutro caso

## Chemistry

element-name =
    .h = Hidróxeno
    .he = Helio
    .li = Litio
    .be = Berilio
    .b = Boro
    .c = Carbono
    .n = Nitróxeno
    .o = Osíxeno
    .f = Flúor
    .ne = Neon
    .na = Sodio
    .mg = Magnesio
    .al = Aluminio
    .si = Silicio
    .p = Fósforo
    .s = Xofre
    .cl = Cloro
    .ar = Argon
    .k = Potasio
    .ca = Calcio
    .sc = Escandio
    .ti = Titanio
    .v = Vanadio
    .cr = Cromo
    .mn = Manganeso
    .fe = Ferro
    .co = Cobalto
    .ni = Níquel
    .cu = Cobre
    .zn = Cinc
    .ga = Galio
    .ge = Xermanio
    .as = Arsénico
    .se = Selenio
    .br = Bromo
    .kr = Criptón
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
    .ag = Prata
    .cd = Cadmio
    .in = Indio
    .sn = Estaño
    .sb = Antimonio
    .te = Telurio
    .i = Iodo
    .xe = Xenon
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
    .ta = Tántalo
    .w = Volframio
    .re = Renio
    .os = Osmio
    .ir = Iridio
    .pt = Platino
    .au = Ouro
    .hg = Mercurio
    .tl = Talio
    .pb = Chumbo
    .bi = Bismuto
    .po = Polonio
    .at = Ástato
    .rn = Radon
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
    .es = Einstenio
    .fm = Fermio
    .md = Mendelevio
    .no = Nobelio
    .lr = Lawrencio
    .rf = Rutherfordio
    .db = Dubnio
    .sg = Seaborxio
    .bh = Bohrio
    .hs = Hasio
    .mt = Meitnerio
    .ds = Darmstadtio
    .rg = Roentxenio
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
    .i = Ioduro
    .at = Astaturo
    .ts = Tenesuro
ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Símbolo químico non válido
chemistry-invalid-ionic-compound = Composto iónico non válido

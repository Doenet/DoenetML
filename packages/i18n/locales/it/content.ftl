# Italian content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Italian inflects. Adjectives follow their noun and agree with it in gender,
# so every adjective below selects on `$gender`, the gender of the noun it
# describes, and the composition messages put the noun first.


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] nera
           *[m] nero
        }
    .white =
        { $gender ->
            [f] bianca
           *[m] bianco
        }
    .gray =
        { $gender ->
            [f] grigia
           *[m] grigio
        }
    .red =
        { $gender ->
            [f] rossa
           *[m] rosso
        }
    .orange = arancione
    .yellow =
        { $gender ->
            [f] gialla
           *[m] giallo
        }
    .green = verde
    .cyan = ciano
    .blue = blu
    .purple = viola
    .pink = rosa
    .brown = marrone
line-width =
    .thick =
        { $gender ->
            [f] spessa
           *[m] spesso
        }
    .thin = sottile
line-style =
    .dashed =
        { $gender ->
            [f] tratteggiata
           *[m] tratteggiato
        }
    .dotted =
        { $gender ->
            [f] punteggiata
           *[m] punteggiato
        }
# Noun phrases: they follow «con» and agree with nothing.
fill-style =
    .horizontal = linee orizzontali
    .vertical = linee verticali
    .diagonal = linee diagonali
    .backdiagonal = linee diagonali inverse
    .dots = punti
    .diamonds = rombi
noun =
    .line = linea
    .line-segment = segmento
    .ray = semiretta
    .vector = vettore
    .curve = curva
    .function = funzione
    .parabola = parabola
    .polyline = spezzata
    .polygon = poligono
    .triangle = triangolo
    .rectangle = rettangolo
    .circle = circonferenza
    .region = regione
    .point = punto
    .square = quadrato
    .diamond = rombo
    .cross = croce
    .plus = segno più
# The noun is split: «poligono regolare» carries the agreement and
# «con 5 lati» closes the phrase behind the adjectives.
noun-regular-polygon =
    { $part ->
        [tail] con { $numSides } lati
       *[head] poligono regolare
    }
# Besides the nouns above, `$noun` can be `regular-polygon` or the head of a
# phrase the description never names: `border` (bordo), `fill` (riempimento),
# `text` (testo), `background` (sfondo). All four are masculine and fall to the
# default.
noun-gender =
    { $noun ->
        [line] f
        [ray] f
        [curve] f
        [function] f
        [parabola] f
        [polyline] f
        [circle] f
        [region] f
        [cross] f
       *[other] m
    }

## Style composition

style-stroke =
    { $parts ->
        [width-style-color] { $width } { $lineStyle } { $color }
        [width-color] { $width } { $color }
        [style-color] { $lineStyle } { $color }
        [width-style] { $width } { $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }
# The noun leads and its adjectives follow: «linea spessa rossa». A noun with a
# complement keeps it beside itself.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $nounTail } { $description }
       *[noun] { $noun } { $description }
    }
style-filled-word =
    { $gender ->
        [f] riempita
       *[m] riempito
    }
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } con { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } con { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } con { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# «bordo» is masculine, so the border's adjectives agree with it and not with
# the shape it surrounds.
style-border-clause =
    { $parts ->
        [with-article] con un bordo { $border }
        [and] e bordo { $border }
        [and-article] e un bordo { $border }
       *[with] con bordo { $border }
    }
# «di colore» avoids having to agree the colour with a plural pattern noun.
style-fill =
    { $parts ->
        [pattern] { $pattern } di colore { $color }
       *[plain] { $color }
    }
style-unfilled = non riempito
style-text =
    { $parts ->
        [background] { $color } su sfondo { $background }
       *[plain] { $color }
    }
style-background-none = nessuno

## Boolean words

boolean-true = vero
boolean-false = falso

## Answer buttons

answer-submit-label = Verifica
answer-submit-label-no-correctness = Invia la risposta

## Sectional blocks

section-name =
    .activity = Attività
    .aside = Inciso
    .cascade = Cascata
    .definition = Definizione
    .example = Esempio
    .exercise = Esercizio
    .exercises = Esercizi
    .given-answer = Risposta
    .note = Nota
    .objectives = Obiettivi
    .paragraphs = Paragrafi
    .part = Parte
    .problem = Problema
    .problems = Problemi
    .proof = Dimostrazione
    .question = Domanda
    .section = Sezione
    .solution = Soluzione
    .task = Compito
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
hint-title = Suggerimento

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabella { $enumeration }
        [numbered-title] Tabella { $enumeration }{ ": " }
        [unnumbered-title] Tabella{ ": " }
       *[unnumbered] Tabella
    }
figure-name =
    { $parts ->
        [numbered] Figura { $enumeration }
        [numbered-caption] Figura { $enumeration }{ ": " }
        [unnumbered-caption] Figura{ ": " }
       *[unnumbered] Figura
    }

## Paginator controls

paginator-previous = Precedente
paginator-next = Successivo
paginator-page = Pagina
paginator-page-status = { $pageLabel } { $currentPage } di { $numPages }

## Piecewise functions

piecewise-condition-or = oppure
piecewise-condition-if = se
piecewise-condition-otherwise = altrimenti

## Chemistry

element-name =
    .h = Idrogeno
    .he = Elio
    .li = Litio
    .be = Berillio
    .b = Boro
    .c = Carbonio
    .n = Azoto
    .o = Ossigeno
    .f = Fluoro
    .ne = Neon
    .na = Sodio
    .mg = Magnesio
    .al = Alluminio
    .si = Silicio
    .p = Fosforo
    .s = Zolfo
    .cl = Cloro
    .ar = Argon
    .k = Potassio
    .ca = Calcio
    .sc = Scandio
    .ti = Titanio
    .v = Vanadio
    .cr = Cromo
    .mn = Manganese
    .fe = Ferro
    .co = Cobalto
    .ni = Nichel
    .cu = Rame
    .zn = Zinco
    .ga = Gallio
    .ge = Germanio
    .as = Arsenico
    .se = Selenio
    .br = Bromo
    .kr = Krypton
    .rb = Rubidio
    .sr = Stronzio
    .y = Ittrio
    .zr = Zirconio
    .nb = Niobio
    .mo = Molibdeno
    .tc = Tecnezio
    .ru = Rutenio
    .rh = Rodio
    .pd = Palladio
    .ag = Argento
    .cd = Cadmio
    .in = Indio
    .sn = Stagno
    .sb = Antimonio
    .te = Tellurio
    .i = Iodio
    .xe = Xeno
    .cs = Cesio
    .ba = Bario
    .la = Lantanio
    .ce = Cerio
    .pr = Praseodimio
    .nd = Neodimio
    .pm = Promezio
    .sm = Samario
    .eu = Europio
    .gd = Gadolinio
    .tb = Terbio
    .dy = Disprosio
    .ho = Olmio
    .er = Erbio
    .tm = Tulio
    .yb = Itterbio
    .lu = Lutezio
    .hf = Afnio
    .ta = Tantalio
    .w = Tungsteno
    .re = Renio
    .os = Osmio
    .ir = Iridio
    .pt = Platino
    .au = Oro
    .hg = Mercurio
    .tl = Tallio
    .pb = Piombo
    .bi = Bismuto
    .po = Polonio
    .at = Astato
    .rn = Radon
    .fr = Francio
    .ra = Radio
    .ac = Attinio
    .th = Torio
    .pa = Protoattinio
    .u = Uranio
    .np = Nettunio
    .pu = Plutonio
    .am = Americio
    .cm = Curio
    .bk = Berkelio
    .cf = Californio
    .es = Einsteinio
    .fm = Fermio
    .md = Mendelevio
    .no = Nobelio
    .lr = Laurenzio
    .rf = Rutherfordio
    .db = Dubnio
    .sg = Seaborgio
    .bh = Bohrio
    .hs = Hassio
    .mt = Meitnerio
    .ds = Darmstadtio
    .rg = Roentgenio
    .cn = Copernicio
    .nh = Nihonio
    .fl = Flerovio
    .mc = Moscovio
    .lv = Livermorio
    .ts = Tennesso
    .og = Oganesson
element-anion-name =
    .h = Idruro
    .c = Carburo
    .n = Nitruro
    .o = Ossido
    .f = Fluoruro
    .p = Fosfuro
    .s = Solfuro
    .cl = Cloruro
    .br = Bromuro
    .i = Ioduro
    .at = Astaturo
    .ts = Tennessuro
ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Simbolo chimico non valido
chemistry-invalid-ionic-compound = Composto ionico non valido

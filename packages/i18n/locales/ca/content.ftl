# Catalan content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Catalan has two genders and no case, so every describing word selects on
# `$gender` and nothing selects on `$role` — the shape `locales/es` already
# has. Adjectives follow their noun, so the composition messages are reordered
# from the English and the noun leads.
#
# «taronja», «cian», «rosa», «marró» and «porpra» are invariable: they are
# nouns pressed into service as colour words, and a noun does not agree. So
# they are written without a `$gender` select at all, which is a fact about
# Catalan and not an untranslated string.


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] negra
           *[m] negre
        }
    .white =
        { $gender ->
            [f] blanca
           *[m] blanc
        }
    .gray =
        { $gender ->
            [f] grisa
           *[m] gris
        }
    .red =
        { $gender ->
            [f] vermella
           *[m] vermell
        }
    .orange = taronja
    .yellow =
        { $gender ->
            [f] groga
           *[m] groc
        }
    .green =
        { $gender ->
            [f] verda
           *[m] verd
        }
    .cyan = cian
    .blue =
        { $gender ->
            [f] blava
           *[m] blau
        }
    .purple = porpra
    .pink = rosa
    .brown = marró

line-width =
    .thick =
        { $gender ->
            [f] gruixuda
           *[m] gruixut
        }
    .thin =
        { $gender ->
            [f] prima
           *[m] prim
        }

line-style =
    .dashed =
        { $gender ->
            [f] discontínua
           *[m] discontinu
        }
    .dotted =
        { $gender ->
            [f] puntejada
           *[m] puntejat
        }

# Noun phrases standing behind «amb». They modify nothing and take no gender.
fill-style =
    .horizontal = línies horitzontals
    .vertical = línies verticals
    .diagonal = línies diagonals
    .backdiagonal = línies diagonals inverses
    .dots = punts
    .diamonds = rombes

noun =
    .line = línia
    .line-segment = segment
    .ray = semirecta
    .vector = vector
    .curve = corba
    .function = funció
    .parabola = paràbola
    .polyline = polilínia
    .polygon = polígon
    .triangle = triangle
    .rectangle = rectangle
    .circle = cercle
    .region = regió
    .point = punt
    .square = quadrat
    .diamond = rombe
    .cross = creu
    .plus = signe més

# The side count follows the style adjectives so that they stay beside the noun
# they agree with, which is the split `noun-regular-polygon` exists for.
noun-regular-polygon =
    { $part ->
        [tail] de { $numSides } costats
       *[head] polígon regular
    }

# Besides the nouns above, `$noun` can be `regular-polygon` (polígon, m) or the
# head of a phrase the description never names: `border` (vora, f), `fill`
# (emplenat, m), `text` (text, m), `background` (fons, m).
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
        [border] f
       *[other] m
    }


## Style composition

# The adjectives follow their noun, and the colour closes the run: «línia
# gruixuda discontínua vermella».
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

style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }

style-filled-word =
    { $gender ->
        [f] plena
       *[m] ple
    }

style-filled =
    { $parts ->
        [pattern] { $color } { $filled } amb { $pattern }
       *[plain] { $color } { $filled }
    }

# The complement sits against the noun rather than at the end, unlike
# `style-with-noun`: «ple de …» reads as «full of …», so «ple de 5 costats»
# would say something else. «Polígon regular de 5 costats blau ple».
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $color } { $filled } amb { $pattern }
        [plain-tail] { $noun } { $nounTail } { $color } { $filled }
        [pattern-tail] { $noun } { $nounTail } { $color } { $filled } amb { $pattern }
       *[plain] { $noun } { $color } { $filled }
    }

# «vora» is feminine, so the border's adjectives agree with it and not with the
# shape it surrounds. Catalan does have an indefinite article, so the two
# `-article` branches are the two that write «una».
style-border-clause =
    { $parts ->
        [with-article] amb una vora { $border }
        [and] i vora { $border }
        [and-article] i una vora { $border }
       *[with] amb vora { $border }
    }

# «de color» avoids having to agree the colour with a plural pattern noun
# («línies horitzontals de color vermell»).
style-fill =
    { $parts ->
        [pattern] { $pattern } de color { $color }
       *[plain] { $color }
    }

style-unfilled = sense emplenar

style-text =
    { $parts ->
        [background] { $color } amb un fons { $background }
       *[plain] { $color }
    }

style-background-none = cap


## Boolean words

boolean-true = cert
boolean-false = fals


## Answer buttons

answer-submit-label = Comprova
answer-submit-label-no-correctness = Envia la resposta


## Sectional blocks

section-name =
    .activity = Activitat
    .aside = Nota al marge
    .cascade = Cascada
    .definition = Definició
    .example = Exemple
    .exercise = Exercici
    .exercises = Exercicis
    .given-answer = Resposta
    .note = Nota
    .objectives = Objectius
    .paragraphs = Paràgrafs
    .part = Part
    .problem = Problema
    .problems = Problemes
    .proof = Demostració
    .question = Pregunta
    .section = Secció
    .solution = Solució
    .task = Tasca
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
        [numbered] Taula { $enumeration }
        [numbered-title] Taula { $enumeration }{ ": " }
        [unnumbered-title] Taula{ ": " }
       *[unnumbered] Taula
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
paginator-next = Següent
paginator-page = Pàgina

paginator-page-status = { $pageLabel } { $currentPage } de { $numPages }


## Piecewise functions

piecewise-condition-or = o
piecewise-condition-if = si
piecewise-condition-otherwise = altrament


## Chemistry

element-name =
    .h = Hidrogen
    .he = Heli
    .li = Liti
    .be = Beril·li
    .b = Bor
    .c = Carboni
    .n = Nitrogen
    .o = Oxigen
    .f = Fluor
    .ne = Neó
    .na = Sodi
    .mg = Magnesi
    .al = Alumini
    .si = Silici
    .p = Fòsfor
    .s = Sofre
    .cl = Clor
    .ar = Argó
    .k = Potassi
    .ca = Calci
    .sc = Escandi
    .ti = Titani
    .v = Vanadi
    .cr = Crom
    .mn = Manganès
    .fe = Ferro
    .co = Cobalt
    .ni = Níquel
    .cu = Coure
    .zn = Zinc
    .ga = Gal·li
    .ge = Germani
    .as = Arsènic
    .se = Seleni
    .br = Brom
    .kr = Criptó
    .rb = Rubidi
    .sr = Estronci
    .y = Itri
    .zr = Zirconi
    .nb = Niobi
    .mo = Molibdè
    .tc = Tecneci
    .ru = Ruteni
    .rh = Rodi
    .pd = Pal·ladi
    .ag = Argent
    .cd = Cadmi
    .in = Indi
    .sn = Estany
    .sb = Antimoni
    .te = Tel·luri
    .i = Iode
    .xe = Xenó
    .cs = Cesi
    .ba = Bari
    .la = Lantani
    .ce = Ceri
    .pr = Praseodimi
    .nd = Neodimi
    .pm = Prometi
    .sm = Samari
    .eu = Europi
    .gd = Gadolini
    .tb = Terbi
    .dy = Disprosi
    .ho = Holmi
    .er = Erbi
    .tm = Tuli
    .yb = Iterbi
    .lu = Luteci
    .hf = Hafni
    .ta = Tàntal
    .w = Tungstè
    .re = Reni
    .os = Osmi
    .ir = Iridi
    .pt = Platí
    .au = Or
    .hg = Mercuri
    .tl = Tal·li
    .pb = Plom
    .bi = Bismut
    .po = Poloni
    .at = Àstat
    .rn = Radó
    .fr = Franci
    .ra = Radi
    .ac = Actini
    .th = Tori
    .pa = Protoactini
    .u = Urani
    .np = Neptuni
    .pu = Plutoni
    .am = Americi
    .cm = Curi
    .bk = Berkeli
    .cf = Californi
    .es = Einsteini
    .fm = Fermi
    .md = Mendelevi
    .no = Nobeli
    .lr = Laurenci
    .rf = Rutherfordi
    .db = Dubni
    .sg = Seaborgi
    .bh = Bohri
    .hs = Hassi
    .mt = Meitneri
    .ds = Darmstadti
    .rg = Roentgeni
    .cn = Copernici
    .nh = Nihoni
    .fl = Flerovi
    .mc = Moscovi
    .lv = Livermori
    .ts = Tennes
    .og = Oganessó

element-anion-name =
    .h = Hidrur
    .c = Carbur
    .n = Nitrur
    .o = Òxid
    .f = Fluorur
    .p = Fosfur
    .s = Sulfur
    .cl = Clorur
    .br = Bromur
    .i = Iodur
    .at = Astatur
    .ts = Tennesur

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Símbol químic no vàlid
chemistry-invalid-ionic-compound = Compost iònic no vàlid

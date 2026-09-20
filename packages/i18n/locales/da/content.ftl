# Danish content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Danish agrees an adjective with its noun's gender, and there are two:
# **common** («en linje») and **neuter** («et kryds»), which take `-` and `-t`
# in the indefinite singular. `noun-gender` answers `common` or `neuter`, and
# those tokens are this catalog's own — `$gender`'s vocabulary is agreed
# between `noun-gender` and the adjectives that read it, both of which are
# here.
#
# `$role` goes unused: the three clause positions differ from `standalone` in
# case, and a Danish adjective has none. Their genders are already right —
# «kant», «baggrund» and «tekst» are all common, and `noun-gender` says so.
#
# An adjective already ending in `-et` takes no further `-t`, so «stiplet» and
# «prikket» — and «udfyldt», whose stem ends in `-t` — are written once. So are
# «orange», «lilla» and «cyan», which do not inflect at all.
#
# Which nouns are neuter is not the same list as Swedish's next door:
# «rektangel», «punkt» and «kvadrat» are neuter here and common there. Gender
# is per language, not per family.


## Style vocabulary

color =
    .black = sort
    .white =
        { $gender ->
            [neuter] hvidt
           *[common] hvid
        }
    .gray =
        { $gender ->
            [neuter] gråt
           *[common] grå
        }
    .red =
        { $gender ->
            [neuter] rødt
           *[common] rød
        }
    .orange = orange
    .yellow =
        { $gender ->
            [neuter] gult
           *[common] gul
        }
    .green =
        { $gender ->
            [neuter] grønt
           *[common] grøn
        }
    .cyan = cyan
    .blue =
        { $gender ->
            [neuter] blåt
           *[common] blå
        }
    .purple = lilla
    .pink =
        { $gender ->
            [neuter] lyserødt
           *[common] lyserød
        }
    .brown =
        { $gender ->
            [neuter] brunt
           *[common] brun
        }
line-width =
    .thick =
        { $gender ->
            [neuter] tykt
           *[common] tyk
        }
    .thin =
        { $gender ->
            [neuter] tyndt
           *[common] tynd
        }
line-style =
    .dashed = stiplet
    .dotted = prikket
fill-style =
    .horizontal = vandrette linjer
    .vertical = lodrette linjer
    .diagonal = diagonale linjer
    .backdiagonal = omvendte diagonale linjer
    .dots = prikker
    .diamonds = romber
noun =
    .line = linje
    .line-segment = linjestykke
    .ray = halvlinje
    .vector = vektor
    .curve = kurve
    .function = funktion
    .parabola = parabel
    .polyline = polylinje
    .polygon = polygon
    .triangle = trekant
    .rectangle = rektangel
    .circle = cirkel
    .region = område
    .point = punkt
    .square = kvadrat
    .diamond = rombe
    .cross = kryds
    .plus = plus
# Danish names a regular polygon by its side count in one word — «regelmæssig
# 5-kant» — so the count stays in the head and there is no tail. «-kant» is
# common, like «trekant».
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] regelmæssig { $numSides }-kant
    }
# `$noun` can also be `regular-polygon` (kant, common) or a head the
# description never names: `border` (kant, common), `fill` (udfyldning,
# common), `text` (tekst, common), `background` (baggrund, common).
noun-gender =
    { $noun ->
        [line-segment] neuter
        [rectangle] neuter
        [region] neuter
        [point] neuter
        [square] neuter
        [cross] neuter
        [plus] neuter
       *[other] common
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
style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }
# «udfyldt» already ends in `-t`, so it does not inflect and takes no
# `$gender` branch.
style-filled-word = udfyldt
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } med { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } med { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } med { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }
# «kant» is common, so the indefinite article is «en» — a word of its own,
# which is why the distinction English draws between the `-article` branches
# and the others survives here.
style-border-clause =
    { $parts ->
        [with-article] med en { $border } kant
        [and] og { $border } kant
        [and-article] og en { $border } kant
       *[with] med { $border } kant
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = uudfyldt
style-text =
    { $parts ->
        [background] { $color } på { $background } baggrund
       *[plain] { $color }
    }
style-background-none = ingen

## Boolean words

boolean-true = sand
boolean-false = falsk

## Answer buttons

answer-submit-label = Kontrollér
answer-submit-label-no-correctness = Indsend svar

## Sectional blocks

section-name =
    .activity = Aktivitet
    .aside = Sidebemærkning
    .cascade = Kaskade
    .definition = Definition
    .example = Eksempel
    .exercise = Øvelse
    .exercises = Øvelser
    .given-answer = Svar
    .note = Bemærkning
    .objectives = Mål
    .paragraphs = Afsnit
    .part = Del
    .problem = Opgave
    .problems = Opgaver
    .proof = Bevis
    .question = Spørgsmål
    .section = Kapitel
    .solution = Løsning
    .task = Arbejdsopgave
    .theorem = Sætning
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Hint

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabel { $enumeration }
        [numbered-title] Tabel { $enumeration }{ ": " }
        [unnumbered-title] Tabel{ ": " }
       *[unnumbered] Tabel
    }
figure-name =
    { $parts ->
        [numbered] Figur { $enumeration }
        [numbered-caption] Figur { $enumeration }{ ": " }
        [unnumbered-caption] Figur{ ": " }
       *[unnumbered] Figur
    }

## Paginator controls

paginator-previous = Forrige
paginator-next = Næste
paginator-page = Side
paginator-page-status = { $pageLabel } { $currentPage } af { $numPages }

## Piecewise functions

piecewise-condition-or = eller
piecewise-condition-if = hvis
piecewise-condition-otherwise = ellers

## Chemistry

element-name =
    .h = Brint
    .he = Helium
    .li = Lithium
    .be = Beryllium
    .b = Bor
    .c = Kulstof
    .n = Kvælstof
    .o = Ilt
    .f = Fluor
    .ne = Neon
    .na = Natrium
    .mg = Magnesium
    .al = Aluminium
    .si = Silicium
    .p = Fosfor
    .s = Svovl
    .cl = Klor
    .ar = Argon
    .k = Kalium
    .ca = Calcium
    .sc = Scandium
    .ti = Titan
    .v = Vanadium
    .cr = Krom
    .mn = Mangan
    .fe = Jern
    .co = Kobolt
    .ni = Nikkel
    .cu = Kobber
    .zn = Zink
    .ga = Gallium
    .ge = Germanium
    .as = Arsen
    .se = Selen
    .br = Brom
    .kr = Krypton
    .rb = Rubidium
    .sr = Strontium
    .y = Yttrium
    .zr = Zirconium
    .nb = Niobium
    .mo = Molybdæn
    .tc = Technetium
    .ru = Ruthenium
    .rh = Rhodium
    .pd = Palladium
    .ag = Sølv
    .cd = Cadmium
    .in = Indium
    .sn = Tin
    .sb = Antimon
    .te = Tellur
    .i = Jod
    .xe = Xenon
    .cs = Cæsium
    .ba = Barium
    .la = Lanthan
    .ce = Cerium
    .pr = Praseodym
    .nd = Neodym
    .pm = Promethium
    .sm = Samarium
    .eu = Europium
    .gd = Gadolinium
    .tb = Terbium
    .dy = Dysprosium
    .ho = Holmium
    .er = Erbium
    .tm = Thulium
    .yb = Ytterbium
    .lu = Lutetium
    .hf = Hafnium
    .ta = Tantal
    .w = Wolfram
    .re = Rhenium
    .os = Osmium
    .ir = Iridium
    .pt = Platin
    .au = Guld
    .hg = Kviksølv
    .tl = Thallium
    .pb = Bly
    .bi = Vismut
    .po = Polonium
    .at = Astat
    .rn = Radon
    .fr = Francium
    .ra = Radium
    .ac = Actinium
    .th = Thorium
    .pa = Protactinium
    .u = Uran
    .np = Neptunium
    .pu = Plutonium
    .am = Americium
    .cm = Curium
    .bk = Berkelium
    .cf = Californium
    .es = Einsteinium
    .fm = Fermium
    .md = Mendelevium
    .no = Nobelium
    .lr = Lawrencium
    .rf = Rutherfordium
    .db = Dubnium
    .sg = Seaborgium
    .bh = Bohrium
    .hs = Hassium
    .mt = Meitnerium
    .ds = Darmstadtium
    .rg = Roentgenium
    .cn = Copernicium
    .nh = Nihonium
    .fl = Flerovium
    .mc = Moscovium
    .lv = Livermorium
    .ts = Tenness
    .og = Oganesson
element-anion-name =
    .h = Hydrid
    .c = Carbid
    .n = Nitrid
    .o = Oxid
    .f = Fluorid
    .p = Fosfid
    .s = Sulfid
    .cl = Chlorid
    .br = Bromid
    .i = Iodid
    .at = Astatid
    .ts = Tennessid
ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Ugyldigt kemisk symbol
chemistry-invalid-ionic-compound = Ugyldig ionforbindelse

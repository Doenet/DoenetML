# Swedish content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Swedish agrees an adjective with its noun's gender, and there are two:
# **common** («en linje») and **neuter** («ett kryss»), which take `-` and `-t`
# in the indefinite singular. So `noun-gender` answers `common` or `neuter`
# rather than the three-way answer a Slavic or Romance catalog gives, and the
# tokens are this catalog's own — `$gender`'s vocabulary is agreed between
# `noun-gender` and the adjectives that read it, both of which are here.
#
# `$role` goes **unused**, and that is worth saying because it is not a
# statement about Swedish having no agreement. The three clause positions
# differ from `standalone` in *case*, and a Swedish adjective has none. Their
# genders are already right: «ram», «bakgrund» and «text» are all common, and
# `noun-gender` says so, so `$gender` alone does all the work.
#
# «orange», «lila», «rosa» and «cyan» do not inflect and are written once.
#
# Every description here is indefinite, so the definite suffix — «linje» →
# «linjen» — never has to reach a placeable. Where a definite form is wanted it
# is on a word this catalog writes.


## Style vocabulary

color =
    .black = svart
    .white =
        { $gender ->
            [neuter] vitt
           *[common] vit
        }
    .gray =
        { $gender ->
            [neuter] grått
           *[common] grå
        }
    .red =
        { $gender ->
            [neuter] rött
           *[common] röd
        }
    .orange = orange
    .yellow =
        { $gender ->
            [neuter] gult
           *[common] gul
        }
    .green =
        { $gender ->
            [neuter] grönt
           *[common] grön
        }
    .cyan = cyan
    .blue =
        { $gender ->
            [neuter] blått
           *[common] blå
        }
    .purple = lila
    .pink = rosa
    .brown =
        { $gender ->
            [neuter] brunt
           *[common] brun
        }

line-width =
    .thick =
        { $gender ->
            [neuter] tjockt
           *[common] tjock
        }
    .thin =
        { $gender ->
            [neuter] tunt
           *[common] tunn
        }

line-style =
    .dashed =
        { $gender ->
            [neuter] streckat
           *[common] streckad
        }
    .dotted =
        { $gender ->
            [neuter] prickat
           *[common] prickad
        }

fill-style =
    .horizontal = vågräta linjer
    .vertical = lodräta linjer
    .diagonal = diagonala linjer
    .backdiagonal = omvända diagonala linjer
    .dots = prickar
    .diamonds = romber

noun =
    .line = linje
    .line-segment = sträcka
    .ray = stråle
    .vector = vektor
    .curve = kurva
    .function = funktion
    .parabola = parabel
    .polyline = polygonlinje
    .polygon = polygon
    .triangle = triangel
    .rectangle = rektangel
    .circle = cirkel
    .region = område
    .point = punkt
    .square = kvadrat
    .diamond = romb
    .cross = kryss
    .plus = plus

# Swedish names a regular polygon by its side count in one word — «regelbunden
# 5-hörning» — so the count stays in the head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] regelbunden { $numSides }-hörning
    }

# Common gender is the default because most of these are common, including the
# three heads a description names without listing: `border` (ram), `fill`
# (fyllning), `text` (text) and `background` (bakgrund) — and
# `regular-polygon` (hörning).
noun-gender =
    { $noun ->
        [region] neuter
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

style-filled-word =
    { $gender ->
        [neuter] fyllt
       *[common] fylld
    }

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

# «ram» is common, so the indefinite article is «en» — a word of its own, which
# is why the distinction English draws between the `-article` branches and the
# others survives here.
style-border-clause =
    { $parts ->
        [with-article] med en { $border } ram
        [and] och { $border } ram
        [and-article] och en { $border } ram
       *[with] med { $border } ram
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = ofylld

style-text =
    { $parts ->
        [background] { $color } på { $background } bakgrund
       *[plain] { $color }
    }

style-background-none = ingen


## Boolean words

boolean-true = sant
boolean-false = falskt


## Answer buttons

answer-submit-label = Kontrollera
answer-submit-label-no-correctness = Skicka svar


## Sectional blocks

section-name =
    .activity = Aktivitet
    .aside = Sidoanmärkning
    .cascade = Kaskad
    .definition = Definition
    .example = Exempel
    .exercise = Övning
    .exercises = Övningar
    .given-answer = Svar
    .note = Anmärkning
    .objectives = Mål
    .paragraphs = Stycken
    .part = Del
    .problem = Problem
    .problems = Problem
    .proof = Bevis
    .question = Fråga
    .section = Avsnitt
    .solution = Lösning
    .task = Uppgift
    .theorem = Sats

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Ledtråd


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabell { $enumeration }
        [numbered-title] Tabell { $enumeration }{ ": " }
        [unnumbered-title] Tabell{ ": " }
       *[unnumbered] Tabell
    }

figure-name =
    { $parts ->
        [numbered] Figur { $enumeration }
        [numbered-caption] Figur { $enumeration }{ ": " }
        [unnumbered-caption] Figur{ ": " }
       *[unnumbered] Figur
    }


## Paginator controls

paginator-previous = Föregående
paginator-next = Nästa
paginator-page = Sida

paginator-page-status = { $pageLabel } { $currentPage } av { $numPages }


## Piecewise functions

piecewise-condition-or = eller
piecewise-condition-if = om
piecewise-condition-otherwise = annars


## Chemistry

element-name =
    .h = Väte
    .he = Helium
    .li = Litium
    .be = Beryllium
    .b = Bor
    .c = Kol
    .n = Kväve
    .o = Syre
    .f = Fluor
    .ne = Neon
    .na = Natrium
    .mg = Magnesium
    .al = Aluminium
    .si = Kisel
    .p = Fosfor
    .s = Svavel
    .cl = Klor
    .ar = Argon
    .k = Kalium
    .ca = Kalcium
    .sc = Skandium
    .ti = Titan
    .v = Vanadin
    .cr = Krom
    .mn = Mangan
    .fe = Järn
    .co = Kobolt
    .ni = Nickel
    .cu = Koppar
    .zn = Zink
    .ga = Gallium
    .ge = Germanium
    .as = Arsenik
    .se = Selen
    .br = Brom
    .kr = Krypton
    .rb = Rubidium
    .sr = Strontium
    .y = Yttrium
    .zr = Zirkonium
    .nb = Niob
    .mo = Molybden
    .tc = Teknetium
    .ru = Rutenium
    .rh = Rodium
    .pd = Palladium
    .ag = Silver
    .cd = Kadmium
    .in = Indium
    .sn = Tenn
    .sb = Antimon
    .te = Tellur
    .i = Jod
    .xe = Xenon
    .cs = Cesium
    .ba = Barium
    .la = Lantan
    .ce = Cerium
    .pr = Praseodym
    .nd = Neodym
    .pm = Prometium
    .sm = Samarium
    .eu = Europium
    .gd = Gadolinium
    .tb = Terbium
    .dy = Dysprosium
    .ho = Holmium
    .er = Erbium
    .tm = Tulium
    .yb = Ytterbium
    .lu = Lutetium
    .hf = Hafnium
    .ta = Tantal
    .w = Volfram
    .re = Rhenium
    .os = Osmium
    .ir = Iridium
    .pt = Platina
    .au = Guld
    .hg = Kvicksilver
    .tl = Tallium
    .pb = Bly
    .bi = Vismut
    .po = Polonium
    .at = Astat
    .rn = Radon
    .fr = Francium
    .ra = Radium
    .ac = Aktinium
    .th = Torium
    .pa = Protaktinium
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
    .rg = Röntgenium
    .cn = Copernicium
    .nh = Nihonium
    .fl = Flerovium
    .mc = Moscovium
    .lv = Livermorium
    .ts = Tenness
    .og = Oganesson

element-anion-name =
    .h = Hydrid
    .c = Karbid
    .n = Nitrid
    .o = Oxid
    .f = Fluorid
    .p = Fosfid
    .s = Sulfid
    .cl = Klorid
    .br = Bromid
    .i = Jodid
    .at = Astatid
    .ts = Tennessid

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Ogiltig kemisk beteckning
chemistry-invalid-ionic-compound = Ogiltig jonförening

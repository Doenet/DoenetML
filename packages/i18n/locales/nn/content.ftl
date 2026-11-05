# Norwegian Nynorsk content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Nynorsk is a written standard of its own**, and this file is deliberately
# not a respelling of `locales/nb`. See `chrome.ftl` for the whole note.
#
# **Gender.** Nynorsk distinguishes three genders in the noun and two in the
# adjective: masculine and feminine share the indefinite singular and neuter
# adds `-t`. So `noun-gender` answers `common` or `neuter`, exactly as
# `locales/nb`, `locales/sv` and `locales/da` do, and those two tokens are this
# catalog's own — `$gender`'s vocabulary is agreed between `noun-gender` and
# the adjectives that read it, and both are in this file.
#
# `$role` goes unused. The three clause positions differ from `standalone` in
# case, and a Norwegian adjective has none; the genders of the heads those
# positions name — «kant», «bakgrunn», «tekst» — are already right, and
# `noun-gender` says so.
#
# An adjective that already ends in `-t` or in `-a` adds nothing further, so
# «svart», «stipla», «prikka» and «fylt» are written once, as are «oransje»,
# «lilla», «rosa» and «cyan», which do not inflect at all.
#
# **The periodic table is here in full**, which makes this the one complete
# catalog of its batch. Norway teaches chemistry in Norwegian and prints the
# table in it, so the names exist and are settled — the `locales/bs` and
# `locales/sw` case rather than the school-system case the other fourteen
# catalogs of this batch record. The list is `locales/nb`'s but for the two
# words where the standards genuinely differ: **«Kopar»** for Bokmål «Kobber»
# and **«Jarn»** for Bokmål «Jern». Those two are the whole of the difference,
# and a reviewer should expect the other 116 to agree.


## Style vocabulary

color =
    .black = svart
    .white =
        { $gender ->
            [neuter] kvitt
           *[common] kvit
        }
    .gray =
        { $gender ->
            [neuter] grått
           *[common] grå
        }
    .red =
        { $gender ->
            [neuter] raudt
           *[common] raud
        }
    .orange = oransje
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
            [neuter] blått
           *[common] blå
        }
    .purple = lilla
    .pink = rosa
    .brown =
        { $gender ->
            [neuter] brunt
           *[common] brun
        }
line-width =
    .thick =
        { $gender ->
            [neuter] tjukt
           *[common] tjukk
        }
    .thin =
        { $gender ->
            [neuter] tynt
           *[common] tynn
        }
# The Nynorsk participles end in `-a` and take no further ending, so neither
# forks on `$gender`.
line-style =
    .dashed = stipla
    .dotted = prikka
fill-style =
    .horizontal = vassrette linjer
    .vertical = loddrette linjer
    .diagonal = diagonale linjer
    .backdiagonal = motsette diagonale linjer
    .dots = prikkar
    .diamonds = rombar
noun =
    .line = linje
    .line-segment = linjestykke
    .ray = halvlinje
    .vector = vektor
    .curve = kurve
    .function = funksjon
    .slope-field = stigingsfelt
    .vector-field = vektorfelt
    .parabola = parabel
    .polyline = polylinje
    .polygon = polygon
    .triangle = trekant
    .rectangle = rektangel
    .circle = sirkel
    .region = område
    .point = punkt
    .square = kvadrat
    .diamond = rombe
    .cross = kryss
    .plus = pluss
# Norwegian names a regular polygon by its side count in one word —
# «regelmessig 5-kant» — so the count stays in the head and there is no tail.
# «-kant» is masculine, and so common for agreement.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] regelmessig { $numSides }-kant
    }
# `$noun` can also be `regular-polygon` (kant, common) or a head the
# description never names: `border` (kant, common), `fill` (fylling, common),
# `text` (tekst, common), `background` (bakgrunn, common).
noun-gender =
    { $noun ->
        [line-segment] neuter
        [slope-field] neuter
        [vector-field] neuter
        [polygon] neuter
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
# «fylt» already ends in `-t` and does not inflect further, so it takes no
# `$gender` branch.
style-filled-word = fylt
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
# «kant» is masculine, so the indefinite article is «ein» — a word of its own,
# which is why the distinction English draws between the `-article` branches
# and the others survives here.
style-border-clause =
    { $parts ->
        [with-article] med ein { $border } kant
        [and] og { $border } kant
        [and-article] og ein { $border } kant
       *[with] med { $border } kant
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = ufylt
style-text =
    { $parts ->
        [background] { $color } på { $background } bakgrunn
       *[plain] { $color }
    }
style-background-none = ingen

## Boolean words

boolean-true = sann
boolean-false = usann

## Answer buttons

answer-submit-label = Sjekk
answer-submit-label-no-correctness = Send inn svar

## Sectional blocks

section-name =
    .activity = Aktivitet
    .aside = Sidemerknad
    .cascade = Kaskade
    .definition = Definisjon
    .example = Døme
    .exercise = Øving
    .exercises = Øvingar
    .given-answer = Svar
    .note = Merknad
    .objectives = Mål
    .paragraphs = Avsnitt
    .part = Del
    .problem = Oppgåve
    .problems = Oppgåver
    .proof = Bevis
    .question = Spørsmål
    .section = Kapittel
    .solution = Løysing
    .task = Arbeidsoppgåve
    .theorem = Setning
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

paginator-previous = Førre
paginator-next = Neste
paginator-page = Side
paginator-page-status = { $pageLabel } { $currentPage } av { $numPages }

## Piecewise functions

piecewise-condition-or = eller
piecewise-condition-if = dersom
piecewise-condition-otherwise = elles

## Chemistry
##
## The whole table, because Norway teaches chemistry in Norwegian and prints
## it. Two words part company with `locales/nb`: «Kopar» and «Jarn».

element-name =
    .h = Hydrogen
    .he = Helium
    .li = Litium
    .be = Beryllium
    .b = Bor
    .c = Karbon
    .n = Nitrogen
    .o = Oksygen
    .f = Fluor
    .ne = Neon
    .na = Natrium
    .mg = Magnesium
    .al = Aluminium
    .si = Silisium
    .p = Fosfor
    .s = Svovel
    .cl = Klor
    .ar = Argon
    .k = Kalium
    .ca = Kalsium
    .sc = Skandium
    .ti = Titan
    .v = Vanadium
    .cr = Krom
    .mn = Mangan
    .fe = Jarn
    .co = Kobolt
    .ni = Nikkel
    .cu = Kopar
    .zn = Sink
    .ga = Gallium
    .ge = Germanium
    .as = Arsen
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
    .rh = Rhodium
    .pd = Palladium
    .ag = Sølv
    .cd = Kadmium
    .in = Indium
    .sn = Tinn
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
    .tm = Thulium
    .yb = Ytterbium
    .lu = Lutetium
    .hf = Hafnium
    .ta = Tantal
    .w = Wolfram
    .re = Rhenium
    .os = Osmium
    .ir = Iridium
    .pt = Platina
    .au = Gull
    .hg = Kvikksølv
    .tl = Tallium
    .pb = Bly
    .bi = Vismut
    .po = Polonium
    .at = Astat
    .rn = Radon
    .fr = Francium
    .ra = Radium
    .ac = Aktinium
    .th = Thorium
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
    .rg = Røntgenium
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
    .o = Oksid
    .f = Fluorid
    .p = Fosfid
    .s = Sulfid
    .cl = Klorid
    .br = Bromid
    .i = Jodid
    .at = Astatid
    .ts = Tennessid
ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Ugyldig kjemisk symbol
chemistry-invalid-ionic-compound = Ugyldig ionesamband

## Inputs embedded in math

# Read aloud inside the mathematics and never shown on screen, so it stays to
# one word.
math-embedded-input-blank = tomrom
math-embedded-input-blank-ordinal = tomrom { $ordinal } av { $total }

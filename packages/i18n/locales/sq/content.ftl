# Albanian content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Albanian puts its describing words *after* the noun, so `style-with-noun` and
# its siblings below reorder the two rather than substituting into the English
# frame. Nothing outside this catalog had to be told; `$parts` names which
# pieces are present and leaves the order to whoever writes them out.
#
# Agreement here is carried by a proclitic article rather than by an ending.
# An articulated adjective takes «i» after a masculine noun, «e» after a
# feminine one, and «të» in the accusative that a preposition governs — so a
# describing word selects on `$gender` when it stands with its noun and on
# `$role` when it sits behind «me»:
#
#   standalone          «i kuq» m, «e kuqe» f
#   border-clause       behind «me kufi», accusative: «të kuq»
#   background-clause   behind «me sfond», accusative: «të kuq»
#   text-clause         nominative masculine, agreeing with «tekst»
#
# Half the colour vocabulary is unarticulated loans — «blu», «gri», «kafe»,
# «rozë», «portokalli», «vjollcë», «bojëqielli» — and those take no article in
# any of the four positions, so they select on nothing at all and are written
# as one string. That split is the interesting thing about this catalog: which
# words fork is a fact about the word rather than about the position.


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] të zi
            [background-clause] të zi
            [text-clause] i zi
           *[standalone]
                { $gender ->
                    [f] e zezë
                   *[m] i zi
                }
        }
    .white =
        { $role ->
            [border-clause] të bardhë
            [background-clause] të bardhë
            [text-clause] i bardhë
           *[standalone]
                { $gender ->
                    [f] e bardhë
                   *[m] i bardhë
                }
        }
    .gray = gri
    .red =
        { $role ->
            [border-clause] të kuq
            [background-clause] të kuq
            [text-clause] i kuq
           *[standalone]
                { $gender ->
                    [f] e kuqe
                   *[m] i kuq
                }
        }
    .orange = portokalli
    .yellow =
        { $role ->
            [border-clause] të verdhë
            [background-clause] të verdhë
            [text-clause] i verdhë
           *[standalone]
                { $gender ->
                    [f] e verdhë
                   *[m] i verdhë
                }
        }
    .green =
        { $role ->
            [border-clause] të gjelbër
            [background-clause] të gjelbër
            [text-clause] i gjelbër
           *[standalone]
                { $gender ->
                    [f] e gjelbër
                   *[m] i gjelbër
                }
        }
    .cyan = bojëqielli
    .blue = blu
    .purple = vjollcë
    .pink = rozë
    .brown = kafe

line-width =
    .thick =
        { $role ->
            [border-clause] të trashë
            [background-clause] të trashë
            [text-clause] i trashë
           *[standalone]
                { $gender ->
                    [f] e trashë
                   *[m] i trashë
                }
        }
    .thin =
        { $role ->
            [border-clause] të hollë
            [background-clause] të hollë
            [text-clause] i hollë
           *[standalone]
                { $gender ->
                    [f] e hollë
                   *[m] i hollë
                }
        }

line-style =
    .dashed =
        { $role ->
            [border-clause] të ndërprerë
            [background-clause] të ndërprerë
            [text-clause] i ndërprerë
           *[standalone]
                { $gender ->
                    [f] e ndërprerë
                   *[m] i ndërprerë
                }
        }
    .dotted =
        { $role ->
            [border-clause] të pikëzuar
            [background-clause] të pikëzuar
            [text-clause] i pikëzuar
           *[standalone]
                { $gender ->
                    [f] e pikëzuar
                   *[m] i pikëzuar
                }
        }

# Bare plural noun phrases. The «me» that governs them is written where they
# are placed, since the same words follow it in both messages that use them.
fill-style =
    .horizontal = vija horizontale
    .vertical = vija vertikale
    .diagonal = vija diagonale
    .backdiagonal = vija diagonale të kundërta
    .dots = pika
    .diamonds = rombe

noun =
    .line = drejtëz
    .line-segment = segment
    .ray = gjysmëdrejtëz
    .vector = vektor
    .curve = kurbë
    .function = funksion
    .parabola = parabolë
    .polyline = vijë e thyer
    .polygon = shumëkëndësh
    .triangle = trekëndësh
    .rectangle = drejtkëndësh
    .circle = rreth
    .region = zonë
    .point = pikë
    .square = katror
    .diamond = romb
    .cross = kryq
    .plus = plus

# Albanian counts the sides after the noun, but so does everything else that
# describes it, so the count can stay inside the head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] shumëkëndësh i rregullt me { $numSides } brinjë
    }

# Besides the nouns above, `$noun` can be `regular-polygon` (shumëkëndësh, m)
# or the head of a phrase the description never names: `border` (kufi, m),
# `fill` (mbushje, f), `text` (tekst, m), `background` (sfond, m).
noun-gender =
    { $noun ->
        [line] f
        [ray] f
        [curve] f
        [parabola] f
        [polyline] f
        [region] f
        [point] f
        [fill] f
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

# The noun comes first in Albanian, so this is the English order reversed.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $nounTail } { $description }
       *[noun] { $noun } { $description }
    }

# Only ever said of the shape itself, so it is standalone in every description
# and takes no `$role` branch.
style-filled-word =
    { $gender ->
        [f] e mbushur
       *[m] i mbushur
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } me { $pattern }
       *[plain] { $filled } { $color }
    }

# The noun leads and every describing word follows it, so the shape's name sits
# in front of `{ $filled }` rather than after it.
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } me { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } me { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# «kufi» is masculine, and behind «me» its describing words take the accusative
# article «të» whatever gender the shape they surround is. Albanian has no
# indefinite article, so the two `-article` branches read like the two without.
style-border-clause =
    { $parts ->
        [with-article] me kufi { $border }
        [and] dhe kufi { $border }
        [and-article] dhe kufi { $border }
       *[with] me kufi { $border }
    }

# Supplies «mbushje» — feminine, which is the gender `noun-gender` already
# answers for `fill` — for the colour to agree with, and leads with it.
style-fill =
    { $parts ->
        [pattern] mbushje { $color } me { $pattern }
       *[plain] mbushje { $color }
    }

style-unfilled = i pambushur

style-text =
    { $parts ->
        [background] { $color } me sfond { $background }
       *[plain] { $color }
    }

style-background-none = asnjë


## Boolean words

boolean-true = e vërtetë
boolean-false = e rreme


## Answer buttons

answer-submit-label = Kontrollo
answer-submit-label-no-correctness = Dërgo përgjigjen


## Sectional blocks

section-name =
    .activity = Veprimtari
    .aside = Shënim anësor
    .cascade = Kaskadë
    .definition = Përkufizim
    .example = Shembull
    .exercise = Ushtrim
    .exercises = Ushtrime
    .given-answer = Përgjigje
    .note = Shënim
    .objectives = Objektiva
    .paragraphs = Paragrafë
    .part = Pjesë
    .problem = Problem
    .problems = Probleme
    .proof = Vërtetim
    .question = Pyetje
    .section = Seksion
    .solution = Zgjidhje
    .task = Detyrë
    .theorem = Teoremë

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Ndihmesë


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabela { $enumeration }
        [numbered-title] Tabela { $enumeration }{ ": " }
        [unnumbered-title] Tabela{ ": " }
       *[unnumbered] Tabela
    }

figure-name =
    { $parts ->
        [numbered] Figura { $enumeration }
        [numbered-caption] Figura { $enumeration }{ ": " }
        [unnumbered-caption] Figura{ ": " }
       *[unnumbered] Figura
    }


## Paginator controls

paginator-previous = E mëparshmja
paginator-next = Tjetra
paginator-page = Faqja

paginator-page-status = { $pageLabel } { $currentPage } nga { $numPages }


## Piecewise functions

piecewise-condition-or = ose
piecewise-condition-if = nëse
piecewise-condition-otherwise = përndryshe


## Chemistry

element-name =
    .h = Hidrogjen
    .he = Helium
    .li = Litium
    .be = Berilium
    .b = Bor
    .c = Karbon
    .n = Azot
    .o = Oksigjen
    .f = Fluor
    .ne = Neon
    .na = Natrium
    .mg = Magnez
    .al = Alumin
    .si = Silic
    .p = Fosfor
    .s = Squfur
    .cl = Klor
    .ar = Argon
    .k = Kalium
    .ca = Kalcium
    .sc = Skandium
    .ti = Titan
    .v = Vanadium
    .cr = Krom
    .mn = Mangan
    .fe = Hekur
    .co = Kobalt
    .ni = Nikel
    .cu = Bakër
    .zn = Zink
    .ga = Galium
    .ge = Germanium
    .as = Arsenik
    .se = Selen
    .br = Brom
    .kr = Kripton
    .rb = Rubidium
    .sr = Stroncium
    .y = Itrium
    .zr = Zirkonium
    .nb = Niobium
    .mo = Molibden
    .tc = Teknecium
    .ru = Rutenium
    .rh = Rodium
    .pd = Paladium
    .ag = Argjend
    .cd = Kadmium
    .in = Indium
    .sn = Kallaj
    .sb = Antimon
    .te = Telur
    .i = Jod
    .xe = Ksenon
    .cs = Cezium
    .ba = Barium
    .la = Lantan
    .ce = Cerium
    .pr = Prazeodim
    .nd = Neodim
    .pm = Prometium
    .sm = Samarium
    .eu = Europium
    .gd = Gadolinium
    .tb = Terbium
    .dy = Disprozium
    .ho = Holmium
    .er = Erbium
    .tm = Tulium
    .yb = Iterbium
    .lu = Lutecium
    .hf = Hafnium
    .ta = Tantal
    .w = Tungsten
    .re = Renium
    .os = Osmium
    .ir = Iridium
    .pt = Platin
    .au = Ar
    .hg = Zhivë
    .tl = Talium
    .pb = Plumb
    .bi = Bizmut
    .po = Polonium
    .at = Astat
    .rn = Radon
    .fr = Francium
    .ra = Radium
    .ac = Aktinium
    .th = Torium
    .pa = Protaktinium
    .u = Uranium
    .np = Neptunium
    .pu = Plutonium
    .am = Americium
    .cm = Kurium
    .bk = Berkelium
    .cf = Kaliforniium
    .es = Ajnshtajnium
    .fm = Fermium
    .md = Mendelevium
    .no = Nobelium
    .lr = Lorencium
    .rf = Raderfordium
    .db = Dubnium
    .sg = Siborgium
    .bh = Borium
    .hs = Hasium
    .mt = Majtnerium
    .ds = Darmshtatium
    .rg = Rentgenium
    .cn = Kopernicium
    .nh = Nihonium
    .fl = Flerovium
    .mc = Moskovium
    .lv = Livermorium
    .ts = Tenesin
    .og = Oganeson

element-anion-name =
    .h = Hidrur
    .c = Karbur
    .n = Nitrur
    .o = Oksid
    .f = Fluorur
    .p = Fosfur
    .s = Sulfur
    .cl = Klorur
    .br = Bromur
    .i = Jodur
    .at = Astatur
    .ts = Tenesur

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Simbol kimik i pavlefshëm
chemistry-invalid-ionic-compound = Përbërje jonike e pavlefshme

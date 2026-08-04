# Faroese content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# The same four cases and three genders `locales/is` has, and the same shape of
# catalog: adjectives precede the noun, so the composition messages keep the
# English order, and every describing word that inflects selects on `$role`
# first and then on `$gender`. «lilla» is the one that does not inflect at all,
# and it is written as a bare word.
#
#   standalone          nominative: `-ur` m, `-∅` f, `-t` n
#   border-clause       after «við», which governs the dative, of «kantur» —
#                       masculine: `-um`
#   background-clause   after «á», dative here, of «bakgrund» — feminine:
#                       `-ari`
#   text-clause         nominative masculine, agreeing with «tekstur»
#
# Where Faroese parts company with Icelandic is the background: «bakgrunnur» is
# masculine in Icelandic and both dative positions land on the same `-um`,
# while Faroese «bakgrund» is feminine and takes the dative singular `-ari`. So
# this is the one catalog in the pair whose two dative branches differ, and the
# `-ari` there is a dative and not the comparative it is spelled like.


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] svørtum
            [background-clause] svartari
            [text-clause] svartur
           *[standalone]
                { $gender ->
                    [f] svørt
                    [n] svart
                   *[m] svartur
                }
        }
    .white =
        { $role ->
            [border-clause] hvítum
            [background-clause] hvítari
            [text-clause] hvítur
           *[standalone]
                { $gender ->
                    [f] hvít
                    [n] hvítt
                   *[m] hvítur
                }
        }
    .gray =
        { $role ->
            [border-clause] gráum
            [background-clause] gráari
            [text-clause] gráur
           *[standalone]
                { $gender ->
                    [f] grá
                    [n] grátt
                   *[m] gráur
                }
        }
    .red =
        { $role ->
            [border-clause] reyðum
            [background-clause] reyðari
            [text-clause] reyður
           *[standalone]
                { $gender ->
                    [f] reyð
                    [n] reytt
                   *[m] reyður
                }
        }
    .orange =
        { $role ->
            [border-clause] appilsingulum
            [background-clause] appilsingulari
            [text-clause] appilsingulur
           *[standalone]
                { $gender ->
                    [f] appilsingul
                    [n] appilsingult
                   *[m] appilsingulur
                }
        }
    .yellow =
        { $role ->
            [border-clause] gulum
            [background-clause] gulari
            [text-clause] gulur
           *[standalone]
                { $gender ->
                    [f] gul
                    [n] gult
                   *[m] gulur
                }
        }
    .green =
        { $role ->
            [border-clause] grønum
            [background-clause] grønari
            [text-clause] grønur
           *[standalone]
                { $gender ->
                    [f] grøn
                    [n] grønt
                   *[m] grønur
                }
        }
    .cyan =
        { $role ->
            [border-clause] blágrønum
            [background-clause] blágrønari
            [text-clause] blágrønur
           *[standalone]
                { $gender ->
                    [f] blágrøn
                    [n] blágrønt
                   *[m] blágrønur
                }
        }
    .blue =
        { $role ->
            [border-clause] bláum
            [background-clause] bláari
            [text-clause] bláur
           *[standalone]
                { $gender ->
                    [f] blá
                    [n] blátt
                   *[m] bláur
                }
        }
    .purple = lilla
    .pink =
        { $role ->
            [border-clause] bleikum
            [background-clause] bleikari
            [text-clause] bleikur
           *[standalone]
                { $gender ->
                    [f] bleik
                    [n] bleikt
                   *[m] bleikur
                }
        }
    .brown =
        { $role ->
            [border-clause] brúnum
            [background-clause] brúnari
            [text-clause] brúnur
           *[standalone]
                { $gender ->
                    [f] brún
                    [n] brúnt
                   *[m] brúnur
                }
        }

line-width =
    .thick =
        { $role ->
            [border-clause] tjúkkum
            [background-clause] tjúkkari
            [text-clause] tjúkkur
           *[standalone]
                { $gender ->
                    [f] tjúkk
                    [n] tjúkt
                   *[m] tjúkkur
                }
        }
    .thin =
        { $role ->
            [border-clause] tunnum
            [background-clause] tunnari
            [text-clause] tunnur
           *[standalone]
                { $gender ->
                    [f] tunn
                    [n] tunt
                   *[m] tunnur
                }
        }

line-style =
    .dashed =
        { $role ->
            [border-clause] strikaðum
            [background-clause] strikaðari
            [text-clause] strikaður
           *[standalone]
                { $gender ->
                    [f] strikað
                    [n] strikað
                   *[m] strikaður
                }
        }
    .dotted =
        { $role ->
            [border-clause] punktaðum
            [background-clause] punktaðari
            [text-clause] punktaður
           *[standalone]
                { $gender ->
                    [f] punktað
                    [n] punktað
                   *[m] punktaður
                }
        }

# Noun phrases in the dative plural, which is the case «við» takes. They agree
# with nothing.
fill-style =
    .horizontal = vatnrættum linjum
    .vertical = loddrættum linjum
    .diagonal = skálinjum
    .backdiagonal = øvutum skálinjum
    .dots = punktum
    .diamonds = rutum

noun =
    .line = linja
    .line-segment = linjustykki
    .ray = geisli
    .vector = vektorur
    .curve = kurva
    .function = funktión
    .parabola = parabul
    .polyline = brotlinja
    .polygon = mangahyrningur
    .triangle = tríhyrningur
    .rectangle = rætthyrningur
    .circle = ringur
    .region = øki
    .point = punktur
    .square = ferningur
    .diamond = ruta
    .cross = kross
    .plus = plus

# Faroese builds the side count into the noun in front of it, so the whole of
# it is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] regluligur { $numSides }-hyrningur
    }

# Besides the nouns above, `$noun` can be `regular-polygon`, whose head is
# «-hyrningur» and so masculine, or the head of a phrase the description never
# names: `border` (kantur, m), `fill` (fylling, f), `text` (tekstur, m),
# `background` (bakgrund, f).
noun-gender =
    { $noun ->
        [line] f
        [curve] f
        [function] f
        [parabola] f
        [polyline] f
        [diamond] f
        [fill] f
        [background] f
        [line-segment] n
        [region] n
        [plus] n
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

style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }

# Only ever said of the shape itself, so it is standalone in every description
# and takes no `$role` branch.
style-filled-word =
    { $gender ->
        [f] fylt
        [n] fylt
       *[m] fyltur
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } við { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } við { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } við { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

# «kantur» is masculine and stands in the dative after «við», so the border's
# adjectives agree with it and not with the shape it surrounds. Faroese has no
# indefinite article, so the two `-article` branches read like the two without.
style-border-clause =
    { $parts ->
        [with-article] við { $border } kanti
        [and] og { $border } kanti
        [and-article] og { $border } kanti
       *[with] við { $border } kanti
    }

# The fill-pattern words are dative plurals, because their other use is the
# «við { $pattern }» clause above. So this message supplies a noun for them to
# hang off — «fylling», feminine, which is the gender `noun-gender` already
# answers for `fill`, so the colour agrees with it in both variants.
style-fill =
    { $parts ->
        [pattern] { $color } fylling við { $pattern }
       *[plain] { $color }
    }

style-unfilled = ófylt

style-text =
    { $parts ->
        [background] { $color } á { $background } bakgrund
       *[plain] { $color }
    }

style-background-none = eingin


## Boolean words

boolean-true = satt
boolean-false = ósatt


## Answer buttons

answer-submit-label = Kanna
answer-submit-label-no-correctness = Send svar


## Sectional blocks

section-name =
    .activity = Virksemi
    .aside = Síðugrein
    .cascade = Rað
    .definition = Skilgreining
    .example = Dømi
    .exercise = Venjing
    .exercises = Venjingar
    .given-answer = Svar
    .note = Viðmerking
    .objectives = Endamál
    .paragraphs = Greinar
    .part = Partur
    .problem = Uppgáva
    .problems = Uppgávur
    .proof = Prógv
    .question = Spurningur
    .section = Kapittul
    .solution = Loysn
    .task = Uppgáva
    .theorem = Setningur

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Vísbending


## Tables and figures

table-name =
    { $parts ->
        [numbered] Talva { $enumeration }
        [numbered-title] Talva { $enumeration }{ ": " }
        [unnumbered-title] Talva{ ": " }
       *[unnumbered] Talva
    }

figure-name =
    { $parts ->
        [numbered] Mynd { $enumeration }
        [numbered-caption] Mynd { $enumeration }{ ": " }
        [unnumbered-caption] Mynd{ ": " }
       *[unnumbered] Mynd
    }


## Paginator controls

paginator-previous = Fyrra
paginator-next = Næsta
paginator-page = Síða

paginator-page-status = { $pageLabel } { $currentPage } av { $numPages }


## Piecewise functions

piecewise-condition-or = ella
piecewise-condition-if = um
piecewise-condition-otherwise = annars


## Chemistry

element-name =
    .h = Vetni
    .he = Helium
    .li = Litium
    .be = Beryllium
    .b = Bor
    .c = Kolevni
    .n = Køvievni
    .o = Súrevni
    .f = Fluor
    .ne = Neon
    .na = Natrium
    .mg = Magnesium
    .al = Aluminium
    .si = Kisil
    .p = Fosfor
    .s = Svávul
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
    .ni = Nikkul
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
    .nb = Niobium
    .mo = Molybden
    .tc = Teknetium
    .ru = Rutenium
    .rh = Rodium
    .pd = Palladium
    .ag = Silvur
    .cd = Kadmium
    .in = Indium
    .sn = Tinn
    .sb = Antimon
    .te = Tellur
    .i = Jod
    .xe = Xenon
    .cs = Sesium
    .ba = Barium
    .la = Lantan
    .ce = Serium
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
    .w = Wolfram
    .re = Renium
    .os = Osmium
    .ir = Iridium
    .pt = Platin
    .au = Gull
    .hg = Kvikasilvur
    .tl = Tallium
    .pb = Blýggj
    .bi = Bismut
    .po = Polonium
    .at = Astat
    .rn = Radon
    .fr = Fransium
    .ra = Radium
    .ac = Aktinium
    .th = Torium
    .pa = Protaktinium
    .u = Uran
    .np = Neptunium
    .pu = Plutonium
    .am = Amerisium
    .cm = Kurium
    .bk = Berkelium
    .cf = Kalifornium
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
    .cn = Kopernikium
    .nh = Nihonium
    .fl = Flerovium
    .mc = Moskovium
    .lv = Livermorium
    .ts = Tennessin
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

chemistry-invalid-symbol = Ógildugt evnafrøðiligt tekn
chemistry-invalid-ionic-compound = Ógildugt iónsamband

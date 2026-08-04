# Icelandic content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Icelandic keeps four cases and three genders, and an attributive adjective
# agrees with its noun in both. Adjectives precede the noun as they do in
# English, so the composition messages keep the English order — and a
# describing word selects on `$role` first and then, in the position where the
# noun is not fixed, on `$gender`. That is the shape `locales/de` already has,
# with two Icelandic differences noted below:
#
#   standalone          nominative: `-ur` m, `-∅` f, `-t` n
#   border-clause       after «með», which governs the dative, of «jaðar» —
#                       masculine: `-um`
#   background-clause   after «á», dative here, of «bakgrunnur» — masculine:
#                       `-um`
#
# The two clause positions need no gender branch: each is only ever used of one
# noun, and that noun's gender is fixed. Both land on the same `-um`, which is a
# fact about Icelandic and not a duplicated branch — «með» and «á» simply govern
# the same case here.
#
# `text-clause` is written nowhere, and that is the first difference from
# German. German goes uninflected there («rot») while its standalone masculine
# is «roter»; Icelandic wants the plain nominative masculine agreeing with
# «texti», which is exactly what the `$gender` fork underneath already gives,
# so a branch for it would only restate the default.
#
# The second: only `describeColor` ever asks for `background-clause`, so
# `line-width` and `line-style` carry `border-clause` alone. A stroke width is
# never said of a background or of text.


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] svörtum
            [background-clause] svörtum
           *[standalone]
                { $gender ->
                    [f] svört
                    [n] svart
                   *[m] svartur
                }
        }
    .white =
        { $role ->
            [border-clause] hvítum
            [background-clause] hvítum
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
            [background-clause] gráum
           *[standalone]
                { $gender ->
                    [f] grá
                    [n] grátt
                   *[m] grár
                }
        }
    .red =
        { $role ->
            [border-clause] rauðum
            [background-clause] rauðum
           *[standalone]
                { $gender ->
                    [f] rauð
                    [n] rautt
                   *[m] rauður
                }
        }
    .orange =
        { $role ->
            [border-clause] appelsínugulum
            [background-clause] appelsínugulum
           *[standalone]
                { $gender ->
                    [f] appelsínugul
                    [n] appelsínugult
                   *[m] appelsínugulur
                }
        }
    .yellow =
        { $role ->
            [border-clause] gulum
            [background-clause] gulum
           *[standalone]
                { $gender ->
                    [f] gul
                    [n] gult
                   *[m] gulur
                }
        }
    .green =
        { $role ->
            [border-clause] grænum
            [background-clause] grænum
           *[standalone]
                { $gender ->
                    [f] græn
                    [n] grænt
                   *[m] grænn
                }
        }
    .cyan =
        { $role ->
            [border-clause] blágrænum
            [background-clause] blágrænum
           *[standalone]
                { $gender ->
                    [f] blágræn
                    [n] blágrænt
                   *[m] blágrænn
                }
        }
    .blue =
        { $role ->
            [border-clause] bláum
            [background-clause] bláum
           *[standalone]
                { $gender ->
                    [f] blá
                    [n] blátt
                   *[m] blár
                }
        }
    .purple =
        { $role ->
            [border-clause] fjólubláum
            [background-clause] fjólubláum
           *[standalone]
                { $gender ->
                    [f] fjólublá
                    [n] fjólublátt
                   *[m] fjólublár
                }
        }
    .pink =
        { $role ->
            [border-clause] bleikum
            [background-clause] bleikum
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
            [background-clause] brúnum
           *[standalone]
                { $gender ->
                    [f] brún
                    [n] brúnt
                   *[m] brúnn
                }
        }

line-width =
    .thick =
        { $role ->
            [border-clause] þykkum
           *[standalone]
                { $gender ->
                    [f] þykk
                    [n] þykkt
                   *[m] þykkur
                }
        }
    .thin =
        { $role ->
            [border-clause] þunnum
           *[standalone]
                { $gender ->
                    [f] þunn
                    [n] þunnt
                   *[m] þunnur
                }
        }

line-style =
    .dashed =
        { $role ->
            [border-clause] strikuðum
           *[standalone]
                { $gender ->
                    [f] strikuð
                    [n] strikað
                   *[m] strikaður
                }
        }
    .dotted =
        { $role ->
            [border-clause] punktuðum
           *[standalone]
                { $gender ->
                    [f] punktuð
                    [n] punktað
                   *[m] punktaður
                }
        }

# Noun phrases in the dative plural, which is the case «með» takes. They agree
# with nothing.
fill-style =
    .horizontal = láréttum línum
    .vertical = lóðréttum línum
    .diagonal = skálínum
    .backdiagonal = öfugum skálínum
    .dots = punktum
    .diamonds = tíglum

noun =
    .line = lína
    .line-segment = línustrik
    .ray = geisli
    .vector = vigur
    .curve = ferill
    .function = fall
    .parabola = fleygbogi
    .polyline = brotalína
    .polygon = marghyrningur
    .triangle = þríhyrningur
    .rectangle = rétthyrningur
    .circle = hringur
    .region = svæði
    .point = punktur
    .square = ferningur
    .diamond = tígull
    .cross = kross
    .plus = plús

# Icelandic builds the side count into the noun in front of it, so the whole of
# it is one head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] reglulegur { $numSides }-hyrningur
    }

# Besides the nouns above, `$noun` can be `regular-polygon` (marghyrningur, m)
# or the head of a phrase the description never names: `border` (jaðar, m),
# `fill` (fylling, f), `text` (texti, m), `background` (bakgrunnur, m).
noun-gender =
    { $noun ->
        [line] f
        [polyline] f
        [fill] f
        [line-segment] n
        [function] n
        [region] n
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
        [f] fyllt
        [n] fyllt
       *[m] fylltur
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } með { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } með { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } með { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

# «jaðar» is masculine and stands in the dative after «með», so the border's
# adjectives agree with it and not with the shape it surrounds. Icelandic has
# no indefinite article, so the two `-article` branches read like the two
# without.
style-border-clause =
    { $parts ->
        [with-article] með { $border } jaðri
        [and] og { $border } jaðri
        [and-article] og { $border } jaðri
       *[with] með { $border } jaðri
    }

# The fill-pattern words are dative plurals, because their other use is the
# «með { $pattern }» clause above. So this message supplies a noun for them to
# hang off — «fylling», feminine, which is the gender `noun-gender` already
# answers for `fill`, so the colour agrees with it in both variants.
style-fill =
    { $parts ->
        [pattern] { $color } fylling með { $pattern }
       *[plain] { $color }
    }

style-unfilled = ófyllt

style-text =
    { $parts ->
        [background] { $color } á { $background } bakgrunni
       *[plain] { $color }
    }

style-background-none = enginn


## Boolean words

boolean-true = satt
boolean-false = ósatt


## Answer buttons

answer-submit-label = Athuga svar
answer-submit-label-no-correctness = Senda svar


## Sectional blocks

# «Verkefni» is the ordinary Icelandic word for both an activity and a problem,
# so the two are kept apart here: an activity holds the problems, and a heading
# «Verkefni» over «Verkefni 1» and «Verkefni 2» would say nothing. A problem is
# «þraut», the word Icelandic schools use for one worked-at question.
section-name =
    .activity = Verkefni
    .aside = Hliðargrein
    .cascade = Runa
    .definition = Skilgreining
    .example = Dæmi
    .exercise = Æfing
    .exercises = Æfingar
    .given-answer = Svar
    .note = Athugasemd
    .objectives = Markmið
    .paragraphs = Málsgreinar
    .part = Hluti
    .problem = Þraut
    .problems = Þrautir
    .proof = Sönnun
    .question = Spurning
    .section = Kafli
    .solution = Lausn
    .task = Viðfangsefni
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

hint-title = Vísbending


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tafla { $enumeration }
        [numbered-title] Tafla { $enumeration }{ ": " }
        [unnumbered-title] Tafla{ ": " }
       *[unnumbered] Tafla
    }

figure-name =
    { $parts ->
        [numbered] Mynd { $enumeration }
        [numbered-caption] Mynd { $enumeration }{ ": " }
        [unnumbered-caption] Mynd{ ": " }
       *[unnumbered] Mynd
    }


## Paginator controls

paginator-previous = Fyrri
paginator-next = Næsta
paginator-page = Síða

paginator-page-status = { $pageLabel } { $currentPage } af { $numPages }


## Piecewise functions

piecewise-condition-or = eða
piecewise-condition-if = ef
piecewise-condition-otherwise = annars


## Chemistry

element-name =
    .h = Vetni
    .he = Helín
    .li = Litín
    .be = Beryllín
    .b = Bór
    .c = Kolefni
    .n = Nitur
    .o = Súrefni
    .f = Flúor
    .ne = Neon
    .na = Natrín
    .mg = Magnesín
    .al = Ál
    .si = Kísill
    .p = Fosfór
    .s = Brennisteinn
    .cl = Klór
    .ar = Argon
    .k = Kalín
    .ca = Kalsín
    .sc = Skandín
    .ti = Títan
    .v = Vanadín
    .cr = Króm
    .mn = Mangan
    .fe = Járn
    .co = Kóbalt
    .ni = Nikkel
    .cu = Kopar
    .zn = Sink
    .ga = Gallín
    .ge = German
    .as = Arsen
    .se = Selen
    .br = Bróm
    .kr = Krypton
    .rb = Rúbidín
    .sr = Strontín
    .y = Yttrín
    .zr = Sirkon
    .nb = Níóbín
    .mo = Mólybden
    .tc = Teknetín
    .ru = Rúten
    .rh = Ródín
    .pd = Palladín
    .ag = Silfur
    .cd = Kadmín
    .in = Indín
    .sn = Tin
    .sb = Antímon
    .te = Tellúr
    .i = Joð
    .xe = Xenon
    .cs = Sesín
    .ba = Barín
    .la = Lantan
    .ce = Serín
    .pr = Praseódým
    .nd = Neódým
    .pm = Prómetín
    .sm = Samarín
    .eu = Evrópín
    .gd = Gadólín
    .tb = Terbín
    .dy = Dysprósín
    .ho = Hólmín
    .er = Erbín
    .tm = Túlín
    .yb = Ytterbín
    .lu = Lútetín
    .hf = Hafnín
    .ta = Tantal
    .w = Volfram
    .re = Renín
    .os = Osmín
    .ir = Iridín
    .pt = Platína
    .au = Gull
    .hg = Kvikasilfur
    .tl = Þallín
    .pb = Blý
    .bi = Bismút
    .po = Pólon
    .at = Astat
    .rn = Radon
    .fr = Fransín
    .ra = Radín
    .ac = Aktín
    .th = Þórín
    .pa = Prótaktín
    .u = Úran
    .np = Neptún
    .pu = Plúton
    .am = Amerikín
    .cm = Kúrín
    .bk = Berkelín
    .cf = Kaliforn
    .es = Einsteinín
    .fm = Fermín
    .md = Mendelevín
    .no = Nóbelín
    .lr = Lárensín
    .rf = Rutherfordín
    .db = Dubnín
    .sg = Seaborgín
    .bh = Bohrín
    .hs = Hassín
    .mt = Meitnerín
    .ds = Darmstadtín
    .rg = Röntgenín
    .cn = Kópernikín
    .nh = Nihonín
    .fl = Fleróvín
    .mc = Moskóvín
    .lv = Livermorín
    .ts = Tenness
    .og = Óganesson

element-anion-name =
    .h = Hýdríð
    .c = Karbíð
    .n = Nítríð
    .o = Oxíð
    .f = Flúoríð
    .p = Fosfíð
    .s = Súlfíð
    .cl = Klóríð
    .br = Brómíð
    .i = Joðíð
    .at = Astatíð
    .ts = Tennessíð

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Ógilt efnatákn
chemistry-invalid-ionic-compound = Ógilt jónaefnasamband

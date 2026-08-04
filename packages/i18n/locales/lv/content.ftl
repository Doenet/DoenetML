# Latvian content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Latvian inflects for seven cases and has two genders. Adjectives precede
# their noun and agree with it in gender and in the case its position governs,
# so every describing word below selects on `$role` first and only then, where
# it matters, on `$gender`:
#
#   standalone          nominative indefinite: `-s`/`-š` m, `-a` f
#   border-clause       after «ar», which governs the accusative in the
#                       singular, of «apmale» — feminine: `-u`
#   background-clause   after «uz», which governs the genitive, of «fons» —
#                       masculine: `-a`
#   text-clause         nominative masculine, agreeing with «teksts»
#
# Two different cases, one per clause, of two different genders — where
# `locales/lt`, the only other Baltic catalog here, has all four of its heads
# masculine and so needs no gender in any clause.
#
# The genitive masculine and the nominative feminine are spelled alike, so the
# background's colour reads the same as a standalone feminine. That is a fact
# about the endings rather than a collapsed distinction, and the branch is
# written out so that a correction to one does not silently move the other —
# the shape `locales/gu` and `locales/pa` already have for the same reason.
#
# «rozā» is an indeclinable loan and takes no ending in any of the four
# positions, so it selects on nothing and is written as one string.


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] melnu
            [background-clause] melna
            [text-clause] melns
           *[standalone]
                { $gender ->
                    [f] melna
                   *[m] melns
                }
        }
    .white =
        { $role ->
            [border-clause] baltu
            [background-clause] balta
            [text-clause] balts
           *[standalone]
                { $gender ->
                    [f] balta
                   *[m] balts
                }
        }
    .gray =
        { $role ->
            [border-clause] pelēku
            [background-clause] pelēka
            [text-clause] pelēks
           *[standalone]
                { $gender ->
                    [f] pelēka
                   *[m] pelēks
                }
        }
    .red =
        { $role ->
            [border-clause] sarkanu
            [background-clause] sarkana
            [text-clause] sarkans
           *[standalone]
                { $gender ->
                    [f] sarkana
                   *[m] sarkans
                }
        }
    .orange =
        { $role ->
            [border-clause] oranžu
            [background-clause] oranža
            [text-clause] oranžs
           *[standalone]
                { $gender ->
                    [f] oranža
                   *[m] oranžs
                }
        }
    .yellow =
        { $role ->
            [border-clause] dzeltenu
            [background-clause] dzeltena
            [text-clause] dzeltens
           *[standalone]
                { $gender ->
                    [f] dzeltena
                   *[m] dzeltens
                }
        }
    .green =
        { $role ->
            [border-clause] zaļu
            [background-clause] zaļa
            [text-clause] zaļš
           *[standalone]
                { $gender ->
                    [f] zaļa
                   *[m] zaļš
                }
        }
    .cyan =
        { $role ->
            [border-clause] gaiši zilu
            [background-clause] gaiši zila
            [text-clause] gaiši zils
           *[standalone]
                { $gender ->
                    [f] gaiši zila
                   *[m] gaiši zils
                }
        }
    .blue =
        { $role ->
            [border-clause] zilu
            [background-clause] zila
            [text-clause] zils
           *[standalone]
                { $gender ->
                    [f] zila
                   *[m] zils
                }
        }
    .purple =
        { $role ->
            [border-clause] violetu
            [background-clause] violeta
            [text-clause] violets
           *[standalone]
                { $gender ->
                    [f] violeta
                   *[m] violets
                }
        }
    .pink = rozā
    .brown =
        { $role ->
            [border-clause] brūnu
            [background-clause] brūna
            [text-clause] brūns
           *[standalone]
                { $gender ->
                    [f] brūna
                   *[m] brūns
                }
        }

line-width =
    .thick =
        { $role ->
            [border-clause] biezu
            [background-clause] bieza
            [text-clause] biezs
           *[standalone]
                { $gender ->
                    [f] bieza
                   *[m] biezs
                }
        }
    .thin =
        { $role ->
            [border-clause] plānu
            [background-clause] plāna
            [text-clause] plāns
           *[standalone]
                { $gender ->
                    [f] plāna
                   *[m] plāns
                }
        }

line-style =
    .dashed =
        { $role ->
            [border-clause] pārtrauktu
            [background-clause] pārtraukta
            [text-clause] pārtraukts
           *[standalone]
                { $gender ->
                    [f] pārtraukta
                   *[m] pārtraukts
                }
        }
    .dotted =
        { $role ->
            [border-clause] punktētu
            [background-clause] punktēta
            [text-clause] punktēts
           *[standalone]
                { $gender ->
                    [f] punktēta
                   *[m] punktēts
                }
        }

# Noun phrases in the dative, which is the case every Latvian preposition takes
# in the plural — so «ar» governs the accusative in `style-border-clause` above
# and the dative here. They agree with nothing.
fill-style =
    .horizontal = horizontālām līnijām
    .vertical = vertikālām līnijām
    .diagonal = diagonālām līnijām
    .backdiagonal = apgrieztām diagonālām līnijām
    .dots = punktiem
    .diamonds = rombiem

noun =
    .line = taisne
    .line-segment = nogrieznis
    .ray = stars
    .vector = vektors
    .curve = līkne
    .function = funkcija
    .parabola = parabola
    .polyline = lauzta līnija
    .polygon = daudzstūris
    .triangle = trijstūris
    .rectangle = taisnstūris
    .circle = riņķa līnija
    .region = apgabals
    .point = punkts
    .square = kvadrāts
    .diamond = rombs
    .cross = krusts
    .plus = pluss

# Latvian keeps the side count in front of the noun, so the whole of it is one
# head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] regulārs { $numSides }-stūris
    }

# Besides the nouns above, `$noun` can be `regular-polygon` (daudzstūris, m) or
# the head of a phrase the description never names: `border` (apmale, f),
# `fill` (pildījums, m), `text` (teksts, m), `background` (fons, m).
noun-gender =
    { $noun ->
        [line] f
        [curve] f
        [function] f
        [parabola] f
        [polyline] f
        [circle] f
        [border] f
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
        [f] aizpildīta
       *[m] aizpildīts
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } ar { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } ar { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } ar { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

# «apmale» is feminine, so the border's adjectives agree with it and not with
# the shape it surrounds. Latvian has no article, so the two `-article`
# branches read like the two without.
style-border-clause =
    { $parts ->
        [with-article] ar { $border } apmali
        [and] un { $border } apmali
        [and-article] un { $border } apmali
       *[with] ar { $border } apmali
    }

# The fill-pattern words are dative plurals, because their other use is the
# «ar { $pattern }» clause in `style-filled`. So this message supplies a noun
# for them to hang off — «pildījums», masculine, which is the gender
# `noun-gender` already answers for `fill`.
style-fill =
    { $parts ->
        [pattern] { $color } pildījums ar { $pattern }
       *[plain] { $color } pildījums
    }

style-unfilled = neaizpildīts

style-text =
    { $parts ->
        [background] { $color } uz { $background } fona
       *[plain] { $color }
    }

style-background-none = nav


## Boolean words

boolean-true = patiess
boolean-false = aplams


## Answer buttons

answer-submit-label = Pārbaudīt
answer-submit-label-no-correctness = Iesniegt atbildi


## Sectional blocks

section-name =
    .activity = Darbība
    .aside = Atkāpe
    .cascade = Kaskāde
    .definition = Definīcija
    .example = Piemērs
    .exercise = Vingrinājums
    .exercises = Vingrinājumi
    .given-answer = Atbilde
    .note = Piezīme
    .objectives = Mērķi
    .paragraphs = Rindkopas
    .part = Daļa
    .problem = Uzdevums
    .problems = Uzdevumi
    .proof = Pierādījums
    .question = Jautājums
    .section = Sadaļa
    .solution = Risinājums
    .task = Uzdevums
    .theorem = Teorēma

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ". " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ". " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Padoms


## Tables and figures

table-name =
    { $parts ->
        [numbered] { $enumeration }. tabula
        [numbered-title] { $enumeration }. tabula{ ". " }
        [unnumbered-title] Tabula{ ". " }
       *[unnumbered] Tabula
    }

figure-name =
    { $parts ->
        [numbered] { $enumeration }. attēls
        [numbered-caption] { $enumeration }. attēls{ ". " }
        [unnumbered-caption] Attēls{ ". " }
       *[unnumbered] Attēls
    }


## Paginator controls

paginator-previous = Iepriekšējā
paginator-next = Nākamā
paginator-page = Lappuse

paginator-page-status = { $pageLabel } { $currentPage } no { $numPages }


## Piecewise functions

piecewise-condition-or = vai
piecewise-condition-if = ja
piecewise-condition-otherwise = citādi


## Chemistry

element-name =
    .h = Ūdeņradis
    .he = Hēlijs
    .li = Litijs
    .be = Berilijs
    .b = Bors
    .c = Ogleklis
    .n = Slāpeklis
    .o = Skābeklis
    .f = Fluors
    .ne = Neons
    .na = Nātrijs
    .mg = Magnijs
    .al = Alumīnijs
    .si = Silīcijs
    .p = Fosfors
    .s = Sērs
    .cl = Hlors
    .ar = Argons
    .k = Kālijs
    .ca = Kalcijs
    .sc = Skandijs
    .ti = Titāns
    .v = Vanādijs
    .cr = Hroms
    .mn = Mangāns
    .fe = Dzelzs
    .co = Kobalts
    .ni = Niķelis
    .cu = Varš
    .zn = Cinks
    .ga = Gallijs
    .ge = Germānijs
    .as = Arsēns
    .se = Selēns
    .br = Broms
    .kr = Kriptons
    .rb = Rubīdijs
    .sr = Stroncijs
    .y = Itrijs
    .zr = Cirkonijs
    .nb = Niobijs
    .mo = Molibdēns
    .tc = Tehnēcijs
    .ru = Rutēnijs
    .rh = Rodijs
    .pd = Pallādijs
    .ag = Sudrabs
    .cd = Kadmijs
    .in = Indijs
    .sn = Alva
    .sb = Antimons
    .te = Telūrs
    .i = Jods
    .xe = Ksenons
    .cs = Cēzijs
    .ba = Bārijs
    .la = Lantāns
    .ce = Cērijs
    .pr = Prazeodims
    .nd = Neodims
    .pm = Prometijs
    .sm = Samārijs
    .eu = Eiropijs
    .gd = Gadolīnijs
    .tb = Terbijs
    .dy = Disprozijs
    .ho = Holmijs
    .er = Erbijs
    .tm = Tūlijs
    .yb = Iterbijs
    .lu = Lutēcijs
    .hf = Hafnijs
    .ta = Tantals
    .w = Volframs
    .re = Rēnijs
    .os = Osmijs
    .ir = Irīdijs
    .pt = Platīns
    .au = Zelts
    .hg = Dzīvsudrabs
    .tl = Tallijs
    .pb = Svins
    .bi = Bismuts
    .po = Polonijs
    .at = Astats
    .rn = Radons
    .fr = Francijs
    .ra = Rādijs
    .ac = Aktīnijs
    .th = Torijs
    .pa = Protaktīnijs
    .u = Urāns
    .np = Neptūnijs
    .pu = Plutonijs
    .am = Amerīcijs
    .cm = Kirijs
    .bk = Berkelijs
    .cf = Kalifornijs
    .es = Einšteinijs
    .fm = Fermijs
    .md = Mendelevijs
    .no = Nobēlijs
    .lr = Lourensijs
    .rf = Rezerfordijs
    .db = Dubnijs
    .sg = Sīborgijs
    .bh = Borijs
    .hs = Hasijs
    .mt = Meitnērijs
    .ds = Darmštatijs
    .rg = Rentgēnijs
    .cn = Kopernicijs
    .nh = Nihonijs
    .fl = Flerovijs
    .mc = Moskovijs
    .lv = Livermorijs
    .ts = Tenesīns
    .og = Oganesons

element-anion-name =
    .h = Hidrīds
    .c = Karbīds
    .n = Nitrīds
    .o = Oksīds
    .f = Fluorīds
    .p = Fosfīds
    .s = Sulfīds
    .cl = Hlorīds
    .br = Bromīds
    .i = Jodīds
    .at = Astatīds
    .ts = Tenesīds

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Nederīgs ķīmiskais simbols
chemistry-invalid-ionic-compound = Nederīgs jonu savienojums

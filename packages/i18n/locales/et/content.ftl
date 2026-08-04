# Estonian content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Estonian has fourteen cases and no grammatical gender at all, which makes it
# the exact mirror of `locales/bg` and `locales/mk`: every describing word below
# forks on `$role` and not one of them consults `$gender`.
#
#   standalone          nominative: «punane»
#   border-clause       genitive, agreeing with «ääris» in the comitative:
#                       «punase»
#   background-clause   adessive, agreeing with «taust» in the adessive:
#                       «punasel»
#   text-clause         nominative, agreeing with «tekst»
#
# Estonian marks all three of those with an ending on the noun rather than with
# a preposition, so `style-border-clause` and `style-text` below place nothing
# in front of the colour — a shape neither English nor any of the Slavic
# catalogs here has. The fill patterns carry their own comitative `-ga` for the
# same reason, so the messages that place them supply no connective either.


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] musta
            [background-clause] mustal
           *[standalone] must
        }
    .white =
        { $role ->
            [border-clause] valge
            [background-clause] valgel
           *[standalone] valge
        }
    .gray =
        { $role ->
            [border-clause] halli
            [background-clause] hallil
           *[standalone] hall
        }
    .red =
        { $role ->
            [border-clause] punase
            [background-clause] punasel
           *[standalone] punane
        }
    .orange =
        { $role ->
            [border-clause] oranži
            [background-clause] oranžil
           *[standalone] oranž
        }
    .yellow =
        { $role ->
            [border-clause] kollase
            [background-clause] kollasel
           *[standalone] kollane
        }
    .green =
        { $role ->
            [border-clause] rohelise
            [background-clause] rohelisel
           *[standalone] roheline
        }
    .cyan =
        { $role ->
            [border-clause] tsüaani
            [background-clause] tsüaanil
           *[standalone] tsüaan
        }
    .blue =
        { $role ->
            [border-clause] sinise
            [background-clause] sinisel
           *[standalone] sinine
        }
    .purple =
        { $role ->
            [border-clause] lilla
            [background-clause] lillal
           *[standalone] lilla
        }
    .pink =
        { $role ->
            [border-clause] roosa
            [background-clause] roosal
           *[standalone] roosa
        }
    .brown =
        { $role ->
            [border-clause] pruuni
            [background-clause] pruunil
           *[standalone] pruun
        }

line-width =
    .thick =
        { $role ->
            [border-clause] paksu
            [background-clause] paksul
           *[standalone] paks
        }
    .thin =
        { $role ->
            [border-clause] peenikese
            [background-clause] peenikesel
           *[standalone] peenike
        }

line-style =
    .dashed =
        { $role ->
            [border-clause] katkendliku
            [background-clause] katkendlikul
           *[standalone] katkendlik
        }
    .dotted =
        { $role ->
            [border-clause] punktiirilise
            [background-clause] punktiirilisel
           *[standalone] punktiiriline
        }

# Comitative plurals — the case that renders as "with" in English. The ending
# carries the sense, so nothing is written in front of them where they are
# placed.
fill-style =
    .horizontal = horisontaaljoontega
    .vertical = vertikaaljoontega
    .diagonal = diagonaaljoontega
    .backdiagonal = vastupidiste diagonaaljoontega
    .dots = punktidega
    .diamonds = rombidega

noun =
    .line = sirge
    .line-segment = lõik
    .ray = kiir
    .vector = vektor
    .curve = kõver
    .function = funktsioon
    .parabola = parabool
    .polyline = murdjoon
    .polygon = hulknurk
    .triangle = kolmnurk
    .rectangle = ristkülik
    .circle = ringjoon
    .region = piirkond
    .point = punkt
    .square = ruut
    .diamond = romb
    .cross = rist
    .plus = pluss

# Estonian keeps the side count in front of the noun, so the whole of it is one
# head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] korrapärane { $numSides }-nurk
    }

# Estonian has no grammatical gender, so every noun answers the same and the
# answer goes unused — the same thing `locales/en` does, and for the same
# reason. What this catalog agrees for is case, which `$role` carries.
noun-gender = none


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

# A participle, which does not decline here, so it needs neither argument.
style-filled-word = täidetud

# `{ $pattern }` is already comitative, so no connective is written.
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

# «äärisega» is the comitative of «ääris», and it is the ending rather than a
# preposition that says "with" — so the clause opens on the border's own
# adjectives. Estonian has no article, so the two `-article` branches read like
# the two without.
style-border-clause =
    { $parts ->
        [with-article] { $border } äärisega
        [and] ja { $border } äärisega
        [and-article] ja { $border } äärisega
       *[with] { $border } äärisega
    }

# The fill-pattern words are comitatives, so this message supplies «täide» for
# the colour to stand with; the pattern follows it already inflected.
style-fill =
    { $parts ->
        [pattern] { $color } täide { $pattern }
       *[plain] { $color } täide
    }

style-unfilled = täitmata

# «taustal» is the adessive of «taust», and the colour in front of it is
# adessive too. Nothing stands between the two colours.
style-text =
    { $parts ->
        [background] { $color } { $background } taustal
       *[plain] { $color }
    }

style-background-none = puudub


## Boolean words

boolean-true = tõene
boolean-false = väär


## Answer buttons

answer-submit-label = Kontrolli
answer-submit-label-no-correctness = Saada vastus


## Sectional blocks

section-name =
    .activity = Tegevus
    .aside = Kõrvalepõige
    .cascade = Kaskaad
    .definition = Definitsioon
    .example = Näide
    .exercise = Harjutus
    .exercises = Harjutused
    .given-answer = Vastus
    .note = Märkus
    .objectives = Eesmärgid
    .paragraphs = Lõigud
    .part = Osa
    .problem = Ülesanne
    .problems = Ülesanded
    .proof = Tõestus
    .question = Küsimus
    .section = Jaotis
    .solution = Lahendus
    .task = Ülesanne
    .theorem = Teoreem

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ". " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ". " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Vihje


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabel { $enumeration }
        [numbered-title] Tabel { $enumeration }{ ". " }
        [unnumbered-title] Tabel{ ". " }
       *[unnumbered] Tabel
    }

figure-name =
    { $parts ->
        [numbered] Joonis { $enumeration }
        [numbered-caption] Joonis { $enumeration }{ ". " }
        [unnumbered-caption] Joonis{ ". " }
       *[unnumbered] Joonis
    }


## Paginator controls

paginator-previous = Eelmine
paginator-next = Järgmine
paginator-page = Lehekülg

paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = või
piecewise-condition-if = kui
piecewise-condition-otherwise = muul juhul


## Chemistry

element-name =
    .h = Vesinik
    .he = Heelium
    .li = Liitium
    .be = Berüllium
    .b = Boor
    .c = Süsinik
    .n = Lämmastik
    .o = Hapnik
    .f = Fluor
    .ne = Neoon
    .na = Naatrium
    .mg = Magneesium
    .al = Alumiinium
    .si = Räni
    .p = Fosfor
    .s = Väävel
    .cl = Kloor
    .ar = Argoon
    .k = Kaalium
    .ca = Kaltsium
    .sc = Skandium
    .ti = Titaan
    .v = Vanaadium
    .cr = Kroom
    .mn = Mangaan
    .fe = Raud
    .co = Koobalt
    .ni = Nikkel
    .cu = Vask
    .zn = Tsink
    .ga = Gallium
    .ge = Germaanium
    .as = Arseen
    .se = Seleen
    .br = Broom
    .kr = Krüptoon
    .rb = Rubiidium
    .sr = Strontsium
    .y = Ütrium
    .zr = Tsirkoonium
    .nb = Nioobium
    .mo = Molübdeen
    .tc = Tehneetsium
    .ru = Ruteenium
    .rh = Roodium
    .pd = Pallaadium
    .ag = Hõbe
    .cd = Kaadmium
    .in = Indium
    .sn = Tina
    .sb = Antimon
    .te = Telluur
    .i = Jood
    .xe = Ksenoon
    .cs = Tseesium
    .ba = Baarium
    .la = Lantaan
    .ce = Tseerium
    .pr = Praseodüüm
    .nd = Neodüüm
    .pm = Promeetium
    .sm = Samaarium
    .eu = Euroopium
    .gd = Gadoliinium
    .tb = Terbium
    .dy = Düsproosium
    .ho = Holmium
    .er = Erbium
    .tm = Tuulium
    .yb = Üterbium
    .lu = Luteetsium
    .hf = Hafnium
    .ta = Tantaal
    .w = Volfram
    .re = Reenium
    .os = Osmium
    .ir = Iriidium
    .pt = Plaatina
    .au = Kuld
    .hg = Elavhõbe
    .tl = Tallium
    .pb = Plii
    .bi = Vismut
    .po = Poloonium
    .at = Astaat
    .rn = Radoon
    .fr = Frantsium
    .ra = Raadium
    .ac = Aktiinium
    .th = Toorium
    .pa = Protaktiinium
    .u = Uraan
    .np = Neptuunium
    .pu = Plutoonium
    .am = Ameriitsium
    .cm = Küürium
    .bk = Berkeelium
    .cf = Kalifornium
    .es = Einsteinium
    .fm = Fermium
    .md = Mendeleevium
    .no = Nobeelium
    .lr = Lavrentsium
    .rf = Rutherfordium
    .db = Dubnium
    .sg = Seaborgium
    .bh = Bohrium
    .hs = Hassium
    .mt = Meitnerium
    .ds = Darmstadtium
    .rg = Röntgeenium
    .cn = Kopernitsium
    .nh = Nihoonium
    .fl = Flerovium
    .mc = Moskoovium
    .lv = Livermoorium
    .ts = Tennessiin
    .og = Oganesson

element-anion-name =
    .h = Hüdriid
    .c = Karbiid
    .n = Nitriid
    .o = Oksiid
    .f = Fluoriid
    .p = Fosfiid
    .s = Sulfiid
    .cl = Kloriid
    .br = Bromiid
    .i = Jodiid
    .at = Astatiid
    .ts = Tennessiid

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Vigane keemiline sümbol
chemistry-invalid-ionic-compound = Vigane ioonne ühend

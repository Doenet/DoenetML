# Croatian content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Croatian inflects for seven cases and has three genders. Adjectives precede
# their noun and agree with it in gender and in the case its position governs,
# so every describing word below selects on `$role` first — which position the
# words are going into — and only then, where it matters, on `$gender`:
#
#   standalone          nominative: `-∅` m, `-a` f, `-o`/`-e` n
#   border-clause       after «s», which governs the instrumental, of «rub» —
#                       masculine: `-im`
#   background-clause   after «na», locative here, of «pozadina» — feminine:
#                       `-oj`
#   text-clause         nominative masculine, agreeing with «tekst»
#
# The last three need no gender branch: each is only ever used of one noun, and
# that noun's gender is fixed. This is the same shape `locales/ru` has, with
# Croatian's own two cases in the two clauses.


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] crnim
            [background-clause] crnoj
            [text-clause] crn
           *[standalone]
                { $gender ->
                    [f] crna
                    [n] crno
                   *[m] crn
                }
        }
    .white =
        { $role ->
            [border-clause] bijelim
            [background-clause] bijeloj
            [text-clause] bijel
           *[standalone]
                { $gender ->
                    [f] bijela
                    [n] bijelo
                   *[m] bijel
                }
        }
    .gray =
        { $role ->
            [border-clause] sivim
            [background-clause] sivoj
            [text-clause] siv
           *[standalone]
                { $gender ->
                    [f] siva
                    [n] sivo
                   *[m] siv
                }
        }
    .red =
        { $role ->
            [border-clause] crvenim
            [background-clause] crvenoj
            [text-clause] crven
           *[standalone]
                { $gender ->
                    [f] crvena
                    [n] crveno
                   *[m] crven
                }
        }
    .orange =
        { $role ->
            [border-clause] narančastim
            [background-clause] narančastoj
            [text-clause] narančast
           *[standalone]
                { $gender ->
                    [f] narančasta
                    [n] narančasto
                   *[m] narančast
                }
        }
    .yellow =
        { $role ->
            [border-clause] žutim
            [background-clause] žutoj
            [text-clause] žut
           *[standalone]
                { $gender ->
                    [f] žuta
                    [n] žuto
                   *[m] žut
                }
        }
    .green =
        { $role ->
            [border-clause] zelenim
            [background-clause] zelenoj
            [text-clause] zelen
           *[standalone]
                { $gender ->
                    [f] zelena
                    [n] zeleno
                   *[m] zelen
                }
        }
    .cyan =
        { $role ->
            [border-clause] tirkiznim
            [background-clause] tirkiznoj
            [text-clause] tirkizan
           *[standalone]
                { $gender ->
                    [f] tirkizna
                    [n] tirkizno
                   *[m] tirkizan
                }
        }
    .blue =
        { $role ->
            [border-clause] plavim
            [background-clause] plavoj
            [text-clause] plav
           *[standalone]
                { $gender ->
                    [f] plava
                    [n] plavo
                   *[m] plav
                }
        }
    .purple =
        { $role ->
            [border-clause] ljubičastim
            [background-clause] ljubičastoj
            [text-clause] ljubičast
           *[standalone]
                { $gender ->
                    [f] ljubičasta
                    [n] ljubičasto
                   *[m] ljubičast
                }
        }
    .pink =
        { $role ->
            [border-clause] ružičastim
            [background-clause] ružičastoj
            [text-clause] ružičast
           *[standalone]
                { $gender ->
                    [f] ružičasta
                    [n] ružičasto
                   *[m] ružičast
                }
        }
    .brown =
        { $role ->
            [border-clause] smeđim
            [background-clause] smeđoj
            [text-clause] smeđ
           *[standalone]
                { $gender ->
                    [f] smeđa
                    [n] smeđe
                   *[m] smeđ
                }
        }

line-width =
    .thick =
        { $role ->
            [border-clause] debelim
            [background-clause] debeloj
            [text-clause] debeo
           *[standalone]
                { $gender ->
                    [f] debela
                    [n] debelo
                   *[m] debeo
                }
        }
    .thin =
        { $role ->
            [border-clause] tankim
            [background-clause] tankoj
            [text-clause] tanak
           *[standalone]
                { $gender ->
                    [f] tanka
                    [n] tanko
                   *[m] tanak
                }
        }

line-style =
    .dashed =
        { $role ->
            [border-clause] crtkanim
            [background-clause] crtkanoj
            [text-clause] crtkan
           *[standalone]
                { $gender ->
                    [f] crtkana
                    [n] crtkano
                   *[m] crtkan
                }
        }
    .dotted =
        { $role ->
            [border-clause] točkastim
            [background-clause] točkastoj
            [text-clause] točkast
           *[standalone]
                { $gender ->
                    [f] točkasta
                    [n] točkasto
                   *[m] točkast
                }
        }

# Noun phrases in the instrumental, which is the case «s» takes. They agree
# with nothing.
fill-style =
    .horizontal = vodoravnim crtama
    .vertical = okomitim crtama
    .diagonal = dijagonalnim crtama
    .backdiagonal = obrnutim dijagonalnim crtama
    .dots = točkama
    .diamonds = rombovima

noun =
    .line = pravac
    .line-segment = dužina
    .ray = polupravac
    .vector = vektor
    .curve = krivulja
    .function = funkcija
    .parabola = parabola
    .polyline = izlomljena crta
    .polygon = mnogokut
    .triangle = trokut
    .rectangle = pravokutnik
    .circle = kružnica
    .region = područje
    .point = točka
    .square = kvadrat
    .diamond = romb
    .cross = križ
    .plus = plus

# Croatian keeps the side count in front of the noun, so the whole of it is one
# head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] pravilni { $numSides }-erokut
    }

# Besides the nouns above, `$noun` can be `regular-polygon` (mnogokut, m) or
# the head of a phrase the description never names: `border` (rub, m), `fill`
# (ispuna, f), `text` (tekst, m), `background` (pozadina, f).
noun-gender =
    { $noun ->
        [line-segment] f
        [curve] f
        [function] f
        [parabola] f
        [polyline] f
        [circle] f
        [point] f
        [fill] f
        [background] f
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
        [f] ispunjena
        [n] ispunjeno
       *[m] ispunjen
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } s { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } s { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } s { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

# «rub» is masculine, so the border's adjectives agree with it and not with the
# shape it surrounds. Croatian has no article, so the two `-article` branches
# read like the two without.
style-border-clause =
    { $parts ->
        [with-article] s { $border } rubom
        [and] i { $border } rubom
        [and-article] i { $border } rubom
       *[with] s { $border } rubom
    }

# The fill-pattern words are instrumental plurals, because their other use is
# the «s { $pattern }» clause in `style-filled`. So this message supplies a noun
# for them to hang off — «ispuna», feminine, which is the gender `noun-gender`
# already answers for `fill`, so the colour agrees with it in both variants.
style-fill =
    { $parts ->
        [pattern] { $color } ispuna s { $pattern }
       *[plain] { $color } ispuna
    }

style-unfilled = neispunjen

style-text =
    { $parts ->
        [background] { $color } na { $background } pozadini
       *[plain] { $color }
    }

style-background-none = nema


## Boolean words

boolean-true = istina
boolean-false = laž


## Answer buttons

answer-submit-label = Provjeri
answer-submit-label-no-correctness = Pošalji odgovor


## Sectional blocks

section-name =
    .activity = Aktivnost
    .aside = Digresija
    .cascade = Kaskada
    .definition = Definicija
    .example = Primjer
    .exercise = Vježba
    .exercises = Vježbe
    .given-answer = Odgovor
    .note = Napomena
    .objectives = Ciljevi
    .paragraphs = Odlomci
    .part = Dio
    .problem = Zadatak
    .problems = Zadaci
    .proof = Dokaz
    .question = Pitanje
    .section = Odjeljak
    .solution = Rješenje
    .task = Zadatak
    .theorem = Teorem

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ". " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ". " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Savjet


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tablica { $enumeration }
        [numbered-title] Tablica { $enumeration }{ ". " }
        [unnumbered-title] Tablica{ ". " }
       *[unnumbered] Tablica
    }

figure-name =
    { $parts ->
        [numbered] Slika { $enumeration }
        [numbered-caption] Slika { $enumeration }{ ". " }
        [unnumbered-caption] Slika{ ". " }
       *[unnumbered] Slika
    }


## Paginator controls

paginator-previous = Prethodna
paginator-next = Sljedeća
paginator-page = Stranica

paginator-page-status = { $pageLabel } { $currentPage } od { $numPages }


## Piecewise functions

piecewise-condition-or = ili
piecewise-condition-if = ako
piecewise-condition-otherwise = inače


## Chemistry

element-name =
    .h = Vodik
    .he = Helij
    .li = Litij
    .be = Berilij
    .b = Bor
    .c = Ugljik
    .n = Dušik
    .o = Kisik
    .f = Fluor
    .ne = Neon
    .na = Natrij
    .mg = Magnezij
    .al = Aluminij
    .si = Silicij
    .p = Fosfor
    .s = Sumpor
    .cl = Klor
    .ar = Argon
    .k = Kalij
    .ca = Kalcij
    .sc = Skandij
    .ti = Titanij
    .v = Vanadij
    .cr = Krom
    .mn = Mangan
    .fe = Željezo
    .co = Kobalt
    .ni = Nikal
    .cu = Bakar
    .zn = Cink
    .ga = Galij
    .ge = Germanij
    .as = Arsen
    .se = Selenij
    .br = Brom
    .kr = Kripton
    .rb = Rubidij
    .sr = Stroncij
    .y = Itrij
    .zr = Cirkonij
    .nb = Niobij
    .mo = Molibden
    .tc = Tehnecij
    .ru = Rutenij
    .rh = Rodij
    .pd = Paladij
    .ag = Srebro
    .cd = Kadmij
    .in = Indij
    .sn = Kositar
    .sb = Antimon
    .te = Telurij
    .i = Jod
    .xe = Ksenon
    .cs = Cezij
    .ba = Barij
    .la = Lantan
    .ce = Cerij
    .pr = Prazeodimij
    .nd = Neodimij
    .pm = Prometij
    .sm = Samarij
    .eu = Europij
    .gd = Gadolinij
    .tb = Terbij
    .dy = Disprozij
    .ho = Holmij
    .er = Erbij
    .tm = Tulij
    .yb = Iterbij
    .lu = Lutecij
    .hf = Hafnij
    .ta = Tantal
    .w = Volfram
    .re = Renij
    .os = Osmij
    .ir = Iridij
    .pt = Platina
    .au = Zlato
    .hg = Živa
    .tl = Talij
    .pb = Olovo
    .bi = Bizmut
    .po = Polonij
    .at = Astat
    .rn = Radon
    .fr = Francij
    .ra = Radij
    .ac = Aktinij
    .th = Torij
    .pa = Protaktinij
    .u = Uranij
    .np = Neptunij
    .pu = Plutonij
    .am = Americij
    .cm = Kirij
    .bk = Berkelij
    .cf = Kalifornij
    .es = Ajnštajnij
    .fm = Fermij
    .md = Mendelevij
    .no = Nobelij
    .lr = Lorencij
    .rf = Raderfordij
    .db = Dubnij
    .sg = Siborgij
    .bh = Borij
    .hs = Hasij
    .mt = Majtnerij
    .ds = Darmštatij
    .rg = Rendgenij
    .cn = Kopernicij
    .nh = Nihonij
    .fl = Flerovij
    .mc = Moskovij
    .lv = Livermorij
    .ts = Tenesin
    .og = Oganeson

element-anion-name =
    .h = Hidrid
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
    .ts = Tenesid

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Neispravan kemijski simbol
chemistry-invalid-ionic-compound = Neispravan ionski spoj

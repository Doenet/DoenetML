# Polish content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Polish inflects for gender *and* for case, so every adjective below selects
# on `$role` first — which position the words are going into — and then on
# `$gender` where the answer still depends on one:
#
#   standalone          nominative, agreeing with the noun described:
#                       `-y`/`-i` m, `-a` f, `-e` n
#   border-clause       instrumental after «z», of «obramowanie» — neuter:
#                       `-ym`/`-im`
#   background-clause   locative after «na», of «tło» — also neuter, and the
#                       neuter locative is spelled the same as the neuter
#                       instrumental, so these two branches coincide
#   text-clause         nominative masculine, agreeing with «tekst»
#
# The last three need no gender branch: each is used of exactly one noun, and
# that noun's gender is fixed. Without `$role` this catalog could not have been
# written at all — one token cannot hold three cases (#1606).
#
# Adjectives precede their noun, as in English, so the composition messages
# keep the English order.


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] czarnym
            [background-clause] czarnym
            [text-clause] czarny
           *[standalone]
                { $gender ->
                    [f] czarna
                    [n] czarne
                   *[m] czarny
                }
        }
    .white =
        { $role ->
            [border-clause] białym
            [background-clause] białym
            [text-clause] biały
           *[standalone]
                { $gender ->
                    [f] biała
                    [n] białe
                   *[m] biały
                }
        }
    .gray =
        { $role ->
            [border-clause] szarym
            [background-clause] szarym
            [text-clause] szary
           *[standalone]
                { $gender ->
                    [f] szara
                    [n] szare
                   *[m] szary
                }
        }
    .red =
        { $role ->
            [border-clause] czerwonym
            [background-clause] czerwonym
            [text-clause] czerwony
           *[standalone]
                { $gender ->
                    [f] czerwona
                    [n] czerwone
                   *[m] czerwony
                }
        }
    .orange =
        { $role ->
            [border-clause] pomarańczowym
            [background-clause] pomarańczowym
            [text-clause] pomarańczowy
           *[standalone]
                { $gender ->
                    [f] pomarańczowa
                    [n] pomarańczowe
                   *[m] pomarańczowy
                }
        }
    .yellow =
        { $role ->
            [border-clause] żółtym
            [background-clause] żółtym
            [text-clause] żółty
           *[standalone]
                { $gender ->
                    [f] żółta
                    [n] żółte
                   *[m] żółty
                }
        }
    .green =
        { $role ->
            [border-clause] zielonym
            [background-clause] zielonym
            [text-clause] zielony
           *[standalone]
                { $gender ->
                    [f] zielona
                    [n] zielone
                   *[m] zielony
                }
        }
    .cyan =
        { $role ->
            [border-clause] błękitnym
            [background-clause] błękitnym
            [text-clause] błękitny
           *[standalone]
                { $gender ->
                    [f] błękitna
                    [n] błękitne
                   *[m] błękitny
                }
        }
    .blue =
        { $role ->
            [border-clause] niebieskim
            [background-clause] niebieskim
            [text-clause] niebieski
           *[standalone]
                { $gender ->
                    [f] niebieska
                    [n] niebieskie
                   *[m] niebieski
                }
        }
    .purple =
        { $role ->
            [border-clause] fioletowym
            [background-clause] fioletowym
            [text-clause] fioletowy
           *[standalone]
                { $gender ->
                    [f] fioletowa
                    [n] fioletowe
                   *[m] fioletowy
                }
        }
    .pink =
        { $role ->
            [border-clause] różowym
            [background-clause] różowym
            [text-clause] różowy
           *[standalone]
                { $gender ->
                    [f] różowa
                    [n] różowe
                   *[m] różowy
                }
        }
    .brown =
        { $role ->
            [border-clause] brązowym
            [background-clause] brązowym
            [text-clause] brązowy
           *[standalone]
                { $gender ->
                    [f] brązowa
                    [n] brązowe
                   *[m] brązowy
                }
        }

line-width =
    .thick =
        { $role ->
            [border-clause] grubym
            [background-clause] grubym
            [text-clause] gruby
           *[standalone]
                { $gender ->
                    [f] gruba
                    [n] grube
                   *[m] gruby
                }
        }
    .thin =
        { $role ->
            [border-clause] cienkim
            [background-clause] cienkim
            [text-clause] cienki
           *[standalone]
                { $gender ->
                    [f] cienka
                    [n] cienkie
                   *[m] cienki
                }
        }

line-style =
    .dashed =
        { $role ->
            [border-clause] przerywanym
            [background-clause] przerywanym
            [text-clause] przerywany
           *[standalone]
                { $gender ->
                    [f] przerywana
                    [n] przerywane
                   *[m] przerywany
                }
        }
    .dotted =
        { $role ->
            [border-clause] kropkowanym
            [background-clause] kropkowanym
            [text-clause] kropkowany
           *[standalone]
                { $gender ->
                    [f] kropkowana
                    [n] kropkowane
                   *[m] kropkowany
                }
        }

# Noun phrases in the accusative plural, which is the case «w» takes when it
# names a pattern — «w romby», the way Polish describes patterned cloth. The
# accusative of a non-virile plural is spelled like the nominative, so the same
# words serve `style-fill`, where they stand on their own. They agree with
# nothing either way.
fill-style =
    .horizontal = poziome linie
    .vertical = pionowe linie
    .diagonal = ukośne linie
    .backdiagonal = odwrotnie ukośne linie
    .dots = kropki
    .diamonds = romby

noun =
    .line = prosta
    .line-segment = odcinek
    .ray = półprosta
    .vector = wektor
    .curve = krzywa
    .function = funkcja
    .parabola = parabola
    .polyline = łamana
    .polygon = wielokąt
    .triangle = trójkąt
    .rectangle = prostokąt
    .circle = okrąg
    .region = obszar
    .point = punkt
    .square = kwadrat
    .diamond = romb
    .cross = krzyżyk
    .plus = plus

# Polish counts the sides after the noun, so the count closes the phrase
# behind the adjectives: «gruby czerwony wielokąt foremny o 5 bokach».
noun-regular-polygon =
    { $part ->
        [tail] o { $numSides } bokach
       *[head] wielokąt foremny
    }

# Besides the nouns above, `$noun` can be `regular-polygon` (wielokąt, m) or
# the head of a phrase the description never names: `border` (obramowanie, n),
# `fill` (wypełnienie, n), `text` (tekst, m), `background` (tło, n).
noun-gender =
    { $noun ->
        [line] f
        [ray] f
        [curve] f
        [function] f
        [parabola] f
        [polyline] f
        [border] n
        [fill] n
        [background] n
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

# Adjectives precede the noun, and the complement closes the phrase.
style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }

# Only ever said of the shape itself, so it is standalone in every
# description and takes no `$role` branch.
style-filled-word =
    { $gender ->
        [f] wypełniona
        [n] wypełnione
       *[m] wypełniony
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } w { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } w { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } w { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

# «z» governs the instrumental, which the `border-clause` branch of every
# adjective supplies. Polish has no article, so the `-article` branches read
# the same as the ones without.
#
# The `and-` branches keep «z» of their own. English lets one "with" cover both
# the fill pattern and the border, but Polish names a pattern with «w» and the
# accusative, and that preposition cannot reach the instrumental behind it — so
# «i z … obramowaniem», never a bare «i».
style-border-clause =
    { $parts ->
        [with-article] z { $border } obramowaniem
        [and] i z { $border } obramowaniem
        [and-article] i z { $border } obramowaniem
       *[with] z { $border } obramowaniem
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = niewypełniony

# «na» governs the locative, which for a neuter noun is spelled like the
# instrumental — which is why the `background-clause` and `border-clause`
# branches of every adjective coincide.
style-text =
    { $parts ->
        [background] { $color } na { $background } tle
       *[plain] { $color }
    }

style-background-none = brak


## Boolean words

boolean-true = prawda
boolean-false = fałsz


## Answer buttons

answer-submit-label = Sprawdź
answer-submit-label-no-correctness = Wyślij odpowiedź


## Sectional blocks

section-name =
    .activity = Aktywność
    .aside = Dygresja
    .cascade = Kaskada
    .definition = Definicja
    .example = Przykład
    .exercise = Ćwiczenie
    .exercises = Ćwiczenia
    .given-answer = Odpowiedź
    .note = Uwaga
    .objectives = Cele
    .paragraphs = Akapity
    .part = Część
    .problem = Zadanie
    .problems = Zadania
    .proof = Dowód
    .question = Pytanie
    .section = Rozdział
    .solution = Rozwiązanie
    .task = Zadanie do wykonania
    .theorem = Twierdzenie

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Wskazówka


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
        [numbered] Rysunek { $enumeration }
        [numbered-caption] Rysunek { $enumeration }{ ": " }
        [unnumbered-caption] Rysunek{ ": " }
       *[unnumbered] Rysunek
    }


## Paginator controls

paginator-previous = Poprzednia
paginator-next = Następna
paginator-page = Strona

paginator-page-status = { $pageLabel } { $currentPage } z { $numPages }


## Piecewise functions

piecewise-condition-or = lub
piecewise-condition-if = jeśli
piecewise-condition-otherwise = w przeciwnym razie


## Chemistry

element-name =
    .h = Wodór
    .he = Hel
    .li = Lit
    .be = Beryl
    .b = Bor
    .c = Węgiel
    .n = Azot
    .o = Tlen
    .f = Fluor
    .ne = Neon
    .na = Sód
    .mg = Magnez
    .al = Glin
    .si = Krzem
    .p = Fosfor
    .s = Siarka
    .cl = Chlor
    .ar = Argon
    .k = Potas
    .ca = Wapń
    .sc = Skand
    .ti = Tytan
    .v = Wanad
    .cr = Chrom
    .mn = Mangan
    .fe = Żelazo
    .co = Kobalt
    .ni = Nikiel
    .cu = Miedź
    .zn = Cynk
    .ga = Gal
    .ge = German
    .as = Arsen
    .se = Selen
    .br = Brom
    .kr = Krypton
    .rb = Rubid
    .sr = Stront
    .y = Itr
    .zr = Cyrkon
    .nb = Niob
    .mo = Molibden
    .tc = Technet
    .ru = Ruten
    .rh = Rod
    .pd = Pallad
    .ag = Srebro
    .cd = Kadm
    .in = Ind
    .sn = Cyna
    .sb = Antymon
    .te = Tellur
    .i = Jod
    .xe = Ksenon
    .cs = Cez
    .ba = Bar
    .la = Lantan
    .ce = Cer
    .pr = Prazeodym
    .nd = Neodym
    .pm = Promet
    .sm = Samar
    .eu = Europ
    .gd = Gadolin
    .tb = Terb
    .dy = Dysproz
    .ho = Holm
    .er = Erb
    .tm = Tul
    .yb = Iterb
    .lu = Lutet
    .hf = Hafn
    .ta = Tantal
    .w = Wolfram
    .re = Ren
    .os = Osm
    .ir = Iryd
    .pt = Platyna
    .au = Złoto
    .hg = Rtęć
    .tl = Tal
    .pb = Ołów
    .bi = Bizmut
    .po = Polon
    .at = Astat
    .rn = Radon
    .fr = Frans
    .ra = Rad
    .ac = Aktyn
    .th = Tor
    .pa = Protaktyn
    .u = Uran
    .np = Neptun
    .pu = Pluton
    .am = Ameryk
    .cm = Kiur
    .bk = Berkel
    .cf = Kaliforn
    .es = Einstein
    .fm = Ferm
    .md = Mendelew
    .no = Nobel
    .lr = Lorens
    .rf = Rutherford
    .db = Dubn
    .sg = Seaborg
    .bh = Bohr
    .hs = Has
    .mt = Meitner
    .ds = Darmsztadt
    .rg = Roentgen
    .cn = Kopernik
    .nh = Nihon
    .fl = Flerow
    .mc = Moskow
    .lv = Liwermor
    .ts = Tenes
    .og = Oganeson

element-anion-name =
    .h = Wodorek
    .c = Węglik
    .n = Azotek
    .o = Tlenek
    .f = Fluorek
    .p = Fosforek
    .s = Siarczek
    .cl = Chlorek
    .br = Bromek
    .i = Jodek
    .at = Astatek
    .ts = Tenesek

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Nieprawidłowy symbol chemiczny
chemistry-invalid-ionic-compound = Nieprawidłowy związek jonowy

# Lower Sorbian (dolnoserbšćina) content catalog: the prose the core computes
# into the document. Selected by `documentLocale` — the language the activity
# was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Lower Sorbian inflects for gender *and* for case, so every adjective below
# selects on `$role` first — which position the words are going into — and then
# on `$gender` where the answer still depends on one, as `locales/cs`,
# `locales/pl` and `locales/hsb` do:
#
#   standalone          nominative, agreeing with the noun described:
#                       `-y` m, `-a` f, `-e` n
#   border-clause       instrumental after «z», of «kšoma» — feminine: `-ej`
#   background-clause   locative after «na», of «slězyna» — feminine: `-ej`
#   text-clause         nominative masculine, agreeing with «tekst»
#
# The last three need no gender branch: each is used of exactly one noun, and
# that noun's gender is fixed. Lower Sorbian differs from Upper here in that
# its word for a background — «slězyna» — is feminine where `locales/hsb`'s
# «pozadk» is masculine, so the two files' `background-clause` forms are not
# the same ending even where the adjective is otherwise the same word.
#
# Adjectives precede their noun, as in English, so the composition messages
# keep the English order.
#
# **This file is not a respelling of `locales/hsb`.** See `chrome.ftl` for the
# whole note and for the list of everyday words where the two standards part
# company.
#
# **The periodic table is left to fall back to English.** Sorbian schooling in
# Brandenburg is German-medium above the primary grades, and the periodic table
# a Lower Sorbian pupil meets is printed in German; `locales/de` is the
# parallel text. That is a fact about a school system rather than about the
# language.


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] carnej
            [background-clause] carnym
            [text-clause] carny
           *[standalone]
                { $gender ->
                    [f] carna
                    [n] carne
                   *[m] carny
                }
        }
    .white =
        { $role ->
            [border-clause] běłej
            [background-clause] běłym
            [text-clause] běły
           *[standalone]
                { $gender ->
                    [f] běła
                    [n] běłe
                   *[m] běły
                }
        }
    .gray =
        { $role ->
            [border-clause] šerej
            [background-clause] šerym
            [text-clause] šery
           *[standalone]
                { $gender ->
                    [f] šera
                    [n] šere
                   *[m] šery
                }
        }
    .red =
        { $role ->
            [border-clause] cerwjenej
            [background-clause] cerwjenym
            [text-clause] cerwjeny
           *[standalone]
                { $gender ->
                    [f] cerwjena
                    [n] cerwjene
                   *[m] cerwjeny
                }
        }
    .orange =
        { $role ->
            [border-clause] oranžowej
            [background-clause] oranžowym
            [text-clause] oranžowy
           *[standalone]
                { $gender ->
                    [f] oranžowa
                    [n] oranžowe
                   *[m] oranžowy
                }
        }
    .yellow =
        { $role ->
            [border-clause] žołtej
            [background-clause] žołtym
            [text-clause] žołty
           *[standalone]
                { $gender ->
                    [f] žołta
                    [n] žołte
                   *[m] žołty
                }
        }
    .green =
        { $role ->
            [border-clause] zelenej
            [background-clause] zelenym
            [text-clause] zeleny
           *[standalone]
                { $gender ->
                    [f] zelena
                    [n] zelene
                   *[m] zeleny
                }
        }
    .cyan =
        { $role ->
            [border-clause] cyanowej
            [background-clause] cyanowym
            [text-clause] cyanowy
           *[standalone]
                { $gender ->
                    [f] cyanowa
                    [n] cyanowe
                   *[m] cyanowy
                }
        }
    .blue =
        { $role ->
            [border-clause] módrej
            [background-clause] módrym
            [text-clause] módry
           *[standalone]
                { $gender ->
                    [f] módra
                    [n] módre
                   *[m] módry
                }
        }
    .purple =
        { $role ->
            [border-clause] purpurnej
            [background-clause] purpurnym
            [text-clause] purpurny
           *[standalone]
                { $gender ->
                    [f] purpurna
                    [n] purpurne
                   *[m] purpurny
                }
        }
    .pink =
        { $role ->
            [border-clause] rožowej
            [background-clause] rožowym
            [text-clause] rožowy
           *[standalone]
                { $gender ->
                    [f] rožowa
                    [n] rožowe
                   *[m] rožowy
                }
        }
    .brown =
        { $role ->
            [border-clause] brunej
            [background-clause] brunym
            [text-clause] bruny
           *[standalone]
                { $gender ->
                    [f] bruna
                    [n] brune
                   *[m] bruny
                }
        }
line-width =
    .thick =
        { $role ->
            [border-clause] tłustej
            [background-clause] tłustym
            [text-clause] tłusty
           *[standalone]
                { $gender ->
                    [f] tłusta
                    [n] tłuste
                   *[m] tłusty
                }
        }
    .thin =
        { $role ->
            [border-clause] śańkej
            [background-clause] śańkim
            [text-clause] śańki
           *[standalone]
                { $gender ->
                    [f] śańka
                    [n] śańke
                   *[m] śańki
                }
        }
line-style =
    .dashed =
        { $role ->
            [border-clause] smužkowanej
            [background-clause] smužkowanym
            [text-clause] smužkowany
           *[standalone]
                { $gender ->
                    [f] smužkowana
                    [n] smužkowane
                   *[m] smužkowany
                }
        }
    .dotted =
        { $role ->
            [border-clause] dypkowanej
            [background-clause] dypkowanym
            [text-clause] dypkowany
           *[standalone]
                { $gender ->
                    [f] dypkowana
                    [n] dypkowane
                   *[m] dypkowany
                }
        }
# Nominative plural. The fill clause below writes «z» and the instrumental of
# the pattern's own head; the same words serve `style-fill`, where they stand
# alone.
fill-style =
    .horizontal = horicontalne linije
    .vertical = wertikalne linije
    .diagonal = diagonalne linije
    .backdiagonal = napśeśiwne diagonalne linije
    .dots = dypki
    .diamonds = romby
# «linijowy wótrězk» rather than a bare «wótrězk», because «wótrězk» is already
# the word this catalog gives a `<section>` and no word does two jobs across
# these four files.
noun =
    .line = rownica
    .line-segment = linijowy wótrězk
    .ray = połrownica
    .vector = wektor
    .curve = kśiwka
    .function = funkcija
    .slope-field = pólo nachylenja
    .vector-field = wektorowe pólo
    .parabola = parabola
    .polyline = łamana linija
    .polygon = wjelerožk
    .triangle = tśirožk
    .rectangle = pšaworožk
    .circle = krejz
    .region = płoń
    .point = dypk
    .square = kwadrat
    .diamond = romba
    .cross = kśicka
    .plus = plus
# Sorbian counts the sides behind the noun, so the count closes the phrase
# behind the adjectives: «tłusty cerwjeny pšawidłowny wjelerožk z 5 bokami».
noun-regular-polygon =
    { $part ->
        [tail] z { $numSides } bokami
       *[head] pšawidłowny wjelerožk
    }
# Besides the nouns above, `$noun` can be `regular-polygon` (wjelerožk, m) or
# the head of a phrase the description never names: `border` (kšoma, f),
# `fill` (połnjenje, n), `text` (tekst, m), `background` (slězyna, f).
noun-gender =
    { $noun ->
        [line] f
        [line-segment] m
        [ray] f
        [curve] f
        [function] f
        [parabola] f
        [polyline] f
        [region] f
        [diamond] f
        [cross] f
        [border] f
        [background] f
        [slope-field] n
        [vector-field] n
        [fill] n
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
        [f] połnjona
        [n] połnjone
       *[m] połnjony
    }
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } z { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } z { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } z { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }
# «z» governs the instrumental, which the `border-clause` branch of every
# adjective supplies. Sorbian has no article, so the `-article` branches read
# the same as the ones without.
style-border-clause =
    { $parts ->
        [with-article] z { $border } kšomu
        [and] a z { $border } kšomu
        [and-article] a z { $border } kšomu
       *[with] z { $border } kšomu
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = njepołnjony
style-text =
    { $parts ->
        [background] { $color } na { $background } slězynje
       *[plain] { $color }
    }
style-background-none = žedna

## Boolean words

boolean-true = wěrny
boolean-false = njewěrny

## Answer buttons

answer-submit-label = Pśeglědaj
answer-submit-label-no-correctness = Sćel wótegrono

## Sectional blocks

section-name =
    .activity = Aktiwita
    .aside = Pśispomnjeńce
    .cascade = Kaskada
    .definition = Definicija
    .example = Pśikład
    .exercise = Zwucowanje
    .exercises = Zwucowanja
    .given-answer = Wótegrono
    .note = Pokazka
    .objectives = Cele
    .paragraphs = Wótstawki
    .part = Źěl
    .problem = Nadawk
    .problems = Nadawki
    .proof = Dopokaz
    .question = Pšašanje
    .section = Wótrězk
    .solution = Rozwězanje
    .task = Źěło
    .theorem = Sada
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Pokaz

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
        [numbered] Wobraz { $enumeration }
        [numbered-caption] Wobraz { $enumeration }{ ": " }
        [unnumbered-caption] Wobraz{ ": " }
       *[unnumbered] Wobraz
    }

## Paginator controls

paginator-previous = Pjerwjejšny
paginator-next = Pśiducy
paginator-page = Bok
paginator-page-status = { $pageLabel } { $currentPage } z { $numPages }

## Piecewise functions

piecewise-condition-or = abo
piecewise-condition-if = joli
piecewise-condition-otherwise = howac

## Chemistry
##
## The 118 element names and the 12 anion names fall back to English. Secondary
## science in Brandenburg is taught in German, so the periodic table a Lower
## Sorbian pupil meets is printed in German and `locales/de` is the parallel
## text. That is a fact about a school system rather than about the language,
## and it is the sentence `locales/hsb` records for Saxony.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Njepłaśiwy chemiski symbol
chemistry-invalid-ionic-compound = Njepłaśiwa ionowa zwězba

## Inputs embedded in math

# Read aloud inside the mathematics and never shown on screen, so it stays to
# one word.
math-embedded-input-blank = proznina
math-embedded-input-blank-ordinal = proznina { $ordinal } z { $total }

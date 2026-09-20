# Upper Sorbian (hornjoserbšćina) content catalog: the prose the core computes
# into the document. Selected by `documentLocale` — the language the activity
# was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Upper Sorbian inflects for gender *and* for case, so every adjective below
# selects on `$role` first — which position the words are going into — and then
# on `$gender` where the answer still depends on one, exactly as `locales/cs`
# and `locales/pl` do:
#
#   standalone          nominative, agreeing with the noun described:
#                       `-y` m, `-a` f, `-e` n
#   border-clause       instrumental after «z», of «kroma» — feminine: `-ej`
#   background-clause   locative after «na», of «pozadk» — masculine: `-ym`
#   text-clause         nominative masculine, agreeing with «tekst»
#
# The last three need no gender branch: each is used of exactly one noun, and
# that noun's gender is fixed.
#
# Adjectives precede their noun, as in English, so the composition messages
# keep the English order — which is where Sorbian parts company with the five
# Romance catalogs of this batch and agrees with its two Slavic neighbours.
#
# **`locales/dsb` is not a respelling of this file and must not be edited into
# one.** Lower Sorbian is a separate written standard with its own vocabulary,
# and the two differ where they most look alike: this file writes «čerwjeny»,
# «kruh», «prašenje», «wotmołwa» and «strona» where `locales/dsb` writes
# «cerwjeny», «krejz», «pšašanje», «wótegrono» and «bok». Where a word *is*
# shared — «běły» is spelled the same in both — that is not evidence either is
# right: one process produced both.
#
# **The periodic table is left to fall back to English.** Sorbian schooling in
# Saxony is German-medium above the primary grades, and the periodic table a
# Sorbian pupil meets is printed in German; `locales/de` is the parallel text.
# That is a fact about a school system rather than about the language, and it
# is the same sentence thirteen other catalogs of this batch record.


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] čornej
            [background-clause] čornym
            [text-clause] čorny
           *[standalone]
                { $gender ->
                    [f] čorna
                    [n] čorne
                   *[m] čorny
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
            [border-clause] šěrej
            [background-clause] šěrym
            [text-clause] šěry
           *[standalone]
                { $gender ->
                    [f] šěra
                    [n] šěre
                   *[m] šěry
                }
        }
    .red =
        { $role ->
            [border-clause] čerwjenej
            [background-clause] čerwjenym
            [text-clause] čerwjeny
           *[standalone]
                { $gender ->
                    [f] čerwjena
                    [n] čerwjene
                   *[m] čerwjeny
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
            [border-clause] róžowej
            [background-clause] róžowym
            [text-clause] róžowy
           *[standalone]
                { $gender ->
                    [f] róžowa
                    [n] róžowe
                   *[m] róžowy
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
            [border-clause] tołstej
            [background-clause] tołstym
            [text-clause] tołsty
           *[standalone]
                { $gender ->
                    [f] tołsta
                    [n] tołste
                   *[m] tołsty
                }
        }
    .thin =
        { $role ->
            [border-clause] tenkej
            [background-clause] tenkym
            [text-clause] tenki
           *[standalone]
                { $gender ->
                    [f] tenka
                    [n] tenke
                   *[m] tenki
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
# Nominative plural, which is what «z» leaves alone here: the fill clause below
# writes «z» and the instrumental of the pattern's own head, and these nouns
# stand as the head. The same words serve `style-fill`, where they stand alone.
fill-style =
    .horizontal = horicontalne linije
    .vertical = wertikalne linije
    .diagonal = diagonalne linije
    .backdiagonal = napřećiwne diagonalne linije
    .dots = dypki
    .diamonds = romby
# «linijowy wotrězk» rather than a bare «wotrězk», because «wotrězk» is already
# the word this catalog gives a `<section>` and no word does two jobs across
# these four files.
noun =
    .line = runica
    .line-segment = linijowy wotrězk
    .ray = połrunica
    .vector = wektor
    .curve = křiwka
    .function = funkcija
    .slope-field = polo nachilenja
    .vector-field = wektorowe polo
    .parabola = parabola
    .polyline = łamana linija
    .polygon = wjeleróžk
    .triangle = třiróžk
    .rectangle = praworóžk
    .circle = kruh
    .region = płonina
    .point = dypk
    .square = kwadrat
    .diamond = romba
    .cross = křiž
    .plus = plus
# Sorbian counts the sides behind the noun, so the count closes the phrase
# behind the adjectives: «tołsty čerwjeny prawidłowny wjeleróžk z 5 bokami».
noun-regular-polygon =
    { $part ->
        [tail] z { $numSides } bokami
       *[head] prawidłowny wjeleróžk
    }
# Besides the nouns above, `$noun` can be `regular-polygon` (wjeleróžk, m) or
# the head of a phrase the description never names: `border` (kroma, f),
# `fill` (pjelnjenje, n), `text` (tekst, m), `background` (pozadk, m).
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
        [border] f
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
        [f] pjelnjena
        [n] pjelnjene
       *[m] pjelnjeny
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
        [with-article] z { $border } kromu
        [and] a z { $border } kromu
        [and-article] a z { $border } kromu
       *[with] z { $border } kromu
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = njepjelnjeny
style-text =
    { $parts ->
        [background] { $color } na { $background } pozadku
       *[plain] { $color }
    }
style-background-none = žadyn

## Boolean words

boolean-true = wěrny
boolean-false = njewěrny

## Answer buttons

answer-submit-label = Přepruwuj
answer-submit-label-no-correctness = Pósćel wotmołwu

## Sectional blocks

section-name =
    .activity = Aktiwita
    .aside = Přispomnjenje
    .cascade = Kaskada
    .definition = Definicija
    .example = Přikład
    .exercise = Zwučowanje
    .exercises = Zwučowanja
    .given-answer = Wotmołwa
    .note = Pokazka
    .objectives = Cile
    .paragraphs = Wotstawki
    .part = Dźěl
    .problem = Nadawk
    .problems = Nadawki
    .proof = Dopokaz
    .question = Prašenje
    .section = Wotrězk
    .solution = Rozrisanje
    .task = Dźěło
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
hint-title = Pokiw

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

paginator-previous = Předchadny
paginator-next = Přichodny
paginator-page = Strona
paginator-page-status = { $pageLabel } { $currentPage } z { $numPages }

## Piecewise functions

piecewise-condition-or = abo
piecewise-condition-if = jeli
piecewise-condition-otherwise = hewak

## Chemistry
##
## The 118 element names and the 12 anion names fall back to English. Secondary
## science in Saxony is taught in German, so the periodic table a Sorbian pupil
## meets is printed in German and `locales/de` is the parallel text. That is a
## fact about a school system rather than about Upper Sorbian, and inventing a
## Sorbian list here would report the former as if it were the latter.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Njepłaćiwy chemiski symbol
chemistry-invalid-ionic-compound = Njepłaćiwa ionowa zwjazba

## Inputs embedded in math

# Read aloud inside the mathematics and never shown on screen, so it stays to
# one word.
math-embedded-input-blank = prózdnina
math-embedded-input-blank-ordinal = prózdnina { $ordinal } z { $total }

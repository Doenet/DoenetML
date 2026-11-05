# Silesian (ślōnskŏ gŏdka) content catalog: the prose the core computes into
# the document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The ślabikŏrzowy szrajbōnek; see `chrome.ftl` for the note
# on «ō», «ŏ», «ô», «ã» and «õ», and for why this file is not `locales/pl`.
#
# Silesian inflects for gender *and* for case, so every adjective below selects
# on `$role` first — which position the words are going into — and then on
# `$gender` where the answer still depends on one, as `locales/pl`,
# `locales/cs` and the two Sorbian catalogs of this batch do:
#
#   standalone          nominative, agreeing with the noun described:
#                       `-y` m, `-ŏ` f, `-e` n
#   border-clause       instrumental after «z», of «rant» — masculine: `-ym`
#   background-clause   locative after «na», of «zadek» — masculine: `-ym`
#   text-clause         nominative masculine, agreeing with «tekst»
#
# The instrumental and the locative fall together in the masculine, so the two
# clause branches read alike here and are still written out separately: they
# are two positions, and a later correction to one of them should not silently
# move the other.
#
# Adjectives precede their noun, as in English.
#
# **The periodic table is left to fall back to English.** Secondary science in
# Upper Silesia is taught in Polish out of Polish textbooks, so the table a
# Silesian speaker meets is `locales/pl`'s. That is a fact about a school
# system rather than about the language.


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] czŏrnym
            [background-clause] czŏrnym
            [text-clause] czŏrny
           *[standalone]
                { $gender ->
                    [f] czŏrnŏ
                    [n] czŏrne
                   *[m] czŏrny
                }
        }
    .white =
        { $role ->
            [border-clause] biołym
            [background-clause] biołym
            [text-clause] bioły
           *[standalone]
                { $gender ->
                    [f] biołŏ
                    [n] biołe
                   *[m] bioły
                }
        }
    .gray =
        { $role ->
            [border-clause] siwym
            [background-clause] siwym
            [text-clause] siwy
           *[standalone]
                { $gender ->
                    [f] siwŏ
                    [n] siwe
                   *[m] siwy
                }
        }
    .red =
        { $role ->
            [border-clause] czerwōnym
            [background-clause] czerwōnym
            [text-clause] czerwōny
           *[standalone]
                { $gender ->
                    [f] czerwōnŏ
                    [n] czerwōne
                   *[m] czerwōny
                }
        }
    .orange =
        { $role ->
            [border-clause] pōmarańczowym
            [background-clause] pōmarańczowym
            [text-clause] pōmarańczowy
           *[standalone]
                { $gender ->
                    [f] pōmarańczowŏ
                    [n] pōmarańczowe
                   *[m] pōmarańczowy
                }
        }
    .yellow =
        { $role ->
            [border-clause] żōłtym
            [background-clause] żōłtym
            [text-clause] żōłty
           *[standalone]
                { $gender ->
                    [f] żōłtŏ
                    [n] żōłte
                   *[m] żōłty
                }
        }
    .green =
        { $role ->
            [border-clause] zielōnym
            [background-clause] zielōnym
            [text-clause] zielōny
           *[standalone]
                { $gender ->
                    [f] zielōnŏ
                    [n] zielōne
                   *[m] zielōny
                }
        }
    .cyan =
        { $role ->
            [border-clause] cyjanowym
            [background-clause] cyjanowym
            [text-clause] cyjanowy
           *[standalone]
                { $gender ->
                    [f] cyjanowŏ
                    [n] cyjanowe
                   *[m] cyjanowy
                }
        }
    .blue =
        { $role ->
            [border-clause] modrym
            [background-clause] modrym
            [text-clause] modry
           *[standalone]
                { $gender ->
                    [f] modrŏ
                    [n] modre
                   *[m] modry
                }
        }
    .purple =
        { $role ->
            [border-clause] purpurowym
            [background-clause] purpurowym
            [text-clause] purpurowy
           *[standalone]
                { $gender ->
                    [f] purpurowŏ
                    [n] purpurowe
                   *[m] purpurowy
                }
        }
    .pink =
        { $role ->
            [border-clause] rōżowym
            [background-clause] rōżowym
            [text-clause] rōżowy
           *[standalone]
                { $gender ->
                    [f] rōżowŏ
                    [n] rōżowe
                   *[m] rōżowy
                }
        }
    .brown =
        { $role ->
            [border-clause] brōnotnym
            [background-clause] brōnotnym
            [text-clause] brōnotny
           *[standalone]
                { $gender ->
                    [f] brōnotnŏ
                    [n] brōnotne
                   *[m] brōnotny
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
                    [f] grubŏ
                    [n] grube
                   *[m] gruby
                }
        }
    .thin =
        { $role ->
            [border-clause] cōnkim
            [background-clause] cōnkim
            [text-clause] cōnki
           *[standalone]
                { $gender ->
                    [f] cōnkŏ
                    [n] cōnkie
                   *[m] cōnki
                }
        }
line-style =
    .dashed =
        { $role ->
            [border-clause] kryskowanym
            [background-clause] kryskowanym
            [text-clause] kryskowany
           *[standalone]
                { $gender ->
                    [f] kryskowanŏ
                    [n] kryskowane
                   *[m] kryskowany
                }
        }
    .dotted =
        { $role ->
            [border-clause] kropkowanym
            [background-clause] kropkowanym
            [text-clause] kropkowany
           *[standalone]
                { $gender ->
                    [f] kropkowanŏ
                    [n] kropkowane
                   *[m] kropkowany
                }
        }
fill-style =
    .horizontal = poziōme linije
    .vertical = piōnowe linije
    .diagonal = skośne linije
    .backdiagonal = ôdwrotnie skośne linije
    .dots = kropki
    .diamonds = rōmby
noun =
    .line = linijŏ
    .line-segment = ôdcinek
    .ray = pōłprostŏ
    .vector = wektōr
    .curve = krziwŏ
    .function = funkcyjŏ
    .slope-field = pole nachylyniŏ
    .vector-field = wektorowe pole
    .parabola = parabola
    .polyline = łōmanŏ
    .polygon = wielokōnt
    .triangle = trōjkōnt
    .rectangle = prostokōnt
    .circle = kōłko
    .region = ôbszar
    .point = pōnkt
    .square = kwadrat
    .diamond = rōmb
    .cross = krziż
    .plus = plus
# The side count follows the adjectives as a complement, so that they stay
# beside the noun they agree with: «gruby czerwōny regularny wielokōnt ô 5
# bokach».
noun-regular-polygon =
    { $part ->
        [tail] ô { $numSides } bokach
       *[head] regularny wielokōnt
    }
# Besides the nouns above, `$noun` can be `regular-polygon` (wielokōnt, m) or
# the head of a phrase the description never names: `border` (rant, m), `fill`
# (wypołniynie, n), `text` (tekst, m), `background` (zadek, m).
noun-gender =
    { $noun ->
        [line] f
        [ray] f
        [curve] f
        [function] f
        [parabola] f
        [polyline] f
        [circle] n
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
        [f] wypołniōnŏ
        [n] wypołniōne
       *[m] wypołniōny
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
# adjective supplies. Silesian has no article, so the `-article` branches read
# the same as the ones without.
style-border-clause =
    { $parts ->
        [with-article] z { $border } rantym
        [and] a z { $border } rantym
        [and-article] a z { $border } rantym
       *[with] z { $border } rantym
    }
style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }
style-unfilled = niy wypołniōny
style-text =
    { $parts ->
        [background] { $color } na { $background } zadku
       *[plain] { $color }
    }
style-background-none = żŏdyn

## Boolean words

boolean-true = prŏwda
boolean-false = niyprŏwda

## Answer buttons

answer-submit-label = Sprawdź robota
answer-submit-label-no-correctness = Poślij ôdpowiydź

## Sectional blocks

section-name =
    .activity = Aktywnŏść
    .aside = Bocznŏ nota
    .cascade = Kaskada
    .definition = Definicyjŏ
    .example = Przikłŏd
    .exercise = Ćwiczynie
    .exercises = Ćwiczynia
    .given-answer = Ôdpowiydź
    .note = Nota
    .objectives = Cele
    .paragraphs = Akapity
    .part = Tajla
    .problem = Zadanie
    .problems = Zadania
    .proof = Dowōd
    .question = Pytanie
    .section = Ôddzioł
    .solution = Rozwiōnzanie
    .task = Robota
    .theorem = Twierdzynie
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = Rada

## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabula { $enumeration }
        [numbered-title] Tabula { $enumeration }{ ": " }
        [unnumbered-title] Tabula{ ": " }
       *[unnumbered] Tabula
    }
figure-name =
    { $parts ->
        [numbered] Ôbrŏz { $enumeration }
        [numbered-caption] Ôbrŏz { $enumeration }{ ": " }
        [unnumbered-caption] Ôbrŏz{ ": " }
       *[unnumbered] Ôbrŏz
    }

## Paginator controls

paginator-previous = Piyrwyjszy
paginator-next = Nastympny
paginator-page = Strōna
paginator-page-status = { $pageLabel } { $currentPage } z { $numPages }

## Piecewise functions

piecewise-condition-or = abo
piecewise-condition-if = jak
piecewise-condition-otherwise = inakszyj

## Chemistry
##
## The 118 element names and the 12 anion names fall back to English.
## Secondary science in Upper Silesia is taught in Polish out of Polish
## textbooks, so the periodic table a Silesian speaker meets is `locales/pl`'s.
## That is a fact about a school system rather than about the language.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Chymiczny symbol niy je dobry
chemistry-invalid-ionic-compound = Jōnowy zwiōnzek niy je dobry

## Inputs embedded in math

# Read aloud inside the mathematics and never shown on screen, so it stays to
# one word.
math-embedded-input-blank = luka
math-embedded-input-blank-ordinal = luka { $ordinal } z { $total }

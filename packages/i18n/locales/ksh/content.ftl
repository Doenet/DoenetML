# Colognian (Kölsch) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The Akademie för uns Kölsche Sproch convention; see
# `chrome.ftl` for the note on «ß», the doubled vowels marking length, and the
# «j» where Standard German writes «g» — «jood», «jesäht», «jroß», «jrön»,
# «jääl». That is the loudest visible break from `locales/de` and the quickest
# check that a line here is still Kölsch.
#
# **Do not edit this toward Standard German.** «nit» and not «nicht», «kütt»
# and not «kommt», «Sigg» and not «Seite», «Beld» and not «Bild», «Fähler» and
# not «Fehler», «däm» and not «dem». Kölsch is a Ripuarian language of its own,
# not a pronunciation of German, and smoothing it out writes a different
# catalog.
#
# **Inflection is of the German type**, so this file follows the shape
# `locales/de/content.ftl` uses rather than a Romance one: the adjectives go
# **before** the noun, and each selects on `$role` first — which position the
# phrase is going into — and then, where it matters, on `$gender`. The endings
# are Kölsch and not German, and Kölsch has fewer of them:
#
#   standalone          attributive with no article: `-e` for masculine and
#                       feminine, the bare stem for neuter — «ne rude Strich»,
#                       «en rude Linie», «e rud Krütz»
#   border-clause       after «met enem» / «un enem», dative: `-e` throughout
#   background-clause   after a bare «op», dative: `-e`
#   text-clause         predicative, where Kölsch does not inflect at all: the
#                       bare stem, «rud op jäälem Hingerjrund» → «rud op jääle
#                       Hingerjrund»
#
# The last three need no gender branch: each is only ever said of one noun, and
# that noun's gender is fixed (dä Rand, dä Hingerjrund, dä Tex).
#
# **The periodic table is left to fall back to English.** That is a fact about
# a school system rather than about the language: secondary science in the
# Rhineland is taught in Standard German out of Standard German textbooks, so
# the table a Kölsch-speaking pupil actually meets is `locales/de`'s, which is
# the parallel text a reviewer should copy from deliberately rather than have
# this seed guess at Kölsch element names. `element-name` and
# `element-anion-name` are therefore absent; `ion-name-oxidation-state` and the
# two `chemistry-invalid-…` messages are here, because they are prose and
# punctuation rather than a nomenclature.


## Style vocabulary

color =
    .black =
        { $role ->
            [border-clause] schwatze
            [background-clause] schwatze
            [text-clause] schwatz
           *[standalone]
                { $gender ->
                    [f] schwatze
                    [n] schwatz
                   *[m] schwatze
                }
        }
    .white =
        { $role ->
            [border-clause] wieße
            [background-clause] wieße
            [text-clause] wieß
           *[standalone]
                { $gender ->
                    [f] wieße
                    [n] wieß
                   *[m] wieße
                }
        }
    .gray =
        { $role ->
            [border-clause] jraue
            [background-clause] jraue
            [text-clause] jrau
           *[standalone]
                { $gender ->
                    [f] jraue
                    [n] jrau
                   *[m] jraue
                }
        }
    .red =
        { $role ->
            [border-clause] rude
            [background-clause] rude
            [text-clause] rud
           *[standalone]
                { $gender ->
                    [f] rude
                    [n] rud
                   *[m] rude
                }
        }
    .orange =
        { $role ->
            [border-clause] orangene
            [background-clause] orangene
            [text-clause] orange
           *[standalone]
                { $gender ->
                    [f] orangene
                    [n] orange
                   *[m] orangene
                }
        }
    .yellow =
        { $role ->
            [border-clause] jääle
            [background-clause] jääle
            [text-clause] jääl
           *[standalone]
                { $gender ->
                    [f] jääle
                    [n] jääl
                   *[m] jääle
                }
        }
    .green =
        { $role ->
            [border-clause] jröne
            [background-clause] jröne
            [text-clause] jrön
           *[standalone]
                { $gender ->
                    [f] jröne
                    [n] jrön
                   *[m] jröne
                }
        }
    .cyan =
        { $role ->
            [border-clause] cyanblaue
            [background-clause] cyanblaue
            [text-clause] cyanblau
           *[standalone]
                { $gender ->
                    [f] cyanblaue
                    [n] cyanblau
                   *[m] cyanblaue
                }
        }
    .blue =
        { $role ->
            [border-clause] blaue
            [background-clause] blaue
            [text-clause] blau
           *[standalone]
                { $gender ->
                    [f] blaue
                    [n] blau
                   *[m] blaue
                }
        }
    .purple =
        { $role ->
            [border-clause] vejolette
            [background-clause] vejolette
            [text-clause] vejolett
           *[standalone]
                { $gender ->
                    [f] vejolette
                    [n] vejolett
                   *[m] vejolette
                }
        }
    .pink =
        { $role ->
            [border-clause] rusane
            [background-clause] rusane
            [text-clause] rusa
           *[standalone]
                { $gender ->
                    [f] rusane
                    [n] rusa
                   *[m] rusane
                }
        }
    .brown =
        { $role ->
            [border-clause] brunge
            [background-clause] brunge
            [text-clause] brung
           *[standalone]
                { $gender ->
                    [f] brunge
                    [n] brung
                   *[m] brunge
                }
        }

line-width =
    .thick =
        { $role ->
            [border-clause] decke
            [background-clause] decke
            [text-clause] deck
           *[standalone]
                { $gender ->
                    [f] decke
                    [n] deck
                   *[m] decke
                }
        }
    .thin =
        { $role ->
            [border-clause] dünne
            [background-clause] dünne
            [text-clause] dünn
           *[standalone]
                { $gender ->
                    [f] dünne
                    [n] dünn
                   *[m] dünne
                }
        }

line-style =
    .dashed =
        { $role ->
            [border-clause] jestreichelte
            [background-clause] jestreichelte
            [text-clause] jestreichelt
           *[standalone]
                { $gender ->
                    [f] jestreichelte
                    [n] jestreichelt
                   *[m] jestreichelte
                }
        }
    .dotted =
        { $role ->
            [border-clause] jepünkselte
            [background-clause] jepünkselte
            [text-clause] jepünkselt
           *[standalone]
                { $gender ->
                    [f] jepünkselte
                    [n] jepünkselt
                   *[m] jepünkselte
                }
        }

# Noun phrases: they follow «met» and agree with nothing.
fill-style =
    .horizontal = waagerechte Linne
    .vertical = sengrechte Linne
    .diagonal = schrääje Linne
    .backdiagonal = ömjedrieht schrääje Linne
    .dots = Pünkte
    .diamonds = Ruute

noun =
    .line = Linie
    .line-segment = Streck
    .ray = Strahl
    .vector = Vektor
    .curve = Kurv
    .function = Funkzjohn
    .slope-field = Steijungsfeld
    .vector-field = Vektorfeld
    .parabola = Parabel
    .polyline = Streckezoch
    .polygon = Vielleck
    .triangle = Drieeck
    .rectangle = Rechteck
    .circle = Kreis
    .region = Beriech
    .point = Punk
    .square = Quadrat
    .diamond = Ruut
    .cross = Krütz
    .plus = Pluszeiche

# Kölsch keeps the side count in front of the noun, as a compound, so the whole
# thing is one head and there is no tail — the shape `locales/de` has.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] rääjelmäßig { $numSides }-Eck
    }

# Besides the nouns above, `$noun` can be `regular-polygon` (which is
# «{ $numSides }-Eck», neuter) or the head of a phrase the description never
# names. Those four, with their genders in Kölsch: `border` is **dä Rand**,
# masculine; `fill` is **de Föllung**, feminine; `text` is **dä Tex**,
# masculine; `background` is **dä Hingerjrund**, masculine. The three masculine
# ones fall to the default, and `fill` is listed.
noun-gender =
    { $noun ->
        [border] m
        [line] f
        [curve] f
        [function] f
        [parabola] f
        [diamond] f
        [fill] f
        [line-segment] f
        [polygon] n
        [triangle] n
        [rectangle] n
        [square] n
        [cross] n
        [plus] n
        [slope-field] n
        [vector-field] n
        [region] m
        [regular-polygon] n
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

# The adjectives lead and the noun closes the phrase: «decke rude Linie».
style-with-noun =
    { $parts ->
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }

# Only ever said of the shape itself, so it is standalone in every description
# and takes no `$role` branch.
style-filled-word =
    { $gender ->
        [f] jeföllte
        [n] jeföllt
       *[m] jeföllte
    }

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } met { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } met { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } met { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

# «Rand» is masculine, so the border's adjectives agree with it and not with
# the shape around it. «met enem» and «un enem» take the dative, which is what
# the `border-clause` branch of every adjective supplies. All four branches
# carry the article, including the two English leaves it off: Kölsch is happy
# with it everywhere, so keeping it collapses the distinction rather than
# getting one of the four wrong.
style-border-clause =
    { $parts ->
        [with-article] met enem { $border } Rand
        [and] un enem { $border } Rand
        [and-article] un enem { $border } Rand
       *[with] met enem { $border } Rand
    }

# The fill-pattern words are dative plurals, because their other use is the
# «met { $pattern }» clause above. So this message supplies a noun for them to
# hang off — «Föllung», feminine, which is the gender `noun-gender` already
# answers for `fill`, so the colour agrees with it in both variants.
style-fill =
    { $parts ->
        [pattern] { $color } Föllung met { $pattern }
       *[plain] { $color } Föllung
    }

style-unfilled = nit jeföllt

# «op» with no article takes the dative, which is the `background-clause`
# ending; the text colour beside it is predicative, and Kölsch leaves a
# predicative adjective bare. So this reads «rud op jääle Hingerjrund», where
# the standalone `textColor` and `backgroundColor` read «rude» and «jääle».
style-text =
    { $parts ->
        [background] { $color } op { $background } Hingerjrund
       *[plain] { $color }
    }

style-background-none = keine


## Boolean words

boolean-true = wohr
boolean-false = verkiehrt


## Answer buttons

answer-submit-label = Nohkicke
answer-submit-label-no-correctness = Antwood schecke


## Sectional blocks

section-name =
    .activity = Aktivität
    .aside = Enschoss
    .cascade = Kaskad
    .definition = Definizjohn
    .example = Beispell
    .exercise = Övung
    .exercises = Övunge
    .given-answer = Antwood
    .note = Aanmerkung
    .objectives = Lehrzeele
    .paragraphs = Avsätz
    .part = Deil
    .problem = Opjaav
    .problems = Opjaave
    .proof = Beweis
    .question = Frooch
    .section = Avschnett
    .solution = Löösung
    .task = Opjaav
    .theorem = Satz

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Tipp


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabell { $enumeration }
        [numbered-title] Tabell { $enumeration }{ ": " }
        [unnumbered-title] Tabell{ ": " }
       *[unnumbered] Tabell
    }

figure-name =
    { $parts ->
        [numbered] Beld { $enumeration }
        [numbered-caption] Beld { $enumeration }{ ": " }
        [unnumbered-caption] Beld{ ": " }
       *[unnumbered] Beld
    }


## Paginator controls

paginator-previous = Retour
paginator-next = Wigger
paginator-page = Sigg

paginator-page-status = { $pageLabel } { $currentPage } vun { $numPages }


## Piecewise functions

piecewise-condition-or = odder

piecewise-condition-if = wann

piecewise-condition-otherwise = söns


## Chemistry

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Ungültich chemisch Zeiche
chemistry-invalid-ionic-compound = Ungültije Ionevebendung

## Inputs embedded in math

math-embedded-input-blank = Lück

math-embedded-input-blank-ordinal = Lück { $ordinal } vun { $total }

# Standard Moroccan Tamazight content catalog: the prose the core computes into
# the document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `zgh` is ⵜⴰⵎⴰⵣⵉⵖⵜ, the standard Amazigh language Morocco made official in
# 2011, written in **Tifinagh** — the script IRCAM standardized and Unicode
# encodes at U+2D30–U+2D67. Tifinagh is **new to this roster**, and nothing
# about delivering it is special: it runs left to right like Latin, so
# `direction.ts` needed nothing, and the letters are ordinary characters that a
# `.ftl` file holds like any other.
#
# **`zgh` is Tifinagh and `locales/kab` is Latin, and this repository did not
# choose either.** The rule is the one that makes `sr` Cyrillic and `az` Latin:
# a catalog is written in whatever CLDR fills a bare tag in as. `zgh`
# maximizes to `zgh-Tfng` and `kab` to `kab-Latn`, so the same family arrives
# in two scripts — and `tzm`, Central Atlas Tamazight, would arrive in Latin
# too if it were ever seeded, which is worth knowing before someone "fixes" it.
# A reader arriving under `zgh-Latn` reaches this catalog and gets Tifinagh;
# the answer is a second catalog beside it rather than a rename of it.
#
# **The vocabulary is `locales/kab`'s and the spelling is not.** «ⴰⵣⴻⴳⴳⴰⵖ» is
# «azeggaɣ» letter for letter, and a reader who knows one script can read the
# other word by word. Where the two catalogs genuinely differ is in what
# `locales/shi` beside them shows: three Berber languages, two scripts, and
# real lexical differences inside the script they share.
#
# **Two genders, and an adjective agrees for them.** `noun-gender` answers `m`
# or `f`; a masculine adjective opens in ⴰ and its feminine counterpart is
# wrapped in ⵜ…ⵜ. Six colours have a Berber stem and fork; the other six are
# loans, invariable, and are written flat rather than given an inflection they
# do not have.
#
# **It selects on `$gender` alone**, for `locales/kab`'s reason exactly: the
# *état d'annexion* is a fact about nouns, and every noun a clause position
# lands on is one this catalog writes. And as there, every place `$pattern` is
# put stands behind the same preposition ⵙ, so `fill-style` can write one
# annexed form apiece.
#
# Adjectives follow the noun, so the composition messages put the noun first.


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] ⵜⴰⴱⴻⵔⴽⴰⵏⵜ
           *[m] ⴰⴱⴻⵔⴽⴰⵏ
        }
    .white =
        { $gender ->
            [f] ⵜⴰⵎⴻⵍⵍⴰⵍⵜ
           *[m] ⴰⵎⴻⵍⵍⴰⵍ
        }
    .gray = ⵔⵎⴰⴷⵉ
    .red =
        { $gender ->
            [f] ⵜⴰⵣⴻⴳⴳⴰⵖⵜ
           *[m] ⴰⵣⴻⴳⴳⴰⵖ
        }
    .orange = ⴱⵓⵔⵜⵓⵇⴰⵍⵉ
    .yellow =
        { $gender ->
            [f] ⵜⴰⵡⵔⴰⵖⵜ
           *[m] ⴰⵡⵔⴰⵖ
        }
    .green =
        { $gender ->
            [f] ⵜⴰⵣⴻⴳⵣⴰⵡⵜ
           *[m] ⴰⵣⴻⴳⵣⴰⵡ
        }
    .cyan = ⵙⵉⵢⴰⵏ
    .blue =
        { $gender ->
            [f] ⵜⴰⵏⵉⵍⵉⵜ
           *[m] ⴰⵏⵉⵍⵉ
        }
    .purple = ⴰⵕⴳⵡⴰⵏⵉ
    .pink = ⵡⴰⵔⴷⵉ
    .brown = ⵇⴰⵀⵡⵉ

line-width =
    .thick =
        { $gender ->
            [f] ⵜⴰⵣⵓⵔⴰⵏⵜ
           *[m] ⴰⵣⵓⵔⴰⵏ
        }
    .thin =
        { $gender ->
            [f] ⵜⴰⵔⵇⴰⵇⵜ
           *[m] ⴰⵔⵇⴰⵇ
        }

# Prepositional phrases rather than adjectives, so that they agree with nothing
# and can close the description.
line-style =
    .dashed = ⵙ ⵜⴻⴳⵣⵓⵎⵉⵏ
    .dotted = ⵙ ⵜⴻⵏⵇⵉⴹⵉⵏ

# Written in the annexed state, because every place these words are placed puts
# them behind ⵙ; see this file's header.
fill-style =
    .horizontal = ⵢⵉⵣⵉⵔⵉⴳⴻⵏ ⵉⴳⵍⴰⵢⴰⵏⴻⵏ
    .vertical = ⵢⵉⵣⵉⵔⵉⴳⴻⵏ ⵉⴱⴻⴷⴷⴻⵏ
    .diagonal = ⵢⵉⵣⵉⵔⵉⴳⴻⵏ ⵉⵣⴳⴻⵏ
    .backdiagonal = ⵢⵉⵣⵉⵔⵉⴳⴻⵏ ⵉⵣⴳⴻⵏ ⵙ ⵜⴰⵎⴰ ⵢⴰⴹⵏⵉⵏ
    .dots = ⵜⴻⵏⵇⵉⴹⵉⵏ
    .diamonds = ⵜⴻⵍⵎⴰⵙⵉⵏ

noun =
    .line = ⵉⵣⵉⵔⵉⴳ
    .line-segment = ⴰⴳⵣⵓⵎ ⵏ ⵢⵉⵣⵉⵔⵉⴳ
    .ray = ⴰⵣⵔⴰⵔ
    .vector = ⴰⴼⵉⴽⵜⵓⵔ
    .curve = ⵉⵣⵉⵔⵉⴳ ⴰⴽⵏⴰⵏ
    .function = ⵜⴰⵡⵓⵔⵉ
    .parabola = ⵜⴰⴱⴰⵔⴰⴱⵓⵍⵜ
    .polyline = ⵉⵣⵉⵔⵉⴳ ⵏ ⵢⵉⴳⵣⵓⵎⴻⵏ
    .polygon = ⴰⵎⴻⴳⴳⴻⵜⵙⴷⵉⵙ
    .triangle = ⴰⴽⵔⴰⴹⵉⵔⴰⵏ
    .rectangle = ⴰⵎⴽⵓⵥ ⴰⵣⴻⴳⵍⴰⵏ
    .circle = ⵜⴰⵡⵉⵏⴻⵙⵜ
    .region = ⵜⴰⵎⵏⴰⴹⵜ
    .point = ⵜⴰⵏⵇⵉⴹⵜ
    .square = ⴰⵎⴽⵓⵥ
    .diamond = ⵜⴰⵍⵎⴰⵙⵜ
    .cross = ⴰⵎⴳⵔⵉⴷ
    .plus = ⴰⵣⴰⵎⵓⵍ ⵏ ⵓⵔⵏⵓ

# The side count is a complement introduced by ⵙ, so it follows the whole
# phrase rather than opening it.
noun-regular-polygon =
    { $part ->
        [tail] ⵙ { $numSides } ⵏ ⵢⵉⴷⵉⵙⴰⵏ
       *[head] ⴰⵎⴻⴳⴳⴻⵜⵙⴷⵉⵙ ⴰⵎⴻⵛⵜⵓ
    }

# The grammatical gender of the noun being described. Masculine is the default
# and the gender a loanword takes.
noun-gender =
    { $noun ->
        [function] f
        [circle] f
        [region] f
        [point] f
        [diamond] f
        [border] f
        [parabola] f
       *[other] m
    }


## Style composition

style-stroke =
    { $parts ->
        [width-style-color] { $width } { $color } { $lineStyle }
        [width-color] { $width } { $color }
        [style-color] { $color } { $lineStyle }
        [width-style] { $width } { $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }

style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }

style-filled-word =
    { $gender ->
        [f] ⵜⴻⵛⵛⵓⵔ
       *[m] ⵉⵛⵛⵓⵔ
    }

# Every branch that places `$pattern` puts it behind ⵙ, which is what lets
# `fill-style` write one annexed form apiece.
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } ⵙ { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } ⵙ { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } ⵙ { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# ⵜⴰⵎⴰ is feminine, so the border's adjectives agree with it rather than with
# the shape it surrounds. Tamazight has no indefinite article, so the two
# `-article` branches read like their neighbours.
style-border-clause =
    { $parts ->
        [with-article] ⵙ ⵜⴻⵎⴰ { $border }
        [and] ⴷ ⵜⴻⵎⴰ { $border }
        [and-article] ⴷ ⵜⴻⵎⴰ { $border }
       *[with] ⵙ ⵜⴻⵎⴰ { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $color } ⵙ { $pattern }
       *[plain] { $color }
    }

style-unfilled = ⵓⵔ ⵉⵛⵛⵓⵔ

style-text =
    { $parts ->
        [background] { $color } ⵅⴼ ⵓⴳⵉⵍⴰⵍ { $background }
       *[plain] { $color }
    }

style-background-none = ⵓⵍⴰⵛ


## Boolean words

boolean-true = ⵜⵉⴷⴻⵜ
boolean-false = ⵜⴰⴽⴻⵕⴹⵉⵜ


## Answer buttons

answer-submit-label = ⵙⵏⵇⴻⴷ ⵜⴰⵡⵓⵔⵉ
answer-submit-label-no-correctness = ⴰⵣⴻⵏ ⵜⵉⵔⵉⵔⵉⵜ


## Sectional blocks

section-name =
    .activity = ⴰⵔⵎⵓⴷ
    .aside = ⵜⴰⵎⴻⵔⵏⴰ
    .cascade = ⴰⴷⴻⴳ
    .definition = ⵜⴰⴱⴰⴷⵓⵜ
    .example = ⴰⵎⴻⴷⵢⴰ
    .exercise = ⵜⴰⵣⵔⴰⵡⵜ
    .exercises = ⵜⵉⵣⵔⴰⵡⵉⵏ
    .given-answer = ⵜⵉⵔⵉⵔⵉⵜ
    .note = ⵜⴰⵣⵎⵉⵍⵜ
    .objectives = ⵉⵙⵡⵉⵢⴻⵏ
    .paragraphs = ⵉⴼⴻⵔⴷⵉⵙⴻⵏ
    .part = ⴰⵃⵔⵉⵛ
    .problem = ⵓⴳⵓⵔ
    .problems = ⵓⴳⵓⵔⴻⵏ
    .proof = ⴰⵙⴻⵏⵇⴻⴷ
    .question = ⴰⵙⴻⵇⵙⵉ
    .section = ⵜⵉⴳⴻⵣⵎⵉ
    .solution = ⵜⵉⴼⵔⴰⵜ
    .task = ⵜⴰⵡⵓⵔⵉ
    .theorem = ⵜⴰⵎⴰⵎⴽⵜ

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = ⵜⴰⵍⵖⵓⵜ


## Tables and figures

table-name =
    { $parts ->
        [numbered] ⵜⴰⴼⴻⵍⵡⵉⵜ { $enumeration }
        [numbered-title] ⵜⴰⴼⴻⵍⵡⵉⵜ { $enumeration }{ ": " }
        [unnumbered-title] ⵜⴰⴼⴻⵍⵡⵉⵜ{ ": " }
       *[unnumbered] ⵜⴰⴼⴻⵍⵡⵉⵜ
    }

figure-name =
    { $parts ->
        [numbered] ⵜⵓⴳⵏⴰ { $enumeration }
        [numbered-caption] ⵜⵓⴳⵏⴰ { $enumeration }{ ": " }
        [unnumbered-caption] ⵜⵓⴳⵏⴰ{ ": " }
       *[unnumbered] ⵜⵓⴳⵏⴰ
    }


## Paginator controls

paginator-previous = ⴰⵣⵡⵉⵔ
paginator-next = ⴰⴹⴼⵉⵔ
paginator-page = ⴰⵙⴻⴱⵜⴻⵔ

paginator-page-status = { $pageLabel } { $currentPage } ⵙⴻⴳ { $numPages }


## Piecewise functions

piecewise-condition-or = ⵏⴻⵖ

piecewise-condition-if = ⵎⴽ

piecewise-condition-otherwise = ⵏⴻⵖ ⵎⵓⵍⴰⵛ


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## The school-system case. Morocco teaches Amazigh as a subject and its
## secondary sciences in Arabic and French, so a Tamazight speaker meets the
## periodic table in one of those and the fallback *is* the curriculum. The
## same sentence covers `locales/shi` beside it and `locales/kab` across the
## border: three Berber catalogs, two school systems, one answer.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = ⴰⵣⴰⵎⵓⵍ ⴰⴽⵉⵎⵢⴰⵏ ⴰⵔⴰⵎⴻⵖⵜⵓ
chemistry-invalid-ionic-compound = ⴰⵙⴷⵓⴽⴽⴻⵍ ⴰⵢⵓⵏⴰⵏ ⴰⵔⴰⵎⴻⵖⵜⵓ

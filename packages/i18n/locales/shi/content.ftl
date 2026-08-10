# Tachelhit content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `shi` is ⵜⴰⵛⵍⵃⵉⵜ, the Berber language of the Souss and the High Atlas, and
# the largest Amazigh variety in Morocco. It is written here in **Tifinagh**,
# which is what a bare `shi` maximizes to (`shi-Tfng`), the same rule that puts
# `locales/zgh` in Tifinagh and `locales/kab` in Latin. A reader arriving under
# `shi-Latn` reaches this catalog and gets Tifinagh.
#
# **`shi` and `zgh` are two directories rather than one with a script tag**,
# and it is the `hr`-against-`sr` case a sixth time: two standard languages,
# one script, two vocabularies. This file writes ⵓⵎⵍⵉⵍ where `locales/zgh`
# writes ⴰⵎⴻⵍⵍⴰⵍ and ⴰⵙⴳⴳⴰⵏ where it writes ⴰⴱⴻⵔⴽⴰⵏ. Copying either over the
# other would be wrong in both.
#
# **This is the roster's first catalog outside Europe with a `few` plural
# category.** `Intl.PluralRules("shi")` reports `one`, `few` and `other` — one
# for 0 and 1, few for 2 through 10, other above that — which is the shape
# `bs`, `hr`, `ro` and `sr` already have, reached here from Afro-Asiatic
# instead. Every counted message in this catalog therefore writes three
# branches where `locales/zgh` and `locales/kab` write two, and the three
# Berber catalogs' plural rules are as different from each other as their
# scripts are. Plural categories are per-language CLDR data; a family and a
# script both say nothing about them.
#
# **Two genders, and an adjective agrees for them**, exactly as in the two
# catalogs beside it: `noun-gender` answers `m` or `f`, a masculine adjective
# opens in ⴰ and its feminine counterpart is wrapped in ⵜ…ⵜ. The six loan
# colours are invariable and are written flat.
#
# It selects on `$gender` alone, for `locales/kab`'s reason: the *état
# d'annexion* falls on nouns, and every noun a clause position lands on is one
# this catalog writes. And as there, every place `$pattern` is put stands
# behind the same preposition ⵙ, so `fill-style` writes one annexed form each.


## Style vocabulary

color =
    .black =
        { $gender ->
            [f] ⵜⴰⵙⴳⴳⴰⵏⵜ
           *[m] ⴰⵙⴳⴳⴰⵏ
        }
    .white =
        { $gender ->
            [f] ⵜⵓⵎⵍⵉⵍⵜ
           *[m] ⵓⵎⵍⵉⵍ
        }
    .gray = ⵔⵎⴰⴷⵉ
    .red =
        { $gender ->
            [f] ⵜⴰⵣⴳⴳⵯⴰⵖⵜ
           *[m] ⴰⵣⴳⴳⵯⴰⵖ
        }
    .orange = ⵜⵛⵉⵏⴰ
    .yellow =
        { $gender ->
            [f] ⵜⴰⵡⵔⴰⵖⵜ
           *[m] ⴰⵡⵔⴰⵖ
        }
    .green =
        { $gender ->
            [f] ⵜⴰⵣⴳⵣⴰⵡⵜ
           *[m] ⴰⵣⴳⵣⴰⵡ
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
            [f] ⵜⴰⵔⵇⵇⴰⵇⵜ
           *[m] ⴰⵔⵇⵇⴰⵇ
        }

line-style =
    .dashed = ⵙ ⵜⴳⵣⵓⵎⵉⵏ
    .dotted = ⵙ ⵜⵏⵇⵉⴹⵉⵏ

# Written in the annexed state, because every place these words are placed puts
# them behind ⵙ; see this file's header.
fill-style =
    .horizontal = ⵢⵉⵣⵉⵔⵉⴳⵏ ⵉⴳⵏⴰⵏⵉⵏ
    .vertical = ⵢⵉⵣⵉⵔⵉⴳⵏ ⵉⴱⴷⴷⴰⵏⵉⵏ
    .diagonal = ⵢⵉⵣⵉⵔⵉⴳⵏ ⵉⵥⵍⴰⵢⵏⵉⵏ
    .backdiagonal = ⵢⵉⵣⵉⵔⵉⴳⵏ ⵉⵥⵍⴰⵢⵏⵉⵏ ⵙ ⵜⴰⵎⴰ ⵢⴰⴹⵏⵉⵏ
    .dots = ⵜⵏⵇⵉⴹⵉⵏ
    .diamonds = ⵜⵍⵎⴰⵙⵉⵏ

noun =
    .line = ⵉⵣⵉⵔⵉⴳ
    .line-segment = ⴰⴳⵣⵓⵎ ⵏ ⵢⵉⵣⵉⵔⵉⴳ
    .ray = ⴰⵣⵔⴰⵔ
    .vector = ⴰⴼⵉⴽⵜⵓⵔ
    .curve = ⵉⵣⵉⵔⵉⴳ ⴰⴽⵏⴰⵏ
    .function = ⵜⴰⵡⵓⵔⵉ
    .parabola = ⵜⴰⴱⴰⵔⴰⴱⵓⵍⵜ
    .polyline = ⵉⵣⵉⵔⵉⴳ ⵏ ⵢⵉⴳⵣⵓⵎⵏ
    .polygon = ⴰⵎⴳⴳⵜⵙⴷⵉⵙ
    .triangle = ⴰⴽⵔⴰⴹⵉⵔⴰⵏ
    .rectangle = ⴰⵎⴽⵓⵥ ⴰⵣⴳⵍⴰⵏ
    .circle = ⵜⴰⵡⵉⵏⵙⵜ
    .region = ⵜⴰⵎⵏⴰⴹⵜ
    .point = ⵜⴰⵏⵇⵉⴹⵜ
    .square = ⴰⵎⴽⵓⵥ
    .diamond = ⵜⴰⵍⵎⴰⵙⵜ
    .cross = ⴰⵎⴳⵔⵉⴷ
    .plus = ⴰⵣⴰⵎⵓⵍ ⵏ ⵓⵔⵏⵓ

noun-regular-polygon =
    { $part ->
        [tail] ⵙ { $numSides } ⵏ ⵢⵉⴷⵉⵙⴰⵏ
       *[head] ⴰⵎⴳⴳⵜⵙⴷⵉⵙ ⴰⵎⵛⵜⵓ
    }

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
        [f] ⵜⵛⵛⵓⵔ
       *[m] ⵉⵛⵛⵓⵔ
    }

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

style-border-clause =
    { $parts ->
        [with-article] ⵙ ⵜⵎⴰ { $border }
        [and] ⴷ ⵜⵎⴰ { $border }
        [and-article] ⴷ ⵜⵎⴰ { $border }
       *[with] ⵙ ⵜⵎⴰ { $border }
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

style-background-none = ⵓⵔ ⵉⵍⵍⵉ


## Boolean words

boolean-true = ⵜⵉⴷⵜ
boolean-false = ⵜⴰⴽⵔⴹⵉⵜ


## Answer buttons

answer-submit-label = ⵙⵏⵇⴷ ⵜⴰⵡⵓⵔⵉ
answer-submit-label-no-correctness = ⴰⵣⵏ ⵜⵉⵔⵉⵔⵉⵜ


## Sectional blocks

section-name =
    .activity = ⴰⵔⵎⵓⴷ
    .aside = ⵜⴰⵎⵔⵏⴰ
    .cascade = ⴰⴷⴳ
    .definition = ⵜⴰⴱⴰⴷⵓⵜ
    .example = ⴰⵎⴷⵢⴰ
    .exercise = ⵜⴰⵣⵔⴰⵡⵜ
    .exercises = ⵜⵉⵣⵔⴰⵡⵉⵏ
    .given-answer = ⵜⵉⵔⵉⵔⵉⵜ
    .note = ⵜⴰⵣⵎⵉⵍⵜ
    .objectives = ⵉⵙⵡⵉⵜⵏ
    .paragraphs = ⵉⴼⵔⴷⵉⵙⵏ
    .part = ⴰⵃⵔⵉⵛ
    .problem = ⵓⴳⵓⵔ
    .problems = ⵓⴳⵓⵔⵏ
    .proof = ⴰⵙⵏⵇⴷ
    .question = ⴰⵙⵇⵙⵉ
    .section = ⵜⵉⴳⵣⵎⵉ
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
        [numbered] ⵜⴰⴼⵍⵡⵉⵜ { $enumeration }
        [numbered-title] ⵜⴰⴼⵍⵡⵉⵜ { $enumeration }{ ": " }
        [unnumbered-title] ⵜⴰⴼⵍⵡⵉⵜ{ ": " }
       *[unnumbered] ⵜⴰⴼⵍⵡⵉⵜ
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
paginator-page = ⴰⵙⴰⵜⵓ

paginator-page-status = { $pageLabel } { $currentPage } ⵣⴳ { $numPages }


## Piecewise functions

piecewise-condition-or = ⵏⵖ

piecewise-condition-if = ⵎⴽ

piecewise-condition-otherwise = ⵏⵖ ⵓⵍⴰ


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## The school-system case, the same one `locales/zgh` records: Morocco teaches
## Amazigh as a subject and its secondary sciences in Arabic and French, so the
## fallback *is* the curriculum.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = ⴰⵣⴰⵎⵓⵍ ⴰⴽⵉⵎⵢⴰⵏ ⴰⵔⴰⵎⵖⵜⵓ
chemistry-invalid-ionic-compound = ⴰⵙⴷⵓⴽⴽⵍ ⴰⵢⵓⵏⴰⵏ ⴰⵔⴰⵎⵖⵜⵓ

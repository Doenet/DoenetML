# Santali content catalog: the prose the core computes into the document.
# Selected by `documentLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in **Ol Chiki**, the script Raghunath Murmu devised for Santali in
# 1925 and the one the Eighth Schedule and CLDR both name: `sat` maximizes to
# `sat-Olck`. Santali is also written in Devanagari, Bengali, Odia and Latin
# letters depending on the state; `sat-Deva`, `sat-Beng`, `sat-Orya` and
# `sat-Latn` all reach this catalog and get Ol Chiki. That is the `pa`, `sr`
# and `jv` asymmetry with four other scripts rather than one, and the answer is
# the same: a second catalog beside this one, never a transliteration inside
# it.
#
# **Santali is the roster's first Munda language and its first dual outside
# Semitic and Celtic.** `Intl.PluralRules("sat")` reports `one`, `two` and
# `other`, because Santali marks a dual on the noun — ᱠᱩᱨᱩᱢᱩᱴᱩ, ᱠᱩᱨᱩᱢᱩᱴᱩᱠᱤᱱ,
# ᱠᱩᱨᱩᱢᱩᱴᱩᱠᱚ — with the suffix -ᱠᱤᱱ where the plural takes -ᱠᱚ. Nine other
# catalogs resolve a `two` category and write it — `ar`, `he` and `mt`, the
# Celtic `br`, `cy`, `ga` and `gd`, plus `se` and `sl` — but none writes it
# everywhere: this catalog's 16 `[two]` branches are the roster's most, ahead
# of Slovene's 14, because every counted message it has writes all three.
# **None of them is in this file**: `content.ftl` has no counted message in
# any language, so the dual is `chrome.ftl`, `diagnostics.ftl` and
# `editor.ftl`'s business and their headers repeat it.
#
# Santali is Munda: no grammatical gender, no adjective agreement, adjectives
# in front of the noun. So neither `$gender` nor `$role` is selected on.
#
# Numbers render in Latin digits (#1615), which is worth stating because Ol
# Chiki has digits of its own (᱐–᱙) that this catalog therefore does not use.
# Grouping comes from CLDR per locale, and CLDR gives Santali the Western
# thousands — `1,234,567`, not India's `12,34,567`.


## Style vocabulary

color =
    .black = ᱦᱮᱸᱫᱮ
    .white = ᱯᱩᱸᱰ
    .gray = ᱫᱷᱩᱥᱟᱨ
    .red = ᱟᱨᱟᱜ
    .orange = ᱠᱚᱢᱞᱟ
    .yellow = ᱥᱟᱥᱟᱝ
    .green = ᱦᱟᱨᱤᱭᱟᱨ
    .cyan = ᱥᱟᱭᱟᱱ
    .blue = ᱱᱤᱞ
    .purple = ᱵᱮᱜᱩᱱᱤ
    .pink = ᱜᱩᱞᱟᱹᱯᱤ
    .brown = ᱠᱷᱟᱭᱨᱤ
line-width =
    .thick = ᱢᱚᱴᱟ
    .thin = ᱯᱟᱛᱞᱟ
line-style =
    .dashed = ᱨᱟᱲᱟᱜ
    .dotted = ᱴᱩᱰᱟᱹᱜᱟᱱ
fill-style =
    .horizontal = ᱜᱤᱛᱤᱡ ᱜᱟᱨᱠᱚ
    .vertical = ᱴᱮᱸᱜᱚᱱ ᱜᱟᱨᱠᱚ
    .diagonal = ᱠᱚᱱᱟ ᱜᱟᱨᱠᱚ
    .backdiagonal = ᱩᱞᱴᱟ ᱠᱚᱱᱟ ᱜᱟᱨᱠᱚ
    .dots = ᱴᱩᱰᱟᱹᱜᱠᱚ
    .diamonds = ᱥᱚᱢᱪᱟᱛᱩᱨᱵᱷᱩᱡ
noun =
    .line = ᱜᱟᱨ
    .line-segment = ᱜᱟᱨ ᱦᱟᱹᱴᱤᱧ
    .ray = ᱠᱤᱨᱚᱬ
    .vector = ᱥᱚᱫᱤᱥ
    .curve = ᱠᱚᱸᱰᱚᱲ ᱜᱟᱨ
    .function = ᱯᱷᱚᱞᱚᱱ
    .parabola = ᱯᱚᱨᱚᱵᱚᱞᱚᱭ
    .polyline = ᱟᱭᱢᱟ ᱜᱟᱨ
    .polygon = ᱵᱚᱦᱩᱵᱷᱩᱡ
    .triangle = ᱛᱨᱤᱵᱷᱩᱡ
    .rectangle = ᱟᱭᱚᱛ
    .circle = ᱜᱚᱞ
    .region = ᱡᱟᱭᱜᱟ
    .point = ᱴᱩᱰᱟᱹᱜ
    .square = ᱵᱚᱨᱜᱚ
    .diamond = ᱥᱚᱢᱪᱟᱛᱩᱨᱵᱷᱩᱡ
    .cross = ᱜᱩᱬᱟ ᱪᱤᱱᱦᱟᱹ
    .plus = ᱡᱚᱲᱟᱣ ᱪᱤᱱᱦᱟᱹ
# The side count stands in front of the noun with the rest of the modifiers,
# so the tail is empty.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides } ᱫᱷᱟᱨᱮᱱ ᱥᱚᱢ ᱵᱚᱦᱩᱵᱷᱩᱡ
    }
# Nothing selects on it: Santali has no grammatical gender.
noun-gender = neuter

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
style-filled-word = ᱯᱮᱨᱮᱡᱟᱜ
# «ᱛᱮ» is the instrumental postposition and follows what it governs, so the
# pattern moves to the front of the phrase where English appends it. It has one
# shape whatever precedes it.
style-filled =
    { $parts ->
        [pattern] { $pattern } ᱛᱮ { $filled } { $color }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $pattern } ᱛᱮ { $filled } { $color } { $noun }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $pattern } ᱛᱮ { $filled } { $color } { $noun } { $nounTail }
       *[plain] { $filled } { $color } { $noun }
    }
# Santali has no article, so the two `-article` branches read like their
# neighbours; «ᱟᱨ» is the conjunction and stands in front.
style-border-clause =
    { $parts ->
        [with-article] { $border } ᱠᱤᱱᱟᱨ ᱥᱟᱶ
        [and] ᱟᱨ { $border } ᱠᱤᱱᱟᱨ ᱥᱟᱶ
        [and-article] ᱟᱨ { $border } ᱠᱤᱱᱟᱨ ᱥᱟᱶ
       *[with] { $border } ᱠᱤᱱᱟᱨ ᱥᱟᱶ
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } ᱛᱮ { $color } ᱯᱮᱨᱮᱡ
       *[plain] { $color } ᱯᱮᱨᱮᱡ
    }
style-unfilled = ᱵᱟᱝ ᱯᱮᱨᱮᱡᱟᱜ
# «ᱨᱮ» is the locative postposition, and has one shape too.
style-text =
    { $parts ->
        [background] { $background } ᱛᱟᱭᱚᱢ ᱨᱮ { $color }
       *[plain] { $color }
    }
style-background-none = ᱡᱟᱦᱟᱸ ᱵᱟᱝ

## Boolean words

boolean-true = ᱥᱟᱨᱤ
boolean-false = ᱵᱟᱝ ᱥᱟᱨᱤ

## Answer buttons

answer-submit-label = ᱧᱮᱞ ᱢᱮ
answer-submit-label-no-correctness = ᱛᱮᱞᱟ ᱠᱩᱞ ᱢᱮ

## Sectional blocks

section-name =
    .activity = ᱠᱟᱹᱢᱤ
    .aside = ᱛᱮᱥᱟᱨ ᱠᱟᱛᱷᱟ
    .cascade = ᱠᱟᱥᱠᱮᱰ
    .definition = ᱵᱟᱛᱟᱣ
    .example = ᱩᱫᱟᱦᱟᱨᱚᱬ
    .exercise = ᱪᱮᱛᱟᱱ
    .exercises = ᱪᱮᱛᱟᱱ
    .given-answer = ᱛᱮᱞᱟ
    .note = ᱴᱤᱯᱚᱱ
    .objectives = ᱞᱟᱠᱷᱟᱹᱭ
    .paragraphs = ᱟᱱᱩᱪᱪᱷᱮᱫ
    .part = ᱦᱟᱹᱴᱤᱧ
    .problem = ᱥᱟᱢᱥᱭᱟ
    .problems = ᱥᱟᱢᱥᱭᱟ
    .proof = ᱥᱟᱵᱩᱫ
    .question = ᱠᱩᱠᱞᱤ
    .section = ᱠᱷᱚᱸᱰ
    .solution = ᱛᱮᱭᱟᱨ
    .task = ᱠᱟᱹᱢᱤ
    .theorem = ᱯᱨᱚᱢᱮᱭ
section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }
hint-title = ᱪᱤᱱᱦᱟᱹ

## Tables and figures

table-name =
    { $parts ->
        [numbered] ᱥᱟᱨᱬᱤ { $enumeration }
        [numbered-title] ᱥᱟᱨᱬᱤ { $enumeration }{ ": " }
        [unnumbered-title] ᱥᱟᱨᱬᱤ{ ": " }
       *[unnumbered] ᱥᱟᱨᱬᱤ
    }
figure-name =
    { $parts ->
        [numbered] ᱪᱤᱛᱟᱹᱨ { $enumeration }
        [numbered-caption] ᱪᱤᱛᱟᱹᱨ { $enumeration }{ ": " }
        [unnumbered-caption] ᱪᱤᱛᱟᱹᱨ{ ": " }
       *[unnumbered] ᱪᱤᱛᱟᱹᱨ
    }

## Paginator controls

paginator-previous = ᱢᱟᱲᱟᱝᱟᱜ
paginator-next = ᱛᱟᱭᱚᱢᱟᱜ
paginator-page = ᱥᱟᱦᱴᱟ
# «X ᱠᱷᱚᱱ Y» — "Y out of X" — puts the total first, so the two counts change
# places.
paginator-page-status = { $numPages } ᱠᱷᱚᱱ { $pageLabel } { $currentPage }

## Piecewise functions

piecewise-condition-or = ᱥᱮ
piecewise-condition-if = ᱡᱩᱫᱤ
piecewise-condition-otherwise = ᱵᱟᱝ ᱠᱷᱟᱱ

## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so all 130
## keys fall back to English and `lint:i18n` reports the gap.
##
## Santali-medium schooling exists in Jharkhand, West Bengal and Odisha, and it
## stops below the grades where the periodic table is taught: secondary science
## is Hindi-, Bengali- or Odia-medium depending on the state. Beside that,
## there is no settled Santali list of all 118 to seed from. It is the Ojibwe
## shape — a school system that does not reach the table, and no table waiting
## on the other side of it — rather than the plain school-system case the
## Indo-Aryan catalogs in this batch record.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = ᱵᱟᱝ ᱴᱷᱤᱠ ᱨᱟᱥᱟᱭᱚᱱᱤᱠ ᱪᱤᱱᱦᱟᱹ
chemistry-invalid-ionic-compound = ᱵᱟᱝ ᱴᱷᱤᱠ ᱟᱭᱚᱱᱤᱠ ᱡᱚᱛᱚ

# Gilbertese / Kiribati (te taetae ni Kiribati) content catalog: the prose the
# core computes into the document. Selected by `documentLocale` — the language
# the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** This file writes the **standard Kiribati orthography** — the
# thirteen letters `a b e i k m n ng o r t u w`. It spells the velarized
# labials with the `w` — **«bw» and «mw»**, as in «bwai», «mwakoro»,
# «mwakuri» — which is the modern dictionary and school convention; the older
# mission orthography of the Kiribati Bible writes «bai», «makoro», «makuri»
# and leaves the distinction to the reader. Both are current, and a reviewer
# who prefers the mission spelling should convert all four files at once rather
# than mix the two. **No macrons**: vowel length is written by doubling the
# vowel («mainaina», «kaawakina»), and a macron anywhere in these files is a
# mistake.
#
# **Word order: the noun comes first and the describing words follow it, joined
# by the linker «ae».** «te kaa ae uraura» is *the red car*. «ae» is the
# singular linker and «aika» the plural one; every noun described here is
# singular, so **«ae» is the only linker this catalog uses**, and it is
# repeated before each modifier: «te line ae bubura ae uraura» for *thick red
# line*. It is a word of its own, so nothing is welded to a placeable. This is
# the postnominal order the batch's five other Micronesian catalogs write —
# `mh`, `chk`, `pon`, `kos` and `na` — and that `ch`, `sm` and `to` already had.
#
# **No grammatical gender.** `noun-gender` answers one token, and no adjective
# here forks on `$gender`; the linker «ae» is invariable and does not agree
# with anything. **No `$role` fork** either: a describing word standing alone
# and the same word inside a border or background clause are identical, because
# «ae» does the work a case ending does in a language that inflects.
#
# **Number.** A noun is not marked for number by a numeral in front of it. See
# the counting and classifier note in `chrome.ftl`: this catalog counts
# abstract things with the general classifier «-ua», which cannot be written on
# a placeable and so lives in that header rather than in a message.
#
# **The chemistry tables are deliberately absent.** `element-name` and
# `element-anion-name` are the only English keys this file does not cover.
# School chemistry in Kiribati is taught in English, and the periodic table an
# I-Kiribati student meets is an English one; writing a hundred and eighteen
# element names here would report a fact about a curriculum that does not exist
# rather than about the language. `lint:i18n` reports the two as missing
# coverage, and that report is correct. `ion-name-oxidation-state` and the two
# invalid-symbol messages **are** covered: they are frames and punctuation
# rather than a vocabulary.
#
# **Loans.** Where this seed could not establish a Kiribati word it keeps the
# **English word in English spelling** and says so, rather than inventing a
# respelling — the method `locales/na` states for its whole lexicon, applied
# here only where it is needed. The geometry nouns (`line`, `ray`, `vector`,
# `curve`, `function`, `parabola`, `polygon`, `polyline`, `triangle`,
# `rectangle`, `circle`, `region`, `point`, `square`, `diamond`, `cross`,
# `plus`, `slope field`, `vector field`), four colour words (`gray`, `orange`,
# `cyan`, `purple`, `pink`, `brown`), the dash and fill patterns, `blank`,
# `cascade`, `theorem`, `paragraph`, `chemistry` and `ionic compound` are loans
# of that kind. Replacing any of them needs no permission.
#
# **Colours this seed does commit to**, and the one that a reviewer should
# check first: «roro» black, «mainaina» white, «uraura» red, «babobo» yellow,
# «mawaawa» green, «buruu» blue. **«mawaawa» covers green and blue both** in
# traditional usage — it is the colour of the lagoon — and this file assigns it
# to *green* and gives *blue* the adapted loan «buruu», which is what
# distinguishes the two in modern speech. A reviewer may prefer the reverse
# assignment; what matters is that the two keys not collapse onto one word.
#
# **Coinages, flagged rather than hidden.** «kanoaki» *filled* (from «kanoa»,
# contents, in its passive) and «aki kanoaki» *unfilled*; «Kabwaraana» for
# *Solution* (from «kabwara», to loosen or release); «Kaotioti» for *Hint*.
# Each is formed by a productive rule of the language, and each is a guess a
# speaker can overturn in one line.


## Style vocabulary

color =
    .black = roro
    .white = mainaina
    .gray = gray
    .red = uraura
    .orange = orange
    .yellow = babobo
    .green = mawaawa
    .cyan = cyan
    .blue = buruu
    .purple = purple
    .pink = pink
    .brown = brown

line-width =
    .thick = bubura
    .thin = irariki

line-style =
    .dashed = dashed
    .dotted = dotted

fill-style =
    .horizontal = taian line ae horizontal
    .vertical = taian line ae vertical
    .diagonal = taian line ae diagonal
    .backdiagonal = taian line ae reverse diagonal
    .dots = taian dot
    .diamonds = taian diamond

noun =
    .line = line
    .line-segment = line segment
    .ray = ray
    .vector = vector
    .curve = curve
    .function = function
    .slope-field = slope field
    .vector-field = vector field
    .parabola = parabola
    .polyline = polyline
    .polygon = polygon
    .triangle = triangle
    .rectangle = rectangle
    .circle = circle
    .region = region
    .point = point
    .square = square
    .diamond = diamond
    .cross = cross
    .plus = plus

# The head carries the side count and the modifiers follow it through «ae», so
# Kiribati has no use for the tail; it selects the empty string as English does.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] regular polygon ae { $numSides } itera
    }

# Kiribati has no grammatical gender: one token, and nothing selects on it.
noun-gender = neuter


## Style composition
##
## Each modifier is introduced by its own «ae», which is how a Kiribati noun
## takes more than one describing word. The description built here is handed on
## to `style-with-noun`, which puts the noun in front of it.

style-stroke =
    { $parts ->
        [width-style-color] { $width } ae { $lineStyle } ae { $color }
        [width-color] { $width } ae { $color }
        [style-color] { $lineStyle } ae { $color }
        [width-style] { $width } ae { $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }

style-with-noun =
    { $parts ->
        [noun-tail] te { $noun } { $nounTail } ae { $description }
       *[noun] te { $noun } ae { $description }
    }

style-filled-word = kanoaki

style-filled =
    { $parts ->
        [pattern] { $filled } ae { $color } ma { $pattern }
       *[plain] { $filled } ae { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] te { $noun } ae { $filled } ae { $color } ma { $pattern }
        [plain-tail] te { $noun } { $nounTail } ae { $filled } ae { $color }
        [pattern-tail] te { $noun } { $nounTail } ae { $filled } ae { $color } ma { $pattern }
       *[plain] te { $noun } ae { $filled } ae { $color }
    }

# Kiribati marks a noun with «te» whether or not English wants an article, so
# the `-article` branches read the same as their bare partners; they are kept
# apart because the core still selects between them.
style-border-clause =
    { $parts ->
        [with-article] ma te border ae { $border }
        [and] ao te border ae { $border }
        [and-article] ao te border ae { $border }
       *[with] ma te border ae { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } ae { $color }
       *[plain] { $color }
    }

style-unfilled = aki kanoaki

style-text =
    { $parts ->
        [background] { $color } ma te background ae { $background }
       *[plain] { $color }
    }

style-background-none = akea


## Boolean words

boolean-true = koaua
boolean-false = kewe


## Answer buttons

answer-submit-label = Tuoa am mwakuri
answer-submit-label-no-correctness = Kanakoa te kaeka


## Sectional blocks

section-name =
    .activity = Mwakuri
    .aside = Taeka i Rarikina
    .cascade = Cascade
    .definition = Kabwarabwaraan Nanona
    .example = Katoto
    .exercise = Kataneiai
    .exercises = Taian Kataneiai
    .given-answer = Kaeka
    .note = Ururing
    .objectives = Taian Kantaninga
    .paragraphs = Taian Paragraph
    .part = Iterana
    .problem = Kangaanga
    .problems = Taian Kangaanga
    .proof = Kakoaua
    .question = Titiraki
    .section = Mwakoro
    .solution = Kabwaraana
    .task = Mwioko
    .theorem = Theorem

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Kaotioti


## Tables and figures

table-name =
    { $parts ->
        [numbered] Taibora { $enumeration }
        [numbered-title] Taibora { $enumeration }{ ": " }
        [unnumbered-title] Taibora{ ": " }
       *[unnumbered] Taibora
    }

figure-name =
    { $parts ->
        [numbered] Taamnei { $enumeration }
        [numbered-caption] Taamnei { $enumeration }{ ": " }
        [unnumbered-caption] Taamnei{ ": " }
       *[unnumbered] Taamnei
    }


## Paginator controls

paginator-previous = Rimoa
paginator-next = Imwina
paginator-page = Iteraniba

paginator-page-status = { $pageLabel } { $currentPage } mai { $numPages }


## Piecewise functions

piecewise-condition-or = ke

piecewise-condition-if = ngkana

piecewise-condition-otherwise = ngkana tiaki


## Chemistry
##
## `element-name` and `element-anion-name` are absent on purpose; the header
## says why. What is here is a frame and its punctuation, not a vocabulary.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Te kanikina ni chemistry ae aki eti
chemistry-invalid-ionic-compound = Te ionic compound ae aki eti


## Inputs embedded in math

math-embedded-input-blank = blank

math-embedded-input-blank-ordinal = blank { $ordinal } mai { $total }

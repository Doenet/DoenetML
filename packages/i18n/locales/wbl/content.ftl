# Wakhi (Xik zik) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography: the Latin practice of Pakistan**, in the plain form
# `chrome.ftl`'s header sets out in full — the basic Latin letters plus the
# digraphs `sh ch zh kh gh th dh ts ng`, and **no diacritics**, so the
# retroflex and interdental contrasts a fuller Wakhi Latin writes (x̌, ẓ̌, ṣ̌,
# ǰ, ð, θ, ɣ̌) are not written here. Wakhi has no single settled orthography;
# the other live one is the **Cyrillic used in Tajikistan**, and a reader
# there, in Afghanistan or in Xinjiang may not recognize these spellings at
# all. Do not mix the two: no Cyrillic and no Perso-Arabic anywhere in this
# file. Converting to Cyrillic means converting **all four files at once**,
# and it means changing the source language of the loans as well (Tajik and
# Russian instead of Urdu and English), which is why it is a conversion rather
# than a transliteration.
#
# ## Word order, and how a modifier attaches
#
# **Adjectives precede their noun**, with nothing between them and no linker:
# «mota surkh khat» is *thick red line*. That is the same order English has,
# so `style-stroke`, `style-with-noun` and `style-filled-with-noun` keep
# English's sequence of placeables — which is a fact about Wakhi and not a
# failure to translate. The clause messages differ: Wakhi is **verb-final and
# postpositional**, so where English writes a preposition this file writes
# «ba» ('with') before the noun in `style-filled` and `style-border-clause`
# only because welding a postposition onto a `{ $placeable }` is what the
# README forbids. A speaker who wants the postposition will have to move the
# whole clause, and that is a change to a message rather than to a word.
#
# **`[noun-tail]` is unused.** The side count of a regular polygon goes in
# front of the head noun, «{ $numSides }-tarafa regular polygon», because
# modifiers precede in Wakhi — so `noun-regular-polygon` fills `head` and
# leaves `tail` empty exactly as English does.
#
# ## Gender, and why there is no fork
#
# **This catalog does not fork on `$gender`, and that is a limit rather than a
# claim.** `noun-gender` answers the single token `neuter` for everything, and
# no adjective below selects on it. Wakhi is generally described as having no
# grammatical gender in the Indo-European sense, but this seed is **not
# confident enough** in that to write it down as a finding — the Pamir
# languages differ from one another here, and some mark a gender distinction
# in limited corners of the grammar. What the seed is confident of is that it
# has no reliable table to fork *with*. If a speaker establishes a fork, the
# adjectives to change are `color`, `line-width`, `line-style`, `fill-style`
# and `style-filled-word`, and `noun-gender` is where the table goes.
#
# **No `$role` fork either.** A describing word standing alone and the same
# word inside a border or background clause are written identically here.
# Wakhi does mark case on nouns; whether these three clause positions govern
# different forms of a *modifier* is exactly what the seed cannot check, so it
# writes one form rather than three guesses.
#
# ## Number
#
# A noun is not marked for number after a numeral, and CLDR has no plural data
# for `wbl` at all, so `Intl.PluralRules` would resolve against the runtime's
# default locale. Nothing in this file selects on a count; the two counted
# messages in `chrome.ftl` and the counted messages in `diagnostics.ftl` write
# a **single `*[other]`** branch, keeping only English's explicit `[0]`, which
# Fluent matches against the number rather than against a category.
#
# ## Chemistry: both element tables are deliberately absent
#
# `element-name` and `element-anion-name` are the **only English keys this
# file does not cover**, and the reason is a fact about two school systems
# rather than about Wakhi. **Nowhere is chemistry taught in Wakhi.** In Gojal
# and the rest of Gilgit-Baltistan secondary science is Urdu- and
# English-medium; in the Tajik and Afghan Wakhan it is Tajik- and
# Dari-medium, with the Russian names behind the Tajik ones. So there is no
# settled, checkable Wakhi list of the 118 elements to seed from, and there is
# no single fallback either — a Gojali pupil meets the English names and a
# Wakhan pupil the Tajik ones. Coining 118 names here would invent a
# nomenclature no reader has ever seen and would hide that split. The 130 keys
# therefore fall back to English, which is at least what half the readership's
# textbooks print. `ion-name-oxidation-state` and the two invalid-symbol
# messages are frames rather than vocabulary and are covered below.
#
# ## The loans, in full
#
# Every technical word this seed could not establish in Wakhi is left as the
# word actually used in Gojal, in that language's own spelling, and is not
# respelled. **The geometric nouns are almost entirely loans around a Wakhi
# frame** — that is this file's honest summary of itself, in the manner of
# `locales/kos` and `locales/gil`.
#
#   * **Urdu/Persian**, where the community's own schooling supplies a word:
#     «doira» (circle), «musallas» (triangle), «mustatil» (rectangle),
#     «murabba» (square), «khat» (line), «nuqta» (point, dot), «ilaqa»
#     (region), «taraf» (side), «jawab», «sawol», «hal» (solution), «misol»
#     (example), «mashq» (exercise), «masla» (problem), «subut» (proof),
#     «ta'rif» (definition), «hissa» (part), «maqsad» (objective),
#     «yoddosht» (note), «nazariya» (theorem), «faaliyat» (activity),
#     «jadwal» (table), «shakl» (figure), «safha» (page), «kholi» (blank),
#     «pur» (filled), «agar» (if), «wagarna» (otherwise), «rost» (true),
#     «durugh» (false), and the whole colour list below.
#   * **English**, for everything the classroom itself names in English:
#     `line segment`, `ray`, `vector`, `curve`, `function`, `slope field`,
#     `vector field`, `parabola`, `polyline`, `polygon`, `regular polygon`,
#     `diamond`, `cross`, `plus`, `horizontal`, `vertical`, `diagonal`,
#     `section`, `aside`, `cascade`, `paragraph`, `credit`, `ionic compound`
#     and the chemistry frame's `symbol`.
#
# **The colours are the least certain line in the catalog.** This seed could
# not establish Wakhi's own basic colour terms with any confidence, so all
# twelve are the Persianate words used across the region and current in Urdu:
# «siyah», «safed», «khakistari», «surkh», «narangi», «zard», «sabz»,
# «firozi», «nila», «baingani», «gulabi», «bhura». Wakhi certainly has its own
# words for at least black, white and red; they are not here because the seed
# does not know them, not because they do not exist. This is the first place a
# speaker should look.
#
# The Wakhi in this file is the frame: «at» (and), «yo» (or), «na-», «nast»,
# «yast», «yiw/buy/tru», «yem», «yaw», «az», «-ir», «-dar», and «tsar-» in
# every action.


## Style vocabulary

color =
    .black = siyah
    .white = safed
    .gray = khakistari
    .red = surkh
    .orange = narangi
    .yellow = zard
    .green = sabz
    .cyan = firozi
    .blue = nila
    .purple = baingani
    .pink = gulabi
    .brown = bhura

line-width =
    .thick = mota
    .thin = patla

# «-dor» is the Persian suffix 'having, bearing', so «nuqta-dor» is
# 'dot-bearing'. Both stems are loans; the suffix is what makes them
# adjectives.
line-style =
    .dashed = dash-dor
    .dotted = nuqta-dor

fill-style =
    .horizontal = horizontal khat
    .vertical = vertical khat
    .diagonal = diagonal khat
    .backdiagonal = ulto diagonal khat
    .dots = nuqta
    .diamonds = diamond

noun =
    .line = khat
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
    .triangle = musallas
    .rectangle = mustatil
    .circle = doira
    .region = ilaqa
    .point = nuqta
    .square = murabba
    .diamond = diamond
    .cross = cross
    .plus = plus

# Modifiers precede their noun in Wakhi, so the side count sits in the head
# and `tail` stays empty, as it does in English.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] { $numSides }-tarafa regular polygon
    }

# One token for everything: this catalog does not fork on `$gender`. See the
# header — that is a limit of the seed, not a finding about Wakhi.
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

style-filled-word = pur

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } ba { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } ba { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } ba { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

# Wakhi has no article, so the two `-article` branches say what the two
# without it say. The distinction that survives is «ba» against «at» — a first
# clause against a further one.
style-border-clause =
    { $parts ->
        [with-article] ba { $border } border
        [and] at { $border } border
        [and-article] at { $border } border
       *[with] ba { $border } border
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = napur

style-text =
    { $parts ->
        [background] { $color } ba { $background } background
       *[plain] { $color }
    }

style-background-none = nast


## Boolean words

boolean-true = rost
boolean-false = durugh


## Answer buttons

answer-submit-label = Kor chek tsar
answer-submit-label-no-correctness = Jawab ravon tsar


## Sectional blocks

section-name =
    .activity = Faaliyat
    .aside = Aside
    .cascade = Cascade
    .definition = Ta'rif
    .example = Misol
    .exercise = Mashq
    .exercises = Mashq
    .given-answer = Jawab
    .note = Yoddosht
    .objectives = Maqsad
    .paragraphs = Paragraph
    .part = Hissa
    .problem = Masla
    .problems = Masla
    .proof = Subut
    .question = Sawol
    .section = Section
    .solution = Hal
    .task = Kor
    .theorem = Nazariya

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Ishora


## Tables and figures

table-name =
    { $parts ->
        [numbered] Jadwal { $enumeration }
        [numbered-title] Jadwal { $enumeration }{ ": " }
        [unnumbered-title] Jadwal{ ": " }
       *[unnumbered] Jadwal
    }

figure-name =
    { $parts ->
        [numbered] Shakl { $enumeration }
        [numbered-caption] Shakl { $enumeration }{ ": " }
        [unnumbered-caption] Shakl{ ": " }
       *[unnumbered] Shakl
    }


## Paginator controls

paginator-previous = Pichhla
paginator-next = Agla
paginator-page = Safha

paginator-page-status = { $pageLabel } { $currentPage } az { $numPages }


## Piecewise functions

piecewise-condition-or = yo
piecewise-condition-if = agar
piecewise-condition-otherwise = wagarna


## Chemistry
##
## `element-name` and `element-anion-name` are absent on purpose; the header
## says why. What is here is the frames, which are not vocabulary.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Ghalat kimyawi symbol
chemistry-invalid-ionic-compound = Ghalat ionic compound


## Inputs embedded in math

math-embedded-input-blank = kholi
math-embedded-input-blank-ordinal = kholi { $ordinal } az { $total }

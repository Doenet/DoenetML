# Chuukese (Fóósun Chuuk) content catalog, Chuuk Lagoon variety: the prose the
# core computes into the document. Selected by `documentLocale` — the language
# the activity was written in, not the reader's UI language.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# ## Orthography, number, gender, word order
#
# All four are settled in `chrome.ftl`'s header and are not repeated here in
# full. In short: the Goodenough–Sugita spelling, **length written by doubling
# the vowel**, `ch` a single letter, `ó`, `ú` and `á` part of the spelling,
# `pw` and `mw` written everywhere; **no number marking on the noun** (the
# verb marks it, «e/a» against «re/ra»); **no grammatical gender**, so
# `noun-gender` answers one token and nothing below forks on `$gender`; **no
# `$role` fork**, since a describing word keeps its shape standing alone and
# inside a clause.
#
# **The classifier.** Chuukese counts with numeral classifiers, and the general
# inanimate one is `-w` («eew», «ruuw», «únúúw»). Nothing in *this* file counts
# anything, so no classifier is wanted here; `chrome.ftl`'s header records why
# it cannot be written where a count does appear.
#
# ## Word order is the whole of this file's composition
#
# **The describing word follows the noun**, joined by the relative marker
# «mi»: «nain mi wattee» (a thick line), «sáákun mi ur mi puruu» (a filled
# blue circle). Where two describing words stack, **each takes its own «mi»** —
# «nain mi wattee mi ppar» — which is why the `style-stroke` variants below
# repeat the marker instead of listing bare adjectives. That is the same shape
# `locales/gil` writes with «ae» and `locales/mh`, `pon` and `kos` write
# postnominally; this catalog agrees with all four about the order and differs
# only in which particle does the joining.
#
# **Chuukese has no article**, which flattens one distinction English makes:
# `style-border-clause`'s `[with]` and `[with-article]` come out identically,
# and so do `[and]` and `[and-article]`. Both pairs are still written out, so a
# reviewer who finds a difference has somewhere to put it.
#
# ## The chemistry tables are deliberately absent
#
# `element-name` and `element-anion-name` are not translated. Secondary science
# in Chuuk is taught in English, and the periodic table is read in English by
# the people in Chuuk who read it at all; naming the hundred and eighteen
# elements here would report a fact about a curriculum that does not exist in
# Chuukese rather than a fact about the language. The English falls through,
# which is what those readers see today, and `lint:i18n` reports the gap. The
# prose the chemistry components write *around* a formula is translated, since
# anyone who meets a broken formula has to read it.
#
# ## Coined and borrowed, and so the first things to check
#
# Mathematics above the first primary years is taught in English in Chuuk, so
# most of the vocabulary below is either borrowed with Chuukese phonology or
# built from Chuukese parts. Neither is attested; both are recorded here rather
# than passed off as found words. This is the canonical table for all four
# files — a word that appears in `diagnostics.ftl` or `editor.ftl` in one of
# these roles is the word named here.
#
#   Built from Chuukese parts:
#     «napanap»            shape, form — the productive base for the polygons:
#                          «napanap únúúw» (three-shape) for a triangle,
#                          «napanap fáán mi pwúng» (four-shape with true
#                          corners) for a rectangle, «napanap fáán mi wewe
#                          fengen» (four-shape whose sides match) for a square.
#     «kinikinin nain»     line segment, "a piece of a line". «kinikin» alone
#                          is also doing duty for *interval* and for *part*;
#                          three jobs for one word, and a speaker may want them
#                          split.
#     «nenien sikóóp» / «nenien pekitá»
#                          slope field, vector field — "the place of the slope",
#                          "the place of the vector".
#     «neni»               region, the ordinary word for a place.
#     «óór»                border, the word for an edge or shore.
#     «mwúrin»             background, "its back". A coinage, and one of the
#                          weaker ones here.
#     «ur» / «esap ur»     filled / unfilled, on «úr», to be full.
#     «pwang»              the blank an embedded input leaves. **Read aloud by
#                          a screen reader**, so it is the single word in this
#                          file a reviewer should look at first.
#     «esissin»            symbol, sign. «chufengen», to come together, for a
#                          compound.
#     «wewe fengen»        equal, "matching each other".
#
#   Borrowed: «nain» (line), «reey» (ray), «pekitá» (vector), «kuurif»
#   (curve), «fanksin» (function), «paraapona» (parabola), «poriikon»
#   (polygon), «sáákun» (circle), «taimon» (diamond), «koros» (cross),
#   «pwuras» (plus), «poin» (point), «sikóóp» (slope), «teepun» (table),
#   «paraakraf» (paragraph), «tiorem» (theorem), «peich» (page), «kaskeit»
#   (cascade), «matematik».
#
#   «sasing» for a figure is not a loan of *figure* but the ordinary Chuukese
#   word for a picture, which is what a figure is.
#
#   **Thick and thin are approximations.** This seed could not establish
#   Chuukese words for a thick and a thin stroke, so it writes «wattee» (big)
#   and «kúkkún» (small), which are attested words doing a job that is not
#   quite theirs. Likewise «tass» and «toot» — dash and dot — are borrowed.
#
#   **The colour line is the least certain line in the file.** «pwechepwech»
#   (white) and «chchóón» (black) are offered as Chuukese words and are the two
#   to check; «ppar» for red is offered less confidently still. The remaining
#   nine are borrowed and spelled to Chuukese phonology, which has no `b`, `d`,
#   `g` or `v` — «puruu» for blue, «praun» for brown. A speaker replacing the
#   whole table is doing exactly the work this file was written to make easy.
#
#   **Where two English words come out as one.** Chuukese does not mark number
#   on a noun, so `section-name.exercise` and `.exercises`, and `.problem` and
#   `.problems`, are the same word. And *answer* and *response* are both
#   «pwóón» throughout the four files, as `chrome.ftl`'s header records.


## Style vocabulary

color =
    .black = chchóón
    .white = pwechepwech
    .gray = kúrey
    .red = ppar
    .orange = orenchi
    .yellow = yeenó
    .green = kiriin
    .cyan = sáyan
    .blue = puruu
    .purple = púrpún
    .pink = pingk
    .brown = praun

line-width =
    .thick = wattee
    .thin = kúkkún

line-style =
    .dashed = tass
    .dotted = toot

fill-style =
    .horizontal = nain mi kkon
    .vertical = nain mi úútá
    .diagonal = nain mi feita
    .backdiagonal = nain mi feitiw
    .dots = toot
    .diamonds = taimon

noun =
    .line = nain
    .line-segment = kinikinin nain
    .ray = reey
    .vector = pekitá
    .curve = kuurif
    .function = fanksin
    .slope-field = nenien sikóóp
    .vector-field = nenien pekitá
    .parabola = paraapona
    .polyline = nain mi chómmóng kinikinin
    .polygon = poriikon
    .triangle = napanap únúúw
    .rectangle = napanap fáán mi pwúng
    .circle = sáákun
    .region = neni
    .point = poin
    .square = napanap fáán mi wewe fengen
    .diamond = taimon
    .cross = koros
    .plus = pwuras

# Chuukese puts the describing words after the noun, so the side count is
# pushed past them into the tail — the Spanish shape rather than the English
# one. The head is the word the describing words attach to; the tail follows
# them. «peekin» is a side.
noun-regular-polygon =
    { $part ->
        [tail] mi { $numSides } peekin
       *[head] poriikon mi wewe fengen
    }

noun-gender = neuter


## Style composition

style-stroke =
    { $parts ->
        [width-style-color] { $width } mi { $lineStyle } mi { $color }
        [width-color] { $width } mi { $color }
        [style-color] { $lineStyle } mi { $color }
        [width-style] { $width } mi { $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }

style-with-noun =
    { $parts ->
        [noun-tail] { $noun } mi { $description } { $nounTail }
       *[noun] { $noun } mi { $description }
    }

style-filled-word = ur

style-filled =
    { $parts ->
        [pattern] { $filled } mi { $color } fiti { $pattern }
       *[plain] { $filled } mi { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } mi { $filled } mi { $color } fiti { $pattern }
        [plain-tail] { $noun } mi { $filled } mi { $color } { $nounTail }
        [pattern-tail] { $noun } mi { $filled } mi { $color } { $nounTail } fiti { $pattern }
       *[plain] { $noun } mi { $filled } mi { $color }
    }

# Chuukese has no article, so the two `-article` branches are word for word the
# same as the two without one. They are kept apart so a reviewer has somewhere
# to put a difference this seed could not find.
style-border-clause =
    { $parts ->
        [with-article] fiti óór mi { $border }
        [and] me óór mi { $border }
        [and-article] me óór mi { $border }
       *[with] fiti óór mi { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } mi { $color }
       *[plain] { $color }
    }

style-unfilled = esap ur

style-text =
    { $parts ->
        [background] { $color } fiti mwúrin mi { $background }
       *[plain] { $color }
    }

style-background-none = esap wor


## Boolean words

boolean-true = ennet
boolean-false = chofona


## Answer buttons

answer-submit-label = Nengeni Óm Angang
answer-submit-label-no-correctness = Tinanó Óm Pwóón


## Sectional blocks

section-name =
    .activity = Angang
    .aside = Kapas Pesepes
    .cascade = Kaskeit
    .definition = Aweween Kapas
    .example = Awewe
    .exercise = Kákkáé
    .exercises = Kákkáé
    .given-answer = Pwóón
    .note = Kapas Aúcheaan
    .objectives = Kokkot
    .paragraphs = Paraakraf
    .part = Kinikin
    .problem = Weires
    .problems = Weires
    .proof = Ánnetátá
    .question = Kapas Eis
    .section = Sópwun
    .solution = Aweween Weires
    .task = Wiis
    .theorem = Tiorem

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Áninnis


## Tables and figures

table-name =
    { $parts ->
        [numbered] Teepun { $enumeration }
        [numbered-title] Teepun { $enumeration }{ ": " }
        [unnumbered-title] Teepun{ ": " }
       *[unnumbered] Teepun
    }

figure-name =
    { $parts ->
        [numbered] Sasing { $enumeration }
        [numbered-caption] Sasing { $enumeration }{ ": " }
        [unnumbered-caption] Sasing{ ": " }
       *[unnumbered] Sasing
    }


## Paginator controls

paginator-previous = Mwen
paginator-next = Mwirin
paginator-page = Peich

paginator-page-status = { $pageLabel } { $currentPage } seni { $numPages }


## Piecewise functions
##
## «ika» opens its clause, as English "if" does, so `piecewise-condition-if`
## lands correctly in front of the mathematics the renderer places after it.
## «nge ika esap» is "but if not", which is what the catch-all branch means.

piecewise-condition-or = are

piecewise-condition-if = ika

piecewise-condition-otherwise = nge ika esap


## Chemistry
##
## `element-name` and `element-anion-name` are absent on purpose; see the
## header. What remains is the prose the chemistry components write around a
## formula, which is read by anyone who meets a broken one.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Esissinen Kemikal mi Mwáál
chemistry-invalid-ionic-compound = Chufengenin Aion mi Mwáál

## Inputs embedded in math

math-embedded-input-blank = pwang

math-embedded-input-blank-ordinal = pwang { $ordinal } seni { $total }

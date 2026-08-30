# Kalaallisut (Greenlandic) content catalog: the prose the core computes into
# the document. Selected by `documentLocale` — the language the activity was
# written in. Translated from `locales/en/content.ftl`, which is the source of
# truth.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The 1973 orthography. The Kleinschmidt letter **ĸ (U+0138)
# does not appear in this file at all**; every such sound is written `q`.
# Length is written by doubling — `aa ii uu ll rr tt` — and no accented vowel
# occurs in a Kalaallisut word here. `chrome.ftl` sets the letters out in full.
#
# **Number.** `kl` selects **one** and **other**, and both are real: a counted
# noun takes the plural ending. Nothing in this file selects on a count, so no
# plural branch appears here; `chrome.ftl` and `editor.ftl` carry them.
#
# **Word order.** Kalaallisut is the reverse of English here. A describing
# word is a participial verb and it **follows** the noun — «titarneq
# aappaluttoq», literally "a line, it is red" — so every composition message
# below puts `{ $noun }` first and the description after it, where English
# puts the description first. That reversal is the single most visible
# difference between this file and the English it was made from.
#
# **The comitative is a suffix, and it shapes three messages.** English's
# "with a red border" is marked in Kalaallisut by an ending — `-mik` — and an
# ending cannot be welded onto a placeable whose final sound this catalog
# never sees. So `style-border-clause` carries the ending on a **literal**
# word instead: «{ $border } killermik peqarluni», where *killermik* is the
# word for a border in the comitative and the argument stands beside it
# uninflected. `style-text` sets its background off with a comma for the same
# reason, and `style-filled` keeps its pattern by juxtaposition — a real
# Greenlandic option, not a workaround.
#
# **Confidence, stated plainly.** The colour and shape vocabulary here is the
# everyday one and is sound. What is left out is left out on purpose:
#
#   * **The nine colours Kalaallisut has terms of its own for are written in
#     Kalaallisut.** `.orange`, `.cyan` and `.purple` are the three the
#     language does not partition the way English does, and they are written
#     as the **Danish loans** «orangi», «cyani» and «lilla» rather than as
#     coined Kalaallisut compounds — those are the words a speaker uses.
#   * **The geometric vocabulary is Danish loans in Greenlandic spelling**,
#     because Greenland's school mathematics is taught in Danish terms:
#     «linjestykki», «vektori», «kurvi», «funktioni», «parabeli», «polygoni»,
#     «trekanti», «rektangeli», «kvadrati», «rombi», «punkti». Where
#     Kalaallisut has its own word it is used instead — «titarneq» for a
#     line, «ammalortoq» for a circle, «sumiiffik» for a region.
#   * **`element-name` and `element-anion-name` are omitted entirely.**
#     Chemistry is schooled in Greenland in Danish, and there is no published
#     Greenlandic set of all 118 element names to reproduce.
#   * **`piecewise-condition-if`** is the Danish «for» that Greenlandic school
#     mathematics writes in front of a domain, not a Kalaallisut word:
#     Kalaallisut marks a condition with a verb mood, which cannot stand alone
#     before an equation. `-or` («imaluunniit») and `-otherwise` («allatut»)
#     are Kalaallisut.


## Style vocabulary

color =
    .black = qernertoq
    .white = qaqortoq
    .gray = qasertoq
    .red = aappaluttoq
    .yellow = sungaartoq
    .green = qorsuk
    .blue = tungujortoq
    .pink = aappilaartoq
    .brown = kajortoq
    .orange = orangi
    .cyan = cyani
    .purple = lilla

line-width =
    .thick = silissooq
    .thin = silikitsoq

line-style =
    .dashed = avissaartorsimasoq
    .dotted = punktilik

fill-style =
    .horizontal = titarnerit vandrette
    .vertical = titarnerit lodrette
    .diagonal = titarnerit diagonale
    .backdiagonal = titarnerit diagonale akerlianik
    .dots = punktit
    .diamonds = rombit

noun =
    .line = titarneq
    .line-segment = linjestykki
    .ray = stråli
    .vector = vektori
    .curve = kurvi
    .function = funktioni
    .slope-field = hældningsfelti
    .vector-field = vektorfelti
    .parabola = parabeli
    .polyline = polylinje
    .polygon = polygoni
    .triangle = trekanti
    .rectangle = rektangeli
    .circle = ammalortoq
    .region = sumiiffik
    .point = punkti
    .square = kvadrati
    .diamond = rombi
    .cross = krysi
    .plus = plusi

noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] polygoni regulæri sanianik { $numSides }
    }

noun-gender = neuter


## Style composition
##
## `{ $noun }` leads and the description follows it, which is Kalaallisut
## order and the reverse of English.

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
        [noun-tail] { $noun } { $nounTail } { $description }
       *[noun] { $noun } { $description }
    }

style-filled-word = immersorsimasoq

style-filled =
    { $parts ->
        [pattern] { $color } { $filled } { $pattern }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $color } { $filled } { $pattern }
        [plain-tail] { $noun } { $nounTail } { $color } { $filled }
        [pattern-tail] { $noun } { $nounTail } { $color } { $filled } { $pattern }
       *[plain] { $noun } { $color } { $filled }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-border-clause =
    { $parts ->
        [with-article] { $border } killermik peqarluni
        [and] aamma { $border } killermik peqarluni
        [and-article] aamma { $border } killermik peqarluni
       *[with] { $border } killermik peqarluni
    }

style-unfilled = immersorsimanngitsoq

style-text =
    { $parts ->
        [background] { $color }, tunuliaqutaalu { $background }
       *[plain] { $color }
    }

style-background-none = peqanngilaq


## Boolean words

boolean-true = ilumoortoq
boolean-false = ilumoornngitsoq


## Answer buttons

answer-submit-label = Misissoruk
answer-submit-label-no-correctness = Akissut nassiuguk


## Sectional blocks

section-name =
    .activity = Sammisaq
    .aside = Saniatigut
    .cascade = Kaskadi
    .definition = Nassuiaat
    .example = Assersuut
    .exercise = Sungiusaat
    .exercises = Sungiusaatit
    .given-answer = Akissut
    .note = Nalunaarut
    .objectives = Anguniagassat
    .paragraphs = Immikkoortut
    .part = Ilaa
    .problem = Ajornartorsiut
    .problems = Ajornartorsiutit
    .proof = Uppernarsaat
    .question = Apeqqut
    .section = Immikkoortoq
    .solution = Aaqqiissut
    .task = Suliassaq
    .theorem = Teoremi

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Ikiuut


## Tables and figures

table-name =
    { $parts ->
        [numbered] Skema { $enumeration }
        [numbered-title] Skema { $enumeration }{ ": " }
        [unnumbered-title] Skema{ ": " }
       *[unnumbered] Skema
    }

figure-name =
    { $parts ->
        [numbered] Titartagaq { $enumeration }
        [numbered-caption] Titartagaq { $enumeration }{ ": " }
        [unnumbered-caption] Titartagaq{ ": " }
       *[unnumbered] Titartagaq
    }


## Paginator controls
##
## "3 of 5" is an ablative ending in Kalaallisut and cannot be welded onto
## `{ $numPages }`, so the status is written with a stroke between the two
## counts instead of with a word.

paginator-previous = Siulia
paginator-next = Tullia
paginator-page = Qupperneq
paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = imaluunniit
piecewise-condition-if = for
piecewise-condition-otherwise = allatut


## Chemistry

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Kemikkut nalunaaqut eqqunngitsoq
chemistry-invalid-ionic-compound = Ionimik ataqatigiissitaq eqqunngitsoq


## Inputs embedded in math

math-embedded-input-blank = imaqanngitsoq
math-embedded-input-blank-ordinal = imaqanngitsoq { $ordinal } / { $total }

# Buginese (Basa Ugi) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Latin, not Lontara**, for the reasons `chrome.ftl`'s header sets
# out in full — Latin is what Buginese is printed in today, and Lontara does
# not write the final glottal stop, the geminates or the syllable-final nasal,
# so a Lontara seed could not be checked word against word. The final glottal
# stop is the **ASCII apostrophe `'` (U+0027)** here as in every other file of
# this catalog; U+2019 appears nowhere.
#
# ## Word order
#
# **The noun comes first and every modifier follows it**, in the order width,
# dash pattern, colour: «garis tebal pettu-pettu macella'» is *thick dashed red
# line*. So `style-with-noun` and `style-filled-with-noun` put `{ $noun }`
# before `{ $description }` — the reverse of English's sequence of placeables,
# and a fact about Buginese rather than a failure to translate. `style-stroke`
# keeps English's internal order of the three adjectives, because that is
# Buginese's order too.
#
# **`[noun-tail]` is unused.** `noun-regular-polygon` fills `head` with
# «poligon biasa iya { $numSides } sisina» and leaves `tail` empty, as English
# does: the side count follows the noun here as well, so nothing has to be
# split around the adjectives.
#
# ## Gender, role and number
#
# **No `$gender` fork and no `$role` fork.** Buginese has no grammatical
# gender, so `noun-gender` answers the single token `neuter` and no adjective
# selects on it. Nor does it inflect a modifier for the position its phrase is
# going into, so the three clause positions are written identically. Both are
# claims about the language rather than gaps in the seed.
#
# **Nothing selects on a count.** A Buginese noun is unmarked after a numeral,
# and CLDR has no plural data for `bug` in any case.
#
# ## Vocabulary, and what this file does not know
#
# The geometry words are **Indonesian, declared as such**: Buginese-speaking
# schools teach mathematics in Indonesian, and «segitiga», «persegi panjang»,
# «lingkaran», «poligon», «vektor» and «fungsi» are the words a Buginese
# student has met. Where Buginese has its own word the seed is confident of,
# it is used: «tetti'» for a point or a dot, «tanrang» for a mark, «katupa'»
# for the rhombus, «gambara'» for a figure, «tongeng» and «sala» for true and
# false, «pakkutana» for a question, «pappébali» for an answer, «jama-jamang»
# for a task, «butti» for a proof, «akkatta» for an aim, «rékko» for *if*,
# «iyaré'ga» for *or*.
#
# **The colours are the weakest part of this file and a reviewer should start
# there.** Five are Buginese — «malotong», «mapute», «macella'», «maridi»,
# «makudara» — and the other seven are written as plain Indonesian loans
# («abu-abu», «oranye», «sian», «biru», «ungu», «merah muda», «coklat»)
# because the seed has no Buginese term for them that it trusts. Nothing was
# invented to fill the gap. The same is true of `line-width`: «tebal» and
# «tipis» are Indonesian, written as loans rather than as a guess at a
# Buginese adjective.


## Style vocabulary

color =
    .black = malotong
    .white = mapute
    .gray = abu-abu
    .red = macella'
    .orange = oranye
    .yellow = maridi
    .green = makudara
    .cyan = sian
    .blue = biru
    .purple = ungu
    .pink = merah muda
    .brown = coklat

line-width =
    .thick = tebal
    .thin = tipis

line-style =
    .dashed = pettu-pettu
    .dotted = tetti'-tetti'

fill-style =
    .horizontal = garis maléwa
    .vertical = garis tettong
    .diagonal = garis miring
    .backdiagonal = garis miring tabbalé'
    .dots = tetti'
    .diamonds = katupa'

noun =
    .line = garis
    .line-segment = ruas garis
    .ray = sinar
    .vector = vektor
    .curve = kurva
    .function = fungsi
    .slope-field = medan kemiringan
    .vector-field = medan vektor
    .parabola = parabola
    .polyline = garis pettu
    .polygon = poligon
    .triangle = segitiga
    .rectangle = persegi panjang
    .circle = lingkaran
    .region = daéra
    .point = tetti'
    .square = persegi
    .diamond = katupa'
    .cross = tanrang silang
    .plus = tanrang tamba

noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] poligon biasa iya { $numSides } sisina
    }

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
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }

style-filled-word = malise'

style-filled =
    { $parts ->
        [pattern] { $color } { $filled } sibawa { $pattern }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $color } { $filled } sibawa { $pattern }
        [plain-tail] { $noun } { $nounTail } { $color } { $filled }
        [pattern-tail] { $noun } { $nounTail } { $color } { $filled } sibawa { $pattern }
       *[plain] { $noun } { $color } { $filled }
    }

style-border-clause =
    { $parts ->
        [with-article] sibawa batas { $border }
        [and] na batas { $border }
        [and-article] na batas { $border }
       *[with] sibawa batas { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = de' namalise'

style-text =
    { $parts ->
        [background] { $color } sibawa latar { $background }
       *[plain] { $color }
    }

style-background-none = de'gaga


## Boolean words

boolean-true = tongeng
boolean-false = sala


## Answer buttons

answer-submit-label = Paressai
answer-submit-label-no-correctness = Kiringngi pappébali


## Sectional blocks

section-name =
    .activity = Kegiatan
    .aside = Sisipan
    .cascade = Kaskade
    .definition = Definisi
    .example = Conto
    .exercise = Latihang
    .exercises = Latihang
    .given-answer = Pappébali
    .note = Catatang
    .objectives = Akkatta
    .paragraphs = Paragraf
    .part = Bagiang
    .problem = Soala'
    .problems = Soala'
    .proof = Butti
    .question = Pakkutana
    .section = Bab
    .solution = Solusi
    .task = Jama-jamang
    .theorem = Teoréma

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Petunju'


## Tables and figures

table-name =
    { $parts ->
        [numbered] Tabel { $enumeration }
        [numbered-title] Tabel { $enumeration }{ ": " }
        [unnumbered-title] Tabel{ ": " }
       *[unnumbered] Tabel
    }

figure-name =
    { $parts ->
        [numbered] Gambara' { $enumeration }
        [numbered-caption] Gambara' { $enumeration }{ ": " }
        [unnumbered-caption] Gambara'{ ": " }
       *[unnumbered] Gambara'
    }


## Paginator controls

paginator-previous = Riolo
paginator-next = Rimonri
paginator-page = Halaman

paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = iyaré'ga

piecewise-condition-if = rékko

piecewise-condition-otherwise = rékko de' nakkuwa


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so those
## 130 keys fall back to English. South Sulawesi teaches secondary chemistry in
## Indonesian, out of Indonesian textbooks, so the element names a Buginese
## student meets are the Indonesian ones and a Buginese table would be a claim
## about spelling rather than about the language.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Lambang kimia de' nasah
chemistry-invalid-ionic-compound = Senyawa ion de' nasah


## Inputs embedded in math

math-embedded-input-blank = lobang

math-embedded-input-blank-ordinal = lobang { $ordinal } pole ri { $total }

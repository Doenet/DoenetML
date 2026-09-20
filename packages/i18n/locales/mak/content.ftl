# Makasar (Basa Mangkasara') content catalog: the prose the core computes into
# the document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Latin, not Lontara and not Ukiri' Jangang-jangang**, for the
# reasons `chrome.ftl`'s header sets out in full — Latin is what Makasar is
# printed in today, and neither historic script writes the final glottal stop,
# the geminates or the syllable-final nasal, so a seed written in one could not
# be checked word against word. The final glottal stop is the **ASCII
# apostrophe `'` (U+0027)** here as in every other file of this catalog; U+2019
# appears nowhere.
#
# ## Word order
#
# **The noun comes first and every modifier follows it**, in the order width,
# dash pattern, colour: «garis kapala' tappolo-polo eja» is *thick dashed red
# line*. So `style-with-noun` and `style-filled-with-noun` put `{ $noun }`
# before `{ $description }` — the reverse of English's sequence of placeables,
# and a fact about Makasar rather than a failure to translate. `style-stroke`
# keeps English's internal order of the three adjectives, which is Makasar's
# order too.
#
# **`[noun-tail]` is unused.** `noun-regular-polygon` fills `head` with
# «poligon biasa { $numSides } sisina» and leaves `tail` empty, as English
# does: the side count follows the noun here as well.
#
# ## Gender, role and number
#
# **No `$gender` fork and no `$role` fork.** Makasar has no grammatical gender,
# so `noun-gender` answers the single token `neuter`, and it does not inflect a
# modifier for the position its phrase is going into, so the three clause
# positions are written identically. Both are claims about the language rather
# than gaps in the seed.
#
# **Nothing selects on a count.** A Makasar noun is unmarked after a numeral,
# and CLDR has no plural data for `mak` in any case.
#
# ## Vocabulary, and what this file does not know
#
# The geometry words are **Indonesian, declared as such**: Makasar-speaking
# schools teach mathematics in Indonesian, and «segitiga», «persegi panjang»,
# «lingkaran», «poligon», «vektor» and «fungsi» are the words a Makasar student
# has met. Where Makasar has its own word the seed is confident of, it is
# used: «le'leng», «kebo'», «eja», «kunyi'» for the four colours it knows;
# «kapala'» and «nipisi'» for thick and thin; «bone» for what fills a shape and
# «nibonei» for *filled*; «tanra» for a mark; «tojeng» and «sala» for true and
# false; «pakkuta'nang» for a question; «bageang» for a part; «pattujuang» for
# an aim; «punna» for *if* and «yareka» for *or*.
#
# **The colours are the weakest part of this file and a reviewer should start
# there.** Four are Makasar; the other eight are written as plain Indonesian
# loans («abu-abu», «oranye», «hijau», «sian», «biru», «ungu», «merah muda»,
# «coklat») because the seed has no Makasar term for them that it trusts.
# Nothing was invented to fill the gap.
#
# **`.point` is «titik», the Indonesian word.** The Buginese catalog beside
# this one writes «tetti'»; the seed is not confident of the Makasar cognate's
# shape, and would rather write the loan a Makasar reader certainly knows than
# a spelling it guessed.


## Style vocabulary

color =
    .black = le'leng
    .white = kebo'
    .gray = abu-abu
    .red = eja
    .orange = oranye
    .yellow = kunyi'
    .green = hijau
    .cyan = sian
    .blue = biru
    .purple = ungu
    .pink = merah muda
    .brown = coklat

line-width =
    .thick = kapala'
    .thin = nipisi'

line-style =
    .dashed = tappolo-polo
    .dotted = te'te'-te'te'

fill-style =
    .horizontal = garis anrawang
    .vertical = garis ammenteng
    .diagonal = garis miring
    .backdiagonal = garis miring tibali
    .dots = te'te'
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
    .polyline = garis tappolo
    .polygon = poligon
    .triangle = segitiga
    .rectangle = persegi panjang
    .circle = lingkaran
    .region = daera
    .point = titik
    .square = persegi
    .diamond = katupa'
    .cross = tanra silang
    .plus = tanra tamba

noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] poligon biasa { $numSides } sisina
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

style-filled-word = nibonei

style-filled =
    { $parts ->
        [pattern] { $color } { $filled } siagang { $pattern }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $color } { $filled } siagang { $pattern }
        [plain-tail] { $noun } { $nounTail } { $color } { $filled }
        [pattern-tail] { $noun } { $nounTail } { $color } { $filled } siagang { $pattern }
       *[plain] { $noun } { $color } { $filled }
    }

style-border-clause =
    { $parts ->
        [with-article] siagang batas { $border }
        [and] siagang tommi batas { $border }
        [and-article] siagang tommi batas { $border }
       *[with] siagang batas { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = tena nanibonei

style-text =
    { $parts ->
        [background] { $color } siagang latar { $background }
       *[plain] { $color }
    }

style-background-none = tena nia'


## Boolean words

boolean-true = tojeng
boolean-false = sala


## Answer buttons

answer-submit-label = Paressai
answer-submit-label-no-correctness = Kiringi jawaban


## Sectional blocks

section-name =
    .activity = Kagiatang
    .aside = Sisipang
    .cascade = Kaskade
    .definition = Definisi
    .example = Conto
    .exercise = Latihang
    .exercises = Latihang
    .given-answer = Jawaban
    .note = Catatang
    .objectives = Pattujuang
    .paragraphs = Paragraf
    .part = Bageang
    .problem = Soala'
    .problems = Soala'
    .proof = Bukti
    .question = Pakkuta'nang
    .section = Bab
    .solution = Solusi
    .task = Tugasa'
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
paginator-next = Ribokoang
paginator-page = Halaman

paginator-page-status = { $pageLabel } { $currentPage } / { $numPages }


## Piecewise functions

piecewise-condition-or = yareka

piecewise-condition-if = punna

piecewise-condition-otherwise = punna tena nakamma


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so those
## 130 keys fall back to English. South Sulawesi teaches secondary chemistry in
## Indonesian, out of Indonesian textbooks, so the element names a Makasar
## student meets are the Indonesian ones, and a Makasar table would be a claim
## about spelling rather than about the language.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Lambang kimia sala
chemistry-invalid-ionic-compound = Senyawa ion sala


## Inputs embedded in math

math-embedded-input-blank = kosong

math-embedded-input-blank-ordinal = kosong { $ordinal } battu ri { $total }

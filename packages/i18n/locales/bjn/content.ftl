# Banjar (Bahasa Banjar) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography: Banjar Hulu in the ordinary Indonesian Latin alphabet**, as
# `chrome.ftl`'s header sets out — three vowels, so *bersih* is «barasih» and
# *tebal* is «kandal». No diacritics anywhere.
#
# ## Word order
#
# **The noun comes first and every modifier follows it**, in the order width,
# dash pattern, colour: «garis kandal putus-putus habang» is *thick dashed red
# line*. So `style-with-noun` and `style-filled-with-noun` put `{ $noun }`
# before `{ $description }`, which is the reverse of English's sequence of
# placeables and is a fact about Banjar rather than a failure to translate.
# `style-stroke` keeps English's internal order of the three adjectives,
# because that is also Banjar's.
#
# **`[noun-tail]` carries the side count.** `noun-regular-polygon` fills `head`
# with «poligon baraturan basisi { $numSides }» and leaves `tail` empty, as
# English does: the count follows the noun here too, so nothing has to be
# split around the adjectives.
#
# ## Gender, role and number
#
# **No `$gender` fork and no `$role` fork.** Banjar is Malayic and has neither
# grammatical gender nor case, so `noun-gender` answers the single token
# `neuter` and no adjective below selects on anything. That is a claim about
# the language rather than a limit of the seed.
#
# **Nothing selects on a count.** A Banjar noun is unmarked after a numeral —
# «lima titik», not a plural form — so no message here needs a plural branch,
# and CLDR has no plural data for `bjn` to write one against in any case.
#
# ## Vocabulary
#
# The colour, shape and section words below are the ones a Banjar speaker
# uses in ordinary speech where Banjar has its own — «hirang», «habang»,
# «kandal», «nipis», «pasagi», «balah katupat», «patakunan», «gawian» — and
# the Indonesian ones where the term is school vocabulary, because that is the
# register Banjar-speaking schools teach mathematics in. **Two are guesses a
# reviewer should look at first**: `.cyan` is written «sian», the Indonesian
# loan, and `.pink` is written «habang anum» — «anum» is Banjar for *muda*,
# so this is a calque on Indonesian *merah muda* rather than an attested
# Banjar colour term. Neither was invented as a word; both are compounds of
# words Banjar has, and either may simply be wrong.


## Style vocabulary

color =
    .black = hirang
    .white = putih
    .gray = kulabu
    .red = habang
    .orange = jingga
    .yellow = kuning
    .green = hijau
    .cyan = sian
    .blue = biru
    .purple = ungu
    .pink = habang anum
    .brown = cuklat

line-width =
    .thick = kandal
    .thin = nipis

line-style =
    .dashed = putus-putus
    .dotted = titik-titik

fill-style =
    .horizontal = garis mandatar
    .vertical = garis tagak
    .diagonal = garis miring
    .backdiagonal = garis miring tabalik
    .dots = titik
    .diamonds = balah katupat

noun =
    .line = garis
    .line-segment = ruas garis
    .ray = sinar
    .vector = vektor
    .curve = kurva
    .function = fungsi
    .slope-field = medan kamiringan
    .vector-field = medan vektor
    .parabola = parabola
    .polyline = garis patah
    .polygon = poligon
    .triangle = sagitiga
    .rectangle = pasagi panjang
    .circle = lingkaran
    .region = daerah
    .point = titik
    .square = pasagi
    .diamond = balah katupat
    .cross = tanda silang
    .plus = tanda tambah

noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] poligon baraturan basisi { $numSides }
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

style-filled-word = tarisi

style-filled =
    { $parts ->
        [pattern] { $color } { $filled } lawan { $pattern }
       *[plain] { $color } { $filled }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $color } { $filled } lawan { $pattern }
        [plain-tail] { $noun } { $nounTail } { $color } { $filled }
        [pattern-tail] { $noun } { $nounTail } { $color } { $filled } lawan { $pattern }
       *[plain] { $noun } { $color } { $filled }
    }

style-border-clause =
    { $parts ->
        [with-article] lawan batas { $border }
        [and] wan batas { $border }
        [and-article] wan batas { $border }
       *[with] lawan batas { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = kada tarisi

style-text =
    { $parts ->
        [background] { $color } lawan latar { $background }
       *[plain] { $color }
    }

style-background-none = kadada


## Boolean words

boolean-true = bujur
boolean-false = salah


## Answer buttons

answer-submit-label = Pariksa
answer-submit-label-no-correctness = Kirim jawaban


## Sectional blocks

section-name =
    .activity = Gawian
    .aside = Sisipan
    .cascade = Kaskade
    .definition = Definisi
    .example = Contoh
    .exercise = Latihan
    .exercises = Latihan
    .given-answer = Jawaban
    .note = Catatan
    .objectives = Tujuan
    .paragraphs = Paragraf
    .part = Bagian
    .problem = Soal
    .problems = Soal
    .proof = Bukti
    .question = Patakunan
    .section = Bab
    .solution = Panyalasaian
    .task = Tugas
    .theorem = Teorema

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Patunjuk


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
        [numbered] Gambar { $enumeration }
        [numbered-caption] Gambar { $enumeration }{ ": " }
        [unnumbered-caption] Gambar{ ": " }
       *[unnumbered] Gambar
    }


## Paginator controls

paginator-previous = Sabalumnya
paginator-next = Barikutnya
paginator-page = Halaman

paginator-page-status = { $pageLabel } { $currentPage } matan { $numPages }


## Piecewise functions

piecewise-condition-or = atawa

piecewise-condition-if = amun

piecewise-condition-otherwise = amun kada bagitu


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent, so those
## 130 keys fall back to English. South Kalimantan teaches secondary chemistry
## in Indonesian, out of Indonesian textbooks, so a Banjar table would be the
## Indonesian one in Banjar spelling — a claim about spelling rather than about
## the language, and one no Banjar reader meets in a classroom.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Lambang kimia kada sah
chemistry-invalid-ionic-compound = Sanyawa ion kada sah


## Inputs embedded in math

math-embedded-input-blank = kosong

math-embedded-input-blank-ordinal = kosong { $ordinal } matan { $total }

# Minangkabau content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Minangkabau has no grammatical gender and no case, so `noun-gender` answers
# one token for every noun and nothing here selects on `$gender` or on `$role`.
#
# The adjectives **follow** the noun — «garih sirah», a red line — so every
# composition message inverts the English order, as `locales/ban`,
# `locales/ace` and `locales/mad` do and as none of the five Philippine
# catalogs in this batch does.
#
# There is no linker between a noun and its adjective, so nothing here meets the
# constraint `locales/ilo`, `locales/pam` and `locales/bik` record. What
# Minangkabau does have is the relativizer «nan», and it is used here only where
# the catalog supplies both words around it.
#
# The geometry vocabulary is largely the Indonesian one, because Minangkabau
# schools teach mathematics out of Indonesian-language textbooks. Where
# Minangkabau has its own everyday form it is written — «garih», «bulatan»,
# «titiak» — and that is where this file differs from `locales/id` rather than
# copying it.


## Style vocabulary

color =
    .black = itam
    .white = putiah
    .gray = kalabu
    .red = sirah
    .orange = jingga
    .yellow = kuniang
    .green = ijau
    .cyan = sian
    .blue = biru
    .purple = unggu
    .pink = sirah jambu
    .brown = coklaik
line-width =
    .thick = taba
    .thin = tipih
line-style =
    .dashed = putuih-putuih
    .dotted = titiak-titiak
# Noun phrases. Minangkabau marks no plural on the noun, so «garih» is the word
# for one line and for many alike.
fill-style =
    .horizontal = garih mandata
    .vertical = garih tagak
    .diagonal = garih serong
    .backdiagonal = garih serong tabaliak
    .dots = titiak
    .diamonds = balah katupek
noun =
    .line = garih
    .line-segment = ruweh garih
    .ray = sinar
    .vector = vektor
    .curve = lengkuang
    .function = fungsi
    .parabola = parabola
    .polyline = garih patah
    .polygon = poligon
    .triangle = sagitigo
    .rectangle = pasagi panjang
    .circle = bulatan
    .region = kawasan
    .point = titiak
    .square = pasagi
    .diamond = balah katupek
    .cross = silang
    .plus = plus
# The side count follows the adjectives as a complement, so that they stay
# beside the noun they describe.
noun-regular-polygon =
    { $part ->
        [tail] nan basisi { $numSides }
       *[head] poligon baraturan
    }
# One answer for every noun: Minangkabau has no grammatical gender.
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
# The noun first and the adjectives behind it, which is the opposite of English.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $description } { $nounTail }
       *[noun] { $noun } { $description }
    }
style-filled-word = taisi
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } jo { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } jo { $pattern }
        [plain-tail] { $noun } { $filled } { $color } { $nounTail }
        [pattern-tail] { $noun } { $filled } { $color } { $nounTail } jo { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# Minangkabau has no article, so the two `-article` branches say what the other
# two say. They are kept apart because English's distinction is between a first
# clause and a further one, which this file does mark: «jo» against «sarato».
style-border-clause =
    { $parts ->
        [with-article] jo tapi { $border }
        [and] sarato tapi { $border }
        [and-article] sarato tapi { $border }
       *[with] jo tapi { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = indak taisi
style-text =
    { $parts ->
        [background] { $color } jo latar { $background }
       *[plain] { $color }
    }
style-background-none = indak ado

## Boolean words

boolean-true = bana
boolean-false = indak bana

## Answer buttons

answer-submit-label = Pareso karajo
answer-submit-label-no-correctness = Kirim jawaban

## Sectional blocks

# `.exercise` and `.exercises`, and `.problem` and `.problems`, are one word
# each: Minangkabau marks no plural on the noun.
section-name =
    .activity = Kagiatan
    .aside = Catatan sisi
    .cascade = Kaskade
    .definition = Batasan
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
    .question = Patanyaan
    .section = Bagian
    .solution = Panyalasaian
    .task = Tugeh
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
hint-title = Pituah

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

paginator-previous = Sabalunnyo
paginator-next = Salanjuiknyo
paginator-page = Laman
paginator-page-status = { $pageLabel } { $currentPage } dari { $numPages }

## Piecewise functions

piecewise-condition-or = atau
piecewise-condition-if = jiko
piecewise-condition-otherwise = jiko indak

## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Minangkabau schools teach chemistry out of Indonesian-language
## textbooks, so the periodic table a Minangkabau pupil meets is `locales/id`'s.
## `locales/jv` and `locales/su` supply the Indonesian names for that reason;
## this catalog does not, because Minangkabau's own forms differ from
## Indonesian's often enough — «ameh» for gold, «basi» for iron — that copying
## the Indonesian table whole would be neither language, and no settled
## Minangkabau table of all 118 exists to seed from.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Simbol kimia nan indak sah
chemistry-invalid-ionic-compound = Sanyawa ionik nan indak sah

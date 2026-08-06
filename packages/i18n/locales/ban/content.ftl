# Balinese content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Latin orthography and throughout in **basa andap**, the
# unmarked everyday speech level; see `chrome.ftl`'s header for why a catalog
# must pick one level and stay in it.
#
# Balinese has no grammatical gender and no case, so `noun-gender` answers one
# token for every noun and nothing here selects on `$gender` or on `$role`.
#
# The adjectives **follow** the noun — «garis barak», a red line — so every
# composition message inverts the English order. That is the first thing this
# batch does not share: the five Philippine catalogs beside it and `locales/tpi`
# put their adjectives in front, and the eight others — the rest of Indonesia,
# Tetum and the Pacific — put them behind. Sharing a region settles nothing here,
# and neither does sharing a family.
#
# There is no linker: a Balinese adjective sits directly behind its noun with
# nothing between them, so none of the constraint `locales/ilo`, `locales/pam`
# and `locales/bik` record applies to this file at all.
#
# The geometry vocabulary is largely the Indonesian one, because Balinese
# schools teach mathematics out of Indonesian-language textbooks; the colours,
# the widths and the everyday words are Balinese.


## Style vocabulary

color =
    .black = selem
    .white = putih
    .gray = abu-abu
    .red = barak
    .orange = oranye
    .yellow = kuning
    .green = gadang
    .cyan = sian
    .blue = pelung
    .purple = ungu
    .pink = jambon
    .brown = cokelat

line-width =
    .thick = tebel
    .thin = tipis

line-style =
    .dashed = putus-putus
    .dotted = titik-titik

# Noun phrases. Balinese marks no plural on the noun, so «garis» is the word for
# one line and for many alike.
fill-style =
    .horizontal = garis mendatar
    .vertical = garis majujuk
    .diagonal = garis miring
    .backdiagonal = garis miring mabalik
    .dots = titik
    .diamonds = belah ketupat

noun =
    .line = garis
    .line-segment = ruas garis
    .ray = sinar
    .vector = vektor
    .curve = lengkung
    .function = fungsi
    .parabola = parabola
    .polyline = garis patah
    .polygon = poligon
    .triangle = segitiga
    .rectangle = persegi panjang
    .circle = bunderan
    .region = wewidangan
    .point = titik
    .square = pesagi
    .diamond = belah ketupat
    .cross = pangkah
    .plus = plus

# The side count follows the adjectives as a complement, so that they stay
# beside the noun they describe — the `[noun-tail]` branch of `style-with-noun`.
noun-regular-polygon =
    { $part ->
        [tail] ane ngelah { $numSides } sisi
       *[head] poligon beraturan
    }

# One answer for every noun: Balinese has no grammatical gender.
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

style-filled-word = bek

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } misi { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } misi { $pattern }
        [plain-tail] { $noun } { $filled } { $color } { $nounTail }
        [pattern-tail] { $noun } { $filled } { $color } { $nounTail } misi { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# Balinese has no article, so the two `-article` branches say what the other two
# say. They are kept apart because English's distinction is between a first
# clause and a further one, which this file does mark: «misi» against «tur».
style-border-clause =
    { $parts ->
        [with-article] misi tepi { $border }
        [and] tur tepi { $border }
        [and-article] tur tepi { $border }
       *[with] misi tepi { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = tusing bek

style-text =
    { $parts ->
        [background] { $color } misi dasar { $background }
       *[plain] { $color }
    }

style-background-none = tusing ada


## Boolean words

boolean-true = patut
boolean-false = iwang


## Answer buttons

answer-submit-label = Cek gaene
answer-submit-label-no-correctness = Kirim pasaut


## Sectional blocks

# `.exercise` and `.exercises`, and `.problem` and `.problems`, are one word
# each: Balinese marks no plural on the noun.
section-name =
    .activity = Kegiatan
    .aside = Catetan sisi
    .cascade = Kaskade
    .definition = Definisi
    .example = Conto
    .exercise = Latihan
    .exercises = Latihan
    .given-answer = Pasaut
    .note = Catetan
    .objectives = Tetujon
    .paragraphs = Paragraf
    .part = Bagian
    .problem = Soal
    .problems = Soal
    .proof = Bukti
    .question = Patakon
    .section = Bab
    .solution = Pamragat
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

hint-title = Tunjuk


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

paginator-previous = Sadurunge
paginator-next = Salanturne
paginator-page = Kaca

paginator-page-status = { $pageLabel } { $currentPage } uli { $numPages }


## Piecewise functions

piecewise-condition-or = utawi
piecewise-condition-if = yen
piecewise-condition-otherwise = yen tusing


## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Balinese schools teach chemistry out of Indonesian-language
## textbooks, so the periodic table a Balinese pupil meets is `locales/id`'s —
## the case `locales/jv` and `locales/su` are in, with the difference that those
## two supply the Indonesian names and this one does not, because Balinese has
## no settled table of its own to seed from and copying Indonesian's whole would
## report a fact about a textbook rather than about the language. The everyday
## substances Balinese does name itself are the place a speaker should start.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Simbol kimia ane tusing sah
chemistry-invalid-ionic-compound = Senyawa ionik ane tusing sah

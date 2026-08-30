# Gorontalo (Bahasa Hulontalo) content catalog: the prose the core computes
# into the document. Selected by `documentLocale` — the language the activity
# was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **This catalog is a Gorontalo frame around declared Indonesian loans**, in
# the sense `chrome.ftl`'s header sets out in full. Read that first: it names
# what is Gorontalo here (the negator «diila», the modal «mowali», the relator
# «u», the existential «woluwo», «wawu», «meyalo», «wonu», «sababu», «to»,
# «lonto», «lo», «mohutu», «mopo-») and what is Indonesian (everything else).
#
# **Orthography: the Latin practice in current use**, no diacritics, the
# glottal stop written `'` only where a word would otherwise be ambiguous.
#
# ## Word order, and the absence of a linker
#
# **The noun comes first and its modifiers follow it, with nothing between
# them**: «garis meela» is *red line*. So every composition message here
# inverts English's order, and none of them writes a linker. That is the
# single fact that most cleanly separates this file from `locales/bbc` beside
# it in the same batch: Toba Batak needs the relator «na» between the noun and
# its modifiers and Gorontalo needs nothing at all, which is why the two files
# do not have the same shape even where they have the same order. Within the
# description the adjectives keep English's own sequence — width, dash
# pattern, colour.
#
# **`[noun-tail]` is unused.** The side count of a regular polygon binds to the
# noun rather than to the adjectives, so it folds into the head exactly as
# English's does and the tail stays empty.
#
# ## Gender and role
#
# Gorontalo has no grammatical gender and does not inflect a modifier for the
# position its phrase sits in, so `noun-gender` answers one token for every
# noun and nothing here selects on `$gender` or on `$role`.
#
# ## The colour table is the one place native vocabulary is attempted
#
# Five of the twelve are written with what the seed reads as the Gorontalo
# basic colour terms — «moitomo» (black), «moputio» (white), «meela» (red),
# «molalahu» (yellow) and «moidu» (green, and in some descriptions blue as
# well). They are written in the `mo-` stative shape a Gorontalo property word
# takes, which is why the seed believes them to be the right *form* even where
# it is less sure of the root. **They are unverified against a dictionary, and
# a reviewer should check all five before trusting any of them.** «moidu» is
# the one most likely to be wrong in this use: a green/blue term that has not
# split is exactly the kind of word a colour picker's twelve-way table
# mistranslates, and this catalog uses the Indonesian «biru» for blue rather
# than stretching it.
#
# The other seven have no Gorontalo basic term the seed can reach and are
# written with the Indonesian words. That is the honest shape of a basic colour
# inventory and not a gap: no language has a native word for *cyan*.
#
# Everything else in this file — the geometry, the dash patterns, the section
# words, the table and figure words — is Indonesian, because that is the
# register a Gorontalo pupil learns mathematics in. Coining Gorontalo
# replacements would report a wish rather than a fact.
#
# ## Chemistry
#
# **The 118 element names and the 12 anion names are deliberately absent**, and
# fall back to English. Chemistry is taught in Gorontalo province out of
# Indonesian-language textbooks, so the periodic table a Gorontalo pupil meets
# is `locales/id`'s. Copying the Indonesian table wholesale into this file
# would record a fact about a textbook rather than about Gorontalo. The three
# messages that are *frames* rather than names are translated, because a frame
# is this catalog's business whether or not the names in it ever are.


## Style vocabulary

color =
    .black = moitomo
    .white = moputio
    .gray = abu-abu
    .red = meela
    .orange = oranye
    .yellow = molalahu
    .green = moidu
    .cyan = sian
    .blue = biru
    .purple = ungu
    .pink = merah muda
    .brown = cokelat
line-width =
    .thick = tebal
    .thin = tipis
line-style =
    .dashed = putus-putus
    .dotted = titik-titik
# Noun phrases, not adjectives: they follow «wolo» and modify nothing.
fill-style =
    .horizontal = garis melintang
    .vertical = garis tihu-tihulo
    .diagonal = garis diagonal
    .backdiagonal = garis diagonal u lobalika
    .dots = titik
    .diamonds = belah ketupat
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
    .polyline = garis patah
    .polygon = poligon
    .triangle = segitiga
    .rectangle = persegi panjang
    .circle = lingkaran
    .region = daerah
    .point = titik
    .square = persegi
    .diamond = belah ketupat
    .cross = silang
    .plus = tanda tambah
# The side count binds to the noun, so it folds into the head and there is no
# tail — putting it after the adjectives would read as though the colour had
# the sides.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] poligon beraturan u o sisi { $numSides }
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
# The noun leads and its modifiers follow it directly, with no linker:
# «garis tebal putus-putus meela».
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $nounTail } { $description }
       *[noun] { $noun } { $description }
    }
style-filled-word = polu
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } wolo { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } wolo { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } wolo { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# Gorontalo has no article, so the two `-article` branches read the same as the
# ones without. «wawu» is the linking *and*.
style-border-clause =
    { $parts ->
        [with-article] wolo batas { $border }
        [and] wawu batas { $border }
        [and-article] wawu batas { $border }
       *[with] wolo batas { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = diila polu
style-text =
    { $parts ->
        [background] { $color } wolo latar { $background }
       *[plain] { $color }
    }
style-background-none = diila woluwo


## Boolean words

boolean-true = banari
boolean-false = diila banari


## Answer buttons

answer-submit-label = Pareksa
answer-submit-label-no-correctness = Delo jawaban


## Sectional blocks

section-name =
    .activity = Karaja
    .aside = Sisipan
    .cascade = Kaskade
    .definition = Definisi
    .example = Misalu
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
    .question = Pertanyaan
    .section = Pasal
    .solution = Penyelesaian
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
hint-title = Petunjuk


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

paginator-previous = U lomayi
paginator-next = U ma monao
paginator-page = Halaman
paginator-page-status = { $pageLabel } { $currentPage } lonto { $numPages }


## Piecewise functions

piecewise-condition-or = meyalo
piecewise-condition-if = wonu
piecewise-condition-otherwise = wonu diila


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent; see the
## header. These three are frames rather than vocabulary, so they are
## translated whether or not the names ever are.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Simbol kimia u diila banari
chemistry-invalid-ionic-compound = Senyawa ionik u diila banari


## Inputs embedded in math

math-embedded-input-blank = lowong
math-embedded-input-blank-ordinal = lowong { $ordinal } lonto { $total }

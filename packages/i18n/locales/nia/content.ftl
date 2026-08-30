# Nias (Li Niha) content catalog: the prose the core computes into the
# document. Selected by `documentLocale` — the language the activity was
# written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Variety and orthography: the northern standard, in Latin**, with `ö` as a
# letter of its own that must never be folded to `o`. `chrome.ftl`'s header
# sets out the alphabet, the final-vowel property and the compromise this
# catalog makes with it, and the reason initial mutation is not applied
# anywhere; read that first, because all three bear on this file more than on
# any other.
#
# ## Word order, and the attributive that is missing
#
# **The noun comes first and its modifiers follow it**: «omo sebua» is *big
# house*, and so «garis meramba» would be *red line*. Every composition
# message here inverts English's order.
#
# What is missing is the shape of the modifier. A Nias property word takes an
# attributive form built with `s-` — «ebua» becomes «sebua» — and the seed
# cannot form that on an Indonesian loan: there is no «stebal». So the loan
# adjectives in this file stand **bare, in their Indonesian citation form**,
# behind the noun. That is the same limit as the missing initial mutation, in
# a second place, and it is stated rather than papered over. A speaker
# correcting this file will be adding morphology, not changing words.
#
# It is also what separates this file from the two beside it in the batch.
# `locales/bbc` puts a relator «na» between the noun and its modifiers,
# `locales/gor` puts nothing there at all, and Nias wants a prefix *on the
# modifier* that this catalog cannot supply. Three Austronesian languages of
# Indonesia, one word order, three different answers about what joins the two
# halves.
#
# **`[noun-tail]` is unused.** The side count of a regular polygon binds to the
# noun rather than to the adjectives, so it folds into the head exactly as
# English's does and the tail stays empty.
#
# ## Gender and role
#
# Nias has no grammatical gender and does not inflect a modifier for the
# position its phrase sits in, so `noun-gender` answers one token for every
# noun and nothing here selects on `$gender` or on `$role`.
#
# ## The colour table, and how far to trust it
#
# **Two of the twelve are attempted in Nias** — «aitö» (black) and «afusi»
# (white). The seed believes these to be the Nias basic terms and has **not
# verified them against a dictionary**; they are the first two words a reviewer
# should check in this file. The other ten are Indonesian, because the seed has
# no reliable Nias term for them and inventing one would be worse than
# borrowing. That includes red, which almost certainly *has* a Nias word: its
# absence here is a gap in the seed rather than a claim about the language.
#
# Everything else — the geometry, the widths, the dash patterns, the section
# words, the table and figure words — is Indonesian, because that is the
# register a Nias pupil learns mathematics in. What is Nias is «halöwö»
# (activity), «duma-duma» (example), «fanofu» (question), «fanema li» (answer)
# and the boolean pair «sindruhu» / «lö sindruhu».
#
# ## Chemistry
#
# **The 118 element names and the 12 anion names are deliberately absent**, and
# fall back to English. Chemistry is taught on Nias out of Indonesian-language
# textbooks, so the periodic table a Nias pupil meets is `locales/id`'s.
# Copying the Indonesian table wholesale into this file would record a fact
# about a textbook rather than about Nias. The three messages that are *frames*
# rather than names are translated, because a frame is this catalog's business
# whether or not the names in it ever are.


## Style vocabulary

color =
    .black = aitö
    .white = afusi
    .gray = abu-abu
    .red = merah
    .orange = oranye
    .yellow = kuning
    .green = hijau
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
# Noun phrases, not adjectives: they follow «awö» and modify nothing.
fill-style =
    .horizontal = garis melintang
    .vertical = garis muzizio
    .diagonal = garis diagonal
    .backdiagonal = garis diagonal sanulöni
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
       *[head] poligon beraturan si so { $numSides } sisi
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
# The noun leads and its modifiers follow it: «garis tebal putus-putus merah».
# The attributive `s-` a Nias property word would carry is missing here; see
# the header.
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $nounTail } { $description }
       *[noun] { $noun } { $description }
    }
style-filled-word = afönu
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } awö { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } awö { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } awö { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# Nias has no article, so the two `-article` branches read the same as the ones
# without. «ba» is the linking *and*.
style-border-clause =
    { $parts ->
        [with-article] awö batas { $border }
        [and] ba batas { $border }
        [and-article] ba batas { $border }
       *[with] awö batas { $border }
    }
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = lö afönu
style-text =
    { $parts ->
        [background] { $color } awö latar { $background }
       *[plain] { $color }
    }
style-background-none = lö hadöi


## Boolean words

boolean-true = sindruhu
boolean-false = lö sindruhu


## Answer buttons

answer-submit-label = Fareso
answer-submit-label-no-correctness = Fa'ohe wanema li


## Sectional blocks

section-name =
    .activity = Halöwö
    .aside = Sisipan
    .cascade = Kaskade
    .definition = Definisi
    .example = Duma-duma
    .exercise = Latihan
    .exercises = Latihan
    .given-answer = Fanema li
    .note = Catatan
    .objectives = Tujuan
    .paragraphs = Paragraf
    .part = Bagian
    .problem = Soal
    .problems = Soal
    .proof = Bukti
    .question = Fanofu
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
hint-title = Fanuturu


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

paginator-previous = Si fatua
paginator-next = Si so föna
paginator-page = Halaman
paginator-page-status = { $pageLabel } { $currentPage } moroi ba { $numPages }


## Piecewise functions

piecewise-condition-or = ma
piecewise-condition-if = na
piecewise-condition-otherwise = na lö da'ö


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent; see the
## header. These three are frames rather than vocabulary, so they are
## translated whether or not the names ever are.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Simbol kimia si lö atulö
chemistry-invalid-ionic-compound = Senyawa ionik si lö atulö


## Inputs embedded in math

math-embedded-input-blank = lowong
math-embedded-input-blank-ordinal = lowong si { $ordinal } moroi ba { $total }

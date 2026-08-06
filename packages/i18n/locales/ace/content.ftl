# Acehnese content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Latin orthography; see `chrome.ftl`'s header for the Jawi note.
#
# Acehnese has no grammatical gender and no case, so `noun-gender` answers one
# token for every noun and nothing here selects on `$gender` or on `$role`.
#
# The adjectives **follow** the noun — «garéh mirah», a red line — so every
# composition message inverts the English order.
#
# Acehnese vocabulary diverges from Malay far more than Minangkabau's does, and
# the colours are where a corrector will see it first: «itam», «putéh»,
# «mirah», «kuneng» are cognate but not identical, and «abée» for grey is the
# word for ash rather than a loan. The geometry nouns are the Indonesian ones,
# because Acehnese schools teach mathematics out of Indonesian-language
# textbooks — the seam this catalog runs along, and one its header should be
# read as declaring rather than hiding.


## Style vocabulary

color =
    .black = itam
    .white = putéh
    .gray = abée
    .red = mirah
    .orange = oranyeu
    .yellow = kuneng
    .green = ijo
    .cyan = sian
    .blue = biru
    .purple = unggu
    .pink = mirah muda
    .brown = coklat

line-width =
    .thick = teubai
    .thin = lipéh

line-style =
    .dashed = putôh-putôh
    .dotted = titék-titék

# Noun phrases. Acehnese marks no plural on the noun, so «garéh» is the word for
# one line and for many alike.
fill-style =
    .horizontal = garéh meulinteueng
    .vertical = garéh meudong
    .diagonal = garéh mereng
    .backdiagonal = garéh mereng meubalék
    .dots = titék
    .diamonds = beulah keutupat

noun =
    .line = garéh
    .line-segment = ruweueng garéh
    .ray = sinar
    .vector = vektor
    .curve = lengkông
    .function = fungsi
    .parabola = parabola
    .polyline = garéh patah
    .polygon = poligon
    .triangle = seugoë lhèë
    .rectangle = peuseugi panyang
    .circle = bulat
    .region = kawasan
    .point = titék
    .square = peuseugi
    .diamond = beulah keutupat
    .cross = sileuëng
    .plus = plus

# The side count follows the adjectives as a complement, so that they stay
# beside the noun they describe.
noun-regular-polygon =
    { $part ->
        [tail] nyang na { $numSides } sagoë
       *[head] poligon beuratura
    }

# One answer for every noun: Acehnese has no grammatical gender.
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

style-filled-word = peunoh

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } ngon { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } ngon { $pattern }
        [plain-tail] { $noun } { $filled } { $color } { $nounTail }
        [pattern-tail] { $noun } { $filled } { $color } { $nounTail } ngon { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }

# Acehnese has no article, so the two `-article` branches say what the other two
# say. They are kept apart because English's distinction is between a first
# clause and a further one, which this file does mark: «ngon» against «lom».
style-border-clause =
    { $parts ->
        [with-article] ngon binèh { $border }
        [and] lom binèh { $border }
        [and-article] lom binèh { $border }
       *[with] ngon binèh { $border }
    }

style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }

style-unfilled = hana peunoh

style-text =
    { $parts ->
        [background] { $color } ngon laté { $background }
       *[plain] { $color }
    }

style-background-none = hana


## Boolean words

boolean-true = beutôi
boolean-false = salah


## Answer buttons

answer-submit-label = Peuréksa buet
answer-submit-label-no-correctness = Kirém jaweueb


## Sectional blocks

# `.exercise` and `.exercises`, and `.problem` and `.problems`, are one word
# each: Acehnese marks no plural on the noun.
section-name =
    .activity = Keugiatan
    .aside = Catatan binèh
    .cascade = Kaskade
    .definition = Bataih
    .example = Cuntoh
    .exercise = Latihan
    .exercises = Latihan
    .given-answer = Jaweueb
    .note = Catatan
    .objectives = Tujuan
    .paragraphs = Paragraf
    .part = Bagian
    .problem = Soal
    .problems = Soal
    .proof = Bukti
    .question = Peurtanyaan
    .section = Bagian
    .solution = Peunyeulesaian
    .task = Tugaih
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

hint-title = Peutunyok


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
        [numbered] Gamba { $enumeration }
        [numbered-caption] Gamba { $enumeration }{ ": " }
        [unnumbered-caption] Gamba{ ": " }
       *[unnumbered] Gamba
    }


## Paginator controls

paginator-previous = Sigohlom
paginator-next = Seulanjut
paginator-page = Laman

paginator-page-status = { $pageLabel } { $currentPage } nibak { $numPages }


## Piecewise functions

piecewise-condition-or = atawa
piecewise-condition-if = meunyo
piecewise-condition-otherwise = meunyo hana


## Chemistry
##
## The 118 element names and the 12 anion names are left to fall back to
## English. Acehnese schools teach chemistry out of Indonesian-language
## textbooks, so the periodic table an Acehnese pupil meets is `locales/id`'s,
## and Acehnese has no settled table of its own to seed from. The everyday
## substances it does name itself — «meuh» for gold, «beusoë» for iron — are
## where a speaker should start rather than at the whole 118.

ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Simbol kimia nyang hana sah
chemistry-invalid-ionic-compound = Sanyawa ionik nyang hana sah

# Kadazandusun content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Kadazandusun** (Boros Dusun) of Sabah, written in the **standardised
# Bundu-Liwan-based orthography** taught in Sabah's schools. `dtp` is Central
# Dusun; **Coastal Kadazan is `dtb`** and **Rungus is `drg`**, and a reader of
# either variety will need to respell some of what is here. See
# `locales/dtp/chrome.ftl` for the whole of that note.
#
# WORD ORDER. The head noun comes first and its describing word follows, so
# "thick dashed red line" is «garis tebal putus-putus merah» — noun, width,
# dash pattern, colour, keeping English's order among the adjectives
# themselves. `style-with-noun` and `style-filled-with-noun` put `{ $noun }`
# first, and every message in this file agrees with them.
#
# **THE LINKER, WHICH IS THIS FILE'S LARGEST OPEN QUESTION.** Kadazandusun
# joins a modifier to a head with **«do»/«dot»**, and where it is obligatory
# is not something this seed can get right message by message. So the rule it
# follows is stated once and applied everywhere: **«dot» is written where it
# introduces a relative clause** («markah paling tinggi dot obuli»), and
# **omitted between a noun and a bare describing word** («garis tebal»). A
# speaker should check that split before anything else in this file; it is one
# decision, and correcting it corrects every message at once.
#
# GENDER AND NUMBER. Kadazandusun has no grammatical gender and does not
# inflect a describing word to agree with its noun, so `$gender` and `$role`
# are received and ignored, as in English. It has no article, so the two
# `-article` branches read exactly like the ones without. A noun after a
# numeral is unmarked.
#
# **THE NOUN TABLE IS MALAY, AND THAT IS DELIBERATE.** «poligon», «fungsi»,
# «vektor», «parabola», «segi tiga», «segi empat tepat», «bulatan», «rombus»
# and the rest are the Malay school terms, written unchanged. They are nearly
# the same words `locales/ms` and `locales/iba` carry, because Sabah, Sarawak
# and the peninsula teach mathematics out of the same Malay textbooks — a fact
# about one education ministry rather than about three languages. **What
# differs between the three catalogs is everything around the table**, and
# that is where a reviewer should look to see whether this one is
# Kadazandusun.
#
# WHAT IS KADAZANDUSUN HERE. The colour terms «oitom», «opurak», «aragang»,
# «osilou» and «otomou»; «waro» and «aiso»; «amu'», «om», «toi», «nung»,
# «miampai», «montok», «mantad», «obuli»; «simbar» for the answer, «otopot»
# for true.
#
# CONFIDENCE. The colour list is the thinnest part of the file. Five of the
# twelve — «kelabu» (gray), «jingga» (orange), «ungu» (purple), «merah jambu»
# (pink) and «perang» (brown) — are the **Malay words**, written because
# Kadazandusun's everyday colour vocabulary does not settle these five and a
# coinage would be worse than a loan a speaker already uses. «otomou» is
# written for green; it covers a green-to-blue range for many speakers, which
# is also why «biru otomou» for cyan is a reach rather than a term.
#
# CHEMISTRY. `element-name` and `element-anion-name` are deliberately **left
# out**, so their ~130 keys fall back to English. Chemistry in Sabah is taught
# in Malay, out of textbooks printing the Dewan Bahasa dan Pustaka names,
# which `locales/ms` already carries; there is no separate Kadazandusun list,
# and copying the Malay one under this tag would report a language fact that
# is not true. The frames around the names are translated, because they are
# frames rather than vocabulary.


## Style vocabulary

color =
    .black = oitom
    .white = opurak
    .gray = kelabu
    .red = aragang
    .orange = jingga
    .yellow = osilou
    .green = otomou
    .cyan = biru otomou
    .blue = biru
    .purple = ungu
    .pink = merah jambu
    .brown = perang
line-width =
    .thick = tebal
    .thin = nipis
line-style =
    .dashed = putus-putus
    .dotted = bertitik
# Noun phrases: they follow «miampai» and modify nothing themselves. The
# reduplication is the plural.
fill-style =
    .horizontal = garis-garis mendatar
    .vertical = garis-garis menegak
    .diagonal = garis-garis serong
    .backdiagonal = garis-garis serong terbalik
    .dots = titik-titik
    .diamonds = rombus
noun =
    .line = garis
    .line-segment = tembereng garis
    .ray = sinar
    .vector = vektor
    .curve = lengkung
    .function = fungsi
    .slope-field = medan kecerunan
    .vector-field = medan vektor
    .parabola = parabola
    .polyline = garis berbilang
    .polygon = poligon
    .triangle = segi tiga
    .rectangle = segi empat tepat
    .circle = bulatan
    .region = pomogunan
    .point = titik
    .square = segi empat sama
    .diamond = rombus
    .cross = tanda pangkah
    .plus = tanda tambah
# «bersisi» has to stay beside the number that counts the sides, so the count
# folds into the head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] poligon sekata bersisi { $numSides }
    }
# Kadazandusun has no grammatical gender, so every noun answers the same and
# the answer goes unused.
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
# The noun leads and its describing words follow: «garis tebal putus-putus
# aragang».
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $nounTail } { $description }
       *[noun] { $noun } { $description }
    }
style-filled-word = berisi
# «miampai» — "together with" — is the Kadazandusun word carrying English's
# "with"; «om» is the one that chains a further clause on.
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } miampai { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } miampai { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } miampai { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# Kadazandusun has no article, so the `-article` branches read like the ones
# without.
style-border-clause =
    { $parts ->
        [with-article] miampai sempadan { $border }
        [and] om sempadan { $border }
        [and-article] om sempadan { $border }
       *[with] miampai sempadan { $border }
    }
# The pattern is a noun and the colour follows it, as everywhere else.
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
style-unfilled = amu' berisi
style-text =
    { $parts ->
        [background] { $color } miampai latar belakang { $background }
       *[plain] { $color }
    }
# «aiso» is the Kadazandusun "there is none", the negative counterpart of
# «waro».
style-background-none = aiso


## Boolean words

boolean-true = otopot
boolean-false = amu' otopot


## Answer buttons

answer-submit-label = Periksa Kerja
answer-submit-label-no-correctness = Hantar Simbar


## Sectional blocks
##
## Kadazandusun does not mark number on a noun, so `.exercise` and
## `.exercises`, and `.problem` and `.problems`, are the same word. These are
## the Malay school words but for `.given-answer`, which is Kadazandusun
## «Simbar»; see the header for why the rest are loans rather than coinages.

section-name =
    .activity = Aktiviti
    .aside = Nota Tepi
    .cascade = Kaskad
    .definition = Takrif
    .example = Contoh
    .exercise = Latihan
    .exercises = Latihan
    .given-answer = Simbar
    .note = Nota
    .objectives = Tujuan
    .paragraphs = Perenggan
    .part = Bahagian
    .problem = Masalah
    .problems = Masalah
    .proof = Bukti
    .question = Soalan
    .section = Seksyen
    .solution = Penyelesaian
    .task = Tugasan
    .theorem = Teorem
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
        [numbered] Jadual { $enumeration }
        [numbered-title] Jadual { $enumeration }{ ": " }
        [unnumbered-title] Jadual{ ": " }
       *[unnumbered] Jadual
    }
figure-name =
    { $parts ->
        [numbered] Rajah { $enumeration }
        [numbered-caption] Rajah { $enumeration }{ ": " }
        [unnumbered-caption] Rajah{ ": " }
       *[unnumbered] Rajah
    }


## Paginator controls

paginator-previous = Sebelum
paginator-next = Seterusnya
paginator-page = Halaman
paginator-page-status = { $pageLabel } { $currentPage } mantad { $numPages }


## Piecewise functions

piecewise-condition-or = toi
piecewise-condition-if = nung
piecewise-condition-otherwise = nung amu'


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent; see the
## header for why. These three are frames rather than vocabulary, so they are
## translated whether or not the names ever are.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Simbol Kimia Amu' Otopot
chemistry-invalid-ionic-compound = Sebatian Ionik Amu' Otopot


## Inputs embedded in math

math-embedded-input-blank = kosong
math-embedded-input-blank-ordinal = kosong { $ordinal } mantad { $total }

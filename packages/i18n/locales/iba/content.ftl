# Iban content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Iban** (Jaku Iban), a Malayic language of Sarawak and of West Kalimantan,
# written in the standard Sarawak orthography: `ch` where Malay writes `c`,
# and the Iban prefixes `be-`, `te-`, `pe-`/`peN-` where Malay has `ber-`,
# `ter-`, `per-`/`peN-`. See `locales/iba/chrome.ftl` for the whole of that
# note and for the list of Iban function words a reviewer can check this file
# against in a second.
#
# WORD ORDER. Iban is head-initial and its adjectives **follow** the noun, so
# "thick dashed red line" is «garis tebal putus-putus mirah» — noun, then
# width, then dash pattern, then colour, keeping English's order among the
# adjectives themselves. `style-with-noun` and `style-filled-with-noun`
# therefore put `{ $noun }` first, and every message in this file agrees with
# them. That order is the one thing here that a test pins, so a corrector who
# moves it has to move it in both messages at once.
#
# The side count folds into the head — «poligon rata besisi 5» — because
# «besisi» has to stay beside the number counting it. So `[tail]` is empty.
#
# GENDER AND NUMBER. Iban has no grammatical gender and does not inflect an
# attributive adjective, so `$gender` and `$role` are received and ignored, as
# in English. It has no article either, so the two `-article` branches read
# exactly like the ones without. A noun after a numeral is unmarked.
#
# THE TECHNICAL REGISTER IS MALAY, AND IS DECLARED AS SUCH. An Iban pupil is
# schooled in Malay and meets «poligon», «fungsi», «vektor», «parabola»,
# «rombus» and «statistik» in a Malay textbook. Those are written here as they
# stand rather than replaced with coinages — including the shape names «segi
# tiga», «segi empat tepat», «segi empat sama» and the field terms «medan
# kecherunan», «medan vektor». What is Iban in this file is everything around
# them.
#
# WHERE IBAN HAS ITS OWN WORD IT IS USED: «mirah» rather than Malay «merah»,
# «itam» rather than «hitam», «burak» rather than «putih», «gadung» for green,
# «bulatan» for the circle, «titik» for the point, «kawasan» for the region,
# «beisi»/«nadai isi» for filled and unfilled, «tauka» for "or", «enti» for
# "if", «lalu» for the "and" that chains one clause onto another.
#
# CONFIDENCE. The colour list is the thinnest part of the file. «kelabu»
# (gray), «jingga» (orange), «ungu» (purple), «mirah jambu» (pink) and
# «perang» (brown) are the Malay words, written because Iban's own everyday
# colour vocabulary does not settle these five and a coinage would be worse
# than a loan a speaker actually uses. «gadung» is written for green; a
# speaker may prefer «ijau», and may not agree that «biru gadung» is the right
# reach for cyan.
#
# CHEMISTRY. `element-name` and `element-anion-name` are deliberately **left
# out**, so their ~130 keys fall back to English. Chemistry in Sarawak is
# taught in Malay, out of textbooks printing the Dewan Bahasa dan Pustaka
# names, which `locales/ms` already carries; there is no separate Iban list,
# and copying the Malay one under an Iban tag would report a language fact
# that is not true. The frames around the names — `ion-name-oxidation-state`
# and the two invalid-input messages — are translated, because they are frames
# rather than vocabulary.


## Style vocabulary

color =
    .black = itam
    .white = burak
    .gray = kelabu
    .red = mirah
    .orange = jingga
    .yellow = kuning
    .green = gadung
    .cyan = biru gadung
    .blue = biru
    .purple = ungu
    .pink = mirah jambu
    .brown = perang
line-width =
    .thick = tebal
    .thin = nipis
line-style =
    .dashed = putus-putus
    .dotted = betitik
# Noun phrases: they follow «enggau» and modify nothing themselves. «te-» is
# the Iban prefix, not a misspelling of Malay «ter-».
fill-style =
    .horizontal = garis melintang
    .vertical = garis bediri
    .diagonal = garis serong
    .backdiagonal = garis serong tebalik
    .dots = titik
    .diamonds = rombus
noun =
    .line = garis
    .line-segment = tembereng garis
    .ray = sinar
    .vector = vektor
    .curve = lengkung
    .function = fungsi
    .slope-field = medan kecherunan
    .vector-field = medan vektor
    .parabola = parabola
    .polyline = garis bebilang
    .polygon = poligon
    .triangle = segi tiga
    .rectangle = segi empat tepat
    .circle = bulatan
    .region = kawasan
    .point = titik
    .square = segi empat sama
    .diamond = rombus
    .cross = tanda silang
    .plus = tanda tambah
# «besisi» has to stay beside the number that counts the sides, so the count
# folds into the head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] poligon rata besisi { $numSides }
    }
# Iban has no grammatical gender, so every noun answers the same and the
# answer goes unused.
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
# The noun leads and its adjectives follow: «garis tebal putus-putus mirah».
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $nounTail } { $description }
       *[noun] { $noun } { $description }
    }
style-filled-word = beisi
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } enggau { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } { $filled } { $color } enggau { $pattern }
        [plain-tail] { $noun } { $nounTail } { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } { $filled } { $color } enggau { $pattern }
       *[plain] { $noun } { $filled } { $color }
    }
# «sempadan» leads its own adjectives, as every noun here does. Iban has no
# article, so the `-article` branches read like the ones without; «lalu» is
# the Iban word that chains one clause onto the next.
style-border-clause =
    { $parts ->
        [with-article] enggau sempadan { $border }
        [and] lalu sempadan { $border }
        [and-article] lalu sempadan { $border }
       *[with] enggau sempadan { $border }
    }
# The pattern is a noun and the colour follows it, as everywhere else.
style-fill =
    { $parts ->
        [pattern] { $pattern } { $color }
       *[plain] { $color }
    }
# «nadai» is the existential negator: "has no filling", not "not filled".
style-unfilled = nadai isi
style-text =
    { $parts ->
        [background] { $color } enggau latar belakang { $background }
       *[plain] { $color }
    }
style-background-none = nadai


## Boolean words

boolean-true = amat
boolean-false = ukai amat


## Answer buttons

answer-submit-label = Uji Pengawa
answer-submit-label-no-correctness = Kirum Saut


## Sectional blocks
##
## Iban does not mark number on a noun, so `.exercise` and `.exercises`, and
## `.problem` and `.problems`, are the same word. That is the language rather
## than an omission.

section-name =
    .activity = Pengawa
    .aside = Nota Tepi
    .cascade = Kaskad
    .definition = Reti
    .example = Chunto
    .exercise = Latih
    .exercises = Latih
    .given-answer = Saut
    .note = Nota
    .objectives = Tuju
    .paragraphs = Perenggan
    .part = Bagi
    .problem = Pekara
    .problems = Pekara
    .proof = Bukti
    .question = Tanya
    .section = Seksyen
    .solution = Penyelesaian
    .task = Tugas
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
hint-title = Tunjuk Jalai


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
        [numbered] Gambar { $enumeration }
        [numbered-caption] Gambar { $enumeration }{ ": " }
        [unnumbered-caption] Gambar{ ": " }
       *[unnumbered] Gambar
    }


## Paginator controls

paginator-previous = Ka Belakang
paginator-next = Ka Mua
paginator-page = Lambar
paginator-page-status = { $pageLabel } { $currentPage } ari { $numPages }


## Piecewise functions

piecewise-condition-or = tauka
piecewise-condition-if = enti
piecewise-condition-otherwise = enti ukai


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent; see the
## header for why. These three are frames rather than vocabulary, so they are
## translated whether or not the names ever are.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Simbol Kimia Enda Betul
chemistry-invalid-ionic-compound = Sebatian Ionik Enda Betul


## Inputs embedded in math

math-embedded-input-blank = kosong
math-embedded-input-blank-ordinal = kosong { $ordinal } ari { $total }

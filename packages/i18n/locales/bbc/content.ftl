# Toba Batak (Hata Batak Toba) content catalog: the prose the core computes
# into the document. Selected by `documentLocale` — the language the activity
# was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Latin**, in the conventional spelling of the Batak Bible and of
# Warneck's dictionary; `chrome.ftl`'s header argues the choice against Surat
# Batak at length. No Batak script anywhere in this file, and a corrector who
# wants it must convert all four files at once.
#
# ## Word order, and the linker
#
# **The noun comes first and its modifiers follow it**, joined by the
# attributive relator «na»: «garis na hapal rara» is *thick red line*. So every
# composition message here inverts English's order, and `style-with-noun` puts
# «na» between the noun and the description. Within the description the
# adjectives keep English's own sequence — width, dash pattern, colour — and
# «na» is written once, in front of the run, rather than before each adjective;
# writing it three times is grammatical but is not how the phrase is said.
#
# That order is shared with the other Indonesian catalogs in the roster
# (`locales/id`, `locales/ban`, `locales/jv`) and the *linker* is not: Balinese
# puts the adjective straight behind the noun with nothing between them, and
# Toba Batak needs «na». It is the one place a reader can tell this file from
# `locales/ban` at a glance.
#
# `style-stroke` and `style-fill` are rendered on their own as well as inside a
# noun phrase, so they carry no «na» of their own — the message that embeds
# them supplies it.
#
# **`[noun-tail]` is unused.** The side count of a regular polygon binds to the
# noun rather than to the adjectives, so it folds into the head exactly as
# English's does and the tail stays empty.
#
# ## Gender and role
#
# Toba Batak has no grammatical gender and does not inflect a modifier for the
# position its phrase sits in, so `noun-gender` answers one token for every
# noun and nothing here selects on `$gender` or on `$role`.
#
# ## Vocabulary, and where the seam is
#
# **The geometry is Indonesian and is declared as a loan register**, not
# translated into invented Batak. Toba Batak pupils learn mathematics out of
# Indonesian-language textbooks, so «garis», «lingkaran», «poligon», «vektor»,
# «kurva», «fungsi», «titik», «persegi» and the rest are the words that are
# actually used, and coining Batak replacements would report a wish rather than
# a fact. The same goes for the two dash patterns, «putus-putus» and
# «titik-titik».
#
# **Five colours are Toba Batak's own** — «birong» (black), «bontar» (white),
# «rara» (red), «gorsing» (yellow) and «rata» (green, and also *unripe*). The
# other seven have no Batak basic term and are written with the Indonesian
# words. That is the honest shape of a basic colour inventory and not a gap in
# the seed: no language has a native word for *cyan*.
#
# The widths «hapal» and «nipis», the fill word «gok» (full), «jongjong»
# (standing, for a vertical line) and «malintang» (crosswise, for a horizontal
# one) are Toba Batak. So are the section words «Ulaon» (activity), «Umpama»
# (example), «Alus» (answer), «Sungkun-sungkun» (question) and «Pasal»
# (section — the word the Batak Bible uses for a chapter), and the boolean pair
# «tutu» / «so tutu».
#
# ## Chemistry
#
# **The 118 element names and the 12 anion names are deliberately absent**, and
# fall back to English. Chemistry is taught in North Sumatra out of
# Indonesian-language textbooks, so the periodic table a Batak pupil meets is
# `locales/id`'s. Copying the Indonesian table wholesale into this file would
# record a fact about a textbook rather than about Toba Batak, and inventing a
# Batak table would record nothing at all. The three messages that are *frames*
# rather than names are translated, because a frame is this catalog's business
# whether or not the names in it ever are.


## Style vocabulary

color =
    .black = birong
    .white = bontar
    .gray = abu-abu
    .red = rara
    .orange = oranye
    .yellow = gorsing
    .green = rata
    .cyan = sian
    .blue = biru
    .purple = ungu
    .pink = merah muda
    .brown = cokelat
line-width =
    .thick = hapal
    .thin = nipis
line-style =
    .dashed = putus-putus
    .dotted = titik-titik
# Noun phrases, not adjectives: they follow «dohot» and modify nothing.
fill-style =
    .horizontal = garis malintang
    .vertical = garis jongjong
    .diagonal = garis diagonal
    .backdiagonal = garis diagonal na balik
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
# «marsisi { $numSides }» binds to the noun, so it folds into the head and
# there is no tail — putting it after the adjectives would read as though the
# colour had the sides.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] poligon biasa marsisi { $numSides }
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
# The noun leads and «na» introduces the run of modifiers behind it:
# «garis na hapal putus-putus rara».
style-with-noun =
    { $parts ->
        [noun-tail] { $noun } { $nounTail } na { $description }
       *[noun] { $noun } na { $description }
    }
style-filled-word = gok
style-filled =
    { $parts ->
        [pattern] { $filled } { $color } dohot { $pattern }
       *[plain] { $filled } { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $noun } na { $filled } { $color } dohot { $pattern }
        [plain-tail] { $noun } { $nounTail } na { $filled } { $color }
        [pattern-tail] { $noun } { $nounTail } na { $filled } { $color } dohot { $pattern }
       *[plain] { $noun } na { $filled } { $color }
    }
# Toba Batak has no article, so the two `-article` branches read the same as
# the ones without. «jala» is the sentence-linking *and*.
style-border-clause =
    { $parts ->
        [with-article] dohot batas na { $border }
        [and] jala batas na { $border }
        [and-article] jala batas na { $border }
       *[with] dohot batas na { $border }
    }
# The pattern is a noun and the colour is its modifier, so «na» comes back.
style-fill =
    { $parts ->
        [pattern] { $pattern } na { $color }
       *[plain] { $color }
    }
style-unfilled = so gok
style-text =
    { $parts ->
        [background] { $color } dohot latar na { $background }
       *[plain] { $color }
    }
style-background-none = ndang adong


## Boolean words

boolean-true = tutu
boolean-false = so tutu


## Answer buttons

answer-submit-label = Pareso
answer-submit-label-no-correctness = Pasahat alus


## Sectional blocks

section-name =
    .activity = Ulaon
    .aside = Sisipan
    .cascade = Kaskade
    .definition = Definisi
    .example = Umpama
    .exercise = Latihan
    .exercises = Latihan
    .given-answer = Alus
    .note = Catatan
    .objectives = Tujuan
    .paragraphs = Paragraf
    .part = Bagian
    .problem = Soal
    .problems = Soal
    .proof = Bukti
    .question = Sungkun-sungkun
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
hint-title = Panuturi


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

paginator-previous = Na jolo
paginator-next = Na pudi
paginator-page = Halaman
paginator-page-status = { $pageLabel } { $currentPage } sian { $numPages }


## Piecewise functions

piecewise-condition-or = manang
piecewise-condition-if = molo
piecewise-condition-otherwise = na asing i


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent; see the
## header. These three are frames rather than vocabulary, so they are
## translated whether or not the names ever are.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Simbol kimia na sala
chemistry-invalid-ionic-compound = Senyawa ionik na sala


## Inputs embedded in math

math-embedded-input-blank = lowong
math-embedded-input-blank-ordinal = lowong paha-{ $ordinal } sian { $total }

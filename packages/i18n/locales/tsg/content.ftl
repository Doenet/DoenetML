# Tausug content catalog: the prose the core computes into the document.
# Selected by `documentLocale` — the language the activity was written in.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Tausug** (Bahasa Sūg) of the Sulu archipelago, Zamboanga, Basilan and
# Sabah, written in the **Latin** orthography of Philippine schoolbooks and
# dictionaries rather than in Sulat Sūg, the Jawi-derived Arabic script that
# is the language's older tradition. `locales/tsg/chrome.ftl` argues that
# choice and states the spelling rules — three vowels, the apostrophe for the
# glottal stop, doubled consonants for length, and loanwords kept in the
# spelling of the language they came from.
#
# **WORD ORDER, AND WHY IT IS NOT THE ONE ITS TWO NEIGHBOURS IN THIS BATCH
# USE.** The describing words come **in front of** the noun and every join is
# the linker **«nga»**: "thick dashed red line" is «makapal nga pinutu'-putu'
# nga pula nga linya» — width, dash pattern, colour, then the noun, which is
# English's order among the adjectives. `locales/iba` and `locales/dtp` both
# put their adjectives behind the noun; Tausug does not, and a reviewer should
# not "fix" this file to match them.
#
# **«nga» IS A FREE WORD IN EVERY POSITION.** It never contracts onto what
# precedes it, so it can be written before and after a placeable without
# knowing what lands there — the escape the Bisayan catalogs already take (see
# "A ligature is an affix too" in the package README). Every «nga» in
# `style-stroke`, `style-with-noun` and `style-filled-with-noun` is there for
# that reason. Where a description is a single word, no linker is written,
# because there is nothing to link it to yet — the linker before the noun is
# supplied by `style-with-noun`.
#
# The side count folds into the head — «regular nga polygon nga taga 5 sisi» —
# so `[tail]` is empty.
#
# GENDER AND NUMBER. Tausug has no grammatical gender and does not inflect a
# describing word to agree with its noun, so `$gender` and `$role` are
# received and ignored, as in English. A noun after a numeral takes no
# «manga» and no other marking. Tausug has no article; «in» is a topic marker
# and not one, so the two `-article` branches read like the ones without.
#
# **THE MATHEMATICS IS THE CLASSROOM'S, AND THE CLASSROOM IS PHILIPPINE.**
# The shape names are the **Spanish-derived forms that reached Tausug through
# Filipino** and are in ordinary use — «sirkulo», «rombo», «triyanggulo»,
# «rektanggulo», «kuwadrado», «parabola». The terms with no such form are
# **kept in English whole**, because that is the word a Tausug pupil meets:
# `slope field`, `vector field`, `polyline`, `polygon`, `vector`, `function`.
# Writing a Tausug-looking respelling of those would invent a word rather than
# report one.
#
# WHAT IS TAUSUG HERE. «itum», «puti'», «pula», «gaddung», «makapal»,
# «manipis»; «titik» for the point and «lugal» for the region; «napnu'» for
# filled and «di' napnu'» for unfilled; «kilid» for a border; «atawa», «bang»,
# «bang bukun», «iban», «dayn ha», «awn», «way»; «sambag» for the answer,
# «ladawan» for the figure, «pangasubu» for the question, «bunnal» for true.
#
# CONFIDENCE. The colour list is the thinnest part of the file. «kahil»
# (orange) is the citrus fruit and is a reach for the colour; «rusas» (pink)
# and «cuklat» (brown) are loans a speaker uses rather than Tausug words;
# «abu-abu» (gray) and «ungu» (purple) are the Malay-layer forms, and a
# speaker may prefer the Filipino ones. «biru gaddung» for cyan is a
# description, not a term.
#
# CHEMISTRY. `element-name` and `element-anion-name` are deliberately **left
# out**, so their ~130 keys fall back to English. This is the case
# `locales/fil` and `locales/ceb` already record: the Philippines teaches
# science in English from the intermediate grades, so the fallback **is** the
# curriculum, and a Tausug pupil meets the periodic table in the same English
# the fallback supplies. The frames around the names are translated, because
# they are frames rather than vocabulary.


## Style vocabulary

color =
    .black = itum
    .white = puti'
    .gray = abu-abu
    .red = pula
    .orange = kahil
    .yellow = kuning
    .green = gaddung
    .cyan = biru gaddung
    .blue = biru
    .purple = ungu
    .pink = rusas
    .brown = cuklat
line-width =
    .thick = makapal
    .thin = manipis
line-style =
    .dashed = pinutu'-putu'
    .dotted = titik-titik
# Noun phrases: they follow «iban» and modify nothing themselves. «manga» is
# the plural marker.
fill-style =
    .horizontal = manga linya nga horizontal
    .vertical = manga linya nga vertical
    .diagonal = manga linya nga diagonal
    .backdiagonal = manga linya nga diagonal pabalik
    .dots = manga titik
    .diamonds = manga rombo
noun =
    .line = linya
    .line-segment = bahagi' sin linya
    .ray = sinag
    .vector = vector
    .curve = kurba
    .function = function
    .slope-field = slope field
    .vector-field = vector field
    .parabola = parabola
    .polyline = polyline
    .polygon = polygon
    .triangle = triyanggulo
    .rectangle = rektanggulo
    .circle = sirkulo
    .region = lugal
    .point = titik
    .square = kuwadrado
    .diamond = rombo
    .cross = kurus
    .plus = plus
# «taga» — "having" — has to stay beside the number counting the sides, so the
# count folds into the head and there is no tail.
noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] regular nga polygon nga taga { $numSides } sisi
    }
# Tausug has no grammatical gender, so every noun answers the same and the
# answer goes unused.
noun-gender = neuter


## Style composition

style-stroke =
    { $parts ->
        [width-style-color] { $width } nga { $lineStyle } nga { $color }
        [width-color] { $width } nga { $color }
        [style-color] { $lineStyle } nga { $color }
        [width-style] { $width } nga { $lineStyle }
        [width] { $width }
        [style] { $lineStyle }
       *[color] { $color }
    }
# The describing words lead and the linker joins them to the noun: «makapal
# nga pula nga linya».
style-with-noun =
    { $parts ->
        [noun-tail] { $description } nga { $noun } { $nounTail }
       *[noun] { $description } nga { $noun }
    }
style-filled-word = napnu'
# «iban» carries English's "with"; «iban isab» — "and also" — is what chains a
# further clause on, which is the only thing separating the `[and]` branches
# below from the `[with]` ones.
style-filled =
    { $parts ->
        [pattern] { $filled } nga { $color } iban { $pattern }
       *[plain] { $filled } nga { $color }
    }
style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } nga { $color } nga { $noun } iban { $pattern }
        [plain-tail] { $filled } nga { $color } nga { $noun } { $nounTail }
        [pattern-tail] { $filled } nga { $color } nga { $noun } { $nounTail } iban { $pattern }
       *[plain] { $filled } nga { $color } nga { $noun }
    }
# Tausug has no article, so the `-article` branches read like the ones
# without.
style-border-clause =
    { $parts ->
        [with-article] iban { $border } nga kilid
        [and] iban isab { $border } nga kilid
        [and-article] iban isab { $border } nga kilid
       *[with] iban { $border } nga kilid
    }
style-fill =
    { $parts ->
        [pattern] { $color } nga { $pattern }
       *[plain] { $color }
    }
style-unfilled = di' napnu'
style-text =
    { $parts ->
        [background] { $color } iban { $background } nga likuran
       *[plain] { $color }
    }
# «way» is Tausug's "there is none", the negative counterpart of «awn».
style-background-none = way


## Boolean words

boolean-true = bunnal
boolean-false = bukun bunnal


## Answer buttons

answer-submit-label = Pariksa in Hinang
answer-submit-label-no-correctness = Papasampay in Sambag


## Sectional blocks
##
## Tausug does not mark number on a noun, so `.exercise` and `.exercises`, and
## `.problem` and `.problems`, are the same word. «Ma'na», «Misalan» and
## «Parakala'» are the Arabic layer; «Seksyon», «Solusyon» and «Teorema» are
## the Filipino one, kept in Filipino spelling for the reason the header
## gives.

section-name =
    .activity = Hinang
    .aside = Sulat ha Kilid
    .cascade = Cascade
    .definition = Ma'na
    .example = Misalan
    .exercise = Pagsanay
    .exercises = Pagsanay
    .given-answer = Sambag
    .note = Nuta
    .objectives = Manga Tuyu'
    .paragraphs = Manga Parapo
    .part = Bahagi'
    .problem = Parakala'
    .problems = Parakala'
    .proof = Bukti
    .question = Pangasubu
    .section = Seksyon
    .solution = Solusyon
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
hint-title = Panuntun


## Tables and figures

table-name =
    { $parts ->
        [numbered] Talaan { $enumeration }
        [numbered-title] Talaan { $enumeration }{ ": " }
        [unnumbered-title] Talaan{ ": " }
       *[unnumbered] Talaan
    }
figure-name =
    { $parts ->
        [numbered] Ladawan { $enumeration }
        [numbered-caption] Ladawan { $enumeration }{ ": " }
        [unnumbered-caption] Ladawan{ ": " }
       *[unnumbered] Ladawan
    }


## Paginator controls

paginator-previous = Nakauna
paginator-next = Sumunud
paginator-page = Pahina
paginator-page-status = { $pageLabel } { $currentPage } dayn ha { $numPages }


## Piecewise functions

piecewise-condition-or = atawa
piecewise-condition-if = bang
piecewise-condition-otherwise = bang bukun


## Chemistry
##
## `element-name` and `element-anion-name` are deliberately absent; see the
## header for why. These three are frames rather than vocabulary, so they are
## translated whether or not the names ever are.

ion-name-oxidation-state = { $name } ({ $numeral })
chemistry-invalid-symbol = Sala' nga Simbul Kimika
chemistry-invalid-ionic-compound = Sala' nga Ionic Compound


## Inputs embedded in math

math-embedded-input-blank = lu'ang
math-embedded-input-blank-ordinal = lu'ang { $ordinal } dayn ha { $total }

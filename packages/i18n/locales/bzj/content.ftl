# Belize Kriol (Bileez Kriol) content catalog: the prose the core computes into
# the document. Selected by `documentLocale` — the language the activity was
# written in. Translated from `locales/en/content.ftl`, which is the source of
# truth.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The phonemic orthography of the Belize Kriol Council /
# National Kriol Council of Belize — long vowels doubled («chrii», «griin»),
# «ch» for English *tr-* and «j» for English *dr-* («chraiangl», «jraa»), «k»
# for hard *c*, no apostrophes and no silent letters. The English-based ad-hoc
# spelling that most Belizeans write day to day is **not used anywhere in
# these four files** and must not be mixed into them; `chrome.ftl`'s header
# sets the system out point by point. A reviewer who prefers the English-based
# spelling should respell rather than retranslate.
#
# **Word order: the modifier comes before the noun.** Kriol puts an
# attributive adjective in front of its head, as English does — «wan tik red
# lain» is *a thick red line*, in that order. So every composition message
# here **keeps the English order**: `style-with-noun` puts the description
# first and the noun after it, `style-stroke` runs width, then dash pattern,
# then colour, and `noun-regular-polygon` folds the side count into the head
# with no tail, exactly as English does. Nothing in this file reverses.
#
# **No grammatical gender and no agreement.** Kriol adjectives do not inflect
# for anything: there is no gender, no number agreement and no case. So no
# message here forks on `$gender` or on `$role`, and `noun-gender` answers a
# single token that nothing reads.
#
# **Number.** `Intl.PluralRules("bzj")` has no CLDR data for `bzj` and falls
# back to English's `['one', 'other']`, which is not a fact about Kriol. A
# Kriol noun after a numeral is unmarked — «chree paint», never a pluralized
# noun; the plural is the postposed «dehn», used when a noun is definite
# rather than when it is counted. So **nothing in this file selects on a
# count**: where English writes a `[one]`/`[other]` select, this file writes
# one unselected form.
#
# **The chemistry tables are deliberately absent.** `element-name` and
# `element-anion-name` are the only English keys this file does not cover.
# Science in Belize is schooled in English, from English textbooks and to an
# English-language examination; there is no Kriol periodic table in use and no
# settled Kriol spelling for the hundred and eighteen names. Respelling the
# English list into Kriol phonology would be inventing a nomenclature, not
# recording one. `lint:i18n` reports the two keys as missing coverage, and
# that report is correct: they fall back to English, which is what a Belizean
# science classroom uses anyway.
#
# **Loans.** The mathematical vocabulary is English carried in Kriol
# orthography and Kriol grammar: «vekta», «fongshan», «parabola», «paligan»,
# «palilain», «rektangl», «matriks», «definishan», «tiorem», «egzampl»,
# «sekshan», «soalushan», «paragraf», «kaskayd», «kemikal», «ayanik». Where
# Kriol has its own word it is used — «lain», «paint», «kerv», «serkl»,
# «skweh», «daiman», «kraas», «baada», «bakgrong», «ful». Six colour names —
# «arinj», «sayan», «perpl», «pink», «brong», «gray» — are respelled English
# and are the least certain entries here.


color =
    .black = blak
    .white = wait
    .gray = gray
    .red = red
    .orange = arinj
    .yellow = yela
    .green = griin
    .cyan = sayan
    .blue = bloo
    .purple = perpl
    .pink = pink
    .brown = brong

line-width =
    .thick = tik
    .thin = tin

line-style =
    .dashed = dash-dash
    .dotted = dat-dat

fill-style =
    .horizontal = lain weh gaan akraas
    .vertical = lain weh gaan op ahn dong
    .diagonal = lain weh gaan kaana
    .backdiagonal = lain weh gaan di ada kaana
    .dots = dat
    .diamonds = daiman

noun =
    .line = lain
    .line-segment = pees a lain
    .ray = ray
    .vector = vekta
    .curve = kerv
    .function = fongshan
    .slope-field = sloap fiil
    .vector-field = vekta fiil
    .parabola = parabola
    .polyline = palilain
    .polygon = paligan
    .triangle = chraiangl
    .rectangle = rektangl
    .circle = serkl
    .region = riijan
    .point = paint
    .square = skweh
    .diamond = daiman
    .cross = kraas
    .plus = plos

noun-regular-polygon =
    { $part ->
        [tail] { "" }
       *[head] reglar paligan wid { $numSides } said
    }

noun-gender = neuter


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
        [noun-tail] { $description } { $noun } { $nounTail }
       *[noun] { $description } { $noun }
    }

style-filled-word = ful

style-filled =
    { $parts ->
        [pattern] { $filled } { $color } wid { $pattern }
       *[plain] { $filled } { $color }
    }

style-filled-with-noun =
    { $parts ->
        [pattern] { $filled } { $color } { $noun } wid { $pattern }
        [plain-tail] { $filled } { $color } { $noun } { $nounTail }
        [pattern-tail] { $filled } { $color } { $noun } { $nounTail } wid { $pattern }
       *[plain] { $filled } { $color } { $noun }
    }

style-border-clause =
    { $parts ->
        [with-article] wid wan { $border } baada
        [and] ahn { $border } baada
        [and-article] ahn wan { $border } baada
       *[with] wid { $border } baada
    }

style-fill =
    { $parts ->
        [pattern] { $color } { $pattern }
       *[plain] { $color }
    }

style-unfilled = noh ful

style-text =
    { $parts ->
        [background] { $color } wid wan { $background } bakgrong
       *[plain] { $color }
    }

style-background-none = non


boolean-true = chruu
boolean-false = faals


answer-submit-label = Chek di Wok

answer-submit-label-no-correctness = Sen di Rispans


section-name =
    .activity = Aktiviti
    .aside = Said Noat
    .cascade = Kaskayd
    .definition = Definishan
    .example = Egzampl
    .exercise = Egzasaiz
    .exercises = Egzasaiz
    .given-answer = Ansa
    .note = Noat
    .objectives = Objektiv
    .paragraphs = Paragraf
    .part = Paat
    .problem = Prablem
    .problems = Prablem
    .proof = Pruuf
    .question = Kweschan
    .section = Sekshan
    .solution = Soalushan
    .task = Taask
    .theorem = Tiorem

section-title-prefix =
    { $parts ->
        [name] { $sectionName }
        [number] { $sectionNumber }
        [name-title] { $sectionName }{ ": " }
        [number-title] { $sectionNumber }{ ". " }
        [name-number-title] { $sectionName } { $sectionNumber }{ ": " }
       *[name-number] { $sectionName } { $sectionNumber }
    }

hint-title = Hint


table-name =
    { $parts ->
        [numbered] Taybl { $enumeration }
        [numbered-title] Taybl { $enumeration }{ ": " }
        [unnumbered-title] Taybl{ ": " }
       *[unnumbered] Taybl
    }

figure-name =
    { $parts ->
        [numbered] Figa { $enumeration }
        [numbered-caption] Figa { $enumeration }{ ": " }
        [unnumbered-caption] Figa{ ": " }
       *[unnumbered] Figa
    }


paginator-previous = Bak
paginator-next = Neks
paginator-page = Payj

paginator-page-status = { $pageLabel } { $currentPage } outa { $numPages }


piecewise-condition-or = ar

piecewise-condition-if = if

piecewise-condition-otherwise = if noh soh


ion-name-oxidation-state = { $name } ({ $numeral })

chemistry-invalid-symbol = Di Kemikal Simbal Noh Gud
chemistry-invalid-ionic-compound = Di Ayanik Kompoun Noh Gud


math-embedded-input-blank = blangk

math-embedded-input-blank-ordinal = blangk { $ordinal } outa { $total }
